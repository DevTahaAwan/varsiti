import { NextResponse } from "next/server";
import { validateSuggestionPayload } from "@/lib/suggestionValidation";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

export async function POST(request: Request) {
  try {
    // Basic rate limit by IP (fallback to global if not available)
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    const rateLimitResult = rateLimit(`suggestion_${ip}`, 3, 60000); // 3 requests per minute

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const rawBody = await request.json();
    const validation = validateSuggestionPayload(rawBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Please review the form and try again.",
          fieldErrors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      return NextResponse.json(
        { error: "Email service is not configured on the server yet." },
        { status: 500 },
      );
    }

    const emailJsResponse = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000",
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          name: validation.data!.name,
          email: validation.data!.email,
          message: validation.data!.message,
          time: new Date().toLocaleString(),
          app_name: "Varsiti",
        },
      }),
      cache: "no-store",
    });

    if (!emailJsResponse.ok) {
      const details = await emailJsResponse.text();
      console.error("EmailJS send failed:", details);
      return NextResponse.json(
        { error: "Could not send your suggestion right now. Please try again shortly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, message: "Thanks! Your suggestion has been sent." });
  } catch (error: unknown) {
    console.error("Suggestion API error:", error);
    return NextResponse.json(
      { error: "Unexpected server error while sending suggestion." },
      { status: 500 },
    );
  }
}
