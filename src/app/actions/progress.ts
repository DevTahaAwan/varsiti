"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { logApiError, logSecurityEvent } from "@/lib/securityLogger";

const progressSchema = z.object({
  weekNumber: z.number().int().min(1).max(52),
  elapsedSeconds: z.number().int().min(0).max(86400).optional(),
});

const weekToUuid = (weekNumber: number) => {
  return `00000000-0000-0000-0000-${String(weekNumber).padStart(12, "0")}`;
};

export async function getProgress(weekNumber: number) {
  const parsed = progressSchema.pick({ weekNumber: true }).safeParse({ weekNumber });
  if (!parsed.success) return null;

  const { userId } = await auth();
  if (!userId) return null;

  const { data, error } = await getSupabaseAdmin()
    .from("user_progress")
    .select("elapsed_seconds")
    .eq("user_id", userId)
    .eq("week_id", weekToUuid(parsed.data.weekNumber))
    .maybeSingle();

  if (error) {
    logApiError("progress_fetch_failed", error, undefined, { userId, weekNumber: parsed.data.weekNumber });
    return null;
  }

  return data;
}

export async function saveProgress(weekNumber: number, elapsedSeconds: number) {
  const parsed = progressSchema.safeParse({ weekNumber, elapsedSeconds });
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const { userId } = await auth();
  if (!userId) {
    logSecurityEvent("progress_save_unauthorized", undefined, { weekNumber }, "warn");
    return { success: false, error: "Unauthorized" };
  }

  const weekIdUuid = weekToUuid(parsed.data.weekNumber);

  const { error } = await getSupabaseAdmin()
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        week_id: weekIdUuid,
        elapsed_seconds: parsed.data.elapsedSeconds,
      },
      { onConflict: "user_id,week_id" },
    );

  if (error) {
    logApiError("progress_save_failed", error, undefined, { userId, weekNumber: parsed.data.weekNumber });
    return { success: false, error: "Could not save progress." };
  }

  return { success: true };
}