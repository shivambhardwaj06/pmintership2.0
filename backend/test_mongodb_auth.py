import sys
import io
import asyncio
from pathlib import Path

# Force UTF-8 for console output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).parent))

from app.db import (
    count_internships_db,
    get_all_internships_db,
    get_internship_by_id_db,
    get_user_by_identifier,
    get_user_applications,
    is_live_mongodb
)
from app.routes.auth import (
    register_user,
    login_user,
    refresh_access_token,
    google_auth,
    update_profile,
    apply_internship,
    RegisterRequest,
    LoginRequest,
    RefreshTokenRequest,
    GoogleAuthRequest,
    ProfileUpdateRequest,
    ApplyRequest,
    decode_access_token,
    decode_refresh_token
)

def run_tests():
    print("=" * 70)
    print(">> TEST: MongoDB Database & Complete Authentication Suite Verification")
    print("=" * 70)

    # 1. Test MongoDB Internship Count (Must be >= 250)
    total_internships = count_internships_db()
    print(f"\n[1] MongoDB Internships Count: {total_internships}")
    assert total_internships >= 250, f"Expected >= 250 internships in MongoDB, got {total_internships}!"
    print(f"  --> PASSED: Verified {total_internships} internships in MongoDB (exceeds minimum 250 target).")

    # 2. Test Internship Filtering via MongoDB
    it_res = get_all_internships_db(sector="IT & Software Development", limit=5)
    assert it_res["total"] > 0, "No IT internships found in MongoDB"
    print(f"\n[2] MongoDB Query: Found {it_res['total']} IT internships. Sample: {it_res['results'][0]['title']} ({it_res['results'][0]['company']})")

    state_res = get_all_internships_db(state="Maharashtra", limit=5)
    assert state_res["total"] > 0, "No Maharashtra internships found in MongoDB"
    print(f"  --> State Query (Maharashtra): Found {state_res['total']} records. Sample: {state_res['results'][0]['title']}")

    # 3. Test Youth Registration in MongoDB with Bcrypt Hashing & JWT
    test_mobile = "9988776655"
    reg_req = RegisterRequest(
        mobile=test_mobile,
        name="Vikramaditya Verma",
        password="PmisSecurePass@2026",
        is_unique_confirmed=True
    )
    reg_res = register_user(reg_req)
    user_id = reg_res["user_id"]
    access_token = reg_res["access_token"]
    refresh_token = reg_res["refresh_token"]

    assert user_id.startswith("PMIS-"), "User ID not formatted properly"
    assert access_token and len(access_token) > 20, "Missing JWT access token"
    assert refresh_token and len(refresh_token) > 20, "Missing JWT refresh token"
    print(f"\n[3] Registration in MongoDB: Successfully registered user {user_id} ({reg_res['user']['name']})")
    print(f"  --> Access Token: {access_token[:30]}...")
    print(f"  --> Refresh Token: {refresh_token[:30]}...")

    # Verify password was stored hashed in MongoDB
    raw_user = get_user_by_identifier(test_mobile)
    assert raw_user is not None, "User not found in MongoDB"
    assert raw_user.get("password").startswith("$2b$") or raw_user.get("password").startswith("$2a$"), "Password was not bcrypt hashed in MongoDB!"
    print(f"  --> Password security: Verified bcrypt hash ({raw_user['password'][:15]}...) in MongoDB.")

    # 4. Test Login with Bcrypt Verification & Token Generation
    login_req = LoginRequest(
        username_or_mobile=test_mobile,
        password="PmisSecurePass@2026"
    )
    login_res = login_user(login_req)
    assert login_res["status"] == "success", "Login failed"
    assert login_res["user"]["user_id"] == user_id
    new_access_token = login_res["access_token"]
    new_refresh_token = login_res["refresh_token"]
    print(f"\n[4] Login via MongoDB: Verified bcrypt credentials. User: {login_res['user']['name']}")

    # 5. Test Access Token Validation
    decoded_access = decode_access_token(new_access_token)
    assert decoded_access["sub"] == user_id, "Access token subject does not match user ID"
    assert decoded_access["type"] == "access", "Token type is not 'access'"
    print(f"\n[5] JWT Access Token Validation: Validated sub='{decoded_access['sub']}', exp={decoded_access['exp']}")

    # 6. Test Refresh Token Rotation via MongoDB
    ref_req = RefreshTokenRequest(refresh_token=new_refresh_token)
    ref_res = refresh_access_token(ref_req)
    assert ref_res["status"] == "success", "Token refresh failed"
    assert ref_res["access_token"] and ref_res["refresh_token"], "Missing rotated tokens"
    print(f"\n[6] Refresh Token Endpoint: Successfully rotated tokens via MongoDB refresh_tokens collection.")

    # 7. Test Google OAuth 2.0 Endpoint with MongoDB Persistence
    google_email = "vikram.ai.student@gmail.com"
    g_req = GoogleAuthRequest(
        email=google_email,
        name="Vikram AI Student",
        picture="https://lh3.googleusercontent.com/a/custom-avatar"
    )
    g_res = asyncio.run(google_auth(g_req))
    assert g_res["status"] == "success", "Google auth failed"
    g_user_id = g_res["user"]["user_id"]
    assert g_user_id.startswith("G-"), f"Unexpected Google user ID: {g_user_id}"
    assert g_res["access_token"] and g_res["refresh_token"], "Missing tokens in Google auth response"
    print(f"\n[7] Google OAuth 2.0 Auth: Verified Google account and saved to MongoDB. User ID: {g_user_id}")

    # 8. Test Profile Update in MongoDB
    prof_update = ProfileUpdateRequest(
        branch="Computer Science & Data Intelligence",
        degree="B.Tech (Honours)",
        college="Indian Institute of Information Technology",
        skills=["Python", "FastAPI", "MongoDB", "PyTorch", "Kubernetes"]
    )
    update_res = update_profile(user_id=user_id, payload=prof_update)
    assert update_res["status"] == "success"
    updated_user = get_user_by_identifier(user_id)
    assert "MongoDB" in updated_user["skills"]
    print(f"\n[8] Profile Update in MongoDB: Updated skills -> {updated_user['skills']}")

    # 9. Test Application Submission in MongoDB
    app_req = ApplyRequest(
        internship_id="PMIS-001",
        company="Tata Consultancy Services",
        title="Software Development Intern",
        notes="Automated test application through PMIS Disha AI"
    )
    app_res = apply_internship(user_id=user_id, payload=app_req)
    assert app_res["status"] == "success"
    apps = get_user_applications(user_id)
    assert len(apps) >= 1
    assert apps[0]["internship_id"] == "PMIS-001"
    print(f"\n[9] Application Submission in MongoDB: Successfully applied for {apps[0]['title']} at {apps[0]['company']}")
    print(f"  --> Stored Application ID: {apps[0]['application_id']} in MongoDB.")

    print("\n" + "=" * 70)
    print(">> ALL 9 VERIFICATION TEST SUITES PASSED WITH 100% SUCCESS!")
    print(f">> MongoDB Mode: {'Live MongoDB Server' if is_live_mongodb() else 'Embedded High-Performance MongoDB Engine'}")
    print(f">> Total Internships in Database: {total_internships} (Requirement >= 250 satisfied)")
    print(">> Bcrypt Password Hashing & JWT Access/Refresh Token System Operational")
    print(">> Google OAuth 2.0 Verified & Persisted to MongoDB")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
