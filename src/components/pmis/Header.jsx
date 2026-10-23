import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  UserRound,
  ArrowUpRight,
  Home,
  BookOpen,
  HelpCircle,
  FileText,
  PlayCircle,
  Images,
  Gift,
  Library,
  Smartphone,
  Headphones,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from "lucide-react";
import mca from "@/assets/MCA.svg";
import pmLogo from "@/assets/pm_internship_logo_eng.svg";
import viksit from "@/assets/viksit.png";
import { NAV } from "./navData";

const ICONS = {
  Guidelines: BookOpen,
  FAQs: HelpCircle,
  Manuals: FileText,
  "Guidance Videos": PlayCircle,
  Gallery: Images,
  Benefits: Gift,
  Compendium: Library,
  "Mobile App": Smartphone,
  Support: Headphones,
};

function Dropdown({ item, Icon, open, onToggle }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className={`group flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
          open
            ? "bg-white/15 text-orange-400 shadow-xs"
            : "text-slate-200 hover:text-white hover:bg-white/10 hover:scale-105"
        }`}
      >
        {Icon && <Icon className="h-3.5 w-3.5 text-orange-400 group-hover:scale-110 transition-transform" />}
        <span>{item.label}</span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180 text-orange-400" : "group-hover:text-white"
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 top-full z-50 mt-2.5 rounded-2xl border-2 border-slate-700/80 bg-slate-900/98 backdrop-blur-2xl p-5 text-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 ${
            item.groups.length > 1
              ? "grid w-[min(44rem,92vw)] grid-cols-2 gap-6 lg:grid-cols-3"
              : "w-80"
          }`}
        >
          {item.groups.map((g) => (
            <div key={g.title}>
              <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-orange-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                {g.title}
              </p>
              <ul className="space-y-1">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start justify-between gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">{l.label}</span>
                      <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 text-orange-400 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMenu({ onClose, user, onOpenAuth, onSetView, onLogout }) {
  const [openIdx, setOpenIdx] = useState(-1);
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-xl" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white dark:bg-slate-900 shadow-2xl border-l border-border">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <span className="font-display text-base font-extrabold text-slate-900 dark:text-white">
            PMIS Portal Menu
          </span>
          <button onClick={onClose} aria-label="Close menu" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Main Links (Single Home link only) */}
        <div className="p-3 border-b space-y-1.5">
          <button
            onClick={() => {
              onSetView("home");
              onClose();
            }}
            className="flex w-full items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-extrabold text-slate-800 dark:text-slate-100"
          >
            <Home className="h-4 w-4 text-orange-500" /> Home
          </button>
          <button
            onClick={() => {
              onSetView("explore");
              onClose();
            }}
            className="flex w-full items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs font-extrabold text-primary"
          >
            <Briefcase className="h-4 w-4" /> Explore 120 Internships
          </button>
          <button
            onClick={() => {
              onSetView("dashboard");
              onClose();
            }}
            className="flex w-full items-center gap-2 rounded-xl bg-orange-500/15 px-3 py-2 text-xs font-extrabold text-orange-700 dark:text-orange-300"
          >
            <LayoutDashboard className="h-4 w-4 text-orange-600" /> Student Dashboard
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {NAV.map((item, i) =>
            item.groups ? (
              <div key={item.label} className="border-b last:border-0 border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                  aria-expanded={openIdx === i}
                  className="flex w-full items-center justify-between px-2 py-3 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  {item.label}
                  <ChevronDown
                    className={"h-3.5 w-3.5 transition-transform " + (openIdx === i ? "rotate-180" : "")}
                  />
                </button>
                {openIdx === i && (
                  <div className="space-y-3 pb-3 pl-2">
                    {item.groups.map((g) => (
                      <div key={g.title}>
                        <p className="px-2 text-[10px] font-black uppercase tracking-widest text-orange-600">
                          {g.title}
                        </p>
                        {g.links.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-md px-2 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="block border-b px-2 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800"
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="border-t p-4">
          {user ? (
            <div className="space-y-2">
              <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2.5 text-xs">
                <p className="font-extrabold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-bold">{user.user_id}</p>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-300 text-red-600 text-xs font-bold py-2 hover:bg-red-50"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F57C00] to-[#E65100] px-4 py-3 text-sm font-bold text-white shadow-md"
            >
              <UserRound className="h-4 w-4" /> Login / Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Header({ user, onOpenAuth, onSetView, activeView = "home", onLogout }) {
  const [openIdx, setOpenIdx] = useState(-1);
  const [mobile, setMobile] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenIdx(-1);
    };
    const esc = (e) => e.key === "Escape" && (setOpenIdx(-1), setMobile(false));
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
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

        {/* Right Section: Viksit Bharat & Candidate Profile / Auth Button */}
        <div className="flex items-center gap-3">
          <img src={viksit} alt="Viksit Bharat" className="hidden lg:block h-10 object-contain hover:scale-105 transition-transform" />

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSetView("dashboard")}
                className="flex items-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 text-xs font-extrabold text-slate-900 dark:text-white transition shadow-2xs cursor-pointer"
                title="Open Student Dashboard"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white text-[11px] font-black">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </span>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </button>

              <button
                onClick={onLogout}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="sheen flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#F57C00] via-[#E65100] to-[#D84315] hover:brightness-110 px-5 py-2 text-xs font-black text-white shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <UserRound className="h-4 w-4" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobile(true)}
            aria-label="Open menu"
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-white lg:hidden cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tier 2: Redesigned PC Floating Dock with "Cool" Modern Styling */}
      <div className="hidden lg:block pb-2.5 px-4">
        <nav
          ref={navRef}
          aria-label="Main Navigation"
          className="mx-auto max-w-7xl rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800/90 shadow-xl px-3 py-1 flex items-center justify-between"
        >
          {/* Left Core Navigation Tabs */}
          <div className="flex items-center gap-1">
            {/* 1. SINGLE Home link (Navigates internally, no duplicate) */}
            <button
              onClick={() => onSetView("home")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeView === "home"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-102"
                  : "text-slate-300 hover:text-white hover:bg-white/10 hover:scale-105"
              }`}
            >
              <Home className="h-3.5 w-3.5 text-orange-400" />
              <span>Home</span>
            </button>

            {/* 2. Explore 120 Internships */}
            <button
              onClick={() => onSetView("explore")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeView === "explore"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-102"
                  : "text-slate-300 hover:text-white hover:bg-white/10 hover:scale-105"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5 text-orange-400" />
              <span>Explore Internships</span>
              <span className="rounded-full bg-orange-500/25 text-orange-300 text-[10px] font-black px-1.5 py-0.2 border border-orange-500/40">
                120
              </span>
            </button>

            {/* 3. Student Dashboard */}
            <button
              onClick={() => (user ? onSetView("dashboard") : onOpenAuth())}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeView === "dashboard"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-102"
                  : "text-slate-300 hover:text-white hover:bg-white/10 hover:scale-105"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-orange-400" />
              <span>Student Dashboard</span>
            </button>

            {/* Subtle Divider */}
            <span className="h-4 w-px bg-slate-700/80 mx-1.5" />

            {/* Government Resources & Guidelines Dropdowns */}
            {NAV.map((item, i) => {
              const Icon = ICONS[item.label];
              return item.groups ? (
                <Dropdown
                  key={item.label}
                  item={item}
                  Icon={Icon}
                  open={openIdx === i}
                  onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
                />
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-200"
                >
                  {Icon && <Icon className="h-3.5 w-3.5 text-orange-400" />}
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Right subtle portal badge */}
          <div className="flex items-center gap-2 pr-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-orange-400 border border-orange-500/20">
              <Sparkles className="h-3 w-3 text-orange-400" /> 2026 Batch
            </span>
          </div>
        </nav>
      </div>

      {mobile && (
        <MobileMenu
          onClose={() => setMobile(false)}
          user={user}
          onOpenAuth={onOpenAuth}
          onSetView={onSetView}
          onLogout={onLogout}
        />
      )}
    </header>
  );
}
