import sys
sys.path.insert(0, "backend")

from fastapi.testclient import TestClient
from app.main import app
from app.db import get_company_applications_db, internships_collection

client = TestClient(app)

def test_recruiter_pipeline():
    print("\n--- 1. Testing Recruiter Companies List ---")
    res = client.get("/api/recruiter/companies")
    assert res.status_code == 200, res.text
    data = res.json()
    print(f"Total Companies: {data['total']}")
    assert data["total"] > 0
    tcs = next((c for c in data["companies"] if "tata consultancy" in c["company_name"].lower() or "tcs" in c["company_name"].lower()), None)
    assert tcs is not None
    print(f"Found TCS company: {tcs}")

    print("\n--- 2. Testing Recruiter Login (TCS Recruiter) ---")
    login_res = client.post("/api/recruiter/login", json={
        "email": "recruiter@tcs.com",
        "password": "Pmis@2026",
        "company_name": tcs["company_name"]
    })
    assert login_res.status_code == 200, login_res.text
    login_data = login_res.json()
    token = login_data["access_token"]
    recruiter = login_data["recruiter"]
    print(f"Logged in recruiter: {recruiter['recruiter_name']} for {recruiter['company_name']}")

    print("\n--- 3. Testing Recruiter Stats ---")
    stats_res = client.get(f"/api/recruiter/stats?company={tcs['company_name']}")
    assert stats_res.status_code == 200, stats_res.text
    stats = stats_res.json()
    print(f"TCS Stats: Openings={stats['openings_count']}, Total Apps={stats['total_applications']}")
    assert stats["total_applications"] >= 2

    print("\n--- 4. Testing Recruiter Applications & CDN Resumes ---")
    apps_res = client.get(f"/api/recruiter/applications?company={tcs['company_name']}")
    assert apps_res.status_code == 200, apps_res.text
    apps_data = apps_res.json()
    print(f"Fetched {apps_data['total']} applications for TCS.")
    assert len(apps_data["applications"]) >= 2
    app1 = apps_data["applications"][0]
    print(f"Candidate: {app1['candidate_name']} ({app1['candidate_email']})")
    print(f"Resume CDN URL: {app1['resume_url']}")
    print(f"Initial Status: {app1['status']}")
    assert "resume" in app1["resume_url"]

    # Verify CDN PDF is accessible via HTTP
    cdn_res = client.get(app1["resume_url"])
    print(f"CDN PDF GET status: {cdn_res.status_code} (Length: {len(cdn_res.content)} bytes)")
    assert cdn_res.status_code == 200

    print("\n--- 5. Testing Update Application Status ---")
    app_id = app1.get("application_id") or app1.get("id")
    update_res = client.put(f"/api/recruiter/applications/{app_id}/status", json={
        "status": "Shortlisted for Interview",
        "recruiter_notes": "Impressive Python & full-stack projects. Technical interview scheduled.",
        "interview_date": "2026-11-04 11:30 AM",
        "meeting_link": "https://meet.google.com/pmis-interview-tcs"
    })
    assert update_res.status_code == 200, update_res.text
    updated_app = update_res.json()["application"]
    print(f"Updated status: {updated_app['status']}")
    print(f"Recruiter Notes: {updated_app['recruiter_notes']}")
    assert updated_app["status"] == "Shortlisted for Interview"

    print("\n--- 6. Verifying Update Displays in User Dashboard Section ---")
    user_id = app1["user_id"]
    user_apps_res = client.get(f"/api/user/applications?user_id={user_id}")
    assert user_apps_res.status_code == 200, user_apps_res.text
    user_apps = user_apps_res.json()["applications"]
    synced_app = next((a for a in user_apps if a.get("application_id") == app_id or a.get("id") == app_id), None)
    assert synced_app is not None
    print(f"Candidate's view of application status: {synced_app['status']}")
    print(f"Candidate's view of recruiter notes: {synced_app.get('recruiter_notes')}")
    assert synced_app["status"] == "Shortlisted for Interview"

    print("\n--- 7. Testing Post New Internship by Recruiter ---")
    post_res = client.post("/api/recruiter/internships", json={
        "title": "Cloud DevOps & Platform Automation Intern",
        "company": "Tata Consultancy Services (TCS)",
        "sector": "IT & Software Development",
        "location": "Bengaluru, Karnataka",
        "mode": "Hybrid",
        "stipend": "₹6,000 / month",
        "duration": "12 Months",
        "vacancies": 20,
        "skills": ["Kubernetes", "Docker", "Terraform", "Python", "CI/CD"],
        "eligibility": "B.Tech / MCA (2025/2026 Batch)",
        "description": "Work with TCS enterprise cloud engineering teams managing hybrid infrastructure."
    })
    assert post_res.status_code == 200, post_res.text
    new_job = post_res.json()["internship"]
    print(f"New internship created: ID={new_job['id']}, Title={new_job['title']}")
    assert new_job["company"] == "Tata Consultancy Services (TCS)"

    print("\nALL RECRUITER PORTAL BACKEND TESTS PASSED SUCCESSFULLY! 100% OK.")

if __name__ == "__main__":
    test_recruiter_pipeline()
