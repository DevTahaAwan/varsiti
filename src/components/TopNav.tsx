"use client";

import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Palette } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, THEMES } from "@/lib/ThemeContext";
import { Playfair_Display } from "next/font/google";

const logoFont = Playfair_Display({
	subsets: ["latin"],
	weight: "700",
});

// Animated hamburger ↔ X icon
function MenuIcon({ isOpen }: { isOpen: boolean }) {
	return (
		<div className="w-5 h-5 flex flex-col justify-center gap-[5px] relative">
			<motion.span
				animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
				transition={{ duration: 0.25, ease: "easeInOut" }}
				className="block h-[2px] w-5 bg-current origin-center"
			/>
			<motion.span
				animate={
					isOpen
						? { opacity: 0, scaleX: 0 }
						: { opacity: 1, scaleX: 1 }
				}
				transition={{ duration: 0.15 }}
				className="block h-[2px] w-5 bg-current"
			/>
			<motion.span
				animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
				transition={{ duration: 0.25, ease: "easeInOut" }}
				className="block h-[2px] w-5 bg-current origin-center"
			/>
		</div>
	);
}

export default function TopNav({
	sidebarOpen,
	toggleSidebar,
}: {
	sidebarOpen: boolean;
	toggleSidebar: () => void;
}) {
	const { themeId, setTheme, currentTheme } = useTheme();
	const { isSignedIn } = useAuth();
	const [themePickerOpen, setThemePickerOpen] = useState(false);

	const lightThemes = THEMES.filter((t) => !t.isDark);
	const darkThemes = THEMES.filter((t) => t.isDark);

	return (
		<nav className="h-16 border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 gap-4">
			{/* Left: hamburger + logo */}
			<div className="flex items-center gap-3">
				{/* Hamburger → X toggle button */}
				<button
					id="sidebar-toggle"
					onClick={toggleSidebar}
					className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
					aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
				>
					<MenuIcon isOpen={sidebarOpen} />
				</button>

				<Link
					href="/"
					className="flex flex-row items-center gap-2.5 group"
				>
					<div className="bg-primary/10 p-1.5 rounded-xl group-hover:bg-primary/20 transition-colors">
						<Image
							src="/logo.png"
							alt="Varsiti Logo"
							width={30}
							height={30}
							className="object-contain"
						/>
					</div>
					<span
						className={`${logoFont.className} text-[1.35rem] tracking-wide text-primary drop-shadow-sm normal-case`}
					>
						Varsiti
					</span>
				</Link>
			</div>

			{/* Right: theme picker + auth */}
			<div className="flex items-center gap-2">
				{/* Theme Picker */}
				<div className="relative">
					<button
						id="theme-picker-btn"
						onClick={() => setThemePickerOpen((o) => !o)}
						className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
					>
						<Palette size={18} />
						<span className="hidden sm:inline">
							{currentTheme.emoji} {currentTheme.label}
						</span>
					</button>

					<AnimatePresence>
						{themePickerOpen && (
							<>
								<div
									className="fixed inset-0 z-40"
									onClick={() => setThemePickerOpen(false)}
								/>
								<motion.div
									initial={{ opacity: 0, y: -8, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: -8, scale: 0.95 }}
									transition={{ duration: 0.15 }}
									className="absolute right-0 top-12 z-50 bg-card border border-border rounded-2xl shadow-2xl p-4 w-72"
								>
									<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
										☀️ Light Themes
									</p>
									<div className="grid grid-cols-2 gap-2 mb-4">
										{lightThemes.map((theme) => (
											<button
												key={theme.id}
												onClick={() => {
													setTheme(theme.id);
													setThemePickerOpen(false);
												}}
												className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${themeId === theme.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:bg-secondary"}`}
											>
												<div className="flex shrink-0">
													{theme.preview.map(
														(c, i) => (
															<div
																key={i}
																className="w-3 h-6 first:rounded-l-md last:rounded-r-md"
																style={{
																	backgroundColor:
																		c,
																}}
															/>
														),
													)}
												</div>
												<span className="text-xs font-semibold truncate">
													{theme.emoji} {theme.label}
												</span>
											</button>
										))}
									</div>
									<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
										🌙 Dark Themes
									</p>
									<div className="grid grid-cols-2 gap-2">
										{darkThemes.map((theme) => (
											<button
												key={theme.id}
												onClick={() => {
													setTheme(theme.id);
													setThemePickerOpen(false);
												}}
												className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${themeId === theme.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:bg-secondary"}`}
											>
												<div className="flex shrink-0">
													{theme.preview.map(
														(c, i) => (
															<div
																key={i}
																className="w-3 h-6 first:rounded-l-md last:rounded-r-md"
																style={{
																	backgroundColor:
																		c,
																}}
															/>
														),
													)}
												</div>
												<span className="text-xs font-semibold truncate">
													{theme.emoji} {theme.label}
												</span>
											</button>
										))}
									</div>
								</motion.div>
							</>
						)}
					</AnimatePresence>
				</div>

				{/* Auth */}
				<div className="pl-2 border-l border-border flex items-center">
					{!isSignedIn ? (
						<SignInButton mode="modal">
							<button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
								Sign In
							</button>
						</SignInButton>
					) : (
						<UserButton
							appearance={{
								elements: {
									/* ── Avatar trigger chip ── */
									userButtonTrigger: {
										borderRadius: "12px",
										padding: "2px",
										border: "2px solid var(--primary)",
										transition: "box-shadow 0.2s",
										boxShadow: "0 0 0 0 var(--ring)",
									},
									avatarBox: {
										width: "32px",
										height: "32px",
										borderRadius: "10px",
									},

									/* ── Dropdown popover card ── */
									userButtonPopoverCard: {
										backgroundColor:
											"color-mix(in oklab, var(--card) 88%, transparent)",
										backdropFilter: "blur(18px)",
										border: "1px solid color-mix(in oklab, var(--border) 85%, transparent)",
										borderRadius: "20px",
										boxShadow:
											"6px 6px 24px rgba(0,0,0,0.18), -4px -4px 12px rgba(255,255,255,0.06)",
										padding: "8px",
										color: "var(--foreground)",
										minWidth: "260px",
									},
									userButtonPopoverActionButton: {
										borderRadius: "12px",
										color: "var(--foreground)",
										fontSize: "13px",
										fontWeight: "600",
										padding: "10px 14px",
										transition: "background 0.15s",
									},
									userButtonPopoverActionButton__manageAccount:
										{
											color: "var(--foreground)",
										},
									userButtonPopoverActionButton__signOut: {
										color: "var(--foreground)",
									},
									userButtonPopoverActionButtonText: {
										color: "var(--foreground)",
									},
									userButtonPopoverActionButtonIcon: {
										color: "var(--muted-foreground)",
									},
									userButtonPopoverFooter: {
										display: "none",
									},
									userPreviewMainIdentifier: {
										color: "var(--foreground) !important",
										fontWeight: "700",
									},
									userPreviewSecondaryIdentifier: {
										color: "var(--muted-foreground) !important",
										fontSize: "12px",
									},
									userPreviewAvatarBox: {
										width: "40px",
										height: "40px",
										borderRadius: "12px",
									},

									/* ── Full account management modal ── */
									rootBox: { fontFamily: "inherit" },
									card: {
										backgroundColor:
											"color-mix(in oklab, var(--card) 90%, transparent)",
										backdropFilter: "blur(20px)",
										border: "1px solid color-mix(in oklab, var(--border) 85%, transparent)",
										borderRadius: "24px",
										boxShadow:
											"6px 6px 24px rgba(0,0,0,0.18), -4px -4px 12px rgba(255,255,255,0.06)",
									},
									navbar: {
										backgroundColor: "#f9fafb",
										borderRight: "1px solid #e5e7eb",
										borderRadius: "18px 0 0 18px",
									},
									navbarButton: {
										color: "#374151 !important",
										borderRadius: "12px",
										fontWeight: "600",
										fontSize: "13px",
										padding: "10px 14px",
										transition: "background 0.15s, color 0.15s",
									},
									navbarButtonIcon: {
										color: "#4b5563 !important",
									},
									pageScrollBox: {
										padding: "24px",
										backgroundColor: "transparent",
									},
									profileSectionTitle: {
										color: "var(--foreground)",
										fontWeight: "700",
										fontSize: "15px",
										borderBottom: "1px solid var(--border)",
										paddingBottom: "12px",
										marginBottom: "16px",
									},
									profileSectionTitleText: {
										color: "var(--foreground)",
										fontWeight: "700",
									},
									profileSectionContent: {
										color: "var(--foreground)",
									},
									profileSectionPrimaryButton: {
										backgroundColor: "transparent",
										border: "1px solid var(--border)",
										borderRadius: "12px",
										color: "var(--foreground)",
										fontWeight: "600",
										fontSize: "13px",
										padding: "8px 14px",
										transition: "background 0.15s",
									},
									accordionTriggerButton: {
										color: "var(--foreground)",
										fontWeight: "600",
									},
									formFieldLabel: {
										color: "var(--foreground)",
										fontWeight: "600",
										fontSize: "13px",
									},
									formFieldInput: {
										backgroundColor:
											"color-mix(in oklab, var(--input) 96%, transparent)",
										border: "1px solid color-mix(in oklab, var(--border) 90%, transparent)",
										borderRadius: "12px",
										color: "var(--foreground)",
										fontSize: "14px",
										padding: "10px 14px",
										outline: "none",
									},
									formButtonPrimary: {
										backgroundColor: "var(--primary)",
										color: "var(--primary-foreground)",
										borderRadius: "12px",
										fontWeight: "700",
										fontSize: "13px",
										padding: "10px 20px",
										border: "none",
										transition: "opacity 0.15s",
									},
									formButtonReset: {
										borderRadius: "12px",
										border: "1px solid color-mix(in oklab, var(--border) 90%, transparent)",
										color: "var(--foreground)",
										fontWeight: "600",
										fontSize: "13px",
										padding: "10px 20px",
										transition: "background 0.15s",
									},
									badge: {
										backgroundColor: "var(--primary)",
										color: "var(--primary-foreground)",
										borderRadius: "8px",
										fontWeight: "700",
										fontSize: "11px",
									},
									headerTitle: {
										color: "var(--foreground)",
										fontWeight: "800",
									},
									headerSubtitle: {
										color: "var(--muted-foreground)",
									},
									identityPreviewText: {
										color: "var(--foreground)",
									},
									identityPreviewEditButton: {
										color: "var(--primary)",
									},
									dividerLine: {
										backgroundColor: "var(--border)",
									},
									dividerText: {
										color: "var(--muted-foreground)",
										fontSize: "12px",
									},
									footer: { display: "none" },
									footerActionText: {
										color: "var(--muted-foreground)",
									},
									footerActionLink: {
										color: "var(--primary)",
									},
									socialButtonsBlockButton: {
										border: "1px solid var(--border)",
										borderRadius: "12px",
										color: "var(--foreground)",
										fontWeight: "600",
										fontSize: "13px",
										padding: "10px 14px",
										backgroundColor: "var(--secondary)",
										transition: "background 0.15s",
									},
									socialButtonsBlockButtonText: {
										color: "var(--foreground)",
										fontWeight: "600",
									},
									alternativeMethodsBlockButton: {
										border: "1px solid var(--border)",
										borderRadius: "12px",
										color: "var(--foreground)",
										backgroundColor: "var(--secondary)",
									},
								},
							}}
						/>
					)}
				</div>
			</div>
		</nav>
	);
}
