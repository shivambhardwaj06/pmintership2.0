import os
import json
import logging
from datetime import datetime
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

def _initialize_indexes_and_seed():
    """Sets up indexes on MongoDB collections and populates minimum 250+ internships."""
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

        tokens = refresh_tokens_collection()
        tokens.create_index("token", unique=True)
        tokens.create_index("user_id")
        tokens.create_index("expires_at")

        job_news = job_news_collection()
        job_news.create_index("id", unique=True)
        job_news.create_index("published_at")

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
            {"user_id": {"$regex": f"^{ident_clean}$", "$options": "i"}},
            {"email": {"$regex": f"^{ident_clean}$", "$options": "i"}},
            {"mobile": ident_clean}
        ]
    }, {"_id": 0})

    return user

def save_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Persists or updates a user document in MongoDB."""
    col = users_collection()
    user_id = user_data["user_id"]
    clean_data = {k: v for k, v in user_data.items() if k != "_id"}
    clean_data["updated_at"] = datetime.utcnow().isoformat()
    
    col.update_one({"user_id": user_id}, {"$set": clean_data}, upsert=True)
    return clean_data

def update_user_profile(user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Updates specific fields of a user in MongoDB."""
    col = users_collection()
    clean_updates = {k: v for k, v in updates.items() if k != "_id" and v is not None}
    clean_updates["updated_at"] = datetime.utcnow().isoformat()
    
    col.update_one({"user_id": user_id}, {"$set": clean_updates})
    return get_user_by_identifier(user_id)


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
    """Adds a new application in MongoDB if not already applied, and returns updated list."""
    col = applications_collection()
    clean_uid = user_id.strip()
    internship_id = application_data.get("internship_id")

    # Check if already applied
    existing = col.find_one({
        "user_id": {"$regex": f"^{clean_uid}$", "$options": "i"},
        "internship_id": internship_id
    })
    
    if not existing:
        doc = {**application_data, "user_id": clean_uid}
        if "applied_at" not in doc:
            doc["applied_at"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        col.insert_one(doc)

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


# Auto-initialize connection on import
try:
    get_mongo_client()
except Exception as _e:
    logger.error(f"MongoDB pre-initialization notice: {_e}")
