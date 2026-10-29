import logging
from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from app.db import get_all_internships_db, get_internship_by_id_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/internships", tags=["Internships"])


@router.get("")
def list_internships(
    q: Optional[str] = Query(None, description="Search keyword in company, title, skills"),
    sector: Optional[str] = Query(None, description="Sector filter"),
    state: Optional[str] = Query(None, description="State filter"),
    mode: Optional[str] = Query(None, description="Work mode filter (Hybrid, On-site, Remote)"),
    limit: int = Query(300, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    """Lists and filters official PM Internship Scheme records directly from MongoDB."""
    data = get_all_internships_db(
        query=q,
        sector=sector,
        state=state,
        mode=mode,
        limit=limit,
        offset=offset
    )
    return data


@router.get("/{rec_id}")
def get_internship_detail(rec_id: str):
    """Fetches full record for a specific internship by ID directly from MongoDB."""
    record = get_internship_by_id_db(rec_id)
    if record:
        return record
    raise HTTPException(status_code=404, detail="Internship not found in MongoDB database")
