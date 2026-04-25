import DashboardClient from "./DashboardClient";
import { auth } from "@clerk/nextjs/server";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  return <DashboardClient userId={userId || "guest"} />;
}
