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
