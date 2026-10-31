import { useMemo, useRef, useState } from "react";
import { Briefcase, Layers, MapPinned, Building2, GraduationCap, MousePointerClick } from "lucide-react";
import { MAP_W, MAP_H, STATES } from "./indiaMap";

// Demo data only — replace with real figures from the portal API.
const LEVELS = ["10th", "12th", "ITI", "Diploma", "Graduation", "Post Graduation"];
const WEIGHTS = [0.42, 0.17, 0.13, 0.09, 0.17, 0.02];

function seeded(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
}

function buildData() {
  const out = {};
  for (const s of STATES) {
    const r = seeded(s.name);
    const small = /Island|Lakshadweep|Daman|Dadara|Chandigarh|Puducherry|Sikkim|Goa/.test(s.name);
    const total = Math.round((small ? 300 + r() * 1500 : 3000 + r() * 22000));
    const parts = WEIGHTS.map((w) => Math.round(total * w * (0.7 + r() * 0.6)));
    const sum = parts.reduce((a, b) => a + b, 0);
    const levels = parts.map((p) => Math.round((p / sum) * total));
    out[s.name] = { total, levels, districts: small ? 1 + Math.floor(r() * 3) : 10 + Math.floor(r() * 60), sectors: 8 + Math.floor(r() * 26) };
  }
  return out;
}

const fmt = (n) => n.toLocaleString("en-IN");

export default function StateDashboard() {
  const data = useMemo(buildData, []);
  const max = Math.max(...Object.values(data).map((d) => d.total));
  const national = Object.values(data).reduce((a, d) => a + d.total, 0);
  const [active, setActive] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const wrap = useRef(null);

  const move = (e) => {
    const r = wrap.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width });
  };
  const sel = active ? data[active] : null;

  const stats = [
    { icon: Layers, value: 34, label: "Sectors" },
    { icon: MapPinned, value: 36, label: "States / UTs" },
    { icon: Building2, value: 742, label: "Districts" },
    { icon: GraduationCap, value: 6, label: "Qualifications" },
  ];

  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-4 py-14 sm:py-18">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">
          <MapPinned className="h-3.5 w-3.5" />
          <span>Pan-India Vacancy Map</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Opportunities Across States &amp; UTs
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          Interactive distribution of corporate internship vacancies across 36 States, Union Territories, and 742 districts.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div className="glass-panel rounded-3xl p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-primary dark:text-white">Opportunities by State / UT</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MousePointerClick className="h-3.5 w-3.5" /> Hover or tap a state
            </p>
          </div>
          <div ref={wrap} className="relative" onMouseMove={move} onMouseLeave={() => setActive(null)}>
            <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="mx-auto h-auto w-full max-w-xl" role="img" aria-label="Map of India">
              {STATES.map((s) => {
                const t = data[s.name].total / max;
                const on = active === s.name;
                return (
                  <g key={s.name} onMouseEnter={() => setActive(s.name)} onClick={(e) => { move(e); setActive(s.name); }}
                    tabIndex={0} onFocus={() => { setActive(s.name); setPos({ x: s.cx / MAP_W * (wrap.current?.clientWidth || 0), y: s.cy / MAP_H * (wrap.current?.clientHeight || 0), w: wrap.current?.clientWidth }); }}
                    aria-label={`${s.name}: ${fmt(data[s.name].total)} opportunities`} className="cursor-pointer outline-none">
                    <path d={s.d}
                      style={{ fill: on ? "var(--saffron)" : `color-mix(in oklab, var(--primary) ${12 + t * 55}%, var(--secondary))` }}
                      className="stroke-card transition-[fill] duration-150" strokeWidth={0.8} />
                    <circle cx={s.cx} cy={s.cy} r={on ? 4 : 2.5} className={on ? "fill-card" : "fill-saffron/80"} pointerEvents="none" />
                  </g>
                );
              })}
            </svg>

            {sel && (
              <div className="pointer-events-none absolute z-10 w-60 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-banner"
                style={{ left: Math.min(pos.x + 16, (pos.w || 400) - 250), top: pos.y + 16 }}>
                <div className="bg-primary px-4 py-2.5 text-primary-foreground">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-saffron">Internship Opportunities</p>
                  <p className="font-display text-sm font-bold">{active}</p>
                </div>
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b bg-secondary/60">
                      <td className="px-4 py-1.5 font-semibold">Total</td>
                      <td className="px-4 py-1.5 text-right font-bold text-primary dark:text-sky-300">{fmt(sel.total)}</td>
                    </tr>
                    {LEVELS.map((l, i) => (
                      <tr key={l} className="border-b last:border-0">
                        <td className="px-4 py-1.5 text-muted-foreground">{l}</td>
                        <td className="px-4 py-1.5 text-right font-semibold text-primary dark:text-sky-300">{fmt(sel.levels[i])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            Fewer
            <span className="h-2 w-32 rounded-full" style={{ background: "linear-gradient(90deg, color-mix(in oklab, var(--primary) 12%, var(--secondary)), color-mix(in oklab, var(--primary) 67%, var(--secondary)))" }} />
            More
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-hero relative overflow-hidden rounded-3xl p-7 text-primary-foreground shadow-banner">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-saffron/20" />
            <Briefcase className="mb-4 h-7 w-7 text-saffron" />
            <p className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{fmt(sel ? sel.total : national)}</p>
            <p className="mt-2 text-sm font-semibold">Internship Opportunities{sel ? ` in ${active}` : " across India"}</p>
            <p className="mt-1 text-xs opacity-75">Companies are posting opportunities on an ongoing basis</p>
          </div>

          {sel ? (
            <div className="glass-panel rounded-3xl p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-saffron">By qualification</p>
              <div className="space-y-3">
                {LEVELS.map((l, i) => (
                  <div key={l}>
                    <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{l}</span><span className="font-semibold text-primary dark:text-white">{fmt(sel.levels[i])}</span></div>
                    <div className="h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-saffron" style={{ width: `${(sel.levels[i] / sel.total) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4 text-center">
                <div><p className="font-display text-xl font-bold text-primary dark:text-white">{sel.districts}</p><p className="text-xs text-muted-foreground">Districts</p></div>
                <div><p className="font-display text-xl font-bold text-primary dark:text-white">{sel.sectors}</p><p className="text-xs text-muted-foreground">Sectors</p></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: I, value, label }) => (
                <div key={label} className="glass-panel rounded-3xl p-5">
                  <span className="mb-3 inline-flex rounded-lg bg-accent p-2 text-accent-foreground"><I className="h-4 w-4" /></span>
                  <p className="font-display text-3xl font-bold text-primary dark:text-white">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">Figures shown are sample data for demonstration.</p>
        </div>
      </div>
    </section>
  );
}
