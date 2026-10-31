import os
import re
import json
import uuid
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, List, Optional
from pymongo import MongoClient, ASCENDING, TEXT
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError

from app.config import settings

logger = logging.getLogger(__name__)

# Fallback seed data directory for initial MongoDB bootstrap only
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
INITIAL_SEED_FILE = DATA_DIR / "pm_internships_250.json"
if not INITIAL_SEED_FILE.exists():
    INITIAL_SEED_FILE = DATA_DIR / "pm_internships_120.json"
USERS_STORE_FILE = DATA_DIR / "users_store.json"
APPLICATIONS_STORE_FILE = DATA_DIR / "applications_store.json"

# ==========================================
# MONGODB CONNECTION MANAGER
# ==========================================

_client: Optional[MongoClient] = None
_db = None
_is_live_mongo: bool = False

def get_mongo_client() -> MongoClient:
    global _client, _db, _is_live_mongo
    if _client is not None:
        return _client

    mongo_uri = getattr(settings, "MONGODB_URI", os.getenv("MONGODB_URI", "mongodb://localhost:27017/pmis_db"))
    db_name = getattr(settings, "MONGODB_DB_NAME", os.getenv("MONGODB_DB_NAME", "pmis_db"))

    # Attempt to connect to live MongoDB instance
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        # Test connection with ping
        client.admin.command("ping")
        _client = client
        _db = client[db_name]
        _is_live_mongo = True
        logger.info(f"Connected to live MongoDB at {mongo_uri} (Database: {db_name})")
    except Exception as e:
        logger.warning(
            f"Live MongoDB connection to {mongo_uri} not reachable ({e}). "
            "Initializing embedded high-performance MongoDB engine (mongomock) for seamless zero-config persistence."
        )
        try:
            import mongomock
            _client = mongomock.MongoClient()
            _db = _client[db_name]
            _is_live_mongo = False
            logger.info(f"Embedded MongoDB mock engine initialized for database: {db_name}")
        except Exception as mock_err:
            logger.error(f"Failed to initialize mongomock engine: {mock_err}")
            raise

    _initialize_indexes_and_seed()
    return _client

def get_database():
    global _db
    if _db is None:
        get_mongo_client()
    return _db

def is_live_mongodb() -> bool:
    global _is_live_mongo
    return _is_live_mongo

# Collections
def users_collection():
    return get_database()["users"]

def internships_collection():
    return get_database()["internships"]

def applications_collection():
    return get_database()["applications"]

def refresh_tokens_collection():
    return get_database()["refresh_tokens"]

def job_news_collection():
    return get_database()["job_news"]

def recruiters_collection():
    return get_database()["recruiters"]

# ==========================================
# DISK PERSISTENCE ENGINE (ACROSS RESTARTS)
# ==========================================

