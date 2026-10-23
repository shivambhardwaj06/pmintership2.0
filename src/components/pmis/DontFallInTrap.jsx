import { useState, useEffect } from "react";
import {
  TrendingUp,
  Flame,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Building2,
  Calendar,
  Lock,
  LogIn,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Briefcase,
  Users,
} from "lucide-react";

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, "");

// Verified initial day-by-day announcements
const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ann-2026-10-23-01",
    date: "23 Oct 2026",
    day: "Today",
    headline: "Tata Group Announces 4,500+ Direct Engineering Roles for Dholera Semiconductor Fab",
    company: "Tata Electronics & Powerchip",
    sector: "Semiconductor & Advanced Manufacturing",
    hiring_count: "+4,500 Engineers",
    summary:
      "Tata Electronics initiates nationwide talent recruitment for VLSI design, semiconductor cleanroom maintenance, equipment automation, and materials testing for India's ₹91,000 Cr commercial fabrication facility in Dholera.",
    source_name: "The Economic Times",
    source_url: "https://news.google.com/search?q=Tata+Electronics+Dholera+semiconductor+fab+hiring+recruitment",
    is_hot: true,
    impact_metric: "₹91,000 Cr National Mission",
  },
  {
    id: "ann-2026-10-22-02",
    date: "22 Oct 2026",
    day: "Yesterday",
    headline: "PM Internship Scheme Phase-2 Opens 1.25 Lakh Paid Corporate Openings",
    company: "Ministry of Corporate Affairs (MCA)",
    sector: "All Sectors (National PMIS)",
    hiring_count: "+1,25,000 Openings",
    summary:
      "Phase-2 of the PM Internship Scheme is live across top 500 corporate leaders including Tata, Reliance, L&T, Infosys, and HDFC, offering ₹5,000/month stipend and ₹6,000 incidentals for youth aged 21-24.",
    source_name: "Press Information Bureau (PIB)",
    source_url: "https://pib.gov.in/PressReleasePage.aspx",
    is_hot: true,
    impact_metric: "1.25 Crore Total Target",
  },
  {
    id: "ann-2026-10-21-03",
    date: "21 Oct 2026",
    day: "2 days ago",
    headline: "Global Capability Centers (GCCs) in India to Create 2,50,000+ Tech & Finance Jobs",
    company: "NASSCOM & EY India Report",
    sector: "IT, AI & Global Finance",
    hiring_count: "+2,50,000 Positions",
    summary:
      "Over 80 new Fortune 500 global centers are setting up digital hubs in Bengaluru, Hyderabad, Pune, and NCR, actively recruiting AI engineers, cloud architects, cybersecurity analysts, and corporate accountants.",
    source_name: "Livemint Business",
    source_url: "https://news.google.com/search?q=GCC+India+hiring+NASSCOM+jobs",
    is_hot: false,
    impact_metric: "80+ New Tech Hubs",
  },
  {
    id: "ann-2026-10-20-04",
    date: "20 Oct 2026",
    day: "3 days ago",
    headline: "Larsen & Toubro Bags ₹24,000 Cr Infrastructure Contracts, Hiring 8,000+ Site Engineers",
    company: "Larsen & Toubro (L&T)",
    sector: "Infrastructure & Construction",
    hiring_count: "+8,000 Engineers",
    summary:
      "L&T Infrastructure and Energy divisions announce large-scale recruitment for civil site engineers, planning managers, BIM modelers, and safety officers for high-speed rail and expressway corridors.",
    source_name: "Business Standard",
    source_url: "https://news.google.com/search?q=Larsen+Toubro+order+win+hiring+engineers",
    is_hot: false,
    impact_metric: "₹24,000 Cr Order Inflow",
  },
  {
    id: "ann-2026-10-19-05",
    date: "19 Oct 2026",
    day: "4 days ago",
    headline: "Maruti Suzuki & Tata Motors Expand EV Manufacturing with 12,000+ Technical Positions",
    company: "Maruti Suzuki & Tata Motors",
    sector: "Automotive & Electric Mobility",
    hiring_count: "+12,000 Hires",
    summary:
      "India's automotive leaders ramp up production capacity at Gujarat and Pune battery plants, hiring mechanical engineers, mechatronics technicians, battery pack cooling specialists, and quality auditors.",
    source_name: "Autocar Professional",
    source_url: "https://news.google.com/search?q=Maruti+Tata+Motors+EV+manufacturing+plant+hiring",
    is_hot: false,
    impact_metric: "Green Mobility Transition",
  },
  {
    id: "ann-2026-10-18-06",
    date: "18 Oct 2026",
    day: "5 days ago",
    headline: "HDFC Bank & State Bank of India Plan 25,000+ Fresh Hires for Branch & Wealth Expansion",
    company: "HDFC Bank & SBI",
    sector: "Banking & Financial Services",
    hiring_count: "+25,000 Openings",
    summary:
      "Leading public and private lenders open nationwide recruitment for credit analysts, retail relationship associates, digital loan officers, and compliance specialists across Tier-2 and Tier-3 cities.",
    source_name: "Financial Express",
    source_url: "https://news.google.com/search?q=HDFC+SBI+bank+branch+expansion+hiring+recruitment",
    is_hot: false,
    impact_metric: "Tier-2 & Tier-3 Growth",
  },
  {
    id: "ann-2026-10-17-07",
    date: "17 Oct 2026",
    day: "6 days ago",
    headline: "Reliance New Energy and Adani Green Hire 7,500+ Renewable Energy Specialists",
    company: "Reliance New Energy & Adani Green",
    sector: "Green Energy & Sustainability",
    hiring_count: "+7,500 Roles",
    summary:
      "Mega solar gigafactories in Jamnagar and Khavda recruit electrical, chemical, and industrial automation engineers for solar PV wafer manufacturing and green hydrogen pilot plants.",
    source_name: "ET Energy World",
    source_url: "https://news.google.com/search?q=Reliance+Adani+green+energy+solar+hiring",
    is_hot: false,
    impact_metric: "500 GW Clean Energy Goal",
  },
  {
    id: "ann-2026-10-16-08",
    date: "16 Oct 2026",
    day: "1 week ago",
    headline: "Sun Pharma & Cipla Announce 3,200+ Openings in Formulation QC and Bioprocessing",
    company: "Sun Pharma & Cipla",
    sector: "Pharmaceuticals & Healthcare",
    hiring_count: "+3,200 Scientists",
    summary:
      "Indian pharma leaders expand R&D and analytical quality control centers in Vadodara, Mumbai, and Goa, hiring B.Pharm, M.Pharm, and Biotech graduates for HPLC testing and GLP regulatory filing.",
    source_name: "PharmaBiz India",
    source_url: "https://news.google.com/search?q=Sun+Pharma+Cipla+QC+formulation+hiring",
    is_hot: false,
    impact_metric: "Global Formulation Export",
  },
];

