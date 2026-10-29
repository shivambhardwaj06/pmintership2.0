import { useEffect, useState } from "react";
import {
  Menu,
  X,
  UserRound,
  Home,
  HelpCircle,
  Gift,
  Headphones,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Sun,
  Moon,
  TrendingUp,
  Compass,
  ChevronRight,
  PhoneCall,
  Sparkles,
  Building2,
} from "lucide-react";
import mca from "@/assets/MCA.svg";
import pmLogo from "@/assets/pm_internship_logo_eng.svg";
import viksit from "@/assets/viksit.png";
import { getTheme, toggleTheme } from "@/lib/theme";

function MobileMenu({ onClose, user, onOpenAuth, onSetView, onLogout, activeView, theme }) {
  // Lock body scroll and listen for Escape key to close
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleNavigate = (viewId, authRequired, href) => {
    if (href) {
      window.location.href = href;
      onClose();
      return;
    }
    if (authRequired && !user) {
      onOpenAuth();
      onClose();
    } else {
      onSetView(viewId);
      onClose();
    }
  };

  const navSections = [
    {
      category: "PORTAL NAVIGATION",
      items: [
        {
          id: "home",
          label: "Home",
          subtitle: "Central Portal & Scheme Overview",
          icon: Home,
          color: "text-orange-500",
          activeBg: "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25",
        },
        {
          id: "explore",
          label: "Explore Internships",
          subtitle: "1.25 Lakh+ Corporate Opportunities",
          icon: Briefcase,
          color: "text-blue-500",
          badge: "1.25L+ Posts",
          activeBg: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25",
        },
        {
          id: "dashboard",
          label: "Student Dashboard",
          subtitle: "AI Resume & Application Status",
          icon: LayoutDashboard,
          color: "text-emerald-500",
          authRequired: true,
          badge: "AI Powered",
          activeBg: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25",
        },
        {
          id: "recruiter",
          label: "Recruiter Portal",
          subtitle: "Corporate Partner Candidate Review",
          icon: Building2,
          color: "text-orange-500",
          href: "/recruiter",
          badge: "Corporate",
          activeBg: "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25",
        },
      ],
    },
    {
      category: "AI CAREER READINESS",
      items: [
        {
          id: "trap",
          label: "Don't Fall in the Trap",
          subtitle: "Daily Verified Corporate Hiring News",
          icon: TrendingUp,
          color: "text-amber-500",
          badge: "Live Stream",
          activeBg: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25",
        },
        {
          id: "path",
          label: "Find Your Path",
          subtitle: "Personalized AI Learning Roadmaps",
          icon: Compass,
          color: "text-indigo-500",
          badge: "AI Roadmap",
          activeBg: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25",
        },
      ],
    },
    {
      category: "SCHEME INFO & ASSISTANCE",
      items: [
        {
          id: "faqs",
          label: "FAQs",
          subtitle: "Eligibility, Stipend & Selection",
          icon: HelpCircle,
          color: "text-sky-500",
          activeBg: "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/25",
        },
        {
          id: "benefits",
          label: "Scheme Benefits",
          subtitle: "₹5,000/mo Allowance & Certification",
          icon: Gift,
          color: "text-purple-500",
          activeBg: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/25",
        },
        {
          id: "support",
          label: "Support & Helpdesk",
          subtitle: "MCA National Grievance Desk",
          icon: Headphones,
          color: "text-rose-500",
          activeBg: "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/25",
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation Menu">
      {/* Semi-transparent Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Dynamic Viewport Height for mobile browsers) */}
      <div className="fixed inset-y-0 right-0 flex h-[100dvh] w-full max-w-[340px] sm:max-w-[400px] flex-col bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-250 z-10">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 sm:px-5 py-3.5 bg-slate-50/90 dark:bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <img src={pmLogo} alt="PMIS" className="h-8 w-auto object-contain" />
            <div>
              <span className="font-display text-xs font-black text-slate-900 dark:text-white tracking-wide block">
                PM Internship Scheme
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Ministry of Corporate Affairs
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition active:scale-95 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card / Auth Section */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/40 dark:bg-slate-900/40">
          {user ? (
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-3 border border-primary/25">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-orange-500 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    {user.email || user.user_id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleNavigate("dashboard", false)}
                className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary text-white py-1.5 text-xs font-bold shadow-xs hover:brightness-110 active:scale-98 transition cursor-pointer"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Go to Student Dashboard</span>
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent p-3 sm:p-3.5 border border-orange-500/25">
              <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-black text-[11px]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Aspirant Portal Access</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 mb-2.5">
                Apply for 1.25 Lakh+ internships & build AI roadmaps
              </p>
              <button
                onClick={() => {
                  onOpenAuth();
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2.5 text-xs font-black text-white shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer"
              >
                <UserRound className="h-4 w-4" /> Login / Register Account
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-4 scrollbar-none">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-2 pb-1 text-[10px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {section.category}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id, item.authRequired, item.href)}
                      className={`group flex w-full items-center justify-between rounded-xl p-2.5 sm:p-3 transition-all cursor-pointer ${
                        isActive
                          ? item.activeBg
                          : "bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 active:scale-[0.98]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 text-left">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-white dark:bg-slate-700 " + item.color + " shadow-2xs"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black truncate">{item.label}</p>
                          <p
                            className={`text-[10px] truncate ${
                              isActive ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {item.badge && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? "bg-white/25 text-white"
                                : "bg-orange-500/15 text-orange-600 dark:text-orange-400"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={`h-4 w-4 ${
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:translate-x-0.5 transition-transform"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Helpline Strip */}
          <a
            href="tel:1800116090"
            className="flex items-center justify-between rounded-xl bg-orange-500/10 dark:bg-orange-950/30 border border-orange-500/25 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-orange-500/15 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-orange-500 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase text-orange-600 dark:text-orange-400">
                  National Helpdesk
                </p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">1800 11 6090 (Toll Free)</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 bg-orange-500/20 rounded-md px-2 py-0.5">
              Call Now
            </span>
          </a>
        </nav>

        {/* Drawer Bottom Controls */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 space-y-2.5 shrink-0 bg-slate-50/70 dark:bg-slate-950/70 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {/* Theme Switcher */}
          <div className="flex items-center justify-between rounded-xl bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="flex items-center gap-2">
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
              <span>{theme === "dark" ? "Dark Theme" : "Light Theme"}</span>
            </span>
            <button
              onClick={toggleTheme}
              className="rounded-lg bg-slate-100 dark:bg-slate-700 px-2.5 py-1 text-[11px] font-black text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer active:scale-95"
            >
              Switch
            </button>
          </div>

          {/* Logout button */}
          {user && (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold py-2 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition cursor-pointer active:scale-98"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Header({ user, onOpenAuth, onSetView, activeView = "home", onLogout }) {
  const [mobile, setMobile] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(getTheme());
    const handler = (e) => setTheme(e.detail || getTheme());
    window.addEventListener("pmis_theme_changed", handler);
    return () => window.removeEventListener("pmis_theme_changed", handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
      {/* Tier 1: Brand & User Bar */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logos */}
        <button
          onClick={() => onSetView("home")}
          className="group flex min-w-0 items-center gap-2 sm:gap-3.5 text-left focus:outline-none cursor-pointer shrink"
        >
          <img
            src={mca}
            alt="Ministry of Corporate Affairs"
            className="h-7 sm:h-9 md:h-11 w-auto shrink-0 drop-shadow-2xs"
          />
          <span className="h-5 sm:h-7 w-px shrink-0 bg-slate-300 dark:bg-slate-700" />
          <img
            src={pmLogo}
            alt="PM Internship Scheme"
            className="h-6 sm:h-8 md:h-10 w-auto shrink-0 drop-shadow-2xs group-hover:scale-102 transition-transform"
          />
          <div className="hidden xl:flex flex-col border-l border-slate-200 dark:border-slate-700 pl-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              PM Internship Scheme
            </span>
            <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
              Ministry of Corporate Affairs • Govt of India
            </span>
          </div>
        </button>

        {/* Right Section: Viksit Bharat, Theme Toggle, Auth / Profile Pill, Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <img
            src={viksit}
            alt="Viksit Bharat"
            className="hidden lg:block h-9 xl:h-10 object-contain hover:scale-105 transition-transform"
          />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Authenticated User pill or Login Button */}
          {user ? (
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={() => onSetView("dashboard")}
                className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-primary/10 border border-primary/30 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition cursor-pointer"
                title="Open Student Dashboard"
              >
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary text-white flex items-center justify-center font-black text-[10px]">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              </button>
              <button
                onClick={onLogout}
                aria-label="Logout"
                title="Logout session"
                className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-black text-white shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer shrink-0"
            >
              <UserRound className="h-3.5 w-3.5" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Mobile / Tablet Menu Button */}
          <button
            onClick={() => setMobile(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobile}
            className="lg:hidden flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95 shrink-0"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tier 2: Executive Navigation Dock (Horizontally Scrollable on Tablet, Expansive on Desktop) */}
      <div className="hidden md:block border-t border-slate-200/60 dark:border-slate-800/80 bg-slate-900 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-1.5 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          {/* Navigation Items (All shrink-0 whitespace-nowrap to guarantee zero wrapping or squishing) */}
          <div className="flex items-center gap-1 xl:gap-1.5 flex-nowrap min-w-0">
            {/* 1. Home */}
            <button
              onClick={() => onSetView("home")}
              className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "home"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Home className="h-3.5 w-3.5 text-orange-400 shrink-0" />
              <span>Home</span>
            </button>

            {/* 2. Explore Internships */}
            <button
              onClick={() => onSetView("explore")}
              className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "explore"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span>Explore Internships</span>
            </button>

            {/* 3. Student Dashboard */}
            <button
              onClick={() => (user ? onSetView("dashboard") : onOpenAuth())}
              className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "dashboard"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Student Dashboard</span>
            </button>

            {/* Divider */}
            <span className="h-4 w-px bg-slate-700/80 mx-1 shrink-0" />

            {/* 4. Don't Fall in the Trap */}
            <button
              onClick={() => onSetView("trap")}
              className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "trap"
                  ? "bg-amber-500 text-white shadow-md font-black"
                  : "text-amber-300 hover:text-white hover:bg-amber-500/20"
              }`}
              title="Daily Verified Corporate Hiring Stream"
            >
              <TrendingUp className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Don&apos;t Fall in the Trap</span>
            </button>

            {/* 5. Find Your Path */}
            <button
              onClick={() => onSetView("path")}
              className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "path"
                  ? "bg-indigo-600 text-white shadow-md font-black"
                  : "text-indigo-300 hover:text-white hover:bg-indigo-500/20"
              }`}
              title="AI-Powered Personalized Career Roadmap"
            >
              <Compass className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span>Find Your Path</span>
              <span className="rounded-full bg-indigo-500/40 text-indigo-200 text-[9px] font-black px-1.5 py-0.2 shrink-0">
                AI
              </span>
            </button>

            {/* Divider */}
            <span className="h-4 w-px bg-slate-700/80 mx-1 shrink-0" />

            {/* 6. FAQs */}
            <button
              onClick={() => onSetView("faqs")}
              className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "faqs"
                  ? "bg-sky-600 text-white shadow-md font-black"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5 text-sky-400 shrink-0" />
              <span>FAQs</span>
            </button>

            {/* 7. Benefits */}
            <button
              onClick={() => onSetView("benefits")}
              className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "benefits"
                  ? "bg-purple-600 text-white shadow-md font-black"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Gift className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span>Benefits</span>
            </button>

            {/* 8. Support */}
            <button
              onClick={() => onSetView("support")}
              className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "support"
                  ? "bg-rose-600 text-white shadow-md font-black"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Headphones className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              <span>Support</span>
            </button>

            {/* Divider */}
            <span className="h-4 w-px bg-slate-700/80 mx-1 shrink-0" />

            {/* Corporate Recruiter Portal Link */}
            <a
              href="/recruiter"
              className="shrink-0 whitespace-nowrap flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-black text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 transition cursor-pointer"
              title="Corporate Recruiter Portal: Manage Opportunities & Candidate Resumes"
            >
              <Building2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Recruiter Portal</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobile && (
        <MobileMenu
          onClose={() => setMobile(false)}
          user={user}
          onOpenAuth={onOpenAuth}
          onSetView={onSetView}
          onLogout={onLogout}
          activeView={activeView}
          theme={theme}
        />
      )}
    </header>
  );
}
