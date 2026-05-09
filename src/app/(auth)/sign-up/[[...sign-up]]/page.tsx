"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "@/lib/ThemeContext";

export default function Page() {
  const { currentTheme } = useTheme();

  return (
    <div className="flex items-center justify-center mt-6">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        appearance={{ baseTheme: currentTheme.isDark ? dark : undefined }}
      />
    </div>
  );
}
