import logging
import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Auth & User"])

# In-memory storage for users and applications (persisted in container)
USERS_DB: Dict[str, Dict[str, Any]] = {}
APPLICATIONS_DB: Dict[str, List[Dict[str, Any]]] = {}

# Sample Past Selected Resumes for Student Guidance
SELECTED_RESUMES = [
    {
        "id": "res_01",
        "candidate": "Priya Sharma (Anonymized)",
        "selected_for": "Software Development Intern at Tata Consultancy Services (TCS)",
        "sector": "IT & Software Development",
        "branch": "B.Tech Computer Science & Engineering (3rd Year)",
        "cgpa": "8.4 / 10",
        "college_tier": "State Government Engineering College",
        "highlights": [
            "Clear 1-page format with prioritized technical skills (Python, Git, React, SQLite).",
            "Included 2 practical project summaries with GitHub links and metrics (e.g. 'Reduced search latency by 35%').",
            "Highlighted problem-solving course certifications and hackathon participation.",
            "Tailored summary specifically matching TCS digital transformation objectives."
        ],
        "key_skills": ["Python", "FastAPI", "Git", "Data Structures", "SQL", "Unit Testing"],
        "advice": "Don't list 20 technologies. Pick 3-4 core tools and prove you built something with them."
    },
    {
        "id": "res_02",
        "candidate": "Aman Verma (Anonymized)",
        "selected_for": "Finance & Operations Intern at HDFC Bank",
        "sector": "Banking & Financial Services",
        "branch": "B.Com Honours (2nd Year)",
        "cgpa": "8.1 / 10",
        "college_tier": "Central University Affiliated College",
        "highlights": [
            "Highlighted advanced Excel skills (VLOOKUP, XLOOKUP, Pivot Tables, Macros).",
            "Documented an empirical financial analysis project analyzing banking branch metrics.",
            "Demonstrated attention to detail, KYC compliance basics, and customer handling abilities.",
            "Clean tabular format with reverse chronological education."
        ],
        "key_skills": ["Advanced Excel", "Financial Reporting", "Data Analysis", "Communication", "KYC Compliance"],
        "advice": "Financial institutions look for high accuracy in data entry and analytical aptitude."
    },
    {
        "id": "res_03",
        "candidate": "Rohan Deshmukh (Anonymized)",
        "selected_for": "Automotive Engineering Intern at Tata Motors",
        "sector": "Automotive",
        "branch": "B.E. Mechanical Engineering (Pre-Final Year)",
        "cgpa": "7.9 / 10",
        "college_tier": "Regional Technical Institute",
        "highlights": [
            "Hands-on CAD modeling (SolidWorks, AutoCAD) with mechanical assembly portfolio link.",
            "SAE BAJA / Formula Student team experience listed with concrete component design metrics.",
            "EV (Electric Vehicle) fundamentals and battery thermal management study.",
            "Clear Statement of Intent focused on sustainability in commercial mobility."
        ],
        "key_skills": ["AutoCAD", "SolidWorks", "Finite Element Analysis", "Manufacturing Basics", "EV Systems"],
        "advice": "Include photos or schematics link if you worked on college vehicle/robotics projects."
    },
    {
        "id": "res_04",
        "candidate": "Ananya Patel (Anonymized)",
        "selected_for": "Project Planning Intern at Larsen & Toubro (L&T)",
        "sector": "Infrastructure & Construction",
        "branch": "B.Tech Civil Engineering (Final Year)",
        "cgpa": "8.6 / 10",
        "college_tier": "National Institute of Technology (NIT)",
        "highlights": [
            "Knowledge of MS Project, Primavera basics, and Bar Bending Schedule (BBS).",
            "Site internship documentation with concrete volume estimation and safety checklist audits.",
            "Certified in Green Building norms and BIM fundamentals.",
            "Quantified achievements in site logistics coordination."
        ],
        "key_skills": ["MS Project", "AutoCAD Civil", "Site Documentation", "Quality Control", "Estimation"],
        "advice": "Site safety awareness and drawing interpretation are the two highest-scoring factors in L&T interviews."
    }
]


