import { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Target,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  Building,
  MapPin,
  ExternalLink,
} from "lucide-react";
import CompanyLogo from "./CompanyLogo";

const SECTORS_LIST = [
  "IT & Software Development",
  "Banking & Financial Services",
  "Oil, Gas & Energy",
  "Metals & Mining",
  "FMCG",
  "Telecommunications",
  "Infrastructure & Construction",
  "Retail & Consumer Durables",
  "Cement & Building Materials",
  "Automotive",
  "Pharmaceuticals",
  "Aviation & Defence",
  "Manufacturing & Industrial",
  "Chemical Industry",
  "Consulting Services",
  "Agriculture & Allied Industries",
  "Textile Manufacturing",
  "Travel & Hospitality",
  "Healthcare",
  "Mobility & Transportation",
  "Power & Utilities",
  "Logistics & Warehousing",
];

const SECTOR_REQUIREMENTS = {
  "IT & Software Development": {
    mustHave: ["Python or Java", "Git", "Data Structures", "Debugging", "Basic SQL"],
    goodToHave: ["FastAPI / Spring Boot", "Cloud Basics (AWS/Azure)", "REST APIs", "Unit Testing"],
    recommendations:
      "Build a deployed full-stack or API project with a public GitHub repo. Mention test coverage and API performance metrics on your CV.",
  },
  "Banking & Financial Services": {
    mustHave: ["Advanced Excel (VLOOKUP, Pivot Tables)", "Financial Analysis", "Attention to Detail", "Basic Accounting"],
    goodToHave: ["SQL", "Power BI / Tableau", "Financial Modeling", "KYC Regulatory Norms"],
    recommendations:
      "Earn a free NCFM or Bloomberg market concepts badge. Emphasize spreadsheet automation and audit-trail precision.",
  },
  "Automotive": {
    mustHave: ["AutoCAD or SolidWorks", "Engineering Drawings", "Thermodynamics / Mechanics", "Problem Solving"],
    goodToHave: ["EV Powertrain Basics", "MATLAB / Simulink", "Mechatronics", "Lean Manufacturing"],
    recommendations:
      "Highlight college Formula Student / BAJA or CAD portfolio with real dimensional drawings and assembly screenshots.",
  },
  "Infrastructure & Construction": {
    mustHave: ["AutoCAD Civil", "Site Documentation", "Drawing Interpretation", "Quality Basics"],
    goodToHave: ["MS Project", "Primavera P6", "Bar Bending Schedule (BBS)", "BIM Fundamentals"],
    recommendations:
      "Emphasize site safety certifications, quantity surveying projects, and material testing lab coursework.",
  },
  "Healthcare": {
    mustHave: ["Healthcare Operations", "Data Privacy & HIPAA", "Documentation", "Excel"],
    goodToHave: ["Hospital Information Systems (HIS)", "Biostatistics", "Public Health Research"],
    recommendations:
      "Highlight patient flow optimization case studies and data compliance awareness in clinical settings.",
  },
};

