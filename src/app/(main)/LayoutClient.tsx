"use client";

import { useState, useEffect } from "react";
import TopNav from "@/components/TopNav";
import SubNav from "@/components/SubNav";
import Sidebar from "@/components/Sidebar";
import MainFooter from "@/components/MainFooter";

export default function LayoutClient({
	children,
	courseList,
}: {
	children: React.ReactNode;
	courseList: any[];
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const SIDEBAR_WIDTH = 288; // matches Sidebar w-72

	useEffect(() => {
		const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			{/* Sidebar uses width transition — content expands automatically */}
			<div
				className="overflow-hidden shrink-0 transition-all duration-300 ease-in-out"
				style={{ width: sidebarOpen ? SIDEBAR_WIDTH : 0 }}
			>
				<Sidebar closeSidebar={() => setSidebarOpen(false)} courseList={courseList} />
			</div>

			<div className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300">
				<TopNav
					sidebarOpen={sidebarOpen}
					toggleSidebar={() => setSidebarOpen((o) => !o)}
				/>
				<SubNav />
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
