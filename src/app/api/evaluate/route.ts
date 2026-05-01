import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const evaluateSchema = z.object({
  code: z.string().min(1, "Code is required.").max(50000),
  questionNumber: z.number().int().positive().optional(),
  weekId: z.number().int().positive().optional(),
  prompt: z.string().optional(),
  questionTitle: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  maxScore: z.number().int().positive().optional(),
});

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

function safeErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Failed to evaluate code.";
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    const rateLimitResult = rateLimit(`evaluate_${ip}`, 10, 60000); // 10 evals per minute

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many evaluations requested. Please wait a moment." },
        { status: 429 }
      );
    }

    const rawBody = await request.json();
    const parsed = evaluateSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload: " + parsed.error.issues[0].message }, { status: 400 });
    }

    const body = parsed.data;
    const code = body.code.trim();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase configuration missing." }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const today = new Date().toISOString().split('T')[0];

    const { data: usageData, error: usageError } = await supabase
      .from("user_ai_usage")
      .select("request_count")
      .eq("user_id", userId)
      .eq("usage_date", today)
      .single();

    if (usageError && usageError.code !== "PGRST116") {
      console.error("Supabase usage check error:", usageError);
      return NextResponse.json({ error: "Failed to check usage limits." }, { status: 500 });
    }

    const requestCount = usageData?.request_count || 0;

    if (requestCount >= 10) {
      return NextResponse.json(
        { error: "You have reached your free limit for today. Please come back tomorrow to keep learning!" },
        { status: 429 }
      );
    }

    if (usageData) {
      await supabase
        .from("user_ai_usage")
        .update({ request_count: requestCount + 1 })
        .eq("user_id", userId)
        .eq("usage_date", today);
    } else {
      await supabase
        .from("user_ai_usage")
        .insert({ user_id: userId, usage_date: today, request_count: 1 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY is not set in .env.local" }, { status: 500 });
    }

    const maxScore = typeof body.maxScore === "number" && body.maxScore > 0 ? body.maxScore : 1;

    const completionResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://varsiti.xyz",
        "X-Title": "Varsiti",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        models: [
          "google/gemini-2.0-flash-exp:free",
          "qwen/qwen-2.5-coder-32b-instruct:free",
          "meta-llama/llama-3-8b-instruct:free",
          "mistralai/mistral-7b-instruct:free",
          "google/gemini-1.5-flash:free",
        ],
        messages: [
          {
            role: "system",
            content:
              "You are a C++ expert evaluator. Always respond with raw valid JSON only. Never include markdown fences.",
          },
          {
            role: "user",
            content: buildPrompt({
              code,
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
    });

    if (!completionResponse.ok) {
      const errorText = await completionResponse.text();
      console.error("OpenRouter API error:", errorText);
      throw new Error(`OpenRouter API responded with status ${completionResponse.status}`);
    }

    const completion = await completionResponse.json();
    const responseText = completion.choices?.[0]?.message?.content || "";
    const cleanJson = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(cleanJson) as EvaluateResponse;
      const safeScore =
        typeof parsed.score === "number" ? Math.max(0, Math.min(maxScore, parsed.score)) : undefined;

      return NextResponse.json({
        status: parsed.status || "incorrect",
        feedback: parsed.feedback || "No feedback returned.",
        expectedOutput: parsed.expectedOutput || "",
        score: safeScore,
        maxScore: typeof parsed.maxScore === "number" ? parsed.maxScore : maxScore,
      });
    } catch {
      return NextResponse.json({
        status: "incorrect",
        feedback: cleanJson || "The evaluator returned an unreadable response.",
        expectedOutput: "",
        score: 0,
        maxScore,
      });
    }
  } catch (error: unknown) {
    console.error("Evaluation error:", error);
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 500 });
  }
}
