import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAiUsage } from "@/lib/aiUsage";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";
import { logApiError, logSecurityEvent } from "@/lib/securityLogger";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const ip = getClientIp(request);

  try {
    const ipLimit = checkRateLimit("api:usage:ip", [ip], 120, 60000);
    if (!ipLimit.success) {
      logSecurityEvent("usage_rate_limited_ip", request, { ip }, "warn");
      return rateLimitResponse("Too many requests. Please try again later.", ipLimit);
    }

    const { userId } = await auth();
    if (!userId) {
      logSecurityEvent("usage_unauthorized", request, { ip }, "warn");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userLimit = checkRateLimit("api:usage:user", [userId], 60, 60000);
    if (!userLimit.success) {
      logSecurityEvent("usage_rate_limited_user", request, { userId }, "warn");
      return rateLimitResponse("Too many requests. Please try again later.", userLimit);
    }

    const usage = await getAiUsage(userId);

    return NextResponse.json({
      request_count: usage.requestCount,
      remaining: usage.remaining,
      limit: usage.limit,
    });
  } catch (error: unknown) {
    logApiError("usage_api_error", error, request, { ip });
    return NextResponse.json({ error: "Failed to get usage limit." }, { status: 500 });
  }
}