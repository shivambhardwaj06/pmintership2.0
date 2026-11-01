import json
import logging
import re
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.llm_client import NvidiaLLMClient

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/career", tags=["Career Roadmap"])

nvidia_llm = NvidiaLLMClient()


class CareerRoadmapRequest(BaseModel):
    target_role: str
    target_sector: Optional[str] = "Corporate Sector"
    current_skills: Optional[List[str]] = []
    academic_level: Optional[str] = "Pre-Final Year (3rd Year)"
    pace: Optional[str] = "12-Month Comprehensive (Master the Field)"


DOMAIN_ROADMAP_TEMPLATES = {
    "software": {
        "role_badge": "Information Technology & Software Engineering",
        "estimated_hours_per_week": "8-10 hrs/week",
        "phases": [
            {
                "phase_number": 1,
                "title": "Phase 1: Core Foundation & Tool Stack Mastery",
                "weeks": "Months 1 - 3 (Core Discipline & Standard Tool Stacks)",
                "goal": "Build unshakable fundamentals in modern languages, version control, and data structures.",
                "milestones": [
                    "Master modern language idioms (JavaScript/TypeScript ES6+ or Python 3.12).",
                    "Configure Git & GitHub workflow: feature branching, pull requests, semantic commit messages.",
                    "Solve 50+ medium LeetCode/HackerRank problems covering Arrays, HashMaps, and Two-Pointers.",
                    "Understand HTTP fundamentals: RESTful verbs, status codes, headers, and JSON serialization."
                ],
                "recommended_tools": ["VS Code", "Git", "Python/Node.js", "Postman", "PostgreSQL"],
                "free_resources": [
                    {"name": "MDN Web Docs (JavaScript & HTTP)", "url": "https://developer.mozilla.org"},
                    {"name": "NeetCode DSA Roadmap", "url": "https://neetcode.io"},
                    {"name": "Python Official Documentation", "url": "https://docs.python.org"}
                ]
            },
            {
                "phase_number": 2,
                "title": "Phase 2: Production Projects & Full-Stack Architecture",
                "weeks": "Months 4 - 6 (Enterprise Production Systems)",
                "goal": "Construct real-world SaaS applications with live deployments and public GitHub repositories.",
                "milestones": [
                    "Project 1: Build a secure RESTful API with authentication (JWT/OAuth), relational database (PostgreSQL with indexing), and Redis caching.",
                    "Project 2: Develop a responsive frontend (React / Next.js) with Tailwind CSS, connecting to your API with robust error boundaries.",
                    "Deploy both projects live on Render / Vercel with automated GitHub Actions CI/CD pipelines.",
                    "Document measurable outcomes in README (e.g. 'Reduced DB latency by 40%', 'Handles 500 req/sec')."
                ],
                "recommended_tools": ["React", "FastAPI / Node.js", "PostgreSQL", "Docker", "Vercel / Render"],
                "free_resources": [
                    {"name": "Full Stack Open (University of Helsinki)", "url": "https://fullstackopen.com"},
                    {"name": "FastAPI Official Tutorial", "url": "https://fastapi.tiangolo.com"},
                    {"name": "Docker Getting Started", "url": "https://docs.docker.com/get-started"}
                ]
            },
            {
                "phase_number": 3,
                "title": "Phase 3: Industry Testing & Next-Gen Technologies",
                "weeks": "Months 7 - 9 (Advanced Quality, Compliance & Next-Gen Tech)",
                "goal": "Validate enterprise competencies with industry testing standards and high-demand cloud/AI tooling.",
                "milestones": [
                    "Write automated unit and integration tests (pytest or Jest) achieving >80% code coverage.",
                    "Gain hands-on familiarity with cloud fundamentals: AWS S3, EC2, or Azure App Service.",
                    "Integrate modern LLM APIs or vector embeddings (Qdrant/FAISS) into a production workflow.",
                    "Optimize database schemas with foreign key constraints, connection pooling, and EXPLAIN ANALYZE."
                ],
                "recommended_tools": ["pytest / Jest", "AWS Free Tier", "Redis", "GitHub Actions", "Docker"],
                "free_resources": [
                    {"name": "AWS Cloud Practitioner Free Essentials", "url": "https://aws.amazon.com/training"},
                    {"name": "PostgreSQL Tutorial", "url": "https://www.postgresqltutorial.com"}
                ]
            },
            {
                "phase_number": 4,
                "title": "Phase 4: ATS Resume Optimization & Corporate Interview Mastery",
                "weeks": "Months 10 - 12 (Portfolio Defense & Placement Rounds)",
                "goal": "Align your profile with PM Internship Scheme corporate screeners and clear technical rounds.",
                "milestones": [
                    "Format resume into a structured ATS single-column layout with live demo URLs and GitHub links.",
                    "Practice 10 mock interviews using the STAR method (Situation, Task, Action, Result).",
                    "Prepare project architecture deep-dives: explain bottlenecks, trade-offs, and security choices.",
                    "Submit applications to top PMIS Corporate Technology roles (TCS, Infosys, Wipro, Google)."
                ],
                "recommended_tools": ["ATS Resume Checker", "LeetCode Mock Interview", "PMIS Portal"],
                "free_resources": [
                    {"name": "Microsoft Interview Breakdown (Fraz & Kushal Vijay)", "url": "https://youtu.be/QBX7RkhuyCA"},
                    {"name": "PM Internship Scheme Portal", "url": "https://pminternship.mca.gov.in"}
                ]
            }
        ]
    },
    "mechanical": {
        "role_badge": "Mechanical, Automotive & R&D Engineering",
        "estimated_hours_per_week": "10-12 hrs/week",
        "phases": [
            {
                "phase_number": 1,
                "title": "Phase 1: Engineering Fundamentals & 3D CAD Proficiency",
                "weeks": "Weeks 1 - 3",
                "goal": "Master parametric 3D CAD modeling, engineering drawing standards, and basic strength of materials.",
                "milestones": [
                    "Complete 50+ part and assembly models in SolidWorks or AutoCAD complying with ISO/ASME standards.",
                    "Master Geometric Dimensioning & Tolerancing (GD&T): datums, runout, true position, and flatness.",
                    "Review core thermodynamic cycles (Otto, Diesel, Rankine) and fluid mechanics calculations.",
                    "Build a 1-click cloud CAD portfolio (GrabCAD or Google Drive folder) showing 3D assembly renders."
                ],
                "recommended_tools": ["SolidWorks", "AutoCAD", "MATLAB", "GrabCAD"],
                "free_resources": [
                    {"name": "SolidWorks Official Tutorials", "url": "https://www.solidworks.com"},
                    {"name": "NPTEL Strength of Materials (IIT)", "url": "https://nptel.ac.in"}
                ]
            },
            {
                "phase_number": 2,
                "title": "Phase 2: Finite Element Analysis (FEA) & Fabrication",
                "weeks": "Weeks 4 - 7",
                "goal": "Apply simulation tools to quantify stress, deformation, and thermal distribution in mechanical assemblies.",
                "milestones": [
                    "Perform linear static stress and modal analysis using ANSYS Mechanical or SolidWorks Simulation.",
                    "Design a mechanical subsystem (e.g. suspension arm, gearbox, or thermal heat sink) with safety factor >= 1.5.",
                    "Document sheet metal fabrication allowances and CNC machining tolerances.",
                    "Create a detailed 2D engineering drawing blueprint with complete bill of materials (BOM)."
                ],
                "recommended_tools": ["ANSYS Workbench", "SolidWorks Simulation", "Excel Calculation Sheets"],
                "free_resources": [
                    {"name": "Cornell Ansys FEA Free SimCafe", "url": "https://confluence.cornell.edu"},
                    {"name": "MIT OpenCourseWare Machine Design", "url": "https://ocw.mit.edu"}
                ]
            },
            {
                "phase_number": 3,
                "title": "Phase 3: EV Powertrains & Industrial Quality Standards",
                "weeks": "Weeks 8 - 10",
                "goal": "Equip yourself with high-demand Electric Vehicle (EV) and Lean manufacturing competencies.",
                "milestones": [
                    "Study EV battery pack structural enclosures, thermal management, and regenerative braking.",
                    "Learn 5S, Six Sigma, and Root Cause Analysis (Fishbone & 5-Whys) methodologies.",
                    "Complete a project analyzing industrial failure modes (FMEA) for a critical rotating component.",
                    "Gain familiarity with shop-floor safety protocols (OSHA / ISO 45001)."
                ],
                "recommended_tools": ["MATLAB Simulink", "Quality Audit Sheets", "FMEA Matrix"],
                "free_resources": [
                    {"name": "EV Technology Crash Course (NPTEL)", "url": "https://nptel.ac.in"},
                    {"name": "Lean Six Sigma Fundamentals", "url": "https://www.coursera.org"}
                ]
            },
            {
                "phase_number": 4,
                "title": "Phase 4: Technical Defense & PMIS Application",
                "weeks": "Weeks 11 - 12",
                "goal": "Prepare drawing walkthroughs, defend FEA assumptions, and apply for core automotive internships.",
                "milestones": [
                    "Attach CAD portfolio hyperlink in the header of your PDF resume.",
                    "Practice answering technical drawing and tolerancing questions in simulated panel interviews.",
                    "Apply for top PMIS Automotive and Industrial roles (Tata Motors, Maruti Suzuki, BHEL).",
                    "Review shop-floor case scenarios and plant operations adaptability questions."
                ],
                "recommended_tools": ["GrabCAD Portfolio", "PMIS Portal"],
                "free_resources": [
                    {"name": "Mechanical Interview Preparation Guide", "url": "https://youtu.be/3CvKe1P30jA"},
                    {"name": "PM Internship Scheme Portal", "url": "https://pminternship.mca.gov.in"}
                ]
            }
        ]
    },
    "finance": {
        "role_badge": "Banking, Finance & Corporate Risk Management",
        "estimated_hours_per_week": "10-12 hrs/week",
        "phases": [
            {
                "phase_number": 1,
                "title": "Phase 1: Financial Accounting & Advanced Spreadsheet Modeling",
                "weeks": "Weeks 1 - 3",
                "goal": "Build mathematical speed, dynamic Excel modeling fluency, and financial statement comprehension.",
                "milestones": [
                    "Master dynamic Excel formulas: XLOOKUP, INDEX-MATCH, nested IFs, Goal Seek, and Data Tables.",
                    "Analyze annual reports and audited balance sheets of 5 major Indian banking and industrial corporations.",
                    "Calculate 25+ essential financial ratios: Current, Quick, Debt-to-Equity, Interest Coverage, ROE, and ROCE.",
                    "Build dynamic working capital and bank reconciliation schedules."
                ],
                "recommended_tools": ["Microsoft Excel", "TallyPrime", "BSE/NSE Annual Reports"],
                "free_resources": [
                    {"name": "Corporate Finance Institute Free Guides", "url": "https://corporatefinanceinstitute.com"},
                    {"name": "NPTEL Financial Accounting (IIT Bombay)", "url": "https://nptel.ac.in"}
                ]
            },
            {
                "phase_number": 2,
                "title": "Phase 2: 3-Statement Modeling & Credit Risk Appraisal",
                "weeks": "Weeks 4 - 7",
                "goal": "Construct integrated forecast models and assess borrower creditworthiness.",
                "milestones": [
                    "Build a dynamic 3-statement financial model linking Income Statement, Balance Sheet, and Cash Flow.",
                    "Conduct credit appraisal of corporate loan portfolios: DSCR calculations, collateral valuation, and sensitivity analysis.",
                    "Model discounted cash flows (DCF) with weighted average cost of capital (WACC) calculations.",
                    "Perform variance analysis comparing quarterly operating budgets against actual ledger disbursements."
                ],
                "recommended_tools": ["Financial Model Templates", "Excel What-If Analysis", "Ratio Sheets"],
                "free_resources": [
                    {"name": "Aswath Damodaran Corporate Valuation", "url": "https://pages.stern.nyu.edu/~adamodar"},
                    {"name": "Khan Academy Finance & Capital Markets", "url": "https://www.khanacademy.org"}
                ]
            },
            {
                "phase_number": 3,
                "title": "Phase 3: Banking Regulatory Norms & Power BI Reporting",
                "weeks": "Weeks 8 - 10",
                "goal": "Master banking operations, statutory compliance guidelines, and executive dashboards.",
                "milestones": [
                    "Study RBI guidelines on KYC, Anti-Money Laundering (AML), and Non-Performing Asset (NPA) provisioning.",
                    "Build an interactive Power BI dashboard tracking loan disbursement quality and delinquency risk buckets.",
                    "Review retail asset workflows: Retail credit scoring, Letter of Credit (LC) terms, and Bank Guarantees.",
                    "Gain familiarity with statutory banking audit checklists and treasury operations."
                ],
                "recommended_tools": ["Power BI", "Excel Data Models", "RBI Guidelines"],
                "free_resources": [
                    {"name": "Reserve Bank of India (RBI) Bulletins", "url": "https://rbi.org.in"},
                    {"name": "Microsoft Power BI Guided Training", "url": "https://learn.microsoft.com"}
                ]
            },
            {
                "phase_number": 4,
                "title": "Phase 4: Banking ATS Resume & Panel Interview Defense",
                "weeks": "Weeks 11 - 12",
                "goal": "Perfect a banking ATS profile and clear credit analysis interview rounds.",
                "milestones": [
                    "Highlight achievements with verified quantitative financial modeling metrics in an ATS-optimized format.",
                    "Practice 10 mock interviews tackling cash flow adjustments, working capital shocks, and credit risk scenarios.",
                    "Prepare macroeconomic analysis: Repo rate changes, inflation trends, and corporate lending dynamics.",
                    "Submit direct applications to top PMIS banking institutions (HDFC Bank, State Bank of India, ICICI Bank)."
                ],
                "recommended_tools": ["ATS Resume Checker", "PMIS Portal"],
                "free_resources": [
                    {"name": "Banking Interview Preparation Video", "url": "https://youtu.be/QBX7RkhuyCA"},
                    {"name": "PM Internship Scheme Portal", "url": "https://pminternship.mca.gov.in"}
                ]
            }
        ]
    },
    "civil": {
        "role_badge": "Civil Engineering & Heavy Infrastructure",
        "estimated_hours_per_week": "10-12 hrs/week",
        "phases": [
            {
                "phase_number": 1,
                "title": "Phase 1: Structural Drafting & IS Code Standards",
                "weeks": "Weeks 1 - 3",
                "goal": "Master structural drafting, architectural blueprint interpretation, and building codes.",
                "milestones": [
                    "Draft 30+ detailed foundation, beam, and column structural drawings in AutoCAD Civil 3D.",
                    "Study national structural standards: IS 456:2000 (Plain & Reinforced Concrete) and IS 800:2007 (Steel).",
                    "Understand soil bearing capacity test reports, standard penetration tests, and foundation selection.",
                    "Build a 1-click drawing portfolio link highlighting reinforcement details and building elevation sections."
                ],
                "recommended_tools": ["AutoCAD Civil 3D", "IS 456 / IS 800 Codes", "Drafting Templates"],
                "free_resources": [
                    {"name": "NPTEL Design of RCC Structures (IIT Kharagpur)", "url": "https://nptel.ac.in"},
                    {"name": "CPWD Specifications and Standards", "url": "https://cpwd.gov.in"}
                ]
            },
            {
                "phase_number": 2,
                "title": "Phase 2: Structural Analysis & Quantity Surveying",
                "weeks": "Weeks 4 - 7",
                "goal": "Analyze multi-story frames and calculate precise structural material takeoffs.",
                "milestones": [
                    "Analyze a G+4 framed building in STAAD.Pro or ETABS under dead, live, and IS 1893 seismic load combinations.",
                    "Compute complete quantity estimates: concrete volume, formwork area, and structural steel tonnage.",
                    "Prepare detailed Bar Bending Schedules (BBS) for continuous beams, columns, and raft footings in Excel.",
                    "Review concrete mix design calculations (M25/M30) following IS 10262 guidelines."
                ],
                "recommended_tools": ["STAAD.Pro / ETABS", "Excel BBS Worksheets", "Quantity Surveying Sheets"],
                "free_resources": [
                    {"name": "STAAD.Pro Official Tutorials", "url": "https://bentley.com"},
                    {"name": "Civil Engineering Project Estimations (NPTEL)", "url": "https://nptel.ac.in"}
                ]
            },
            {
                "phase_number": 3,
                "title": "Phase 3: Construction Scheduling & Site Safety (EHS)",
                "weeks": "Weeks 8 - 10",
                "goal": "Master construction milestone management, heavy equipment coordination, and safety norms.",
                "milestones": [
                    "Create construction baseline Gantt charts with Critical Path Method (CPM) milestones in MS Project.",
                    "Coordinate site equipment logistics: batching plants, transit mixers, boom placers, and tower cranes.",
                    "Implement Environmental Health & Safety (EHS) protocols: excavation shoring, scaffolding inspections, and PPE.",
                    "Review green building rating parameters under IGBC and GRIHA standards."
                ],
                "recommended_tools": ["MS Project", "Site Safety Checklists", "BIM Viewer"],
                "free_resources": [
                    {"name": "Construction Project Management (NPTEL)", "url": "https://nptel.ac.in"},
                    {"name": "Indian Green Building Council Standards", "url": "https://igbc.in"}
                ]
            },
            {
                "phase_number": 4,
                "title": "Phase 4: Site Portfolio Defense & Infrastructure Selections",
                "weeks": "Weeks 11 - 12",
                "goal": "Present structural blueprints and secure positions at premier infrastructure conglomerates.",
                "milestones": [
                    "Format an ATS-optimized resume with embedded link to CAD drawings and STAAD.Pro calculation summaries.",
                    "Practice answering technical structural detailing and concrete curing questions in mock interviews.",
                    "Prepare site situational responses: resolving concrete honeycombing, handling contractor delays, and material quality checks.",
                    "Submit direct applications to top PMIS infrastructure developers (Larsen & Toubro, Tata Projects, Afcons Infrastructure)."
                ],
                "recommended_tools": ["Drawing Portfolio", "PMIS Portal"],
                "free_resources": [
                    {"name": "L&T Infrastructure Interview Breakdown", "url": "https://youtu.be/QBX7RkhuyCA"},
                    {"name": "PM Internship Scheme Portal", "url": "https://pminternship.mca.gov.in"}
                ]
            }
        ]
    },
    "pharma": {
        "role_badge": "Pharmaceutical Sciences & Healthcare QA",
        "estimated_hours_per_week": "10-12 hrs/week",
        "phases": [
            {
                "phase_number": 1,
                "title": "Phase 1: Analytical Chemistry & Lab Instrumentation",
                "weeks": "Weeks 1 - 3",
                "goal": "Master high-precision pharmaceutical equipment, assay principles, and lab safety standards.",
                "milestones": [
                    "Study High-Performance Liquid Chromatography (HPLC) instrumentation: pumps, columns, detectors, and mobile phases.",
                    "Understand UV-Vis spectrophotometry principles: Beer-Lambert law, wavelength calibration, and standard curves.",
                    "Review dissolution apparatus (Type I Basket & Type II Paddle) operation protocols and release rate curves.",
                    "Master Good Laboratory Practices (GLP): volumetric calibration, analytical weighing, and reagent labeling."
                ],
                "recommended_tools": ["HPLC Simulators", "UV-Vis Calibration Sheets", "Lab ChemDraw", "IP / USP Standards"],
                "free_resources": [
                    {"name": "NPTEL Industrial Pharmacy & Drug Delivery", "url": "https://nptel.ac.in"},
                    {"name": "Indian Pharmacopoeia Commission Resources", "url": "https://ipc.gov.in"}
                ]
            },
            {
                "phase_number": 2,
                "title": "Phase 2: Formulation R&D, Stability & Assay Testing",
                "weeks": "Weeks 4 - 7",
                "goal": "Conduct dosage formulation evaluations, stability protocols, and active pharmaceutical ingredient (API) assays.",
                "milestones": [
                    "Develop a comprehensive quality assay protocol for a solid oral dosage tablet according to IP standards.",
                    "Design accelerated stability testing schedules (40°C / 75% RH) following ICH Q1A guidelines.",
                    "Draft complete Batch Manufacturing Records (BMR) and Batch Packaging Records (BPR).",
                    "Analyze physical parameters: tablet hardness, friability, disintegration time, and weight variation."
                ],
                "recommended_tools": ["Stability Matrix Sheets", "BMR Documentation Templates", "Excel Biostatistics"],
                "free_resources": [
                    {"name": "ICH Official Quality Guidelines", "url": "https://www.ich.org"},
                    {"name": "US FDA Good Manufacturing Practice Guidance", "url": "https://www.fda.gov"}
                ]
            },
            {
                "phase_number": 3,
                "title": "Phase 3: cGMP Regulatory Compliance & Quality Audits",
                "weeks": "Weeks 8 - 10",
                "goal": "Master industrial regulatory compliance, cleanroom protocols, and pharmaceutical quality assurance.",
                "milestones": [
                    "Deep-dive into Current Good Manufacturing Practices (cGMP) guidelines (Schedule M and WHO-GMP).",
                    "Draft Standard Operating Procedures (SOPs) for instrument operation, cleaning validation, and calibration.",
                    "Understand cleanroom HVAC classifications (ISO Class 5 to 8) and microbial air sampling methods.",
                    "Learn Out of Specification (OOS) and Out of Trend (OOT) root cause investigation frameworks."
                ],
                "recommended_tools": ["SOP Templates", "OOS Investigation Worksheets", "Cleanroom Protocols"],
                "free_resources": [
                    {"name": "WHO Good Manufacturing Practices Guidelines", "url": "https://who.int"},
                    {"name": "Pharmaguideline Regulatory QA Knowledgebase", "url": "https://www.pharmaguideline.com"}
                ]
            },
            {
                "phase_number": 4,
                "title": "Phase 4: Pharma ATS Profile & Regulatory Interview Prep",
                "weeks": "Weeks 11 - 12",
                "goal": "Tailor your ATS resume with exact lab instrument keywords and clear corporate pharma interviews.",
                "milestones": [
                    "Format resume into a structured ATS layout highlighting hands-on HPLC, UV, and cGMP compliance experience.",
                    "Practice 10 mock technical interviews covering mobile phase preparation, retention times, and validation parameters.",
                    "Review regulatory audit questions: explain handling of contamination, deviations, and documentation integrity (ALCOA+).",
                    "Submit direct applications to top PMIS pharmaceutical corporations (Sun Pharma, Dr. Reddy's Laboratories, Cipla, Lupin)."
                ],
                "recommended_tools": ["ATS Resume Checker", "PMIS Student Dashboard", "Mock Pharma Rounds"],
                "free_resources": [
                    {"name": "Pharmaceutical Quality Interview Preparation", "url": "https://youtu.be/QBX7RkhuyCA"},
                    {"name": "PM Internship Scheme MCA Portal", "url": "https://pminternship.mca.gov.in"}
                ]
            }
        ]
    }
}


