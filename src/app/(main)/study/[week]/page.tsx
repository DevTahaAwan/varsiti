import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgress } from "@/app/actions/progress";
import { getCourseWeek } from "@/lib/courseFetching";
import { parseWeekParam } from "@/lib/weekValidation";
import StudyClient from "./StudyClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Promise<{ week: string }> }): Promise<Metadata> {
  const { week } = await props.params;
  const weekNumber = parseWeekParam(week);
  if (!weekNumber) {
    return { title: "Week not found" };
  }

  const data = await getCourseWeek(weekNumber);

  return {
    title: data ? `Week ${weekNumber}: ${data.title}` : `Week ${weekNumber}`,
  };
}

export default async function StudyPage(props: { params: Promise<{ week: string }> }) {
  const { week } = await props.params;
  const weekNumber = parseWeekParam(week);
  if (!weekNumber) {
    notFound();
  }

  const { userId } = await auth();
  const progress = await getProgress(weekNumber);
  const initialElapsedSeconds = progress?.elapsed_seconds ?? 0;
  const weekData = await getCourseWeek(weekNumber);

  if (!weekData) {
    notFound();
  }

  return (
    <StudyClient
      params={props.params}
      initialElapsedSeconds={initialElapsedSeconds}
      userId={userId || "guest"}
      initialWeekData={weekData}
    />
  );
}