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
  ChevronDown,
} from "lucide-react";
import mca from "@/assets/MCA.svg";
import pmLogo from "@/assets/pm_internship_logo_eng.svg";
import viksit from "@/assets/viksit.png";
import { getTheme, toggleTheme } from "@/lib/theme";

function MobileMenu({ onClose, user, onOpenAuth, onSetView, onLogout, activeView, theme }) {
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
      category: "CORE PORTAL",
      items: [
        {
          id: "home",
          label: "Home",
          subtitle: "Central PMIS Portal Overview",
          icon: Home,
          color: "text-amber-500",
        },
        {
          id: "explore",
          label: "Explore Internships",
          subtitle: "260+ Verified Corporate Posts",
          icon: Briefcase,
          color: "text-blue-500",
          badge: "260+ Openings",
        },
        {
          id: "dashboard",
          label: "Student Dashboard",
          subtitle: "AI Resume & Applications",
          icon: LayoutDashboard,
          color: "text-emerald-500",
          authRequired: true,
          badge: "AI Powered",
        },
        {
          id: "recruiter",
          label: "Recruiter Portal",
          subtitle: "Enterprise Candidate Review Hub",
          icon: Building2,
          color: "text-purple-500",
          href: "/recruiter",
          badge: "Corporate",
        },
      ],
    },
    {
      category: "CAREER ACCELERATION",
      items: [
        {
          id: "trap",
          label: "Hiring Stream",
          subtitle: "Daily Verified Corporate Openings",
          icon: TrendingUp,
          color: "text-amber-500",
          badge: "Live Feed",
        },
        {
          id: "path",
          label: "Find Your Path",
          subtitle: "AI-Powered Learning Roadmaps",
          icon: Compass,
          color: "text-indigo-500",
          badge: "AI Roadmap",
        },
      ],
    },
    {
      category: "INFORMATION & ASSISTANCE",
      items: [
        {
          id: "faqs",
          label: "FAQs",
          subtitle: "Eligibility, Stipends & Selection",
          icon: HelpCircle,
          color: "text-sky-500",
        },
        {
          id: "benefits",
          label: "Scheme Benefits",
          subtitle: "₹5,000/mo Stipend + ₹6,000 Grant",
          icon: Gift,
          color: "text-purple-500",
        },
        {
          id: "support",
          label: "Support Desk",
          subtitle: "Toll-Free National Helpdesk",
          icon: Headphones,
          color: "text-rose-500",
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

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <img src={pmLogo} alt="PM Internship" className="h-8 w-auto object-contain" />
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">PM Internship Scheme</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Ministry of Corporate Affairs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card inside Drawer */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[160px]">{user.name}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Active Candidate</p>
                </div>
              </div>
              <button
                onClick={() => handleNavigate("dashboard", true)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition cursor-pointer"
              >
                Dashboard
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-4 py-2.5 text-xs shadow-md hover:brightness-105 transition cursor-pointer"
            >
              <UserRound className="h-4 w-4" />
              <span>Login / Candidate Register</span>
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-none">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <p className="px-2 text-[10px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {sec.category}
              </p>
              <div className="space-y-1">
                {sec.items.map((it) => {
                  const Icon = it.icon;
                  const isActive = activeView === it.id;
                  return (
                    <button
                      key={it.id}
                      onClick={() => handleNavigate(it.id, it.authRequired, it.href)}
                      className={`w-full flex items-center justify-between rounded-2xl p-2.5 transition text-left cursor-pointer ${
                        isActive
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 ${it.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold truncate">{it.label}</p>
                          <p className="text-[10px] text-slate-400 truncate">{it.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {it.badge && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {it.badge}
                          </span>
                        )}
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Helpline */}
          <a
            href="tel:1800116090"
            className="flex items-center justify-between rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 p-3 text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">National Helpdesk</p>
                <p className="text-xs font-black">1800 11 6090 (Toll Free)</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md">
              Call
            </span>
          </a>
        </nav>

        {/* Drawer Bottom Controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-2">
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
              <span>{theme === "dark" ? "Dark Theme" : "Light Theme"}</span>
            </span>
            <button
              onClick={toggleTheme}
              className="rounded-lg bg-slate-200/80 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold"
            >
              Toggle
            </button>
          </div>

          {user && (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold py-2 hover:bg-rose-50 transition cursor-pointer"
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
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    setTheme(getTheme());
    const handler = (e) => setTheme(e.detail || getTheme());
    window.addEventListener("pmis_theme_changed", handler);
    return () => window.removeEventListener("pmis_theme_changed", handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 shadow-xs transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* LEFT: Official Brand Marks */}
        <button
          onClick={() => onSetView("home")}
          className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer shrink-0"
        >
          <img
            src={mca}
            alt="Ministry of Corporate Affairs"
            className="h-8 sm:h-10 w-auto shrink-0 drop-shadow-2xs"
          />
          <span className="h-6 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />
          <img
            src={pmLogo}
            alt="PM Internship Scheme"
            className="h-7 sm:h-9 w-auto shrink-0 group-hover:scale-[1.02] transition-transform"
          />
          <div className="hidden xl:flex flex-col border-l border-slate-200 dark:border-slate-800 pl-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white">
              PM Internship Scheme
            </span>
            <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
              Ministry of Corporate Affairs • Govt of India
            </span>
          </div>
        </button>

        {/* CENTER: Clean, Spacious Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
          <button
            onClick={() => onSetView("home")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeView === "home"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onSetView("explore")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeView === "explore"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <span>Explore Internships</span>
          </button>

          <button
            onClick={() => (user ? onSetView("dashboard") : onOpenAuth())}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeView === "dashboard"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <span>Student Dashboard</span>
          </button>

          <button
            onClick={() => onSetView("trap")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeView === "trap"
                ? "bg-amber-500 text-slate-950 shadow-xs font-black"
                : "text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
            }`}
            title="Daily Verified Corporate Hiring News Stream"
          >
            <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
            <span>Hiring News</span>
          </button>

          <button
            onClick={() => onSetView("path")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeView === "path"
                ? "bg-indigo-600 text-white shadow-xs font-black"
                : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
            }`}
            title="AI-Powered Career Preparation Roadmaps"
          >
            <Compass className="h-3.5 w-3.5 text-indigo-500" />
            <span>AI Roadmap</span>
          </button>

          {/* Quick Help & FAQs Dropdown / Pill */}
          <div className="relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                ["faqs", "benefits", "support"].includes(activeView)
                  ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <span>Assistance</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {moreMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 space-y-0.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setMoreMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    onSetView("faqs");
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-left cursor-pointer"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-sky-500" />
                  <span>FAQs</span>
                </button>
                <button
                  onClick={() => {
                    onSetView("benefits");
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-left cursor-pointer"
                >
                  <Gift className="h-3.5 w-3.5 text-purple-500" />
                  <span>Scheme Benefits</span>
                </button>
                <button
                  onClick={() => {
                    onSetView("support");
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-left cursor-pointer"
                >
                  <Headphones className="h-3.5 w-3.5 text-rose-500" />
                  <span>National Helpdesk</span>
                </button>
              </div>
            )}
          </div>

          {/* Recruiter Portal Dedicated Link */}
          <a
            href="/recruiter"
            className="px-3 py-1.5 rounded-xl text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition cursor-pointer flex items-center gap-1.5"
            title="Corporate Recruiter Candidate Management Portal"
          >
            <Building2 className="h-3.5 w-3.5 text-amber-500" />
            <span>Recruiter Portal</span>
          </a>
        </nav>

        {/* RIGHT: Viksit Bharat, Theme Toggle, Auth CTA / User Avatar, Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <img
            src={viksit}
            alt="Viksit Bharat @ 2047"
            className="hidden xl:block h-8 w-auto object-contain"
          />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center justify-center cursor-pointer"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User Button / CTA */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSetView("dashboard")}
                className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-200 transition cursor-pointer"
                title="Open Student Dashboard"
              >
                <div className="h-5 w-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[10px]">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              </button>
              <button
                onClick={onLogout}
                aria-label="Logout"
                title="Logout session"
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-slate-950 font-black px-4 py-2 text-xs shadow-md shadow-amber-500/15 hover:brightness-105 active:scale-95 transition cursor-pointer"
            >
              <UserRound className="h-3.5 w-3.5" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobile(true)}
            aria-label="Open navigation menu"
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
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