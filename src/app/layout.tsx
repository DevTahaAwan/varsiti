import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import { AIAssistantProvider } from "@/lib/AIAssistantContext";
import CustomCursor from "@/components/CustomCursor";
import CodeBackground from "@/components/CodeBackground";
import AIAssistantMount from "@/components/AIAssistantMount";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://varsiti.xyz"),
	title: {
		default: "Varsiti | Master C++, OOP & DSA for Pakistan's Tech Students",
		template: "%s | Varsiti",
	},
	description:
		"Master C++ from fundamentals to advanced OOP and DSA with AI-powered guidance. Join Pakistan’s premier student hub to build your coding portfolio and career.",
	openGraph: {
		title: "Varsiti | Master C++, OOP & DSA for Pakistan's Tech Students",
		description:
			"Master C++ from fundamentals to advanced OOP and DSA with AI-powered guidance. Join Pakistan’s premier student hub to build your coding portfolio and career.",
		url: "/",
		siteName: "Varsiti",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Varsiti Open Graph Image",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Varsiti | Master C++, OOP & DSA for Pakistan's Tech Students",
		description:
			"Master C++ from fundamentals to advanced OOP and DSA with AI-powered guidance. Join Pakistan’s premier student hub to build your coding portfolio and career.",
		images: ["/og-image.jpg"],
	},
	alternates: {
		canonical: "/",
	},
	verification: {
		google: "bx_BNKUDmcyo64AnKgVPLuH5qjHnc0TY4-p0uVqROL8",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html
				lang="en"
				className="h-full antialiased"
				suppressHydrationWarning
			>
				<body
					className={`${inter.className} min-h-full flex flex-col`}
					suppressHydrationWarning
				>
					<ThemeProvider>
						<AIAssistantProvider>
							<CodeBackground />
							<CustomCursor />
							<main className="flex-grow flex flex-col">
								{children}
							</main>
							<footer className="mt-auto py-6 text-center text-xs text-foreground/60 font-medium flex flex-col items-center gap-1">
								<span style={{ textShadow: "0 0 12px rgba(var(--primary-rgb, 99 102 241) / 0.3)" }}>
									Build with ❤️ by Hafiz
								</span>
								<span className="opacity-50">v1.4.0</span>
							</footer>
							<AIAssistantMount />
						</AIAssistantProvider>
					</ThemeProvider>
					<Analytics />
					<SpeedInsights />
				</body>
			</html>
		</ClerkProvider>
	);
}
