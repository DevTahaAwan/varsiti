"use client";

import { useState } from "react";
import { X, Trophy, Globe, GraduationCap, MapPin, Medal } from "lucide-react";

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

export default function LeaderboardPanel({ onClose }: { onClose: () => void }) {
	const [activeTab, setActiveTab] = useState<Tab>("university");
	const entries = LEADERBOARD_DATA[activeTab];

	return (
		<div className="w-72 h-full flex flex-col bg-card/80 backdrop-blur-xl">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-border/70 px-5 py-4 bg-card/55 backdrop-blur-md shrink-0">
				<div className="flex items-center gap-2.5">
					<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<Trophy size={16} />
					</div>
					<div>
						<h2 className="font-bold text-sm leading-tight">Leaderboard</h2>
					</div>
				</div>
				<button
					onClick={onClose}
					className="flex p-1.5 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
				>
					<X size={16} />
				</button>
			</div>

			{/* Tabs */}
			<div className="flex gap-1 border-b border-border/70 px-4 pt-3 pb-0 shrink-0">
				{TABS.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex items-center justify-center flex-1 gap-1.5 rounded-t-xl py-2 text-[11px] font-semibold transition-colors border-b-2 -mb-px ${
							activeTab === tab.id
								? "border-primary text-primary"
								: "border-transparent text-muted-foreground hover:text-foreground"
						}`}
					>
						{tab.icon}
						<span className="hidden sm:inline">{tab.label}</span>
					</button>
				))}
			</div>

			{/* Entries */}
			<div className="flex-1 overflow-y-auto p-3 space-y-1.5">
				{entries.map((entry) => {
					const rankColor = getRankColor(entry.rank);
					const isTop3 = entry.rank <= 3;
					return (
						<div
							key={`${activeTab}-${entry.rank}`}
							className={`flex items-center gap-2 rounded-xl border p-2 transition-colors ${
								isTop3
									? "border-primary/20 bg-primary/5"
									: "border-border/50 bg-secondary/30 hover:bg-secondary/50"
							}`}
						>
							<div
								className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
									rankColor
										? `bg-gradient-to-br ${rankColor} text-white shadow-sm`
										: "bg-secondary text-muted-foreground"
								}`}
							>
								{isTop3 ? RANK_ICONS[entry.rank - 1] : entry.rank}
							</div>
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-black text-primary">
								{entry.avatar}
							</div>
							<div className="flex-1 min-w-0">
								<p className="truncate text-[11px] font-semibold text-foreground">{entry.name}</p>
								<p className="truncate text-[9px] text-muted-foreground">{entry.detail}</p>
							</div>
							<div className="shrink-0 text-right">
								<p className={`text-xs font-black ${isTop3 ? "text-primary" : "text-foreground"}`}>
									{entry.score}
								</p>
							</div>
						</div>
					);
				})}
			</div>

			{/* Footer */}
			<div className="border-t border-border/70 px-4 py-3 shrink-0">
				<p className="text-center text-[10px] text-muted-foreground">
					<Medal size={10} className="inline mr-1" />
					Resets monthly. Based on mock tests.
				</p>
			</div>
		</div>
	);
}
