import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";

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

    const messages = parsed.data.messages;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not set in .env.local" }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    // Build messages array for Groq (OpenAI-compatible format)
    const groqMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "assistant" as const : "user" as const,
        content: m.content,
      })),
    ];

    const completion = await Promise.race([
      groq.chat.completions.create({
        model: "llama-3.3-70b-versatile", // Best free model for code
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("AI request timed out. Please try again.")), CHAT_TIMEOUT_MS)
      ),
    ]);

    const reply = completion.choices[0]?.message?.content || "Sorry, I could not generate a response.";
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
