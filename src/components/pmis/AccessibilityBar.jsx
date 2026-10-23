import { useEffect, useState } from "react";
import { Contrast, Volume2, Sun, Moon } from "lucide-react";
import flag from "@/assets/indian_flag.svg";
import { getTheme, toggleTheme } from "@/lib/theme";

const SIZES = [14, 16, 18, 20];

export default function AccessibilityBar() {
  const [size, setSize] = useState(16);
  const [contrast, setContrast] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(getTheme());
    const handler = (e) => setTheme(e.detail || getTheme());
    window.addEventListener("pmis_theme_changed", handler);
    return () => window.removeEventListener("pmis_theme_changed", handler);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--base-size", size + "px");
  }, [size]);
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", contrast);
  }, [contrast]);

  const step = (d) => {
    const i = SIZES.indexOf(size) + d;
    if (i >= 0 && i < SIZES.length) setSize(SIZES[i]);
  };

  const btn =
    "grid h-7 min-w-7 place-items-center rounded-md px-1.5 text-xs font-semibold transition-colors hover:bg-ink-foreground/10 cursor-pointer";

  return (
    <div className="bg-ink text-ink-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-saffron focus:px-3 focus:py-1 focus:text-saffron-foreground"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-3 px-4 text-xs sm:text-sm">
        <div className="flex min-w-0 items-center gap-2">
          <img src={flag} alt="" className="h-4 w-6 shrink-0 rounded-sm" />
          <span className="truncate">भारत सरकार <span className="opacity-50">/</span> Government of India</span>
        </div>
        <div className="flex shrink-0 items-center gap-1" role="toolbar" aria-label="Accessibility options">
          <a href="#main" className={btn + " hidden gap-1 sm:flex"} aria-label="Screen reader access">
            <Volume2 className="h-3.5 w-3.5" /> <span className="ml-1">Screen Reader</span>
          </a>
          <span className="mx-1 hidden h-4 w-px bg-ink-foreground/20 sm:block" />
          <button className={btn} onClick={() => step(-1)} aria-label="Decrease text size">A−</button>
          <button className={btn} onClick={() => setSize(16)} aria-label="Reset text size">A</button>
          <button className={btn} onClick={() => step(1)} aria-label="Increase text size">A+</button>
          <button
            className={btn}
            onClick={() => setContrast((c) => !c)}
            aria-pressed={contrast}
            aria-label="Toggle high contrast"
            title="High Contrast"
          >
            <Contrast className="h-4 w-4" />
          </button>
          <span className="mx-0.5 h-4 w-px bg-ink-foreground/20" />
          <button
            className={btn}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
