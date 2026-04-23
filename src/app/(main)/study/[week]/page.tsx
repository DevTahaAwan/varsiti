import StudyClient from "./StudyClient";
import { getProgress } from "@/app/actions/progress";

import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function StudyPage(props: { params: Promise<{ week: string }> }) {
  const { week } = await props.params;
  const weekNumber = Number.parseInt(week, 10);
  const { userId } = await auth();
  
  const progress = await getProgress(weekNumber);
  const initialElapsedSeconds = progress?.elapsed_seconds ?? 0;

  return (
    <StudyClient 
      params={props.params} 
      initialElapsedSeconds={initialElapsedSeconds} 
      userId={userId || "guest"}
    />
  );
}
