"use client";

import { useState, useEffect } from "react";
import TopNav from "@/components/TopNav";
import ActivityBar from "@/components/ActivityBar";
import Sidebar from "@/components/Sidebar";
import LeaderboardPanel from "@/components/LeaderboardPanel";
import MainFooter from "@/components/MainFooter";
import type { CourseListItem } from "@/lib/courseTypes";

export type ActivePanel = "curriculum" | "leaderboard" | null;

export default function LayoutClient({
	children,
	courseList,
	fundamentalsList,
}: {
	children: React.ReactNode;
	courseList: CourseListItem[];
	fundamentalsList: CourseListItem[];
}) {
	const [activePanel, setActivePanel] = useState<ActivePanel>(null);
	const SIDEBAR_WIDTH = 288; // matches Sidebar w-72

	useEffect(() => {
		const handleResize = () => setActivePanel(window.innerWidth >= 1024 ? "curriculum" : null);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="flex flex-col h-screen overflow-hidden bg-background">
			<TopNav
				sidebarOpen={activePanel === "curriculum"}
				toggleSidebar={() => setActivePanel((p) => (p === "curriculum" ? null : "curriculum"))}
			/>

			<div className="flex flex-1 min-w-0 overflow-hidden transition-all duration-300 relative">
				<ActivityBar activePanel={activePanel} setActivePanel={setActivePanel} />
				
				{/* Sidebar uses width transition — content expands automatically */}
				<div
					className="overflow-hidden shrink-0 transition-all duration-300 ease-in-out border-r border-border/70 shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-card/80 backdrop-blur-xl h-full"
					style={{ width: activePanel ? SIDEBAR_WIDTH : 0 }}
				>
					{activePanel === "curriculum" && (
						<Sidebar closeSidebar={() => setActivePanel(null)} courseList={courseList} fundamentalsList={fundamentalsList} />
					)}
					{activePanel === "leaderboard" && (
						<LeaderboardPanel onClose={() => setActivePanel(null)} />
					)}
				</div>

				<main
					id="main-scroll-container"
					className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10"
				>
					{children}
					<MainFooter />
				</main>
			</div>
		</div>
	);
}