def get_weeks_for_pace(pace: str) -> List[str]:
    """Dynamically returns month ranges corresponding to selected roadmap pace (6, 12, or 15 months)."""
    p = (pace or "").lower()
    if "6" in p:
        return [
            "Months 1 - 2 (Core Fundamentals & Essential Tools)",
            "Months 3 - 4 (Applied Internship Capstone & Execution)",
            "Month 5 (Corporate Quality Benchmarks & Production Practice)",
            "Month 6 (ATS Resume & PMIS Interview Ready)"
        ]
    elif "15" in p:
        return [
            "Months 1 - 4 (Comprehensive Architecture & Foundational Core)",
            "Months 5 - 8 (Production Deployment & Scaled Enterprise Workflows)",
            "Months 9 - 12 (Advanced & In-Demand Next-Gen Tech Specialization)",
            "Months 13 - 15 (Executive Engineering Leadership & Tier-1 Placement)"
        ]
    else:
        return [
            "Months 1 - 3 (Core Discipline & Standard Tool Stacks)",
            "Months 4 - 6 (Enterprise Production Systems & Architecture)",
            "Months 7 - 9 (Advanced Quality, Compliance & Cross-functional Workflows)",
            "Months 10 - 12 (Portfolio Defense, Corporate Mock Rounds & Offer Readiness)"
        ]


