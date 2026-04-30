import StudyClient from "./StudyClient";
import { getProgress } from "@/app/actions/progress";

import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { getCourseWeek } from "@/lib/courseFetching";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Promise<{ week: string }> }): Promise<Metadata> {
  const { week } = await props.params;
  const weekNumber = Number.parseInt(week, 10);
  const data = await getCourseWeek(weekNumber);

  return {
    title: data ? `Week ${weekNumber}: ${data.title}` : `Week ${weekNumber}`,
  };
}

export default async function StudyPage(props: { params: Promise<{ week: string }> }) {
  const { week } = await props.params;
  const weekNumber = Number.parseInt(week, 10);
  const { userId } = await auth();
  
  const progress = await getProgress(weekNumber);
  const initialElapsedSeconds = progress?.elapsed_seconds ?? 0;
  
  const weekData = await getCourseWeek(weekNumber);

  return (
    <StudyClient 
      params={props.params} 
      initialElapsedSeconds={initialElapsedSeconds} 
      userId={userId || "guest"}
      initialWeekData={weekData}
    />
  );
}
