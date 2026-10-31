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
    "grid h-6 min-w-6 place-items-center rounded px-1 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer";

  return (
    <div className="bg-slate-950 text-slate-300 border-b border-white/5 select-none text-[11px]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-saffron focus:px-3 focus:py-1 focus:text-slate-950 font-bold"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-8 max-w-7xl items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <img src={flag} alt="India Flag" className="h-3.5 w-5 shrink-0 rounded-xs" />
          <span className="truncate font-semibold tracking-wide text-slate-300">
            भारत सरकार <span className="text-slate-600">/</span> Government of India
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1" role="toolbar" aria-label="Accessibility options">
          <a
            href="#main"
            className="hidden sm:flex items-center gap-1 h-6 px-1.5 rounded text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Screen reader access"
          >
            <Volume2 className="h-3 w-3" />
            <span>Screen Reader</span>
          </a>
          <span className="mx-1 hidden h-3.5 w-px bg-white/15 sm:block" />
          <button className={btn} onClick={() => step(-1)} aria-label="Decrease text size" title="Decrease font size">
            A−
          </button>
          <button className={btn} onClick={() => setSize(16)} aria-label="Reset text size" title="Normal font size">
            A
          </button>
          <button className={btn} onClick={() => step(1)} aria-label="Increase text size" title="Increase font size">
            A+
          </button>
          <button
            className={btn}
            onClick={() => setContrast((c) => !c)}
            aria-pressed={contrast}
            aria-label="Toggle high contrast"
            title="Toggle High Contrast"
          >
            <Contrast className="h-3.5 w-3.5" />
          </button>
          <span className="mx-0.5 h-3.5 w-px bg-white/15" />
          <button
            className={btn}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}