import { MapPin, Mail, Phone, Play, ExternalLink, Users } from "lucide-react";
import MCA from "@/assets/MCA.svg";
import pmisLogo from "@/assets/pm_internship_logo_eng.svg";

const QUICK_LINKS = [
  { label: "Benefits", href: "#benefits" },
  { label: "FAQs", href: "#faqs" },
  { label: "Gallery", href: "#gallery" },
  { label: "Notifications", href: "#notifications" },
  { label: "Raise a ticket", href: "#support" },
  { label: "Privacy Policy", href: "#privacy" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Top strip: logos + visitor counter */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 border-b border-primary-foreground/10 px-4 py-6 sm:px-6">
        <div className="flex items-center gap-4">
          <img src={MCA} alt="Ministry of Corporate Affairs" className="h-14 w-auto rounded bg-primary-foreground p-1.5" />
          <img src={pmisLogo} alt="PM Internship Scheme" className="h-12 w-auto rounded bg-primary-foreground p-1.5" />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 px-5 py-3">
          <Users className="h-5 w-5 text-saffron" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-foreground/70">Total Visitors</p>
            <p className="text-lg font-bold text-saffron">6,93,83,024</p>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-saffron">About PM Internship Scheme</h3>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
            The Prime Minister's Internship Scheme (PMIS) facilitates employment, skilling and other opportunities
            for India's youth. PMIS offers paid internship opportunities in leading companies across India to youth
            currently not in full-time employment, enhancing the employability of young Indians.
          </p>
        </div>

        <nav aria-label="Footer quick links">
          <h3 className="font-display text-lg font-semibold text-saffron">Get to Know</h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-saffron"
                >
                  <span className="h-1 w-1 rounded-full bg-saffron/60 transition-all group-hover:w-3" aria-hidden="true" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-lg font-semibold text-saffron">Download Mobile App</h3>
          <p className="mt-4 text-sm text-primary-foreground/80">
            Get the PM Internship app to discover and apply for opportunities on the go.
          </p>
          <a
            href="#mobile-app"
            className="mt-4 inline-flex items-center gap-3 rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-2.5 transition-colors hover:border-saffron/50 hover:bg-primary-foreground/10"
          >
            <Play className="h-8 w-8 text-saffron" aria-hidden="true" />
            <span className="text-left">
              <span className="block text-[10px] uppercase tracking-wide text-primary-foreground/70">Get it on</span>
              <span className="block text-base font-semibold">Google Play</span>
            </span>
            <ExternalLink className="ml-1 h-4 w-4 text-primary-foreground/50" aria-hidden="true" />
          </a>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-saffron">Contact Us</h3>
          <ul className="mt-4 space-y-3.5 text-sm text-primary-foreground/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden="true" />
              <span>3rd Floor, Kartavya Bhawan 1, Kartavya Path, Central Secretariat, New Delhi-110001</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden="true" />
              <a href="mailto:pminternship@mca.gov.in" className="transition-colors hover:text-saffron">pminternship@mca.gov.in</a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden="true" />
              <a href="mailto:pmisindustrysupport@mca.gov.in" className="transition-colors hover:text-saffron">pmisindustrysupport@mca.gov.in</a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden="true" />
              <a href="tel:1800116090" className="transition-colors hover:text-saffron">1800 11 6090</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-primary-foreground/60 sm:px-6">
          <p>©2026 PM-INTERNSHIP. All Rights Reserved.</p>
          <p>This site is owned by <span className="font-semibold text-primary-foreground/80">Ministry of Corporate Affairs</span>.</p>
        </div>
      </div>
    </footer>
  );
}
