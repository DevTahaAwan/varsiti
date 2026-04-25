"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
	ArrowRight,
	Award,
	BookOpen,
	Clock,
	Code,
	Star,
	Terminal,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";

import { course } from "@/lib/courseData";
import type { CourseWeek } from "@/lib/courseTypes";
import SuggestionForm from "@/components/SuggestionForm";

const containerVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	show: {
		y: 0,
		opacity: 1,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
};

const MOTIVATIONAL_QUOTES = [
	{
		quote: "Code is the closest thing to a superpower that people actually have.",
		attr: "Drew Houston",
	},
	{
		quote: "Every expert was once a beginner. Every pro started where you are.",
		attr: "Unknown",
	},
	{
		quote: "In C++, you control the hardware. That's both the power and the responsibility.",
		attr: "Bjarne Stroustrup",
	},
	{
		quote: "The best time to write clean code was yesterday. The next best time is now.",
		attr: "Unknown",
	},
	{
		quote: "OOP is not just a paradigm. It is a way to model the real world clearly.",
		attr: "Inspired by Grady Booch",
	},
];

function getInitialWeekId(weeks: number[], userId: string) {
	if (typeof window === "undefined") return weeks[0];
	const saved = window.localStorage.getItem(`varsiti-last-week-${userId}`);
	const parsed = saved ? Number.parseInt(saved, 10) : weeks[0];
	return weeks.includes(parsed) ? parsed : weeks[0];
}

function getInitialQuote() {
	const index =
		typeof window === "undefined"
			? 0
			: new Date().getDay() % MOTIVATIONAL_QUOTES.length;
	return MOTIVATIONAL_QUOTES[index];
}

