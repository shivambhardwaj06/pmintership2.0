import json
import os
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

# Determine persistent data directory
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

USERS_FILE = DATA_DIR / "users_store.json"
APPLICATIONS_FILE = DATA_DIR / "applications_store.json"

def _read_json(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error reading {path}: {e}")
        return {}

def _write_json(path: Path, data: Any):
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Error writing to {path}: {e}")

# ==========================================
# USER STORAGE
# ==========================================

def get_all_users() -> Dict[str, Dict[str, Any]]:
    return _read_json(USERS_FILE)

def get_user_by_identifier(ident: str) -> Optional[Dict[str, Any]]:
    ident_clean = ident.strip().lower()
    users = get_all_users()
    for uid, u in users.items():
        if (
            uid.lower() == ident_clean or
            u.get("mobile", "").strip().lower() == ident_clean or
            u.get("email", "").strip().lower() == ident_clean or
            u.get("user_id", "").strip().lower() == ident_clean
        ):
            return u
    return None

def save_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    users = get_all_users()
    user_id = user_data["user_id"]
    users[user_id] = user_data
    _write_json(USERS_FILE, users)
    return user_data

# ==========================================
# APPLICATION STORAGE
# ==========================================

def get_all_applications() -> Dict[str, List[Dict[str, Any]]]:
    return _read_json(APPLICATIONS_FILE)

def get_user_applications(user_id: str) -> List[Dict[str, Any]]:
    apps = get_all_applications()
    # Case-insensitive match on user_id
    for uid, app_list in apps.items():
        if uid.lower() == user_id.strip().lower():
            return app_list
    return []

def add_user_application(user_id: str, application_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    apps = get_all_applications()
    normalized_uid = user_id.strip()
    
    current_apps = apps.get(normalized_uid, [])
    # Check if already applied
    for existing in current_apps:
        if existing.get("internship_id") == application_data.get("internship_id"):
            return current_apps
            
    current_apps.insert(0, application_data)
    apps[normalized_uid] = current_apps
    _write_json(APPLICATIONS_FILE, apps)
    return current_apps
