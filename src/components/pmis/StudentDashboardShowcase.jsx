import { useState } from "react";
import {
  FileCheck2,
  Target,
  Award,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Upload,
  UserCheck,
  Zap,
  Check,
  Briefcase,
  Layers,
  ChevronRight
} from "lucide-react";
import CompanyLogo from "./CompanyLogo";

export default function StudentDashboardShowcase({ user, onOpenAuth, onNavigateToDashboard }) {
  const [activeConsoleTab, setActiveConsoleTab] = useState("audit"); // "audit" | "matching" | "resumes"

  const handleAction = (tabName = "profile", defaultMode = "register") => {
    if (!user) {
      if (onOpenAuth) onOpenAuth(defaultMode);
    } else {
      if (onNavigateToDashboard) onNavigateToDashboard(tabName);
    }
  };

  const PILLAR_CARDS = [
    {
      id: "resume-audit",
      tab: "profile",
      icon: FileCheck2,
      accentColor: "blue",
      badge: "Industry Standard",
      badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
      iconBg: "bg-blue-500/15 text-blue-500",
      title: "1-Page Resume & ATS Audit",
      metric: "Strict 1-Page Check",
      description: "Automated scan speed test under 15 seconds, strict 1-page PDF formatting enforcement, and instant ATS score (0–100).",
      cta: "Audit My Resume",
    },
    {
      id: "database-matching",
      tab: "profile",
      icon: Target,
      accentColor: "emerald",
      badge: "MongoDB Sync",
      badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      iconBg: "bg-emerald-500/15 text-emerald-500",
      title: "Top 5 Database Jobs Match",
      metric: "260 Corporate Openings",
      description: "Direct algorithmic alignment against 260 official PM Scheme positions based on your academic branch and extracted skills.",
      cta: "View Matching Jobs",
    },
    {
      id: "shortlisted-resumes",
      tab: "resumes",
      icon: Award,
      accentColor: "purple",
      badge: "9 Disciplines",
      badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
      iconBg: "bg-purple-500/15 text-purple-500",
      title: "Shortlisted Resumes Vault",
      metric: "Real Selected CVs",
      description: "Learn from resumes selected at TCS, Tata Motors, L&T, and HDFC Bank with curated technical and HR interview guides.",
      cta: "Study Selected CVs",
    },
    {
      id: "recruiter-tracking",
      tab: "applications",
      icon: Building2,
      accentColor: "amber",
      badge: "Live Recruiter Portal",
      badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      iconBg: "bg-amber-500/15 text-amber-500",
      title: "Corporate Application Tracking",
      metric: "₹5,000/mo + ₹6k Grant",
      description: "Apply with 1 click, track application status live as recruiters review profiles, schedule interviews, and issue offers.",
      cta: "Track Applications",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10 space-y-6 sm:space-y-8" aria-label="Student Career Acceleration Hub">
      {/* SECTION HEADER: Sharp, spacious, and uncluttered */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-saffron/15 dark:bg-saffron/20 border border-saffron/30 px-3 py-1 text-xs font-black uppercase text-saffron tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-saffron animate-pulse" />
            <span>Student Career Accelerator</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Audit Your Resume. Get Matched. Get Shortlisted.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-2xl">
            Experience our AI Recruiter Engine: instant 1-page ATS compliance rating, skill extraction, and direct algorithmic matching across 260 official PM Scheme positions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!user ? (
            <button
              onClick={() => handleAction("profile", "register")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-slate-950 font-black px-5 py-2.5 text-xs sm:text-sm shadow-md hover:brightness-110 transition cursor-pointer"
            >
              <UserCheck className="h-4 w-4" />
              <span>Register Free to Access</span>
            </button>
          ) : (
            <button
              onClick={() => handleAction("profile", "login")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-black px-5 py-2.5 text-xs sm:text-sm shadow-md hover:bg-primary/90 transition cursor-pointer"
            >
              <Briefcase className="h-4 w-4" />
              <span>Open My Dashboard →</span>
            </button>
          )}
        </div>
      </div>

      {/* THE VIBE CENTERPIECE: Interactive AI Resume & Career Scanner Console */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 shadow-xl backdrop-blur-xl">
        {/* Ambient Top Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-saffron to-emerald-500" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-saffron/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Console Interactive Tab Switcher */}
        <div className="px-5 sm:px-8 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveConsoleTab("audit")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeConsoleTab === "audit"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>AI ATS Resume Audit</span>
            </button>

            <button
              onClick={() => setActiveConsoleTab("matching")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeConsoleTab === "matching"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              <span>Top 5 Database Jobs</span>
            </button>

            <button
              onClick={() => setActiveConsoleTab("resumes")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeConsoleTab === "resumes"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>Shortlisted Resumes</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Official PMIS AI Engine v2.0 • Live Sync</span>
          </div>
        </div>

        {/* Console Interactive Body */}
        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Key Highlights & Live Interactive Dropzone */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-saffron">
                {activeConsoleTab === "audit" && "Real-Time 1-Page Document Scanner"}
                {activeConsoleTab === "matching" && "Algorithmic Match Against 260 Openings"}
                {activeConsoleTab === "resumes" && "Verified Shortlists from Top 500 MNCs"}
              </span>

              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {activeConsoleTab === "audit" && "Instant ATS Score & Recruiter Speed Test"}
                {activeConsoleTab === "matching" && "Discover Your Top 5 Corporate Matches"}
                {activeConsoleTab === "resumes" && "Learn from Winning Candidate Resumes"}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {activeConsoleTab === "audit" &&
                  "Corporate screeners review CVs in under 15 seconds. Upload your 1-page PDF to ensure zero ATS rejection, highlight core technical tools, and get shortlisted."}
                {activeConsoleTab === "matching" &&
                  "Our system reads your skills and academic branch, matching you with the highest-fit paid internships across Tata, Infosys, L&T, HDFC Bank, and Maruti Suzuki."}
                {activeConsoleTab === "resumes" &&
                  "Explore real 1-page resumes that successfully cleared Round 1 screenings across 9 engineering and commerce streams, paired with curated interview prep guides."}
              </p>
            </div>

            {/* Micro-Features Checklist with Modern Pill Tags */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Strict 1-Page PDF</span>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Instant ATS Rating</span>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Top 5 Job Matches</span>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-500 shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Recruiter Sync</span>
              </div>
            </div>

            {/* Interactive Launch Button */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleAction("profile", "register")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-slate-950 font-black px-5 sm:px-6 py-3 text-xs sm:text-sm shadow-md hover:brightness-110 transition cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>{user ? "Audit My 1-Page Resume Now" : "Register to Analyze Resume"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleAction("resumes", "register")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 px-4 py-3 text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                <Award className="h-4 w-4 text-purple-500" />
                <span>View Shortlisted CVs</span>
              </button>
            </div>

            {!user && (
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-saffron" />
                <span>Zero cost. 30-second sign up with mobile or Google OAuth 2.0.</span>
              </p>
            )}
          </div>

          {/* Right Column: Visual HUD Simulation Card */}
          <div className="lg:col-span-6">
            <div
              onClick={() => handleAction("profile", "register")}
              className="group relative rounded-2xl border-2 border-slate-200/80 dark:border-slate-700 bg-slate-950 text-white p-5 sm:p-6 shadow-2xl overflow-hidden cursor-pointer hover:border-saffron/80 transition-all duration-300"
            >
              {/* Animated scanline laser effect across the card */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40 animate-pulse pointer-events-none" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* HUD Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-xs font-black tracking-wider text-slate-300 uppercase">
                    AI Recruiter Audit Feed
                  </span>
                </div>
                <span className="rounded-full bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 text-[10px] font-black text-emerald-400 uppercase tracking-wide">
                  Grade A+ • Top 2%
                </span>
              </div>

              {/* Central Metrics Ring & Summary */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Glowing Circular Gauge */}
                  <div className="relative flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 shrink-0">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
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
                    <div className="absolute text-center">
                      <div className="text-base sm:text-xl font-black text-white leading-none">96</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">/100</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display text-sm sm:text-base font-black text-white">
                      ATS Compliance Score
                    </h4>
                    <p className="text-[11px] font-semibold text-emerald-400">
                      Recruiter Scan Speed: 8.4s • Shortlist Ready
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      B.Tech Computer Science • 1-Page PDF Verified
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="inline-block rounded-lg bg-slate-900 border border-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">
                    Status: Verified
                  </span>
                </div>
              </div>

              {/* Extracted Skills Cloud */}
              <div className="py-2.5 border-t border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <span>Extracted Skills (Auto-Synced):</span>
                  <span className="text-emerald-400">7 Core Tools Found</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Git", "Data Structures"].map((sk, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-blue-950/80 border border-blue-800/70 px-2 py-0.5 text-[10px] font-bold text-blue-300 flex items-center gap-1"
                    >
                      <Check className="h-2.5 w-2.5 text-blue-400" />
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Database Matches Rows */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-saffron">
                  <span>Top Database Matches (260 in DB):</span>
                  <span className="text-slate-400 font-normal">Real-Time Fit</span>
                </div>

                <div className="space-y-1.5">
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <CompanyLogo name="Tata Consultancy Services" className="h-7 w-7 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-black text-white truncate">Tata Consultancy Services</div>
                        <div className="text-[10px] text-slate-400 truncate">Software Development Intern • ₹5,000/mo</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-black text-emerald-400 shrink-0 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-md">
                      98% Match
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <CompanyLogo name="Larsen & Toubro" className="h-7 w-7 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-black text-white truncate">Larsen &amp; Toubro (L&amp;T)</div>
                        <div className="text-[10px] text-slate-400 truncate">Digital Infrastructure Intern • ₹5,000/mo</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-black text-emerald-400 shrink-0 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-md">
                      95% Match
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-xs font-extrabold text-saffron group-hover:underline inline-flex items-center gap-1">
                    <span>{user ? "View Complete Audit in Dashboard" : "Register to Run Your Instant Resume Audit"}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 SHARP, CLEAN FEATURE CARDS: High Vibe & Razor-Sharp Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PILLAR_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => handleAction(card.tab, "register")}
              className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`h-10 w-10 rounded-xl ${card.iconBg} grid place-items-center transition-transform group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-base font-black text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-saffron transition">
                    {card.title}
                  </h4>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                    {card.metric}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-black text-primary dark:text-saffron group-hover:underline inline-flex items-center gap-1">
                  <span>{card.cta}</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
                {!user && (
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" />
                    <span>Free</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
