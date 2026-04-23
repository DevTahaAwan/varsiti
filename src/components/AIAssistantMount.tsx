"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const AIAssistant = dynamic(() => import("@/components/AIAssistant"), {
	ssr: false,
});

export default function AIAssistantMount() {
	const pathname = usePathname();
	const hideOnExamWeeks = /^\/study\/(9|17)(\/|$)/.test(pathname);

	if (hideOnExamWeeks) {
		return null;
	}

	return <AIAssistant />;
}
