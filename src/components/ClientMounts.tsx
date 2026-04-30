"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const CodeBackground = dynamic(() => import("@/components/CodeBackground"), { ssr: false });

export default function ClientMounts() {
    return (
        <>
            <CodeBackground />
            <CustomCursor />
        </>
    );
}
