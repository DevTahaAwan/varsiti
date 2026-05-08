import "server-only";

import { getClientIp, getUserAgent } from "@/lib/rateLimit";

type LogLevel = "info" | "warn" | "error";
type Metadata = Record<string, unknown>;

const SENSITIVE_KEY_PATTERN = /(authorization|cookie|secret|token|key|password|session|credential|api[_-]?key)/i;

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactValue);
  }

  if (value && typeof value === "object") {
    return redactMetadata(value as Metadata);
  }

  if (typeof value === "string") {
    return value.length > 500 ? `${value.slice(0, 500)}...` : value;
  }

  return value;
}

function redactMetadata(metadata: Metadata) {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [
      key,
      SENSITIVE_KEY_PATTERN.test(key) ? "[redacted]" : redactValue(value),
    ]),
  );
}

function writeLog(level: LogLevel, record: Metadata) {
  const line = JSON.stringify(record);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }
}

export function logSecurityEvent(
  event: string,
  request?: Request,
  metadata: Metadata = {},
  level: LogLevel = "info",
) {
  writeLog(level, {
    event,
    level,
    timestamp: new Date().toISOString(),
    ip: request ? getClientIp(request) : undefined,
    userAgent: request ? getUserAgent(request) : undefined,
    ...redactMetadata(metadata),
  });
}

export function logApiError(event: string, error: unknown, request?: Request, metadata: Metadata = {}) {
  logSecurityEvent(
    event,
    request,
    {
      ...metadata,
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage: error instanceof Error ? error.message : String(error),
    },
    "error",
  );
}