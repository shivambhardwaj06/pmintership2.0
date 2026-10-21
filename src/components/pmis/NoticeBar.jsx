import { useState } from "react";
import { Megaphone, Pause, Play } from "lucide-react";

const TEXT =
  "Interns under Round II who have been provided ₹456 for insurance benefits under PMJJBY and PMSBY must update their details on the PMIS Portal by 15.05.2026, failing which ₹456 will be deducted from the Government assistance.";

export default function NoticeBar() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="mx-auto max-w-7xl px-4 pt-4">
      <div className="flex items-center gap-3 overflow-hidden rounded-2xl border bg-notice py-2 pl-3 pr-2 text-notice-foreground">
        <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-saffron px-2.5 py-1 text-xs font-bold text-saffron-foreground">
          <Megaphone className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Notice</span>
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden" aria-live="off">
          <div className="marquee flex w-max gap-16 whitespace-nowrap text-sm font-medium"
            style={{ animationPlayState: paused ? "paused" : "running" }}>
            <span>{TEXT}</span>
            <span aria-hidden="true">{TEXT}</span>
          </div>
        </div>
        <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play notice" : "Pause notice"}
          className="shrink-0 rounded-lg p-1.5 hover:bg-secondary">
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
