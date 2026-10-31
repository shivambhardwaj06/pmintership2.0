import { Building2, ArrowRight, Sparkles } from "lucide-react";
import CompanyLogo from "./CompanyLogo";

const FEATURED_COMPANIES = [
  { name: "Tata Motors", sector: "Automotive", roles: "15 Openings" },
  { name: "HDFC Bank", sector: "Banking & Financial Services", roles: "15 Openings" },
  { name: "Larsen & Toubro", sector: "Infrastructure & Construction", roles: "16 Openings" },
  { name: "Sun Pharmaceutical Industries", sector: "Pharmaceuticals", roles: "18 Openings" },
  { name: "Reliance Industries", sector: "Oil, Gas & Energy", roles: "10 Openings" },
  { name: "Maruti Suzuki", sector: "Automotive", roles: "11 Openings" },
  { name: "Tata Consultancy Services", sector: "IT & Software", roles: "15 Openings" },
  { name: "State Bank of India", sector: "Banking & Financial Services", roles: "14 Openings" },
  { name: "NTPC", sector: "Power & Utilities", roles: "14 Openings" },
  { name: "ITC Limited", sector: "FMCG", roles: "13 Openings" },
  { name: "Mahindra & Mahindra", sector: "Automotive", roles: "10 Openings" },
  { name: "ICICI Bank", sector: "Banking & Financial Services", roles: "12 Openings" },
  { name: "Infosys", sector: "IT & Software", roles: "12 Openings" },
  { name: "Bharti Airtel", sector: "Telecommunications", roles: "11 Openings" },
  { name: "Hero MotoCorp", sector: "Automotive", roles: "8 Openings" },
  { name: "Bajaj Auto", sector: "Automotive", roles: "9 Openings" },
  { name: "Adani Power", sector: "Power & Utilities", roles: "14 Openings" },
  { name: "Wipro", sector: "IT & Software", roles: "14 Openings" },
  { name: "HCLTech", sector: "IT & Software", roles: "10 Openings" },
  { name: "Flipkart", sector: "Retail & Consumer Durables", roles: "8 Openings" },
  { name: "Zomato", sector: "Technology & Logistics", roles: "7 Openings" },
];

export default function FeaturedCompaniesMarquee({ onSelectCompany }) {
  // Double list for seamless, continuous infinite scroll
  const marqueeItems = [...FEATURED_COMPANIES, ...FEATURED_COMPANIES];

  return (
    <section className="py-10 sm:py-12 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/80 dark:border-white/10 overflow-hidden" aria-label="Featured Partner Companies">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 px-3 py-0.5 text-[11px] font-black uppercase text-amber-700 dark:text-amber-300">
            <Building2 className="h-3 w-3" />
            <span>Top 500 Corporate Partners</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
            Featured Companies Hiring on PM Internship Portal
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            12 months of certified corporate training with monthly stipends (₹5,000/mo + ₹6,000 one-time grant).
          </p>
        </div>

        <button
          onClick={() => onSelectCompany && onSelectCompany("")}
          className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 hover:underline cursor-pointer shrink-0"
        >
          <span>Explore All 260+ Openings</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Moving Marquee Container */}
      <div className="relative w-full overflow-hidden mask-fade-edges">
        {/* Soft edge blur masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 z-10 bg-gradient-to-l from-background to-transparent" />

        <div className="animate-marquee py-2 flex items-center gap-4 hover:cursor-pointer">
          {marqueeItems.map((comp, idx) => (
            <div
              key={`${comp.name}-${idx}`}
              onClick={() => onSelectCompany && onSelectCompany(comp.name)}
              className="group shrink-0 flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/90 px-4 py-3 shadow-xs hover:shadow-lg hover:border-amber-500/50 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="shrink-0 h-11 w-11 rounded-xl bg-white p-1 border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-center">
                <CompanyLogo name={comp.name} className="h-full w-full object-contain" />
              </div>

              <div className="min-w-0 pr-2">
                <h4 className="font-display text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate max-w-[180px]">
                  {comp.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider truncate max-w-[120px]">
                    {comp.sector}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    • {comp.roles}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
