import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function Page() {
  return (
    <SignIn
      forceRedirectUrl="/select-language"
      appearance={{
        layout: { applicationName: "Varsity" },
        elements: {
          rootBox: "w-full max-w-md",
          card: "clay-card bg-card",
          headerTitle: "text-foreground font-extrabold",
          headerSubtitle: "text-muted-foreground",
          /* Social buttons (GitHub, Google, etc.) */
          socialButtonsBlockButton:
            "border border-border text-foreground hover:bg-secondary transition-colors font-semibold rounded-xl",
          socialButtonsBlockButtonText: "text-foreground font-semibold",
          socialButtonsBlockButtonArrow: "text-muted-foreground",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground text-xs",
          formFieldLabel: "text-foreground font-semibold text-sm",
          formFieldInput:
            "bg-input border border-border text-foreground rounded-xl px-3 py-2 focus:ring-1 focus:ring-ring outline-none transition",
          formFieldInputShowPasswordButton: "text-muted-foreground",
          footerActionText: "text-muted-foreground",
          footerActionLink: "text-primary hover:text-primary/80 font-semibold",
          identityPreviewText: "text-foreground",
          identityPreviewEditButton: "text-primary",
          formButtonPrimary:
            "bg-primary text-primary-foreground hover:opacity-90 font-bold rounded-xl transition-opacity",
          alert: "bg-secondary border border-border text-foreground rounded-xl",
          alertText: "text-foreground",
          alternativeMethodsBlockButton:
            "border border-border text-foreground hover:bg-secondary font-semibold rounded-xl",
        },
      }}
    />
  );
}
