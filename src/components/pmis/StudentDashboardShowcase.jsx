import { useState } from "react";
import {
  FileText,
  Target,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building,
  GraduationCap,
  Briefcase,
  Search,
  Upload,
  UserCheck,
  TrendingUp,
  FileCheck2,
} from "lucide-react";

export default function StudentDashboardShowcase({ user, onOpenAuth, onNavigateToDashboard }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const handleAction = (tabName = "profile", defaultMode = "register") => {
    if (!user) {
      if (onOpenAuth) onOpenAuth(defaultMode);
    } else {
      if (onNavigateToDashboard) onNavigateToDashboard(tabName);
    }
  };

  const DASHBOARD_FEATURES = [
    {
      id: "resume-audit",
      tab: "profile",
      icon: FileCheck2,
      badge: "Industry Corporate Standard",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300",
      title: "AI 1-Page Resume & ATS Audit",
      description:
        "Strict 1-page PDF compliance check, recruiter scan speed rating under 15 seconds, and instant ATS score (0–100).",
      bullets: [
        "1-Page PDF Strict Validation",
        "ATS Score & Layout Review",
        "Branch & Skills Extraction",
      ],
      ctaText: "Audit Resume",
      accentBorder: "group-hover:border-blue-500",
    },
    {
      id: "database-matching",
      tab: "profile",
      icon: Target,
      badge: "MongoDB Real-time Sync",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300",
      title: "Top 5 Database Jobs Match",
      description:
        "Direct algorithmic alignment against 260 official PM Scheme corporate internships based on your branch and extracted skills.",
      bullets: [
        "260+ Official PMIS Openings",
        "Recruiter Match Score %",
        "Matched Skill Highlighting",
      ],
      ctaText: "View Matching Jobs",
      accentBorder: "group-hover:border-emerald-500",
    },
    {
      id: "disha-ai",
      tab: "profile",
      icon: Sparkles,
      badge: "24/7 PMIS Assistant",
      badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300",
      title: "Disha AI Guidance Assistant",
      description:
        "Instant bilingual guidance on PM Internship Scheme eligibility, corporate allowances, sector options, and selection criteria.",
      bullets: [
        "24/7 Scheme Information",
        "Bilingual Hindi & English",
        "Instant Eligibility Check",
      ],
      ctaText: "Ask Disha AI",
      accentBorder: "group-hover:border-indigo-500",
    },
    {
      id: "shortlisted-resumes",
      tab: "resumes",
      icon: Award,
      badge: "9 Academic Disciplines",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300",
      title: "Shortlisted Resumes & Prep",
      description:
        "Learn from real candidate resumes selected at premier Indian MNCs, complete with curated technical and HR interview guides.",
      bullets: [
        "Real Selected Resumes",
        "Branch-Locked Guidance",
        "Curated Interview Questions",
      ],
      ctaText: "Study Selected Resumes",
      accentBorder: "group-hover:border-purple-500",
    },
    {
      id: "application-tracking",
      tab: "applications",
      icon: Briefcase,
      badge: "Live Status Sync",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
      title: "1-Click Application Tracking",
      description:
        "Apply to multiple corporate internships seamlessly, monitor recruitment status, and manage stipend allowances.",
      bullets: [
        "Real-time Application Status",
        "₹5,000/mo + ₹6,000 Grant",
        "Zero Paperwork Portal",
      ],
      ctaText: "Track Applications",
      accentBorder: "group-hover:border-amber-500",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12 space-y-8" aria-label="Student Dashboard Capabilities">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 px-3 py-1 text-xs font-black uppercase text-primary dark:text-saffron tracking-wider">
            <GraduationCap className="h-3.5 w-3.5 text-saffron" />
            <span>Student Career Command Center</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
            Everything You Need to Get Shortlisted
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-2xl">
            Register for free to unlock the complete corporate preparation suite: AI 1-page resume analysis, top 5 database job matching, and verified shortlisted resumes.
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

      {/* HERO GLIMPSE CARD: "ANALYZE & APPLY WITH YOUR RESUME NOW" */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-slate-900 via-primary/95 to-slate-950 text-white p-6 sm:p-8 lg:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-saffron/20 border border-saffron/40 px-3 py-1 text-xs font-black uppercase text-saffron tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Glimpse of AI Resume Recruiter Engine</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              Analyze &amp; Apply with Your Resume Now
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Upload your 1-page corporate resume to receive an instant ATS score, recruiter scan review, academic branch classification, and the{" "}
              <strong className="text-saffron font-bold">top 5 matching corporate jobs</strong> directly from the 260 official PM Internship Scheme positions in our database.
            </p>

            {/* Checklist tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Strict 1-Page PDF Validation</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Real-Time ATS Score (0–100)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Branch &amp; Verified Skills Detection</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Top 5 Jobs Matched from Database</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleAction("profile", "register")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-slate-950 font-black px-6 py-3 text-xs sm:text-sm shadow-lg hover:brightness-110 transition cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>{user ? "Audit My Resume Now" : "Register to Analyze Resume"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleAction("resumes", "register")}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-extrabold px-5 py-3 text-xs sm:text-sm border border-white/20 transition cursor-pointer"
              >
                <Award className="h-4 w-4 text-orange-400" />
                <span>View Shortlisted Resumes</span>
              </button>
            </div>

            {!user && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                <Lock className="h-3 w-3 text-saffron" />
                <span>Requires free student login / registration to securely audit your resume.</span>
              </p>
            )}
          </div>

          {/* Right Column: Visual Glimpse of the Audit Card */}
          <div className="lg:col-span-5">
            <div
              onClick={() => handleAction("profile", "register")}
              className="group relative rounded-2xl border-2 border-slate-700 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md cursor-pointer hover:border-saffron/80 transition-all duration-300"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-[11px] font-mono font-bold text-slate-400">
                    resume_audit_preview.json
                  </span>
                </div>
                <span className="rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 text-[10px] font-black uppercase">
                  96 / 100 • Grade A
                </span>
              </div>

              {/* Sample Profile Glimpse */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-display text-sm font-black text-white">
                      Ritik Sharma
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Computer Science &amp; Engineering • B.Tech
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
                    ✓ 1-Page Verified
                  </span>
                </div>

                {/* Extracted Skills Preview */}
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Extracted Skills:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {["Python", "React", "SQL", "Git", "REST APIs", "Docker"].map((sk, sI) => (
                      <span
                        key={sI}
                        className="rounded bg-blue-950/80 text-blue-300 border border-blue-800/80 px-2 py-0.5 text-[10px] font-bold"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top Matched Jobs Glimpse */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <p className="text-[10px] font-extrabold text-saffron uppercase tracking-wider flex items-center justify-between">
                    <span>Top Database Job Matches:</span>
                    <span className="text-[10px] text-slate-400 font-normal">260 in DB</span>
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-[11px]">
                      <div>
                        <span className="font-bold text-white">Tata Consultancy Services</span>
                        <span className="text-slate-400 block text-[10px]">Software Development Intern</span>
                      </div>
                      <span className="font-mono font-black text-emerald-400 text-[11px]">96% Match</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-[11px]">
                      <div>
                        <span className="font-bold text-white">Infosys</span>
                        <span className="text-slate-400 block text-[10px]">Research &amp; Reporting Intern</span>
                      </div>
                      <span className="font-mono font-black text-emerald-400 text-[11px]">93% Match</span>
                    </div>
                  </div>
                </div>

                {/* Click Overlay Banner */}
                <div className="mt-3 pt-2 text-center">
                  <span className="text-xs font-black text-saffron group-hover:underline inline-flex items-center gap-1">
                    <span>{user ? "Open Your Resume Audit" : "Click to Register & Analyze Your Resume"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-FEATURE GRID: ALL STUDENT DASHBOARD CAPABILITIES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-saffron" />
            <span>5 Core Pillars of the PMIS Student Dashboard</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            Click any feature to launch or sign up
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DASHBOARD_FEATURES.map((feature, fIdx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => handleAction(feature.tab, "register")}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`group flex flex-col justify-between rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${feature.accentBorder}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 grid place-items-center text-primary dark:text-saffron group-hover:scale-110 transition">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    {feature.bullets.map((b, bI) => (
                      <li key={bI} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-primary dark:text-saffron group-hover:underline">
                    {feature.ctaText} →
                  </span>
                  {!user && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      <Lock className="h-2.5 w-2.5 text-saffron" />
                      <span>Free Login</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* 6th Card: Registration Incentive Banner */}
          <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/5 via-saffron/5 to-transparent p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-saffron/20 grid place-items-center text-saffron">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="font-display text-base font-black text-slate-900 dark:text-white">
                Ready to Land a Top Corporate Internship?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Create your student profile in 30 seconds. Access all 260 official PM Scheme positions, AI resume reviews, and direct application channels.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
              <button
                onClick={() => handleAction("profile", "register")}
                className="w-full rounded-xl bg-primary text-primary-foreground font-black py-2.5 text-xs hover:bg-primary/90 transition shadow-sm cursor-pointer"
              >
                {user ? "View Student Profile" : "Register Free Now"}
              </button>
              {!user && (
                <button
                  onClick={() => handleAction("profile", "login")}
                  className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-primary transition cursor-pointer"
                >
                  Already registered? Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
