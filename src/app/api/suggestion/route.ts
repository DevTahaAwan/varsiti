import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { suggestionSchema } from "@/lib/suggestionValidation";
import { checkRateLimit, getClientIp, isLikelyAutomatedRequest, rateLimitResponse } from "@/lib/rateLimit";
import { parseJsonRequest } from "@/lib/requestValidation";
import { getEmailJsEnv, ServerConfigurationError } from "@/lib/serverEnv";
import { logApiError, logSecurityEvent } from "@/lib/securityLogger";

export const runtime = "nodejs";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

export async function POST(request: Request) {
  const ip = getClientIp(request);

  try {
    const ipLimit = checkRateLimit("api:suggestion:ip", [ip], 10, 60000);
    if (!ipLimit.success) {
      logSecurityEvent("suggestion_rate_limited_ip", request, { ip }, "warn");
      return rateLimitResponse("Too many requests. Please try again later.", ipLimit);
    }

    if (isLikelyAutomatedRequest(request)) {
      const automationLimit = checkRateLimit("api:suggestion:automated", [ip], 3, 60000);
      if (!automationLimit.success) {
        logSecurityEvent("suggestion_automated_rate_limited", request, { ip }, "warn");
        return rateLimitResponse("Too many automated requests.", automationLimit);
      }
    }

    const { userId } = await auth();
    if (!userId) {
      logSecurityEvent("suggestion_unauthorized", request, { ip }, "warn");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userLimit = checkRateLimit("api:suggestion:user", [userId], 5, 60000);
    if (!userLimit.success) {
      logSecurityEvent("suggestion_rate_limited_user", request, { userId }, "warn");
      return rateLimitResponse("Too many requests. Please try again later.", userLimit);
    }

    const parsed = await parseJsonRequest(request, suggestionSchema, { maxBytes: 8000 });
    if (!parsed.success) {
      return parsed.response;
    }

    const { serviceId, templateId, publicKey, privateKey, appUrl } = getEmailJsEnv();

    const emailJsResponse = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: appUrl,
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          name: parsed.data.name,
          email: parsed.data.email,
          message: parsed.data.message,
          time: new Date().toISOString(),
          app_name: "Varsiti",
          user_id: userId,
        },
      }),
      cache: "no-store",
    });

    if (!emailJsResponse.ok) {
      const details = await emailJsResponse.text();
      logSecurityEvent(
        "emailjs_send_failed",
        request,
        { userId, status: emailJsResponse.status, providerMessage: details.slice(0, 500) },
        "error",
      );
      return NextResponse.json(
        { error: "Could not send your suggestion right now. Please try again shortly." },
        { status: 502 },
      );
    }

    logSecurityEvent("suggestion_sent", request, { userId });
    return NextResponse.json({ ok: true, message: "Thanks! Your suggestion has been sent." });
  } catch (error: unknown) {
    logApiError("suggestion_api_error", error, request, { ip });
    return NextResponse.json(
      {
        error:
          error instanceof ServerConfigurationError
            ? "Email service is not configured on the server yet."
            : "Unexpected server error while sending suggestion.",
      },
      { status: 500 },
    );
  }
}