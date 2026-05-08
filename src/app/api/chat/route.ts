import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { checkRateLimit, getClientIp, isLikelyAutomatedRequest, rateLimitResponse } from "@/lib/rateLimit";
import { parseJsonRequest } from "@/lib/requestValidation";
import { getOpenRouterEnv, ServerConfigurationError } from "@/lib/serverEnv";
import { logApiError, logSecurityEvent } from "@/lib/securityLogger";

export const runtime = "nodejs";

const CHAT_TIMEOUT_MS = 30000;

const chatSchema = z
  .object({
    messages: z
      .array(
        z
          .object({
            role: z.enum(["user", "assistant"]),
            content: z.string().trim().min(1).max(5000),
          })
          .strict(),
      )
      .min(1)
      .max(25),
  })
  .strict();

const SYSTEM_PROMPT = `You are Varsiti AI, a friendly and expert C++ tutor embedded in the Varsiti learning platform.

About Varsiti:
- Varsiti was founded and is led by Hafiz Muhammad Taha.
- He is a student of Lahore Garrison University (LGU), pursuing a Bachelor of Science in Computer Sciences (BSCS).
- Varsiti was created to help learners grow and excel in the AI and tech field.
- The platform helps students learn C++ from beginner to advanced level in a friendly, engaging, and entertaining way.

Your expertise:
- C++ OOP (classes, inheritance, polymorphism, encapsulation, abstraction)
- Data Structures & Algorithms in C++
- C++ fundamentals (pointers, memory, templates, STL)
- Code debugging and explanation
- Writing clean, well-commented C++ programs

Rules:
- Always wrap ALL C++ code in triple backtick code blocks tagged with "cpp": \`\`\`cpp ... \`\`\`
- Always use \`using namespace std;\` in your C++ solutions instead of prefixing standard library types and functions with \`std::\`.
- Be encouraging and student-friendly
- For code questions, provide complete, compilable programs
- Keep explanations concise but thorough
- If you detect a bug, point it out clearly`;

export async function POST(req: Request) {
  const ip = getClientIp(req);

  try {
    const ipLimit = checkRateLimit("api:chat:ip", [ip], 30, 60000);
    if (!ipLimit.success) {
      logSecurityEvent("chat_rate_limited_ip", req, { ip }, "warn");
      return rateLimitResponse("Too many chat requests. Please wait a moment.", ipLimit);
    }

    if (isLikelyAutomatedRequest(req)) {
      const automationLimit = checkRateLimit("api:chat:automated", [ip], 5, 60000);
      if (!automationLimit.success) {
        logSecurityEvent("chat_automated_rate_limited", req, { ip }, "warn");
        return rateLimitResponse("Too many automated requests.", automationLimit);
      }
    }

    const { userId } = await auth();
    if (!userId) {
      logSecurityEvent("chat_unauthorized", req, { ip }, "warn");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userLimit = checkRateLimit("api:chat:user", [userId], 12, 60000);
    if (!userLimit.success) {
      logSecurityEvent("chat_rate_limited_user", req, { userId }, "warn");
      return rateLimitResponse("Too many chat requests. Please wait a moment.", userLimit);
    }

    const parsed = await parseJsonRequest(req, chatSchema, { maxBytes: 100000 });
    if (!parsed.success) {
      return parsed.response;
    }

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

    const openRouterMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...parsed.data.messages.map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content,
      })),
    ];

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
        messages: openRouterMessages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
      cache: "no-store",
    });

    const completionResponse = await Promise.race([
      fetchPromise,
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error("AI request timed out.")), CHAT_TIMEOUT_MS),
      ),
    ]);

    if (!completionResponse.ok) {
      const errorText = await completionResponse.text();
      logSecurityEvent(
        "openrouter_chat_failed",
        req,
        { userId, status: completionResponse.status, providerMessage: errorText.slice(0, 500) },
        "error",
      );
      return NextResponse.json({ error: "AI service is unavailable right now." }, { status: 502 });
    }

    const completion = (await completionResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const reply = completion.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";
    return NextResponse.json({
      reply,
      usage: { remaining: result.remaining, limit: 10 },
    });
  } catch (error: unknown) {
    const status = error instanceof ServerConfigurationError ? 500 : 500;
    logApiError("chat_api_error", error, req, { ip });
    return NextResponse.json(
      { error: error instanceof ServerConfigurationError ? "Server configuration error." : "Failed to get AI response." },
      { status },
    );
  }
}
