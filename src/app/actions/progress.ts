"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { z } from "zod";

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

  const { data, error } = await supabaseAdmin
    .from("user_progress")
    .select("elapsed_seconds")
    .eq("user_id", userId)
    .eq("week_id", weekToUuid(weekNumber))
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching progress:", error);
  }

  return data;
}

export async function saveProgress(weekNumber: number, elapsedSeconds: number) {
  const parsed = progressSchema.safeParse({ weekNumber, elapsedSeconds });
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const weekIdUuid = weekToUuid(parsed.data.weekNumber);

  const { data: existing } = await supabaseAdmin
    .from("user_progress")
    .select("user_id") // Using user_id instead of id in case id column isn't present
    .eq("user_id", userId)
    .eq("week_id", weekIdUuid)
    .single();

  if (existing) {
    const { error } = await supabaseAdmin
      .from("user_progress")
      .update({ elapsed_seconds: parsed.data.elapsedSeconds })
      .eq("user_id", userId)
      .eq("week_id", weekIdUuid);
      
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabaseAdmin
      .from("user_progress")
      .insert({ user_id: userId, week_id: weekIdUuid, elapsed_seconds: parsed.data.elapsedSeconds });
      
    if (error) return { success: false, error: error.message };
  }

  return { success: true };
}
