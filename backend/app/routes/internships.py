import json
import logging
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/internships", tags=["Internships"])

DATA_FILE = Path(__file__).parent.parent.parent / "data" / "pm_internships_120.json"


def load_internships() -> List[dict]:
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


@router.get("")
def list_internships(
    q: Optional[str] = Query(None, description="Search keyword in company, title, skills"),
    sector: Optional[str] = Query(None, description="Sector filter"),
    state: Optional[str] = Query(None, description="State filter"),
    mode: Optional[str] = Query(None, description="Work mode filter (Hybrid, On-site, Remote)"),
    limit: int = Query(120, ge=1, le=200),
    offset: int = Query(0, ge=0)
):
    """Lists and filters official 120 PM Internship Scheme records."""
    records = load_internships()

    filtered = records
    if q:
        lq = q.lower().strip()
        filtered = [
            r for r in filtered
            if lq in r["company"].lower()
            or lq in r["title"].lower()
            or lq in r["sector"].lower()
            or lq in r["skills"].lower()
            or lq in r["location"].lower()
        ]

    if sector and sector.lower() != "all":
        filtered = [r for r in filtered if r["sector"].lower() == sector.lower()]

    if state and state.lower() != "all":
        filtered = [r for r in filtered if r["state"].lower() == state.lower() or state.lower() in r["location"].lower()]

    if mode and mode.lower() != "all":
        filtered = [r for r in filtered if mode.lower() in r["mode"].lower()]

    total = len(filtered)
    paged = filtered[offset: offset + limit]

    return {
        "total": total,
        "offset": offset,
        "limit": limit,
        "results": paged
    }


@router.get("/{rec_id}")
def get_internship_detail(rec_id: str):
    """Fetches full record for a specific internship by ID."""
    records = load_internships()
    for r in records:
        if r["id"].lower() == rec_id.lower() or str(r.get("record_num")) == rec_id:
            return r
    raise HTTPException(status_code=404, detail="Internship not found")
