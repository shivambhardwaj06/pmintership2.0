import { useState } from "react";
import {
  FileCheck2,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Briefcase,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  Building2,
  Check,
  Zap,
  Lock,
  Compass,
  FileText,
  Search
} from "lucide-react";
import CompanyLogo from "./CompanyLogo";

export default function StudentDashboardShowcase({ user, onOpenAuth, onNavigateToDashboard }) {
  const [activeTab, setActiveTab] = useState("audit"); // "audit" | "matching" | "resumes"

  const handleAction = (tabName = "profile", defaultMode = "register") => {
    if (!user) {
      if (onOpenAuth) onOpenAuth(defaultMode);
    } else {
      if (onNavigateToDashboard) onNavigateToDashboard(tabName);
    }
  };

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-8 sm:py-12 space-y-6 sm:space-y-8"
      aria-label="Student Career Acceleration Studio"
    >
      {/* SECTION HEADER: Confident, Spacious, High-Contrast Luxury Typography */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="space-y-2.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-saffron/15 dark:bg-saffron/20 border border-saffron/30 px-3.5 py-1 text-xs font-black uppercase text-saffron tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-saffron animate-pulse" />
            <span>AI Resume Intelligence &amp; Matchmaker</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Audit Your 1-Page Resume.{" "}
            <span className="bg-gradient-to-r from-saffron via-amber-500 to-emerald-500 bg-clip-text text-transparent">
              Match 260+ Openings.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Corporate recruiters screen resumes in under 15 seconds. Upload your 1-page PDF for instant ATS scoring,
            automated skill extraction, and direct algorithmic fit against official PM Scheme vacancies.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!user ? (
            <button
              onClick={() => handleAction("profile", "register")}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 text-slate-950 font-black px-6 py-3 text-sm shadow-lg shadow-saffron/20 hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Register Free to Analyze</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => handleAction("profile", "login")}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground font-black px-6 py-3 text-sm shadow-lg hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
            >
              <Briefcase className="h-4 w-4" />
              <span>Open Candidate Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* THE VIBE STUDIO: Deep Luxury Obsidian Glassmorphism Console */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-slate-950 via-[#070d18] to-slate-950 border border-white/10 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl overflow-hidden text-white">
        {/* Subtle Ambient Radial Backlights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-saffron/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-saffron/60 to-transparent pointer-events-none" />

        {/* Studio Top Control Rail */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          {/* Interactive Mode Pills */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "audit"
                  ? "bg-gradient-to-r from-saffron to-amber-500 text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileCheck2 className="h-4 w-4" />
              <span>1-Page ATS Radar</span>
            </button>

            <button
              onClick={() => setActiveTab("matching")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "matching"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Target className="h-4 w-4" />
              <span>Top 5 Job Matches</span>
            </button>

            <button
              onClick={() => setActiveTab("resumes")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "resumes"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Shortlisted CVs</span>
            </button>
          </div>

          {/* Engine Status Beacon */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono uppercase tracking-wider text-[11px]">PMIS Neural Engine v2.0 Live</span>
            </div>
          </div>
        </div>

        {/* Studio Main Stage */}
        <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Contextual Feature Walkthrough */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-saffron">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
                {activeTab === "audit" && "Real-Time 1-Page Document Screener"}
                {activeTab === "matching" && "Algorithmic Database Alignment"}
                {activeTab === "resumes" && "Verified Shortlists from Top 500 MNCs"}
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                {activeTab === "audit" && "Instant ATS Score & 15s Recruiter Benchmark."}
                {activeTab === "matching" && "Discover Your Top 5 Corporate Matches in DB."}
                {activeTab === "resumes" && "Learn from Real Resumes That Cleared Round 1."}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {activeTab === "audit" &&
                  "MNC hiring managers discard 2+ page resumes in 10 seconds. Our parser enforces strict 1-page formatting, extracts your technical tools, and flags formatting traps before you apply."}
                {activeTab === "matching" &&
                  "Our system maps your degree, academic branch, and extracted technical tools directly against 260 official PM Scheme positions at Tata, L&T, Infosys, and HDFC Bank."}
                {activeTab === "resumes" &&
                  "Explore real 1-page resumes that successfully cleared recruiter screenings across 9 academic streams, complete with curated technical and HR interview questions."}
              </p>
            </div>

            {/* Micro Feature Matrix */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">Strict 1-Page Check</span>
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">&lt; 15s Speed Rating</span>
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 flex items-center gap-2.5">
                <Target className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">260 Live DB Jobs</span>
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-purple-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">Recruiter Sync Portal</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleAction("profile", "register")}
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-saffron via-amber-500 to-amber-600 text-slate-950 font-black px-6 py-3.5 text-sm shadow-xl shadow-saffron/25 hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <span>{user ? "Audit My 1-Page Resume Now" : "Register to Run Resume Audit"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleAction(activeTab === "resumes" ? "resumes" : "profile", "register")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3.5 text-sm font-bold text-slate-200 transition active:scale-[0.98] cursor-pointer"
                >
                  <Award className="h-4 w-4 text-purple-400" />
                  <span>View Selected CVs</span>
                </button>
              </div>

              {!user && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <Lock className="h-3.5 w-3.5 text-saffron" />
                  <span>100% Free under PM Scheme. Fast signup with mobile OTP or Google.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: High-Tech Interactive Visual HUD */}
          <div className="lg:col-span-7">
            <div
              onClick={() => handleAction("profile", "register")}
              className="group relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0b1323]/95 to-slate-950/90 border border-white/15 p-6 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden cursor-pointer hover:border-saffron/50 transition-all duration-300"
            >
              {/* Dynamic Laser Scanning Beam */}
              <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] pointer-events-none animate-scan-laser" />

              {/* HUD Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-slate-200">
                    {activeTab === "audit" && "AI Candidate Telemetry • Live Scan"}
                    {activeTab === "matching" && "Top 5 Corporate Match Radar"}
                    {activeTab === "resumes" && "Shortlisted Candidate Archive"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-black text-emerald-300 tracking-wide">
                    {activeTab === "audit" && "Grade A+ • Top 2% Shortlist"}
                    {activeTab === "matching" && "260 Database Openings"}
                    {activeTab === "resumes" && "9 Disciplines Verified"}
                  </span>
                </div>
              </div>

              {/* TAB 1: ATS SCORE & RECRUITER SPEED TEST */}
              {activeTab === "audit" && (
                <div className="space-y-5 pt-5">
                  {/* Circular Score Gauge & Candidate Metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-4">
                      {/* Radial Progress Gauge */}
                      <div className="relative flex items-center justify-center h-20 w-20 shrink-0">
                        <svg className="h-full w-full -rotate-90 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" viewBox="0 0 36 36">
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
                          <div className="text-xl font-black text-white leading-none">96</div>
                          <div className="text-[10px] font-extrabold text-slate-400 uppercase">/100</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-base font-black text-white flex items-center gap-2">
                          <span>ATS Compliance Score</span>
                          <span className="rounded-md bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 text-[10px] font-extrabold uppercase">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5" />
                          <span>Recruiter Scan Speed: 8.4s • Shortlist Ready</span>
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          B.Tech Computer Science • Strict 1-Page PDF Pass
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-xs font-mono text-slate-400">Recruiter Pass Rate</div>
                      <div className="text-lg font-black text-cyan-400 font-mono">98.4%</div>
                      <div className="text-[10px] text-slate-500">Zero Multi-Page Penalty</div>
                    </div>
                  </div>

                  {/* Extracted Tools & Skills */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
                      <span>Extracted Skills (Auto-Synced from Resume):</span>
                      <span className="text-emerald-400">7 Core Tools Found</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Python", "FastAPI", "React", "Docker", "PostgreSQL", "Git", "REST APIs"].map((tool, idx) => (
                        <span
                          key={idx}
                          className="rounded-xl bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 text-xs font-bold text-cyan-300 flex items-center gap-1.5 shadow-xs"
                        >
                          <Check className="h-3 w-3 text-cyan-400" />
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Top 2 Real-Time Match Previews */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-saffron">
                      <span>Live Database Fit (260 Vacancies):</span>
                      <span className="text-slate-400 text-[11px] font-normal">Real-Time Algorithmic Match</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CompanyLogo name="Tata Consultancy Services" className="h-8 w-8 shrink-0" />
                          <div className="truncate">
                            <div className="text-xs font-black text-white truncate">TCS</div>
                            <div className="text-[11px] text-slate-400 truncate">Software Intern • ₹5k/mo</div>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-lg shrink-0">
                          98% Fit
                        </span>
                      </div>

                      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CompanyLogo name="Larsen & Toubro" className="h-8 w-8 shrink-0" />
                          <div className="truncate">
                            <div className="text-xs font-black text-white truncate">L&amp;T Infotech</div>
                            <div className="text-[11px] text-slate-400 truncate">Digital Infra • ₹5k/mo</div>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-lg shrink-0">
                          95% Fit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TOP 5 DATABASE JOBS MATCH */}
              {activeTab === "matching" && (
                <div className="space-y-4 pt-5">
                  <p className="text-xs text-slate-300">
                    High-affinity openings matched against candidate academic discipline (<span className="text-cyan-300 font-bold">Computer Science</span>) and extracted competencies:
                  </p>

                  <div className="space-y-2.5">
                    {[
                      {
                        name: "Tata Consultancy Services",
                        role: "Software Engineering Intern",
                        location: "Mumbai / Bengaluru",
                        match: "98% Match",
                        stipend: "₹5,000/mo + ₹6k Grant",
                      },
                      {
                        name: "Larsen & Toubro",
                        role: "Digital Systems & Infrastructure Intern",
                        location: "Chennai / Vadodara",
                        match: "95% Match",
                        stipend: "₹5,000/mo + ₹6k Grant",
                      },
                      {
                        name: "HDFC Bank",
                        role: "FinTech Operations & Systems Intern",
                        location: "Mumbai",
                        match: "92% Match",
                        stipend: "₹5,000/mo + ₹6k Grant",
                      },
                    ].map((job, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl bg-white/[0.04] border border-white/10 p-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.07] transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <CompanyLogo name={job.name} className="h-9 w-9 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-black text-white truncate">{job.name}</div>
                            <div className="text-[11px] text-slate-300 truncate">{job.role}</div>
                            <div className="text-[10px] text-slate-400">{job.location} • {job.stipend}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-950/90 border border-emerald-800 px-2 py-1 rounded-lg inline-block">
                            {job.match}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-1 text-xs text-slate-400 font-mono">
                    + 257 more live internships filtered across 25 corporate sectors
                  </div>
                </div>
              )}

              {/* TAB 3: SHORTLISTED RESUMES VAULT */}
              {activeTab === "resumes" && (
                <div className="space-y-4 pt-5">
                  <p className="text-xs text-slate-300">
                    Real candidate 1-page resumes that successfully cleared screening rounds at top corporate employers:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        branch: "Computer Science",
                        company: "TCS / Infosys",
                        score: "96 ATS Score",
                        badge: "Selected",
                        accent: "border-cyan-500/40 bg-cyan-950/30",
                      },
                      {
                        branch: "Mechanical Engg",
                        company: "Tata Motors / L&T",
                        score: "94 ATS Score",
                        badge: "Selected",
                        accent: "border-amber-500/40 bg-amber-950/30",
                      },
                      {
                        branch: "Commerce & Fin",
                        company: "HDFC Bank / ICICI",
                        score: "93 ATS Score",
                        badge: "Selected",
                        accent: "border-purple-500/40 bg-purple-950/30",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`rounded-2xl border ${item.accent} p-4 space-y-2.5 flex flex-col justify-between`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                              Stream #{idx + 1}
                            </span>
                            <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[9px] font-black uppercase">
                              {item.badge}
                            </span>
                          </div>
                          <div className="text-sm font-black text-white">{item.branch}</div>
                          <div className="text-xs text-slate-300">{item.company}</div>
                        </div>
                        <div className="text-[11px] font-mono text-cyan-300 font-bold">
                          {item.score}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-400" />
                      <span>Includes round-by-round interview guides &amp; HR screening questions</span>
                    </span>
                    <span className="text-saffron font-bold">9 Streams Total</span>
                  </div>
                </div>
              )}

              {/* HUD Footer Link */}
              <div className="pt-4 mt-2 border-t border-white/10 text-center">
                <span className="text-xs font-black text-saffron group-hover:underline inline-flex items-center gap-1.5">
                  <span>{user ? "View Full Candidate Studio in Dashboard" : "Register Free to Analyze Your 1-Page Resume"}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPANION BENTO GRID: 3 Razor-Sharp Luxury Feature Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Bento Tile 1: 15-Second Recruiter Benchmark */}
        <div
          onClick={() => handleAction("profile", "register")}
          className="group relative rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 p-6 shadow-sm hover:shadow-xl hover:border-saffron/50 transition-all duration-300 cursor-pointer backdrop-blur-xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 grid place-items-center transition-transform group-hover:scale-110">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                Speed Test
              </span>
            </div>

            <div>
              <h4 className="font-display text-lg font-black text-slate-900 dark:text-white group-hover:text-saffron transition">
                15-Second Recruiter Speed Test
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                Strict 1-page formatting enforcement. Simulates enterprise ATS screeners to ensure essential skills are parsed in the first 8 seconds.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-black text-saffron group-hover:underline inline-flex items-center gap-1">
              <span>Test My Resume</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">Strict 1-Page Rule</span>
          </div>
        </div>

        {/* Bento Tile 2: 260+ Verified Database Openings */}
        <div
          onClick={() => handleAction("profile", "register")}
          className="group relative rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 cursor-pointer backdrop-blur-xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 grid place-items-center transition-transform group-hover:scale-110">
                <Target className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                MongoDB Synced
              </span>
            </div>

            <div>
              <h4 className="font-display text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                Top 5 Corporate Vacancies Fit
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                Direct algorithmic alignment against 260 official PM Scheme positions at Top 500 companies with ₹5,000 monthly stipend.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 group-hover:underline inline-flex items-center gap-1">
              <span>View Matching Jobs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">260 Live in DB</span>
          </div>
        </div>

        {/* Bento Tile 3: Shortlisted Resumes Vault */}
        <div
          onClick={() => handleAction("resumes", "register")}
          className="group relative rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 p-6 shadow-sm hover:shadow-xl hover:border-purple-500/50 transition-all duration-300 cursor-pointer backdrop-blur-xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 grid place-items-center transition-transform group-hover:scale-110">
                <Award className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                9 Streams
              </span>
            </div>

            <div>
              <h4 className="font-display text-lg font-black text-slate-900 dark:text-white group-hover:text-purple-400 transition">
                Selected 1-Page CVs Archive
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                Real candidate resumes that secured offers at TCS, L&amp;T, and Tata Motors, paired with round-by-round interview guides.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-black text-purple-600 dark:text-purple-400 group-hover:underline inline-flex items-center gap-1">
              <span>Study Winning Resumes</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">9 Disciplines</span>
          </div>
        </div>
      </div>
    </section>
  );
}