import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import b0 from "@/assets/banner_static.png.asset.json";
import b1 from "@/assets/banner_1.png.asset.json";
import b2 from "@/assets/banner_2.png.asset.json";
import b3 from "@/assets/banner_3.png.asset.json";

const SLIDES = [
  { src: b1.url, alt: "Find an internship near you" },
  { src: b2.url, alt: "PM Internship Scheme banner 2" },
  { src: b3.url, alt: "PM Internship Scheme banner 3" },
];

function Controls({ index, setIndex, playing, setPlaying, prev, next }) {
  const ctrl =
    "grid h-9 w-9 place-items-center rounded-full glass-card text-primary transition hover:scale-105";
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2" role="tablist" aria-label="Choose banner">
        {SLIDES.map((s, i) => (
          <button key={i} role="tab" aria-selected={i === index} aria-label={"Show banner " + (i + 1)}
            onClick={() => setIndex(i)}
            className={"h-2 rounded-full transition-all " + (i === index ? "w-8 bg-saffron" : "w-2 bg-primary/25 hover:bg-primary/50")} />
        ))}
        <span className="ml-2 text-xs font-semibold tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className={ctrl} onClick={prev} aria-label="Previous banner"><ChevronLeft className="h-4 w-4" /></button>
        <button className={ctrl} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause slideshow" : "Play slideshow"}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button className={ctrl} onClick={next} aria-label="Next banner"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [playing, next]);

  return (
    <section id="main" className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:py-8" aria-label="Highlights">
      <div className="relative overflow-hidden rounded-3xl shadow-banner ring-1 ring-primary-foreground/40 glass-frame">
        <img src={b0.url} alt="Learn from the Best — Paid internships in top companies" className="block w-full" />
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-saffron">Highlights</p>
            <h2 className="font-display text-xl font-bold text-primary sm:text-2xl">What's new on PM Internship</h2>
          </div>
        </div>
        <div
          className="relative overflow-hidden rounded-3xl shadow-banner ring-1 ring-primary-foreground/40 glass-frame"
          aria-roledescription="carousel"
          onKeyDown={(e) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); }}
        >
          <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
            {SLIDES.map((s, i) => (
              <div key={i} className="w-full shrink-0" aria-hidden={i !== index}>
                <img src={s.src} alt={s.alt} className="block aspect-[1800/280] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <Controls index={index} setIndex={setIndex} playing={playing} setPlaying={setPlaying} prev={prev} next={next} />
      </div>
    </section>
  );
}
