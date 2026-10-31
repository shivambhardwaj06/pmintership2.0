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
  { title: "Automotive & EV Engineering Intern", sector: "Automotive & Electric Vehicles", icon: Briefcase },
  { title: "Corporate Finance & Banking Operations Intern", sector: "Banking & Financial Services", icon: TrendingUp },
  { title: "Civil Site & Infrastructure Planning Intern", sector: "Infrastructure & Construction", icon: Layers },
  { title: "Pharmaceutical Quality Assurance Intern", sector: "Pharmaceuticals & Healthcare", icon: Award },
  { title: "Renewable Energy & Solar Project Intern", sector: "Oil, Gas & Energy", icon: Award },
  { title: "Software & Digital Systems Intern", sector: "IT & Software Development", icon: Cpu },
  { title: "Supply Chain & Logistics Operations Intern", sector: "Supply Chain & Retail", icon: Compass },
  { title: "Data Analyst & Business Intelligence Intern", sector: "Analytics & Management", icon: TrendingUp },
  { title: "VLSI & Semiconductor Verification Intern", sector: "Semiconductor & Electronics", icon: Cpu },
  { title: "Mechanical Design & Manufacturing Intern", sector: "Manufacturing & Heavy Industries", icon: Briefcase },
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

// Fallback robust templates matching diverse engineering, manufacturing, business, healthcare, and tech sectors
const FALLBACK_ROADMAPS = {
  automotive: {
    target_role: "Automotive & EV Engineering Intern",
    target_sector: "Automotive & Electric Vehicles",
    academic_level: "Pre-Final Year (3rd Year)",
    pace: "12-Week Comprehensive",
    estimated_hours_per_week: "10-12 hrs/week",
    summary:
      "A structured 12-week roadmap designed to take you from 3D CAD modeling and vehicle dynamics to structural FEA simulation, electric powertrain design, and clearing technical rounds at Tata Motors, Maruti Suzuki, and Mahindra.",
    key_competencies_mastered: [
      "SolidWorks & AutoCAD Parametric 3D CAD",
      "Geometric Dimensioning & Tolerancing (GD&T)",
      "ANSYS Mechanical FEA Stress & Modal Analysis",
      "EV Battery Thermal & Powertrain Basics",
      "Shop-floor Quality Standards (Six Sigma, DFMEA)",
      "STAR Interview Method & CAD Portfolio Defense",
    ],
    phases: [
      {
        phase_number: 1,
        title: "Phase 1: 3D CAD Modeling & Tolerancing Standards",
        weeks: "Weeks 1 - 3",
        goal: "Master parametric mechanical part design, 2D drafting standards, and GD&T principles.",
        milestones: [
          "Complete 40+ complex part and assembly models in SolidWorks or AutoCAD complying with ISO/ASME standards.",
          "Master Geometric Dimensioning & Tolerancing (GD&T): datums, runout, true position, and surface flatness.",
          "Review vehicle dynamics fundamentals: suspension kinematics, steering geometry, and braking torque.",
          "Build a digital CAD portfolio link (GrabCAD / cloud folder) highlighting 3D exploded assembly renders.",
        ],
        recommended_tools: ["SolidWorks", "AutoCAD", "MATLAB", "GrabCAD"],
        free_resources: [
          { name: "SolidWorks Official Tutorials", url: "https://www.solidworks.com" },
          { name: "NPTEL Strength of Materials (IIT Kharagpur)", url: "https://nptel.ac.in" },
          { name: "SAE India Engineering Lecture Series", url: "https://saeindia.org" },
        ],
      },
      {
        phase_number: 2,
        title: "Phase 2: FEA Structural Simulation & Manufacturing Drawings",
        weeks: "Weeks 4 - 7",
        goal: "Perform structural stress calculations and produce production-ready manufacturing blueprints.",
        milestones: [
          "Run linear static stress, modal, and fatigue simulations in ANSYS Mechanical with mesh convergence checks.",
          "Design an automotive subsystem (e.g., control arm, chassis bracket, or reduction gearbox) with factor of safety >= 1.5.",
          "Specify sheet metal fabrication tolerances, weldment callouts, and CNC machining parameters.",
          "Create complete 2D manufacturing drawings with detailed Bill of Materials (BOM) and revision blocks.",
        ],
        recommended_tools: ["ANSYS Mechanical", "SolidWorks Simulation", "Excel Engineering Calculators"],
        free_resources: [
          { name: "Cornell Ansys FEA Free SimCafe", url: "https://confluence.cornell.edu" },
          { name: "MIT OpenCourseWare Machine Design", url: "https://ocw.mit.edu" },
        ],
      },
      {
        phase_number: 3,
        title: "Phase 3: EV Powertrains & Industrial Quality Systems",
        weeks: "Weeks 8 - 10",
        goal: "Equip yourself with high-demand Electric Vehicle (EV) systems and Lean manufacturing competencies.",
        milestones: [
          "Study EV battery pack structural enclosures, thermal management circuits, and regenerative braking.",
          "Apply Design for Manufacturing and Assembly (DFMA) and Failure Mode & Effect Analysis (DFMEA).",
          "Complete a Lean Six Sigma project analyzing plant cycle time reduction and scrap minimization.",
          "Review plant safety standards (OSHA / ISO 45001) and automotive supply chain traceability.",
        ],
        recommended_tools: ["MATLAB Simulink", "FMEA Quality Matrices", "Excel Statistical Sheets"],
        free_resources: [
          { name: "EV Powertrain Fundamentals (NPTEL)", url: "https://nptel.ac.in" },
          { name: "Lean Six Sigma Yellow Belt Overview", url: "https://www.coursera.org" },
        ],
      },
      {
        phase_number: 4,
        title: "Phase 4: CAD Defense & Automotive Corporate Selections",
        weeks: "Weeks 11 - 12",
        goal: "Refine your 1-page ATS resume with direct portfolio hyperlinks and clear automotive panel interviews.",
        milestones: [
          "Condense resume into strict 1-page layout with clickable CAD portfolio and FSAE/BAJA project metrics.",
          "Practice 10 mock technical interviews defending FEA mesh choices, material selections, and GD&T callouts.",
          "Prepare plant situational responses: explain how you handle assembly line bottlenecks and quality defects.",
          "Submit direct applications to top PMIS automotive leaders (Tata Motors, Maruti Suzuki, Mahindra, Hero MotoCorp).",
        ],
        recommended_tools: ["GrabCAD Portfolio", "PMIS Student Dashboard", "Mock Interview Prep"],
        free_resources: [
          { name: "Automotive Technical Interview Guide", url: "https://youtu.be/3CvKe1P30jA" },
          { name: "PM Internship Scheme MCA Portal", url: "https://pminternship.mca.gov.in" },
        ],
      },
    ],
  },
  finance: {
    target_role: "Corporate Finance & Banking Operations Intern",
    target_sector: "Banking & Financial Services",
    academic_level: "Pre-Final Year (3rd Year)",
    pace: "12-Week Comprehensive",
    estimated_hours_per_week: "10-12 hrs/week",
    summary:
      "A structured 12-week roadmap covering financial statement analysis, 3-statement financial modeling, credit risk assessment, and banking compliance for premier roles at HDFC Bank, ICICI Bank, and SBI.",
    key_competencies_mastered: [
      "Financial Statement Analysis (P&L, Balance Sheet, Cash Flow)",
      "Dynamic 3-Statement Financial Modeling in Excel",
      "Ratio Analysis, Working Capital & Credit Risk Assessment",
      "Retail & Corporate Banking Regulatory Norms (RBI, KYC, AML)",
      "Power BI Financial Dashboards & Reporting",
      "Corporate Banking STAR Technical Interviews",
    ],
    phases: [
      {
        phase_number: 1,
        title: "Phase 1: Financial Accounting & Advanced Spreadsheet Mastery",
        weeks: "Weeks 1 - 3",
        goal: "Build mathematical speed, dynamic Excel modeling fluency, and financial statement comprehension.",
        milestones: [
          "Master advanced Excel: INDEX-MATCH, XLOOKUP, dynamic arrays, nested IFs, and Goal Seek.",
          "Analyze 5 published annual reports of BSE/NSE-listed companies across different sectors.",
          "Calculate and interpret 25+ key financial ratios: Liquidity, Solvency, Turnover, and Profitability.",
          "Structure standard corporate balance sheet reconciliations and working capital tracking sheets.",
        ],
        recommended_tools: ["Advanced Excel", "TallyPrime", "Google Sheets", "BSE/NSE Annual Reports"],
        free_resources: [
          { name: "Corporate Finance Institute (CFI) Free Resources", url: "https://corporatefinanceinstitute.com" },
          { name: "Khan Academy Finance & Capital Markets", url: "https://www.khanacademy.org" },
        ],
      },
      {
        phase_number: 2,
        title: "Phase 2: 3-Statement Modeling & Credit Risk Evaluation",
        weeks: "Weeks 4 - 7",
        goal: "Construct integrated financial forecast models and assess corporate creditworthiness.",
        milestones: [
          "Project 1: Build a fully dynamic 3-statement financial model linking Income Statement, Balance Sheet, and Cash Flow.",
          "Project 2: Conduct credit appraisal of an SME borrower: debt-service coverage ratio (DSCR), collateral evaluation, and sensitivity tables.",
          "Model discounted cash flows (DCF) with weighted average cost of capital (WACC) calculations.",
          "Automate variance analysis comparing quarterly budgeted figures against actual disbursements.",
        ],
        recommended_tools: ["Microsoft Excel", "Financial Modeling Templates", "Statutory Ratio Sheets"],
        free_resources: [
          { name: "Aswath Damodaran Corporate Finance Online", url: "https://pages.stern.nyu.edu/~adamodar" },
          { name: "NPTEL Financial Accounting (IIT Bombay)", url: "https://nptel.ac.in" },
        ],
      },
      {
        phase_number: 3,
        title: "Phase 3: Banking Governance, KYC & Power BI Analytics",
        weeks: "Weeks 8 - 10",
        goal: "Gain mastery over retail banking operations, statutory compliance, and executive dashboards.",
        milestones: [
          "Study RBI master circulars on KYC norms, Anti-Money Laundering (AML), and NPA classifications.",
          "Build an interactive Power BI dashboard tracking loan portfolio quality, risk brackets, and regional branch disbursements.",
          "Understand retail asset products: Home Loans, Auto Loans, Working Capital Lines, and Letters of Credit.",
          "Review audit trail procedures, statutory banking inspection checklists, and fraud detection mechanisms.",
        ],
        recommended_tools: ["Power BI", "Excel Data Models", "RBI Master Circulars"],
        free_resources: [
          { name: "Reserve Bank of India (RBI) Official Bulletins", url: "https://rbi.org.in" },
          { name: "Microsoft Power BI Guided Learning", url: "https://learn.microsoft.com" },
        ],
      },
      {
        phase_number: 4,
        title: "Phase 4: Banking ATS Profile & Technical Interview Rounds",
        weeks: "Weeks 11 - 12",
        goal: "Condense accounting and finance projects into a strict 1-page resume and clear bank recruiter rounds.",
        milestones: [
          "Format resume into strict 1-page layout highlighting quantifiable financial modeling outcomes and certifications.",
          "Practice 10 mock interviews tackling cash flow adjustments, working capital shocks, and credit risk scenarios.",
          "Review macroeconomic indicators: Repo rate impacts, inflation indices, and current banking trends.",
          "Submit direct applications to top PMIS banking and financial institutions (HDFC Bank, State Bank of India, ICICI Bank, Axis Bank).",
        ],
        recommended_tools: ["ATS Resume Checker", "PMIS Student Dashboard", "Mock Finance Rounds"],
        free_resources: [
          { name: "Corporate Banking Interview Questions", url: "https://youtu.be/QBX7RkhuyCA" },
          { name: "PM Internship Scheme MCA Portal", url: "https://pminternship.mca.gov.in" },
        ],
      },
    ],
  },
  civil: {
    target_role: "Civil Site & Infrastructure Planning Intern",
    target_sector: "Infrastructure & Construction",
    academic_level: "Pre-Final Year (3rd Year)",
    pace: "12-Week Comprehensive",
    estimated_hours_per_week: "10-12 hrs/week",
    summary:
      "A structured 12-week roadmap covering structural drafting, IS 456 / IS 800 code compliance, Bar Bending Schedules (BBS), and site project scheduling for infrastructure roles at Larsen & Toubro, Tata Projects, and Afcons.",
    key_competencies_mastered: [
      "AutoCAD Civil 3D & Structural Drafting",
      "STAAD.Pro / ETABS Structural Modeling",
      "IS Code Compliance (IS 456 Concrete, IS 800 Steel)",
      "Bar Bending Schedule (BBS) & Quantity Surveying",
      "MS Project Construction Scheduling & Site Safety",
      "Infrastructure Site Management & STAR Interviews",
    ],
    phases: [
      {
        phase_number: 1,
        title: "Phase 1: Structural Drafting & Code Fundamentals",
        weeks: "Weeks 1 - 3",
        goal: "Master architectural drafting, structural plan reading, and national building code standards.",
        milestones: [
          "Draft 30+ detailed foundation, column, and beam reinforcement layouts in AutoCAD Civil 3D.",
          "Master Indian Standard structural design codes: IS 456:2000 (RCC) and IS 800:2007 (Steel).",
          "Study soil mechanics reports: bearing capacity calculations, settlement limits, and footing selections.",
          "Interpret complex site structural blueprints, elevation profiles, and cross-sectional details.",
        ],
        recommended_tools: ["AutoCAD Civil 3D", "IS 456 / IS 800 Codebooks", "Drafting Templates"],
        free_resources: [
          { name: "NPTEL Design of Reinforced Concrete Structures (IIT Kharagpur)", url: "https://nptel.ac.in" },
          { name: "Autodesk Civil 3D Free Student Guide", url: "https://autodesk.com/education" },
        ],
      },
      {
        phase_number: 2,
        title: "Phase 2: Structural Analysis & Quantity Surveying",
        weeks: "Weeks 4 - 7",
        goal: "Model framed structures under dead, live, and seismic loads, and compute material take-offs.",
        milestones: [
          "Project 1: Analyze a G+4 residential/commercial RCC building in STAAD.Pro or ETABS under IS 1893 seismic criteria.",
          "Project 2: Calculate complete structural quantity estimations: concrete volume, formwork area, and brickwork count.",
          "Generate comprehensive Bar Bending Schedules (BBS) for slabs, beams, and isolated footings in Excel.",
          "Perform slump tests, cube compressive strength evaluations, and sieve gradation analyses on paper.",
        ],
        recommended_tools: ["STAAD.Pro / ETABS", "Excel BBS Worksheets", "Quantity Surveying Sheets"],
        free_resources: [
          { name: "STAAD.Pro Official Learning Tutorials", url: "https://bentley.com" },
          { name: "CPWD Specifications & Measurement Standards", url: "https://cpwd.gov.in" },
        ],
      },
      {
        phase_number: 3,
        title: "Phase 3: Construction Project Scheduling & Site Safety",
        weeks: "Weeks 8 - 10",
        goal: "Master construction project milestones, equipment logistics, and site safety management.",
        milestones: [
          "Develop a Gantt chart project schedule with Critical Path Method (CPM) milestones in MS Project.",
          "Study plant equipment logistics: RMC batching plants, tower cranes, transit mixers, and concrete pumps.",
          "Complete safety checklist training: scaffolding inspection, excavation shoring, and PPE compliance.",
          "Learn Environmental Health and Safety (EHS) and green building certification norms (IGBC / GRIHA).",
        ],
        recommended_tools: ["MS Project / Primavera", "Site Safety Checklists", "BIM Viewer"],
        free_resources: [
          { name: "Construction Project Management (NPTEL)", url: "https://nptel.ac.in" },
          { name: "Indian Green Building Council (IGBC) Resources", url: "https://igbc.in" },
        ],
      },
      {
        phase_number: 4,
        title: "Phase 4: Site Portfolio & Infrastructure Selections",
        weeks: "Weeks 11 - 12",
        goal: "Present structural drawings in a digital portfolio and secure placements at premier infrastructure giants.",
        milestones: [
          "Compile a 1-page ATS resume featuring sample AutoCAD drawings and STAAD.Pro calculation summaries.",
          "Practice 10 mock interviews explaining bar detailing, mix design grades (M25/M30), and curing protocols.",
          "Prepare site case studies: discuss how you would address concrete honeycombing or project delays.",
          "Submit direct applications to top PMIS infrastructure developers (Larsen & Toubro, Tata Projects, Afcons Infrastructure).",
        ],
        recommended_tools: ["Drawing Portfolio Link", "PMIS Student Dashboard", "Mock Interview Prep"],
        free_resources: [
          { name: "L&T Civil Interview Preparation Insights", url: "https://youtu.be/QBX7RkhuyCA" },
          { name: "PM Internship Scheme MCA Portal", url: "https://pminternship.mca.gov.in" },
        ],
      },
    ],
  },
  pharma: {
    target_role: "Pharmaceutical Quality Assurance Intern",
    target_sector: "Pharmaceuticals & Healthcare",
    academic_level: "Pre-Final Year (3rd Year)",
    pace: "12-Week Comprehensive",
    estimated_hours_per_week: "10-12 hrs/week",
    summary:
      "A structured 12-week masterplan covering drug formulation, analytical chemistry instrumentation (HPLC, UV-Vis), cGMP compliance, and QA/QC documentation for top pharma leaders like Sun Pharma, Cipla, and Dr. Reddy's.",
    key_competencies_mastered: [
      "HPLC, UV-Vis Spectrophotometry & Dissolution Testing",
      "Good Manufacturing Practices (cGMP) & GLP Compliance",
      "Indian Pharmacopoeia (IP) & US FDA Regulatory Standards",
      "Standard Operating Procedure (SOP) Formulation & Audits",
      "Batch Manufacturing Records (BMR) & Stability Testing",
      "Pharmaceutical QA/QC Technical STAR Interviews",
    ],
    phases: [
      {
        phase_number: 1,
        title: "Phase 1: Analytical Chemistry & Lab Instrumentation",
        weeks: "Weeks 1 - 3",
        goal: "Master high-precision pharmaceutical analysis equipment, chemical assay principles, and lab safety.",
        milestones: [
          "Study High-Performance Liquid Chromatography (HPLC) instrumentation: pumps, columns, detectors, and mobile phases.",
          "Understand UV-Vis spectrophotometry principles: Beer-Lambert law, wavelength calibration, and standard curves.",
          "Review dissolution apparatus (Type I Basket & Type II Paddle) operation protocols and release rate curves.",
          "Master Good Laboratory Practices (GLP): volumetric calibration, analytical weighing, and reagent labeling.",
        ],
        recommended_tools: ["HPLC Simulators", "UV-Vis Calibration Sheets", "Lab ChemDraw", "IP / USP Standards"],
        free_resources: [
          { name: "NPTEL Industrial Pharmacy & Drug Delivery (IIT BHU)", url: "https://nptel.ac.in" },
          { name: "Indian Pharmacopoeia Commission Resources", url: "https://ipc.gov.in" },
        ],
      },
      {
        phase_number: 2,
        title: "Phase 2: Formulation R&D, Stability & Assay Testing",
        weeks: "Weeks 4 - 7",
        goal: "Conduct dosage formulation evaluations, stability protocols, and active pharmaceutical ingredient (API) assays.",
        milestones: [
          "Project 1: Develop a comprehensive quality assay protocol for a solid oral dosage tablet according to IP standards.",
          "Project 2: Design accelerated stability testing schedules (40°C / 75% RH) following ICH Q1A guidelines.",
          "Draft complete Batch Manufacturing Records (BMR) and Batch Packaging Records (BPR).",
          "Analyze physical parameters: tablet hardness, friability, disintegration time, and weight variation.",
        ],
        recommended_tools: ["Stability Matrix Sheets", "BMR Documentation Templates", "Excel Biostatistics"],
        free_resources: [
          { name: "ICH Official Quality Guidelines", url: "https://www.ich.org" },
          { name: "US FDA Good Manufacturing Practice Guidance", url: "https://www.fda.gov" },
        ],
      },
      {
        phase_number: 3,
        title: "Phase 3: cGMP Regulatory Compliance & Quality Audits",
        weeks: "Weeks 8 - 10",
        goal: "Master industrial regulatory compliance, cleanroom protocols, and pharmaceutical quality assurance.",
        milestones: [
          "Deep-dive into Current Good Manufacturing Practices (cGMP) guidelines (Schedule M and WHO-GMP).",
          "Draft Standard Operating Procedures (SOPs) for instrument operation, cleaning validation, and calibration.",
          "Understand cleanroom HVAC classifications (ISO Class 5 to 8) and microbial air sampling methods.",
          "Learn Out of Specification (OOS) and Out of Trend (OOT) root cause investigation frameworks.",
        ],
        recommended_tools: ["SOP Templates", "OOS Investigation Worksheets", "Cleanroom Protocols"],
        free_resources: [
          { name: "WHO Good Manufacturing Practices Guidelines", url: "https://who.int" },
          { name: "Pharmaguideline Regulatory QA Knowledgebase", url: "https://www.pharmaguideline.com" },
        ],
      },
      {
        phase_number: 4,
        title: "Phase 4: Pharma ATS Profile & Regulatory Interview Prep",
        weeks: "Weeks 11 - 12",
        goal: "Tailor your 1-page ATS resume with exact lab instrument keywords and clear corporate pharma interviews.",
        milestones: [
          "Condense resume into strict 1-page layout highlighting hands-on HPLC, UV, and cGMP compliance experience.",
          "Practice 10 mock technical interviews covering mobile phase preparation, retention times, and validation parameters.",
          "Review regulatory audit questions: explain handling of contamination, deviations, and documentation integrity (ALCOA+).",
          "Submit direct applications to top PMIS pharmaceutical corporations (Sun Pharma, Dr. Reddy's Laboratories, Cipla, Lupin).",
        ],
        recommended_tools: ["ATS Resume Checker", "PMIS Student Dashboard", "Mock Pharma Rounds"],
        free_resources: [
          { name: "Pharmaceutical Quality Interview Preparation", url: "https://youtu.be/QBX7RkhuyCA" },
          { name: "PM Internship Scheme MCA Portal", url: "https://pminternship.mca.gov.in" },
        ],
      },
    ],
  },
  software: {
    target_role: "Software & Digital Systems Intern",
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
          "Submit direct applications to top PMIS corporate partners (Maruti Suzuki, HDFC Bank, L&T, Sun Pharma, Tata Group).",
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
  const [selectedRole, setSelectedRole] = useState("Automotive & EV Engineering Intern");
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

      // Check if we have an explicit structured roadmap in FALLBACK_ROADMAPS first
      let templateKey = null;
      if (/auto|mech|vehicle|powertrain|cad|fea|manufacturing/i.test(target)) {
        templateKey = "automotive";
      } else if (/finan|bank|account|audit|tax|wealth|credit/i.test(target)) {
        templateKey = "finance";
      } else if (/civil|infra|construct|struct|survey|bim/i.test(target)) {
        templateKey = "civil";
      } else if (/pharma|drug|health|biochem|formulat|clinic/i.test(target)) {
        templateKey = "pharma";
      } else if (/software|developer|coding|web|full stack|cloud|it\b/i.test(target)) {
        templateKey = "software";
      }

      if (templateKey && FALLBACK_ROADMAPS[templateKey]) {
        const tmpl = JSON.parse(JSON.stringify(FALLBACK_ROADMAPS[templateKey]));
        tmpl.target_role = target;
        tmpl.pace = paceObj?.label || "12-Week Comprehensive";
        tmpl.estimated_hours_per_week = paceObj?.hours || "10-12 hrs/week";
        tmpl.academic_level = ACADEMIC_LEVELS.find((a) => a.id === selectedAcademic)?.label || tmpl.academic_level;
        tmpl.phases.forEach((p, idx) => {
          if (weekRanges[idx]) p.weeks = weekRanges[idx];
        });
        setRoadmap(tmpl);
        setSelectedRole(target);
        setCustomRoleInput("");
        return;
      }

      // General multi-sector fallback tailored to the candidate's target field
      let sectorTools = ["Domain Professional Suite", "MS Excel / Spreadsheets", "Technical Standards Codebook", "Project Collaboration Suite"];
      let sectorPartners = "Maruti Suzuki, HDFC Bank, Larsen & Toubro, Sun Pharma, Tata Group";
      if (/energy|solar|power|oil|gas/i.test(target)) {
        sectorTools = ["P&ID Modeling", "Energy Audit Software", "Excel Plant Sheets", "Safety Checklists"];
        sectorPartners = "Reliance Industries, NTPC, Adani Power, Indian Oil Corporation";
      } else if (/supply chain|logistics|retail/i.test(target)) {
        sectorTools = ["ERP Systems (SAP/Tally)", "Advanced Excel", "Warehouse Management Tools", "Inventory Metrics"];
        sectorPartners = "Flipkart, ITC Limited, Tata Consumer Products, Reliance Retail";
      } else if (/semiconductor|vlsi|electronics/i.test(target)) {
        sectorTools = ["Verilog / VHDL", "KiCad PCB Design", "MATLAB Simulink", "Oscilloscopes"];
        sectorPartners = "Tata Electronics, Bharat Electronics Limited (BEL), Schneider Electric";
      }

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
              `Set up the professional / analytical environment tailored to ${target}.`,
              "Master primary tool workflows, standard operating procedures, and industry protocols.",
              "Review 20+ real-world case studies and PMIS corporate job descriptions in this domain.",
              "Document foundational learnings in a structured technical notebook or digital portfolio.",
            ],
            recommended_tools: sectorTools,
            free_resources: [
              { name: "Official Documentation & Reference Guides", url: "https://pminternship.mca.gov.in" },
              { name: "NPTEL & Open Courseware Hub", url: "https://nptel.ac.in" },
            ],
          },
          {
            phase_number: 2,
            title: "Phase 2: Production Portfolio Projects",
            weeks: weekRanges[1],
            goal: "Build 2 high-impact, verifiable projects demonstrating end-to-end execution.",
            milestones: [
              `Project 1: Develop a comprehensive prototype or audit solving an industry problem in ${target}.`,
              "Project 2: Implement advanced quality checks, error limits, and measurable benchmarks.",
              "Document findings in a crisp 2-page executive summary or slide deck.",
              "Write a compelling technical case study detailing decision trade-offs and business impact.",
            ],
            recommended_tools: sectorTools,
            free_resources: [
              { name: "PM Internship Scheme MCA Portal", url: "https://pminternship.mca.gov.in" },
              { name: "Harvard Case & Action Method Guide", url: "https://careerservices.fas.harvard.edu" },
            ],
          },
          {
            phase_number: 3,
            title: "Phase 3: Industry Rigor & Quality Standards",
            weeks: weekRanges[2],
            goal: "Apply enterprise verification, quality benchmarks, and industry compliance.",
            milestones: [
              "Conduct peer reviews or audit against national industrial quality norms.",
              "Test edge cases, safety tolerances, and regulatory adherence.",
              "Participate in a corporate problem-solving sprint or professional workshop.",
              "Publish an insightful summary breaking down your project's methodology and results.",
            ],
            recommended_tools: ["Quality Audit Sheets", "Regulatory Guidelines", "Statistical Analysis"],
            free_resources: [
              { name: "National Quality Council Standards", url: "https://qcin.org" },
              { name: "PM Internship Scheme Portal", url: "https://pminternship.mca.gov.in" },
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
              "Practice 8 mock interview rounds using the STAR method for behavioral and domain questions.",
              `Submit PMIS applications to top corporate partners (${sectorPartners}).`,
            ],
            recommended_tools: ["ATS Checker", "PMIS Student Dashboard", "Mock Interview Prep"],
            free_resources: [
              { name: "Interview Round Strategies Guide", url: "https://youtu.be/QBX7RkhuyCA" },
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
                      {roadmap.target_sector || "PMIS Corporate Track"}
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
