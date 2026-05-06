import StudyClient from "../../study/[week]/StudyClient";
import { getProgress } from "@/app/actions/progress";

import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { getFundamentalsWeek } from "@/lib/courseFetching";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Promise<{ week: string }> }): Promise<Metadata> {
  const { week } = await props.params;
  const weekNumber = Number.parseInt(week, 10);
  const data = await getFundamentalsWeek(weekNumber);

  return {
    title: data ? `PF Week ${weekNumber}: ${data.title}` : `Programming Fundamentals - Week ${weekNumber}`,
  };
}

export default async function FundamentalsPage(props: { params: Promise<{ week: string }> }) {
  const { week } = await props.params;
  const weekNumber = Number.parseInt(week, 10);
  const { userId } = await auth();

  const progress = await getProgress(weekNumber);
  const initialElapsedSeconds = progress?.elapsed_seconds ?? 0;

  const weekData = await getFundamentalsWeek(weekNumber);

  return (
    <StudyClient
      params={props.params}
      initialElapsedSeconds={initialElapsedSeconds}
      userId={userId || "guest"}
      initialWeekData={weekData}
    />
  );
}
