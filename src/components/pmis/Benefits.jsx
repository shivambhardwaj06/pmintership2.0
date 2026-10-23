import {
  Gift,
  Award,
  DollarSign,
  ShieldCheck,
  Building2,
  Users,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileCheck,
  HeartHandshake,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function Benefits({ onNavigateToExplore, onOpenAuth, user }) {
  const BENEFIT_PILLARS = [
    {
      icon: DollarSign,
      title: "₹66,000 Guaranteed Financial Package",
      highlight: "₹5,000 / Month + ₹6,000 One-Time Grant",
      description:
        "Every selected intern receives ₹5,000 per month for 12 months (₹4,500 DBT from Central Govt + ₹500 from host corporate CSR). Upon joining, an additional ₹6,000 grant is credited directly via DBT to cover travel and incidentals.",
      badge: "Direct Benefit Transfer",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300",
    },
    {
      icon: Building2,
      title: "Real Corporate Exposure at Top 500 Companies",
      highlight: "Industry Giants & Multinationals",
      description:
        "Gain 12 months of hands-on corporate experience at India's top 500 corporations, including Tata Group, Reliance Industries, L&T, Infosys, Mahindra, HDFC Bank, Maruti Suzuki, Sun Pharma, and NTPC.",
      badge: "Fortune 500 Benchmark",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300",
    },
    {
      icon: ShieldCheck,
      title: "Free Life & Accident Insurance Coverage",
      highlight: "₹4,00,000 Combined Protection",
      description:
        "The Government of India fully sponsors comprehensive insurance for each intern under PM Jeevan Jyoti Bima Yojana (₹2 Lakhs life cover) and PM Suraksha Bima Yojana (₹2 Lakhs accidental cover) with zero premium deducted from the candidate.",
      badge: "Govt Sponsored",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300",
    },
    {
      icon: Award,
      title: "Joint Government & Corporate Certificate",
      highlight: "Nationally Recognized Credential",
      description:
        "Receive an official Certificate of Completion issued jointly by the Ministry of Corporate Affairs (MCA) and the host corporate organization, providing massive resume leverage for future career opportunities.",
      badge: "Official MCA Credential",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
    },
    {
      icon: TrendingUp,
      title: "High Pre-Placement Full-Time Absorption Rate",
      highlight: "Path to Permanent Employment",
      description:
        "Top corporate partners use this 12-month tenure to groom candidates for permanent full-time entry-level engineering, finance, operational, and managerial positions upon completion.",
      badge: "Career Transition",
      badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300",
    },
    {
      icon: HeartHandshake,
      title: "Democratized Access for Non-Metro Youth",
      highlight: "Prioritizing Tier-2, 3 & Rural Talents",
      description:
        "Excludes IIT/IIM graduates to guarantee that non-metro, diploma, and state university graduates get unprecedented access to corporate boardroom training without needing connections or influence.",
      badge: "Merit & Inclusion",
      badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-4 py-1 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 shadow-2xs">
            <Gift className="h-4 w-4 text-emerald-500" />
            <span>Official Scheme Perks & Support</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Scheme Benefits & Perks
          </h1>
          <p className="mt-3 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
            Designed under the Prime Minister&apos;s employment and skilling package to empower 1 Crore youth over 5 years with direct corporate stipends, insurance, real industry training, and recognized certification.
          </p>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {BENEFIT_PILLARS.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm hover:border-orange-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black border ${b.badgeColor}`}>
                      {b.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-black text-slate-900 dark:text-white">
                    {b.title}
                  </h3>

                  <p className="text-xs font-black text-orange-600 dark:text-orange-400">
                    {b.highlight}
                  </p>

                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  100% Guaranteed by Central Scheme Guidelines
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table: Unorganized Internships vs PM Internship Scheme */}
        <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 mb-16 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Why the PM Internship Scheme Outperforms Traditional Internships
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              A transparent comparison between standard informal internships and the Government of India PMIS initiative.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-700 text-slate-400">
                  <th className="pb-3 font-bold text-slate-600 dark:text-slate-300">Feature Dimension</th>
                  <th className="pb-3 font-bold text-rose-600 dark:text-rose-400">Traditional Informal Internships</th>
                  <th className="pb-3 font-black text-emerald-600 dark:text-emerald-400">PM Internship Scheme 2.0</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">Monthly Stipend</td>
                  <td className="py-3 text-rose-600 dark:text-rose-400">Unpaid or irregular ₹0 - ₹3,000</td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">Guaranteed ₹5,000/mo via Direct DBT</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">Joining Incidentals Grant</td>
                  <td className="py-3 text-rose-600 dark:text-rose-400">None (Student pays out of pocket)</td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">₹6,000 One-time Relocation Grant</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">Host Companies</td>
                  <td className="py-3 text-rose-600 dark:text-rose-400">Unverified startups or agencies</td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">India&apos;s Top 500 Corporates (Tata, L&T, Infosys)</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">Insurance & Safety</td>
                  <td className="py-3 text-rose-600 dark:text-rose-400">Zero coverage</td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">₹4 Lakhs Govt Sponsored Life & Accident Cover</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">Official Certification</td>
                  <td className="py-3 text-rose-600 dark:text-rose-400">Company letterhead only</td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">Official Ministry of Corporate Affairs Certificate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-amber-600 p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-display text-2xl sm:text-3xl font-black">
              Start Your Corporate Career Journey Today
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 font-semibold max-w-xl">
              Browse paid corporate internships across 24 sectors or register your candidate account in under 2 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {onNavigateToExplore && (
              <button
                onClick={onNavigateToExplore}
                className="px-6 py-3 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <span>Explore Internships</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {!user && onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-6 py-3 rounded-2xl bg-slate-900/40 hover:bg-slate-900/60 border border-white/30 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
