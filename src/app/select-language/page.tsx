"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Clock, Code2, Lock } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const logoFont = Playfair_Display({ subsets: ["latin"], weight: "700" });

// ─── Types ────────────────────────────────────────────────────────────────────
type Language = {
	id: string;
	name: string;
	icon: string;
	tagline: string;
	description: string;
	color: string;
	glowColor: string;
	active: boolean;
	href: string;
};

// ─── Language Data ─────────────────────────────────────────────────────────────
const LANGUAGES: Language[] = [
	{
		id: "cpp",
		name: "C++",
		icon: "⚙️",
		tagline: "The Foundation of OOP",
		description:
			"Master Object-Oriented Programming with C++. Dive into classes, inheritance, polymorphism, and DSA — the foundation of Pakistan's tech interviews.",
		color: "from-blue-500 to-indigo-600",
		glowColor: "rgba(99, 102, 241, 0.25)",
		active: true,
		href: "/",
	},
	{
		id: "python",
		name: "Python",
		icon: "🐍",
		tagline: "Clean & Expressive",
		description:
			"Python-based OOP, data science foundations, and automation scripting. A beautiful language for rapid development.",
		color: "from-yellow-400 to-orange-500",
		glowColor: "rgba(251, 191, 36, 0.15)",
		active: false,
		href: "#",
	},
	{
		id: "javascript",
		name: "JavaScript",
		icon: "⚡",
		tagline: "The Web's Native Language",
		description:
			"Full-stack development, modern ES6+ patterns, and Node.js. Build anything from interactive UIs to scalable APIs.",
		color: "from-yellow-300 to-yellow-500",
		glowColor: "rgba(253, 224, 71, 0.15)",
		active: false,
		href: "#",
	},
];

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ visible }: { visible: boolean }) {
	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ opacity: 0, y: 24, scale: 0.94 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 16, scale: 0.96 }}
					transition={{ duration: 0.22, ease: "easeOut" }}
					className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-2xl"
				>
					<Clock size={16} className="text-primary shrink-0" />
					<span className="text-sm font-semibold text-foreground">
						Coming soon to Varsiti! 🚀
					</span>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// ─── Language Card ─────────────────────────────────────────────────────────────
function LanguageCard({
	lang,
	index,
	onComingSoon,
}: {
	lang: Language;
	index: number;
	onComingSoon: () => void;
}) {
	const [hovered, setHovered] = useState(false);

	const cardContent = (
		<motion.div
			initial={{ opacity: 0, y: 32 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.1 + index * 0.12, type: "spring", stiffness: 260, damping: 22 }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className={`relative flex flex-col rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer select-none
				${lang.active
					? "border-border bg-card shadow-lg hover:-translate-y-2 hover:shadow-2xl"
					: "border-border/40 bg-card/60 opacity-70 hover:opacity-80 hover:-translate-y-1"
				}`}
			style={{
				boxShadow: hovered && lang.active
					? `0 0 40px ${lang.glowColor}, 0 20px 40px rgba(0,0,0,0.12)`
					: undefined,
			}}
		>
			{/* Header gradient strip */}
			<div className={`h-2 w-full bg-gradient-to-r ${lang.color} ${!lang.active ? "opacity-40" : ""}`} />

			{/* "In Development" badge */}
			{!lang.active && (
				<div className="absolute top-5 right-4 flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1">
					<Lock size={10} className="text-amber-500" />
					<span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
						In Development Phase
					</span>
				</div>
			)}

			{/* Active badge */}
			{lang.active && (
				<div className="absolute top-5 right-4 flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-400/10 px-2.5 py-1">
					<CheckCircle size={10} className="text-green-500" />
					<span className="text-[10px] font-bold uppercase tracking-widest text-green-500">
						Available
					</span>
				</div>
			)}

			<div className="flex flex-col flex-1 p-7 pt-6">
				{/* Icon */}
				<div
					className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-inner
						${lang.active ? `bg-gradient-to-br ${lang.color}` : "bg-secondary/60"}`}
					style={{ filter: lang.active ? undefined : "saturate(0.3)" }}
				>
					{lang.icon}
				</div>

				{/* Name + tagline */}
				<h2
					className={`mb-1 text-2xl font-black tracking-tight ${lang.active ? "text-foreground" : "text-foreground/50"}`}
				>
					{lang.name}
				</h2>
				<p className={`mb-4 text-xs font-bold uppercase tracking-widest ${lang.active ? "text-primary" : "text-muted-foreground/60"}`}>
					{lang.tagline}
				</p>
				<p className={`flex-1 text-sm leading-relaxed ${lang.active ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
					{lang.description}
				</p>

				{/* CTA */}
				<div className="mt-6">
					{lang.active ? (
						<div className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${lang.color} px-5 py-2.5 text-sm font-bold text-white shadow-md transition-transform group-hover:scale-105`}>
							Select C++ <ArrowRight size={14} />
						</div>
					) : (
						<div className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-secondary/50 px-5 py-2.5 text-sm font-semibold text-muted-foreground/60">
							<Clock size={14} /> Coming Soon
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);

	if (lang.active) {
		return (
			<Link href={lang.href} className="group block" id={`lang-card-${lang.id}`}>
				{cardContent}
			</Link>
		);
	}

	return (
		<div
			id={`lang-card-${lang.id}`}
			onClick={onComingSoon}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && onComingSoon()}
		>
			{cardContent}
		</div>
	);
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function SelectLanguagePage() {
	const [toastVisible, setToastVisible] = useState(false);

	const showToast = () => {
		setToastVisible(true);
		setTimeout(() => setToastVisible(false), 3000);
	};

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Ambient background blobs */}
			<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				<div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
				<div className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-3xl" />
				<div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-primary/8 blur-3xl" />
			</div>

			<div className="relative z-10 flex flex-col flex-1 items-center px-4 py-12 sm:py-16">
				{/* Logo */}
				<motion.div
					initial={{ opacity: 0, y: -16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="mb-10 flex flex-col items-center gap-3"
				>
					<div className="flex items-center gap-3">
						<div className="rounded-2xl bg-primary/10 p-2.5">
							<Image src="/logo.png" alt="Varsiti Logo" width={38} height={38} className="object-contain" />
						</div>
						<span className={`${logoFont.className} text-3xl tracking-wide text-primary drop-shadow-sm`}>
							Varsiti
						</span>
					</div>
				</motion.div>

				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.08, duration: 0.4 }}
					className="mb-3 text-center"
				>
					<div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
						<Code2 size={12} /> Welcome to Varsiti
					</div>
					<h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
						Choose Your Language
					</h1>
					<p className="mt-3 max-w-lg text-base text-muted-foreground">
						Select the programming language you want to master. You can always switch later from the navigation bar.
					</p>
				</motion.div>

				{/* Cards */}
				<div className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{LANGUAGES.map((lang, i) => (
						<LanguageCard
							key={lang.id}
							lang={lang}
							index={i}
							onComingSoon={showToast}
						/>
					))}
				</div>

				{/* Footer note */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="mt-10 text-center text-xs text-muted-foreground/60"
				>
					More languages dropping soon. Varsiti is built by students, for students. 🎓
				</motion.p>
			</div>

			<Toast visible={toastVisible} />
		</div>
	);
}
