import React, { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  Building2,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Video,
  ExternalLink,
  PlusCircle,
  Search,
  Filter,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Award,
  Send,
  Eye,
  Download,
  RefreshCw,
  LogOut,
  MapPin,
  IndianRupee,
  AlertCircle,
  X,
  Phone,
  Mail,
  GraduationCap,
  Layers,
  ChevronDown,
  UserCheck,
  Check,
  Bot,
  XCircle
} from "lucide-react";
import CompanyLogo from "./CompanyLogo";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const PMIS_SECTORS = [
  "IT & Software Development",
  "Automotive",
  "Banking & Financial Services",
  "Infrastructure & Construction",
  "Pharmaceuticals",
  "Oil, Gas & Energy",
  "Manufacturing & Industrial",
  "Telecommunications",
  "Aviation & Defence",
  "Metals & Mining",
  "Chemicals & Petrochemicals",
  "Agriculture & Allied Industries",
  "Retail & Consumer Goods",
  "Healthcare & Life Sciences",
  "Power & Renewable Energy",
  "Logistics & Supply Chain",
  "Food Processing & FMCG",
  "Textiles & Apparel",
  "Electronics & Hardware",
  "Media & Entertainment",
  "Tourism & Hospitality",
  "Consulting & Professional Services",
  "Education & EdTech",
  "E-Commerce & Digital Platforms",
  "Government & Public Sector"
];

const PREMIER_DEMO_RECRUITERS = [
  {
    company_name: "Tata Motors",
    recruiter_name: "Suresh K. Nair",
    designation: "Lead Technical Talent Acquisition",
    email: "recruiter@tatamotors.com",
    sector: "Automotive"
  },
  {
    company_name: "HDFC Bank",
    recruiter_name: "Pooja Mehta",
    designation: "Operations Hiring Lead",
    email: "recruiter@hdfcbank.com",
    sector: "Banking & Financial Services"
  },
  {
    company_name: "Larsen & Toubro",
    recruiter_name: "Kavita S. Rao",
    designation: "Strategic Infrastructure Talent Partner",
    email: "recruiter@lt.com",
    sector: "Infrastructure & Construction"
  },
  {
    company_name: "Sun Pharmaceutical Industries",
    recruiter_name: "Dr. Rajesh Gupta",
    designation: "Pharma R&D Talent Partner",
    email: "recruiter@sunpharma.com",
    sector: "Pharmaceuticals"
  },
  {
    company_name: "Tata Consultancy Services",
    recruiter_name: "Anand Deshpande",
    designation: "Head of Campus Talent Acquisition",
    email: "recruiter@tcs.com",
    sector: "IT & Software Development"
  },
  {
    company_name: "Infosys",
    recruiter_name: "Deepak Balakrishnan",
    designation: "Early Careers Lead",
    email: "recruiter@infosys.com",
    sector: "IT & Software Development"
  }
];