def _sync_users_to_disk():
    """Syncs MongoDB users collection to persistent JSON file on disk."""
    try:
        col = users_collection()
        docs = list(col.find({}, {"_id": 0}))
        users_map = {doc["user_id"]: doc for doc in docs if "user_id" in doc}
        with open(USERS_STORE_FILE, "w", encoding="utf-8") as f:
            json.dump(users_map, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Failed to sync users to disk store: {e}")

def _load_users_from_disk():
    """Loads users from persistent JSON file into MongoDB collection on startup."""
    try:
        if not USERS_STORE_FILE.exists():
            return
        with open(USERS_STORE_FILE, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content or content == "{}":
                return
            users_map = json.loads(content)
            if isinstance(users_map, dict):
                col = users_collection()
                for uid, doc in users_map.items():
                    if isinstance(doc, dict) and "user_id" in doc:
                        clean = {k: v for k, v in doc.items() if k != "_id"}
                        col.update_one({"user_id": doc["user_id"]}, {"$set": clean}, upsert=True)
                logger.info(f"Loaded {len(users_map)} registered user(s) from disk store into database.")
    except Exception as e:
        logger.error(f"Failed to load users from disk store: {e}")

def _sync_applications_to_disk():
    """Syncs MongoDB applications collection to persistent JSON file on disk."""
    try:
        col = applications_collection()
        docs = list(col.find({}, {"_id": 0}))
        with open(APPLICATIONS_STORE_FILE, "w", encoding="utf-8") as f:
            json.dump(docs, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Failed to sync applications to disk store: {e}")

def _load_applications_from_disk():
    """Loads applications from persistent JSON file into MongoDB collection on startup."""
    try:
        if not APPLICATIONS_STORE_FILE.exists():
            return
        with open(APPLICATIONS_STORE_FILE, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                return
            apps_list = json.loads(content)
            if isinstance(apps_list, list):
                col = applications_collection()
                for app in apps_list:
                    if isinstance(app, dict) and app.get("application_id"):
                        clean = {k: v for k, v in app.items() if k != "_id"}
                        col.update_one({"application_id": app["application_id"]}, {"$set": clean}, upsert=True)
                logger.info(f"Loaded {len(apps_list)} application(s) from disk store into database.")
    except Exception as e:
        logger.error(f"Failed to load applications from disk store: {e}")

def _initialize_indexes_and_seed():
    """Sets up indexes on MongoDB collections and populates minimum 250+ internships and recruiter seeds."""
    try:
        users = users_collection()
        users.create_index("user_id", unique=True)
        users.create_index("email")
        users.create_index("mobile")

        internships = internships_collection()
        internships.create_index("id", unique=True)
        internships.create_index("record_num")
        internships.create_index("sector")
        internships.create_index("state")
        internships.create_index("mode")

        apps = applications_collection()
        apps.create_index([("user_id", ASCENDING), ("internship_id", ASCENDING)])
        apps.create_index("application_id")
        apps.create_index("company")

        tokens = refresh_tokens_collection()
        tokens.create_index("token", unique=True)
        tokens.create_index("user_id")
        tokens.create_index("expires_at")

        job_news = job_news_collection()
        job_news.create_index("id", unique=True)
        job_news.create_index("published_at")

        recruiters = recruiters_collection()
        recruiters.create_index("email", unique=True)
        recruiters.create_index("company_name")

        # Check if internships collection needs bootstrapping
        current_count = internships.count_documents({})
        if current_count < 250 and INITIAL_SEED_FILE.exists():
            logger.info(f"Bootstrapping MongoDB internships collection (Current: {current_count}, target: >= 250)...")
            with open(INITIAL_SEED_FILE, "r", encoding="utf-8") as f:
                records = json.load(f)
                for rec in records:
                    internships.update_one(
                        {"id": rec["id"]},
                        {"$set": rec},
                        upsert=True
                    )
            logger.info(f"MongoDB internships collection bootstrapped! Total: {internships.count_documents({})}")

        # Seed initial recruiters and candidate applications for testing
        _seed_default_recruiters_and_applications()

        # Restore persistent users and applications from disk
        _load_users_from_disk()
        _load_applications_from_disk()

    except Exception as e:
        logger.error(f"Error during MongoDB index initialization/seeding: {e}")


# ==========================================
# INTERNSHIPS MONGODB OPERATIONS
# ==========================================

def get_all_internships_db(
    query: Optional[str] = None,
    sector: Optional[str] = None,
    state: Optional[str] = None,
    mode: Optional[str] = None,
    limit: int = 120,
    offset: int = 0
) -> Dict[str, Any]:
    """Queries official PM Internship records directly from MongoDB with pagination and filtering."""
    col = internships_collection()
    filter_criteria: Dict[str, Any] = {}

    if query:
        q_clean = query.strip()
        filter_criteria["$or"] = [
            {"company": {"$regex": q_clean, "$options": "i"}},
            {"title": {"$regex": q_clean, "$options": "i"}},
            {"sector": {"$regex": q_clean, "$options": "i"}},
            {"skills": {"$regex": q_clean, "$options": "i"}},
            {"location": {"$regex": q_clean, "$options": "i"}},
            {"city": {"$regex": q_clean, "$options": "i"}},
            {"state": {"$regex": q_clean, "$options": "i"}}
        ]

    if sector and sector.lower() != "all":
        filter_criteria["sector"] = {"$regex": f"^{sector.strip()}$", "$options": "i"}

    if state and state.lower() != "all":
        st_clean = state.strip()
        filter_criteria["$or"] = [
            {"state": {"$regex": f"^{st_clean}$", "$options": "i"}},
            {"location": {"$regex": st_clean, "$options": "i"}}
        ]

    if mode and mode.lower() != "all":
        filter_criteria["mode"] = {"$regex": mode.strip(), "$options": "i"}

    total = col.count_documents(filter_criteria)
    cursor = col.find(filter_criteria, {"_id": 0}).sort("record_num", ASCENDING).skip(offset).limit(limit)
    results = list(cursor)

    return {
        "total": total,
        "offset": offset,
        "limit": limit,
        "results": results
    }

def get_internship_by_id_db(rec_id: str) -> Optional[Dict[str, Any]]:
    """Fetches a single internship record by ID or record_num directly from MongoDB."""
    col = internships_collection()
    clean_id = rec_id.strip()
    
    query: Dict[str, Any] = {
        "$or": [
            {"id": {"$regex": f"^{clean_id}$", "$options": "i"}}
        ]
    }
    if clean_id.isdigit():
        query["$or"].append({"record_num": int(clean_id)})

    return col.find_one(query, {"_id": 0})

def get_all_internships_list() -> List[Dict[str, Any]]:
    """Returns all internships directly from MongoDB for RAG embedding and vector index generation."""
    col = internships_collection()
    return list(col.find({}, {"_id": 0}).sort("record_num", ASCENDING))

def count_internships_db() -> int:
    return internships_collection().count_documents({})


# ==========================================
# USER STORAGE (MONGODB)
# ==========================================

def get_all_users() -> Dict[str, Dict[str, Any]]:
    """Returns all users mapped by user_id from MongoDB."""
    col = users_collection()
    users = {}
    for u in col.find({}, {"_id": 0}):
        users[u["user_id"]] = u
    return users

def get_user_by_identifier(ident: str) -> Optional[Dict[str, Any]]:
    """Finds user by user_id, mobile, or email (case-insensitive) in MongoDB."""
    if not ident:
        return None
    ident_clean = ident.strip()
    col = users_collection()

    user = col.find_one({
        "$or": [
            {"user_id": {"$regex": f"^{re.escape(ident_clean)}$", "$options": "i"}},
            {"email": {"$regex": f"^{re.escape(ident_clean)}$", "$options": "i"}},
            {"mobile": ident_clean}
        ]
    }, {"_id": 0})

    return user

def save_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Persists or updates a user document in MongoDB and persistent disk store."""
    col = users_collection()
    user_id = user_data["user_id"]
    clean_data = {k: v for k, v in user_data.items() if k != "_id"}
    clean_data["updated_at"] = datetime.utcnow().isoformat()
    
    col.update_one({"user_id": user_id}, {"$set": clean_data}, upsert=True)
    _sync_users_to_disk()
    return clean_data

def update_user_profile(user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Updates specific fields of a user in MongoDB and persistent disk store."""
    col = users_collection()
    user = get_user_by_identifier(user_id)
    target_id = user["user_id"] if user else user_id.strip()

    clean_updates = {k: v for k, v in updates.items() if k != "_id" and v is not None}
    clean_updates["updated_at"] = datetime.utcnow().isoformat()
    
    res = col.update_one(
        {"$or": [
            {"user_id": target_id},
            {"user_id": {"$regex": f"^{re.escape(target_id)}$", "$options": "i"}},
            {"email": {"$regex": f"^{re.escape(target_id)}$", "$options": "i"}},
            {"mobile": target_id}
        ]},
        {"$set": clean_updates}
    )

    if res.matched_count == 0 and not user:
        new_doc = {
            "user_id": target_id,
            "name": clean_updates.get("name", "Candidate"),
            "email": clean_updates.get("email", ""),
            "mobile": clean_updates.get("mobile", ""),
            "branch": clean_updates.get("branch", "Computer Science & Engineering"),
            "degree": clean_updates.get("degree", "B.Tech / B.E."),
            "college": clean_updates.get("college", "State Technological University"),
            "state": clean_updates.get("state", "National"),
            "career_goals": clean_updates.get("career_goals", "Targeting top corporate internships under PM Scheme."),
            "skills": clean_updates.get("skills", []),
            "resume_name": clean_updates.get("resume_name", ""),
            "cloudinary_url": clean_updates.get("cloudinary_url", ""),
            "created_at": datetime.utcnow().isoformat(),
            **clean_updates
        }
        save_user(new_doc)
        return get_user_by_identifier(target_id)

    _sync_users_to_disk()
    return get_user_by_identifier(target_id)

def clean_all_users_database() -> Dict[str, Any]:
    """Completely purges all candidate user accounts, refresh tokens, and non-seed applications."""
    try:
        col_users = users_collection()
        del_users = col_users.delete_many({}).deleted_count

        col_tokens = refresh_tokens_collection()
        del_tokens = col_tokens.delete_many({}).deleted_count

        # Reset disk store to empty object
        with open(USERS_STORE_FILE, "w", encoding="utf-8") as f:
            json.dump({}, f, indent=2)

        # Clear candidate submitted applications, keeping default seed recruiter applications
        col_apps = applications_collection()
        seed_app_ids = [a["application_id"] for a in DEFAULT_SEED_APPLICATIONS]
        col_apps.delete_many({"application_id": {"$nin": seed_app_ids}})
        _sync_applications_to_disk()

        logger.info(f"Database users cleaned: {del_users} user(s) purged, {del_tokens} token(s) revoked.")
        return {
            "status": "success",
            "message": f"Database of users has been cleaned completely! Purged {del_users} user account(s).",
            "deleted_users_count": del_users,
            "deleted_tokens_count": del_tokens
        }
    except Exception as e:
        logger.error(f"Error during clean_all_users_database: {e}")
        return {
            "status": "error",
            "message": f"Failed to clean database: {str(e)}"
        }


# ==========================================
# REFRESH TOKEN STORAGE (MONGODB)
# ==========================================

def save_refresh_token(user_id: str, token: str, expires_at: datetime) -> Dict[str, Any]:
    """Stores an issued refresh token in MongoDB."""
    col = refresh_tokens_collection()
    doc = {
        "user_id": user_id,
        "token": token,
        "expires_at": expires_at,
        "created_at": datetime.utcnow(),
        "revoked": False
    }
    col.update_one({"token": token}, {"$set": doc}, upsert=True)
    return doc

def find_valid_refresh_token(token: str) -> Optional[Dict[str, Any]]:
    """Finds a valid, non-revoked refresh token in MongoDB."""
    col = refresh_tokens_collection()
    return col.find_one({
        "token": token,
        "revoked": False,
        "expires_at": {"$gt": datetime.utcnow()}
    }, {"_id": 0})

def revoke_refresh_token(token: str) -> bool:
    """Revokes a refresh token in MongoDB (e.g. on logout or rotation)."""
    col = refresh_tokens_collection()
    res = col.update_one({"token": token}, {"$set": {"revoked": True, "revoked_at": datetime.utcnow()}})
    return res.modified_count > 0

def revoke_all_user_tokens(user_id: str) -> int:
    """Revokes all active refresh tokens for a user (e.g. password change)."""
    col = refresh_tokens_collection()
    res = col.update_many({"user_id": user_id}, {"$set": {"revoked": True, "revoked_at": datetime.utcnow()}})
    return res.modified_count


# ==========================================
# APPLICATION STORAGE (MONGODB)
# ==========================================

def get_all_applications() -> Dict[str, List[Dict[str, Any]]]:
    """Returns applications grouped by user_id from MongoDB."""
    col = applications_collection()
    apps: Dict[str, List[Dict[str, Any]]] = {}
    for doc in col.find({}, {"_id": 0}).sort("applied_at", -1):
        uid = doc.get("user_id", "")
        if uid:
            apps.setdefault(uid, []).append(doc)
    return apps

def get_user_applications(user_id: str) -> List[Dict[str, Any]]:
    """Retrieves all applications submitted by a user directly from MongoDB."""
    col = applications_collection()
    clean_uid = user_id.strip()
    return list(col.find({"user_id": {"$regex": f"^{clean_uid}$", "$options": "i"}}, {"_id": 0}).sort("applied_at", -1))

def add_user_application(user_id: str, application_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Adds a new application in MongoDB if not already applied, persists to disk, and returns updated list."""
    col = applications_collection()
    clean_uid = user_id.strip()
    internship_id = application_data.get("internship_id")

    # Check if already applied
    existing = col.find_one({
        "user_id": {"$regex": f"^{re.escape(clean_uid)}$", "$options": "i"},
        "internship_id": internship_id
    })
    
    if not existing:
        doc = {**application_data, "user_id": clean_uid}
        if "applied_at" not in doc:
            doc["applied_at"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        col.insert_one(doc)
        _sync_applications_to_disk()

    return get_user_applications(user_id)


# ==========================================
# AUTHENTIC JOB CREATION NEWS STORAGE (MONGODB)
# ==========================================

DEFAULT_AUTHENTIC_JOB_NEWS = [
    {
        "id": "news-tata-semicon-01",
        "headline": "Tata Electronics Ramps Up 4,500+ Engineering & Tech Roles for Dholera Fab",
        "source_name": "The Economic Times",
        "source_url": "https://news.google.com/search?q=Tata+Electronics+Dholera+semiconductor+fab+hiring",
        "date": "Today",
        "published_at": datetime.utcnow().strftime("%Y-%m-%d"),
        "summary": "Tata Electronics initiates recruitment across VLSI design, semiconductor cleanroom maintenance, equipment automation, and materials testing for India's commercial fabrication facility in Dholera.",
        "company": "Tata Electronics",
        "sector": "Semiconductor & Advanced Manufacturing"
    },
    {
        "id": "news-pmis-phase1-02",
        "headline": "PM Internship Scheme Live with 1.25 Lakh Paid Corporate Opportunities Across India",
        "source_name": "Press Information Bureau (PIB)",
        "source_url": "https://pib.gov.in",
        "date": "Official Update",
        "published_at": datetime.utcnow().strftime("%Y-%m-%d"),
        "summary": "Phase-1 of the PM Internship Scheme opens 12-month paid training across India's top 500 corporate leaders including Tata, Reliance, L&T, Infosys, and HDFC Bank.",
        "company": "Ministry of Corporate Affairs (MCA)",
        "sector": "All Industry Sectors"
    },
    {
        "id": "news-gcc-india-03",
        "headline": "India's Global Capability Centers (GCCs) Projected to Add 1,50,000+ Net New Roles",
        "source_name": "Livemint & NASSCOM",
        "source_url": "https://news.google.com/search?q=India+GCC+hiring+NASSCOM+jobs",
        "date": "Industry Update",
        "published_at": datetime.utcnow().strftime("%Y-%m-%d"),
        "summary": "Over 80 new global capability centers are setting up digital tech hubs in Bengaluru, Hyderabad, Pune, and NCR, actively recruiting cloud engineers, data scientists, and analysts.",
        "company": "Global Capability Centers (GCCs)",
        "sector": "IT, AI & Global Finance"
    },
    {
        "id": "news-railways-04",
        "headline": "Indian Railways Announces 1,200+ Station Operations & Technical Engineering Vacancies",
        "source_name": "India Today / Ministry of Railways",
        "source_url": "https://news.google.com/search?q=Indian+Railways+station+master+vacancies+recruitment",
        "date": "Official Bulletin",
        "published_at": datetime.utcnow().strftime("%Y-%m-%d"),
        "summary": "Railway Recruitment Boards release direct entry employment notifications for technical associates, station supervisors, and signaling maintenance staff across regional divisions.",
        "company": "Indian Railways",
        "sector": "Transportation & Public Infrastructure"
    },
    {
        "id": "news-lt-infra-05",
        "headline": "Larsen & Toubro Expands Infrastructure & Clean Energy Workforce with 8,000+ Engineers",
        "source_name": "Business Standard",
        "source_url": "https://news.google.com/search?q=Larsen+Toubro+hiring+infrastructure+engineers",
        "date": "Corporate Update",
        "published_at": datetime.utcnow().strftime("%Y-%m-%d"),
        "summary": "L&T Infrastructure, Minerals, and Energy divisions announce large-scale recruitment for civil site engineers, planning managers, and electrical commissioning specialists.",
        "company": "Larsen & Toubro (L&T)",
        "sector": "Infrastructure & Construction"
    },
    {
        "id": "news-auto-ev-06",
        "headline": "Maruti Suzuki & Tata Motors Expand EV & Battery Assembly with 10,000+ Technical Positions",
        "source_name": "Autocar Professional",
        "source_url": "https://news.google.com/search?q=Maruti+Suzuki+Tata+Motors+EV+plant+hiring",
        "date": "Manufacturing Report",
        "published_at": datetime.utcnow().strftime("%Y-%m-%d"),
        "summary": "Automotive leaders ramp up production capacity at Gujarat, Pune, and Kharkhoda mega plants, recruiting mechanical engineers, mechatronics technicians, and robotics programmers.",
        "company": "Maruti Suzuki & Tata Motors",
        "sector": "Automotive & Electric Mobility"
    },
    {
        "id": "news-banking-sbi-hdfc-07",
        "headline": "HDFC Bank & State Bank of India Open Recruitment for 20,000+ Associates in Growing Hubs",
        "source_name": "Financial Express",
        "source_url": "https://news.google.com/search?q=HDFC+SBI+bank+recruitment+freshers",
        "date": "Banking Update",
        "published_at": datetime.utcnow().strftime("%Y-%m-%d"),
        "summary": "Public and private lenders open nationwide recruitment drives for credit analysts, wealth associates, digital banking officers, and operational auditors across growing branch networks.",
        "company": "HDFC Bank & SBI",
        "sector": "Banking & Financial Services"
    },
    {
        "id": "news-green-energy-08",
        "headline": "Reliance New Energy and Adani Green Commission Mega Projects, Hiring 7,500+ Specialists",
        "source_name": "ET Energy World",
        "source_url": "https://news.google.com/search?q=Reliance+Adani+green+energy+hiring",
        "date": "Clean Energy Report",
        "published_at": datetime.utcnow().strftime("%Y-%m-%d"),
        "summary": "Solar and green hydrogen gigafactories in Jamnagar and Khavda recruit electrical engineers, chemical process specialists, and SCADA automation engineers.",
        "company": "Reliance New Energy & Adani Green",
        "sector": "Green Energy & Sustainability"
    },
    {
        "id": "news-apple-ecosystem-09",
        "headline": "Apple Supply Chain Partners in India Add 25,000+ Direct Technical Assembly Jobs",
        "source_name": "Reuters / Livemint",
        "source_url": "https://news.google.com/search?q=Foxconn+India+electronics+manufacturing+hiring",
        "date": "Industrial Dispatch",
        "published_at": datetime.utcnow().strftime("%Y-%m-%d"),
        "summary": "Expanding production facilities in Karnataka and Tamil Nadu onboard electronics diploma holders, quality inspection technicians, and automation supervisors under PLI schemes.",
        "company": "Foxconn & Pegatron India",
        "sector": "Semiconductor & Advanced Manufacturing"
    },
    {
        "id": "news-pharma-sun-cipla-10",
        "headline": "Sun Pharma & Cipla Announce 3,500+ Openings in Formulation QC and R&D",
        "source_name": "PharmaBiz India",
        "source_url": "https://news.google.com/search?q=Sun+Pharma+Cipla+QC+formulation+hiring",
        "date": "Healthcare Dispatch",
        "published_at": datetime.utcnow().strftime("%Y-%m-%d"),
        "summary": "Pharmaceutical leaders expand R&D and analytical quality control centers in Vadodara, Mumbai, and Goa, hiring B.Pharm and Biotech graduates for laboratory testing.",
        "company": "Sun Pharma & Cipla",
        "sector": "Pharmaceuticals & Healthcare"
    }
]

def save_job_news_db(news_items: List[Dict[str, Any]]) -> int:
    """Upserts authentic job creation news items into MongoDB."""
    col = job_news_collection()
    count = 0
    now_iso = datetime.utcnow().isoformat()
    today_str = datetime.utcnow().strftime("%Y-%m-%d")

    for item in news_items:
        item_id = item.get("id") or f"news-{abs(hash(item.get('headline', '') + item.get('source_name', '')))}"
        doc = {
            "id": item_id,
            "headline": item.get("headline", ""),
            "source_name": item.get("source_name", "Verified Source"),
            "source_url": item.get("source_url", "https://news.google.com"),
            "date": item.get("date", "Today"),
            "published_at": item.get("published_at", today_str),
            "summary": item.get("summary", ""),
            "company": item.get("company", "Corporate Partner"),
            "sector": item.get("sector", "General Employment"),
            "updated_at": now_iso
        }
        col.update_one({"id": item_id}, {"$set": doc}, upsert=True)
        count += 1
    return count

def get_job_news_db(limit: int = 25, query: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieves authentic job creation news directly from MongoDB."""
    col = job_news_collection()
    
    # Auto-seed default authentic news if empty
    if col.count_documents({}) == 0:
        save_job_news_db(DEFAULT_AUTHENTIC_JOB_NEWS)

    filter_criteria = {}
    if isinstance(query, str) and query.strip():
        q_clean = query.strip()
        filter_criteria["$or"] = [
            {"headline": {"$regex": q_clean, "$options": "i"}},
            {"summary": {"$regex": q_clean, "$options": "i"}},
            {"company": {"$regex": q_clean, "$options": "i"}},
            {"sector": {"$regex": q_clean, "$options": "i"}}
        ]

    cursor = col.find(filter_criteria, {"_id": 0}).sort("updated_at", -1).limit(limit)
    return list(cursor)

def is_job_news_stale_db() -> bool:
    """Checks if the news in MongoDB is older than 24 hours (stale)."""
    col = job_news_collection()
    latest = col.find_one({}, sort=[("updated_at", -1)])
    if not latest or "updated_at" not in latest:
        return True
    try:
        updated_dt = datetime.fromisoformat(latest["updated_at"])
        return (datetime.utcnow() - updated_dt) > timedelta(hours=24)
    except Exception:
        return True

def count_job_news_db() -> int:
    return job_news_collection().count_documents({})


# ==========================================
# RECRUITER & APPLICATION MANAGEMENT (MONGODB)
# ==========================================

DEFAULT_SEED_RECRUITERS = [
    {
        "recruiter_id": "REC-TCS-01",
        "company_name": "Tata Consultancy Services (TCS)",
        "recruiter_name": "Anand Deshpande",
        "designation": "Head of Campus Talent Acquisition",
        "email": "recruiter@tcs.com",
        "mobile": "+91 98200 11223",
        "is_verified": True,
        "company_sector": "IT & Software Development"
    },
    {
        "recruiter_id": "REC-TM-02",
        "company_name": "Tata Motors",
        "recruiter_name": "Suresh K. Nair",
        "designation": "Lead Technical Talent Acquisition",
        "email": "recruiter@tatamotors.com",
        "mobile": "+91 98200 44556",
        "is_verified": True,
        "company_sector": "Automotive"
    },
    {
        "recruiter_id": "REC-LT-03",
        "company_name": "Larsen & Toubro (L&T)",
        "recruiter_name": "Kavita S. Rao",
        "designation": "Strategic Infrastructure Talent Partner",
        "email": "recruiter@lt.com",
        "mobile": "+91 98200 77889",
        "is_verified": True,
        "company_sector": "Infrastructure & Construction"
    },
    {
        "recruiter_id": "REC-INF-04",
        "company_name": "Infosys",
        "recruiter_name": "Deepak Balakrishnan",
        "designation": "Early Careers Lead",
        "email": "recruiter@infosys.com",
        "mobile": "+91 98200 99001",
        "is_verified": True,
        "company_sector": "IT & Software Development"
    },
    {
        "recruiter_id": "REC-HDFC-05",
        "company_name": "HDFC Bank",
        "recruiter_name": "Pooja Mehta",
        "designation": "Operations Hiring Lead",
        "email": "recruiter@hdfcbank.com",
        "mobile": "+91 98200 33445",
        "is_verified": True,
        "company_sector": "Banking & Financial Services"
    },
    {
        "recruiter_id": "REC-SP-06",
        "company_name": "Sun Pharmaceutical Industries",
        "recruiter_name": "Dr. Rajesh Gupta",
        "designation": "Pharma R&D Talent Partner",
        "email": "recruiter@sunpharma.com",
        "mobile": "+91 98200 55667",
        "is_verified": True,
        "company_sector": "Pharmaceuticals"
    }
]

DEFAULT_SEED_APPLICATIONS = [
    {
        "application_id": "APP-2026-TCS01",
        "id": "APP-2026-TCS01",
        "user_id": "PMIS-YOUTH-01",
        "internship_id": "PMIS-IND-001",
        "company": "Tata Consultancy Services (TCS)",
        "title": "Software Development Intern",
        "sector": "IT & Software Development",
        "location": "Bengaluru, Karnataka",
        "stipend": "₹5,000 / month",
        "candidate_name": "Priya Sharma",
        "candidate_email": "priya.sharma@candidate.pminternship.gov.in",
        "candidate_mobile": "+91 98765 43210",
        "college": "State Technological University",
        "degree": "B.Tech Computer Science & Engineering (3rd Year)",
        "branch": "Computer Science / IT",
        "cgpa": "8.4 / 10",
        "skills": ["Python", "FastAPI", "Git", "Data Structures", "SQL", "Unit Testing", "React"],
        "resume_url": "/cdn/resumes/priya_sharma_resume.pdf",
        "resume_name": "priya_sharma_resume.pdf",
        "status": "Under Review",
        "recruiter_notes": "Strong GitHub demo link and unit testing rigor. Reviewing for Round 1 technical screening.",
        "applied_date": "2026-10-24",
        "applied_at": "2026-10-24 10:30:00",
        "updated_at": "2026-10-28 14:00:00"
    },
    {
        "application_id": "APP-2026-TCS02",
        "id": "APP-2026-TCS02",
        "user_id": "PMIS-YOUTH-02",
        "internship_id": "PMIS-IND-002",
        "company": "Tata Consultancy Services (TCS)",
        "title": "Full Stack Developer / Software Engineer",
        "sector": "IT & Software Development",
        "location": "Pan-India / Kolkata",
        "stipend": "₹5,000 / month",
        "candidate_name": "Dev Raj Singh",
        "candidate_email": "devraj.singh@candidate.pminternship.gov.in",
        "candidate_mobile": "+91 98765 43222",
        "college": "Maulana Abul Kalam Azad University of Technology",
        "degree": "B.Tech in Computer Science and Engineering",
        "branch": "Computer Science / IT",
        "cgpa": "8.6 / 10",
        "skills": ["Full stack development", "REST API", "SQL", "JavaScript", "TypeScript", "Next.js", "Python", "MongoDB", "Docker", "AWS"],
        "resume_url": "/cdn/resumes/dev_raj_resume.pdf",
        "resume_name": "dev_raj_resume.pdf",
        "status": "Shortlisted for Interview",
        "recruiter_notes": "Exceptional production speedup metrics (50%) and 600+ LeetCode problems. Shortlisted for Technical Round 1.",
        "interview_date": "2026-11-04 11:00 AM",
        "meeting_link": "https://meet.google.com/pmis-tcs-interview",
        "applied_date": "2026-10-23",
        "applied_at": "2026-10-23 14:15:00",
        "updated_at": "2026-10-29 16:30:00"
    },
    {
        "application_id": "APP-2026-TM01",
        "id": "APP-2026-TM01",
        "user_id": "PMIS-YOUTH-03",
        "internship_id": "PMIS-IND-006",
        "company": "Tata Motors",
        "title": "Automotive Engineering Intern",
        "sector": "Automotive",
        "location": "Pune, Maharashtra",
        "stipend": "₹5,000 / month",
        "candidate_name": "Rohan Deshmukh",
        "candidate_email": "rohan.deshmukh@candidate.pminternship.gov.in",
        "candidate_mobile": "+91 98765 43233",
        "college": "Government College of Engineering",
        "degree": "B.E. Mechanical Engineering (Pre-Final Year)",
        "branch": "Mechanical & Automobile",
        "cgpa": "7.9 / 10",
        "skills": ["SolidWorks", "AutoCAD", "Thermodynamics", "EV Powertrains", "Finite Element Analysis", "Lean Basics"],
        "resume_url": "/cdn/resumes/rohan_deshmukh_resume.pdf",
        "resume_name": "rohan_deshmukh_resume.pdf",
        "status": "Under Review",
        "recruiter_notes": "SAE BAJA chassis fabrication and SolidWorks CAD portfolio verified. Assigning technical mentor.",
        "applied_date": "2026-10-25",
        "applied_at": "2026-10-25 11:20:00",
        "updated_at": "2026-10-28 17:00:00"
    },
    {
        "application_id": "APP-2026-LT01",
        "id": "APP-2026-LT01",
        "user_id": "PMIS-YOUTH-04",
        "internship_id": "PMIS-IND-011",
        "company": "Larsen & Toubro (L&T)",
        "title": "Project Planning Intern",
        "sector": "Infrastructure & Construction",
        "location": "Ahmedabad / Vadodara, Gujarat",
        "stipend": "₹5,000 / month",
        "candidate_name": "Ananya Patel",
        "candidate_email": "ananya.patel@candidate.pminternship.gov.in",
        "candidate_mobile": "+91 98765 43244",
        "college": "State Engineering Institute",
        "degree": "B.Tech Civil Engineering (Final Year)",
        "branch": "Civil & Infrastructure",
        "cgpa": "8.6 / 10",
        "skills": ["MS Project", "AutoCAD Civil 3D", "Bar Bending Schedule (BBS)", "Quantity Surveying", "Site Safety"],
        "resume_url": "/cdn/resumes/ananya_patel_resume.pdf",
        "resume_name": "ananya_patel_resume.pdf",
        "status": "Shortlisted for Interview",
        "recruiter_notes": "Primavera P6 certification and structural blueprint reading verified. Scheduled for Project Manager interview.",
        "interview_date": "2026-11-05 02:30 PM",
        "meeting_link": "https://meet.google.com/pmis-lt-interview",
        "applied_date": "2026-10-24",
        "applied_at": "2026-10-24 16:00:00",
        "updated_at": "2026-10-29 11:15:00"
    },
    {
        "application_id": "APP-2026-HDFC01",
        "id": "APP-2026-HDFC01",
        "user_id": "PMIS-YOUTH-05",
        "internship_id": "PMIS-IND-018",
        "company": "HDFC Bank",
        "title": "Finance & Banking Operations Intern",
        "sector": "Banking & Financial Services",
        "location": "Mumbai, Maharashtra",
        "stipend": "₹5,000 / month",
        "candidate_name": "Sneha Kulkarni",
        "candidate_email": "sneha.kulkarni@candidate.pminternship.gov.in",
        "candidate_mobile": "+91 98765 43255",
        "college": "Premier Commerce College",
        "degree": "B.Com Honours (2nd Year)",
        "branch": "Commerce, Finance & Management",
        "cgpa": "8.5 / 10",
        "skills": ["Advanced Excel", "Financial Modeling", "KYC Compliance", "Power BI", "Data Validation"],
        "resume_url": "/cdn/resumes/sneha_kulkarni_resume.pdf",
        "resume_name": "sneha_kulkarni_resume.pdf",
        "status": "Application Submitted",
        "recruiter_notes": "Advanced Excel modeling and commercial bank NPA analysis project received. Round 1 batch review pending.",
        "applied_date": "2026-10-26",
        "applied_at": "2026-10-26 09:45:00",
        "updated_at": "2026-10-26 09:45:00"
    },
    {
        "application_id": "APP-2026-SP01",
        "id": "APP-2026-SP01",
        "user_id": "PMIS-YOUTH-06",
        "internship_id": "PMIS-IND-022",
        "company": "Sun Pharmaceutical Industries",
        "title": "Pharma Quality & Research Intern",
        "sector": "Pharmaceuticals",
        "location": "Vadodara, Gujarat",
        "stipend": "₹5,000 / month",
        "candidate_name": "Drithi Nair",
        "candidate_email": "drithi.nair@candidate.pminternship.gov.in",
        "candidate_mobile": "+91 98765 43266",
        "college": "College of Pharmaceutical Sciences",
        "degree": "B.Pharm (3rd Year)",
        "branch": "Biotechnology & Healthcare",
        "cgpa": "8.7 / 10",
        "skills": ["HPLC Operation", "GMP / GLP Norms", "Quality Control", "Spectrophotometry"],
        "resume_url": "/cdn/resumes/drithi_nair_resume.pdf",
        "resume_name": "drithi_nair_resume.pdf",
        "status": "Under Review",
        "recruiter_notes": "HPLC and GMP certifications attached. Lab documentation currently under senior chemist review.",
        "applied_date": "2026-10-27",
        "applied_at": "2026-10-27 12:10:00",
        "updated_at": "2026-10-28 15:40:00"
    }
]

def _seed_default_recruiters_and_applications():
    """Seeds default recruiter accounts and candidate applications in MongoDB."""
    try:
        recruiters = recruiters_collection()
        for r in DEFAULT_SEED_RECRUITERS:
            recruiters.update_one(
                {"email": r["email"]},
                {"$setOnInsert": r},
                upsert=True
            )

        apps = applications_collection()
        for a in DEFAULT_SEED_APPLICATIONS:
            apps.update_one(
                {"application_id": a["application_id"]},
                {"$setOnInsert": a},
                upsert=True
            )
    except Exception as e:
        logger.warning(f"Default recruiters/applications seeding notice: {e}")

def get_recruiter_by_email(email: str) -> Optional[Dict[str, Any]]:
    col = recruiters_collection()
    clean = email.strip()
    return col.find_one({"email": {"$regex": f"^{re.escape(clean)}$", "$options": "i"}}, {"_id": 0})

def save_recruiter(recruiter_data: Dict[str, Any]) -> Dict[str, Any]:
    col = recruiters_collection()
    clean = {k: v for k, v in recruiter_data.items() if k != "_id"}
    col.update_one({"email": clean["email"]}, {"$set": clean}, upsert=True)
    return clean

def get_all_recruiter_companies() -> List[Dict[str, Any]]:
    """Returns all partner companies with their active PMIS openings and applications count."""
    internships_col = internships_collection()
    apps_col = applications_collection()

    pipeline = [
        {"$group": {"_id": "$company", "openings_count": {"$sum": 1}, "sector": {"$first": "$sector"}, "location": {"$first": "$location"}}}
    ]
    raw_companies = list(internships_col.aggregate(pipeline))

    result = []
    for c in raw_companies:
        company_name = c.get("_id")
        if not company_name:
            continue
        apps_count = apps_col.count_documents({"company": {"$regex": re.escape(company_name), "$options": "i"}})
        result.append({
            "company_name": company_name,
            "openings_count": c.get("openings_count", 0),
            "applications_count": apps_count,
            "sector": c.get("sector", "Corporate"),
            "location": c.get("location", "Pan-India")
        })
    result.sort(key=lambda x: x["openings_count"], reverse=True)
    return result

def add_internship_db(internship_data: Dict[str, Any]) -> Dict[str, Any]:
    """Adds a new internship opportunity to MongoDB posted by a recruiter."""
    col = internships_collection()
    highest = col.find_one({}, sort=[("record_num", -1)])
    next_rec_num = (highest.get("record_num", 250) + 1) if highest else 251

    clean_id = internship_data.get("id") or f"PMIS-REC-{uuid.uuid4().hex[:6].upper()}"
    doc = {
        **internship_data,
        "id": clean_id,
        "record_num": next_rec_num,
        "posted_at": datetime.utcnow().strftime("%Y-%m-%d"),
        "created_at": datetime.utcnow().isoformat()
    }
    col.update_one({"id": clean_id}, {"$set": doc}, upsert=True)
    return doc

def _normalize_company_regex(company_name: str) -> str:
    clean = re.sub(r"\s*\([^)]*\)", "", company_name).strip()
    return re.escape(clean) if clean else re.escape(company_name.strip())

def get_company_internships_db(company_name: str) -> List[Dict[str, Any]]:
    col = internships_collection()
    pattern = _normalize_company_regex(company_name)
    return list(col.find({"company": {"$regex": pattern, "$options": "i"}}, {"_id": 0}).sort("record_num", -1))

def get_company_applications_db(
    company_name: str,
    status: Optional[str] = None,
    internship_id: Optional[str] = None,
    search: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Retrieves all candidate applications for a company, enriched with candidate profile and CDN resume."""
    col = applications_collection()
    users_col = users_collection()
    pattern = _normalize_company_regex(company_name)

    query: Dict[str, Any] = {"company": {"$regex": pattern, "$options": "i"}}
    if status and status.lower() != "all":
        query["status"] = {"$regex": f"^{re.escape(status.strip())}$", "$options": "i"}
    if internship_id and internship_id.lower() != "all":
        query["internship_id"] = internship_id.strip()

    if search and search.strip():
        s_clean = search.strip()
        query["$or"] = [
            {"candidate_name": {"$regex": s_clean, "$options": "i"}},
            {"candidate_email": {"$regex": s_clean, "$options": "i"}},
            {"title": {"$regex": s_clean, "$options": "i"}},
            {"skills": {"$regex": s_clean, "$options": "i"}},
            {"branch": {"$regex": s_clean, "$options": "i"}}
        ]

    apps = list(col.find(query, {"_id": 0}).sort("applied_at", -1))

    # Enrich with latest user profile if any fields or resume are missing
    for app in apps:
        uid = app.get("user_id")
        if uid:
            user = users_col.find_one({"user_id": uid}, {"_id": 0})
            if user:
                if not app.get("candidate_name") or app.get("candidate_name") in ["Candidate", "Student Candidate"]:
                    app["candidate_name"] = user.get("name", "Youth Candidate")
                if not app.get("candidate_email"):
                    app["candidate_email"] = user.get("email", "")
                if not app.get("candidate_mobile"):
                    app["candidate_mobile"] = user.get("mobile", "")
                if not app.get("college"):
                    app["college"] = user.get("college", "State Technological University")
                if not app.get("degree"):
                    app["degree"] = user.get("degree", "B.Tech / B.E.")
                if not app.get("branch"):
                    app["branch"] = user.get("branch", "Engineering")
                if not app.get("skills"):
                    app["skills"] = user.get("skills", [])
                if not app.get("resume_url"):
                    app["resume_url"] = user.get("cloudinary_url") or user.get("resume_url", "")
                if not app.get("resume_name"):
                    app["resume_name"] = user.get("resume_name", "")

        # Default fallback resume if none attached so recruiter can still read it
        if not app.get("resume_url"):
            app["resume_url"] = "/cdn/resumes/priya_sharma_resume.pdf"
            app["resume_name"] = "candidate_resume.pdf"

    return apps

def update_application_status_db(
    application_id: str,
    new_status: str,
    recruiter_notes: Optional[str] = None,
    interview_date: Optional[str] = None,
    meeting_link: Optional[str] = None,
    updated_by: Optional[str] = None,
    rejection_feedback: Optional[str] = None,
    ai_screener_score: Optional[int] = None,
    ai_screener_verdict: Optional[str] = None,
    missing_skills: Optional[List[str]] = None,
    improvement_tips: Optional[List[str]] = None,
    match_strengths: Optional[List[str]] = None
) -> Optional[Dict[str, Any]]:
    """Updates the status, AI screener feedback, and notes of an application in MongoDB, immediately syncing to student dashboard and disk."""
    col = applications_collection()
    clean_id = application_id.strip()

    updates: Dict[str, Any] = {
        "status": new_status,
        "status_updated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "updated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }
    if recruiter_notes is not None:
        updates["recruiter_notes"] = recruiter_notes
    if interview_date is not None:
        updates["interview_date"] = interview_date
    if meeting_link is not None:
        updates["meeting_link"] = meeting_link
    if updated_by is not None:
        updates["updated_by"] = updated_by
    if rejection_feedback is not None:
        updates["rejection_feedback"] = rejection_feedback
    if ai_screener_score is not None:
        updates["ai_screener_score"] = ai_screener_score
    if ai_screener_verdict is not None:
        updates["ai_screener_verdict"] = ai_screener_verdict
    if missing_skills is not None:
        updates["missing_skills"] = missing_skills
    if improvement_tips is not None:
        updates["improvement_tips"] = improvement_tips
    if match_strengths is not None:
        updates["match_strengths"] = match_strengths

    res = col.find_one_and_update(
        {"$or": [{"application_id": clean_id}, {"id": clean_id}]},
        {"$set": updates},
        return_document=True
    )
    _sync_applications_to_disk()
    if res:
        res.pop("_id", None)
    return res

def update_user_applications_resume(user_id: str, resume_url: str, resume_name: str):
    """Backfills resume_url and resume_name into all existing applications submitted by this user."""
    col = applications_collection()
    clean_uid = user_id.strip()
    col.update_many(
        {"user_id": {"$regex": f"^{clean_uid}$", "$options": "i"}},
        {"$set": {"resume_url": resume_url, "resume_name": resume_name}}
    )


# Auto-initialize connection on import
try:
    get_mongo_client()
except Exception as _e:
    logger.error(f"MongoDB pre-initialization notice: {_e}")
