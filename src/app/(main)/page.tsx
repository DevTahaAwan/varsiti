import DashboardClient from "./DashboardClient";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  return <DashboardClient userId={userId || "guest"} />;
}
