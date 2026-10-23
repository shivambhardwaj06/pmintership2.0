import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import mca from "@/assets/MCA.svg";
import pmLogo from "@/assets/pm_internship_logo_eng.svg";
import viksit from "@/assets/viksit.png";
import { getTheme, toggleTheme } from "@/lib/theme";

function MobileMenu({ onClose, user, onOpenAuth, onSetView, onLogout, activeView, theme }) {
  const navigate = (view) => {
    onSetView(view);
    onClose();
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home, color: "text-orange-500", bgActive: "bg-orange-500 text-white" },
    { id: "explore", label: "Explore Internships", icon: Briefcase, color: "text-blue-500", bgActive: "bg-blue-600 text-white" },
    { id: "dashboard", label: "Student Dashboard", icon: LayoutDashboard, color: "text-emerald-500", bgActive: "bg-emerald-600 text-white", authRequired: true },
    { id: "trap", label: "Don't Fall in the Trap", icon: TrendingUp, color: "text-amber-500", bgActive: "bg-amber-600 text-white", badge: "Hiring Stream" },
    { id: "path", label: "Find Your Path", icon: Compass, color: "text-indigo-500", bgActive: "bg-indigo-600 text-white", badge: "AI Roadmap" },
    { id: "faqs", label: "FAQs", icon: HelpCircle, color: "text-sky-500", bgActive: "bg-sky-600 text-white" },
    { id: "benefits", label: "Scheme Benefits", icon: Gift, color: "text-purple-500", bgActive: "bg-purple-600 text-white" },
    { id: "support", label: "Support & Helpdesk", icon: Headphones, color: "text-rose-500", bgActive: "bg-rose-600 text-white" },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation Menu">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-display text-sm font-extrabold text-slate-900 dark:text-white">
              PMIS Portal Menu
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card / Auth Prompt in Menu */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          {user ? (
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-3.5 flex items-center justify-between border border-slate-200 dark:border-slate-700">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[10px] font-semibold text-slate-500 truncate">{user.email || user.user_id}</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 border border-emerald-500/30 shrink-0">
                Active
              </span>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2.5 text-xs font-black text-white shadow-md hover:brightness-105 transition cursor-pointer"
            >
              <UserRound className="h-4 w-4" /> Login / Register Account
            </button>
          )}
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.authRequired && !user) {
                    onOpenAuth();
                    onClose();
                  } else {
                    navigate(item.id);
                  }
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-extrabold transition cursor-pointer ${
                  isActive
                    ? item.bgActive + " shadow-sm scale-101"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : item.color}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-orange-500/15 text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Drawer Controls: Theme Switch & Logout */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            <span className="flex items-center gap-2">
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
              <span>{theme === "dark" ? "Dark Theme" : "Light Theme"}</span>
            </span>
            <button
              onClick={toggleTheme}
              className="rounded-lg bg-white dark:bg-slate-700 px-2.5 py-1 text-[11px] font-black text-slate-800 dark:text-white shadow-2xs cursor-pointer"
            >
              Switch
            </button>
          </div>

          {user && (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold py-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer"
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
      <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logos */}
        <button
          onClick={() => onSetView("home")}
          className="group flex min-w-0 items-center gap-3 sm:gap-4 text-left focus:outline-none cursor-pointer"
        >
          <img src={mca} alt="Ministry of Corporate Affairs" className="h-10 shrink-0 sm:h-12 drop-shadow-2xs" />
          <span className="h-8 w-px shrink-0 bg-slate-300 dark:bg-slate-700" />
          <img src={pmLogo} alt="PM Internship Scheme" className="h-9 shrink-0 sm:h-11 drop-shadow-2xs group-hover:scale-102 transition-transform" />
          <div className="hidden xl:flex flex-col border-l border-slate-200 dark:border-slate-700 pl-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              PM Internship Scheme
            </span>
            <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
              Ministry of Corporate Affairs • Govt of India
            </span>
          </div>
        </button>

        {/* Right Section: Viksit Bharat, Theme Toggle, Candidate Profile / Auth Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img src={viksit} alt="Viksit Bharat" className="hidden lg:block h-10 object-contain hover:scale-105 transition-transform" />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Authenticated User pill or Login Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSetView("dashboard")}
                className="flex items-center gap-2 rounded-2xl bg-primary/10 border border-primary/30 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition cursor-pointer"
                title="Open Student Dashboard"
              >
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center font-black text-[10px]">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </button>
              <button
                onClick={onLogout}
                aria-label="Logout"
                title="Logout session"
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2 text-xs font-black text-white shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer"
            >
              <UserRound className="h-3.5 w-3.5" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Mobile menu hamburger button */}
          <button
            onClick={() => setMobile(true)}
            aria-label="Open navigation menu"
            className="lg:hidden rounded-xl p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Tier 2: Desktop Executive Navigation Dock (Clean 8-Button Bar) */}
      <div className="hidden lg:block border-t border-slate-200/60 dark:border-slate-800/80 bg-slate-900 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex items-center justify-between gap-2 overflow-x-auto">
          {/* Navigation Items */}
          <div className="flex items-center gap-1 flex-nowrap min-w-0">
            {/* 1. Home */}
            <button
              onClick={() => onSetView("home")}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "home"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Home className="h-3.5 w-3.5 text-orange-400" />
              <span>Home</span>
            </button>

            {/* 2. Explore Internships */}
            <button
              onClick={() => onSetView("explore")}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "explore"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5 text-blue-400" />
              <span>Explore Internships</span>
            </button>

            {/* 3. Student Dashboard */}
            <button
              onClick={() => (user ? onSetView("dashboard") : onOpenAuth())}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "dashboard"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" />
              <span>Student Dashboard</span>
            </button>

            {/* Divider */}
            <span className="h-4 w-px bg-slate-700/80 mx-1 shrink-0" />

            {/* 4. Don't Fall in the Trap (Dedicated Page) */}
            <button
              onClick={() => onSetView("trap")}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "trap"
                  ? "bg-amber-500 text-white shadow-md font-black"
                  : "text-amber-300 hover:text-white hover:bg-amber-500/20"
              }`}
              title="Daily Verified Corporate Hiring Stream"
            >
              <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
              <span>Don&apos;t Fall in the Trap</span>
            </button>

            {/* 5. Find Your Path (Dedicated Page) */}
            <button
              onClick={() => onSetView("path")}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "path"
                  ? "bg-indigo-600 text-white shadow-md font-black"
                  : "text-indigo-300 hover:text-white hover:bg-indigo-500/20"
              }`}
              title="AI-Powered Personalized Career Roadmap"
            >
              <Compass className="h-3.5 w-3.5 text-indigo-400" />
              <span>Find Your Path</span>
              <span className="rounded-full bg-indigo-500/40 text-indigo-200 text-[9px] font-black px-1.5 py-0.2">
                AI
              </span>
            </button>

            {/* Divider */}
            <span className="h-4 w-px bg-slate-700/80 mx-1 shrink-0" />

            {/* 6. FAQs (Dedicated Page) */}
            <button
              onClick={() => onSetView("faqs")}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "faqs"
                  ? "bg-sky-600 text-white shadow-md font-black"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5 text-sky-400" />
              <span>FAQs</span>
            </button>

            {/* 7. Benefits (Dedicated Page) */}
            <button
              onClick={() => onSetView("benefits")}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "benefits"
                  ? "bg-purple-600 text-white shadow-md font-black"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Gift className="h-3.5 w-3.5 text-purple-400" />
              <span>Benefits</span>
            </button>

            {/* 8. Support (Dedicated Page) */}
            <button
              onClick={() => onSetView("support")}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeView === "support"
                  ? "bg-rose-600 text-white shadow-md font-black"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Headphones className="h-3.5 w-3.5 text-rose-400" />
              <span>Support</span>
            </button>
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
