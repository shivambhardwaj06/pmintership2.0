import { useState, useEffect } from "react";
import AccessibilityBar from "./AccessibilityBar";
import Header from "./Header";
import NoticeBar from "./NoticeBar";
import BannerCarousel from "./BannerCarousel";
import StudentDashboardShowcase from "./StudentDashboardShowcase";
import FeaturedCompaniesMarquee from "./FeaturedCompaniesMarquee";
import StateDashboard from "./StateDashboard";
import TopFeaturedInternships from "./TopFeaturedInternships";
import ExploreInternships from "./ExploreInternships";
import StudentDashboard from "./StudentDashboard";
import DontFallInTrap from "./DontFallInTrap";
import FindYourPath from "./FindYourPath";
import FAQs from "./FAQs";
import Benefits from "./Benefits";
import Support from "./Support";
import AuthModal from "./AuthModal";
import Footer from "./Footer";
import { applyTheme, getTheme } from "@/lib/theme";
import { TrendingUp, Compass, ArrowRight, ShieldCheck, Flame, Sparkles, Gift } from "lucide-react";
import { BACKEND_URL } from "@/lib/apiConfig";

export default function Landing() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("home"); // "home" | "explore" | "dashboard" | "trap" | "path" | "faqs" | "benefits" | "support"
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState("login");

  // Initialize theme on client boot
  useEffect(() => {
    applyTheme(getTheme());
  }, []);

  // Load existing session on boot & auto-sanitize generic name placeholders
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pmis_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.name &&
          (parsed.name.toLowerCase().includes("authenticated candidate") ||
            parsed.name.toLowerCase() === "guest" ||
            parsed.name.toLowerCase() === "student candidate")
        ) {
          if (parsed.email && parsed.email.includes("@")) {
            const raw = parsed.email.split("@")[0].replace(/[0-9._-]+/g, " ").trim();
            if (raw) {
              parsed.name = raw
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
              localStorage.setItem("pmis_user", JSON.stringify(parsed));
            }
          }
        }
        setUser(parsed);
      }
    } catch {
      // ignore
    }

    const handleUserUpdate = () => {
      try {
        const saved = localStorage.getItem("pmis_user");
        if (saved) setUser(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener("pmis_user_updated", handleUserUpdate);
    return () => window.removeEventListener("pmis_user_updated", handleUserUpdate);
  }, []);

  // Smooth scroll to top whenever the active view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeView]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#explore" || hash === "#explore-internships") {
        setActiveView("explore");
      } else if (
        hash === "#dashboard" ||
        hash === "#student-dashboard" ||
        hash === "#resumes" ||
        hash === "#applications" ||
        hash === "#profile"
      ) {
        setActiveView("dashboard");
      } else if (hash === "#trap" || hash === "#dont-fall-in-trap" || hash === "#dont-fall-on-the-trap") {
        setActiveView("trap");
      } else if (hash === "#path" || hash === "#find-your-path") {
        setActiveView("path");
      } else if (hash === "#faqs" || hash === "#faq") {
        setActiveView("faqs");
      } else if (hash === "#benefits") {
        setActiveView("benefits");
      } else if (hash === "#support" || hash === "#help") {
        setActiveView("support");
      } else if (hash === "#home") {
        setActiveView("home");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const scrollToSection = (sectionId) => {
    if (activeView !== "home") {
      setActiveView("home");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("pmis_user");
    setUser(null);
    setActiveView("home");
  };

  const openAuthWithMode = (mode = "login") => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleApplyFromLanding = async (item) => {
    if (!user) {
      openAuthWithMode("login");
      return;
    }

    const storageKey = `pmis_applied_ids_${user.user_id}`;
    const appStorageKey = `pmis_applications_${user.user_id}`;
    const prevIds = JSON.parse(localStorage.getItem(storageKey) || "[]");

    if (prevIds.includes(item.id)) {
      return;
    }

    try {
      await fetch(`${BACKEND_URL}/api/user/apply?user_id=${user.user_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internship_id: item.id,
          company: item.company,
          title: item.title,
          notes: "Applied via Top Featured on PM Internship Portal",
        }),
      });
    } catch (err) {
      console.warn("Backend apply endpoint sync warning:", err);
    }

    const newIds = [...prevIds, item.id];
    localStorage.setItem(storageKey, JSON.stringify(newIds));

    const newAppRecord = {
      id: `APP-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      company: item.company,
      title: item.title,
      sector: item.sector,
      stipend: item.stipend,
      location: item.location,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Application Submitted",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300 font-bold",
    };

    const existingApps = JSON.parse(localStorage.getItem(appStorageKey) || "[]");
    existingApps.unshift(newAppRecord);
    localStorage.setItem(appStorageKey, JSON.stringify(existingApps));

    window.dispatchEvent(new Event("pmis_application_updated"));
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground">
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <AccessibilityBar />

      <Header
        user={user}
        onOpenAuth={() => openAuthWithMode("login")}
        activeView={activeView}
        onSetView={setActiveView}
        onNavigateToSection={scrollToSection}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {activeView === "dashboard" ? (
          <StudentDashboard
            user={user}
            onOpenAuth={() => openAuthWithMode("login")}
            onNavigateToInternships={() => setActiveView("explore")}
          />
        ) : activeView === "explore" ? (
          <div>
            <NoticeBar />
            <ExploreInternships
              user={user}
              onRequireAuth={() => openAuthWithMode("login")}
              onNavigateToDashboard={() => setActiveView("dashboard")}
            />
          </div>
        ) : activeView === "trap" ? (
          <DontFallInTrap
            user={user}
            onRequireAuth={() => openAuthWithMode("login")}
            onNavigateToExplore={() => setActiveView("explore")}
            onNavigateToPath={() => setActiveView("path")}
          />
        ) : activeView === "path" ? (
          <FindYourPath
            user={user}
            onRequireAuth={() => openAuthWithMode("login")}
            onNavigateToExplore={() => setActiveView("explore")}
          />
        ) : activeView === "faqs" ? (
          <FAQs
            onNavigateToExplore={() => setActiveView("explore")}
            onNavigateToSupport={() => setActiveView("support")}
          />
        ) : activeView === "benefits" ? (
          <Benefits
            user={user}
            onNavigateToExplore={() => setActiveView("explore")}
            onOpenAuth={() => openAuthWithMode("login")}
          />
        ) : activeView === "support" ? (
          <Support user={user} />
        ) : (
          /* HOME PAGE */
          <div>
            <NoticeBar />
            {/* 1. TOP 5-SLIDE SLOW SLIDESHOW BANNER */}
            <BannerCarousel
              onExploreClick={() => setActiveView("explore")}
              onOpenAuth={(mode) => openAuthWithMode(mode)}
            />

            {/* 2. ALL STUDENT DASHBOARD FEATURES & RESUME ANALYSIS GLIMPSE (REQUIRES LOGIN/REGISTER ON CLICK) */}
            <StudentDashboardShowcase
              user={user}
              onOpenAuth={(mode) => openAuthWithMode(mode)}
              onNavigateToDashboard={(tab) => {
                if (tab) window.location.hash = tab;
                setActiveView("dashboard");
              }}
            />

            {/* 3. MOVING BLOCK OF FEATURED COMPANIES (MARQUEE WITH LOGOS & NAMES) */}
            <FeaturedCompaniesMarquee
              onSelectCompany={() => {
                setActiveView("explore");
              }}
            />

            {/* 4. STATE-WISE VACANCY DASHBOARD */}
            <StateDashboard />

            {/* 5. TOP FEATURED INTERNSHIPS */}
            <TopFeaturedInternships
              user={user}
              onExploreAll={() => setActiveView("explore")}
              onApplyClick={handleApplyFromLanding}
            />

            {/* CLEAN CANDIDATE INTELLIGENCE & GUIDANCE CARDS */}
            <section className="py-14 sm:py-18 px-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-slate-950/40">
              <div className="mx-auto max-w-7xl">
                <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-saffron/15 dark:bg-saffron/20 border border-saffron/30 px-3 py-1 text-xs font-black uppercase text-saffron tracking-wider">
                    <Sparkles className="h-3.5 w-3.5 text-saffron" />
                    <span>Candidate Intelligence &amp; Roadmap</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Stay Ahead. Learn Fast. Get Hired.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Verified real-time corporate hiring announcements paired with personalized AI preparation roadmaps.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Hiring Stream */}
                  <div
                    onClick={() => setActiveView("trap")}
                    className="group relative rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/90 p-7 sm:p-8 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 grid place-items-center transition-transform group-hover:scale-105">
                          <TrendingUp className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                          Live Daily Stream
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                          Daily Verified Hiring News
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          Cut through the noise. Track authentic new job creation across Indian GCCs, semiconductor fabs, rail infra, and top corporate employers updated daily from verified government and industry feeds.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400 group-hover:underline inline-flex items-center gap-1.5">
                        <span>View Corporate Openings</span>
                        <ArrowRight className="h-4 w-4" />
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-400">1,25,000+ Posts</span>
                    </div>
                  </div>

                  {/* Card 2: Find Your Path */}
                  <div
                    onClick={() => setActiveView("path")}
                    className="group relative rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/90 p-7 sm:p-8 shadow-xs hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 grid place-items-center transition-transform group-hover:scale-105">
                          <Compass className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                          AI Career Planner
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          Personalized Learning Roadmap
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          Select your target corporate internship role and generate a tailored, week-by-week preparation sprint equipped with free open-source materials, interview benchmarks, and progress trackers.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 group-hover:underline inline-flex items-center gap-1.5">
                        <span>Generate AI Sprint</span>
                        <ArrowRight className="h-4 w-4" />
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-400">4, 8 &amp; 12-Week Sprints</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer
        onSetView={setActiveView}
        onNavigateToSection={scrollToSection}
      />

      {/* Global Auth Modal matching official MCA PMIS design */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