def _get_fallback_roadmap(role: str, sector: str, pace: str) -> Dict[str, Any]:
    """Generates an accurate, highly structured career roadmap based on domain keywords and pace."""
    r_lower = role.lower()
    template_key = "mechanical"
    if any(k in r_lower for k in ["finan", "bank", "account", "audit", "tax", "wealth", "credit"]):
        template_key = "finance"
    elif any(k in r_lower for k in ["civil", "infra", "construct", "struct", "survey", "bim"]):
        template_key = "civil"
    elif any(k in r_lower for k in ["pharma", "drug", "health", "biochem", "formulat", "clinic"]):
        template_key = "pharma"
    elif any(k in r_lower for k in ["software", "developer", "coding", "web", "full stack", "cloud", "it", "data science"]):
        template_key = "software"
    elif any(k in r_lower for k in ["mech", "auto", "design", "cad", "manufacturing", "thermal", "vehicle"]):
        template_key = "mechanical"

    tmpl = DOMAIN_ROADMAP_TEMPLATES[template_key]
    week_ranges = get_weeks_for_pace(pace)
    p_lower = (pace or "").lower()
    
    if "6" in p_lower:
        hours = "12-14 hrs/week"
        duration_label = "6 Months (Internship Ready Fast-Track)"
        overview = f"A high-yield 6-month fast-track roadmap ({hours}) concisely focused on essential tools and production capstones to get you PM Internship Scheme ready in 6 months."
    elif "15" in p_lower:
        hours = "6-8 hrs/week"
        duration_label = "15 Months (Advanced & In-Demand Specialization)"
        overview = f"An elite 15-month advanced curriculum ({hours}) covering end-to-end foundations plus next-generation in-demand technologies (Industry 4.0, cloud infrastructure & automation) for top corporate placement."
    else:
        hours = "8-10 hrs/week"
        duration_label = "12 Months (Master the Field)"
        overview = f"A comprehensive 12-month mastery roadmap ({hours}) covering standard corporate workflows, enterprise compliance, and professional excellence for {role} under PM Internship Scheme."

    phases = []
    for idx, p in enumerate(tmpl["phases"]):
        p_copy = dict(p)
        if idx < len(week_ranges):
            p_copy["weeks"] = week_ranges[idx]
        phases.append(p_copy)

    return {
        "status": "success",
        "target_role": role,
        "target_sector": sector or "National Enterprise Sector",
        "pace": duration_label,
        "role_badge": tmpl["role_badge"],
        "estimated_hours_per_week": hours,
        "roadmap_overview": overview,
        "phases": phases,
        "key_competencies_mastered": [
            f"{role} Core Competencies",
            "Industry-standard Tool Stack",
            "Production Portfolio Projects with Live Demos",
            "ATS Resume Optimization & STAR Interview Mastery"
        ]
    }


