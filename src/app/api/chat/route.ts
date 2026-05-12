import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages, UIMessage } from 'ai';

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

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const modelMessages = await convertToModelMessages(messages);

  // Try Groq first, fall back to OpenRouter
  const useGroq = async () => {
    const result = streamText({
      model: groq('llama-3.1-8b-instant'),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
    });
    return result.toUIMessageStreamResponse({
      onError: (error) => {
        if (error instanceof Error) return error.message;
        return 'An error occurred with the AI provider.';
      },
    });
  };

  const useOpenRouter = async () => {
    const result = streamText({
      model: openrouter('meta-llama/llama-3.1-8b-instruct:free'),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
    });
    return result.toUIMessageStreamResponse({
      onError: (error) => {
        if (error instanceof Error) return error.message;
        return 'An error occurred with the fallback AI provider.';
      },
    });
  };

  try {
    return await useGroq();
  } catch (error) {
    console.error('Groq failed, falling back to OpenRouter:', error);
    try {
      return await useOpenRouter();
    } catch (fallbackError) {
      console.error('OpenRouter fallback also failed:', fallbackError);
      return new Response(
        JSON.stringify({ error: 'All AI providers failed. Please try again later.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}