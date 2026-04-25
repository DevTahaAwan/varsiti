import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
      <path d="M12 .5C5.73.5.7 5.62.7 12.02c0 5.12 3.29 9.46 7.86 11 .58.11.79-.26.79-.57 0-.28-.01-1.02-.02-2-3.2.71-3.87-1.58-3.87-1.58-.53-1.38-1.29-1.75-1.29-1.75-1.05-.75.08-.74.08-.74 1.16.08 1.77 1.21 1.77 1.21 1.03 1.82 2.7 1.29 3.36.99.1-.76.4-1.29.72-1.59-2.56-.29-5.25-1.3-5.25-5.78 0-1.28.44-2.32 1.16-3.14-.12-.29-.5-1.45.11-3.02 0 0 .94-.31 3.09 1.2a10.39 10.39 0 0 1 5.62 0c2.15-1.5 3.09-1.2 3.09-1.2.61 1.57.23 2.73.11 3.02.72.82 1.16 1.86 1.16 3.14 0 4.49-2.7 5.49-5.27 5.77.41.36.78 1.08.78 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.69.8.57A11.53 11.53 0 0 0 23.3 12.02C23.3 5.62 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
      <path d="M19.54 3H4.46A1.46 1.46 0 0 0 3 4.46v15.08A1.46 1.46 0 0 0 4.46 21h15.08A1.46 1.46 0 0 0 21 19.54V4.46A1.46 1.46 0 0 0 19.54 3ZM8.07 18.06H5.4V9.39h2.67v8.67ZM6.74 8.23a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1Zm11.32 9.83h-2.67v-4.21c0-1-.02-2.3-1.4-2.3-1.4 0-1.61 1.09-1.61 2.22v4.29h-2.67V9.39h2.56v1.18h.04c.36-.69 1.26-1.4 2.59-1.4 2.77 0 3.28 1.82 3.28 4.19v4.7Z" />
    </svg>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer's Note",
};

export default function AboutPage() {
  return (
    <section className="max-w-4xl mx-auto py-8 md:py-12">
      <div className="rounded-3xl border border-border/60 bg-card shadow-sm p-6 md:p-10 space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">About Varsiti</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Developer&apos;s Note</h1>
          <p className="text-foreground/85 leading-relaxed">
            Assalamualaikum! I&apos;m <strong>Hafiz Muhammad Taha</strong>, and I built Varsiti to make OOP learning practical,
            confidence-boosting, and genuinely enjoyable. The mission is simple: make students feel guided, not lost.
            I hope this platform helps you turn confusion into clarity, and practice into real exam strength.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="https://github.com/DevTahaAwan"
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 hover:border-primary/40 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
                <GitHubMark />
              </span>
              <h2 className="font-bold text-lg group-hover:text-primary transition-colors">GitHub</h2>
            </div>
            <p className="text-sm text-muted-foreground">Checkout and follow for projects, experiments, and learning resources.</p>
          </Link>

          <Link
            href="https://www.linkedin.com/in/dev-tahawan/"
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-border bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent p-5 hover:border-sky-400/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl bg-[#0077b5] text-white flex items-center justify-center shadow-sm">
                <LinkedInMark />
              </span>
              <h2 className="font-bold text-lg text-sky-600 dark:text-sky-400">LinkedIn</h2>
            </div>
            <p className="text-sm text-muted-foreground">Connect for updates, mentorship vibes, and professional journey highlights.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/40 p-5 md:p-6 space-y-3">
          <p className="font-semibold text-foreground/90 flex items-center gap-2">
            <Sparkles size={16} className="text-primary" /> Keep this close:
          </p>
          <p className="text-foreground/85">
            Keep showing up. Every bug solved sharpens your thinking. Every concept learned compounds into confidence.
          </p>
          <blockquote className="border-l-4 border-primary/50 pl-4 italic text-foreground/80">
            “Success in coding is not magic — it is consistency with curiosity.”
          </blockquote>
        </div>

        <div className="pt-2 space-y-1.5">
          <p className="text-lg font-bold text-primary">Happy Coding Journey</p>
          <p className="text-foreground/90">Regards</p>
          <p className="text-foreground/90">Hafiz Muhammad Taha</p>
          <p className="text-muted-foreground">Founder/CEO Varsiti</p>
          <p className="pt-3 font-semibold flex items-center gap-2">
            Build with <Heart size={16} className="text-red-500" fill="currentColor" /> By Hafiz Taha
          </p>
        </div>
      </div>
    </section>
  );
}
