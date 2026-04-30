import DashboardClient from "./DashboardClient";
import { auth } from "@clerk/nextjs/server";
import { getCourseList } from "@/lib/courseFetching";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  const weeks = await getCourseList();

  const weeksList = weeks.map((w: any) => w.weekNumber);
  const courseMeta = weeks.reduce((acc: any, week: any) => {
    acc[week.weekNumber] = {
      type: week.type,
      title: week.title,
      outline: week.outline || []
    };
    return acc;
  }, {});

  return <DashboardClient userId={userId || "guest"} weeksList={weeksList} courseMeta={courseMeta} />;
}
