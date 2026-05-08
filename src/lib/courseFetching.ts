import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CourseListItem, CourseWeek } from "@/lib/courseTypes";

type CourseWeekRow = {
  week_number: number;
  week_type: CourseWeek["type"];
  title: string;
  content: {
    outline?: string[];
  } | null;
};

type FundamentalHurdleRow = {
  hurdle_number: number;
  hurdle_type: CourseWeek["type"];
  title: string;
  content: {
    outline?: string[];
  } | null;
};

let supabaseIsr: SupabaseClient | null = null;

function getPublicSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase public configuration is missing.");
  }

  return { supabaseUrl, supabaseKey };
}

function getSupabaseIsr() {
  if (!supabaseIsr) {
    const { supabaseUrl, supabaseKey } = getPublicSupabaseEnv();
    supabaseIsr = createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: (url, options) => {
          return fetch(url, { ...options, next: { revalidate: 3600 } });
        },
      },
    });
  }

  return supabaseIsr;
}

export async function getCourseList(): Promise<CourseListItem[]> {
  const { data, error } = await getSupabaseIsr()
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
  const { data, error } = await getSupabaseIsr()
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
    ...data.content,
  } as CourseWeek;
}

export async function getFundamentalsList(): Promise<CourseListItem[]> {
  const { data, error } = await getSupabaseIsr()
    .from("fundamental_hurdles")
    .select("hurdle_number, hurdle_type, title, content")
    .order("hurdle_number", { ascending: true });

  if (error) {
    console.error("Failed to fetch fundamentals list:", error);
    return [];
  }

  return ((data ?? []) as FundamentalHurdleRow[]).map((item) => ({
    weekNumber: item.hurdle_number,
    type: item.hurdle_type,
    title: item.title,
    outline: item.content?.outline || [],
  }));
}

export async function getFundamentalsWeek(weekNum: number): Promise<CourseWeek | null> {
  const { data, error } = await getSupabaseIsr()
    .from("fundamental_hurdles")
    .select("hurdle_number, hurdle_type, title, content")
    .eq("hurdle_number", weekNum)
    .single();

  if (error || !data) {
    console.error(`Failed to fetch fundamental hurdle ${weekNum}:`, error);
    return null;
  }

  return {
    week: data.hurdle_number,
    type: data.hurdle_type,
    title: data.title,
    ...data.content,
  } as CourseWeek;
}