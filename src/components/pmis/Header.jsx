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
  Home,
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
        className={
          "flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12px] font-semibold transition-colors hover:bg-primary-foreground/10 hover:text-saffron " +
          (open ? "bg-primary-foreground/10 text-saffron" : "")
        }
      >
        {Icon && <Icon className="h-3.5 w-3.5 text-saffron" />}
        {item.label}
        <ChevronDown
          className={"h-3 w-3 opacity-80 transition-transform " + (open ? "rotate-180" : "")}
        />
      </button>
      {open && (
        <div
          className={
            "absolute left-0 top-full z-50 mt-2 rounded-xl border border-t-[3px] border-t-saffron glass-popover p-5 text-popover-foreground shadow-banner " +
            (item.groups.length > 1
              ? "grid w-[min(44rem,90vw)] grid-cols-2 gap-6 lg:grid-cols-3"
              : "w-80")
          }
        >
          {item.groups.map((g) => (
            <div key={g.title}>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-saffron">
                {g.title}
              </p>
              <ul className="space-y-0.5">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground/80 hover:bg-secondary hover:text-primary"
                    >
                      <span>{l.label}</span>
                      <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100" />
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
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-xl" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col glass-popover shadow-banner">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <span className="font-display text-base font-bold text-primary">PMIS Navigation</span>
          <button onClick={onClose} aria-label="Close menu" className="rounded-lg p-2 hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Main Links */}
        <div className="p-3 border-b space-y-1">
          <button
            onClick={() => {
              onSetView("explore");
              onClose();
            }}
            className="flex w-full items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary"
          >
            <Briefcase className="h-4 w-4" /> Explore 120 Internships
          </button>
          <button
            onClick={() => {
              onSetView("dashboard");
              onClose();
            }}
            className="flex w-full items-center gap-2 rounded-xl bg-saffron/15 px-3 py-2 text-xs font-bold text-saffron-foreground"
          >
            <LayoutDashboard className="h-4 w-4 text-orange-600" /> Student Dashboard
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {NAV.map((item, i) =>
            item.groups ? (
              <div key={item.label} className="border-b last:border-0">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                  aria-expanded={openIdx === i}
                  className="flex w-full items-center justify-between px-2 py-3 text-xs font-semibold"
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
                        <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-saffron">
                          {g.title}
                        </p>
                        {g.links.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-primary"
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
                className="block border-b px-2 py-2.5 text-xs font-semibold last:border-0"
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="border-t p-4">
          {user ? (
            <div className="space-y-2">
              <div className="rounded-xl bg-muted p-2.5 text-xs">
                <p className="font-bold text-foreground">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">{user.user_id}</p>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-destructive/30 text-destructive text-xs font-bold py-2 hover:bg-destructive/10"
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
              className="flex w-full items-center justify-center gap-2 sheen rounded-xl bg-saffron px-4 py-3 text-sm font-bold text-saffron-foreground"
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
    <header className="sticky top-0 z-40">
      <div className="border-b border-primary-foreground/40 bg-card/85 backdrop-blur-2xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
          <button
            onClick={() => onSetView("home")}
            className="flex min-w-0 items-center gap-3 sm:gap-5 text-left focus:outline-none"
          >
            <img src={mca} alt="Ministry of Corporate Affairs" className="h-10 shrink-0 sm:h-12" />
            <span className="h-8 w-px shrink-0 bg-border" />
            <img src={pmLogo} alt="PM Internship" className="h-9 shrink-0 sm:h-11" />
          </button>

          <div className="flex items-center gap-3">
            {/* View Switcher buttons */}
            <div className="hidden md:flex items-center gap-2 mr-1">
              <button
                onClick={() => onSetView("explore")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  activeView === "explore"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" /> Explore 120 Internships
              </button>

              <button
                onClick={() => (user ? onSetView("dashboard") : onOpenAuth())}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  activeView === "dashboard"
                    ? "bg-saffron text-saffron-foreground shadow-xs"
                    : "bg-saffron/15 text-saffron-foreground border border-saffron/30 hover:bg-saffron/25"
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-orange-600" /> Student Dashboard
              </button>
            </div>

            {/* Auth Button */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onSetView("dashboard")}
                  className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition"
                  title="Open Dashboard"
                >
                  <UserRound className="h-3.5 w-3.5" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden items-center gap-2 sheen rounded-full bg-saffron px-5 py-2 text-xs font-bold text-saffron-foreground shadow-soft transition hover:brightness-105 sm:flex"
              >
                <UserRound className="h-3.5 w-3.5" /> Login / Register
              </button>
            )}

            <img src={viksit} alt="Viksit Bharat" className="hidden h-10 lg:block" />
            <button
              onClick={() => setMobile(true)}
              aria-label="Open menu"
              className="rounded-xl border bg-card p-2 text-primary lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Island Bar for Government Portal Guidelines */}
      <div className="pointer-events-none hidden px-4 pt-2.5 lg:block">
        <nav
          ref={navRef}
          aria-label="Main"
          className="island-nav pointer-events-auto mx-auto flex w-fit max-w-7xl items-center justify-center rounded-full px-3 text-primary-foreground shadow-sm"
        >
          <div className="flex flex-nowrap items-center justify-center gap-0.5 py-1">
            <button
              onClick={() => onSetView("home")}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12px] font-semibold transition-colors hover:bg-primary-foreground/10 hover:text-saffron ${
                activeView === "home" ? "bg-primary-foreground/15 text-saffron" : ""
              }`}
            >
              <Home className="h-3.5 w-3.5 text-saffron" /> Home
            </button>

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
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12px] font-semibold transition-colors hover:bg-primary-foreground/10 hover:text-saffron"
                >
                  {Icon && <Icon className="h-3.5 w-3.5 text-saffron" />}
                  {item.label}
                </a>
              );
            })}
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
