import { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import rawInternships from "@/data/internships.json";
import CompanyLogo from "./CompanyLogo";

// Top 6 diverse, high-demand corporate opportunities across major sectors
const TOP_SELECTION_IDS = [
  "PMIS-001", // TCS - IT & Software
  "PMIS-006", // HDFC Bank - Banking & Finance
  "PMIS-046", // Maruti Suzuki - Automotive
  "PMIS-031", // Larsen & Toubro - Infrastructure
  "PMIS-051", // Sun Pharma - Pharmaceuticals
  "PMIS-111", // NTPC - Power & Energy
];

export default function TopFeaturedInternships({
  onExploreAll,
  onApplyClick,
  user,
}) {
  const [appliedIds, setAppliedIds] = useState([]);

  // Load real user applications from storage + listen to global application updates
  useEffect(() => {
    const syncApplied = () => {
      try {
        const storageKey = user?.user_id ? `pmis_applied_ids_${user.user_id}` : "pmis_applied_ids";
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setAppliedIds(JSON.parse(saved));
        } else {
          setAppliedIds([]);
        }
      } catch {
        setAppliedIds([]);
      }
    };

    syncApplied();
    window.addEventListener("pmis_application_updated", syncApplied);
    return () => window.removeEventListener("pmis_application_updated", syncApplied);
  }, [user]);

  const topInternships = rawInternships.filter((item) =>
    TOP_SELECTION_IDS.includes(item.id)
  );

  return (
    <section id="top-featured-internships" className="mx-auto max-w-7xl px-4 py-14 sm:py-18">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-saffron/15 dark:bg-saffron/20 border border-saffron/30 px-3 py-1 text-xs font-black uppercase text-saffron tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5 text-saffron animate-pulse" />
            <span>Top Corporate Openings</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Featured PM Internships
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
            Hand-picked paid research and engineering internships across India's top corporate partners.
          </p>
        </div>

        <button
          onClick={onExploreAll}
          className="group flex items-center gap-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 w-fit cursor-pointer"
        >
          <span>Explore All 260+ Openings</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 6 Clean Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topInternships.map((item) => {
          const isApplied = appliedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/90 p-6 shadow-xs hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1"
            >
              <div>
                {/* Header: Company Logo & Sector Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <CompanyLogo name={item.company} className="h-14 w-14 shrink-0 shadow-xs" />
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-bold px-3 py-1 border border-slate-300 dark:border-slate-700 truncate max-w-[160px]">
                    {item.sector}
                  </span>
                </div>

                {/* Role Title & Company */}
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 mb-3">
                  {item.company}
                </p>

                {/* Summary */}
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {item.summary}
                </p>

                {/* Key Details Pill Box */}
                <div className="space-y-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {item.location}
                    </span>
                    <span className="rounded bg-white dark:bg-slate-700 px-2 py-0.5 text-[10px] font-bold border border-slate-200 dark:border-slate-600">
                      {item.mode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5 text-primary font-bold">
                      <IndianRupee className="h-3.5 w-3.5 text-saffron" /> {item.stipend}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.duration}
                    </span>
                  </div>
                </div>

                {/* Eligibility Tag */}
                <p className="mt-3 text-[11px] font-medium text-slate-600 dark:text-slate-400 line-clamp-1">
                  <strong className="text-slate-800 dark:text-slate-200">Eligibility: </strong>
                  {item.eligibility}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={onExploreAll}
                  className="text-xs font-bold text-primary dark:text-sky-400 hover:underline cursor-pointer"
                >
                  View Details
                </button>

                <button
                  onClick={() => onApplyClick(item)}
                  disabled={isApplied}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
                    isApplied
                      ? "bg-green-100 text-green-800 border border-green-300 cursor-default"
                      : "bg-gradient-to-r from-[#F57C00] to-[#E65100] text-white hover:brightness-105 active:scale-95 cursor-pointer"
                  }`}
                >
                  {isApplied ? "✓ Applied" : "Apply Now"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent Explore All Callout */}
      <div className="mt-12 text-center">
        <button
          onClick={onExploreAll}
          className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 dark:border-primary/50 bg-primary/5 hover:bg-primary/10 dark:bg-primary/15 px-8 py-3.5 text-sm font-extrabold text-primary dark:text-sky-300 shadow-xs transition hover:scale-105 cursor-pointer"
        >
          <span>Browse All Opportunities with State & Sector Filters</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
