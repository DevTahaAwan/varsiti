import LayoutClient from "./LayoutClient";
import { getCourseList, getFundamentalsList } from "@/lib/courseFetching";

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const courseList = await getCourseList();
	const fundamentalsList = await getFundamentalsList();
	return <LayoutClient courseList={courseList} fundamentalsList={fundamentalsList}>{children}</LayoutClient>;
}

