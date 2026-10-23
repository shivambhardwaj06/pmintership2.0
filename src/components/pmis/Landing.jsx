import { useState, useEffect } from "react";
import AccessibilityBar from "./AccessibilityBar";
import Header from "./Header";
import NoticeBar from "./NoticeBar";
import BannerCarousel from "./BannerCarousel";
import StateDashboard from "./StateDashboard";
import ExploreInternships from "./ExploreInternships";
import StudentDashboard from "./StudentDashboard";
import AuthModal from "./AuthModal";
import Footer from "./Footer";

export default function Landing() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("home"); // "home" | "explore" | "dashboard"
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState("login");

  // Load existing session on boot
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pmis_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
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
            />
          </div>
        ) : (
          <div>
            <NoticeBar />
            <BannerCarousel onExploreClick={() => setActiveView("explore")} />
            <StateDashboard />
            <ExploreInternships
              user={user}
              onRequireAuth={() => openAuthWithMode("login")}
            />
          </div>
        )}
      </main>

      <Footer />

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
