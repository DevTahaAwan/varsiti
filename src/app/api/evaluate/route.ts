import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { checkRateLimit, getClientIp, isLikelyAutomatedRequest, rateLimitResponse } from "@/lib/rateLimit";
import { parseJsonRequest } from "@/lib/requestValidation";
import { getOpenRouterEnv, ServerConfigurationError } from "@/lib/serverEnv";
import { logApiError, logSecurityEvent } from "@/lib/securityLogger";

export const runtime = "nodejs";

const EVALUATE_TIMEOUT_MS = 30000;

const evaluateSchema = z
  .object({
    code: z.string().trim().min(1, "Code is required.").max(50000),
    questionNumber: z.number().int().positive().max(500).optional(),
    weekId: z.number().int().positive().max(52).optional(),
    prompt: z.string().trim().max(6000).optional(),
    questionTitle: z.string().trim().max(200).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    maxScore: z.number().int().positive().max(100).optional(),
  })
  .strict();

type EvaluateRequest = z.infer<typeof evaluateSchema>;

type EvaluateResponse = {
  status: "correct" | "incorrect" | "partial" | "error";
  feedback: string;
  expectedOutput?: string;
  score?: number;
  maxScore?: number;
};

function buildPrompt({
  code,
  questionNumber,
  weekId,
  prompt,
  questionTitle,
  difficulty,
  maxScore,
}: Required<Pick<EvaluateRequest, "code">> & Omit<EvaluateRequest, "code">) {
  const safeMaxScore = typeof maxScore === "number" && maxScore > 0 ? maxScore : 1;
  const safeDifficulty = difficulty || "easy";

  return `You are a strict but encouraging C++ OOP examiner for the Varsiti learning platform.

Score the student's answer out of ${safeMaxScore} marks.

Week: ${weekId ?? "unknown"}
Question number: ${questionNumber ?? "unknown"}
Question title: ${questionTitle ?? "Practice Question"}
Difficulty: ${safeDifficulty}

Question prompt:
${prompt || "Evaluate whether the solution is valid and aligned with the intended C++ OOP concept."}

Student code:
\`\`\`cpp
${code}
\`\`\`

Evaluate based on:
1. Whether the code addresses the prompt correctly
2. C++ syntax and structure
3. OOP correctness and design
4. Output expectations when relevant
5. Serious logic or memory issues

Return ONLY raw JSON with this exact shape:
{"status":"correct","feedback":"short feedback","expectedOutput":"optional","score":${safeMaxScore},"maxScore":${safeMaxScore}}

Scoring rules:
- Use "correct" only for a strong full-mark answer
- Use "partial" for partly correct answers that deserve some marks
- Use "incorrect" for answers that miss the goal or are seriously broken
- Keep score between 0 and ${safeMaxScore}
- Include expectedOutput only when it genuinely helps explain the result`;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  try {
    const ipLimit = checkRateLimit("api:evaluate:ip", [ip], 20, 60000);
    if (!ipLimit.success) {
      logSecurityEvent("evaluate_rate_limited_ip", request, { ip }, "warn");
      return rateLimitResponse("Too many evaluations requested. Please wait a moment.", ipLimit);
    }

    if (isLikelyAutomatedRequest(request)) {
      const automationLimit = checkRateLimit("api:evaluate:automated", [ip], 5, 60000);
      if (!automationLimit.success) {
        logSecurityEvent("evaluate_automated_rate_limited", request, { ip }, "warn");
        return rateLimitResponse("Too many automated requests.", automationLimit);
      }
    }

    const { userId } = await auth();
    if (!userId) {
      logSecurityEvent("evaluate_unauthorized", request, { ip }, "warn");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userLimit = checkRateLimit("api:evaluate:user", [userId], 10, 60000);
    if (!userLimit.success) {
      logSecurityEvent("evaluate_rate_limited_user", request, { userId }, "warn");
      return rateLimitResponse("Too many evaluations requested. Please wait a moment.", userLimit);
    }

    const parsed = await parseJsonRequest(request, evaluateSchema, { maxBytes: 64000 });
    if (!parsed.success) {
      return parsed.response;
    }

    const body = parsed.data;
    const maxScore = typeof body.maxScore === "number" && body.maxScore > 0 ? body.maxScore : 1;

    // Call the atomic RPC function
    const today = new Date().toISOString().slice(0, 10);

    const supabase = getSupabaseAdmin();
    const { data: usageData, error: usageError } = await supabase.rpc("increment_ai_usage", {
      p_user_id: userId,
      p_usage_date: today,
      p_limit: 10,
    });

    if (usageError) {
      console.error("Supabase RPC error:", usageError);
      return NextResponse.json({ error: "Failed to verify usage limits." }, { status: 500 });
    }

    // The RPC returns an array with one object, e.g., [{ allowed: true, request_count: 5, remaining: 5 }]
    const result = usageData?.[0];

    if (!result || !result.allowed) {
      return NextResponse.json(
        { error: "You have reached your free limit for today. Please come back tomorrow to keep learning!" },
        { status: 429 }
      );
    }

    const { openRouterApiKey, appUrl } = getOpenRouterEnv();

    const fetchPromise = fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": appUrl,
        "X-Title": "Varsiti",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        models: ["openai/gpt-oss-120b:free", "google/gemma-4-31b-it:free", "qwen/qwen3-coder:free"],
        messages: [
          {
            role: "system",
            content: "You are a C++ expert evaluator. Always respond with raw valid JSON only. Never include markdown fences.",
          },
          {
            role: "user",
            content: buildPrompt({
              code: body.code,
              questionNumber: body.questionNumber,
              weekId: body.weekId,
              prompt: body.prompt,
              questionTitle: body.questionTitle,
              difficulty: body.difficulty,
              maxScore,
            }),
          },
        ],
        temperature: 0.2,
        max_tokens: 700,
      }),
      cache: "no-store",
    });

    const completionResponse = await Promise.race([
      fetchPromise,
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error("AI request timed out.")), EVALUATE_TIMEOUT_MS),
      ),
    ]);

    if (!completionResponse.ok) {
      const errorText = await completionResponse.text();
      logSecurityEvent(
        "openrouter_evaluate_failed",
        request,
        { userId, status: completionResponse.status, providerMessage: errorText.slice(0, 500) },
        "error",
      );
      return NextResponse.json({ error: "AI service is unavailable right now." }, { status: 502 });
    }

    const completion = (await completionResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const responseText = completion.choices?.[0]?.message?.content || "";
    const cleanJson = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      const evaluated = JSON.parse(cleanJson) as EvaluateResponse;
      const safeScore =
        typeof evaluated.score === "number" ? Math.max(0, Math.min(maxScore, evaluated.score)) : undefined;

      return NextResponse.json({
        status: evaluated.status || "incorrect",
        feedback: evaluated.feedback || "No feedback returned.",
        expectedOutput: evaluated.expectedOutput || "",
        score: safeScore,
        maxScore: typeof evaluated.maxScore === "number" ? evaluated.maxScore : maxScore,
        usage: { remaining: result.remaining, limit: 10 },
      });
    } catch {
      return NextResponse.json({
        status: "incorrect",
        feedback: cleanJson || "The evaluator returned an unreadable response.",
        expectedOutput: "",
        score: 0,
        maxScore,
        usage: { remaining: result.remaining, limit: 10 },
      });
    }
  } catch (error: unknown) {
    logApiError("evaluate_api_error", error, request, { ip });
    return NextResponse.json(
      { error: error instanceof ServerConfigurationError ? "Server configuration error." : "Failed to evaluate code." },
      { status: 500 },
    );
  }
}