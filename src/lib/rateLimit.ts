import { NextResponse } from "next/server";

type RateLimitStore = {
  count: number;
  resetTime: number;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfterSeconds: number;
};

const store = new Map<string, RateLimitStore>();
let lastCleanup = 0;

const MAX_KEYS_BEFORE_CLEANUP = 10000;
const CLEANUP_INTERVAL_MS = 60000;

function cleanupExpired(now: number) {
  if (store.size < MAX_KEYS_BEFORE_CLEANUP && now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }

  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }

  lastCleanup = now;
}

function sanitizeIdentifier(value: string) {
  return value.replace(/[^\w:.-]/g, "").slice(0, 128) || "unknown";
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  return sanitizeIdentifier(forwardedFor || realIp || cfIp || "unknown");
}

export function getUserAgent(request: Request) {
  return (request.headers.get("user-agent") || "missing").slice(0, 256);
}

export function isLikelyAutomatedRequest(request: Request) {
  const userAgent = getUserAgent(request);
  return (
    userAgent === "missing" ||
    /(?:curl|wget|python-requests|aiohttp|scrapy|httpclient|bot|spider|crawler)/i.test(userAgent)
  );
}

export function rateLimit(identifier: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const safeLimit = Math.max(1, limit);
  const safeWindowMs = Math.max(1000, windowMs);
  const key = sanitizeIdentifier(identifier);
  const record = store.get(key);

  if (!record || now > record.resetTime) {
    const resetTime = now + safeWindowMs;
    store.set(key, { count: 1, resetTime });
    return {
      success: true,
      limit: safeLimit,
      remaining: safeLimit - 1,
      resetTime,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= safeLimit) {
    return {
      success: false,
      limit: safeLimit,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfterSeconds: Math.max(1, Math.ceil((record.resetTime - now) / 1000)),
    };
  }

  record.count += 1;
  store.set(key, record);

  return {
    success: true,
    limit: safeLimit,
    remaining: Math.max(0, safeLimit - record.count),
    resetTime: record.resetTime,
    retryAfterSeconds: 0,
  };
}

export function checkRateLimit(scope: string, identifiers: string[], limit: number, windowMs: number) {
  const keys = identifiers.length > 0 ? identifiers : ["global"];
  let lastResult: RateLimitResult | null = null;

  for (const identifier of keys) {
    const result = rateLimit(`${scope}:${identifier}`, limit, windowMs);
    lastResult = result;
    if (!result.success) {
      return result;
    }
  }

  return lastResult ?? rateLimit(`${scope}:global`, limit, windowMs);
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "Retry-After": String(result.retryAfterSeconds),
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
  };
}

export function rateLimitResponse(message: string, result: RateLimitResult) {
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: rateLimitHeaders(result),
    },
  );
}