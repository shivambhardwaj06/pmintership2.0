import { useState, useEffect, useMemo, useRef } from "react";
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Circle,
  ExternalLink,
  Lock,
  LogIn,
  ArrowRight,
  BookOpen,
  Wrench,
  Award,
  Calendar,
  Layers,
  Printer,
  RotateCcw,
  Search,
  Check,
  Briefcase,
  TrendingUp,
  Cpu,
  GraduationCap,
  Clock,
  ChevronRight,
  FileText,
} from "lucide-react";
import internshipsData from "@/data/internships.json";

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, "");

// Popular PMIS target role suggestions
const POPULAR_ROLES = [
  { title: "Software Development Intern", sector: "IT & Software Development", icon: Cpu },
  { title: "Data Analyst & Business Intelligence Intern", sector: "IT & Analytics", icon: TrendingUp },
  { title: "AI & Machine Learning Research Intern", sector: "IT & Artificial Intelligence", icon: Sparkles },
  { title: "Automotive Engineering Intern", sector: "Automotive & Electric Vehicles", icon: Briefcase },
  { title: "Renewable Energy & Solar Project Intern", sector: "Oil, Gas & Energy", icon: Award },
  { title: "Corporate Finance & Equity Research Intern", sector: "Banking & Financial Services", icon: TrendingUp },
  { title: "Civil Site & Infrastructure Planning Intern", sector: "Infrastructure & Construction", icon: Layers },
  { title: "VLSI & Semiconductor Verification Intern", sector: "Semiconductor & Electronics", icon: Cpu },
  { title: "Supply Chain & Logistics Operations Intern", sector: "Supply Chain & Retail", icon: Compass },
  { title: "Pharmaceutical Quality Assurance Intern", sector: "Pharmaceuticals & Healthcare", icon: Award },
];

const ACADEMIC_LEVELS = [
  { id: "pre_final", label: "Pre-Final Year (3rd Year - Internship Focus)", defaultPace: "12-Week Comprehensive" },
  { id: "final_year", label: "Final Year / Graduate (Placement Focus)", defaultPace: "8-Week Fast-Track Sprint" },
  { id: "early_stage", label: "1st / 2nd Year (Explorer & Skill Builder)", defaultPace: "16-Week Deep Mastery" },
];

const PACES = [
  { id: "8-week", label: "8-Week Sprint", hours: "14-16 hrs/wk", intensity: "Intensive" },
  { id: "12-week", label: "12-Week Comprehensive", hours: "10-12 hrs/wk", intensity: "Recommended" },
  { id: "16-week", label: "16-Week Deep Mastery", hours: "6-8 hrs/wk", intensity: "Steady & Thorough" },
];

