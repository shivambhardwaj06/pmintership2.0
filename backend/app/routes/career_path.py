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
    pace: Optional[str] = "12-Week Comprehensive"


DOMAIN_ROADMAP_TEMPLATES = {
    "software": {
        "role_badge": "Information Technology & Software Engineering",
        "estimated_hours_per_week": "10-12 hrs/week",
        "phases": [
            {
                "phase_number": 1,
                "title": "Phase 1: Core Foundation & Tool Stack Mastery",
                "weeks": "Weeks 1 - 3",
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
                "weeks": "Weeks 4 - 7",
                "goal": "Construct 2 real-world SaaS applications with live deployments and public GitHub repositories.",
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
                "title": "Phase 3: Industry Certifications & Real-World Rigor",
                "weeks": "Weeks 8 - 10",
                "goal": "Validate enterprise competencies with industry testing standards and cloud services.",
                "milestones": [
                    "Write automated unit and integration tests (pytest or Jest) achieving >80% code coverage.",
                    "Gain hands-on familiarity with cloud fundamentals: AWS S3, EC2, or Azure App Service.",
                    "Participate in 1 national hackathon (Smart India Hackathon or Devpost) with a team.",
                    "Optimize database schemas with foreign key constraints, connection pooling, and EXPLAIN ANALYZE."
                ],
                "recommended_tools": ["pytest / Jest", "AWS Free Tier", "Redis", "GitHub Actions"],
                "free_resources": [
                    {"name": "AWS Cloud Practitioner Free Essentials", "url": "https://aws.amazon.com/training"},
                    {"name": "PostgreSQL Tutorial", "url": "https://www.postgresqltutorial.com"}
                ]
            },
            {
                "phase_number": 4,
                "title": "Phase 4: ATS Resume Optimization & Corporate Interview Mastery",
                "weeks": "Weeks 11 - 12",
                "goal": "Align your profile with PM Internship Scheme corporate screeners and clear technical rounds.",
                "milestones": [
                    "Format resume into strict 1-page single-column layout with live demo URLs and GitHub links.",
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
                    "Attach CAD portfolio hyperlink in the header of your strict 1-page PDF resume.",
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
    }
}


def _get_fallback_roadmap(role: str, sector: str, pace: str) -> Dict[str, Any]:
    """Generates an accurate, highly structured career roadmap based on domain keywords."""
    r_lower = role.lower()
    template_key = "software"
    if any(k in r_lower for k in ["mech", "auto", "design", "cad", "manufacturing", "thermal"]):
        template_key = "mechanical"

    tmpl = DOMAIN_ROADMAP_TEMPLATES[template_key]

    return {
        "status": "success",
        "target_role": role,
        "target_sector": sector or "National Enterprise Sector",
        "pace": pace,
        "role_badge": tmpl["role_badge"],
        "estimated_hours_per_week": tmpl["estimated_hours_per_week"],
        "roadmap_overview": f"A targeted, progressive roadmap designed to take you from foundational concepts to an ATS-cleared, industry-ready candidate for {role} under PM Internship Scheme.",
        "phases": tmpl["phases"],
        "key_competencies_mastered": [
            "Domain-specific industry tool stack",
            "Production-grade portfolio projects with live links",
            "Quality assurance & industry standard compliance",
            "Structured corporate interview answering (STAR method)"
        ]
    }


@router.post("/roadmap")
def generate_career_roadmap(payload: CareerRoadmapRequest):
    """
    Generates a personalized, step-by-step 4-phase Career Roadmap
    customized to the candidate's chosen target job using AI.
    """
    target = payload.target_role.strip()
    if not target:
        raise HTTPException(status_code=400, detail="Target role is required.")

    # Try generating dynamic AI roadmap with NVIDIA Nemotron
    prompt = f"""You are an elite corporate career counselor and technical mentor for the Prime Minister's Internship Scheme (PMIS).
Create a comprehensive, highly actionable 4-phase Career Roadmap for a student targeting the role: '{target}' in sector: '{payload.target_sector}'.
Candidate level: {payload.academic_level}. Learning pace: {payload.pace}. Current skills: {', '.join(payload.current_skills) if payload.current_skills else 'Beginner/Intermediate'}.

Return ONLY a valid JSON object matching the exact format:
{{
  "target_role": "{target}",
  "target_sector": "{payload.target_sector}",
  "pace": "{payload.pace}",
  "role_badge": "Category domain badge",
  "estimated_hours_per_week": "10-12 hrs/week",
  "roadmap_overview": "Crisp 2-sentence executive summary of this learning journey.",
  "phases": [
    {{
      "phase_number": 1,
      "title": "Phase 1: Foundation & Core Tools",
      "weeks": "Weeks 1 - 3",
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
      "weeks": "Weeks 4 - 7",
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
      "weeks": "Weeks 8 - 10",
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
      "weeks": "Weeks 11 - 12",
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
                return parsed
    except Exception as e:
        logger.warning(f"AI Roadmap LLM call exception: {e}")

    # Fallback to high-quality domain template
    return _get_fallback_roadmap(target, payload.target_sector or "Corporate Sector", payload.pace or "12-Week")
