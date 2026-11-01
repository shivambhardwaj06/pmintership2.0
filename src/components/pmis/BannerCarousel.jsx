import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import b0 from "@/assets/banner_static.webp";
import b1 from "@/assets/banner_1.webp";
import b2 from "@/assets/banner_2.webp";
import b3 from "@/assets/banner_3.webp";

export default function BannerCarousel({ onExploreClick, onOpenAuth }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const SLIDES = [
    {
      type: "image",
      src: b0,
      alt: "Learn from the Best — Paid internships in top companies",
      tag: "Official Scheme Overview",
      linkAction: onExploreClick,
    },
    {
      type: "image",
      src: b1,
      alt: "Find an internship near you across all 28 states & UTs",
      tag: "Pan-India Coverage",
      linkAction: onExploreClick,
    },
    {
      type: "image",
      src: b2,
      alt: "PM Internship Scheme: 1.25 Crore youth career empowerment",
      tag: "Empowering 1.25 Cr Youth",
      linkAction: onExploreClick,
    },
    {
      type: "image",
      src: b3,
      alt: "Top 500 corporate partners across 25 diverse industrial sectors",
      tag: "Top 500 Corporate Partners",
      linkAction: onExploreClick,
    },
    {
      type: "custom",
      alt: "AI Resume Audit & Smart Internship Matching",
      tag: "AI Resume & Internship Match",
      title: "AI Resume Audit & Top 5 Matched Internships",
      subtitle: "Instant ATS compliance score, branch alignment, and verified matching across 260 official PM Scheme positions in 24 corporate sectors.",
      linkAction: () => {
        if (onOpenAuth) onOpenAuth("register");
        else if (onExploreClick) onExploreClick();
      },
    },
  ];

  const totalSlides = SLIDES.length;
  const next = useCallback(() => setIndex((i) => (i + 1) % totalSlides), [totalSlides]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + totalSlides) % totalSlides), [totalSlides]);

  // Slow, smooth slide interval (7.5 seconds)
  useEffect(() => {
    if (!playing || isHovered) return undefined;
    const timer = setInterval(next, 7500);
    return () => clearInterval(timer);
  }, [playing, isHovered, next]);

  const ctrlClass =
    "grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-white/90 dark:bg-slate-800/90 text-primary dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition hover:scale-105 hover:bg-white dark:hover:bg-slate-700 cursor-pointer";

  return (
    <section
      id="main"
      className="mx-auto max-w-7xl px-4 py-4 sm:py-6"
      aria-label="Official PM Internship Highlights"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 5-Slide Slow-Sliding Unified Banner */}
      <div
        className="relative overflow-hidden rounded-3xl shadow-banner ring-1 ring-primary/20 dark:ring-white/10 glass-frame bg-slate-900 group"
        aria-roledescription="carousel"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
        tabIndex={0}
      >
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className="w-full shrink-0 relative cursor-pointer"
              aria-hidden={i !== index}
              onClick={slide.linkAction}
            >
              {slide.type === "image" ? (
                <div className="relative w-full h-[150px] sm:h-[190px] md:h-[240px] lg:h-[280px] overflow-hidden flex items-center justify-center bg-slate-950">
                  {/* Ambient blurred backdrop matching exact banner colors */}
                  <img
                    src={slide.src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-45 scale-125 select-none pointer-events-none"
                  />
                  {/* Soft edge darkening to seamlessly blend into container */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                  {/* Main crisp banner: 100% visible, fully contained, NO CROPPING */}
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain object-center drop-shadow-xl select-none transition-transform duration-700 group-hover:scale-[1.01]"
                    loading={i === 0 ? "eager" : "lazy"}
                  />

                  {/* Subtle glass tag on top-left of each slide */}
                  <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-white border border-white/20 shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{slide.tag}</span>
                  </div>
                </div>
              ) : (
                /* Slide 5: Custom AI Resume & Job Matching Spotlight Banner */
                <div className="relative w-full h-[150px] sm:h-[190px] md:h-[240px] lg:h-[280px] overflow-hidden bg-gradient-to-r from-slate-950 via-[#0B2545] to-slate-900 text-white flex items-center justify-between px-5 sm:px-10 lg:px-14">
                  {/* Background decoration */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-saffron/20 blur-3xl pointer-events-none" />
                  <div className="absolute -left-16 -top-16 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

                  <div className="relative z-10 max-w-xl space-y-1.5 sm:space-y-2.5">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-saffron/20 border border-saffron/40 px-2.5 py-0.5 text-[10px] sm:text-xs font-extrabold text-saffron uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 text-saffron animate-spin" />
                      <span>{slide.tag}</span>
                    </div>

                    <h2 className="font-display text-base sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                      AI Resume Audit &amp;{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-amber-300">
                        Top 5 Matched Internships
                      </span>
                    </h2>

                    <p className="text-[11px] sm:text-xs lg:text-sm text-slate-300 font-medium line-clamp-1 sm:line-clamp-2 max-w-lg">
                      {slide.subtitle}
                    </p>

                    <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenAuth) onOpenAuth("register");
                          else if (onExploreClick) onExploreClick();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-slate-950 font-black px-3.5 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm shadow-md hover:brightness-110 transition cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Audit Resume &amp; Apply Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>

                      <div className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-300 font-semibold bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        <span>ATS Standard • 24 Sectors</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Visual HUD Card (Hidden on small screens) */}
                  <div className="relative z-10 hidden sm:flex items-center gap-3 shrink-0">
                    <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5 sm:p-4 text-center shadow-xl space-y-2">
                      <div className="flex items-center justify-center gap-2.5">
                        <div className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14">
                          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-white/10"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-emerald-400"
                              strokeDasharray="96, 100"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span className="absolute text-xs sm:text-sm font-black text-white">96%</span>
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-black text-emerald-300">Grade A+</div>
                          <div className="text-[10px] text-slate-300 font-medium">ATS Match</div>
                        </div>
                      </div>
                      <div className="rounded-lg bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        ✓ ATS PDF Verified
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Carousel Prev/Next Overlay Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition opacity-80 group-hover:opacity-100 shadow-md cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition opacity-80 group-hover:opacity-100 shadow-md cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Slide Navigation Controls & Indicators */}
      <div className="mt-3 flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose banner slide">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={
                "h-2.5 rounded-full transition-all duration-300 cursor-pointer " +
                (i === index
                  ? "w-8 sm:w-10 bg-saffron shadow-xs"
                  : "w-2 sm:w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400")
              }
            />
          ))}
          <span className="ml-2 text-xs font-bold tabular-nums text-slate-500 dark:text-slate-400">
            {String(index + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className={ctrlClass} onClick={prev} aria-label="Previous banner">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className={ctrlClass}
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slow slideshow" : "Play slow slideshow"}
            title={playing ? "Pause slow slideshow" : "Play slow slideshow"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button className={ctrlClass} onClick={next} aria-label="Next banner">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
