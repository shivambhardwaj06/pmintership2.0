import sys
import os
import io

sys.path.insert(0, os.path.dirname(__file__))

from fastapi.testclient import TestClient
from app.main import app

def test_full_portal_flow():
    with TestClient(app) as client:
        print("==================================================")
        print("1. Testing Health & Status")
        res = client.get("/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("[PASS] Health check OK:", res.json())

        print("\n2. Testing Real-Time Registration & Login")
        reg_payload = {
            "mobile": "9876543210",
            "is_unique_confirmed": True,
            "name": "Arjun Patel",
            "password": "SecurePassword123"
        }
        res = client.post("/api/auth/register", json=reg_payload)
        assert res.status_code == 200, f"Register failed: {res.text}"
        user_id = res.json()["user_id"]
        print(f"[PASS] Registered candidate with User ID: {user_id}")

        login_res = client.post("/api/auth/login", json={"username_or_mobile": "9876543210", "password": "SecurePassword123"})
        assert login_res.status_code == 200
        print("[PASS] Login successful for registered mobile")

        print("\n3. Testing Real-Time Google OAuth 2.0")
        google_res = client.post("/api/auth/google", json={
            "email": "student.vikram@gmail.com",
            "name": "Vikram Singh",
            "picture": "https://lh3.googleusercontent.com/sample"
        })
        assert google_res.status_code == 200
        g_user = google_res.json()["user"]
        print(f"[PASS] Google OAuth user created: {g_user['name']} ({g_user['user_id']})")

        print("\n4. Testing Profile Update")
        update_res = client.put(f"/api/user/profile?user_id={user_id}", json={
            "branch": "Computer Science & Engineering",
            "degree": "B.Tech Computer Science",
            "college": "National Institute of Technology",
            "state": "Karnataka",
            "career_goals": "Seeking a 12-month corporate internship in full-stack AI development.",
            "skills": ["Python", "FastAPI", "React", "PostgreSQL", "Git"]
        })
        assert update_res.status_code == 200
        print("[PASS] Profile updated with branch and goals:", update_res.json()["user"]["branch"])

        print("\n5. Testing PDF Resume Upload & Multi-page Support (Zero Barriers)")
        # Generate a dummy test PDF in memory using pypdf
        from pypdf import PdfWriter
        writer_1 = PdfWriter()
        writer_1.add_blank_page(width=612, height=792)
        pdf_stream_1 = io.BytesIO()
        writer_1.write(pdf_stream_1)
        pdf_bytes_1 = pdf_stream_1.getvalue()

        upload_res = client.post(
            f"/api/user/upload-resume",
            data={"user_id": user_id},
            files={"file": ("candidate_resume.pdf", pdf_bytes_1, "application/pdf")}
        )
        assert upload_res.status_code == 200, f"Resume upload failed: {upload_res.text}"
        upload_data = upload_res.json()
        print("[PASS] Resume accepted & processed!")
        print(f"  CDN URL: {upload_data['cloudinary_url']}")
        print(f"  AI Resume Score: {upload_data['analysis']['resume_score']}/100")

        # Now verify multi-page PDF is seamlessly accepted without any page restriction
        writer_multi = PdfWriter()
        writer_multi.add_blank_page(width=612, height=792)
        writer_multi.add_blank_page(width=612, height=792)
        pdf_stream_multi = io.BytesIO()
        writer_multi.write(pdf_stream_multi)
        pdf_bytes_multi = pdf_stream_multi.getvalue()

        multi_res = client.post(
            f"/api/user/upload-resume",
            data={"user_id": user_id},
            files={"file": ("multi_page_resume.pdf", pdf_bytes_multi, "application/pdf")}
        )
        assert multi_res.status_code == 200, f"Multi-page resume should be accepted without restriction! {multi_res.text}"
        print(f"[PASS] Multi-page resume successfully processed (No page barrier)! Status: {multi_res.status_code}")

        print("\n6. Testing Branch-Filtered Shortlisted Resumes (9 Academic Disciplines)")
        branches_to_check = [
            "Computer Science / IT",
            "Mechanical & Automobile",
            "Electrical & Electronics (ECE / EEE)",
            "Civil & Infrastructure",
            "Chemical & Materials",
            "Commerce, Finance & Management",
            "Biotechnology & Healthcare",
            "Mining & Metallurgy",
            "Agriculture & Life Sciences"
        ]
        for b in branches_to_check:
            res = client.get(f"/api/resumes/selected?branch={b}")
            assert res.status_code == 200
            resumes = res.json()["resumes"]
            assert len(resumes) >= 1, f"No resume found for branch: {b}"
            print(f"  [PASS] Found {len(resumes)} shortlist template(s) for branch '{b}': {resumes[0]['candidate']} at {resumes[0]['company']}")

        print("\n8. Testing Real-Time Application Submission")
        apply_res = client.post(f"/api/user/apply?user_id={user_id}", json={
            "internship_id": "PMIS-001",
            "company": "Tata Consultancy Services",
            "title": "Software Development Intern",
            "notes": "Applied via PM Internship Portal"
        })
        assert apply_res.status_code == 200
        print("[PASS] Real-time Application Submitted:", apply_res.json()["application"]["status"])

        apps_list = client.get(f"/api/user/applications?user_id={user_id}")
        assert apps_list.status_code == 200
        assert len(apps_list.json()["applications"]) >= 1
        print(f"[PASS] Candidate now has {len(apps_list.json()['applications'])} tracked application(s)")

        print("\n8. Testing Disha AI Guidance Chatbot")
        chat_res = client.post("/api/chat", json={
            "message": "How do I audit my resume and find internships?",
            "history": [],
            "top_k": 3
        })
        assert chat_res.status_code == 200
        chat_answer = chat_res.json()["answer"]
        assert "Disha" in chat_answer or "resume" in chat_answer.lower() or "Dashboard" in chat_answer
        clean_preview = chat_answer[:120].encode("ascii", "ignore").decode("ascii")
        print("[PASS] Disha AI Answer received successfully!")
        print(f"  Preview: {clean_preview}...")

        print("\n==================================================")
        print("ALL ENDPOINTS AND VALIDATIONS PASSED PERFECTLY!")
        print("==================================================")

if __name__ == "__main__":
    test_full_portal_flow()
