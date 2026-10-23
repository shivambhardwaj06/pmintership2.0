import { useState, useMemo } from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  DollarSign,
  Building2,
  UserCheck,
  CreditCard,
  PhoneCall,
  ArrowRight,
} from "lucide-react";

const FAQ_DATA = [
  {
    id: "eligibility-1",
    category: "Eligibility",
    question: "What are the core eligibility criteria for the PM Internship Scheme?",
    answer:
      "Candidates must be Indian nationals aged between 21 and 24 years (as on the application cutoff date). They must have completed Class 10, Class 12, ITI, Polytechnic Diploma, or an undergraduate degree (BA, B.Sc, B.Com, B.Tech, BCA, BBA, B.Pharma, etc.). Candidates must not be engaged in full-time employment or full-time regular education at the time of joining.",
  },
  {
    id: "eligibility-2",
    category: "Eligibility",
    question: "Who is excluded or NOT eligible for the PM Internship Scheme?",
    answer:
      "The following categories are strictly excluded: \n1. Graduates from premier institutions: IITs, IIMs, IISc, IISERs, NIDs, and IIITs.\n2. Holders of professional qualifications like CA, CMA, CS, MBBS, BDS, MBA, or any master's degree.\n3. Candidates whose family has an annual income exceeding ₹8 Lakhs.\n4. Candidates from families where any member is a permanent government employee (Central, State, or PSU) or pays income tax.",
  },
  {
    id: "stipend-1",
    category: "Stipend & Grants",
    question: "How much stipend will an intern receive every month?",
    answer:
      "Each intern receives a monthly financial stipend of ₹5,000 for the entire 12-month duration.\n• ₹4,500 is directly disbursed by the Government of India via Direct Benefit Transfer (DBT) into the candidate's Aadhaar-linked bank account.\n• ₹500 is contributed directly by the host partner company from its corporate CSR funds.",
  },
  {
    id: "stipend-2",
    category: "Stipend & Grants",
    question: "Is there any one-time joining grant or incidentals allowance?",
    answer:
      "Yes! Upon successfully reporting to the partner company and commencing the internship, the Government of India provides a one-time grant of ₹6,000 directly via DBT to defray incidentals, travel, and relocation expenses.",
  },
  {
    id: "stipend-3",
    category: "Stipend & Grants",
    question: "Why is Aadhaar Bank Seeding mandatory for receiving stipend?",
    answer:
      "Under Government of India Direct Benefit Transfer (DBT) guidelines, the government's ₹4,500 monthly stipend and ₹6,000 one-time incidentals can only be credited to a bank account seeded with Aadhaar via NPCI. You can check your Aadhaar bank seeding status via your bank or the official UIDAI portal.",
  },
  {
    id: "application-1",
    category: "Application & Selection",
    question: "How many internship opportunities can a candidate apply for?",
    answer:
      "A registered candidate can submit up to 5 internship applications across different partner companies, states, or sectors on the portal. This maximizes your chances of securing a placement that matches your preferred field.",
  },
  {
    id: "application-2",
    category: "Application & Selection",
    question: "How are candidates shortlisted and selected by companies?",
    answer:
      "Shortlisting is performed transparently using portal criteria that balance academic merit, reservation quotas, and regional representation. Priority is given to youth from aspirational districts and districts with lower corporate density. Shortlisted candidates are invited by partner companies for verification and onboarding.",
  },
  {
    id: "companies-1",
    category: "Companies & Work Mode",
    question: "Which companies participate in the PM Internship Scheme?",
    answer:
      "India's Top 500 companies based on their average CSR spend over the last three years participate as host organizations. These include leaders like Tata Group (TCS, Tata Motors, Tata Steel), Reliance Industries, Infosys, Larsen & Toubro, HDFC Bank, State Bank of India, Mahindra, Maruti Suzuki, Sun Pharma, and NTPC.",
  },
  {
    id: "companies-2",
    category: "Companies & Work Mode",
    question: "What is the duration and mode of the internship?",
    answer:
      "The internship duration is 12 months (one year). The working mode depends on the role: predominantly On-site at corporate offices, factories, and technology centers, with select Hybrid roles available in IT, financial analysis, and digital marketing.",
  },
  {
    id: "insurance-1",
    category: "Insurance & Safety",
    question: "Does the government provide insurance coverage during the internship?",
    answer:
      "Yes! Every enrolled intern is provided insurance coverage under the Pradhan Mantri Jeevan Jyoti Bima Yojana (life insurance of ₹2 Lakhs) and Pradhan Mantri Suraksha Bima Yojana (accident insurance of ₹2 Lakhs). The premium is fully sponsored and paid by the Government of India.",
  },
  {
    id: "certificate-1",
    category: "Certification & Career",
    question: "Will interns receive a formal experience certificate after completion?",
    answer:
      "Yes. Upon completing the 12-month program, interns receive an official Government of India recognized Certificate of Completion issued jointly by the Ministry of Corporate Affairs (MCA) and the host corporate organization. Host companies also frequently offer full-time corporate employment to high-performing interns.",
  },
];

const CATEGORIES = [
  "All",
  "Eligibility",
  "Stipend & Grants",
  "Application & Selection",
  "Companies & Work Mode",
  "Insurance & Safety",
  "Certification & Career",
];

export default function FAQs({ onNavigateToExplore, onNavigateToSupport }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState("eligibility-1");

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCat = activeCategory === "All" || item.category === activeCategory;
      const matchQuery =
        !searchQuery.trim() ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 border border-orange-500/30 px-4 py-1 text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3 shadow-2xs">
            <HelpCircle className="h-4 w-4 text-orange-500" />
            <span>Official Portal Knowledge Base</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="mt-3 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300">
            Everything you need to know about PM Internship Scheme eligibility, monthly ₹5,000 stipend, ₹6,000 joining grant, application limits, and top corporate partner selections.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs by question or keyword (e.g. stipend, age limit, IIT, DBT)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-12 pr-4 py-3.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-slate-500">
              <p className="font-bold text-base text-slate-700 dark:text-slate-300">No matching questions found.</p>
              <p className="text-xs mt-1">Try searching with a different keyword or browse all categories.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border-2 transition-all duration-200 bg-white dark:bg-slate-900 overflow-hidden ${
                    isOpen
                      ? "border-orange-500/60 shadow-md ring-1 ring-orange-500/30"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 font-black text-xs">
                        Q
                      </span>
                      <span className="font-display text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                        {faq.question}
                      </span>
                    </div>
                    <span className="text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="h-5 w-5 text-orange-500" /> : <ChevronDown className="h-5 w-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="pl-10 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>
                      <div className="pl-10 mt-3 pt-2 flex items-center gap-2">
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5">
                          Category: {faq.category}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Official MCA PMIS Guideline
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Need More Assistance Banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border-2 border-orange-500/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1 text-xs font-black text-orange-600 dark:text-orange-400 uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Need Direct Clarification?
            </div>
            <h3 className="font-display text-xl font-black text-slate-900 dark:text-white">
              Ask Disha AI Guide or Reach Our Official Helpdesk
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Get immediate answers to specific scheme rules, state quotas, or connect with national helpline officers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => window.dispatchEvent(new Event("open-disha"))}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-md hover:brightness-105 transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask Disha AI</span>
            </button>
            {onNavigateToSupport && (
              <button
                onClick={onNavigateToSupport}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
              >
                <PhoneCall className="h-3.5 w-3.5 text-orange-500" />
                <span>Support Page</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
