"use client";

import { Layers, Trophy, Lock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ActivePanel } from "@/app/(main)/LayoutClient";

type LangOption = { id: string; label: string; icon: string; active: boolean };

const LANG_OPTIONS: LangOption[] = [
	{ id: "cpp", label: "C++", icon: "⚙️", active: true },
	{ id: "python", label: "Python", icon: "🐍", active: false },
	{ id: "javascript", label: "JavaScript", icon: "⚡", active: false },
];

export default function ActivityBar({
	activePanel,
	setActivePanel,
}: {
	activePanel: ActivePanel;
	setActivePanel: (panel: ActivePanel) => void;
}) {
	const [langDropOpen, setLangDropOpen] = useState(false);
	const [selectedLang, setSelectedLang] = useState(LANG_OPTIONS[0]);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setLangDropOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const handleLangSelect = (lang: LangOption) => {
		if (!lang.active) {
			setLangDropOpen(false);
			return;
		}
		setSelectedLang(lang);
		setLangDropOpen(false);
	};

	return (
		<div className="w-16 shrink-0 flex flex-col items-center py-4 border-r border-border bg-card/50 backdrop-blur-md z-20">
			{/* Language Selection */}
			<div className="relative mb-6" ref={dropdownRef}>
				<button
					onClick={() => setLangDropOpen((o) => !o)}
					className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border"
					title="Select Language"
				>
					<span className="text-xl">{selectedLang.icon}</span>
				</button>

				{/* Dropdown */}
				<div
					className={`absolute left-14 top-0 z-50 min-w-[160px] rounded-2xl border border-border bg-card shadow-xl p-1.5 transition-all duration-200 origin-top-left ${
						langDropOpen
							? "opacity-100 scale-100 pointer-events-auto visible"
							: "opacity-0 scale-95 pointer-events-none invisible"
					}`}
				>
					{LANG_OPTIONS.map((lang) => (
						<button
							key={lang.id}
							onClick={() => handleLangSelect(lang)}
							className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
								lang.active
									? "text-foreground hover:bg-secondary"
									: "text-muted-foreground/60 hover:bg-secondary/50 cursor-not-allowed"
							} ${selectedLang.id === lang.id ? "bg-primary/10 text-primary" : ""}`}
						>
							<span>{lang.icon}</span>
							<span className="flex-1 text-left">{lang.label}</span>
							{!lang.active && (
								<Lock size={12} className="text-muted-foreground opacity-50" />
							)}
						</button>
					))}
				</div>
			</div>

			<div className="w-8 h-px bg-border mb-6" />

			{/* Tools */}
			<div className="flex flex-col gap-4 w-full px-2">
				<button
					onClick={() => setActivePanel(activePanel === "curriculum" ? null : "curriculum")}
					className={`flex flex-col items-center justify-center w-full aspect-square rounded-2xl transition-colors ${
						activePanel === "curriculum"
							? "bg-primary/10 text-primary border-primary/20 border"
							: "text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
					}`}
					title="Curriculum"
				>
					<Layers size={22} />
				</button>

				<button
					onClick={() => setActivePanel(activePanel === "leaderboard" ? null : "leaderboard")}
					className={`flex flex-col items-center justify-center w-full aspect-square rounded-2xl transition-colors ${
						activePanel === "leaderboard"
							? "bg-primary/10 text-primary border-primary/20 border"
							: "text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
					}`}
					title="Leaderboard"
				>
					<Trophy size={22} />
				</button>
			</div>
		</div>
	);
}
