"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "@/lib/ThemeContext";

export default function Page() {
  const { currentTheme } = useTheme();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={{ baseTheme: currentTheme.isDark ? dark : undefined }}
      />
    </div>
  );
}
