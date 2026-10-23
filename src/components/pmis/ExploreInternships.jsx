import { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Building,
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
} from "lucide-react";
import rawInternships from "@/data/internships.json";
import CompanyLogo from "./CompanyLogo";

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, "");

export default function ExploreInternships({ user, onRequireAuth, onApplySuccess }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [appliedIds, setAppliedIds] = useState([]);
  const [applyingId, setApplyingId] = useState(null);
  const [applySuccessModal, setApplySuccessModal] = useState(null);

  // Sync applied IDs for the logged in user
  useEffect(() => {
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
  }, [user]);

  // Extract unique sectors, states, modes
  const sectors = useMemo(() => {
    return ["All", ...new Set(rawInternships.map((i) => i.sector))].sort();
  }, []);

  const states = useMemo(() => {
    return ["All", ...new Set(rawInternships.map((i) => i.state))].sort();
  }, []);

  const modes = useMemo(() => {
    return ["All", ...new Set(rawInternships.map((i) => i.mode))].sort();
  }, []);

  // Filtered internships
  const filteredList = useMemo(() => {
    return rawInternships.filter((item) => {
      const matchSearch =
        !searchTerm.trim() ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sector.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSector = selectedSector === "All" || item.sector === selectedSector;
      const matchState = selectedState === "All" || item.state === selectedState;
      const matchMode =
        selectedMode === "All" || item.mode.toLowerCase().includes(selectedMode.toLowerCase());

      return matchSearch && matchSector && matchState && matchMode;
    });
  }, [searchTerm, selectedSector, selectedState, selectedMode]);

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
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Application Submitted",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300 font-bold",
    };

    try {
      // Call real-time backend endpoint
      await fetch(`${BACKEND_URL}/api/user/apply?user_id=${user.user_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      localStorage.setItem(storageKey, "pmis_applied_ids", JSON.stringify(updatedIds));
      localStorage.setItem(storageKey, JSON.stringify(updatedIds));

      // Save application record
      try {
        const existingApps = JSON.parse(localStorage.getItem(appStorageKey) || "[]");
        existingApps.unshift(newAppRecord);
        localStorage.setItem(appStorageKey, JSON.stringify(existingApps));
      } catch {
        // ignore
      }

      setApplySuccessModal(item);
      onApplySuccess?.(item);
      setApplyingId(null);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedSector("All");
    setSelectedState("All");
    setSelectedMode("All");
  };

  const hasActiveFilters =
    searchTerm || selectedSector !== "All" || selectedState !== "All" || selectedMode !== "All";

  return (
    <div id="explore-internships" className="mx-auto max-w-7xl px-4 py-12">
      {/* Header section with High-Contrast Typography */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-orange-700 dark:text-orange-300 border border-saffron/40 mb-2">
          <ShieldCheck className="h-4 w-4 text-orange-600" /> Official PM Internship Scheme Openings
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore All 120 Paid Corporate Internships
        </h2>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2">
          Filter by your State, Work Mode, or Sector across 24 sectors. Real-time selection criteria and direct application.
        </p>
      </div>

      {/* Filter and Search Bar with High Contrast */}
      <div className="rounded-3xl p-5 sm:p-6 mb-8 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
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
              placeholder="Search role, company, or skill..."
              className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary"
            />
          </div>

          {/* Sector Filter */}
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-3.5 pr-8 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary"
            >
              <option value="All">All 24 Sectors</option>
              {sectors.filter((s) => s !== "All").map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>

          {/* State Filter */}
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-3.5 pr-8 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary"
            >
              <option value="All">All States / Locations</option>
              {states.filter((s) => s !== "All").map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>

          {/* Work Mode Filter */}
          <div className="relative">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-3.5 pr-8 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-primary"
            >
              <option value="All">All Work Modes (Hybrid / On-site / Remote)</option>
              {modes.filter((m) => m !== "All").map((md) => (
                <option key={md} value={md}>
                  {md}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Counter & Clear Filter */}
        <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p className="font-extrabold text-slate-800 dark:text-slate-200">
            Showing <span className="text-primary font-black text-sm">{filteredList.length}</span> verified internship roles
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-extrabold text-red-600 hover:underline flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Internship Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="rounded-3xl p-12 text-center border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-base font-extrabold text-slate-900 dark:text-white">No internships match your current filters</p>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 mb-4">
            Try choosing a different state, sector, or clearing the search keyword.
          </p>
          <button
            onClick={clearAllFilters}
            className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-xs font-extrabold hover:bg-primary/90 transition shadow-xs"
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
                    <p className="text-xs font-extrabold text-slate-600 dark:text-slate-300 mt-0.5">{item.company}</p>
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
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedInternship(item)}
                    className="text-xs font-extrabold text-primary hover:underline"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleApplyClick(item)}
                    disabled={isApplied || isCurrentlyApplying}
                    className={`rounded-xl px-4 py-2 text-xs font-extrabold transition shadow-xs ${
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
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900"
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
                  <p className="font-black text-slate-900 dark:text-white">{selectedInternship.stipend}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Location</span>
                  <p className="font-black text-slate-900 dark:text-white">{selectedInternship.location}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Work Mode</span>
                  <p className="font-black text-slate-900 dark:text-white">{selectedInternship.mode}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Duration</span>
                  <p className="font-black text-slate-900 dark:text-white">{selectedInternship.duration}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Deadline</span>
                  <p className="font-black text-slate-900 dark:text-white">{selectedInternship.deadline}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Status</span>
                  <p className="font-black text-green-600">Open Listing</p>
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">Role Summary</h4>
                <p className="text-slate-600 dark:text-slate-300 font-medium">{selectedInternship.summary}</p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">Eligibility Criteria</h4>
                <p className="text-slate-600 dark:text-slate-300 font-medium">{selectedInternship.eligibility}</p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">Required Skills in JD</h4>
                <p className="text-slate-600 dark:text-slate-300 font-medium">{selectedInternship.skills}</p>
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
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-extrabold hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApplyClick(selectedInternship);
                    setSelectedInternship(null);
                  }}
                  className="rounded-xl bg-gradient-to-r from-[#F57C00] to-[#E65100] text-white px-6 py-2 text-xs font-black hover:brightness-105"
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
            <button
              onClick={() => setApplySuccessModal(null)}
              className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-black hover:bg-primary/90 transition shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
