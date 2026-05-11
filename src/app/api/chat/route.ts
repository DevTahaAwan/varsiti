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
    // ATTEMPT 1: GROQ (Must use a valid Groq model like Llama 3.1)
    const result = await streamText({
      model: groq('llama-3.1-8b-instant'), 
      system: SYSTEM_PROMPT,
      messages,
    });
    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error("Groq attempt failed, falling back to OpenRouter:", error);
    
    // ATTEMPT 2: OPENROUTER (Using the requested model)
    try {
      const fallbackResult = await streamText({
        model: openrouter('openai/gpt-oss-120b'),
        system: SYSTEM_PROMPT,
        messages,
      });
      return fallbackResult.toTextStreamResponse();
      
    } catch (fallbackError) {
      console.error("OpenRouter fallback also failed:", fallbackError);
      return new Response("Error connecting to AI providers.", { status: 500 });
    }
  }
}