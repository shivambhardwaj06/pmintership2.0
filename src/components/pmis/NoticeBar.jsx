import { useState } from "react";
import { Megaphone, Pause, Play, X } from "lucide-react";

const TEXT =
  "Interns under Round II who have been provided ₹456 for insurance benefits under PMJJBY and PMSBY must update their details on the PMIS Portal by 15.05.2026, failing which ₹456 will be deducted from the Government assistance.";

export default function NoticeBar() {
  const [paused, setPaused] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-3 pb-1 transition-all">
      <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-amber-500/20 dark:border-amber-500/20 bg-amber-50/80 dark:bg-amber-950/30 py-2 pl-3.5 pr-2.5 text-slate-800 dark:text-amber-200 text-xs backdrop-blur-md shadow-xs">
        <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
          <Megaphone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span>Notice</span>
        </span>

        <div className="relative min-w-0 flex-1 overflow-hidden" aria-live="off">
          <div
            className="marquee flex w-max gap-16 whitespace-nowrap text-xs font-semibold"
            style={{ animationPlayState: paused ? "paused" : "running" }}
          >
            <span>{TEXT}</span>
            <span aria-hidden="true">{TEXT}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play notice" : "Pause notice"}
            className="rounded-lg p-1 text-slate-500 hover:text-slate-900 dark:text-amber-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
            title={paused ? "Play animation" : "Pause animation"}
          >
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss notice"
            className="rounded-lg p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
            title="Dismiss notice"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}