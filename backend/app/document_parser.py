import json
import logging
from pathlib import Path
from typing import List, Dict, Any

DATA_DIR = Path(__file__).parent.parent / "data"
PMIS_120_FILE = DATA_DIR / "pm_internships_120.json"

logger = logging.getLogger(__name__)


def get_structured_internship_chunks() -> List[Dict[str, Any]]:
    """
    Parses and returns structured, enriched chunks for all 120 PM Internship records
    plus core scheme guidelines, portal navigation, and student guidance.
    """
    chunks: List[Dict[str, Any]] = []

    # 1. Core Scheme Overview & Portal Navigation Chunks
    chunks.extend(build_scheme_guidance_chunks())

    # 2. Ingest all 120 PM Internship records from the new dataset
    if PMIS_120_FILE.exists():
        try:
            with open(PMIS_120_FILE, "r", encoding="utf-8") as f:
                records = json.load(f)
                for rec in records:
                    chunks.append({
                        "id": rec["id"],
                        "title": f"{rec['company']} — {rec['title']} ({rec['id']})",
                        "category": "pm_internship_listing",
                        "sector": rec["sector"],
                        "company": rec["company"],
                        "branches": [rec["sector"], rec["eligibility"]],
                        "eligibility": rec["eligibility"],
                        "skills": rec["skills"],
                        "stipend": rec["stipend"],
                        "duration": rec["duration"],
                        "mode": rec["mode"],
                        "location": rec["location"],
                        "city": rec["city"],
                        "state": rec["state"],
                        "deadline": rec["deadline"],
                        "apply_url": "/dashboard",
                        "content": rec["content"]
                    })
            logger.info(f"Loaded {len(records)} official internship records from {PMIS_120_FILE.name}")
        except Exception as e:
            logger.error(f"Error loading {PMIS_120_FILE}: {e}")

    return chunks


def build_scheme_guidance_chunks() -> List[Dict[str, Any]]:
    return [
        {
            "id": "pmis_scheme_overview",
            "title": "PM Internship Scheme (PMIS) - Overview, Eligibility & Benefits",
            "category": "scheme_guidelines",
            "sector": "All Sectors",
            "company": "Government of India / MCA",
            "branches": ["All Streams"],
            "eligibility": "Indian youth aged 21–24 years. Must have passed Class 10th, 12th, ITI, Polytechnic Diploma, or hold an undergraduate degree (B.Tech, B.Sc, B.Com, BBA, BA, BCA, etc.). Candidates must not be in full-time employment or full-time education.",
            "stipend": "₹5,000 per month (₹4,500 Direct Benefit Transfer by Central Govt + ₹500 CSR by host company) + ₹6,000 one-time incidentals grant.",
            "duration": "12 months (or project specific 8–24 weeks as per listing)",
            "mode": "Hybrid / On-site / Remote",
            "location": "Pan-India across 28 States and Union Territories",
            "deadline": "24–30 October 2026 (varies by company listing)",
            "apply_url": "/dashboard",
            "content": (
                "PM Internship Scheme (PMIS) Guidelines:\n"
                "• Age & Eligibility: 21–24 years Indian citizens with Class 10+, ITI, Diploma, or Graduation.\n"
                "• Monthly Stipend: ₹5,000/month (₹4,500 DBT from Government + ₹500 from Partner Company) + ₹6,000 one-time grant.\n"
                "• Insurance: Comprehensive insurance coverage under PM Jeevan Jyoti Bima Yojana & PM Suraksha Bima Yojana provided.\n"
                "• How to Apply on Website: Register with your mobile number, complete your Student Profile & Career Goals in the Dashboard, upload your resume, and click 'Apply' on any open internship."
            )
        },
        {
            "id": "website_navigation_guide",
            "title": "Website Navigation & Student Guidance",
            "category": "portal_guide",
            "sector": "Portal Navigation",
            "company": "PM Internship Portal",
            "branches": ["All Students"],
            "eligibility": "All registered students",
            "stipend": "N/A",
            "duration": "Self-paced",
            "mode": "Online",
            "location": "Portal",
            "deadline": "Ongoing",
            "apply_url": "/dashboard",
            "content": (
                "How to Navigate the PM Internship Portal:\n"
                "1. Explore All Internships: Go to the 'Explore Internships' section to filter opportunities across 24 sectors by State, Work Mode (Hybrid/Remote/On-site), Sector, or Field.\n"
                "2. Register / Login: Click 'Login / Register' on top right. Register using your 10-digit mobile number or Google Account.\n"
                "3. Student Dashboard: Once logged in, visit the Dashboard to update your Academic Branch, Career Goals, and upload your Resume.\n"
                "4. Past Selected Resumes: Visit the 'See Past Selected Resumes' tab in the dashboard to review anonymized sample resumes that succeeded in top corporate selections.\n"
                "5. Find the Gap: Use our AI Skill Gap Analyzer to match your current resume against sector requirements and get instant learning recommendations."
            )
        },
        {
            "id": "resume_and_selection_tips",
            "title": "Resume Guidance & Selection Factors",
            "category": "student_guidance",
            "sector": "Career Guidance",
            "company": "Disha AI Guidance",
            "branches": ["All Branches"],
            "eligibility": "All applicants",
            "stipend": "N/A",
            "duration": "N/A",
            "mode": "N/A",
            "location": "N/A",
            "deadline": "N/A",
            "apply_url": "/dashboard",
            "content": (
                "Selection Factors & Winning Resume Tips:\n"
                "• Key Selection Factors: Candidate location match with company facility, sector alignment with academic degree, basic proficiency in tools (Excel, Python, Git, CAD depending on sector), and clear career statement.\n"
                "• Resume Best Practices: Keep it to 1 page, highlight 2-3 relevant projects or coursework, mention practical skills, and ensure correct contact details.\n"
                "• Review Past Resumes: You can check real selected resume formats directly in the 'Past Selected Resumes' section on our portal."
            )
        }
    ]
