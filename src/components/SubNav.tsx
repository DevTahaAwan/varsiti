"use client";

import { useState, useEffect, useRef } from "react";
import {
	Trophy,
	ChevronDown,
	Code2,
	Clock,
	Lock,
} from "lucide-react";
import dynamic from "next/dynamic";

// Lazy-load the leaderboard modal to keep SubNav bundle small
const LeaderboardModal = dynamic(() => import("./LeaderboardModal"), { ssr: false });

// ─── Language Options ──────────────────────────────────────────────────────────
type LangOption = { id: string; label: string; icon: string; active: boolean };

const LANG_OPTIONS: LangOption[] = [
	{ id: "cpp", label: "C++", icon: "⚙️", active: true },
	{ id: "python", label: "Python", icon: "🐍", active: false },
	{ id: "javascript", label: "JavaScript", icon: "⚡", active: false },
];

// ─── Coming Soon Toast ─────────────────────────────────────────────────────────
function ComingSoonToast({ visible }: { visible: boolean }) {
	return (
		<div className={`transition-all duration-200 ease-out fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-2xl ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"}`}>
			<Clock size={16} className="text-primary shrink-0" />
			<span className="text-sm font-semibold text-foreground">
				Coming soon to Varsiti! 🚀
			</span>
		</div>
	);
}

// ─── SubNav ────────────────────────────────────────────────────────────────────
export default function SubNav() {
	const [visible, setVisible] = useState(true);
	const [leaderboardOpen, setLeaderboardOpen] = useState(false);
	const [langDropOpen, setLangDropOpen] = useState(false);
	const [selectedLang, setSelectedLang] = useState(LANG_OPTIONS[0]);
	const [toastVisible, setToastVisible] = useState(false);

	const lastScrollY = useRef(0);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// ── Scroll hide/show ──────────────────────────────────────────────────────
	useEffect(() => {
		const container = document.getElementById("main-scroll-container");
		const target = container ?? window;

		const getScrollY = () =>
			container ? container.scrollTop : window.scrollY;

		const onScroll = () => {
			const currentY = getScrollY();
			const delta = currentY - lastScrollY.current;

			if (delta > 6 && currentY > 80) {
				setVisible(false);
				setLangDropOpen(false); // close dropdown on hide
			} else if (delta < -6) {
				setVisible(true);
			}

			lastScrollY.current = currentY;
		};

		target.addEventListener("scroll", onScroll, { passive: true });
		return () => target.removeEventListener("scroll", onScroll);
	}, []);

	// ── Close lang dropdown on outside click ──────────────────────────────────
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setLangDropOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	// ── Toast helper ──────────────────────────────────────────────────────────
	const showToast = () => {
		setToastVisible(true);
		setTimeout(() => setToastVisible(false), 3000);
	};

	// ── Language select ───────────────────────────────────────────────────────
	const handleLangSelect = (lang: LangOption) => {
		if (!lang.active) {
			showToast();
			setLangDropOpen(false);
			return;
		}
		setSelectedLang(lang);
		setLangDropOpen(false);
	};

	return (
		<>
			{/* SubNav bar */}
			<div
				className={`sticky top-16 z-30 h-12 w-full border-b border-border/60 bg-card/80 backdrop-blur-md flex items-center px-4 gap-3 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${visible ? "translate-y-0" : "-translate-y-14"}`}
			>
				{/* ── Leaderboard button ── */}
				<button
					id="subnav-leaderboard-btn"
					onClick={() => setLeaderboardOpen(true)}
					className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
				>
					<Trophy size={15} />
					<span>Leaderboard</span>
				</button>

				{/* Divider */}
				<div className="h-5 w-px bg-border/60" />

				{/* ── Language Switcher ── */}
				<div className="relative" ref={dropdownRef}>
					<button
						id="subnav-lang-btn"
						onClick={() => setLangDropOpen((o) => !o)}
						className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
					>
						<Code2 size={15} />
						<span className="hidden sm:inline">
							{selectedLang.icon} {selectedLang.label}
						</span>
						<span className="sm:hidden">{selectedLang.icon}</span>
						<div
							className={`transition-transform duration-200 ${langDropOpen ? "rotate-180" : "rotate-0"}`}
						>
							<ChevronDown size={13} />
						</div>
					</button>

					<div className={`transition-all duration-200 origin-top ${langDropOpen ? 'opacity-100 scale-100 pointer-events-auto visible' : 'opacity-0 scale-95 pointer-events-none invisible'} absolute left-0 top-10 z-50 min-w-[180px] rounded-2xl border border-border bg-card shadow-xl p-1.5`}>
								{LANG_OPTIONS.map((lang) => (
									<button
										key={lang.id}
										id={`lang-switcher-${lang.id}`}
										onClick={() => handleLangSelect(lang)}
										className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
											lang.active
												? "text-foreground hover:bg-secondary"
												: "text-muted-foreground/60 hover:bg-secondary/50"
										} ${selectedLang.id === lang.id ? "bg-primary/8 text-primary" : ""}`}
									>
										<span>{lang.icon}</span>
										<span className="flex-1 text-left">{lang.label}</span>
										{!lang.active && (
											<span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-amber-500">
												<Lock size={8} />
												Soon
											</span>
										)}
										{selectedLang.id === lang.id && lang.active && (
											<span className="h-1.5 w-1.5 rounded-full bg-primary" />
										)}
									</button>
								))}
					</div>
				</div>
			</div>

			{/* Leaderboard modal */}
			{leaderboardOpen && (
				<LeaderboardModal onClose={() => setLeaderboardOpen(false)} />
			)}

			{/* Toast */}
			<ComingSoonToast visible={toastVisible} />
		</>
	);
}
