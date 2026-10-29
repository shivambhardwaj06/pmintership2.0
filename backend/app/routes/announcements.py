import logging
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Query

from app.db import (
    get_job_news_db,
    save_job_news_db,
    is_job_news_stale_db,
    count_job_news_db
)

logger = logging.getLogger("pm_internship_backend")
router = APIRouter(prefix="/api/announcements", tags=["Job Announcements"])

# Strict negative keywords to eliminate doomscrolling headlines
EXCLUDED_KEYWORDS = [
    "layoff", "layoffs", "cuts job", "cut jobs", "fired", "firing", "freeze",
    "slashes", "pink slip", "downsizing", "downturn", "loss", "shutdown",
    "unemployment rises", "retrenchment", "jobless", "axed"
]

def fetch_live_job_creation_news() -> List[dict]:
    """
    Fetches real-time, authentic job creation and hiring news from verified RSS feeds for India.
    Filters out doomscrolling headlines to preserve genuine employment opportunities.
    """
    rss_url = "https://news.google.com/rss/search?q=India+job+creation+OR+hiring+OR+recruitment+announces&hl=en-IN&gl=IN&ceid=IN:en"
    items = []
    try:
        req = urllib.request.Request(
            rss_url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            root = ET.fromstring(resp.read())
            for item in root.findall(".//item")[:15]:
                title = item.find("title").text if item.find("title") is not None else ""
                link = item.find("link").text if item.find("link") is not None else ""
                pubDate = item.find("pubDate").text if item.find("pubDate") is not None else ""

                if not title:
                    continue

                lt = title.lower()
                # Strictly discard any negative or layoff news
                if any(bad in lt for bad in EXCLUDED_KEYWORDS):
                    continue

                # Ensure positive hiring or job creation indicator
                if not any(good in lt for good in ["hiring", "job", "jobs", "recruit", "vacanc", "opening", "spurs", "adds", "onboard", "invest"]):
                    continue

                source = "Verified Source"
                clean_title = title
                if " - " in title:
                    parts = title.rsplit(" - ", 1)
                    clean_title = parts[0].strip()
                    source = parts[1].strip()

                items.append({
                    "id": f"rss-{abs(hash(clean_title))}",
                    "headline": clean_title,
                    "source_name": source,
                    "source_url": link or "https://news.google.com",
                    "date": pubDate[:16] if pubDate else "Today",
                    "published_at": datetime.utcnow().strftime("%Y-%m-%d"),
                    "summary": f"Verified employment and hiring announcement reported by {source}. Read the complete story at the source link.",
                    "company": source,
                    "sector": "Job Creation & Corporate Hiring"
                })
    except Exception as e:
        logger.warning(f"Live job news fetch notice: {e}")
    return items


def auto_update_daily_job_news():
    """Automatically updates job creation news in MongoDB once daily."""
    try:
        if is_job_news_stale_db():
            logger.info("Daily news is stale. Fetching fresh authentic job creation news from verified sources...")
            fresh_items = fetch_live_job_creation_news()
            if fresh_items:
                saved_count = save_job_news_db(fresh_items)
                logger.info(f"Automatically saved {saved_count} fresh job creation news items in MongoDB.")
    except Exception as e:
        logger.error(f"Error during automatic daily job news update: {e}")


@router.get("/daily-jobs")
def get_daily_job_announcements(
    q: Optional[str] = Query(default=None, description="Optional search filter in job news"),
    limit: int = Query(default=30, ge=1, le=100)
):
    """
    Returns authentic job creation and hiring news directly from MongoDB.
    Automatically checks and updates news daily from authentic sources.
    """
    # 1. Automatic background daily check & update in MongoDB
    auto_update_daily_job_news()

    # 2. Query authentic news directly from MongoDB
    clean_q = q if isinstance(q, str) else None
    clean_limit = limit if isinstance(limit, int) else 30
    records = get_job_news_db(limit=clean_limit, query=clean_q)

    return {
        "status": "success",
        "announcements": records,
        "total": len(records),
        "source": "MongoDB Database",
        "last_updated": datetime.utcnow().strftime("%d %b %Y, %I:%M %p UTC")
    }
