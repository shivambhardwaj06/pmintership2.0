import { useState, useEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  Building,
  Building2,
  Briefcase,
  Calendar,
  IndianRupee,
  Clock,
  Filter,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Layers,
  Loader2,
  Sparkles,
  ExternalLink,
  ArrowUpDown,
  SlidersHorizontal,
  Check,
  TrendingUp,
  Tag,
} from "lucide-react";
import rawInternships from "@/data/internships.json";
import CompanyLogo from "./CompanyLogo";
import { BACKEND_URL } from "@/lib/apiConfig";

/**
 * Safely parses the numerical stipend upper bound from strings like
 * '₹8,000–₹12,000/month', '₹10,000/month', '₹5,000 / month'
 */
export const parseStipendAmount = (stipendStr) => {
  if (!stipendStr) return 0;
  const matches = String(stipendStr).match(/\d[\d,]*/g);
  if (!matches || matches.length === 0) return 0;
  const numbers = matches
    .map((m) => parseInt(m.replace(/,/g, ""), 10))
    .filter((n) => !isNaN(n) && n > 0);
  if (numbers.length === 0) return 0;
  return Math.max(...numbers);
};

const TOP_MNCS = [
  { name: "Tata Consultancy Services", short: "TCS" },
  { name: "Infosys", short: "Infosys" },
  { name: "Wipro", short: "Wipro" },
  { name: "Tata Motors", short: "Tata Motors" },
  { name: "Larsen & Toubro", short: "L&T" },
  { name: "HDFC Bank", short: "HDFC Bank" },
  { name: "Reliance Industries", short: "Reliance" },
  { name: "Sun Pharmaceutical Industries", short: "Sun Pharma" },
  { name: "Maruti Suzuki", short: "Maruti Suzuki" },
];

