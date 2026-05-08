import "server-only";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { logSecurityEvent } from "@/lib/securityLogger";

export const AI_DAILY_LIMIT = 10;

export type AiUsageState = {
  allowed: boolean;
  requestCount: number;
  remaining: number;
  limit: number;
  usageDate: string;
};

function usageDate() {
  return new Date().toISOString().slice(0, 10);
}

function asNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeRpcUsage(data: unknown, date: string): AiUsageState | null {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object") return null;

  const record = row as Record<string, unknown>;
  const requestCount = asNumber(record.request_count, NaN);
  const remaining = asNumber(record.remaining, NaN);

  if (!Number.isFinite(requestCount) || !Number.isFinite(remaining)) {
    return null;
  }

  return {
    allowed: Boolean(record.allowed),
    requestCount,
    remaining: Math.max(0, remaining),
    limit: AI_DAILY_LIMIT,
    usageDate: date,
  };
}

export async function getAiUsage(userId: string, date = usageDate()): Promise<AiUsageState> {
  const { data, error } = await getSupabaseAdmin()
    .from("user_ai_usage")
    .select("request_count")
    .eq("user_id", userId)
    .eq("usage_date", date)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const requestCount = asNumber(data?.request_count);
  return {
    allowed: requestCount < AI_DAILY_LIMIT,
    requestCount,
    remaining: Math.max(0, AI_DAILY_LIMIT - requestCount),
    limit: AI_DAILY_LIMIT,
    usageDate: date,
  };
}

export async function consumeAiUsage(userId: string, request?: Request): Promise<AiUsageState> {
  const date = usageDate();
  const supabase = getSupabaseAdmin();

  const { data: rpcData, error: rpcError } = await supabase.rpc("increment_ai_usage", {
    p_user_id: userId,
    p_usage_date: date,
    p_limit: AI_DAILY_LIMIT,
  });

  if (!rpcError) {
    const normalized = normalizeRpcUsage(rpcData, date);
    if (normalized) {
      if (!normalized.allowed) {
        logSecurityEvent("ai_usage_limit_exceeded", request, { userId, usageDate: date }, "warn");
      }
      return normalized;
    }
  } else {
    logSecurityEvent(
      "ai_usage_rpc_unavailable",
      request,
      { userId, usageDate: date, code: rpcError.code },
      "warn",
    );
  }

  const current = await getAiUsage(userId, date);
  if (current.requestCount >= AI_DAILY_LIMIT) {
    logSecurityEvent("ai_usage_limit_exceeded", request, { userId, usageDate: date }, "warn");
    return { ...current, allowed: false };
  }

  const nextCount = current.requestCount + 1;
  const { error } = await supabase.from("user_ai_usage").upsert(
    {
      user_id: userId,
      usage_date: date,
      request_count: nextCount,
    },
    { onConflict: "user_id,usage_date" },
  );

  if (error) {
    throw error;
  }

  return {
    allowed: true,
    requestCount: nextCount,
    remaining: Math.max(0, AI_DAILY_LIMIT - nextCount),
    limit: AI_DAILY_LIMIT,
    usageDate: date,
  };
}