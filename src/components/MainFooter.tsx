"use client";

import { ArrowUp } from "lucide-react";

export default function MainFooter() {
  const handleBackToTop = () => {
    const mainContainer = document.getElementById("main-scroll-container");
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-10 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm px-4 md:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">© Copyright Varstiti Inc.</p>
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-md bg-primary/10 text-primary border border-primary/20">v1.1.0</span>
        </div>
        <p className="text-xs text-muted-foreground">All rights reserved • Crafted for focused OOP learning and exam excellence.</p>
      </div>

      <button
        onClick={handleBackToTop}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-semibold"
      >
        <ArrowUp size={15} />
        Back to Top
      </button>
    </footer>
  );
}
