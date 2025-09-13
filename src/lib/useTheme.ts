// src/lib/useTheme.ts
"use client";
import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "cv_theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // initial theme from localStorage or system
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "dark" || saved === "light") {
      setThemeState(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    } else {
      // look at system preference
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setThemeState(initial);
      document.documentElement.classList.toggle("dark", initial === "dark");
    }
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch (e) {}
    document.documentElement.classList.toggle("dark", t === "dark");
  }

  return { theme, setTheme };
}

export default useTheme;
