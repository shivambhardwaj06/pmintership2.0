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

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, "");

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

            {/* TWO HIGH-IMPACT PROMOTIONAL CARDS FOR "DON'T FALL IN THE TRAP" & "FIND YOUR PATH" */}
            <section className="py-12 px-4 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Promo Card 1: Don't Fall in the Trap */}
                  <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white dark:to-slate-900 p-8 shadow-sm flex flex-col justify-between group hover:border-amber-500/60 hover:shadow-xl transition-all duration-300">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-black uppercase text-amber-600 dark:text-amber-400">
                        <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                        <span>Daily Verified Hiring Stream</span>
                      </div>
                      <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                        Don&apos;t Fall in the Trap
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="text-rose-600 dark:text-rose-400 font-extrabold line-through mr-1">
                          Stop focusing on layoffs.
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                          Focus on massive new corporate roles created daily!
                        </span>{" "}
                        Track verified hiring announcements from Google News, Tata Semiconductor, GCC expansions, and top Indian MNCs.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-amber-500/20 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                        1,25,000+ PMIS Openings • Real-time Sources
                      </span>
                      <button
                        onClick={() => setActiveView("trap")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 text-xs font-black shadow-md hover:brightness-105 transition cursor-pointer"
                      >
                        <span>View Hiring Stream</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Promo Card 2: Find Your Path */}
                  <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-white dark:to-slate-900 p-8 shadow-sm flex flex-col justify-between group hover:border-indigo-500/60 hover:shadow-xl transition-all duration-300">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">
                        <Compass className="h-3.5 w-3.5 text-indigo-500" />
                        <span>AI-Powered Career Navigator</span>
                      </div>
                      <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                        Find Your Path
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                        Select your dream corporate role from official PM Internship Scheme tracks, and let AI generate an actionable, week-by-week preparation roadmap with 100% free open-source resources and progress tracking.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-indigo-500/20 flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                        Custom 4, 8 or 12-Week Sprints
                      </span>
                      <button
                        onClick={() => setActiveView("path")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 text-xs font-black shadow-md hover:brightness-105 transition cursor-pointer"
                      >
                        <span>Generate AI Roadmap</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
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
