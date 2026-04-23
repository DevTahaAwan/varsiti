"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeId = 
  | "emerald"        // default green
  | "vintage-grape"  // light: purple+grey palette
  | "nature"         // light: deep green palette
  | "terracotta"     // light: dark+burnt orange
  | "periwinkle"     // light: almond+dusty grape
  | "dark-amber"     // dark: yellow + black
  | "dark-ocean"     // dark: dark blue + grey
  | "dark-violet"    // dark: dark purple + lavender
  | "vintage-grey"   // dark: warm sage + brown
  | "jet-black";     // dark: pure black + silver

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  isDark: boolean;
  emoji: string;
  preview: [string, string, string]; // 3 preview colors
  vars: Record<string, string>;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "emerald",
    label: "Emerald",
    isDark: false,
    emoji: "🌿",
    preview: ["#f0fdfa", "#10b981", "#065f46"],
    vars: {
      "--background": "#f0fdfa",
      "--foreground": "#0f172a",
      "--card": "#ffffff",
      "--card-foreground": "#0f172a",
      "--primary": "#10b981",
      "--primary-foreground": "#ffffff",
      "--secondary": "#f1f5f9",
      "--secondary-foreground": "#0f172a",
      "--muted": "#f1f5f9",
      "--muted-foreground": "#64748b",
      "--accent": "#d1fae5",
      "--accent-foreground": "#065f46",
      "--border": "#e2e8f0",
      "--input": "#e2e8f0",
      "--ring": "#10b981",
    }
  },
  {
    id: "vintage-grape",
    label: "Vintage Grape",
    isDark: false,
    emoji: "🍇",
    preview: ["#f2f0f7", "#8B5CF6", "#413C58"],
    vars: {
      "--background": "#f2f0f7",
      "--foreground": "#413C58",
      "--card": "#ffffff",
      "--card-foreground": "#413C58",
      "--primary": "#8B5CF6",
      "--primary-foreground": "#ffffff",
      "--secondary": "#ede9f8",
      "--secondary-foreground": "#413C58",
      "--muted": "#ede9f8",
      "--muted-foreground": "#6b5f87",
      "--accent": "#A3C4BC",
      "--accent-foreground": "#413C58",
      "--border": "#d8d0ee",
      "--input": "#d8d0ee",
      "--ring": "#8B5CF6",
    }
  },
  {
    id: "nature",
    label: "Nature",
    isDark: false,
    emoji: "🌲",
    preview: ["#f0f7f0", "#58641D", "#002400"],
    vars: {
      "--background": "#f0f4ee",
      "--foreground": "#002400",
      "--card": "#ffffff",
      "--card-foreground": "#002400",
      "--primary": "#58641D",
      "--primary-foreground": "#ffffff",
      "--secondary": "#e4ebda",
      "--secondary-foreground": "#273B09",
      "--muted": "#e4ebda",
      "--muted-foreground": "#4a5c2a",
      "--accent": "#DBD2E0",
      "--accent-foreground": "#002400",
      "--border": "#c7d8a3",
      "--input": "#c7d8a3",
      "--ring": "#7B904B",
    }
  },
  {
    id: "terracotta",
    label: "Terracotta",
    isDark: false,
    emoji: "🏺",
    preview: ["#fdf0ec", "#BC5F04", "#010001"],
    vars: {
      "--background": "#fdf0ec",
      "--foreground": "#010001",
      "--card": "#ffffff",
      "--card-foreground": "#010001",
      "--primary": "#BC5F04",
      "--primary-foreground": "#ffffff",
      "--secondary": "#fbe3d6",
      "--secondary-foreground": "#2B0504",
      "--muted": "#fbe3d6",
      "--muted-foreground": "#874000",
      "--accent": "#F4442E22",
      "--accent-foreground": "#010001",
      "--border": "#f0c5ad",
      "--input": "#f0c5ad",
      "--ring": "#BC5F04",
    }
  },
  {
    id: "periwinkle",
    label: "Periwinkle",
    isDark: false,
    emoji: "🌸",
    preview: ["#F1DAC4", "#474973", "#161B33"],
    vars: {
      "--background": "#fdf6f0",
      "--foreground": "#161B33",
      "--card": "#ffffff",
      "--card-foreground": "#161B33",
      "--primary": "#474973",
      "--primary-foreground": "#ffffff",
      "--secondary": "#f5e8dd",
      "--secondary-foreground": "#161B33",
      "--muted": "#f5e8dd",
      "--muted-foreground": "#A69CAC",
      "--accent": "#F1DAC4",
      "--accent-foreground": "#161B33",
      "--border": "#e8cebe",
      "--input": "#e8cebe",
      "--ring": "#474973",
    }
  },
  {
    id: "dark-amber",
    label: "Dark Amber",
    isDark: true,
    emoji: "🔥",
    preview: ["#0c0a00", "#F59E0B", "#ffffff"],
    vars: {
      "--background": "#0a0800",
      "--foreground": "#fef3c7",
      "--card": "#1a1400",
      "--card-foreground": "#fef3c7",
      "--primary": "#F59E0B",
      "--primary-foreground": "#000000",
      "--secondary": "#241d00",
      "--secondary-foreground": "#fef3c7",
      "--muted": "#241d00",
      "--muted-foreground": "#d97706",
      "--accent": "#78350f",
      "--accent-foreground": "#fef3c7",
      "--border": "#3a2e00",
      "--input": "#3a2e00",
      "--ring": "#F59E0B",
    }
  },
  {
    id: "dark-ocean",
    label: "Dark Ocean",
    isDark: true,
    emoji: "🌊",
    preview: ["#0d1b2a", "#60A5FA", "#94a3b8"],
    vars: {
      "--background": "#0d1b2a",
      "--foreground": "#e2e8f0",
      "--card": "#152131",
      "--card-foreground": "#e2e8f0",
      "--primary": "#60A5FA",
      "--primary-foreground": "#0d1b2a",
      "--secondary": "#1e3448",
      "--secondary-foreground": "#e2e8f0",
      "--muted": "#1e3448",
      "--muted-foreground": "#94a3b8",
      "--accent": "#1e40af",
      "--accent-foreground": "#e2e8f0",
      "--border": "#1e3448",
      "--input": "#1e3448",
      "--ring": "#60A5FA",
    }
  },
  {
    id: "dark-violet",
    label: "Dark Violet",
    isDark: true,
    emoji: "💜",
    preview: ["#0f0a1a", "#A78BFA", "#C4B5FD"],
    vars: {
      "--background": "#0f0a1a",
      "--foreground": "#ede9fe",
      "--card": "#1a1128",
      "--card-foreground": "#ede9fe",
      "--primary": "#A78BFA",
      "--primary-foreground": "#0f0a1a",
      "--secondary": "#241a3a",
      "--secondary-foreground": "#ede9fe",
      "--muted": "#241a3a",
      "--muted-foreground": "#9d87c7",
      "--accent": "#4c1d95",
      "--accent-foreground": "#ede9fe",
      "--border": "#2d2048",
      "--input": "#2d2048",
      "--ring": "#A78BFA",
    }
  },
  {
    id: "vintage-grey",
    label: "Vintage Grey",
    isDark: true,
    emoji: "🪨",
    preview: ["#2a2826", "#9CAEA9", "#CCDA01"],
    vars: {
      "--background": "#1e1c1a",
      "--foreground": "#CCDA01",
      "--card": "#2a2826",
      "--card-foreground": "#d8cfc9",
      "--primary": "#9CAEA9",
      "--primary-foreground": "#1e1c1a",
      "--secondary": "#353230",
      "--secondary-foreground": "#d8cfc9",
      "--muted": "#353230",
      "--muted-foreground": "#9CAEA9",
      "--accent": "#6F6868",
      "--accent-foreground": "#d8cfc9",
      "--border": "#4a4542",
      "--input": "#3b3835",
      "--ring": "#9CAEA9",
    }
  },
  {
    id: "jet-black",
    label: "Jet Black",
    isDark: true,
    emoji: "🖤",
    preview: ["#000000", "#66666E", "#F4F4F6"],
    vars: {
      "--background": "#000000",
      "--foreground": "#F4F4F6",
      "--card": "#0d0d0d",
      "--card-foreground": "#F4F4F6",
      "--primary": "#9999A1",
      "--primary-foreground": "#000000",
      "--secondary": "#111111",
      "--secondary-foreground": "#E6E6E9",
      "--muted": "#1a1a1a",
      "--muted-foreground": "#66666E",
      "--accent": "#222222",
      "--accent-foreground": "#F4F4F6",
      "--border": "#2a2a2a",
      "--input": "#1a1a1a",
      "--ring": "#9999A1",
    }
  },
];

interface ThemeContextType {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  currentTheme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  themeId: "emerald",
  setTheme: () => {},
  currentTheme: THEMES[0],
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return "emerald";
    const saved = localStorage.getItem("varsiti-theme") as ThemeId | null;
    return saved && THEMES.find(t => t.id === saved) ? saved : "emerald";
  });

  // Apply theme vars to document root
  function applyTheme(theme: ThemeConfig) {
    const root = document.documentElement;
    // Toggle dark class
    if (theme.isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Apply CSS variables
    Object.entries(theme.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }

  const setTheme = (id: ThemeId) => {
    const theme = THEMES.find(t => t.id === id) || THEMES[0];
    setThemeId(id);
    applyTheme(theme);
    localStorage.setItem("varsiti-theme", id);
  };

  useEffect(() => {
    applyTheme(THEMES.find(t => t.id === themeId) || THEMES[0]);
  }, [themeId]);

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ themeId, setTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
