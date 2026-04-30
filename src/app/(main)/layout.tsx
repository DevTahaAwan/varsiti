import LayoutClient from "./LayoutClient";
import { getCourseList } from "@/lib/courseFetching";

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const courseList = await getCourseList();
	return <LayoutClient courseList={courseList}>{children}</LayoutClient>;
}