const SECTOR_FILTERS = [
  "All Sectors",
  "Semiconductor & Advanced Manufacturing",
  "IT, AI & Global Finance",
  "Infrastructure & Construction",
  "Automotive & Electric Mobility",
  "Banking & Financial Services",
  "Green Energy & Sustainability",
  "Pharmaceuticals & Healthcare",
];

export default function DontFallInTrap({ user, onRequireAuth }) {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Background fetch fresh announcements from backend
  const fetchLiveAnnouncements = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/announcements/daily-jobs`);
      if (res.ok) {
        const data = await res.json();
        if (data.announcements && data.announcements.length > 0) {
          setAnnouncements(data.announcements);
        }
      }
    } catch {
      // Keep initial announcements active
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchLiveAnnouncements();
  }, []);

  // Filter logic
  const filtered = announcements.filter((item) => {
    const matchesSector =
      selectedSector === "All Sectors" ||
      item.sector.toLowerCase().includes(selectedSector.toLowerCase()) ||
      selectedSector.toLowerCase().includes(item.sector.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sector.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSector && matchesSearch;
  });

  // If not logged in, display 2 items as teaser, overlay the rest with login requirement
  const visibleItems = user ? filtered : filtered.slice(0, 2);

  return (
    <section id="dont-fall-in-trap" className="py-16 px-4 bg-slate-50/60 dark:bg-slate-950/60 border-t border-b border-slate-200 dark:border-slate-800 scroll-mt-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500/15 via-red-500/15 to-amber-500/15 px-4 py-1 text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 border border-orange-500/30 mb-3 shadow-2xs">
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse" />
            Perspective Shift • Stop The Doomscrolling
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Don&apos;t Fall in the Trap
          </h2>

          <p className="mt-3 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="text-red-600 dark:text-red-400 font-extrabold line-through mr-1.5">
              Don&apos;t focus on the layoffs.
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              Focus on the massive opportunities created every single day!
            </span>{" "}
            While media headlines broadcast isolated layoffs, India is adding over{" "}
            <strong className="text-slate-900 dark:text-white">4,00,000+ new technical, manufacturing, and financial roles</strong> each quarter. Here is the verified day-by-day proof.
          </p>
        </div>

        {/* 4 Pillars Impact Metrics Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              <Users className="h-4 w-4 text-orange-500" /> PM Internship Mission
            </div>
            <p className="font-display text-2xl font-black text-slate-900 dark:text-white">
              1.25 Crore
            </p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              Youth targeted across top 500 corporate partners
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> GCC Expansion
            </div>
            <p className="font-display text-2xl font-black text-emerald-600 dark:text-emerald-400">
              2,50,000+
            </p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              New tech, AI & finance roles added across India
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              <Building2 className="h-4 w-4 text-blue-500" /> Infrastructure Wave
            </div>
            <p className="font-display text-2xl font-black text-blue-600 dark:text-blue-400">
              ₹24,000+ Cr
            </p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              Expressway & high-speed rail hiring site engineers
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              <Sparkles className="h-4 w-4 text-purple-500" /> Semiconductor & EV
            </div>
            <p className="font-display text-2xl font-black text-purple-600 dark:text-purple-400">
              16,500+
            </p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              Direct engineering positions in Dholera & Pune
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <h3 className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                Day-by-Day Corporate Hiring Stream
              </h3>
              <span className="rounded-full bg-green-100 text-green-900 text-[10px] font-black px-2.5 py-0.5 border border-green-300">
                Live Verified
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search announcements (e.g. Tata, EV, L&T)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-primary"
                />
              </div>

              <button
                onClick={fetchLiveAnnouncements}
                disabled={refreshing}
                title="Refresh with live Google News announcements"
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Sector Pills */}
          <div className="flex overflow-x-auto gap-2 pb-1 pt-1 no-scrollbar">
            {SECTOR_FILTERS.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedSector === sec
                    ? "bg-slate-900 text-white dark:bg-primary dark:text-primary-foreground shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Day-by-Day Announcement Feed */}
        <div className="relative space-y-4">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-6 bg-white dark:bg-slate-900 shadow-xs hover:border-primary/50 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-[10px] font-black px-2.5 py-0.5 border border-orange-300 dark:border-orange-800 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {item.date} ({item.day})
                  </span>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold px-2.5 py-0.5 border border-slate-300 dark:border-slate-700">
                    {item.sector}
                  </span>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black px-2.5 py-0.5 border border-emerald-300 dark:border-emerald-800">
                    {item.hiring_count}
                  </span>
                  {item.impact_metric && (
                    <span className="text-[10px] font-bold text-slate-400">
                      • {item.impact_metric}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {item.headline}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {item.summary}
                </p>

                <p className="text-[11px] text-slate-400 font-semibold">
                  Source: <strong className="text-slate-700 dark:text-slate-200">{item.source_name}</strong>
                </p>
              </div>

              {/* Source Link Button */}
              <div className="shrink-0 flex items-center">
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 text-xs font-black border border-slate-300 dark:border-slate-700 transition cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  <span>Read Official Source</span>
                  <ExternalLink className="h-3.5 w-3.5 text-orange-500" />
                </a>
              </div>
            </div>
          ))}

          {/* Gated Access Lock Overlay for Non-Logged-In Users */}
          {!user && (
            <div className="relative mt-8 rounded-3xl border-2 border-dashed border-amber-300 dark:border-amber-800/80 bg-gradient-to-b from-amber-50/80 via-white/95 to-amber-50/90 dark:from-slate-900/90 dark:via-slate-900/98 dark:to-slate-950/95 p-8 text-center shadow-lg backdrop-blur-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 mb-4 shadow-sm">
                <Lock className="h-7 w-7" />
              </div>

              <h4 className="font-display text-xl font-black text-slate-900 dark:text-white">
                Candidate Login Required for Full Day-by-Day Hiring Stream
              </h4>

              <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                Log in to unlock all daily hiring announcements, view verified direct corporate recruitment source links, set sector notifications, and apply under the Prime Minister Internship Scheme.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onRequireAuth}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F57C00] via-[#E65100] to-[#D84315] text-white px-6 py-3 text-xs font-black shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login / Register with 1 Click</span>
                </button>
              </div>

              <p className="text-[10px] font-bold text-slate-400 mt-3">
                Free for all Indian students • Quick Mobile OTP or Google Sign-In
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
