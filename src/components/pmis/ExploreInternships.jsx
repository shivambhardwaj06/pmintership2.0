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
} from "lucide-react";
import rawInternships from "@/data/internships.json";
import CompanyLogo from "./CompanyLogo";

export default function ExploreInternships({ user, onRequireAuth, onApplySuccess }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [appliedIds, setAppliedIds] = useState(["PMIS-001", "PMIS-046"]);
  const [applySuccessModal, setApplySuccessModal] = useState(null);

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
      const matchMode = selectedMode === "All" || item.mode.toLowerCase().includes(selectedMode.toLowerCase());

      return matchSearch && matchSector && matchState && matchMode;
    });
  }, [searchTerm, selectedSector, selectedState, selectedMode]);

  const handleApplyClick = (item) => {
    if (!user) {
      onRequireAuth?.();
      return;
    }

    if (appliedIds.includes(item.id)) {
      return;
    }

    // Submit application
    setAppliedIds((prev) => [...prev, item.id]);
    setApplySuccessModal(item);
    onApplySuccess?.(item);
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
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-saffron-foreground border border-saffron/30 mb-2">
          <ShieldCheck className="h-3.5 w-3.5 text-orange-600" /> Official PM Internship Prototype
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
          Explore 120 Paid Internships Across 24 Sectors
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Discover verified opportunities in India's leading organizations. Filter by your state, preferred sector, and work mode.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 mb-8 border border-border shadow-soft bg-card/85">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Search box */}
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-muted-foreground">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search role, company, or skill..."
              className="w-full rounded-2xl border border-input bg-background pl-9 pr-4 py-2.5 text-xs font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Sector Filter */}
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-input bg-background pl-3.5 pr-8 py-2.5 text-xs font-semibold outline-none focus:border-primary"
            >
              <option value="All">All 24 Sectors</option>
              {sectors.filter((s) => s !== "All").map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>

          {/* State Filter */}
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-input bg-background pl-3.5 pr-8 py-2.5 text-xs font-semibold outline-none focus:border-primary"
            >
              <option value="All">All States / Locations</option>
              {states.filter((s) => s !== "All").map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Work Mode Filter */}
          <div className="relative">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-input bg-background pl-3.5 pr-8 py-2.5 text-xs font-semibold outline-none focus:border-primary"
            >
              <option value="All">All Work Modes</option>
              {modes.filter((m) => m !== "All").map((md) => (
                <option key={md} value={md}>
                  {md}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Filter results counter & reset */}
        <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p className="font-semibold text-foreground">
            Showing <span className="text-primary font-bold">{filteredList.length}</span> verified internship listings
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Internship Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-border">
          <p className="text-base font-bold text-foreground">No internships match your current filters</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Try choosing a different state, sector, or clearing the search keyword.
          </p>
          <button
            onClick={clearAllFilters}
            className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold hover:bg-primary/90 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => {
            const isApplied = appliedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft hover:shadow-xl transition-all duration-300 hover:border-primary/40 hover:-translate-y-1"
              >
                <div>
                  {/* Top: Logo & Sector Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <CompanyLogo name={item.company} className="h-14 w-14 shrink-0" />
                    <span className="rounded-full bg-secondary/80 text-primary text-[10px] font-bold px-2.5 py-1 border border-border truncate max-w-[170px]">
                      {item.sector}
                    </span>
                  </div>

                  {/* Company Name & Role Title */}
                  <div className="mb-3">
                    <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground mt-0.5">{item.company}</p>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  {/* Badges / Key Details */}
                  <div className="space-y-1.5 pb-4 border-b border-border/60 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{item.location}</span>
                      <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-semibold text-foreground">
                        {item.mode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IndianRupee className="h-3.5 w-3.5 text-saffron shrink-0" />
                      <span className="font-semibold text-foreground">{item.stipend}</span>
                      <span className="text-[10px] text-muted-foreground">({item.duration})</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>Deadline: <strong className="text-foreground">{item.deadline}</strong></span>
                    </div>
                  </div>

                  {/* Eligibility snippet */}
                  <div className="pt-3">
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      <strong className="text-foreground/80">Eligibility: </strong>
                      {item.eligibility}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedInternship(item)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleApplyClick(item)}
                    disabled={isApplied}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
                      isApplied
                        ? "bg-green-100 text-green-800 border border-green-300 cursor-default"
                        : "bg-gradient-to-r from-[#F57C00] to-[#E65100] text-white hover:brightness-105 active:scale-95"
                    }`}
                  >
                    {isApplied ? "✓ Applied" : "Apply Now"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedInternship(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <CompanyLogo name={selectedInternship.company} className="h-16 w-16" />
              <div>
                <span className="text-[11px] font-bold text-saffron uppercase tracking-wider">
                  {selectedInternship.sector}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {selectedInternship.title}
                </h3>
                <p className="text-sm font-semibold text-muted-foreground">
                  {selectedInternship.company}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed mt-4">
              <div className="rounded-2xl bg-muted/50 p-4 border border-border grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Stipend</span>
                  <p className="font-bold text-foreground">{selectedInternship.stipend}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Location</span>
                  <p className="font-bold text-foreground">{selectedInternship.location}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Work Mode</span>
                  <p className="font-bold text-foreground">{selectedInternship.mode}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Duration</span>
                  <p className="font-bold text-foreground">{selectedInternship.duration}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Deadline</span>
                  <p className="font-bold text-foreground">{selectedInternship.deadline}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Status</span>
                  <p className="font-bold text-green-600">Open Listing</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-foreground text-sm mb-1">Role Summary</h4>
                <p className="text-muted-foreground">{selectedInternship.summary}</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground text-sm mb-1">Eligibility Criteria</h4>
                <p className="text-muted-foreground">{selectedInternship.eligibility}</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground text-sm mb-1">Required Skills</h4>
                <p className="text-muted-foreground">{selectedInternship.skills}</p>
              </div>

              <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 text-primary">
                <strong>Selection Factor Tip: </strong>
                Candidates residing in or near {selectedInternship.city} ({selectedInternship.state}) or with aligned academic branch credentials receive prioritized review.
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">ID: {selectedInternship.id}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold hover:bg-muted"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApplyClick(selectedInternship);
                    setSelectedInternship(null);
                  }}
                  className="rounded-xl bg-gradient-to-r from-[#F57C00] to-[#E65100] text-white px-5 py-2 text-xs font-bold hover:brightness-105"
                >
                  Apply for this Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Success Modal */}
      {applySuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-card border border-border shadow-2xl p-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Application Submitted!
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You have successfully applied for <strong>{applySuccessModal.title}</strong> at{" "}
              <strong>{applySuccessModal.company}</strong>. Your profile & resume have been forwarded to the employer.
            </p>
            <p className="text-[11px] text-muted-foreground bg-muted p-2 rounded-xl">
              Track your status in your <strong>Student Dashboard</strong>.
            </p>
            <button
              onClick={() => setApplySuccessModal(null)}
              className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-bold hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
