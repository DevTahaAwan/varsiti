"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
	BookOpen,
	PlayCircle,
	ChevronDown,
	ChevronRight,
	Cpu,
	Code2,
	Layers,
	CheckCircle2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { course } from "@/lib/courseData";
import type { CourseWeek } from "@/lib/courseTypes";

const NAV_SECTIONS = [
	{
		id: "fundamentals",
		label: "C++ Fundamentals",
		icon: <Cpu size={15} />,
		color: "text-blue-500",
		weeks: [] as number[],
		isPlaceholder: true,
	},
	{
		id: "oop",
		label: "OOP Course",
		icon: <Layers size={15} />,
		color: "text-primary",
		weeks: Object.keys(course)
			.map(Number)
			.sort((a, b) => a - b),
		isPlaceholder: false,
	},
	{
		id: "dsa",
		label: "DSA & Advanced C++",
		icon: <Code2 size={15} />,
		color: "text-orange-500",
		weeks: [] as number[],
		isPlaceholder: true,
	},
];

export default function Sidebar({
	closeSidebar,
}: {
	closeSidebar: () => void;
}) {
	const pathname = usePathname();
	const [openSections, setOpenSections] = useState<Record<string, boolean>>({
		oop: true,
	});
	const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);

	useEffect(() => {
		const loadCompleted = () => {
			try {
				const raw = localStorage.getItem("varsiti-completed-weeks");
				const parsed = raw ? (JSON.parse(raw) as number[]) : [];
				setCompletedWeeks(Array.isArray(parsed) ? parsed : []);
			} catch {
				setCompletedWeeks([]);
			}
		};

		loadCompleted();
		window.addEventListener("storage", loadCompleted);
		return () => window.removeEventListener("storage", loadCompleted);
	}, []);

	const oopWeeks = NAV_SECTIONS.find((s) => s.id === "oop")?.weeks || [];
	const totalTopics = oopWeeks.length;
	const completedTopics = oopWeeks.filter((w) =>
		completedWeeks.includes(w),
	).length;
	const completionPercent =
		totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

	const toggle = (id: string) =>
		setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

	return (
		// Fixed width — the parent div controls actual visible width via CSS transition
		<div className="w-72 h-full flex flex-col bg-card/80 backdrop-blur-xl border-r border-border/70 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
			{/* Section header */}
			<div className="border-b border-border/70 px-5 py-4 shrink-0 space-y-2.5 bg-card/55 backdrop-blur-md">
				<span className="block text-[11px] font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap">
					Curriculum
				</span>
				<div>
					<div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
						<span>Topics Completed</span>
						<span>
							{completedTopics}/{totalTopics} •{" "}
							{completionPercent}%
						</span>
					</div>
					<div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/60">
						<div
							className="h-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-500"
							style={{ width: `${completionPercent}%` }}
						/>
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
				{NAV_SECTIONS.map((section) => (
					<div key={section.id}>
						<button
							onClick={() => toggle(section.id)}
							className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card/45 hover:bg-secondary/90 transition-colors text-left backdrop-blur-sm"
						>
							<span className={section.color}>
								{section.icon}
							</span>
							<span className="flex-1 text-sm font-bold text-foreground whitespace-nowrap">
								{section.label}
							</span>
							{section.isPlaceholder && (
								<span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 uppercase shrink-0">
									Soon
								</span>
							)}
							{openSections[section.id] ? (
								<ChevronDown
									size={13}
									className="text-muted-foreground shrink-0"
								/>
							) : (
								<ChevronRight
									size={13}
									className="text-muted-foreground shrink-0"
								/>
							)}
						</button>

						<AnimatePresence>
							{openSections[section.id] && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.18 }}
									className="overflow-hidden bg-card/35 backdrop-blur-md"
								>
									{section.isPlaceholder ? (
										<p className="text-xs text-muted-foreground italic px-5 py-2">
											Coming soon!
										</p>
									) : (
										section.weeks.map((w) => {
											const weekData = course[
												w
											] as CourseWeek;
											const isActive =
												pathname === `/study/${w}`;
											const isCompleted =
												completedWeeks.includes(w);
											return (
												<Link
													key={w}
													href={`/study/${w}`}
													onClick={() =>
														window.innerWidth <
															1024 &&
														closeSidebar()
													}
													className={`flex items-start gap-2.5 px-3 py-2 mx-1 rounded-xl transition-all my-0.5 backdrop-blur-sm ${
														isActive
															? "bg-primary/10 ring-1 ring-primary/20"
															: "hover:bg-secondary text-muted-foreground hover:text-foreground"
													}`}
												>
													<div
														className={`mt-0.5 shrink-0 ${isActive ? "text-primary" : ""}`}
													>
														{weekData.type ===
														"study" ? (
															<BookOpen
																size={13}
															/>
														) : (
															<PlayCircle
																size={13}
															/>
														)}
													</div>
													<div className="min-w-0">
														<p
															className={`text-xs font-bold leading-tight flex items-center gap-1.5 ${isActive ? "text-primary" : ""}`}
														>
															Week {w}
															{isCompleted && (
																<CheckCircle2
																	size={12}
																	className="text-primary"
																/>
															)}
														</p>
														<p className="text-[11px] opacity-70 line-clamp-2 leading-snug mt-0.5">
															{weekData.title}
														</p>
													</div>
												</Link>
											);
										})
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				))}
			</div>
		</div>
	);
}
