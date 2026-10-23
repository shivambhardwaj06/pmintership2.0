import {
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Users,
  Sparkles,
  ArrowUp,
  FileText,
  BookOpen,
  ShieldCheck,
  Bot,
  Award,
  CheckCircle2,
  ChevronRight,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import MCA from "@/assets/MCA.svg";
import pmisLogo from "@/assets/pm_internship_logo_eng.svg";
import viksit from "@/assets/viksit.png";
import indianFlag from "@/assets/indian_flag.svg";
import mascot from "@/assets/chatbot-mascot.png";

const API = "https://pminternship.mca.gov.in/mca-api/files/get-file-by-path?path=";
const CDN = "https://pminternship.mca.gov.in/mca-api/files/cdn?path=partner-companies/";

const OFFICIAL_DOCS = [
  {
    label: "Candidate Operational Guidelines",
    href: API + "WEIFjtlmlj0z",
    badge: "PDF",
  },
  {
    label: "Top 500 Partner Companies List",
    href: CDN + "PMISPartnerCompanies.pdf",
    badge: "Official",
  },
  {
    label: "Candidate User Manual & SOP",
    href: API + "8q6yrzCyBShF",
    badge: "Step-by-Step",
  },
  {
    label: "Frequently Asked Questions (FAQs)",
    href: API + "qz3QVc6S2tvV",
  },
  {
    label: "Addendum to PMIS Guidelines",
    href: API + "y6jzi%2ByKwm",
  },
  {
    label: "Candidate Guidance Video Series",
    href: "https://youtu.be/d9Ed5M12vYs",
    badge: "Video",
  },
];

export default function Footer({ onSetView }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToView = (view, sectionId = null) => {
    if (onSetView) {
      onSetView(view);
    }
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          scrollToTop();
        }
      }, 100);
    } else {
      scrollToTop();
    }
  };

  const openDisha = () => {
    window.dispatchEvent(new CustomEvent("open-disha"));
  };

  return (
    <footer className="relative bg-slate-950 text-slate-100 border-t border-slate-800 overflow-hidden select-none">
      {/* Indian National Tricolor Ribbon */}
      <div
        className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 shadow-sm"
        aria-hidden="true"
      />

      {/* Subtle Background Glow */}
      <div
        className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Strip: Official Crests & Live Portal Telemetry */}
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 border-b border-slate-800/80">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Government Emblems */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
            <div className="flex items-center gap-3 bg-white rounded-2xl p-2 px-3 shadow-md border border-slate-700/60">
              <img
                src={MCA}
                alt="Ministry of Corporate Affairs, Government of India"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <div className="hidden sm:block border-l border-slate-300 pl-3">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-900 leading-tight">
                  Ministry of Corporate Affairs
                </p>
                <p className="text-[10px] font-bold text-slate-600">
                  Government of India
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white rounded-2xl p-2 px-3.5 shadow-md border border-slate-700/60">
              <img
                src={pmisLogo}
                alt="Prime Minister Internship Scheme"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-2">
              <img
                src={viksit}
                alt="Viksit Bharat 2047"
                className="h-8 w-auto object-contain"
              />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                  Viksit Bharat @ 2047
                </p>
                <p className="text-[11px] font-semibold text-slate-300">
                  Youth Empowerment Mission
                </p>
              </div>
            </div>
          </div>

          {/* Right Metrics Strip: Stipend Highlight + Live Visitor Counter */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* DBT Stipend Assurance */}
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-2.5 backdrop-blur-md">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Award className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                    Direct Benefit Transfer
                  </span>
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </div>
                <p className="text-xs font-bold text-white">
                  ₹5,000/mo + ₹6,000 Grant
                </p>
              </div>
            </div>

            {/* Live Visitor Counter */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 shadow-inner">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/30">
                <Users className="h-4.5 w-4.5 text-orange-400" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Portal Visitors
                  </p>
                </div>
                <p className="text-base font-extrabold text-white tracking-wide">
                  6,93,83,024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Grid */}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About the Mission & Disha AI CTA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <h3 className="font-display text-base font-bold text-white tracking-tight">
                About PM Internship Scheme
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              The <strong className="text-white">Prime Minister’s Internship Scheme (PMIS)</strong> is a
              flagship initiative launched by the <strong className="text-white">Ministry of Corporate Affairs</strong>,
              Government of India, to provide 1.25 crore youth with 12 months of high-impact corporate training
              in India’s top 500 corporations by 2029.
            </p>
            <div className="pt-2">
              <button
                onClick={openDisha}
                className="group w-full flex items-center justify-between gap-3 rounded-2xl border border-orange-500/40 bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-transparent p-3 text-left transition-all duration-200 hover:border-orange-400 hover:bg-orange-500/25 hover:shadow-lg active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0 overflow-hidden p-1">
                    <img
                      src={mascot}
                      alt="Disha Mascot"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-orange-400 uppercase tracking-wide">
                        Ask Disha AI Guide
                      </span>
                      <Sparkles className="h-3 w-3 text-orange-400" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-300">
                      Instant assistance for 120 roles & resumes
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-orange-400 transition-transform group-hover:translate-x-1 shrink-0" />
              </button>
            </div>
          </div>

          {/* Column 2: Quick Portal Navigation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <h3 className="font-display text-base font-bold text-white tracking-tight">
                Quick Navigation
              </h3>
            </div>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button
                  onClick={() => navigateToView("home")}
                  className="group flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  <span>Portal Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToView("explore")}
                  className="group flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  <span>Explore 120 Internships</span>
                  <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-extrabold text-orange-400 border border-orange-500/30">
                    24 Sectors
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToView("dashboard")}
                  className="group flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  <span>Student Dashboard</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30">
                    Real-time
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToView("dashboard")}
                  className="group flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  <span>Learn from Past Selection</span>
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-extrabold text-blue-400 border border-blue-500/30">
                    9 Branches
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToView("home", "top-featured-internships")}
                  className="group flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  <span>Top 6 Featured Openings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToView("dashboard")}
                  className="group flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  <span>Find the Gap (AI Skill Matcher)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Official Guidelines & Governance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <h3 className="font-display text-base font-bold text-white tracking-tight">
                Official Guidelines & SOPs
              </h3>
            </div>
            <ul className="space-y-2 text-sm font-medium">
              {OFFICIAL_DOCS.map((doc) => (
                <li key={doc.label}>
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-2 text-slate-300 hover:text-orange-400 transition-colors"
                  >
                    <span className="flex items-center gap-1.5 line-clamp-1">
                      <FileText className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {doc.label}
                      </span>
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {doc.badge && (
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-wide border border-slate-700">
                          {doc.badge}
                        </span>
                      )}
                      <ExternalLink className="h-3 w-3 text-slate-500 opacity-60 group-hover:opacity-100 group-hover:text-orange-400 transition-all" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Helplines & Nodal Support */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <h3 className="font-display text-base font-bold text-white tracking-tight">
                National Support & Helplines
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-3 items-start">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-orange-400" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Toll-Free National Helpline
                  </p>
                  <a
                    href="tel:1800116090"
                    className="font-bold text-white hover:text-orange-400 transition-colors text-base"
                  >
                    1800 11 6090
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Monday to Saturday: 9:00 AM – 6:00 PM IST
                  </p>
                </div>
              </li>

              <li className="flex gap-3 items-start">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-orange-400" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Candidate Grievances
                  </p>
                  <a
                    href="mailto:pminternship@mca.gov.in"
                    className="text-white hover:text-orange-400 transition-colors break-all"
                  >
                    pminternship@mca.gov.in
                  </a>
                </div>
              </li>

              <li className="flex gap-3 items-start">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-orange-400" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Industry & Nodal Support
                  </p>
                  <a
                    href="mailto:pmisindustrysupport@mca.gov.in"
                    className="text-white hover:text-orange-400 transition-colors break-all"
                  >
                    pmisindustrysupport@mca.gov.in
                  </a>
                </div>
              </li>

              <li className="flex gap-3 items-start">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-orange-400" />
                <div className="text-xs text-slate-400 leading-snug">
                  <span className="font-bold text-slate-200">Central Secretariat</span>
                  <br />
                  3rd Floor, Kartavya Bhawan 1, Kartavya Path, Central Secretariat, New Delhi - 110001
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Government Disclaimer */}
      <div className="border-t border-slate-800 bg-slate-950/90 py-5">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <img src={indianFlag} alt="India" className="h-3.5 w-auto" />
              <p className="font-semibold text-slate-300">
                © 2026 Prime Minister’s Internship Scheme (PMIS).
              </p>
            </div>
            <span className="hidden sm:inline text-slate-600">|</span>
            <p>
              Owned & Operated by{" "}
              <span className="font-bold text-white">Ministry of Corporate Affairs</span>, Government of India.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-orange-500/50 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5 text-orange-400 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}