// Fallback robust templates matching various engineering, business, and tech sectors
const FALLBACK_ROADMAPS = {
  software: {
    target_role: "Software Development Intern",
    target_sector: "IT & Software Development",
    academic_level: "Pre-Final Year (3rd Year)",
    pace: "12-Week Comprehensive",
    estimated_hours_per_week: "10-12 hrs/week",
    summary:
      "A structured 12-week masterplan designed to take you from core programming fundamentals to deploying enterprise-grade full-stack web applications and clearing corporate PMIS technical evaluations.",
    key_competencies_mastered: [
      "Modern TypeScript & Python 3.12",
      "Production RESTful API Architecture",
      "PostgreSQL Relational Modeling & Indexing",
      "Docker Containerization & CI/CD",
      "DSA Problem Solving (Arrays, Graphs, DP)",
      "STAR Interview Method & System Architecture",
    ],
    phases: [
      {
        phase_number: 1,
        title: "Phase 1: Core Foundation & Tool Stack Mastery",
        weeks: "Weeks 1 - 3",
        goal: "Build rock-solid fluency in modern languages, Git source control, and data structure primitives.",
        milestones: [
          "Master modern syntax, async/await, and type safety (TypeScript ES6+ or Python 3.12).",
          "Configure Git workflows: semantic commits, PR templates, and branching strategies.",
          "Solve 45+ medium LeetCode/HackerRank problems (Arrays, Two Pointers, HashMaps, Sliding Window).",
          "Deep-dive into HTTP protocols: RESTful status codes, CORS headers, JSON serialization.",
        ],
        recommended_tools: ["VS Code", "Git & GitHub", "Python 3.12", "Postman", "PostgreSQL"],
        free_resources: [
          { name: "MDN Web Docs (JavaScript & HTTP)", url: "https://developer.mozilla.org" },
          { name: "NeetCode DSA Roadmap (Free 150)", url: "https://neetcode.io" },
          { name: "Python Official Documentation", url: "https://docs.python.org" },
        ],
      },
      {
        phase_number: 2,
        title: "Phase 2: Production Projects & Full-Stack Architecture",
        weeks: "Weeks 4 - 7",
        goal: "Architect and deploy 2 live production web applications with database migrations and public GitHub repos.",
        milestones: [
          "Project 1: Develop an authenticated REST API (FastAPI/Node.js) with JWT auth, Postgres schemas, and Redis caching.",
          "Project 2: Build a responsive client interface (React + Tailwind CSS) with robust API state management.",
          "Containerize both applications using multi-stage Dockerfiles and deploy live on Render or Vercel.",
          "Write clear README documentation with architectural system diagrams and live demo URLs.",
        ],
        recommended_tools: ["React", "FastAPI / Node.js", "PostgreSQL", "Docker", "Vercel / Render"],
        free_resources: [
          { name: "Full Stack Open (University of Helsinki)", url: "https://fullstackopen.com" },
          { name: "FastAPI Official Interactive Tutorial", url: "https://fastapi.tiangolo.com" },
          { name: "Docker Getting Started Guide", url: "https://docs.docker.com/get-started" },
        ],
      },
      {
        phase_number: 3,
        title: "Phase 3: Industry Testing & Cloud Standards",
        weeks: "Weeks 8 - 10",
        goal: "Integrate unit testing, cloud storage, and database indexing matching corporate IT team expectations.",
        milestones: [
          "Write automated unit & integration test suites (pytest or Jest) achieving >80% coverage.",
          "Integrate AWS S3 object storage or Supabase cloud backend for file handling and media.",
          "Profile SQL queries using EXPLAIN ANALYZE, adding b-tree indexes to optimize slow endpoints.",
          "Configure GitHub Actions to execute automated linting, test suites, and build checks on pull requests.",
        ],
        recommended_tools: ["pytest / Jest", "AWS Free Tier", "Redis", "GitHub Actions"],
        free_resources: [
          { name: "AWS Cloud Practitioner Free Essentials", url: "https://aws.amazon.com/training" },
          { name: "PostgreSQL Tutorial & Query Optimization", url: "https://www.postgresqltutorial.com" },
          { name: "GitHub Actions Official Docs", url: "https://docs.github.com/en/actions" },
        ],
      },
      {
        phase_number: 4,
        title: "Phase 4: ATS Resume & Corporate Interview Mastery",
        weeks: "Weeks 11 - 12",
        goal: "Perfect your corporate PMIS application package and clear behavioral and system design interview rounds.",
        milestones: [
          "Condense resume into strict 1-page single-column ATS layout with measurable metrics (e.g. 'Reduced latency 35%').",
          "Practice 10 mock technical interviews using the STAR method for past project challenges.",
          "Prepare system architecture breakdowns: explain database trade-offs, caching, and auth tokens.",
          "Submit direct applications to top PMIS technology partners (TCS, Infosys, Wipro, Google, HDFC).",
        ],
        recommended_tools: ["ATS Resume Checker", "LeetCode Mock Rounds", "PMIS Portal"],
        free_resources: [
          { name: "Interview Round Strategies (Kushal Vijay & Fraz)", url: "https://youtu.be/QBX7RkhuyCA" },
          { name: "PM Internship Scheme MCA Portal", url: "https://pminternship.mca.gov.in" },
          { name: "Harvard Resume & Action Verbs Guide", url: "https://careerservices.fas.harvard.edu" },
        ],
      },
    ],
  },
};

