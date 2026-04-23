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
	title: "Varsiti - Learn C++ Completely",
	description:
		"Master C++ from Fundamentals to Advanced OOP and DSA with AI-powered guidance.",
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