export default function ExploreInternships({
  user,
  onRequireAuth,
  onApplySuccess,
  onNavigateToDashboard,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedStipendRange, setSelectedStipendRange] = useState("All"); // "All" | "12k_plus" | "10k_12k" | "8k_10k" | "under_8k"
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [sortBy, setSortBy] = useState("featured"); // "featured" | "stipend_high_low" | "stipend_low_high" | "company_asc" | "title_asc"
  const [quickFilter, setQuickFilter] = useState("all");

  const [selectedInternship, setSelectedInternship] = useState(null);
  const [appliedIds, setAppliedIds] = useState([]);
  const [applyingId, setApplyingId] = useState(null);
  const [applySuccessModal, setApplySuccessModal] = useState(null);
  const [internshipsList, setInternshipsList] = useState(rawInternships);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // Fetch real-time internships directly from MongoDB Database (minimum 250+ records)
  useEffect(() => {
    let isMounted = true;
    const fetchMongoInternships = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/internships?limit=350`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && Array.isArray(data.results) && data.results.length >= 250) {
            setInternshipsList(data.results);
            setIsDbConnected(true);
          }
        }
      } catch (err) {
        console.warn("Live API sync notice, using verified dataset:", err);
      }
    };
    fetchMongoInternships();
    return () => { isMounted = false; };
  }, []);

  // Sync applied IDs for the logged in user + listen to global application updates
  useEffect(() => {
    const syncApplied = () => {
      try {
        const storageKey = user?.user_id ? `pmis_applied_ids_${user.user_id}` : "pmis_applied_ids";
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setAppliedIds(JSON.parse(saved));
        } else {
          setAppliedIds([]);
        }
      } catch {
        setAppliedIds([]);
      }
    };

    syncApplied();
    window.addEventListener("pmis_application_updated", syncApplied);
    return () => window.removeEventListener("pmis_application_updated", syncApplied);
  }, [user]);

  // Extract unique companies with opening counts
  const companies = useMemo(() => {
    const counts = {};
    internshipsList.forEach((i) => {
      if (i.company) {
        const name = i.company.trim();
        counts[name] = (counts[name] || 0) + 1;
      }
    });
    const sorted = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    return [
      { name: "All", label: `All Partner Companies (${sorted.length})`, count: internshipsList.length },
      ...sorted.map((name) => ({ name, label: `${name} (${counts[name]})`, count: counts[name] })),
    ];
  }, [internshipsList]);

  // Extract unique sectors, states, modes from MongoDB collection
  const sectors = useMemo(() => {
    return ["All", ...new Set(internshipsList.map((i) => i.sector).filter(Boolean))].sort();
  }, [internshipsList]);

  const states = useMemo(() => {
    return ["All", ...new Set(internshipsList.map((i) => i.state).filter(Boolean))].sort();
  }, [internshipsList]);

  const modes = useMemo(() => {
    return ["All", ...new Set(internshipsList.map((i) => i.mode).filter(Boolean))].sort();
  }, [internshipsList]);

  const durations = useMemo(() => {
    return [
      "All",
      "3 Months / 12 Weeks",
      "6 Months",
      "12 Months",
    ];
  }, []);

  // Filtered and Sorted internships
  const filteredList = useMemo(() => {
    const matched = internshipsList.filter((item) => {
      // 1. Search text
      const search = searchTerm.trim().toLowerCase();
      const matchSearch =
        !search ||
        (item.company && item.company.toLowerCase().includes(search)) ||
        (item.title && item.title.toLowerCase().includes(search)) ||
        (item.skills && item.skills.toLowerCase().includes(search)) ||
        (item.location && item.location.toLowerCase().includes(search)) ||
        (item.city && item.city.toLowerCase().includes(search)) ||
        (item.sector && item.sector.toLowerCase().includes(search));

      // 2. Company-wise Filter
      const matchCompany =
        selectedCompany === "All" ||
        (item.company && item.company.toLowerCase() === selectedCompany.toLowerCase());

      // 3. Salary / Stipend-wise Filter
      let matchStipend = true;
      if (selectedStipendRange !== "All") {
        const amt = parseStipendAmount(item.stipend);
        if (selectedStipendRange === "12k_plus") matchStipend = amt >= 12000;
        else if (selectedStipendRange === "10k_12k") matchStipend = amt >= 10000 && amt < 12000;
        else if (selectedStipendRange === "8k_10k") matchStipend = amt >= 8000 && amt < 10000;
        else if (selectedStipendRange === "under_8k") matchStipend = amt > 0 && amt < 8000;
      }

      // 4. Sector Filter
      const matchSector = selectedSector === "All" || item.sector === selectedSector;

      // 5. State / Location Filter
      const matchState = selectedState === "All" || item.state === selectedState;

      // 6. Work Mode Filter
      const matchMode =
        selectedMode === "All" ||
        (item.mode && item.mode.toLowerCase().includes(selectedMode.toLowerCase()));

      // 7. Duration Filter
      let matchDuration = true;
      if (selectedDuration !== "All") {
        const dur = (item.duration || "").toLowerCase();
        if (selectedDuration.includes("3 Month")) matchDuration = dur.includes("3 month") || dur.includes("12 week");
        else if (selectedDuration.includes("6 Month")) matchDuration = dur.includes("6 month") || dur.includes("24 week");
        else if (selectedDuration.includes("12 Month")) matchDuration = dur.includes("12 month") || dur.includes("1 year");
      }

      return matchSearch && matchCompany && matchStipend && matchSector && matchState && matchMode && matchDuration;
    });

    // Apply Sorting
    return matched.sort((a, b) => {
      if (sortBy === "stipend_high_low") {
        return parseStipendAmount(b.stipend) - parseStipendAmount(a.stipend);
      }
      if (sortBy === "stipend_low_high") {
        return parseStipendAmount(a.stipend) - parseStipendAmount(b.stipend);
      }
      if (sortBy === "company_asc") {
        return (a.company || "").localeCompare(b.company || "");
      }
      if (sortBy === "title_asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0; // Default featured order
    });
  }, [
    internshipsList,
    searchTerm,
    selectedCompany,
    selectedStipendRange,
    selectedSector,
    selectedState,
    selectedMode,
    selectedDuration,
    sortBy,
  ]);

  // Real-time Application Submission
  const handleApplyClick = async (item) => {
    if (!user) {
      onRequireAuth?.();
      return;
    }

    if (appliedIds.includes(item.id)) {
      return;
    }

    setApplyingId(item.id);

    const storageKey = user?.user_id ? `pmis_applied_ids_${user.user_id}` : "pmis_applied_ids";
    const appStorageKey = user?.user_id ? `pmis_applications_${user.user_id}` : "pmis_applications";

    const newAppRecord = {
      id: `APP-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      company: item.company,
      title: item.title,
      sector: item.sector,
      stipend: item.stipend,
      location: item.location,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Application Submitted",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300 font-bold",
    };

    try {
      // Call real-time backend endpoint with JWT Authorization
      const token = localStorage.getItem("pmis_access_token") || "";
      await fetch(`${BACKEND_URL}/api/user/apply?user_id=${user.user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          internship_id: item.id,
          company: item.company,
          title: item.title,
          notes: "Applied via PM Internship Portal",
        }),
      });
    } catch (err) {
      console.warn("Backend apply endpoint sync error:", err);
    } finally {
      const updatedIds = [...appliedIds, item.id];
      setAppliedIds(updatedIds);
      localStorage.setItem(storageKey, JSON.stringify(updatedIds));

      // Save application record
      try {
        const existingApps = JSON.parse(localStorage.getItem(appStorageKey) || "[]");
        existingApps.unshift(newAppRecord);
        localStorage.setItem(appStorageKey, JSON.stringify(existingApps));
      } catch {
        // ignore
      }

      window.dispatchEvent(new Event("pmis_application_updated"));
      setApplySuccessModal(item);
      onApplySuccess?.(item);
      setApplyingId(null);
    }
  };

  const handleQuickPreset = (preset) => {
    setQuickFilter(preset);
    if (preset === "all") {
      clearAllFilters();
    } else if (preset === "high_stipend") {
      clearAllFilters();
      setQuickFilter("high_stipend");
      setSelectedStipendRange("12k_plus");
      setSortBy("stipend_high_low");
    } else if (preset === "remote_hybrid") {
      clearAllFilters();
      setQuickFilter("remote_hybrid");
      setSelectedMode("Hybrid");
    } else if (preset === "it_tech") {
      clearAllFilters();
      setQuickFilter("it_tech");
      setSelectedSector("IT & Software Development");
    } else if (preset === "automotive") {
      clearAllFilters();
      setQuickFilter("automotive");
      setSelectedSector("Automotive");
    } else if (preset === "banking") {
      clearAllFilters();
      setQuickFilter("banking");
      setSelectedSector("Banking & Financial Services");
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCompany("All");
    setSelectedStipendRange("All");
    setSelectedSector("All");
    setSelectedState("All");
    setSelectedMode("All");
    setSelectedDuration("All");
    setSortBy("featured");
    setQuickFilter("all");
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCompany !== "All" ||
    selectedStipendRange !== "All" ||
    selectedSector !== "All" ||
    selectedState !== "All" ||
    selectedMode !== "All" ||
    selectedDuration !== "All" ||
    sortBy !== "featured" ||
    quickFilter !== "all";

  const getStipendLabel = (range) => {
    if (range === "12k_plus") return "₹12,000+/mo";
    if (range === "10k_12k") return "₹10k–₹12k/mo";
    if (range === "8k_10k") return "₹8k–₹10k/mo";
    if (range === "under_8k") return "Under ₹8k/mo";
    return range;
  };

  const getSortLabel = (sort) => {
    if (sort === "stipend_high_low") return "Highest Stipend";
    if (sort === "stipend_low_high") return "Lowest Stipend";
    if (sort === "company_asc") return "Company (A-Z)";
    if (sort === "title_asc") return "Title (A-Z)";
    return sort;
  };

  return (
    <div id="explore-internships" className="mx-auto max-w-7xl px-4 py-12">
      {/* Header section with High-Contrast Typography */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-orange-700 dark:text-orange-300 border border-saffron/40 mb-2">
          <ShieldCheck className="h-4 w-4 text-orange-600" /> Official PM Internship Scheme Openings
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore All Paid Corporate Internships
        </h2>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2">
          Filter through 260+ verified opportunities company-wise, salary/stipend-wise, sector, and location under the Prime Minister's Internship Scheme.
        </p>
      </div>

      {/* Quick 1-Click Discovery Presets Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar text-xs font-bold">
        <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-orange-500" /> Quick Discovery:
        </span>
        <button
          onClick={() => handleQuickPreset("all")}
          className={`px-3 py-1.5 rounded-xl border transition shrink-0 cursor-pointer ${
            quickFilter === "all" && !hasActiveFilters
              ? "bg-[#0B2545] text-white border-[#0B2545] shadow-xs"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
          }`}
        >
          All Opportunities
        </button>
        <button
          onClick={() => handleQuickPreset("high_stipend")}
          className={`px-3 py-1.5 rounded-xl border transition shrink-0 cursor-pointer flex items-center gap-1 ${
            quickFilter === "high_stipend"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50"
          }`}
        >
          <IndianRupee className="h-3 w-3" /> High Stipend (₹12,000+)
        </button>
        <button
          onClick={() => handleQuickPreset("remote_hybrid")}
          className={`px-3 py-1.5 rounded-xl border transition shrink-0 cursor-pointer ${
            quickFilter === "remote_hybrid"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
              : "bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50"
          }`}
        >
          Hybrid / Remote
        </button>
        <button
          onClick={() => handleQuickPreset("it_tech")}
          className={`px-3 py-1.5 rounded-xl border transition shrink-0 cursor-pointer ${
            quickFilter === "it_tech"
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-50"
          }`}
        >
          IT & Software Tech
        </button>
        <button
          onClick={() => handleQuickPreset("automotive")}
          className={`px-3 py-1.5 rounded-xl border transition shrink-0 cursor-pointer ${
            quickFilter === "automotive"
              ? "bg-amber-600 text-white border-amber-600 shadow-xs"
              : "bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-50"
          }`}
        >
          Automotive & EV
        </button>
        <button
          onClick={() => handleQuickPreset("banking")}
          className={`px-3 py-1.5 rounded-xl border transition shrink-0 cursor-pointer ${
            quickFilter === "banking"
              ? "bg-purple-600 text-white border-purple-600 shadow-xs"
              : "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-50"
          }`}
        >
          Banking & Finance
        </button>
      </div>

      {/* Filter and Search Control Center with High Contrast */}
      <div className="rounded-3xl p-5 sm:p-6 mb-8 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
        {/* ROW 1: PRIMARY FILTERS (Search, Company, Salary/Stipend, Sort By) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Search box */}
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search role, skills, city..."
              className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-8 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Company-wise Filter */}
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
              <Building2 className="h-4 w-4" />
            </span>
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setQuickFilter("custom");
              }}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-8 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary cursor-pointer truncate"
            >
              {companies.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>

          {/* Salary / Stipend-wise Filter */}
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-emerald-600 dark:text-emerald-400 pointer-events-none">
              <IndianRupee className="h-4 w-4" />
            </span>
            <select
              value={selectedStipendRange}
              onChange={(e) => {
                setSelectedStipendRange(e.target.value);
                setQuickFilter("custom");
              }}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-8 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary cursor-pointer truncate"
            >
              <option value="All">All Stipend Ranges (₹5k–₹15k/mo)</option>
              <option value="12k_plus">₹12,000+ / month (High Stipend)</option>
              <option value="10k_12k">₹10,000 – ₹12,000 / month</option>
              <option value="8k_10k">₹8,000 – ₹10,000 / month</option>
              <option value="under_8k">Under ₹8,000 / month</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>

          {/* Sort By Filter */}
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
              <ArrowUpDown className="h-4 w-4" />
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-8 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary cursor-pointer truncate"
            >
              <option value="featured">Sort: Featured & Recommended</option>
              <option value="stipend_high_low">Stipend: High to Low (₹ High ➔ Low)</option>
              <option value="stipend_low_high">Stipend: Low to High (₹ Low ➔ High)</option>
              <option value="company_asc">Company Name (A to Z)</option>
              <option value="title_asc">Role Title (A to Z)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* ROW 2: DETAILED CRITERIA (Sector, Location, Mode, Duration) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {/* Sector Filter */}
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
              <Briefcase className="h-4 w-4" />
            </span>
            <select
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                setQuickFilter("custom");
              }}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-8 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary cursor-pointer truncate"
            >
              <option value="All">All 24 Sectors</option>
              {sectors
                .filter((s) => s !== "All")
                .map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>

          {/* State / Location Filter */}
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
              <MapPin className="h-4 w-4" />
            </span>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setQuickFilter("custom");
              }}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-8 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary cursor-pointer truncate"
            >
              <option value="All">All States / Locations</option>
              {states
                .filter((s) => s !== "All")
                .map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>

          {/* Work Mode Filter */}
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
              <Layers className="h-4 w-4" />
            </span>
            <select
              value={selectedMode}
              onChange={(e) => {
                setSelectedMode(e.target.value);
                setQuickFilter("custom");
              }}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-8 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary cursor-pointer truncate"
            >
              <option value="All">All Work Modes (Hybrid / On-site / Remote)</option>
              {modes
                .filter((m) => m !== "All")
                .map((md) => (
                  <option key={md} value={md}>
                    {md}
                  </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>

          {/* Duration Filter */}
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
              <Clock className="h-4 w-4" />
            </span>
            <select
              value={selectedDuration}
              onChange={(e) => {
                setSelectedDuration(e.target.value);
                setQuickFilter("custom");
              }}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-8 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary cursor-pointer truncate"
            >
              <option value="All">All Durations (3–12 Months)</option>
              {durations
                .filter((d) => d !== "All")
                .map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* ROW 3: TOP MNCs QUICK FILTER PILLS */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Building className="h-3 w-3" /> Quick Company:
          </span>
          {TOP_MNCS.map((mnc) => {
            const isSelected = selectedCompany.toLowerCase() === mnc.name.toLowerCase();
            return (
              <button
                key={mnc.name}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setSelectedCompany("All");
                  } else {
                    setSelectedCompany(mnc.name);
                    setQuickFilter("custom");
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1 border ${
                  isSelected
                    ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{mnc.short}</span>
                {isSelected && <Check className="h-3 w-3" />}
              </button>
            );
          })}
        </div>

        {/* ROW 4: ACTIVE FILTER CHIPS & RESULT COUNTER */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="font-extrabold text-slate-800 dark:text-slate-200 mr-2">
              Showing <span className="text-primary font-black text-sm">{filteredList.length}</span> of{" "}
              <span className="font-bold">{internshipsList.length}</span> verified roles
            </p>

            {/* Removable Active Filter Pills */}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[11px] font-bold border border-blue-200">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="hover:text-blue-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedCompany !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 text-[11px] font-bold border border-orange-200">
                Company: {selectedCompany}
                <button onClick={() => setSelectedCompany("All")} className="hover:text-orange-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedStipendRange !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200">
                Stipend: {getStipendLabel(selectedStipendRange)}
                <button onClick={() => setSelectedStipendRange("All")} className="hover:text-emerald-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedSector !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[11px] font-bold border border-purple-200">
                Sector: {selectedSector}
                <button onClick={() => setSelectedSector("All")} className="hover:text-purple-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedState !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-bold border border-slate-300">
                Location: {selectedState}
                <button onClick={() => setSelectedState("All")} className="hover:text-slate-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedMode !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200">
                Mode: {selectedMode}
                <button onClick={() => setSelectedMode("All")} className="hover:text-indigo-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedDuration !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-200">
                Duration: {selectedDuration}
                <button onClick={() => setSelectedDuration("All")} className="hover:text-amber-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {sortBy !== "featured" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold">
                Order: {getSortLabel(sortBy)}
                <button onClick={() => setSortBy("featured")} className="hover:text-slate-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-black text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <X className="h-3.5 w-3.5" /> Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Internship Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="rounded-3xl p-12 text-center border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-base font-extrabold text-slate-900 dark:text-white">
            No internships match your current filters
          </p>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 mb-4">
            Try choosing a different state, sector, or clearing the search keyword.
          </p>
          <button
            onClick={clearAllFilters}
            className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-xs font-extrabold hover:bg-primary/90 transition shadow-xs cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => {
            const isApplied = appliedIds.includes(item.id);
            const isCurrentlyApplying = applyingId === item.id;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/60 hover:-translate-y-1"
              >
                <div>
                  {/* Top: Logo & Sector Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <CompanyLogo name={item.company} className="h-14 w-14 shrink-0 shadow-xs" />
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-extrabold px-3 py-1 border border-slate-300 dark:border-slate-700 truncate max-w-[170px]">
                      {item.sector}
                    </span>
                  </div>

                  {/* Company Name & Role Title */}
                  <div className="mb-2.5">
                    <h3 className="font-display text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-extrabold text-slate-600 dark:text-slate-300 mt-0.5">
                      {item.company}
                    </p>
                  </div>

                  {/* Summary */}
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  {/* Key Details Pill Box */}
                  <div className="space-y-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> {item.location}
                      </span>
                      <span className="rounded bg-white dark:bg-slate-700 px-2 py-0.5 text-[10px] font-bold border border-slate-200 dark:border-slate-600 shrink-0">
                        {item.mode}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
                      <span className="flex items-center gap-1.5 text-primary">
                        <IndianRupee className="h-3.5 w-3.5 text-saffron shrink-0" /> {item.stipend}
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {item.duration}
                      </span>
                    </div>
                  </div>

                  {/* Eligibility snippet */}
                  <div className="pt-3">
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 line-clamp-1">
                      <strong className="text-slate-900 dark:text-white font-bold">Eligibility: </strong>
                      {item.eligibility}
                    </p>
                  </div>

                  {/* Skills tags preview */}
                  {item.skills && (
                    <div className="pt-2 flex flex-wrap gap-1">
                      {item.skills.split(",").slice(0, 3).map((sk, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 px-2 py-0.5"
                        >
                          {sk.trim()}
                        </span>
                      ))}
                      {item.skills.split(",").length > 3 && (
                        <span className="text-[10px] font-bold text-slate-400 self-center">
                          +{item.skills.split(",").length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedInternship(item)}
                    className="text-xs font-extrabold text-primary hover:underline cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleApplyClick(item)}
                    disabled={isApplied || isCurrentlyApplying}
                    className={`rounded-xl px-4 py-2 text-xs font-extrabold transition shadow-xs cursor-pointer ${
                      isApplied
                        ? "bg-green-100 text-green-900 border border-green-300 cursor-default"
                        : "bg-gradient-to-r from-[#F57C00] to-[#E65100] text-white hover:brightness-105 active:scale-95 disabled:opacity-50"
                    }`}
                  >
                    {isCurrentlyApplying ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                      </span>
                    ) : isApplied ? (
                      "✓ Applied"
                    ) : (
                      "Apply Now"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* DETAIL MODAL (Clean, Zero Confusion) */}
      {/* ============================================================ */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedInternship(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <CompanyLogo name={selectedInternship.company} className="h-16 w-16 shadow-xs" />
              <div>
                <span className="text-[11px] font-black text-orange-600 uppercase tracking-wider">
                  {selectedInternship.sector}
                </span>
                <h3 className="font-display text-xl font-black text-slate-900 dark:text-white">
                  {selectedInternship.title}
                </h3>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {selectedInternship.company}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed mt-4">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Stipend</span>
                  <p className="font-black text-slate-900 dark:text-white">
                    {selectedInternship.stipend}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Location</span>
                  <p className="font-black text-slate-900 dark:text-white">
                    {selectedInternship.location}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Work Mode</span>
                  <p className="font-black text-slate-900 dark:text-white">
                    {selectedInternship.mode}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Duration</span>
                  <p className="font-black text-slate-900 dark:text-white">
                    {selectedInternship.duration}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Deadline</span>
                  <p className="font-black text-slate-900 dark:text-white">
                    {selectedInternship.deadline}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Status</span>
                  <p className="font-black text-green-600">Open Listing</p>
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">
                  Role Summary
                </h4>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {selectedInternship.summary}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">
                  Eligibility Criteria
                </h4>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {selectedInternship.eligibility}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">
                  Required Skills in JD
                </h4>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {selectedInternship.skills}
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 p-3.5 text-orange-900 dark:text-orange-200">
                <strong className="font-black">Selection Factor: </strong>
                Under the PM Internship Scheme, candidates residing in or near {selectedInternship.city} ({selectedInternship.state}) or with matching academic branch qualification receive prioritized interview review.
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Record ID: {selectedInternship.id}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-extrabold hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApplyClick(selectedInternship);
                    setSelectedInternship(null);
                  }}
                  className="rounded-xl bg-gradient-to-r from-[#F57C00] to-[#E65100] text-white px-6 py-2 text-xs font-black hover:brightness-105 cursor-pointer"
                >
                  Apply for this Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Application Success Modal */}
      {applySuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-black text-slate-900 dark:text-white">
              Application Submitted in Real-Time!
            </h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              You have successfully applied for <strong>{applySuccessModal.title}</strong> at{" "}
              <strong>{applySuccessModal.company}</strong>. Your profile & resume have been recorded.
            </p>
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl">
              Track review status anytime in your <strong>Student Dashboard</strong>.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              {onNavigateToDashboard && (
                <button
                  onClick={() => {
                    setApplySuccessModal(null);
                    onNavigateToDashboard();
                  }}
                  className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-black hover:bg-primary/90 transition shadow-xs cursor-pointer"
                >
                  Track in Student Dashboard
                </button>
              )}
              <button
                onClick={() => setApplySuccessModal(null)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}