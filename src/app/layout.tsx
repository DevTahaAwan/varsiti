import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import { AIAssistantProvider } from "@/lib/AIAssistantContext";
import ClientMounts from "@/components/ClientMounts";
import AIAssistantMount from "@/components/AIAssistantMount";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://varsiti.xyz"),
	title: {
		default: "Varsiti | Your AI-Powered C++ Learning Assistant",
		template: "%s | Varsiti",
	},
	description:
		"Master C++, OOP, and DSA with real-time AI guidance. Built for students who want to excel in coding and exams.",
	openGraph: {
		title: "Varsiti | Your AI-Powered C++ Learning Assistant",
		description:
			"Master C++, OOP, and DSA with real-time AI guidance. Built for students who want to excel in coding and exams.",
		url: "https://varsiti.xyz",
		siteName: "Varsiti",
		images: [
			{
				url: "/og-image.webp",
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
		title: "Varsiti | Master C++ with AI",
		description: "Stop struggling with code. Start mastering it with Varsiti.",
		images: ["/og-image.webp"],
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
					className={`${inter.className} h-full overflow-hidden`}
					suppressHydrationWarning
				>
					<ThemeProvider>
						<AIAssistantProvider>
							<ClientMounts />
							{children}
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
