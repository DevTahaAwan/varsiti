import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const maxDuration = 60;
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    // Attempt 1: Groq for speed
    const result = await streamText({
      model: groq('openai/gpt-oss-120b'),
      system: SYSTEM_PROMPT,
      messages,
    });
    return result.toTextStreamResponse();
  } catch (error) {
    // Attempt 2: Fallback to OpenRouter if Groq fails
    const fallbackResult = await streamText({
      model: openrouter('meta-llama/llama-3-8b-instruct:free'),
      system: SYSTEM_PROMPT,
      messages,
    });
    return fallbackResult.toTextStreamResponse();
  }
}