export default function DashboardClient({ userId: clerkUserId }: { userId: string }) {
	const { user } = useUser();
	const weeksList = useMemo(
		() =>
			Object.keys(course)
				.map(Number)
				.sort((a, b) => a - b),
		[],
	);
	const [lastWeekId] = useState<number>(() => getInitialWeekId(weeksList, clerkUserId));
	const [quote] = useState(() => getInitialQuote());

	return (
		<div className="mx-auto max-w-7xl space-y-10 py-6 md:py-10">
			<motion.section
				initial={{ y: 30, opacity: 0, scale: 0.98 }}
				animate={{ y: 0, opacity: 1, scale: 1 }}
				transition={{ type: "spring", stiffness: 200, damping: 20 }}
				className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/70 p-8 text-primary-foreground shadow-2xl md:p-12"
			>
				<div className="absolute right-0 top-0 h-64 w-64 translate-x-8 -translate-y-8 rounded-full bg-white/10 blur-3xl" />
				<div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-8 translate-y-8 rounded-full bg-black/10 blur-3xl" />

				<div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
					<div className="max-w-xl">
						<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-3 py-1.5 text-sm font-semibold backdrop-blur-md">
							<Zap
								size={14}
								className="text-yellow-300"
								fill="currentColor"
							/>
							{user
								? `Welcome back, ${user.firstName || "Learner"}!`
								: "Welcome to Varsiti!"}
						</div>

						<h1 className="mb-4 text-3xl font-extrabold leading-tight md:text-4xl">
							&ldquo;{quote.quote}&rdquo;
						</h1>
						<p className="mb-6 text-sm text-primary-foreground/80">
							- {quote.attr}
						</p>

						<div className="flex flex-wrap gap-3">
							<Link
								href={`/study/${lastWeekId}`}
								onClick={() =>
									window.localStorage.setItem(
										`varsiti-last-week-${clerkUserId}`,
										String(lastWeekId),
									)
								}
								className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg transition-transform hover:scale-105 active:scale-95"
							>
								<TrendingUp size={16} /> Continue Week{" "}
								{lastWeekId}
							</Link>
							<Link
								href="/study/1"
								className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/30"
							>
								Start from Beginning
							</Link>
						</div>
					</div>

					<div className="relative hidden shrink-0 lg:block">
						<div className="flex h-44 w-44 rotate-12 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md">
							<Code size={72} className="text-white opacity-80" />
						</div>
						<div className="absolute -bottom-4 -left-4 flex h-20 w-20 -rotate-6 items-center justify-center rounded-2xl border-4 border-primary bg-yellow-400 shadow-lg">
							<Terminal size={32} className="text-black" />
						</div>
					</div>
				</div>
			</motion.section>

			<motion.section
				variants={containerVariants}
				initial="hidden"
				animate="show"
				className="grid grid-cols-2 gap-4 md:grid-cols-4"
			>
				<StatCard
					icon={<BookOpen size={20} />}
					label="Total Modules"
					value={String(weeksList.length)}
				/>
				<StatCard
					icon={<Clock size={20} />}
					label="Avg. per Module"
					value="~45 min"
				/>
				<StatCard
					icon={<Award size={20} />}
					label="OOP Pillars"
					value="4"
				/>
				<StatCard
					icon={<Star size={20} />}
					label="Practice Tasks"
					value="50+"
				/>
			</motion.section>

			<motion.section
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35 }}
				className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm md:p-7"
			>
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
							About Varsiti
						</p>
						<h2 className="mb-2 text-xl font-extrabold tracking-tight md:text-2xl">
							Meet the story behind the platform
						</h2>
						<p className="max-w-2xl text-sm text-muted-foreground">
							Read the developer note, motivation wall, and
							connect directly with Hafiz Muhammad Taha on GitHub
							and LinkedIn.
						</p>
					</div>
					<Link
						href="/about"
						className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
					>
						Open About Page <ArrowRight size={16} />
					</Link>
				</div>
			</motion.section>

			<section>
				<div className="mb-6 flex items-center gap-3">
					<div className="rounded-xl bg-primary/10 p-2 text-primary">
						<BookOpen size={22} />
					</div>
					<h2 className="text-2xl font-extrabold tracking-tight">
						OOP Course Modules
					</h2>
				</div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
				>
					{weeksList.map((weekNumber) => {
						const data = course[weekNumber] as CourseWeek;
						const isExam = data.type === "exam";

						return (
							<motion.div
								key={weekNumber}
								variants={itemVariants}
							>
								<Link
									href={`/study/${weekNumber}`}
									onClick={() =>
										window.localStorage.setItem(
											`varsiti-last-week-${clerkUserId}`,
											String(weekNumber),
										)
									}
									className="group relative block h-full"
								>
									<div
										className={`absolute inset-0 rounded-3xl blur-xl opacity-0 scale-95 transition-all duration-500 group-hover:opacity-20 group-hover:scale-100 ${
											isExam
												? "bg-gradient-to-b from-amber-400 to-amber-600"
												: "bg-gradient-to-b from-primary to-primary/40"
										}`}
									/>
									<div className="relative flex h-full flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-sm transition-colors duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
										<div className="mb-5 flex items-start justify-between">
											<span
												className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-base font-black ${
													isExam
														? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
														: "bg-primary/10 text-primary"
												}`}
											>
												W{weekNumber}
											</span>
											{isExam && (
												<span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
													Exam
												</span>
											)}
										</div>
										<h3 className="mb-2 text-lg font-bold leading-tight transition-colors group-hover:text-primary">
											{data.title}
										</h3>
										<p className="mb-5 flex-1 line-clamp-2 text-xs text-muted-foreground">
											{data.outline?.[0]}
										</p>
										<div className="flex flex-wrap items-center gap-1.5">
											{!isExam ? (
												<>
													<Tag>Theory</Tag>
													<Tag>Practice</Tag>
													<Tag>Quiz</Tag>
												</>
											) : (
												<>
													<Tag active>Rules</Tag>
													<Tag
														active
														className="bg-amber-600 text-white"
													>
														Mock Test
													</Tag>
												</>
											)}
											<ArrowRight
												size={14}
												className="ml-auto text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary"
											/>
										</div>
									</div>
								</Link>
							</motion.div>
						);
					})}
				</motion.div>
			</section>

			<motion.section
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35 }}
				className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm md:p-7"
			>
				<div className="mb-5">
					<p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
						Suggestion Box
					</p>
					<h2 className="mb-2 text-xl font-extrabold tracking-tight md:text-2xl">
						Tell us what you want to see next
					</h2>
					<p className="max-w-2xl text-sm text-muted-foreground">
						Share ideas for new lessons, quizzes, tools, or features
						you want inside Varsiti. Your feedback goes directly to
						the team.
					</p>
				</div>

				<SuggestionForm />
			</motion.section>
		</div>
	);
}

function StatCard({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<motion.div
			variants={itemVariants}
			className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-md"
		>
			<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
				{icon}
			</div>
			<div>
				<p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
					{label}
				</p>
				<p className="text-xl font-bold">{value}</p>
			</div>
		</motion.div>
	);
}

function Tag({
	children,
	active,
	className = "",
}: {
	children: React.ReactNode;
	active?: boolean;
	className?: string;
}) {
	return (
		<span
			className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
				active
					? "border-transparent bg-primary text-primary-foreground"
					: "border-border/50 bg-secondary text-muted-foreground"
			} ${className}`}
		>
			{children}
		</span>
	);
}
