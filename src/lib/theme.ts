// Global Theme Management for PM Internship Portal (Dark / Light Mode)

export type ThemeMode = "light" | "dark";

export function getTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem("pmis_theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function applyTheme(theme: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const isDark = theme === "dark";

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  root.style.colorScheme = isDark ? "dark" : "light";

  try {
    localStorage.setItem("pmis_theme", theme);
  } catch {
    // Ignore storage quota errors
  }

  window.dispatchEvent(new CustomEvent("pmis_theme_changed", { detail: theme }));
}

export function toggleTheme(): ThemeMode {
  const current = getTheme();
  const next: ThemeMode = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
