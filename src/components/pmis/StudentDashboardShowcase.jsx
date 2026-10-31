import {
  FileCheck2,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Layers,
  ChevronRight,
  Clock,
  Building2,
  Lock,
  UserCheck,
  Check,
  Upload,
} from "lucide-react";

export default function StudentDashboardShowcase({ user, onOpenAuth, onNavigateToDashboard }) {
  const handleAction = (tabName = "profile", defaultMode = "register") => {
    if (!user) {
      if (onOpenAuth) onOpenAuth(defaultMode);
    } else {
      if (onNavigateToDashboard) onNavigateToDashboard(tabName);
    }
  };

  const FEATURES = [
    {
      id: "resume-audit",
      tab: "profile",
      title: "1-Page ATS Resume Audit",
      badge: "Strict 1-Page Check",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
      iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
      icon: FileCheck2,
      description:
        "Instant ATS evaluation verifying single-page corporate formatting, keyword density, and key competencies across engineering, commerce, sciences, and humanities.",
      highlights: ["Single-Page Verified", "Instant ATS Score"],
      cta: "Audit My Resume",
    },
    {
      id: "job-matching",
      tab: "profile",
      title: "Top 5 Matching Internships",
      badge: "260 Live Openings",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
      iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
      icon: Target,
      description:
        "Intelligent matchmaking across 260 official PM Scheme vacancies at top companies across 24 sectors based on your academic discipline and verified skills.",
      highlights: ["Top corporate employer fit", "24 diversified industry sectors"],
      cta: "View Matching Jobs",
    },
    {
      id: "shortlisted-resumes",
      tab: "resumes",
      title: "Shortlisted Resumes Vault",
      badge: "9 Academic Disciplines",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
      iconBg: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
      icon: Award,
      description:
        "Learn from authentic 1-page resumes selected by recruiters at Maruti Suzuki, HDFC Bank, L&T, Sun Pharma, and Tata Motors with curated technical and HR interview guides.",
      highlights: ["Real selected CV samples", "Round-by-round interview guides"],
      cta: "Explore Winning CVs",
    },
    {
      id: "application-tracking",
      tab: "applications",
      title: "Live Application Tracking",
      badge: "Recruiter Portal Sync",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
      icon: Building2,
      description:
        "1-click applications with live status tracking as corporate recruiters review profiles, schedule interviews, and issue offer letters.",
      highlights: ["Live application status", "Direct recruiter updates"],
      cta: "Track My Applications",
    },
  ];

  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 space-y-8"
      aria-label="Student Career Acceleration Hub"
    >
      {/* SECTION HEADER: Clean, spacious, and elegant */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Student Career Acceleration</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your Complete PMIS Career Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Everything you need to secure your 12-month corporate internship: 1-page ATS compliance audit,
            instant job matchmaking against 260+ openings, winning resume blueprints, and real-time recruiter tracking.
          </p>
        </div>

        <div className="shrink-0">
          {!user ? (
            <button
              onClick={() => handleAction("profile", "register")}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-slate-950 font-black px-5 sm:px-6 py-3 text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer"
            >
              <UserCheck className="h-4 w-4" />
              <span>Register Free to Access</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => handleAction("profile", "login")}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold px-5 sm:px-6 py-3 text-xs sm:text-sm shadow-md hover:opacity-90 active:scale-95 transition cursor-pointer"
            >
              <Briefcase className="h-4 w-4" />
              <span>Open My Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 CLEAN, BRIGHT, ELEGANT FEATURE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => handleAction(card.tab, "register")}
              className="group relative rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Header: Icon & Tag */}
                <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-2xl ${card.iconBg} grid place-items-center transition-transform group-hover:scale-105`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Highlights */}
                <div className="space-y-1.5 pt-1">
                  {card.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 group-hover:underline inline-flex items-center gap-1.5">
                  <span>{card.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                {!user && (
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span>Free</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CLEAN BOTTOM TRUST BANNER */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Official Ministry of Corporate Affairs (MCA) Platform
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              100% Free for all eligible Indian youth • ₹5,000/month stipend + ₹6,000 incidentals grant via Direct Benefit Transfer.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAction("profile", "register")}
          className="shrink-0 text-xs font-black text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>{user ? "Go to Dashboard" : "Create Candidate Account"}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}