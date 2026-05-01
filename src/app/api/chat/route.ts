import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const CHAT_TIMEOUT_MS = 30000;

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(5000),
    })
  ).min(1).max(50),
});

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
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const rateLimitResult = rateLimit(`chat_${ip}`, 10, 60000); // 10 messages per minute

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

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

    const messages = parsed.data.messages;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY is not set in .env.local" }, { status: 500 });
    }

    // Build messages array for OpenRouter (OpenAI-compatible format)
    const openRouterMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const fetchPromise = fetch("https://openrouter.ai/api/v1/chat/completions", {
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
        messages: openRouterMessages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    const completionResponse = await Promise.race([
      fetchPromise,
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error("AI request timed out. Please try again.")), CHAT_TIMEOUT_MS)
      ),
    ]);

    if (!completionResponse.ok) {
      const errorText = await completionResponse.text();
      console.error("OpenRouter API error:", errorText);
      throw new Error(`OpenRouter API responded with status ${completionResponse.status}`);
    }

    const completion = await completionResponse.json();

    const reply = completion.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";
    return NextResponse.json({ reply });

  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to get AI response.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