function getWeekRanges(paceId) {
  if (paceId === "8-week") {
    return ["Weeks 1 - 2", "Weeks 3 - 4", "Weeks 5 - 6", "Weeks 7 - 8"];
  } else if (paceId === "16-week") {
    return ["Weeks 1 - 4", "Weeks 5 - 8", "Weeks 9 - 12", "Weeks 13 - 16"];
  } else {
    return ["Weeks 1 - 3", "Weeks 4 - 7", "Weeks 8 - 10", "Weeks 11 - 12"];
  }
}

export default function FindYourPath({ user, onRequireAuth, onNavigateToExplore }) {
  const [selectedRole, setSelectedRole] = useState("Software Development Intern");
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [selectedAcademic, setSelectedAcademic] = useState("pre_final");
  const [selectedPace, setSelectedPace] = useState("12-week");
  const [isSearchingRole, setIsSearchingRole] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Start as null so previously generated/default roadmap is hidden until user generates plan
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const roadmapResultRef = useRef(null);

  // User milestone completion tracker in localStorage
  const [completedMilestones, setCompletedMilestones] = useState(() => {
    try {
      const storageKey = `pmis_roadmap_progress_${user?.user_id || "guest"}_${roadmap?.target_role || "default"}`;
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Unique titles from PMIS dataset
  const allPmisRoles = useMemo(() => {
    const set = new Set();
    internshipsData.forEach((item) => {
      if (item.title) set.add(item.title.trim());
    });
    return Array.from(set);
  }, []);

  // Filtered roles based on query
  const filteredRoles = useMemo(() => {
    if (!searchQuery) return allPmisRoles.slice(0, 15);
    const q = searchQuery.toLowerCase();
    return allPmisRoles.filter((r) => r.toLowerCase().includes(q)).slice(0, 15);
  }, [allPmisRoles, searchQuery]);

  // Sync completed milestones when roadmap or user changes
  useEffect(() => {
    try {
      const storageKey = `pmis_roadmap_progress_${user?.user_id || "guest"}_${roadmap?.target_role || "default"}`;
      const saved = localStorage.getItem(storageKey);
      setCompletedMilestones(saved ? JSON.parse(saved) : {});
    } catch {
      setCompletedMilestones({});
    }
  }, [roadmap?.target_role, user?.user_id]);

  const toggleMilestone = (phaseIdx, milestoneIdx) => {
    const key = `${phaseIdx}_${milestoneIdx}`;
    setCompletedMilestones((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        const storageKey = `pmis_roadmap_progress_${user?.user_id || "guest"}_${roadmap?.target_role || "default"}`;
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Milestone statistics
  const { totalMilestones, finishedMilestones, percentComplete } = useMemo(() => {
    if (!roadmap?.phases) return { totalMilestones: 0, finishedMilestones: 0, percentComplete: 0 };
    let total = 0;
    let finished = 0;
    roadmap.phases.forEach((p, pIdx) => {
      (p.milestones || []).forEach((_, mIdx) => {
        total++;
        if (completedMilestones[`${pIdx}_${mIdx}`]) finished++;
      });
    });
    const pct = total > 0 ? Math.round((finished / total) * 100) : 0;
    return { totalMilestones: total, finishedMilestones: finished, percentComplete: pct };
  }, [roadmap, completedMilestones]);

  // Generate Career Roadmap
  const handleGenerateRoadmap = async (roleToUse = null) => {
    if (!user) {
      onRequireAuth();
      return;
    }

    const target = (roleToUse || customRoleInput.trim() || selectedRole).trim();
    if (!target) return;

    setIsLoading(true);
    setErrorMsg(null);
    setGenerationStep("Analyzing target role & PMIS industry benchmarks...");

    try {
      setTimeout(() => setGenerationStep("Structuring 4-phase milestone curriculum..."), 800);
      setTimeout(() => setGenerationStep("Selecting curated free resources & production projects..."), 1600);

      const academicObj = ACADEMIC_LEVELS.find((a) => a.id === selectedAcademic);
      const paceObj = PACES.find((p) => p.id === selectedPace);
      const weekRanges = getWeekRanges(selectedPace);
      const totalWeeks = selectedPace === "8-week" ? 8 : selectedPace === "16-week" ? 16 : 12;

      const response = await fetch(`${BACKEND_URL}/api/career/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_role: target,
          target_sector: "Corporate Sector",
          academic_level: academicObj?.label || "Pre-Final Year (3rd Year)",
          pace: paceObj?.label || "12-Week Comprehensive",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data && data.phases && data.phases.length > 0) {
        // Enforce the chosen timeline weeks and pace metadata
        data.phases.forEach((p, idx) => {
          if (weekRanges[idx]) {
            p.weeks = weekRanges[idx];
          }
        });
        data.pace = paceObj?.label || data.pace;
        data.estimated_hours_per_week = paceObj?.hours || data.estimated_hours_per_week;
        setRoadmap(data);
        setSelectedRole(target);
        setCustomRoleInput("");
      } else {
        throw new Error("Invalid roadmap response structure");
      }
    } catch (err) {
      console.warn("AI Career Roadmap API failed or offline, using robust domain template:", err);
      const paceObj = PACES.find((p) => p.id === selectedPace);
      const weekRanges = getWeekRanges(selectedPace);
      const totalWeeks = selectedPace === "8-week" ? 8 : selectedPace === "16-week" ? 16 : 12;

      // Construct dynamic fallback with exact user-selected pace
      const fallback = {
        target_role: target,
        target_sector: "PM Internship Corporate Sector",
        academic_level: ACADEMIC_LEVELS.find((a) => a.id === selectedAcademic)?.label,
        pace: paceObj?.label || "12-Week Comprehensive",
        estimated_hours_per_week: paceObj?.hours || "10-12 hrs/week",
        summary: `Custom ${totalWeeks}-week career roadmap (${paceObj?.hours || "10-12 hrs/wk"}) specifically mapped for ${target}. Master foundational tools, construct verifiable production portfolio projects, and optimize your ATS profile for PM Internship Scheme corporate selections.`,
        key_competencies_mastered: [
          `${target} Core Competencies`,
          "Industry-standard Tool Stack",
          "Production Portfolio Projects",
          "ATS Resume Alignment",
          "STAR Method Technical Interviewing",
        ],
        phases: [
          {
            phase_number: 1,
            title: "Phase 1: Core Foundation & Tool Stack Mastery",
            weeks: weekRanges[0],
            goal: `Master core tools, standards, and domain workflows for ${target}.`,
            milestones: [
              `Set up the production development / analytical environment tailored to ${target}.`,
              "Master primary tool syntax, standard libraries, and workflow automation.",
              "Review 20+ real-world case studies and PMIS corporate job descriptions in this domain.",
              "Document foundational learnings in a dedicated GitHub repository or Notion portfolio.",
            ],
            recommended_tools: ["VS Code / Domain IDE", "Git", "PostgreSQL / Excel", "Postman / Figma"],
            free_resources: [
              { name: "Official Documentation & Reference Guides", url: "https://developer.mozilla.org" },
              { name: "FreeCodeCamp & Open Courseware", url: "https://www.freecodecamp.org" },
            ],
          },
          {
            phase_number: 2,
            title: "Phase 2: Production Portfolio Projects",
            weeks: weekRanges[1],
            goal: "Build 2 end-to-end, high-impact projects that demonstrate end-to-end execution.",
            milestones: [
              `Project 1: Develop a comprehensive prototype solving a real-world problem in ${target}.`,
              "Project 2: Implement advanced features, error boundaries, and performance benchmarks.",
              "Host project demo live or record a 2-minute video walkthrough on LinkedIn.",
              "Write a compelling technical case study detailing architecture decisions and trade-offs.",
            ],
            recommended_tools: ["GitHub", "Docker / Cloud Hosting", "Analytics Suite"],
            free_resources: [
              { name: "Full Stack Open / Open Source Guides", url: "https://fullstackopen.com" },
              { name: "GitHub Student Developer Pack", url: "https://education.github.com/pack" },
            ],
          },
          {
            phase_number: 3,
            title: "Phase 3: Industry Rigor & Quality Standards",
            weeks: weekRanges[2],
            goal: "Apply automated verification, enterprise quality benchmarks, and industry compliance.",
            milestones: [
              "Conduct code reviews or peer audits against enterprise best practices.",
              "Test edge cases, stress limits, and security vulnerabilities.",
              "Participate in a national level hackathon or open-source community sprint.",
              "Publish an insightful article or breakdown explaining your project's technical architecture.",
            ],
            recommended_tools: ["CI/CD Pipelines", "Automated Testing", "Performance Profilers"],
            free_resources: [
              { name: "AWS Free Tier & Cloud Architecture", url: "https://aws.amazon.com/training" },
              { name: "Google Developers Free Workshops", url: "https://developers.google.com" },
            ],
          },
          {
            phase_number: 4,
            title: "Phase 4: ATS Resume & Corporate Interview Mastery",
            weeks: weekRanges[3],
            goal: "Align your resume with PMIS top corporate evaluators and excel in interview rounds.",
            milestones: [
              `Target resume bullet points to mirror exact competencies of ${target}.`,
              "Run ATS compliance audit to ensure single-column clean parsing with actionable metrics.",
              "Practice 8 mock interview rounds using the STAR method for technical behavioral questions.",
              "Submit PMIS applications to top 500 partner companies actively recruiting in this role.",
            ],
            recommended_tools: ["ATS Checker", "PMIS Student Dashboard", "Mock Interview Prep"],
            free_resources: [
              { name: "Interview Round Strategies (Kushal Vijay & Fraz)", url: "https://youtu.be/QBX7RkhuyCA" },
              { name: "PM Internship Scheme MCA Portal", url: "https://pminternship.mca.gov.in" },
            ],
          },
        ],
      };
      setRoadmap(fallback);
      setSelectedRole(target);
    } finally {
      setIsLoading(false);
      setGenerationStep("");
      setTimeout(() => {
        roadmapResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  };

  const handlePrintRoadmap = () => {
    window.print();
  };

  return (
    <section id="find-your-path" className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 dark:from-indigo-500/15 dark:via-purple-500/15 dark:to-orange-500/10 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/60 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 shadow-2xs mb-4">
            <Compass className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
            <span>AI-Powered Career Navigator</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Find Your Path:{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
              AI Career Roadmap
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
            Stop guessing your next step. Select your dream corporate role from official PM Internship Scheme tracks, and let AI generate an actionable, week-by-week roadmap with real projects, tools, and curated free resources.
          </p>
        </div>

        {/* Interactive Configuration Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Role Selection & Search */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  1. Select Target Job / Role from PMIS Tracks
                </label>

                {/* Popular Pill Shortcuts */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {POPULAR_ROLES.slice(0, 6).map((r) => {
                    const isSelected = selectedRole === r.title;
                    return (
                      <button
                        key={r.title}
                        onClick={() => {
                          setSelectedRole(r.title);
                          setCustomRoleInput("");
                          setRoadmap(null);
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <r.icon className="h-3 w-3" />
                        <span>{r.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom / PMIS Roles Autocomplete Input */}
                <div className="relative">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={customRoleInput || (isSearchingRole ? searchQuery : selectedRole)}
                      onFocus={() => setIsSearchingRole(true)}
                      onChange={(e) => {
                        setCustomRoleInput(e.target.value);
                        setSearchQuery(e.target.value);
                        setIsSearchingRole(true);
                        setRoadmap(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setIsSearchingRole(false);
                        }
                      }}
                      placeholder="Or search among official PMIS roles (e.g. VLSI, Financial Analyst, Civil Site...)"
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-4 py-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  {/* Dropdown search suggestions */}
                  {isSearchingRole && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-2">
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        Official PMIS Roles ({filteredRoles.length})
                      </div>
                      {filteredRoles.map((roleName) => (
                        <button
                          key={roleName}
                          onClick={() => {
                            setSelectedRole(roleName);
                            setCustomRoleInput(roleName);
                            setIsSearchingRole(false);
                            setRoadmap(null);
                          }}
                          className="w-full text-left rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer flex items-center justify-between"
                        >
                          <span className="truncate">{roleName}</span>
                          <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                        </button>
                      ))}
                      <div className="pt-1 text-center">
                        <button
                          onClick={() => setIsSearchingRole(false)}
                          className="text-[11px] font-bold text-indigo-500 hover:underline py-1"
                        >
                          Done selecting
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Academic Level & Pace Configuration */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  2. Your Current Academic Stage
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {ACADEMIC_LEVELS.map((lvl) => {
                    const isSelected = selectedAcademic === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => {
                          setSelectedAcademic(lvl.id);
                          setRoadmap(null);
                        }}
                        className={`text-left rounded-xl px-3.5 py-2 text-xs font-bold border transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-900 dark:text-purple-200 shadow-xs"
                            : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="truncate">{lvl.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  3. Roadmap Timeline & Pace
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PACES.map((p) => {
                    const isSelected = selectedPace === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPace(p.id);
                          setRoadmap(null);
                        }}
                        className={`rounded-xl p-2.5 text-center border transition cursor-pointer ${
                          isSelected
                            ? "bg-orange-50 dark:bg-orange-950/50 border-orange-500 text-orange-900 dark:text-orange-200 shadow-xs"
                            : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="text-[11px] font-black truncate">{p.label}</div>
                        <div className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                          {p.hours}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Trigger Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleGenerateRoadmap()}
                  disabled={isLoading}
                  className="w-full sheen inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-500 text-white px-6 py-3.5 text-sm font-black shadow-lg shadow-indigo-500/25 hover:brightness-110 active:scale-98 transition cursor-pointer disabled:opacity-60"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isLoading ? "Generating with AI..." : "Generate AI Career Roadmap"}</span>
                </button>
                {isLoading && generationStep && (
                  <p className="mt-2 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
                    {generationStep}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder before generation */}
        {!roadmap && !isLoading && (
          <div className="rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-transparent dark:from-slate-900/40 dark:via-indigo-950/20 dark:to-transparent p-10 sm:p-14 text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
              <Compass className="h-8 w-8 animate-spin-slow" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Ready to Generate Your Personalized Roadmap
            </h3>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              Select your <strong>Target Job / Role</strong>, <strong>Academic Stage</strong>, and <strong>Roadmap Timeline & Pace</strong> ({PACES.find((p) => p.id === selectedPace)?.label || "Timeline"}) above, then click <strong>&quot;Generate AI Career Roadmap&quot;</strong> to generate your step-by-step curriculum.
            </p>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="rounded-3xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-white/80 dark:bg-slate-900/80 p-10 text-center animate-pulse space-y-4 mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600">
              <Sparkles className="h-7 w-7 animate-spin" />
            </div>
            <h4 className="font-display text-lg font-black text-slate-900 dark:text-white">
              AI is Architecting Your {PACES.find((p) => p.id === selectedPace)?.label || "Custom"} Roadmap...
            </h4>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {generationStep || "Analyzing role competencies and PMIS corporate hiring benchmarks..."}
            </p>
          </div>
        )}

        {/* Roadmap Display Section */}
        {roadmap && (
          <div ref={roadmapResultRef} className="relative">
            {/* Header Meta Card */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-slate-900/95 dark:via-slate-900/80 dark:to-slate-950 p-6 sm:p-8 shadow-lg mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 px-3 py-1 text-xs font-black">
                      <Cpu className="h-3.5 w-3.5" />
                      {roadmap.target_sector || "PMIS Technology Track"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300 px-3 py-1 text-xs font-black">
                      <Clock className="h-3.5 w-3.5" />
                      {roadmap.pace || "12-Week Track"} ({roadmap.estimated_hours_per_week || "10-12 hrs/wk"})
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {roadmap.target_role}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    {roadmap.summary}
                  </p>
                </div>

                {/* Progress Ring / Percentage Banner */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Roadmap Completion
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                      {percentComplete}%
                    </div>
                    <div className="text-[10px] font-bold text-slate-500">
                      {finishedMilestones} of {totalMilestones} Milestones Checked
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintRoadmap}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-2xs"
                      title="Print or Save PDF"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print / PDF</span>
                    </button>
                    {onNavigateToExplore && (
                      <button
                        onClick={onNavigateToExplore}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 text-xs font-bold transition cursor-pointer shadow-2xs"
                      >
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>View Matching PMIS Roles</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-4">
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 transition-all duration-500 ease-out"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>

              {/* Mastered Competencies Tags */}
              {roadmap.key_competencies_mastered && roadmap.key_competencies_mastered.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
                    Target Competencies:
                  </span>
                  {roadmap.key_competencies_mastered.map((comp, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-300"
                    >
                      ✓ {comp}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 4 Phases Timeline Grid */}
            <div className="space-y-6">
              {roadmap.phases.map((phase, phaseIdx) => {
                // If user is NOT logged in, show phase 1 as preview, lock phases 2, 3, 4
                const isGated = !user && phaseIdx > 0;

                return (
                  <div
                    key={phase.phase_number || phaseIdx}
                    className={`relative rounded-3xl border transition-all duration-200 ${
                      isGated
                        ? "border-slate-200/60 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden filter blur-[2px] opacity-60 select-none pointer-events-none"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-lg"
                    } p-6 sm:p-8`}
                  >
                    {/* Phase Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-sm shadow-sm">
                          0{phase.phase_number || phaseIdx + 1}
                        </span>
                        <div>
                          <h4 className="font-display text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                            {phase.title}
                          </h4>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {phase.goal}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 text-xs font-black self-start sm:self-center border border-slate-200 dark:border-slate-700">
                        <Calendar className="h-3 w-3 text-orange-500" />
                        {phase.weeks}
                      </span>
                    </div>

                    {/* Milestones Checklist */}
                    <div className="mt-6">
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Actionable Weekly Milestones
                      </h5>

                      <div className="space-y-2.5">
                        {(phase.milestones || []).map((milestone, mIdx) => {
                          const isChecked = !!completedMilestones[`${phaseIdx}_${mIdx}`];
                          return (
                            <div
                              key={mIdx}
                              onClick={() => !isGated && toggleMilestone(phaseIdx, mIdx)}
                              className={`flex items-start gap-3 rounded-2xl p-3.5 transition cursor-pointer border ${
                                isChecked
                                  ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200"
                                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <button
                                type="button"
                                className="mt-0.5 shrink-0 focus:outline-none"
                                aria-label="Toggle milestone"
                              >
                                {isChecked ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                                ) : (
                                  <Circle className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                                )}
                              </button>
                              <span
                                className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                                  isChecked ? "line-through opacity-70" : ""
                                }`}
                              >
                                {milestone}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tools & Free Resources Footer */}
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Recommended Tools */}
                      <div>
                        <h6 className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                          <Wrench className="h-3.5 w-3.5 text-indigo-500" />
                          Recommended Tools & Tech Stack
                        </h6>
                        <div className="flex flex-wrap gap-1.5">
                          {(phase.recommended_tools || []).map((tool, tIdx) => (
                            <span
                              key={tIdx}
                              className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Curated Free Resources */}
                      <div>
                        <h6 className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-orange-500" />
                          Curated Free Resources & Documentation
                        </h6>
                        <div className="space-y-1.5">
                          {(phase.free_resources || []).map((res, rIdx) => (
                            <a
                              key={rIdx}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline mr-4"
                            >
                              <span>{res.name}</span>
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gated Access Lock Overlay for Non-Logged-In Users */}
            {!user && (
              <div className="relative -mt-48 z-20 rounded-3xl border-2 border-dashed border-indigo-400 dark:border-indigo-700 bg-gradient-to-b from-indigo-50/90 via-white/98 to-purple-50/95 dark:from-slate-900/95 dark:via-slate-900/98 dark:to-slate-950/95 p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 mb-4 shadow-sm">
                  <Lock className="h-8 w-8" />
                </div>

                <h4 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                  Candidate Login Required to Unlock Full AI Career Roadmap
                </h4>

                <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                  Log in to generate tailored roadmaps for any official PM Internship Scheme role, check off weekly milestones, unlock verified free learning resources, and directly apply to matching corporate opportunities.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={onRequireAuth}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-500 text-white px-8 py-3.5 text-xs sm:text-sm font-black shadow-lg shadow-indigo-500/25 hover:brightness-110 active:scale-95 transition cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login / Register with 1 Click</span>
                  </button>
                </div>

                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-3">
                  Free for all Indian students • Quick Mobile OTP or Google Sign-In
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