@router.post("/roadmap")
def generate_career_roadmap(payload: CareerRoadmapRequest):
    """
    Generates a personalized, step-by-step 4-phase Career Roadmap
    customized to the candidate's chosen target job and timeline pace using AI.
    """
    target = payload.target_role.strip()
    if not target:
        raise HTTPException(status_code=400, detail="Target role is required.")

    week_ranges = get_weeks_for_pace(payload.pace)
    p_lower = (payload.pace or "").lower()
    
    if "6" in p_lower:
        hours = "12-14 hrs/week"
        duration_label = "6 Months (Internship Ready Fast-Track)"
        duration_instruction = "CONCISE 6-MONTH CURRICULUM: Keep milestones tight, high-yield, and focused on essential tools and a hands-on capstone to make the student corporate internship ready quickly without unneeded fluff."
    elif "15" in p_lower:
        hours = "6-8 hrs/week"
        duration_label = "15 Months (Advanced & In-Demand Specialization)"
        duration_instruction = "ADVANCED 15-MONTH CURRICULUM: Include cutting-edge, currently in-demand industry skills (such as AI integrations, cloud architecture, telemetry, Industry 4.0 automation, and senior engineering leadership) commanding top corporate recruiter interest."
    else:
        hours = "8-10 hrs/week"
        duration_label = "12 Months (Master the Field)"
        duration_instruction = "COMPREHENSIVE 12-MONTH MASTERY: Provide complete end-to-end domain mastery, standard corporate workflows, multi-tiered project architecture, and rigorous quality compliance."

    # Try generating dynamic AI roadmap with NVIDIA Nemotron
    prompt = f"""You are an elite corporate career counselor and technical mentor for the Prime Minister's Internship Scheme (PMIS).
Create a comprehensive, highly actionable 4-phase Career Roadmap spanning {duration_label} for a student targeting the role: '{target}' in sector: '{payload.target_sector}'.
Candidate level: {payload.academic_level}. Learning pace: {duration_label} ({hours}). Current skills: {', '.join(payload.current_skills) if payload.current_skills else 'Beginner/Intermediate'}.

CURRICULUM SPECIFICATIONS:
{duration_instruction}

CRITICAL DURATION REQUIREMENT:
The 4 phases must strictly cover the following exact duration periods:
- Phase 1: {week_ranges[0]}
- Phase 2: {week_ranges[1]}
- Phase 3: {week_ranges[2]}
- Phase 4: {week_ranges[3]}

Return ONLY a valid JSON object matching the exact format:
{{
  "target_role": "{target}",
  "target_sector": "{payload.target_sector}",
  "pace": "{duration_label}",
  "role_badge": "Category domain badge",
  "estimated_hours_per_week": "{hours}",
  "roadmap_overview": "Crisp 2-sentence executive summary of this {duration_label} learning journey.",
  "phases": [
    {{
      "phase_number": 1,
      "title": "Phase 1: Foundation & Core Tools",
      "weeks": "{week_ranges[0]}",
      "goal": "Core objective for this phase.",
      "milestones": ["Milestone 1 with specific tools", "Milestone 2", "Milestone 3", "Milestone 4"],
      "recommended_tools": ["Tool1", "Tool2", "Tool3"],
      "free_resources": [
        {{"name": "Resource Name", "url": "https://example.com"}}
      ]
    }},
    {{
      "phase_number": 2,
      "title": "Phase 2: Production Projects & Architecture",
      "weeks": "{week_ranges[1]}",
      "goal": "Core objective for this phase.",
      "milestones": ["Milestone 1 with project names", "Milestone 2", "Milestone 3", "Milestone 4"],
      "recommended_tools": ["Tool1", "Tool2", "Tool3"],
      "free_resources": [
        {{"name": "Resource Name", "url": "https://example.com"}}
      ]
    }},
    {{
      "phase_number": 3,
      "title": "Phase 3: Industry Testing & Real-world Practice",
      "weeks": "{week_ranges[2]}",
      "goal": "Core objective for this phase.",
      "milestones": ["Milestone 1", "Milestone 2", "Milestone 3", "Milestone 4"],
      "recommended_tools": ["Tool1", "Tool2", "Tool3"],
      "free_resources": [
        {{"name": "Resource Name", "url": "https://example.com"}}
      ]
    }},
    {{
      "phase_number": 4,
      "title": "Phase 4: ATS Resume & Interview Mastery",
      "weeks": "{week_ranges[3]}",
      "goal": "Core objective for this phase.",
      "milestones": ["Milestone 1", "Milestone 2", "Milestone 3", "Milestone 4"],
      "recommended_tools": ["Tool1", "Tool2", "Tool3"],
      "free_resources": [
        {{"name": "Resource Name", "url": "https://example.com"}}
      ]
    }}
  ],
  "key_competencies_mastered": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
}}"""

    messages = [
        {"role": "system", "content": "You are a JSON-only API. You output ONLY raw valid JSON starting with { and ending with }."},
        {"role": "user", "content": prompt}
    ]

    try:
        raw_res = nvidia_llm.generate_response(messages, temperature=0.1, max_tokens=2200)
        cleaned = re.sub(r"^```(json)?", "", raw_res.strip())
        cleaned = re.sub(r"```$", "", cleaned.strip())

        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1:
            parsed = json.loads(cleaned[start:end+1])
            if parsed.get("phases") and len(parsed["phases"]) >= 4:
                parsed["status"] = "success"
                parsed["pace"] = duration_label
                parsed["estimated_hours_per_week"] = hours
                for idx, phase in enumerate(parsed["phases"][:4]):
                    phase["weeks"] = week_ranges[idx]
                return parsed
    except Exception as e:
        logger.warning(f"AI Roadmap LLM call exception: {e}")

    # Fallback to high-quality domain template
    return _get_fallback_roadmap(target, payload.target_sector or "Corporate Sector", payload.pace or "12-Month")