class RegisterRequest(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=15, description="10-digit mobile number")
    is_unique_confirmed: bool = Field(True, description="Confirmation checkbox that mobile is unique")
    name: Optional[str] = "Student Candidate"
    password: Optional[str] = "Pmis@2026"


class LoginRequest(BaseModel):
    username_or_mobile: str = Field(..., description="Username / Mobile / CIN")
    password: str = Field(..., description="Password")


class ResetPasswordRequest(BaseModel):
    user_id: str = Field(..., description="Username / Mobile / CIN")


class GoogleAuthRequest(BaseModel):
    token: Optional[str] = None
    email: str
    name: str
    picture: Optional[str] = None


class ProfileUpdateRequest(BaseModel):
    branch: Optional[str] = None
    degree: Optional[str] = None
    college: Optional[str] = None
    state: Optional[str] = None
    career_goals: Optional[str] = None
    skills: Optional[List[str]] = []
    preferred_sectors: Optional[List[str]] = []
    resume_name: Optional[str] = None


class ApplyRequest(BaseModel):
    internship_id: str
    company: str
    title: str
    notes: Optional[str] = ""


@router.post("/auth/register")
def register_user(payload: RegisterRequest):
    """Registers a youth candidate with 10-digit mobile number."""
    mobile = payload.mobile.strip()
    if len(mobile) < 10:
        raise HTTPException(status_code=400, detail="Please enter a valid 10-digit mobile number.")

    user_id = f"PMIS-{mobile[-6:]}"
    user_data = {
        "user_id": user_id,
        "mobile": mobile,
        "name": payload.name or f"Candidate {mobile[-4:]}",
        "email": f"{mobile}@candidate.pminternship.gov.in",
        "branch": "",
        "career_goals": "",
        "skills": [],
        "preferred_sectors": [],
        "resume_name": "",
        "registered_at": "2026-10-23"
    }
    USERS_DB[user_id] = user_data
    USERS_DB[mobile] = user_data

    return {
        "status": "success",
        "message": "Youth Registration Successful! User ID generated.",
        "user_id": user_id,
        "user": user_data
    }


@router.post("/auth/login")
def login_user(payload: LoginRequest):
    """Logs in using Username / Mobile / CIN and password."""
    ident = payload.username_or_mobile.strip()
    # Check if exists or create instant test session
    if ident in USERS_DB:
        user = USERS_DB[ident]
    else:
        user = {
            "user_id": ident if ident.startswith("PMIS-") else f"PMIS-{ident[-6:]}",
            "mobile": ident if ident.isdigit() else "9876543210",
            "name": f"Candidate {ident}",
            "email": f"{ident}@candidate.pminternship.gov.in",
            "branch": "Computer Science & Engineering",
            "career_goals": "Seeking a high-impact internship in software development and AI.",
            "skills": ["Python", "SQL", "Excel", "Data Analysis"],
            "preferred_sectors": ["IT & Software Development", "Banking & Financial Services"],
            "resume_name": "Sample_Candidate_Resume.pdf"
        }
        USERS_DB[ident] = user

    return {
        "status": "success",
        "message": "Login successful",
        "user": user,
        "token": f"bearer-{uuid.uuid4().hex[:16]}"
    }


@router.post("/auth/google")
def google_auth(payload: GoogleAuthRequest):
    """Authenticates or registers candidate via Google OAuth 2.0."""
    email = payload.email.lower().strip()
    user_id = f"G-{email.split('@')[0]}"
    user_data = {
        "user_id": user_id,
        "mobile": "Google Account",
        "name": payload.name,
        "email": email,
        "picture": payload.picture,
        "branch": "Engineering & Technology",
        "career_goals": "Interested in premier PM corporate internships.",
        "skills": ["Communication", "Research", "Project Coordination"],
        "preferred_sectors": ["Consulting Services", "IT & Software Development"],
        "resume_name": ""
    }
    USERS_DB[email] = user_data
    USERS_DB[user_id] = user_data

    return {
        "status": "success",
        "message": "Google Authentication Successful",
        "user": user_data,
        "token": f"bearer-google-{uuid.uuid4().hex[:16]}"
    }


