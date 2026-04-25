import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import { AIAssistantProvider } from "@/lib/AIAssistantContext";
import CustomCursor from "@/components/CustomCursor";
import CodeBackground from "@/components/CodeBackground";
import AIAssistantMount from "@/components/AIAssistantMount";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_APP_URL || "http://varsiti.vercel.app",
	),
	title: {
		default: "Varsiti | Pakistan’s Student Hub",
		template: "%s | Varsiti",
	},
	description:
		"Master C++ from Fundamentals to Advanced OOP and DSA with AI-powered guidance. Varsiti is Pakistan's premier student hub for learning.",
	openGraph: {
		title: "Varsiti | Pakistan’s Student Hub",
		description:
			"Master C++ from Fundamentals to Advanced OOP and DSA with AI-powered guidance.",
		url: "/",
		siteName: "Varsiti",
		images: [
			{
				url: "/og-image.png",
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
		title: "Varsiti | Pakistan’s Student Hub",
		description:
			"Master C++ from Fundamentals to Advanced OOP and DSA with AI-powered guidance.",
		images: ["/og-image.png"],
	},
	alternates: {
		canonical: "/",
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
							<footer className="mt-auto py-6 text-center text-sm text-muted-foreground font-light">
								Build with ❤️ by Hafiz
							</footer>
							<AIAssistantMount />
						</AIAssistantProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
