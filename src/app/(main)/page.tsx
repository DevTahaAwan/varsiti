import DashboardClient from "./DashboardClient";
import { auth } from "@clerk/nextjs/server";
import { getCourseList, getFundamentalsList } from "@/lib/courseFetching";
import type { CourseListItem } from "@/lib/courseTypes";

import { Metadata } from "next";

type CourseMetaMap = Record<number, Omit<CourseListItem, "weekNumber">>;

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  const weeks = await getCourseList();

  const weeksList = weeks.map((week) => week.weekNumber);
  const courseMeta = weeks.reduce<CourseMetaMap>((acc, week) => {
    acc[week.weekNumber] = {
      type: week.type,
      title: week.title,
      outline: week.outline || []
    };
    return acc;
  }, {});

  const fundamentals = await getFundamentalsList();
  const fundamentalsListIds = fundamentals.map((week) => week.weekNumber);
  const fundamentalsMeta = fundamentals.reduce<CourseMetaMap>((acc, week) => {
    acc[week.weekNumber] = {
      type: week.type,
      title: week.title,
      outline: week.outline || []
    };
    return acc;
  }, {});

  return <DashboardClient userId={userId || "guest"} weeksList={weeksList} courseMeta={courseMeta} fundamentalsList={fundamentalsListIds} fundamentalsMeta={fundamentalsMeta} />;
}
