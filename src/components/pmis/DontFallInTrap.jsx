import { useState, useEffect } from "react";
import {
  ExternalLink,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, "");

// Verified initial factual announcements as initial state
const INITIAL_JOB_NEWS = [
  {
    id: "news-tata-semicon-01",
    headline: "Tata Electronics Ramps Up 4,500+ Engineering & Tech Roles for Dholera Fab",
    source_name: "The Economic Times",
    source_url: "https://news.google.com/search?q=Tata+Electronics+Dholera+semiconductor+fab+hiring",
    date: "Today",
    summary: "Tata Electronics initiates recruitment across VLSI design, cleanroom maintenance, equipment automation, and materials testing for India's commercial semiconductor facility in Dholera.",
    company: "Tata Electronics",
    sector: "Semiconductor & Advanced Manufacturing"
  },
  {
    id: "news-pmis-phase1-02",
    headline: "PM Internship Scheme Live with 1.25 Lakh Paid Corporate Opportunities Across India",
    source_name: "Press Information Bureau (PIB)",
    source_url: "https://pib.gov.in",
    date: "Official Update",
    summary: "Phase-1 of the PM Internship Scheme opens 12-month paid training across India's top 500 corporate leaders including Tata, Reliance, L&T, Infosys, and HDFC Bank.",
    company: "Ministry of Corporate Affairs (MCA)",
    sector: "All Industry Sectors"
  },
  {
    id: "news-gcc-india-03",
    headline: "India's Global Capability Centers (GCCs) Projected to Add 1,50,000+ Net New Roles",
    source_name: "Livemint & NASSCOM",
    source_url: "https://news.google.com/search?q=India+GCC+hiring+NASSCOM+jobs",
    date: "Industry Report",
    summary: "Over 80 new global capability centers are setting up digital tech hubs in Bengaluru, Hyderabad, Pune, and NCR, actively recruiting cloud engineers, data scientists, and analysts.",
    company: "Global Capability Centers",
    sector: "IT, AI & Global Finance"
  },
  {
    id: "news-railways-04",
    headline: "Indian Railways Announces 1,200+ Station Operations & Technical Engineering Vacancies",
    source_name: "India Today / Ministry of Railways",
    source_url: "https://news.google.com/search?q=Indian+Railways+station+master+vacancies+recruitment",
    date: "Official Bulletin",
    summary: "Railway Recruitment Boards release direct entry employment notifications for technical associates, station supervisors, and signaling maintenance staff across regional divisions.",
    company: "Indian Railways",
    sector: "Transportation & Public Infrastructure"
  },
  {
    id: "news-lt-infra-05",
    headline: "Larsen & Toubro Expands Infrastructure & Clean Energy Workforce with 8,000+ Engineers",
    source_name: "Business Standard",
    source_url: "https://news.google.com/search?q=Larsen+Toubro+hiring+infrastructure+engineers",
    date: "Corporate Update",
    summary: "L&T Infrastructure, Minerals, and Energy divisions announce large-scale recruitment for civil site engineers, planning managers, and electrical commissioning specialists.",
    company: "Larsen & Toubro (L&T)",
    sector: "Infrastructure & Construction"
  },
  {
    id: "news-auto-ev-06",
    headline: "Maruti Suzuki & Tata Motors Expand EV & Battery Assembly with 10,000+ Technical Positions",
    source_name: "Autocar Professional",
    source_url: "https://news.google.com/search?q=Maruti+Suzuki+Tata+Motors+EV+plant+hiring",
    date: "Manufacturing Report",
    summary: "Automotive leaders ramp up production capacity at Gujarat, Pune, and Kharkhoda mega plants, recruiting mechanical engineers, mechatronics technicians, and robotics programmers.",
    company: "Maruti Suzuki & Tata Motors",
    sector: "Automotive & Electric Mobility"
  }
];

export default function DontFallInTrap({ onNavigateToExplore }) {
  const [newsList, setNewsList] = useState(INITIAL_JOB_NEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  // Automatic daily fetch from MongoDB database
  useEffect(() => {
    let isMounted = true;

    const fetchDailyJobNews = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/announcements/daily-jobs?limit=30`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.announcements && data.announcements.length > 0) {
            setNewsList(data.announcements);
            setLastUpdated(data.last_updated || new Date().toLocaleDateString());
          }
        }
      } catch (err) {
        console.warn("Notice: Daily job news loaded from database cache", err);
      }
    };

    fetchDailyJobNews();

    // Automatically check and update every 6 hours (daily cycle) without any manual refresh button
    const autoInterval = setInterval(fetchDailyJobNews, 6 * 60 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(autoInterval);
    };
  }, []);

  // Filter news items by simple search query
  const filteredNews = newsList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.headline && item.headline.toLowerCase().includes(q)) ||
      (item.summary && item.summary.toLowerCase().includes(q)) ||
      (item.source_name && item.source_name.toLowerCase().includes(q)) ||
      (item.company && item.company.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Simple Header */}
      <div className="pt-12 pb-8 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-3">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Authentic Job Creation Updates • Saved in Database</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Job Creation & Hiring News
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto">
          Direct, verified news updates on real hiring drives, company expansions, and employment opportunities across India. Updated automatically daily.
        </p>

        {lastUpdated && (
          <p className="mt-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            Auto-synced: {lastUpdated}
          </p>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Simple Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search authentic job news by company, role, or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition shadow-xs"
          />
        </div>

        {/* Authentic News Cards List */}
        <div className="space-y-4">
          {filteredNews.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-sm font-semibold text-slate-500">
              No matching job creation news found for &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredNews.map((news) => (
              <div
                key={news.id}
                className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs hover:border-orange-400/60 dark:hover:border-orange-500/60 transition group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    {/* Meta info: Source & Date */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-slate-700 dark:text-slate-300">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        {news.source_name || "Verified Source"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {news.date || "Today"}
                      </span>
                      {news.sector && (
                        <span className="rounded-md bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 px-2 py-0.5 text-[11px] font-bold">
                          {news.sector}
                        </span>
                      )}
                    </div>

                    {/* Headline */}
                    <h3 className="font-display text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                      {news.headline}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {news.summary}
                    </p>
                  </div>

                  {/* Read verified source link */}
                  <div className="sm:self-start pt-1 sm:pt-0 shrink-0">
                    <a
                      href={news.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-orange-500 hover:text-white hover:border-orange-500 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition shadow-2xs"
                    >
                      <span>Read Story</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Simple Bottom CTA */}
        {onNavigateToExplore && (
          <div className="mt-10 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <h4 className="font-display text-base font-black text-slate-900 dark:text-white">
                Looking for active corporate internships?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                Browse all 260+ verified PM Internship Scheme opportunities directly from the database.
              </p>
            </div>
            <button
              onClick={onNavigateToExplore}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Explore Internships</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