export default function StudentDashboard({ user, onOpenAuth, onNavigateToInternships }) {
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "applications" | "resumes" | "gap"
  const [profile, setProfile] = useState({
    branch: user?.branch || "Computer Science & Engineering",
    degree: "B.Tech / B.E.",
    college: "State Technical University",
    state: "Karnataka",
    career_goals: user?.career_goals || "Seeking an impactful 2026 internship in technology and software engineering.",
    skills: user?.skills?.length ? user.skills : ["Python", "Git", "SQL", "Excel", "Data Structures"],
    resume_name: user?.resume_name || "Arjun_Patel_CV_2026.pdf",
  });
  const [newSkill, setNewSkill] = useState("");
  const [saveMessage, setSaveMessage] = useState(false);
  const [targetSector, setTargetSector] = useState("IT & Software Development");

  // Load applications from localStorage or defaults
  const [applications, setApplications] = useState([
    {
      id: "APP-001",
      company: "Tata Consultancy Services",
      title: "Software Development Intern",
      sector: "IT & Software Development",
      stipend: "₹8,000–₹12,000/month",
      location: "Bengaluru, Karnataka (Hybrid)",
      date: "22 Oct 2026",
      status: "Shortlisted for Interview",
      badgeColor: "bg-green-100 text-green-800 border-green-200",
    },
    {
      id: "APP-002",
      company: "Maruti Suzuki",
      title: "Automotive Engineering Intern",
      sector: "Automotive",
      stipend: "₹8,000–₹12,000/month",
      location: "Bengaluru, Karnataka (Hybrid)",
      date: "23 Oct 2026",
      status: "Under Employer Review",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    },
  ]);

  const pastResumes = [
    {
      id: "res-1",
      role: "Software Development Intern",
      company: "Tata Consultancy Services (TCS)",
      sector: "IT & Software Development",
      candidate: "Priya S. (Selected Batch 2025)",
      branch: "B.Tech CSE (3rd Year) • CGPA 8.4",
      score: "96% Resume Match",
      reasons: [
        "Concise 1-page structure with clickable GitHub repository links.",
        "Demonstrated 2 live projects using Python, Git, and SQLite with quantified outcomes.",
        "Clear technical skills section matching TCS digital transformation requirements.",
      ],
      skills: ["Python", "FastAPI", "Git", "SQL", "Unit Testing", "Debugging"],
      expertTip: "Prioritize 3-4 core tools you actually used in projects rather than listing 20 languages.",
    },
    {
      id: "res-2",
      role: "Finance & Operations Intern",
      company: "HDFC Bank",
      sector: "Banking & Financial Services",
      candidate: "Aman V. (Selected Batch 2025)",
      branch: "B.Com Honours (2nd Year) • CGPA 8.1",
      score: "94% Resume Match",
      reasons: [
        "Showcased strong Excel mastery (VLOOKUP, Pivot Tables, financial modeling).",
        "Documented an empirical study on branch operational turnaround and customer wait times.",
        "Demonstrated compliance, KYC awareness, and professional communication.",
      ],
      skills: ["Advanced Excel", "Financial Reporting", "KYC Norms", "Data Analysis", "Communication"],
      expertTip: "Banking reviewers look for zero errors and verifiable numbers in your accomplishments.",
    },
    {
      id: "res-3",
      role: "Automotive Engineering Intern",
      company: "Tata Motors",
      sector: "Automotive",
      candidate: "Rohan D. (Selected Batch 2025)",
      branch: "B.E. Mechanical (Pre-Final Year) • CGPA 7.9",
      score: "92% Resume Match",
      reasons: [
        "Included portfolio link showing CAD assembly models in SolidWorks & AutoCAD.",
        "Hands-on experience with college Formula Student / BAJA suspension prototyping.",
        "Clear research statement on Electric Vehicle (EV) thermal management.",
      ],
      skills: ["SolidWorks", "AutoCAD", "Thermodynamics", "Manufacturing Basics", "EV Systems"],
      expertTip: "Provide a Google Drive or Portfolio link showing actual 3D renders or workshop photos.",
    },
    {
      id: "res-4",
      role: "Project Planning Intern",
      company: "Larsen & Toubro (L&T)",
      sector: "Infrastructure & Construction",
      candidate: "Ananya P. (Selected Batch 2025)",
      branch: "B.Tech Civil (Final Year) • CGPA 8.6",
      score: "95% Resume Match",
      reasons: [
        "Certified in MS Project & Primavera basics for project scheduling.",
        "Site inspection checklist knowledge, concrete slump testing, and quantity estimates.",
        "Strong safety mindset aligned with L&T corporate EHS policy.",
      ],
      skills: ["MS Project", "AutoCAD Civil", "Quantity Surveying", "Quality Control", "Site Safety"],
      expertTip: "Mentioning site safety regulations and drawing interpretation guarantees interview calls.",
    },
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 2000);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile({ ...profile, resume_name: file.name });
    }
  };

  // Skill gap calculation
  const reqData = SECTOR_REQUIREMENTS[targetSector] || SECTOR_REQUIREMENTS["IT & Software Development"];
  const matchedSkills = reqData.mustHave.filter((s) =>
    profile.skills.some((userSkill) => s.toLowerCase().includes(userSkill.toLowerCase()))
  );
  const missingSkills = reqData.mustHave.filter(
    (s) => !profile.skills.some((userSkill) => s.toLowerCase().includes(userSkill.toLowerCase()))
  );
  const matchPercentage = Math.round((matchedSkills.length / (reqData.mustHave.length || 1)) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Top Banner with Student Info */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-8 border border-border shadow-soft bg-gradient-to-r from-card to-secondary/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-saffron to-orange-600 text-white shadow-md font-display text-2xl font-black">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-primary">
                  {user?.name || "Candidate Dashboard"}
                </h1>
                <span className="rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-[11px] font-bold px-2.5 py-0.5 border border-green-300">
                  Verified Youth
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                User ID: <span className="font-semibold text-foreground">{user?.user_id || "PMIS-842910"}</span> • Mobile:{" "}
                <span className="font-semibold text-foreground">{user?.mobile || "9876543210"}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNavigateToInternships}
              className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-xs font-bold shadow-xs hover:bg-primary/90 transition"
            >
              <Briefcase className="h-4 w-4" /> Explore 120 Internships
            </button>
            <button
              onClick={() => setActiveTab("gap")}
              className="flex items-center gap-2 rounded-xl bg-saffron text-saffron-foreground px-4 py-2.5 text-xs font-bold shadow-xs hover:brightness-105 transition"
            >
              <Sparkles className="h-4 w-4" /> Find the Gap
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-t border-border/60 pt-5 mt-6 scrollbar-none">
          {[
            { id: "profile", label: "Profile & Career Goals", icon: User },
            { id: "applications", label: `My Applications (${applications.length})`, icon: Clock },
            { id: "resumes", label: "See Past Selected Resumes", icon: Award },
            { id: "gap", label: "Find the Gap (Skill Analyzer)", icon: Target },
          ].map((t) => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
                  isSel
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* TAB 1: PROFILE & CAREER GOALS */}
      {/* ================================================================ */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-border">
            <h2 className="font-display text-xl font-bold text-primary mb-1">
              Your Academic Profile & Career Aspirations
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Complete these details so top companies and PMIS selection algorithms can match you with verified internships.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Academic Branch / Specialization
                  </label>
                  <input
                    type="text"
                    value={profile.branch}
                    onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                    placeholder="e.g. Computer Science, Mechanical, Civil, Commerce"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Degree / Qualification
                  </label>
                  <select
                    value={profile.degree}
                    onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option>B.Tech / B.E.</option>
                    <option>Diploma / Polytechnic</option>
                    <option>B.Sc / BS-MS</option>
                    <option>B.Com / BBA</option>
                    <option>B.A. / B.Des</option>
                    <option>BCA / MCA</option>
                    <option>Postgraduate (M.Sc / M.A / MBA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Career Goals & Internship Preferences
                </label>
                <textarea
                  rows={3}
                  value={profile.career_goals}
                  onChange={(e) => setProfile({ ...profile, career_goals: e.target.value })}
                  placeholder="Describe what domain you want to work in, your dream projects, and what skills you wish to build..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Skills Tags */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Your Current Skills (Tools, Technologies, Soft Skills)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {profile.skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="hover:text-destructive text-primary/60"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    placeholder="Add a skill (e.g. AutoCAD, Python, Excel, Git) and press Add"
                    className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="rounded-xl bg-secondary px-3.5 py-2 text-xs font-bold text-secondary-foreground hover:bg-secondary/80"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {saveMessage ? (
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Profile saved successfully!
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Matches you with 120 top companies under PMIS.
                  </span>
                )}
                <button
                  type="submit"
                  className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-xs font-bold hover:bg-primary/90 transition shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>

          {/* Resume Upload Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-saffron" />
                <h3 className="font-display text-lg font-bold text-primary">Your Resume</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Upload your latest resume (PDF/DOCX) so companies can review your profile.
              </p>

              {/* Upload box */}
              <label className="border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-background/50 transition">
                <Upload className="h-8 w-8 text-primary/70 mb-2" />
                <span className="text-xs font-bold text-foreground">Click or Drag to Upload Resume</span>
                <span className="text-[11px] text-muted-foreground mt-0.5">PDF or Word (Max 5MB)</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>

              {profile.resume_name && (
                <div className="mt-4 rounded-xl bg-muted/60 border border-border p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs font-medium text-foreground truncate">
                      {profile.resume_name}
                    </span>
                  </div>
                  <span className="rounded bg-green-500/10 text-green-700 text-[10px] font-bold px-2 py-0.5 border border-green-500/30">
                    Uploaded
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setActiveTab("resumes")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary/80 hover:bg-secondary text-primary font-bold text-xs py-2.5 transition"
              >
                <Award className="h-4 w-4 text-saffron" /> Compare with Selected Resumes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 2: MY APPLICATIONS */}
      {/* ================================================================ */}
      {activeTab === "applications" && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-primary">Your Applied Internships</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track your real-time application status across partner companies.
              </p>
            </div>
            <button
              onClick={onNavigateToInternships}
              className="flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold hover:bg-primary/90 transition w-fit"
            >
              Browse More Internships <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-primary/40"
              >
                <div className="flex items-center gap-4">
                  <CompanyLogo name={app.company} className="h-14 w-14 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-bold text-foreground">
                        {app.title}
                      </h3>
                      <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {app.sector}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground mt-0.5">
                      {app.company} • {app.location}
                    </p>
                    <p className="text-xs text-primary font-semibold mt-1">
                      Stipend: {app.stipend}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="text-right sm:text-right">
                    <span
                      className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${app.badgeColor}`}
                    >
                      {app.status}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-1">Applied on {app.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 3: SEE PAST SELECTED RESUMES (Highlighted Feature) */}
      {/* ================================================================ */}
      {activeTab === "resumes" && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-border bg-gradient-to-r from-amber-500/10 via-card to-secondary/30">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron text-white shadow-xs">
                <Award className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-extrabold text-primary">
                  See Past Selected Resumes & Winning Formats
                </h2>
                <p className="text-xs text-muted-foreground">
                  Anonymized resumes from students who successfully secured top PM & corporate internships. Learn what corporate recruiters look for!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastResumes.map((r) => (
              <div
                key={r.id}
                className="glass-panel rounded-3xl p-6 border border-border shadow-soft flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
                        {r.sector}
                      </span>
                      <h3 className="font-display text-lg font-bold text-foreground">{r.role}</h3>
                      <p className="text-xs font-semibold text-primary">{r.company}</p>
                    </div>
                    <span className="rounded-full bg-green-100 text-green-800 text-[11px] font-extrabold px-2.5 py-1 border border-green-300">
                      {r.score}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground pb-3 mb-3 border-b border-border/60">
                    Candidate: <strong className="text-foreground">{r.candidate}</strong> ({r.branch})
                  </p>

                  {/* Why it was selected */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Key Factors for Selection:
                    </p>
                    <ul className="text-xs space-y-1.5 text-foreground/85 pl-4 list-disc">
                      {r.reasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlighted Skills */}
                  <div className="mb-4">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Verified Skills Highlighted:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {r.skills.map((sk) => (
                        <span
                          key={sk}
                          className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground border border-border"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-saffron/10 border border-saffron/20 p-3 mt-2 text-xs text-saffron-foreground flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Recruiter Advice: </strong>
                    <span>{r.expertTip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 4: FIND THE GAP (AI Skill Gap Analyzer) */}
      {/* ================================================================ */}
      {activeTab === "gap" && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary/80 text-white shadow-xs">
              <Target className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">
                Find the Gap: AI Sector Skill Analyzer
              </h2>
              <p className="text-xs text-muted-foreground">
                Compare your current skills against industry hiring criteria across 24 PMIS sectors.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-foreground mb-2">
              Select Your Target Internship Sector:
            </label>
            <select
              value={targetSector}
              onChange={(e) => setTargetSector(e.target.value)}
              className="w-full sm:w-80 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-semibold outline-none focus:border-primary"
            >
              {SECTORS_LIST.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Results Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Match Rate Card */}
            <div className="glass-panel rounded-2xl p-5 border border-border text-center flex flex-col items-center justify-center bg-card">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Sector Match Score
              </p>
              <div className="my-3 flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/5">
                <span className="font-display text-3xl font-black text-primary">
                  {matchPercentage}%
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground">
                {matchedSkills.length} of {reqData.mustHave.length} Core Requirements Met
              </p>
            </div>

            {/* Matched & Missing Skills */}
            <div className="md:col-span-2 glass-panel rounded-2xl p-5 border border-border bg-card space-y-4">
              <div>
                <p className="text-xs font-bold text-green-700 dark:text-green-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="h-4 w-4" /> Skills You Already Have:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.length > 0 ? (
                    matchedSkills.map((m) => (
                      <span
                        key={m}
                        className="rounded-lg bg-green-500/15 text-green-800 dark:text-green-300 px-2.5 py-1 text-xs font-semibold border border-green-500/30"
                      >
                        ✓ {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No exact matches found yet. Add your skills in the Profile tab!
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-4 w-4" /> The Gap (Skills to Learn / Highlight):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.length > 0 ? (
                    missingSkills.map((m) => (
                      <span
                        key={m}
                        className="rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2.5 py-1 text-xs font-semibold border border-amber-500/30"
                      >
                        + {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-green-600 font-semibold">
                      Awesome! You have met all basic core skills for this sector!
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs font-bold text-foreground mb-1">
                  💡 How to Bridge the Gap:
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {reqData.recommendations}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
