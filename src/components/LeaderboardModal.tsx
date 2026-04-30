"use client";

import { useState, useEffect } from "react";
import { X, Trophy, Globe, GraduationCap, MapPin, Medal } from "lucide-react";

// ─── Placeholder Data ──────────────────────────────────────────────────────────
const LEADERBOARD_DATA = {
	university: [
		{ rank: 1, name: "Ayesha Siddiqui", score: 980, detail: "FAST NUCES Lahore", avatar: "AS" },
		{ rank: 2, name: "Bilal Rehman", score: 945, detail: "NUST Islamabad", avatar: "BR" },
		{ rank: 3, name: "Fatima Malik", score: 920, detail: "COMSATS Islamabad", avatar: "FM" },
		{ rank: 4, name: "Usman Tariq", score: 895, detail: "UET Lahore", avatar: "UT" },
		{ rank: 5, name: "Zara Ahmed", score: 870, detail: "IBA Karachi", avatar: "ZA" },
		{ rank: 6, name: "Hassan Ali", score: 850, detail: "LUMS Lahore", avatar: "HA" },
		{ rank: 7, name: "Nimra Khan", score: 825, detail: "GIKI Topi", avatar: "NK" },
	],
	country: [
		{ rank: 1, name: "Ayesha Siddiqui", score: 980, detail: "🇵🇰 Pakistan", avatar: "AS" },
		{ rank: 2, name: "Bilal Rehman", score: 945, detail: "🇵🇰 Pakistan", avatar: "BR" },
		{ rank: 3, name: "Raj Patel", score: 932, detail: "🇮🇳 India", avatar: "RP" },
		{ rank: 4, name: "Fatima Malik", score: 920, detail: "🇵🇰 Pakistan", avatar: "FM" },
		{ rank: 5, name: "Chen Wei", score: 905, detail: "🇨🇳 China", avatar: "CW" },
		{ rank: 6, name: "Sara Hassan", score: 890, detail: "🇪🇬 Egypt", avatar: "SH" },
		{ rank: 7, name: "Usman Tariq", score: 895, detail: "🇵🇰 Pakistan", avatar: "UT" },
	],
	world: [
		{ rank: 1, name: "Ayesha Siddiqui", score: 980, detail: "🌍 Global", avatar: "AS" },
		{ rank: 2, name: "Lena Müller", score: 962, detail: "🌍 Global", avatar: "LM" },
		{ rank: 3, name: "Bilal Rehman", score: 945, detail: "🌍 Global", avatar: "BR" },
		{ rank: 4, name: "Raj Patel", score: 932, detail: "🌍 Global", avatar: "RP" },
		{ rank: 5, name: "Fatima Malik", score: 920, detail: "🌍 Global", avatar: "FM" },
		{ rank: 6, name: "Marcus Lee", score: 910, detail: "🌍 Global", avatar: "ML" },
		{ rank: 7, name: "Chen Wei", score: 905, detail: "🌍 Global", avatar: "CW" },
	],
};

type Tab = "university" | "country" | "world";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
	{ id: "university", label: "University", icon: <GraduationCap size={15} /> },
	{ id: "country", label: "Country", icon: <MapPin size={15} /> },
	{ id: "world", label: "World", icon: <Globe size={15} /> },
];

const RANK_COLORS = [
	"from-yellow-400 to-amber-500",
	"from-slate-300 to-slate-400",
	"from-orange-300 to-orange-500",
];

const RANK_ICONS = ["🥇", "🥈", "🥉"];

function getRankColor(rank: number) {
	if (rank <= 3) return RANK_COLORS[rank - 1];
	return null;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function LeaderboardModal({ onClose }: { onClose: () => void }) {
	const [activeTab, setActiveTab] = useState<Tab>("university");
	const entries = LEADERBOARD_DATA[activeTab];
	const [isVisible, setIsVisible] = useState(false);
	
	useEffect(() => {
		setIsVisible(true);
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(onClose, 200);
	};

	return (
		<>
			{/* Backdrop */}
			<div
				key="leaderboard-backdrop"
				onClick={handleClose}
				className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
			/>

			{/* Modal panel */}
			<div
				key="leaderboard-panel"
				className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card shadow-2xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 translate-y-4'}`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-border px-6 py-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<Trophy size={18} />
						</div>
						<div>
							<h2 className="font-bold text-base leading-tight">Leaderboard</h2>
							<p className="text-xs text-muted-foreground">Top performers on Varsiti</p>
						</div>
					</div>
					<button
						id="leaderboard-close-btn"
						onClick={handleClose}
						className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
					>
						<X size={16} />
					</button>
				</div>

				{/* Tabs */}
				<div className="flex gap-1 border-b border-border px-4 pt-3 pb-0">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							id={`leaderboard-tab-${tab.id}`}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
								activeTab === tab.id
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							{tab.icon}
							{tab.label}
						</button>
					))}
				</div>

				{/* Entries */}
				<div className="max-h-[420px] overflow-y-auto p-4 space-y-2">
						<div
							key={activeTab}
							className="space-y-2 animate-fade-in-up"
						>
							{entries.map((entry, i) => {
								const rankColor = getRankColor(entry.rank);
								const isTop3 = entry.rank <= 3;
								return (
									<div
										key={`${activeTab}-${entry.rank}`}
										className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors ${
											isTop3
												? "border-primary/20 bg-primary/5"
												: "border-border/50 bg-secondary/30 hover:bg-secondary/50"
										}`}
									>
										{/* Rank */}
										<div
											className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
												rankColor
													? `bg-gradient-to-br ${rankColor} text-white shadow-sm`
													: "bg-secondary text-muted-foreground"
											}`}
										>
											{isTop3 ? RANK_ICONS[entry.rank - 1] : entry.rank}
										</div>

										{/* Avatar */}
										<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary">
											{entry.avatar}
										</div>

										{/* Info */}
										<div className="flex-1 min-w-0">
											<p className="truncate text-sm font-semibold text-foreground">{entry.name}</p>
											<p className="truncate text-xs text-muted-foreground">{entry.detail}</p>
										</div>

										{/* Score */}
										<div className="shrink-0 text-right">
											<p className={`text-sm font-black ${isTop3 ? "text-primary" : "text-foreground"}`}>
												{entry.score}
											</p>
											<p className="text-[10px] text-muted-foreground">pts</p>
										</div>
									</div>
								);
							})}
						</div>
				</div>

				{/* Footer */}
				<div className="border-t border-border px-6 py-3">
					<p className="text-center text-xs text-muted-foreground">
						<Medal size={11} className="inline mr-1" />
						Leaderboard resets monthly. Rankings are based on mock test scores.
					</p>
				</div>
			</div>
		</>
	);
}