export default function RecruiterPortal() {
  // Auth state
  const [recruiter, setRecruiter] = useState(() => {
    try {
      const saved = localStorage.getItem("pmis_recruiter_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activeCompany, setActiveCompany] = useState(() => {
    try {
      const saved = localStorage.getItem("pmis_recruiter_user");
      return saved ? JSON.parse(saved).company_name : "Tata Motors";
    } catch {
      return "Tata Motors";
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("Pmis@2026");
  const [authName, setAuthName] = useState("");
  const [authDesignation, setAuthDesignation] = useState("Talent Acquisition Manager");
  const [authCompany, setAuthCompany] = useState("Tata Motors");
  const [authError, setAuthError] = useState("");

  // Portal tabs: "pipeline" | "post" | "openings"
  const [activeTab, setActiveTab] = useState("pipeline");

  // Live Data State
  const [stats, setStats] = useState({
    openings_count: 0,
    total_applications: 0,
    submitted_count: 0,
    under_review_count: 0,
    shortlisted_count: 0,
    selected_count: 0,
    rejected_count: 0,
  });
  const [applications, setApplications] = useState([]);
  const [openings, setOpenings] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [newStatus, setNewStatus] = useState("Under Review");
  const [newNotes, setNewNotes] = useState("");
  const [newInterviewDate, setNewInterviewDate] = useState("");
  const [newMeetingLink, setNewMeetingLink] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [resumeModalApp, setResumeModalApp] = useState(null);

  // AI Screener Bot State
  const [showAiScreenerModal, setShowAiScreenerModal] = useState(false);
  const [screeningRole, setScreeningRole] = useState("All");
  const [shortlistCount, setShortlistCount] = useState(1);
  const [minScoreThreshold, setMinScoreThreshold] = useState(70);
  const [screeningRunning, setScreeningRunning] = useState(false);
  const [screeningResult, setScreeningResult] = useState(null);
  const [screenerError, setScreenerError] = useState(null);

  // Post Internship Form State
  const [postTitle, setPostTitle] = useState("");
  const [postSector, setPostSector] = useState("Automotive");
  const [postLocation, setPostLocation] = useState("Pune, Maharashtra");
  const [postMode, setPostMode] = useState("On-site");
  const [postStipend, setPostStipend] = useState("₹5,000 / month");
  const [postDuration, setPostDuration] = useState("12 Months");
  const [postVacancies, setPostVacancies] = useState("15");
  const [postSkills, setPostSkills] = useState("CAD Modeling, Vehicle Dynamics, MATLAB, Problem Solving");
  const [postEligibility, setPostEligibility] = useState("B.Tech / Diploma (Mechanical / Automobile / Production)");
  const [postDescription, setPostDescription] = useState("");
  const [postingLoading, setPostingLoading] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Initial Fetch: Companies list
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/recruiter/companies`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.companies) {
          setCompaniesList(data.companies);
        }
      })
      .catch((err) => console.warn("Failed to load companies list:", err));
  }, []);

  // Fetch Stats, Applications, and Openings whenever activeCompany changes
  const loadDashboardData = async (companyName) => {
    setLoading(true);
    const targetComp = companyName || activeCompany;
    try {
      const encComp = encodeURIComponent(targetComp);
      const [statsRes, appsRes, openingsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/recruiter/stats?company=${encComp}`).then((r) => r.json()),
        fetch(`${BACKEND_URL}/api/recruiter/applications?company=${encComp}`).then((r) => r.json()),
        fetch(`${BACKEND_URL}/api/recruiter/internships?company=${encComp}`).then((r) => r.json()),
      ]);

      if (statsRes?.status === "success") {
        setStats(statsRes);
      }
      if (appsRes?.status === "success" && appsRes.applications) {
        setApplications(appsRes.applications);
      }
      if (openingsRes?.status === "success" && openingsRes.internships) {
        setOpenings(openingsRes.internships);
      }
    } catch (err) {
      console.error("Error loading recruiter dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData(activeCompany);
  }, [activeCompany]);

  // Handle Demo Recruiter Login
  const handleQuickDemoLogin = async (demoRec) => {
    setAuthEmail(demoRec.email);
    setAuthCompany(demoRec.company_name);
    setAuthName(demoRec.recruiter_name);
    setAuthDesignation(demoRec.designation);

    try {
      const res = await fetch(`${BACKEND_URL}/api/recruiter/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: demoRec.email,
          password: "Pmis@2026",
          company_name: demoRec.company_name,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecruiter(data.recruiter);
        setActiveCompany(demoRec.company_name);
        localStorage.setItem("pmis_recruiter_user", JSON.stringify(data.recruiter));
        if (data.access_token) {
          localStorage.setItem("pmis_recruiter_token", data.access_token);
        }
        setShowAuthModal(false);
        setAuthError("");
        loadDashboardData(demoRec.company_name);
      } else {
        setAuthError(data.detail || "Login failed");
      }
    } catch (err) {
      setAuthError("Network connection error to backend server.");
    }
  };

  // Handle Manual Login / Registration
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    const endpoint = authMode === "login" ? "/api/recruiter/login" : "/api/recruiter/register";
    const payload =
      authMode === "login"
        ? {
            email: authEmail,
            password: authPassword,
            company_name: authCompany,
          }
        : {
            company_name: authCompany,
            recruiter_name: authName || "Corporate Recruiter",
            email: authEmail,
            password: authPassword,
            designation: authDesignation,
            mobile: "+91 98200 12345",
          };

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setRecruiter(data.recruiter);
        setActiveCompany(authCompany);
        localStorage.setItem("pmis_recruiter_user", JSON.stringify(data.recruiter));
        if (data.access_token) {
          localStorage.setItem("pmis_recruiter_token", data.access_token);
        }
        setShowAuthModal(false);
        loadDashboardData(authCompany);
      } else {
        setAuthError(data.detail || "Authentication error.");
      }
    } catch (err) {
      setAuthError("Backend server connection failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("pmis_recruiter_user");
    localStorage.removeItem("pmis_recruiter_token");
    setRecruiter(null);
  };

  // Open Status Update Modal
  const openStatusModal = (app) => {
    setStatusModalApp(app);
    setNewStatus(app.status || "Under Review");
    setNewNotes(app.recruiter_notes || "");
    setNewInterviewDate(app.interview_date || "");
    setNewMeetingLink(app.meeting_link || "https://meet.google.com/pmis-interview");
  };

  // Submit Status Update
  const handleSaveStatus = async () => {
    if (!statusModalApp) return;
    setUpdatingStatus(true);
    const appId = statusModalApp.application_id || statusModalApp.id;

    try {
      const res = await fetch(`${BACKEND_URL}/api/recruiter/applications/${appId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          recruiter_notes: newNotes,
          interview_date: newInterviewDate,
          meeting_link: newMeetingLink,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local applications list
        setApplications((prev) =>
          prev.map((a) =>
            (a.application_id === appId || a.id === appId) ? { ...a, ...data.application } : a
          )
        );
        // Refresh stats
        const encComp = encodeURIComponent(activeCompany);
        fetch(`${BACKEND_URL}/api/recruiter/stats?company=${encComp}`)
          .then((r) => r.json())
          .then((st) => st?.status === "success" && setStats(st));

        setStatusModalApp(null);
      } else {
        alert("Failed to update status on server.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Error contacting backend server.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Run AI Candidate Screener Bot
  const handleRunAiScreener = async () => {
    setScreeningRunning(true);
    setScreenerError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/recruiter/ai-screen-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: activeCompany,
          role_title: screeningRole === "All" ? undefined : screeningRole,
          shortlist_count: Number(shortlistCount) || 1,
          min_score_threshold: Number(minScoreThreshold) || 70,
          auto_apply_status: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "AI screening failed.");
      }

      setScreeningResult(data);

      // Re-fetch applications from backend to reflect updated statuses & AI feedback
      const encComp = encodeURIComponent(activeCompany);
      const updatedAppsRes = await fetch(`${BACKEND_URL}/api/recruiter/applications?company=${encComp}`).then((r) => r.json());
      if (updatedAppsRes?.status === "success" && updatedAppsRes.applications) {
        setApplications(updatedAppsRes.applications);
      }

      // Refresh statistics counters
      fetch(`${BACKEND_URL}/api/recruiter/stats?company=${encComp}`)
        .then((r) => r.json())
        .then((st) => st?.status === "success" && setStats(st));
    } catch (err) {
      console.error("AI Screener error:", err);
      setScreenerError(err.message || "Failed to screen applications.");
    } finally {
      setScreeningRunning(false);
    }
  };

  // Submit New Internship Opportunity
  const handlePostInternship = async (e) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      alert("Please provide an internship title.");
      return;
    }
    setPostingLoading(true);
    setPostSuccess(false);

    try {
      const res = await fetch(`${BACKEND_URL}/api/recruiter/internships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle.trim(),
          company: activeCompany,
          sector: postSector,
          location: postLocation.trim(),
          mode: postMode,
          stipend: postStipend.trim(),
          duration: postDuration.trim(),
          vacancies: parseInt(postVacancies, 10) || 10,
          skills: postSkills.split(",").map((s) => s.strip ? s.strip() : s.trim()).filter(Boolean),
          eligibility: postEligibility.trim(),
          description: postDescription.trim() || `Official PM Internship opportunity in ${postSector} at ${activeCompany}.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOpenings((prev) => [data.internship, ...prev]);
        setPostSuccess(true);
        setPostTitle("");
        setPostDescription("");
        // Reload stats
        loadDashboardData(activeCompany);
        setTimeout(() => {
          setActiveTab("openings");
          setPostSuccess(false);
        }, 1500);
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to post internship.");
      }
    } catch (err) {
      alert("Backend connection error while posting.");
    } finally {
      setPostingLoading(false);
    }
  };

  // Filtered applications list
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status filter
      if (statusFilter !== "All") {
        const appStatus = (app.status || "").toLowerCase();
        const sf = statusFilter.toLowerCase();
        if (sf === "shortlisted" && !appStatus.includes("shortlist") && !appStatus.includes("interview")) return false;
        if (sf === "selected" && !appStatus.includes("select") && !appStatus.includes("offer")) return false;
        if (sf === "under review" && !appStatus.includes("under review")) return false;
        if (sf === "submitted" && !appStatus.includes("submitted")) return false;
        if (sf === "rejected" && !appStatus.includes("reject") && !appStatus.includes("not selected")) return false;
      }

      // Role filter
      if (roleFilter !== "All" && app.title !== roleFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const candName = (app.candidate_name || "").toLowerCase();
        const candEmail = (app.candidate_email || "").toLowerCase();
        const role = (app.title || "").toLowerCase();
        const college = (app.college || "").toLowerCase();
        const skills = Array.isArray(app.skills)
          ? app.skills.join(" ").toLowerCase()
          : (app.skills || "").toLowerCase();
        return (
          candName.includes(q) ||
          candEmail.includes(q) ||
          role.includes(q) ||
          college.includes(q) ||
          skills.includes(q)
        );
      }

      return true;
    });
  }, [applications, statusFilter, roleFilter, searchQuery]);

  // Distinct roles for dropdown
  const distinctRoles = useMemo(() => {
    const set = new Set();
    applications.forEach((a) => a.title && set.add(a.title));
    return Array.from(set);
  }, [applications]);

  // Status color resolver
  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("select") || s.includes("offer")) {
      return {
        bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
        dot: "bg-emerald-500",
        label: status || "Selected / Offer Released",
      };
    }
    if (s.includes("shortlist") || s.includes("interview")) {
      return {
        bg: "bg-indigo-100 text-indigo-800 border-indigo-300",
        dot: "bg-indigo-500",
        label: status || "Shortlisted for Interview",
      };
    }
    if (s.includes("under review")) {
      return {
        bg: "bg-amber-100 text-amber-800 border-amber-300",
        dot: "bg-amber-500",
        label: status || "Under Review",
      };
    }
    if (s.includes("not selected") || s.includes("reject")) {
      return {
        bg: "bg-slate-100 text-slate-700 border-slate-300",
        dot: "bg-slate-400",
        label: status || "Not Selected",
      };
    }
    return {
      bg: "bg-blue-100 text-blue-800 border-blue-300",
      dot: "bg-blue-500",
      label: status || "Application Submitted",
    };
  };

  // Format absolute CDN resume link
  const getCdnResumeUrl = (url) => {
    if (!url) return `${BACKEND_URL}/cdn/resumes/priya_sharma_resume.pdf`;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* ============================================================== */}
      {/* TOP HEADER: MCA / PMIS RECRUITER PORTAL */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left Brand Identity */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition mr-2"
              title="Return to Student Candidate Portal"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Candidate View</span>
            </a>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#0B2545] to-[#134074] flex items-center justify-center text-white shadow-xs">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                    PM Internship Scheme
                  </span>
                  <span className="inline-flex items-center rounded-md bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 text-[10px] font-black uppercase text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                    Corporate Recruiter Portal
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Ministry of Corporate Affairs • Partner Corporate Gateway
                </p>
              </div>
            </div>
          </div>

          {/* Right Controls: Active Company Badge & Recruiter Account */}
          <div className="flex items-center gap-3">
            {/* Quick Company Switcher Dropdown */}
            <div className="relative hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <CompanyLogo name={activeCompany} className="h-6 w-6 shrink-0" />
              <select
                value={activeCompany}
                onChange={(e) => {
                  const newComp = e.target.value;
                  setActiveCompany(newComp);
                  if (recruiter) {
                    const updated = { ...recruiter, company_name: newComp };
                    setRecruiter(updated);
                    localStorage.setItem("pmis_recruiter_user", JSON.stringify(updated));
                  }
                }}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[180px] truncate"
              >
                {companiesList.length > 0 ? (
                  companiesList.map((c) => (
                    <option key={c.company_name} value={c.company_name} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {c.company_name} ({c.openings_count} roles)
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Tata Consultancy Services">Tata Consultancy Services</option>
                    <option value="Tata Motors">Tata Motors</option>
                    <option value="Larsen & Toubro">Larsen & Toubro</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="Sun Pharmaceutical Industries">Sun Pharmaceutical Industries</option>
                    <option value="Infosys">Infosys</option>
                  </>
                )}
              </select>
            </div>

            {/* Recruiter Identity / Login Button */}
            {recruiter ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-end gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    {recruiter.recruiter_name}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 truncate max-w-[150px]">
                    {recruiter.designation || "Recruiter"}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                  title="Logout from Recruiter Portal"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="rounded-xl bg-gradient-to-r from-[#0B2545] to-[#134074] text-white px-4 py-2 text-xs font-extrabold shadow-sm hover:brightness-110 transition cursor-pointer flex items-center gap-1.5"
              >
                <Building2 className="h-3.5 w-3.5" />
                Recruiter Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* HERO BANNER & STATS BAR */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-slate-100/70 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/70 px-3 py-1 text-xs font-extrabold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Prime Minister Internship Scheme • Corporate Talent Hub</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                <CompanyLogo name={activeCompany} className="h-9 w-9 shrink-0" />
                <span>{activeCompany}</span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 max-w-2xl">
                Review candidate resumes, schedule interviews, update applicant selection progress, and publish official PMIS corporate internships.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  setRefreshing(true);
                  loadDashboardData(activeCompany);
                }}
                disabled={refreshing}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                Refresh Data
              </button>

              <button
                onClick={() => setActiveTab("post")}
                className="rounded-xl bg-gradient-to-r from-[#F57C00] to-[#E65100] text-white px-4 py-2 text-xs font-black shadow-sm hover:brightness-105 transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Post PM Internship
              </button>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-8">
            {/* Active Openings */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider">Active Roles</span>
                <Briefcase className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.openings_count}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 mt-0.5">PMIS Openings</div>
            </div>

            {/* Total Applications */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider">Candidates</span>
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.total_applications}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Total Resumes</div>
            </div>

            {/* Submitted */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider">Submitted</span>
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {stats.submitted_count}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Awaiting Review</div>
            </div>

            {/* Under Review */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider">Under Review</span>
                <FileText className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {stats.under_review_count}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Evaluating Profile</div>
            </div>

            {/* Shortlisted */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider">Shortlisted</span>
                <Video className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {stats.shortlisted_count}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Interview Pipeline</div>
            </div>

            {/* Selected / Offer */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider">Offers Made</span>
                <Award className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.selected_count}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Selected Candidates</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MAIN CONTENT AREA & TABS */}
      {/* ============================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`px-4 py-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "pipeline"
                ? "border-[#F57C00] text-[#E65100] dark:text-orange-400 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Users className="h-4 w-4" />
            Candidate Applications ({applications.length})
          </button>

          <button
            onClick={() => setActiveTab("openings")}
            className={`px-4 py-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "openings"
                ? "border-[#F57C00] text-[#E65100] dark:text-orange-400 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Company Openings ({openings.length})
          </button>

          <button
            onClick={() => setActiveTab("post")}
            className={`px-4 py-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "post"
                ? "border-[#F57C00] text-[#E65100] dark:text-orange-400 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            Post New Internship
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: CANDIDATE APPLICATIONS PIPELINE */}
        {/* ============================================================== */}
        {activeTab === "pipeline" && (
          <div className="space-y-6">
            {/* AI Screener Bot Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2545] via-slate-900 to-[#134074] border-2 border-indigo-500/30 p-6 text-white shadow-xl">
              <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-indigo-500/10 blur-2xl" />
              <div className="absolute right-24 -bottom-10 h-36 w-36 rounded-full bg-orange-500/10 blur-xl" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/40 px-3 py-1 text-xs font-black text-indigo-300">
                    <Bot className="h-4 w-4 text-indigo-400 animate-pulse" />
                    <span>AI Candidate Screener Bot</span>
                    <span className="text-[10px] bg-indigo-400/30 px-1.5 py-0.5 rounded text-white font-mono">ATS 2.0</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                    Automate Shortlisting & Generate Constructive Feedback
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Filter all applications for any opening based on real-world recruiter ATS criteria (technical skill overlap, branch fit, and CGPA). Automatically shortlist top candidates with Google Meet interview slots, and generate personalized, constructive rejection feedback for unselected applications.
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ATS Ranking & Match Scores
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                      Auto-Schedule Interview Slots
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      Constructive Rejection Feedback for Candidates
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setScreeningResult(null);
                      setScreenerError(null);
                      setShowAiScreenerModal(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg hover:shadow-orange-500/25 transition cursor-pointer"
                  >
                    <Bot className="h-4 w-4" />
                    <span>Launch AI Screener Bot</span>
                  </button>
                  <div className="text-[11px] text-center text-slate-400 font-semibold">
                    {applications.length} applications received for {activeCompany}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidates by name, email, branch, college, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses ({applications.length})</option>
                  <option value="Submitted">Application Submitted ({stats.submitted_count})</option>
                  <option value="Under Review">Under Review ({stats.under_review_count})</option>
                  <option value="Shortlisted">Shortlisted / Interview ({stats.shortlisted_count})</option>
                  <option value="Selected">Selected / Offer ({stats.selected_count})</option>
                  <option value="Rejected">Not Selected ({stats.rejected_count})</option>
                </select>
              </div>

              {/* Role Filter */}
              {distinctRoles.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Role:</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[200px] truncate"
                  >
                    <option value="All">All Roles</option>
                    {distinctRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Applications List */}
            {loading ? (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-900">
                <RefreshCw className="h-8 w-8 text-orange-500 animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-500">Loading candidate applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 bg-white dark:bg-slate-900">
                <Users className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="font-display text-base font-bold text-slate-800 dark:text-white">
                  No Applications Match Your Filter
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try clearing the search or changing the status filter to view other candidate submissions.
                </p>
                <button
                  onClick={() => {
                    setStatusFilter("All");
                    setRoleFilter("All");
                    setSearchQuery("");
                  }}
                  className="rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => {
                  const badge = getStatusBadge(app.status);
                  const skills = Array.isArray(app.skills)
                    ? app.skills
                    : typeof app.skills === "string"
                    ? app.skills.split(",").map((s) => s.trim()).filter(Boolean)
                    : [];

                  return (
                    <div
                      key={app.application_id || app.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-orange-300 dark:hover:border-orange-900 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                    >
                      {/* Left: Candidate & Academic Info */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black border ${badge.bg}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                            {badge.label}
                          </span>
                          {app.ai_screener_score !== undefined && (
                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              <Bot className="h-3 w-3" />
                              <span>Score: {app.ai_screener_score}%</span>
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-slate-400">
                            App ID: {app.application_id || app.id}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            Applied: {app.applied_date || "2026-10-24"}
                          </span>
                        </div>

                        {/* Candidate Name & Role */}
                        <div>
                          <h3 className="font-display text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{app.candidate_name || "Youth Candidate"}</span>
                            {app.cgpa && (
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                CGPA: {app.cgpa}
                              </span>
                            )}
                          </h3>
                          <div className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5 mt-0.5">
                            <Briefcase className="h-3.5 w-3.5" />
                            <span>Role: {app.title}</span>
                          </div>
                        </div>

                        {/* Academic Degree & College */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                            {app.degree || "B.Tech"} • {app.branch || "Computer Science"}
                          </span>
                          <span>•</span>
                          <span>{app.college || "State Technological University"}</span>
                        </div>

                        {/* Contact details */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-semibold">
                          {app.candidate_email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {app.candidate_email}
                            </span>
                          )}
                          {app.candidate_mobile && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {app.candidate_mobile}
                            </span>
                          )}
                        </div>

                        {/* Candidate Skills Tags */}
                        {skills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {skills.slice(0, 6).map((sk, idx) => (
                              <span
                                key={idx}
                                className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                              >
                                {sk}
                              </span>
                            ))}
                            {skills.length > 6 && (
                              <span className="text-[10px] font-bold text-slate-400">
                                +{skills.length - 6} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Candidate Status & AI Screening Feedback Display */}
                        {(app.status === "Not Selected" || app.rejection_feedback) ? (
                          <div className="rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 p-3.5 text-xs border border-rose-200 dark:border-rose-900 space-y-2 mt-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 font-black text-rose-800 dark:text-rose-300">
                                <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                <span>AI Screener: Not Selected for this Role</span>
                              </div>
                              {app.ai_screener_score !== undefined && (
                                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                                  Match Score: {app.ai_screener_score}%
                                </span>
                              )}
                            </div>

                            <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                              <strong className="text-rose-900 dark:text-rose-200 mr-1">Feedback Delivered to Candidate:</strong>
                              {app.rejection_feedback || app.recruiter_notes || "Profile did not meet required skill criteria for this opening."}
                            </p>

                            {Array.isArray(app.missing_skills) && app.missing_skills.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-500">Missing Key Skills:</span>
                                <div className="flex flex-wrap gap-1">
                                  {app.missing_skills.map((s, idx) => (
                                    <span
                                      key={idx}
                                      className="rounded-md bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                                    >
                                      ✗ {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {Array.isArray(app.improvement_tips) && app.improvement_tips.length > 0 && (
                              <div className="space-y-1 pt-1 border-t border-rose-200/60 dark:border-rose-900/50">
                                <span className="text-[10px] font-bold text-slate-500">Improvement Guidance Provided:</span>
                                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                                  {app.improvement_tips.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : (app.status?.toLowerCase().includes("shortlist") || app.status?.toLowerCase().includes("interview")) ? (
                          <div className="rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 p-3.5 text-xs border border-emerald-200 dark:border-emerald-900 space-y-2 mt-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 font-black text-emerald-800 dark:text-emerald-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span>Shortlisted for Technical Interview</span>
                              </div>
                              {app.ai_screener_score !== undefined && (
                                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                  Score: {app.ai_screener_score}%
                                </span>
                              )}
                            </div>

                            {app.recruiter_notes && (
                              <p className="text-slate-700 dark:text-slate-300 font-semibold">
                                <strong className="text-emerald-950 dark:text-emerald-200 mr-1">Recruiter Notes:</strong>
                                {app.recruiter_notes}
                              </p>
                            )}

                            {Array.isArray(app.match_strengths) && app.match_strengths.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="text-[10px] font-bold text-slate-500 mr-1">Strengths:</span>
                                {app.match_strengths.map((str, idx) => (
                                  <span key={idx} className="rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                                    ✓ {str}
                                  </span>
                                ))}
                              </div>
                            )}

                            {app.interview_date && (
                              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 p-2 rounded-xl border border-indigo-200 dark:border-indigo-800">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  Scheduled: {app.interview_date}
                                </span>
                                {app.meeting_link && (
                                  <a
                                    href={app.meeting_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 underline text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                                  >
                                    <Video className="h-3.5 w-3.5" />
                                    Join Google Meet <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ) : app.recruiter_notes ? (
                          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 mt-1">
                            <span className="font-extrabold text-slate-900 dark:text-white mr-1.5">
                              💬 Recruiter Feedback:
                            </span>
                            <span>{app.recruiter_notes}</span>
                          </div>
                        ) : null}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2 shrink-0">
                        {/* Read Resume Button */}
                        <button
                          onClick={() => setResumeModalApp(app)}
                          className="rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-4 py-2.5 text-xs font-black hover:bg-blue-100 dark:hover:bg-blue-900/60 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Resume</span>
                        </button>

                        {/* Update Process Status Button */}
                        <button
                          onClick={() => openStatusModal(app)}
                          className="rounded-xl bg-gradient-to-r from-[#0B2545] to-[#134074] text-white px-4 py-2.5 text-xs font-black shadow-sm hover:brightness-110 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <UserCheck className="h-4 w-4" />
                          <span>Update Status & Notes</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: COMPANY OPENINGS */}
        {/* ============================================================== */}
        {activeTab === "openings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-black text-slate-900 dark:text-white">
                  Active PM Internship Opportunities ({openings.length})
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  Published corporate openings under {activeCompany} in the PMIS database.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("post")}
                className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-extrabold hover:bg-primary/90 transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Post New Opening
              </button>
            </div>

            {openings.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 bg-white dark:bg-slate-900">
                <Briefcase className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  No Active Openings Found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click below to post your organization's first PM Internship Scheme opportunity.
                </p>
                <button
                  onClick={() => setActiveTab("post")}
                  className="rounded-xl bg-orange-600 text-white px-4 py-2 text-xs font-bold hover:bg-orange-700 transition cursor-pointer"
                >
                  Create Opportunity
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {openings.map((op) => {
                  const roleAppsCount = applications.filter((a) => a.title === op.title).length;
                  return (
                    <div
                      key={op.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-orange-300 dark:hover:border-orange-800 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider">
                            {op.sector || "Corporate"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">ID: {op.id}</span>
                        </div>
                        <h4 className="font-display text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {op.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{op.location || "Pan-India"}</span>
                          <span>•</span>
                          <span>{op.mode || "Hybrid"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                          <span className="text-emerald-600">{op.stipend || "₹5,000 / mo"}</span>
                          <span>•</span>
                          <span>{op.duration || "12 Months"}</span>
                          <span>•</span>
                          <span>{op.vacancies || 10} Openings</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Users className="h-3.5 w-3.5 text-blue-600" />
                          <span>{roleAppsCount} Candidates Applied</span>
                        </div>
                        <button
                          onClick={() => {
                            setRoleFilter(op.title);
                            setActiveTab("pipeline");
                          }}
                          className="text-xs font-extrabold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer"
                        >
                          View Resumes <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: POST NEW INTERNSHIP FORM */}
        {/* ============================================================== */}
        {activeTab === "post" && (
          <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-600 dark:text-orange-400">
                <PlusCircle className="h-4 w-4" />
                <span>Prime Minister Internship Scheme Corporate Opening</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Post New Corporate Opportunity
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Opportunities are directly published and visible to all registered youth candidates across India.
              </p>
            </div>

            {postSuccess && (
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-4 mb-6 flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div className="text-xs font-bold">
                  Internship successfully published! Redirecting to company openings...
                </div>
              </div>
            )}

            <form onSubmit={handlePostInternship} className="space-y-4">
              {/* Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Internship Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Automation & DevOps Intern"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Corporate Partner Company
                  </label>
                  <input
                    type="text"
                    disabled
                    value={activeCompany}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3.5 py-2 text-xs font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Sector & Work Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PMIS Industry Sector *
                  </label>
                  <select
                    value={postSector}
                    onChange={(e) => setPostSector(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    {PMIS_SECTORS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Work Mode
                  </label>
                  <select
                    value={postMode}
                    onChange={(e) => setPostMode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              {/* Location, Stipend, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Location (City, State) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune, Maharashtra"
                    value={postLocation}
                    onChange={(e) => setPostLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Stipend
                  </label>
                  <input
                    type="text"
                    value={postStipend}
                    onChange={(e) => setPostStipend(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Vacancies
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={postVacancies}
                    onChange={(e) => setPostVacancies(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Required Technical & Professional Skills (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, Docker, Kubernetes, SQL, REST APIs"
                  value={postSkills}
                  onChange={(e) => setPostSkills(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Educational Eligibility */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Eligibility
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pre-final / Final Year B.Tech, B.E., BCA, MCA, B.Sc"
                  value={postEligibility}
                  onChange={(e) => setPostEligibility(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Opportunity Overview & Deliverables
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe key responsibilities, mentorship provided, and learning outcomes during the 12-month PM internship..."
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("openings")}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingLoading}
                  className="rounded-xl bg-gradient-to-r from-[#F57C00] to-[#E65100] text-white px-6 py-2.5 text-xs font-black shadow-md hover:brightness-105 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {postingLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Publishing Opportunity...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Publish PM Internship Opportunity
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL 0: AI CANDIDATE SCREENER BOT & REJECTION FEEDBACK        */}
      {/* ============================================================== */}
      {showAiScreenerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-6 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#0B2545] to-orange-500 text-white flex items-center justify-center shadow-md shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>AI Candidate Screener Bot</span>
                    <span className="rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black px-2 py-0.5 border border-indigo-200 dark:border-indigo-800">
                      ATS 2.0
                    </span>
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    {activeCompany} • Shortlist top applicants & dispatch constructive feedback
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiScreenerModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {/* Screening Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Opening to Screen:
                  </label>
                  <select
                    value={screeningRole}
                    onChange={(e) => setScreeningRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="All">All Active Openings ({distinctRoles.length} Roles)</option>
                    {distinctRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Shortlist Target (Top N Candidates):
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setShortlistCount(cnt)}
                        className={`flex-1 py-2 text-xs font-black rounded-xl border transition cursor-pointer ${
                          shortlistCount === cnt
                            ? "bg-[#0B2545] text-white border-[#0B2545] shadow-xs"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        Top {cnt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real ATS Criteria Information */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs space-y-1.5">
                <div className="font-black text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Real-World ATS Filtering & Feedback Logic:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>Technical Skills Overlap (50% weight)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>Discipline / Branch Alignment (25% weight)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>Academic CGPA Performance (15% weight)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>Constructive Rejection Guidance for Students</span>
                  </div>
                </div>
              </div>

              {/* Error banner */}
              {screenerError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-xs font-bold text-rose-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{screenerError}</span>
                </div>
              )}

              {/* Live Screening Results */}
              {screeningResult && (
                <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  {/* Results Summary Banner */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-black text-emerald-900 dark:text-emerald-200">
                        Screening & Feedback Dispatch Complete!
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        {screeningResult.shortlisted_count} application(s) shortlisted with interview slots • {screeningResult.rejected_count} application(s) provided constructive rejection feedback.
                      </div>
                    </div>
                  </div>

                  {/* Shortlisted Candidates */}
                  {screeningResult.shortlisted?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Top Shortlisted Candidates ({screeningResult.shortlisted.length})
                      </h4>
                      <div className="space-y-2">
                        {screeningResult.shortlisted.map((cand) => (
                          <div
                            key={cand.application_id}
                            className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-display font-black text-xs text-slate-900 dark:text-white">
                                {cand.candidate_name}
                              </span>
                              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-black px-2 py-0.5">
                                ATS Score: {cand.score}% • Rank #{cand.rank}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                              Role: {cand.role_title} • {cand.degree} • CGPA: {cand.cgpa}
                            </div>
                            {cand.match_strengths?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {cand.match_strengths.map((str, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] font-bold bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200"
                                  >
                                    ✓ {str}
                                  </span>
                                ))}
                              </div>
                            )}
                            {cand.interview_date && (
                              <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 bg-white dark:bg-slate-800 p-2 rounded-xl">
                                <Calendar className="h-3 w-3" />
                                <span>Interview Scheduled: {cand.interview_date}</span>
                                {cand.meeting_link && (
                                  <a
                                    href={cand.meeting_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline ml-1"
                                  >
                                    Join Meet
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rejected Candidates With Feedback */}
                  {screeningResult.rejected?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-rose-700 dark:text-rose-400 tracking-wider flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5" />
                        Not Selected Candidates (Constructive Feedback Synced to Student Dashboards)
                      </h4>
                      <div className="space-y-2">
                        {screeningResult.rejected.map((cand) => (
                          <div
                            key={cand.application_id}
                            className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-display font-black text-xs text-slate-900 dark:text-white">
                                {cand.candidate_name}
                              </span>
                              <span className="rounded-full bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[10px] font-black px-2 py-0.5">
                                ATS Score: {cand.score}% • Rank #{cand.rank}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                              Role: {cand.role_title} • {cand.degree}
                            </div>

                            {/* Constructive Rejection Feedback */}
                            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 border border-rose-100 dark:border-rose-900">
                              <strong className="text-rose-900 dark:text-rose-200">Constructive Feedback: </strong>
                              {cand.rejection_feedback}
                            </div>

                            {/* Missing Skills */}
                            {cand.missing_skills?.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-500">Missing Key Skills:</span>
                                <div className="flex flex-wrap gap-1">
                                  {cand.missing_skills.map((ms, i) => (
                                    <span
                                      key={i}
                                      className="text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 px-1.5 py-0.5 rounded"
                                    >
                                      ✗ {ms}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Improvement Guidance Tips */}
                            {cand.improvement_tips?.length > 0 && (
                              <ul className="list-disc list-inside text-[10px] text-slate-600 dark:text-slate-400 space-y-0.5">
                                {cand.improvement_tips.map((tip, i) => (
                                  <li key={i}>{tip}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowAiScreenerModal(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleRunAiScreener}
                disabled={screeningRunning}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-2 text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {screeningRunning ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Evaluating Applications & Generating Feedback...</span>
                  </>
                ) : (
                  <>
                    <Bot className="h-3.5 w-3.5" />
                    <span>{screeningResult ? "Re-Run AI Screener" : "Run AI Screener Now"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: STATUS & PROCESS UPDATER */}
      {/* ============================================================== */}
      {statusModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-display text-base font-black text-slate-900 dark:text-white">
                  Update Candidate Application Process
                </h3>
                <p className="text-[11px] font-semibold text-slate-500">
                  Candidate: {statusModalApp.candidate_name} • Role: {statusModalApp.title}
                </p>
              </div>
              <button
                onClick={() => setStatusModalApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Application Review Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="Application Submitted">Application Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted for Interview">Shortlisted for Interview</option>
                <option value="Technical Interview Scheduled">Technical Interview Scheduled</option>
                <option value="Selected / Offer Released">Selected / Offer Released</option>
                <option value="Not Selected">Not Selected</option>
              </select>
            </div>

            {/* Recruiter Evaluation Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Recruiter Evaluation Remarks & Feedback
              </label>
              <textarea
                rows={3}
                placeholder="Add feedback on resume, projects, or next steps (this is displayed directly to the candidate in their dashboard)..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Interview Date & Video Link (If Shortlisted) */}
            {(newStatus.toLowerCase().includes("interview") || newStatus.toLowerCase().includes("shortlist")) && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <div className="text-xs font-black text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                  Interview Scheduling Details
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Interview Date & Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-11-04 11:30 AM"
                    value={newInterviewDate}
                    onChange={(e) => setNewInterviewDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Meeting Link (Google Meet / Microsoft Teams)
                  </label>
                  <input
                    type="text"
                    placeholder="https://meet.google.com/pmis-interview"
                    value={newMeetingLink}
                    onChange={(e) => setNewMeetingLink(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setStatusModalApp(null)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={updatingStatus}
                className="rounded-xl bg-gradient-to-r from-[#0B2545] to-[#134074] text-white px-5 py-2 text-xs font-black shadow-sm hover:brightness-110 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {updatingStatus ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Save & Sync to Student Dashboard
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: INTERACTIVE CDN RESUME VIEWER */}
      {/* ============================================================== */}
      {resumeModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-base text-slate-900 dark:text-white">
                    {resumeModalApp.candidate_name || "Youth Candidate"}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 text-[10px] font-black border border-blue-200 dark:border-blue-800">
                    Verified Resume
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold truncate max-w-md">
                  {resumeModalApp.degree || "B.Tech"} • {resumeModalApp.college || "State University"} • Applied for: {resumeModalApp.title}
                </p>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={getCdnResumeUrl(resumeModalApp.resume_url)}
                  target="_blank"
                  rel="noreferrer"
                  download={resumeModalApp.resume_name || "candidate_resume.pdf"}
                  className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition flex items-center gap-1 shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
                <a
                  href={getCdnResumeUrl(resumeModalApp.resume_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-blue-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1 shadow-2xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open in New Tab</span>
                </a>
                <button
                  onClick={() => setResumeModalApp(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Document URL Indicator Strip */}
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center justify-between gap-2 overflow-hidden">
              <span className="truncate">
                <span className="font-bold text-slate-400 mr-1.5">Document URL:</span>
                {getCdnResumeUrl(resumeModalApp.resume_url)}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 shrink-0">
                ● Verified Document
              </span>
            </div>

            {/* Resume PDF Viewer (iFrame / Embed) */}
            <div className="flex-1 bg-slate-200 dark:bg-slate-950 p-2 overflow-hidden relative">
              <iframe
                src={getCdnResumeUrl(resumeModalApp.resume_url)}
                title="Candidate PDF Resume"
                className="w-full h-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white"
              />
            </div>

            {/* Modal Bottom Bar: Quick Status Actions */}
            <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-500">
                Candidate Extracted Skills:{" "}
                <span className="text-slate-800 dark:text-slate-200">
                  {Array.isArray(resumeModalApp.skills)
                    ? resumeModalApp.skills.join(", ")
                    : resumeModalApp.skills || "Python, Git, SQL"}
                </span>
              </div>
              <button
                onClick={() => {
                  const target = resumeModalApp;
                  setResumeModalApp(null);
                  openStatusModal(target);
                }}
                className="rounded-xl bg-orange-600 text-white px-4 py-2 text-xs font-black shadow-xs hover:bg-orange-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Proceed to Status Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: RECRUITER AUTHENTICATION & DEMO LOGIN */}
      {/* ============================================================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#0B2545] to-[#134074] text-white flex items-center justify-center shadow-xs">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-black text-slate-900 dark:text-white">
                    Corporate Recruiter Login
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Official PM Internship Scheme Talent Gateway
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Demo Recruiter Logins */}
            <div className="space-y-2">
              <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                Instant Demo Logins (1-Click Evaluation):
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PREMIER_DEMO_RECRUITERS.slice(0, 4).map((d) => (
                  <button
                    key={d.company_name}
                    type="button"
                    onClick={() => handleQuickDemoLogin(d)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-left transition flex items-center gap-2 cursor-pointer"
                  >
                    <CompanyLogo name={d.company_name} className="h-6 w-6 shrink-0" />
                    <div className="overflow-hidden">
                      <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {d.company_name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold truncate">
                        {d.recruiter_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
              <span className="bg-white dark:bg-slate-900 px-2 text-[10px] font-bold uppercase text-slate-400 absolute">
                Or Sign In With Work Email
              </span>
            </div>

            {authError && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/60 p-3 text-xs font-bold text-red-600 border border-red-200 dark:border-red-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Company Name *
                </label>
                <select
                  value={authCompany}
                  onChange={(e) => setAuthCompany(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="Tata Consultancy Services">Tata Consultancy Services</option>
                  <option value="Tata Motors">Tata Motors</option>
                  <option value="Larsen & Toubro">Larsen & Toubro</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="Sun Pharmaceutical Industries">Sun Pharmaceutical Industries</option>
                  <option value="Infosys">Infosys</option>
                  <option value="Reliance Industries">Reliance Industries</option>
                  <option value="Maruti Suzuki">Maruti Suzuki</option>
                  <option value="Wipro">Wipro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. recruiter@company.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#0B2545] to-[#134074] text-white py-2.5 text-xs font-black shadow-sm hover:brightness-110 transition cursor-pointer"
              >
                Sign In to Corporate Recruiter Portal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
