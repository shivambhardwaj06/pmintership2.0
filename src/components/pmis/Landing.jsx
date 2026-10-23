import { useState, useEffect } from "react";
import AccessibilityBar from "./AccessibilityBar";
import Header from "./Header";
import NoticeBar from "./NoticeBar";
import BannerCarousel from "./BannerCarousel";
import StateDashboard from "./StateDashboard";
import TopFeaturedInternships from "./TopFeaturedInternships";
import ExploreInternships from "./ExploreInternships";
import StudentDashboard from "./StudentDashboard";
import AuthModal from "./AuthModal";
import Footer from "./Footer";
import { applyTheme, getTheme } from "@/lib/theme";

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, "");

export default function Landing() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("home"); // "home" | "explore" | "dashboard"
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

  // Handle URL hash changes (e.g. #explore, #dashboard, #home)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#explore" || hash === "#explore-internships") {
        setActiveView("explore");
      } else if (hash === "#dashboard" || hash === "#student-dashboard") {
        setActiveView("dashboard");
      } else if (hash === "#home") {
        setActiveView("home");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

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
        ) : (
          <div>
            <NoticeBar />
            <BannerCarousel onExploreClick={() => setActiveView("explore")} />
            <StateDashboard />
            <TopFeaturedInternships
              user={user}
              onExploreAll={() => setActiveView("explore")}
              onApplyClick={handleApplyFromLanding}
            />
          </div>
        )}
      </main>

      <Footer onSetView={setActiveView} />

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