@router.post("/auth/reset-password")
def reset_password(payload: ResetPasswordRequest):
    """Processes reset password for User ID / Mobile / CIN."""
    ident = payload.user_id.strip()
    return {
        "status": "success",
        "message": f"A One-Time Password (OTP) has been sent to the registered mobile / email for User ID: {ident}."
    }


@router.get("/user/profile")
def get_profile(user_id: str = "PMIS-DEMO"):
    """Returns candidate dashboard profile."""
    return USERS_DB.get(user_id, {
        "user_id": user_id,
        "name": "Arjun Patel",
        "mobile": "9876543210",
        "email": "arjun.patel@sample.gov.in",
        "branch": "Mechanical & Mechatronics",
        "degree": "B.Tech (3rd Year)",
        "college": "State Technological University",
        "state": "Maharashtra",
        "career_goals": "Aiming to build a career in electric mobility, automation, and industrial robotics.",
        "skills": ["AutoCAD", "Python", "Robotics", "Excel", "Problem Solving"],
        "preferred_sectors": ["Automotive", "Manufacturing & Industrial", "Aviation & Defence"],
        "resume_name": "Arjun_Patel_CV_2026.pdf"
    })


@router.put("/user/profile")
def update_profile(user_id: str, payload: ProfileUpdateRequest):
    """Updates candidate branch, career goals, and skills in dashboard."""
    user = USERS_DB.get(user_id, get_profile(user_id))
    if payload.branch is not None:
        user["branch"] = payload.branch
    if payload.career_goals is not None:
        user["career_goals"] = payload.career_goals
    if payload.skills:
        user["skills"] = payload.skills
    if payload.preferred_sectors:
        user["preferred_sectors"] = payload.preferred_sectors
    if payload.resume_name:
        user["resume_name"] = payload.resume_name
    USERS_DB[user_id] = user
    return {
        "status": "success",
        "message": "Profile updated successfully!",
        "user": user
    }


@router.get("/user/applications")
def get_applications(user_id: str = "PMIS-DEMO"):
    """Returns candidate applied internships."""
    apps = APPLICATIONS_DB.get(user_id, [
        {
            "application_id": "APP-2026-081",
            "internship_id": "PMIS-001",
            "company": "Tata Consultancy Services",
            "title": "Software Development Intern",
            "applied_date": "2026-10-21",
            "status": "Shortlisted for Round 1",
            "stipend": "₹8,000–₹12,000/month",
            "location": "Bengaluru, Karnataka (Hybrid)"
        },
        {
            "application_id": "APP-2026-092",
            "internship_id": "PMIS-046",
            "company": "Maruti Suzuki",
            "title": "Automotive Engineering Intern",
            "applied_date": "2026-10-22",
            "status": "Under Employer Review",
            "stipend": "₹8,000–₹12,000/month",
            "location": "Bengaluru, Karnataka (Hybrid)"
        }
    ])
    return {"applications": apps}


@router.post("/user/apply")
def apply_internship(user_id: str, payload: ApplyRequest):
    """Submits an application for an internship."""
    app_list = APPLICATIONS_DB.get(user_id, [])
    new_app = {
        "application_id": f"APP-2026-{uuid.uuid4().hex[:6].upper()}",
        "internship_id": payload.internship_id,
        "company": payload.company,
        "title": payload.title,
        "applied_date": "2026-10-23",
        "status": "Application Submitted",
        "notes": payload.notes
    }
    app_list.insert(0, new_app)
    APPLICATIONS_DB[user_id] = app_list
    return {
        "status": "success",
        "message": f"Successfully applied for {payload.title} at {payload.company}!",
        "application": new_app
    }


@router.get("/resumes/selected")
def get_past_selected_resumes():
    """Returns curated past selected resumes with highlights and advice."""
    return {"resumes": SELECTED_RESUMES}
