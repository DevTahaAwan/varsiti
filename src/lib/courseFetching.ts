import { createClient } from "@supabase/supabase-js";
import type { CourseListItem, CourseWeek } from "@/lib/courseTypes";

type CourseWeekRow = {
  week_number: number;
  week_type: CourseWeek["type"];
  title: string;
  content: {
    outline?: string[];
  } | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a specialized client that uses Next.js fetch caching (ISR)
export const supabaseIsr = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: (url, options) => {
      return fetch(url, { ...options, next: { revalidate: 3600 } });
    },
  },
});

export async function getCourseList(): Promise<CourseListItem[]> {
  const { data, error } = await supabaseIsr
    .from("course_weeks")
    .select("week_number, week_type, title, content")
    .order("week_number", { ascending: true });

  if (error) {
    console.error("Failed to fetch course list:", error);
    return [];
  }

  return ((data ?? []) as CourseWeekRow[]).map((week) => ({
    weekNumber: week.week_number,
    type: week.week_type,
    title: week.title,
    outline: week.content?.outline || [],
  }));
}

export async function getCourseWeek(weekNum: number): Promise<CourseWeek | null> {
  const { data, error } = await supabaseIsr
    .from("course_weeks")
    .select("week_number, week_type, title, content")
    .eq("week_number", weekNum)
    .single();

  if (error || !data) {
    console.error(`Failed to fetch week ${weekNum}:`, error);
    return null;
  }

  return {
    week: data.week_number,
    type: data.week_type,
    title: data.title,
    ...data.content
  } as CourseWeek;
}

export async function getFundamentalsList(): Promise<CourseListItem[]> {
  // Read directly from local data — no Supabase needed
  const { fundamentalsData } = await import("@/data/fundamentalsData");
  return fundamentalsData.map((week) => ({
    weekNumber: week.week,
    type: week.type,
    title: week.title,
    outline: week.outline,
  }));
}

export async function getFundamentalsWeek(weekNum: number): Promise<CourseWeek | null> {
  const { fundamentalsData } = await import("@/data/fundamentalsData");
  const week = fundamentalsData.find((w) => w.week === weekNum);
  return week ?? null;
}
