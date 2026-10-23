import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

os.makedirs("deck_assets", exist_ok=True)
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'

# =============================================================================
# 1. HERO FLOW GRAPHIC (Concept Flow)
# =============================================================================
fig, ax = plt.subplots(figsize=(11, 2.3), dpi=250)
ax.set_facecolor("#0B132B")
fig.patch.set_facecolor("#0B132B")
ax.axis("off")

steps = [
    ("Student\nProfile", "Academic & Skills", "#3B82F6"),
    ("AI Resume\nIntelligence", "ATS 94/100 Audit", "#8B5CF6"),
    ("Skill Gap\nDiagnostics", "Role Benchmark", "#EC4899"),
    ("Personalized\nRoadmap", "Time-Bound Plan", "#F97316"),
    ("Past Selection\nInsights", "Branch Blueprints", "#10B981"),
    ("Opportunity\nDiscovery", "Direct Application", "#06B6D4")
]

x_start = 0.03
box_width = 0.13
spacing = 0.034
y_pos = 0.22
box_height = 0.58

for i, (title, sub, color) in enumerate(steps):
    x = x_start + i * (box_width + spacing)
    # Glow / shadow
    glow = patches.FancyBboxPatch((x-0.003, y_pos-0.01), box_width+0.006, box_height+0.02,
                                  boxstyle="round,pad=0.015,rounding_size=0.03",
                                  facecolor=color, alpha=0.25, edgecolor="none")
    ax.add_patch(glow)
    
    # Main card
    rect = patches.FancyBboxPatch((x, y_pos), box_width, box_height,
                                  boxstyle="round,pad=0.015,rounding_size=0.03",
                                  facecolor="#1C2541", edgecolor=color, linewidth=1.8)
    ax.add_patch(rect)
    
    # Step indicator pill
    step_pill = patches.FancyBboxPatch((x + 0.01, y_pos + box_height - 0.14), 0.035, 0.09,
                                      boxstyle="round,pad=0.005,rounding_size=0.015",
                                      facecolor=color, edgecolor="none")
    ax.add_patch(step_pill)
    ax.text(x + 0.027, y_pos + box_height - 0.095, f"0{i+1}", ha="center", va="center",
            color="white", fontsize=7.5, fontweight="black")
    
    # Title & Sub
    ax.text(x + box_width/2, y_pos + box_height/2 - 0.02, title,
            ha="center", va="center", color="#F8FAFC", fontsize=8.5, fontweight="bold", linespacing=1.1)
    ax.text(x + box_width/2, y_pos + 0.08, sub,
            ha="center", va="center", color="#94A3B8", fontsize=6.8, fontweight="medium")
    
    # Connector Arrow
    if i < len(steps) - 1:
        arr_x = x + box_width + 0.004
        ax.annotate("", xy=(arr_x + spacing - 0.008, y_pos + box_height/2),
                    xytext=(arr_x, y_pos + box_height/2),
                    arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.45",
                                    color="#64748B", lw=2.2))

plt.tight_layout()
plt.savefig("deck_assets/hero_flow.png", bbox_inches="tight", facecolor=fig.get_facecolor(), edgecolor="none")
plt.close()

# =============================================================================
# 2. ULTRA-REALISTIC RESUME ANALYZER DASHBOARD MOCKUP
# =============================================================================
fig, ax = plt.subplots(figsize=(7.5, 7.2), dpi=260)
ax.set_facecolor("#FFFFFF")
fig.patch.set_facecolor("#FFFFFF")
ax.axis("off")

# Outer Container
outer = patches.FancyBboxPatch((0.02, 0.02), 0.96, 0.96,
                              boxstyle="round,pad=0.01,rounding_size=0.03",
                              facecolor="#FAFAFA", edgecolor="#E2E8F0", linewidth=1.5)
ax.add_patch(outer)

# Top Recruiter Header Card
head_card = patches.FancyBboxPatch((0.04, 0.84), 0.92, 0.12,
                                  boxstyle="round,pad=0.01,rounding_size=0.02",
                                  facecolor="#0F172A", edgecolor="none")
ax.add_patch(head_card)

ax.text(0.07, 0.915, "OFFICIAL PMIS CORPORATE RECRUITER AUDIT", fontsize=8, fontweight="black", color="#F97316")
ax.text(0.07, 0.865, "Candidate: Ananya Sharma • B.Tech CSE • Final Year • Tier-1 Recruiter Scan", fontsize=7.5, color="#E2E8F0")

# Score badge on right of header
score_bg = patches.FancyBboxPatch((0.78, 0.855), 0.16, 0.09,
                                 boxstyle="round,pad=0.008,rounding_size=0.015",
                                 facecolor="#10B981", edgecolor="none")
ax.add_patch(score_bg)
ax.text(0.86, 0.91, "ATS: 94 / 100", fontsize=8.5, fontweight="black", color="white", ha="center")
ax.text(0.86, 0.875, "Grade A: Top 2%", fontsize=6.5, fontweight="bold", color="#ECFDF5", ha="center")

# 3 Verified Pill Badges
badges = [
    ("✓ 1-Page Strict Compliance", "#10B981", "#ECFDF5"),
    ("✓ ATS Layout: Single-Column Pass", "#3B82F6", "#EFF6FF"),
    ("✓ 15-Sec Recruiter Scan Ready", "#F97316", "#FFF7ED")
]
for idx, (b_txt, b_col, bg_col) in enumerate(badges):
    bx = 0.04 + idx * 0.313
    b_patch = patches.FancyBboxPatch((bx, 0.77), 0.295, 0.055,
                                    boxstyle="round,pad=0.008,rounding_size=0.015",
                                    facecolor=bg_col, edgecolor=b_col, linewidth=1)
    ax.add_patch(b_patch)
    ax.text(bx + 0.147, 0.797, b_txt, fontsize=6.8, fontweight="bold", color=b_col, ha="center")

# SECTION A: Extracted Skills Matrix
s_box = patches.FancyBboxPatch((0.04, 0.53), 0.92, 0.22,
                              boxstyle="round,pad=0.01,rounding_size=0.02",
                              facecolor="#FFFFFF", edgecolor="#CBD5E1", linewidth=1)
ax.add_patch(s_box)
ax.text(0.07, 0.715, "EXTRACTED SKILLS MATRIX (AUTO-SYNCED TO PROFILE)", fontsize=7.5, fontweight="black", color="#0369A1")

# Subcategories
ax.text(0.07, 0.67, "Technical & Core:", fontsize=7, fontweight="bold", color="#334155")
tech_skills = ["Python", "FastAPI", "React 19", "SQL / PostgreSQL", "REST APIs", "Data Structures"]
tx_cur = 0.27
for sk in tech_skills:
    sk_p = patches.FancyBboxPatch((tx_cur, 0.655), len(sk)*0.011 + 0.025, 0.038,
                                 boxstyle="round,pad=0.004,rounding_size=0.01",
                                 facecolor="#ECFDF5", edgecolor="#A7F3D0", linewidth=0.8)
    ax.add_patch(sk_p)
    ax.text(tx_cur + (len(sk)*0.011 + 0.025)/2, 0.674, sk, fontsize=6.2, fontweight="bold", color="#065F46", ha="center")
    tx_cur += len(sk)*0.011 + 0.032

ax.text(0.07, 0.615, "Tools & Frameworks:", fontsize=7, fontweight="bold", color="#334155")
tool_skills = ["Git Version Control", "Docker Containers", "Postman API", "Linux Bash", "VS Code"]
tx_cur = 0.29
for tl in tool_skills:
    tl_p = patches.FancyBboxPatch((tx_cur, 0.60), len(tl)*0.0105 + 0.025, 0.038,
                                 boxstyle="round,pad=0.004,rounding_size=0.01",
                                 facecolor="#FFF7ED", edgecolor="#FED7AA", linewidth=0.8)
    ax.add_patch(tl_p)
    ax.text(tx_cur + (len(tl)*0.0105 + 0.025)/2, 0.619, tl, fontsize=6.2, fontweight="bold", color="#9A3412", ha="center")
    tx_cur += len(tl)*0.0105 + 0.031

ax.text(0.07, 0.56, "Analytical & Soft:", fontsize=7, fontweight="bold", color="#334155")
soft_skills = ["Analytical Problem Solving", "Team Agile Collaboration", "Technical Writing"]
tx_cur = 0.27
for sf in soft_skills:
    sf_p = patches.FancyBboxPatch((tx_cur, 0.545), len(sf)*0.010 + 0.025, 0.038,
                                 boxstyle="round,pad=0.004,rounding_size=0.01",
                                 facecolor="#F1F5F9", edgecolor="#CBD5E1", linewidth=0.8)
    ax.add_patch(sf_p)
    ax.text(tx_cur + (len(sf)*0.010 + 0.025)/2, 0.564, sf, fontsize=6.2, fontweight="bold", color="#1E293B", ha="center")
    tx_cur += len(sf)*0.010 + 0.030

# SECTION B: Best Roles Matched with Match Rate
r_box = patches.FancyBboxPatch((0.04, 0.355), 0.92, 0.16,
                              boxstyle="round,pad=0.01,rounding_size=0.02",
                              facecolor="#FFFFFF", edgecolor="#CBD5E1", linewidth=1)
ax.add_patch(r_box)
ax.text(0.07, 0.485, "TARGET CORPORATE ROLES MATCHED (HIGHEST SHORTLIST LIKELIHOOD)", fontsize=7.5, fontweight="black", color="#D97706")

roles_data = [
    ("Full Stack Cloud Developer", "Tata Consultancy Services (TCS)", "94%", 0.94, "#10B981"),
    ("AI / Python Solutions Associate", "Infosys Technologies", "89%", 0.89, "#3B82F6"),
    ("Backend Systems Engineer", "Larsen & Toubro (L&T)", "85%", 0.85, "#F59E0B")
]

for idx, (r_name, r_comp, r_pct, r_val, bar_col) in enumerate(roles_data):
    ry = 0.44 - idx * 0.042
    ax.text(0.07, ry, f"• {r_name} — {r_comp}", fontsize=6.8, fontweight="bold", color="#0F172A")
    # Progress Bar background
    bar_bg = patches.Rectangle((0.68, ry-0.005), 0.18, 0.018, facecolor="#E2E8F0", edgecolor="none")
    ax.add_patch(bar_bg)
    bar_fill = patches.Rectangle((0.68, ry-0.005), 0.18 * r_val, 0.018, facecolor=bar_col, edgecolor="none")
    ax.add_patch(bar_fill)
    ax.text(0.88, ry, r_pct, fontsize=6.8, fontweight="black", color=bar_col)

# SECTION C: Strengths vs Resume Gaps (Split Column)
# Strengths
str_box = patches.FancyBboxPatch((0.04, 0.04), 0.445, 0.30,
                                boxstyle="round,pad=0.01,rounding_size=0.02",
                                facecolor="#F0FDF4", edgecolor="#86EFAC", linewidth=1)
ax.add_patch(str_box)
ax.text(0.07, 0.305, "KEY STRENGTHS (RECRUITER LOVES)", fontsize=7.2, fontweight="black", color="#15803D")
ax.text(0.07, 0.265, "• Verified Modern Tech Stack: Python, FastAPI & React", fontsize=6.4, color="#166534")
ax.text(0.07, 0.225, "• Strict 1-Page Layout compliant with PMIS criteria", fontsize=6.4, color="#166534")
ax.text(0.07, 0.185, "• Clean visual hierarchy: Header, Skills, Projects, Edu", fontsize=6.4, color="#166534")
ax.text(0.07, 0.145, "• Solid academic record & verified foundational projects", fontsize=6.4, color="#166534")
ax.text(0.07, 0.105, "• Single-column layout guarantees 100% ATS parser accuracy", fontsize=6.4, color="#166534")
ax.text(0.07, 0.065, "• Verified Git version control & project deployment links", fontsize=6.4, color="#166534")

# Identified Resume Gaps (Content Gaps, NOT Skills)
gap_box = patches.FancyBboxPatch((0.515, 0.04), 0.445, 0.30,
                                boxstyle="round,pad=0.01,rounding_size=0.02",
                                facecolor="#FFFBEB", edgecolor="#FCD34D", linewidth=1)
ax.add_patch(gap_box)
ax.text(0.54, 0.305, "IDENTIFIED RESUME GAPS (CONTENT/METRICS)", fontsize=7.2, fontweight="black", color="#B45309")
ax.text(0.54, 0.265, "• Missing live project hyperlinks on 2 capstone items", fontsize=6.4, color="#92400E")
ax.text(0.54, 0.225, "• Needs quantified impact metrics (e.g. 'reduced latency by 35%')", fontsize=6.4, color="#92400E")
ax.text(0.54, 0.185, "• Some bullet points start with passive verbs instead of actions", fontsize=6.4, color="#92400E")
ax.text(0.54, 0.145, "• Target sector keywords could be aligned closer to PMIS openings", fontsize=6.4, color="#92400E")
ax.text(0.54, 0.105, "• Missing explicit test coverage / deployment environment mention", fontsize=6.4, color="#92400E")
ax.text(0.54, 0.065, "• ACTION: Apply Phase 1-3 improvements for 99% shortlist rate", fontsize=6.4, fontweight="bold", color="#B45309")

plt.tight_layout()
plt.savefig("deck_assets/resume_analyzer_pro.png", bbox_inches="tight", facecolor=fig.get_facecolor(), edgecolor="none")
plt.close()

# =============================================================================
# 3. ROADMAP & HIRING NEWS COMBO (Slide 4 Visual)
# =============================================================================
fig, ax = plt.subplots(figsize=(10, 4.2), dpi=250)
ax.set_facecolor("#0F172A")
fig.patch.set_facecolor("#0F172A")
ax.axis("off")

# Left: Find Your Path (Roadmap Timeline)
r_card = patches.FancyBboxPatch((0.03, 0.05), 0.455, 0.90,
                               boxstyle="round,pad=0.015,rounding_size=0.03",
                               facecolor="#1E293B", edgecolor="#4F46E5", linewidth=1.8)
ax.add_patch(r_card)
ax.text(0.06, 0.88, "FIND YOUR PATH: 4-WEEK ROADMAP", fontsize=9, fontweight="black", color="#818CF8")
ax.text(0.06, 0.83, "Role: Full Stack Engineer • 100% Free Resources", fontsize=7, color="#94A3B8")

weeks = [
    ("Week 1: Core Fundamentals", "Async Python, FastAPI routing, Git workflows", "Free: Python Docs + CS50"),
    ("Week 2: Full-Stack Architecture", "React 19 hooks, REST APIs, Tailwind CSS", "Free: React.dev + freeCodeCamp"),
    ("Week 3: Database & Cloud", "PostgreSQL schema, indexing, Docker setup", "Free: PostgreSQL Tutorial repo"),
    ("Week 4: Corporate Interview Prep", "System design mock, live deployment, PMIS apply", "Free: PMIS Interview Video guides")
]

for w_idx, (w_title, w_desc, w_res) in enumerate(weeks):
    wy = 0.74 - w_idx * 0.17
    # Node circle
    circle = patches.Circle((0.08, wy+0.02), 0.018, facecolor="#4F46E5", edgecolor="#A5B4FC", lw=1.2)
    ax.add_patch(circle)
    ax.text(0.08, wy+0.02, str(w_idx+1), ha="center", va="center", color="white", fontsize=6.5, fontweight="black")
    
    # Connecting line
    if w_idx < len(weeks) - 1:
        ax.plot([0.08, 0.08], [wy+0.002, wy-0.13], color="#6366F1", lw=1.5, ls="--")
    
    ax.text(0.12, wy+0.03, w_title, fontsize=7.5, fontweight="bold", color="#F8FAFC")
    ax.text(0.12, wy-0.005, w_desc, fontsize=6.5, color="#CBD5E1")
    ax.text(0.12, wy-0.04, f"Resource: {w_res}", fontsize=6.2, fontweight="semibold", color="#38BDF8")

# Right: Don't Fall in the Trap (Hiring News Feed)
n_card = patches.FancyBboxPatch((0.515, 0.05), 0.455, 0.90,
                               boxstyle="round,pad=0.015,rounding_size=0.03",
                               facecolor="#1E293B", edgecolor="#EA580C", linewidth=1.8)
ax.add_patch(n_card)
ax.text(0.545, 0.88, "DON'T FALL IN THE TRAP: HIRING STREAM", fontsize=9, fontweight="black", color="#FB923C")
ax.text(0.545, 0.83, "Real-Time Corporate Job Creation Stream • Zero Layoff Noise", fontsize=7, color="#94A3B8")

news_items = [
    ("Tata Electronics Semiconductor", "Expanding hiring with +1,200 trainees in Dholera & Hosur fab", "Today • Google News Verified"),
    ("L&T Technology Services (LTTS)", "Onboarding 2,500 engineers for automotive & green hydrogen units", "Yesterday • Economic Times"),
    ("Infosys & TCS Corporate Campus", "Affirms 25,000+ fresher intake for 2026 batches across GCCs", "2 Days Ago • Press Release"),
    ("Maruti Suzuki R&D Center", "Opening 450 corporate internships in EV battery & ADAS design", "3 Days Ago • Official MCA Feed")
]

for n_idx, (n_corp, n_desc, n_src) in enumerate(news_items):
    ny = 0.74 - n_idx * 0.17
    # Green signal pill
    sig = patches.FancyBboxPatch((0.545, ny+0.008), 0.065, 0.042,
                                boxstyle="round,pad=0.003,rounding_size=0.01",
                                facecolor="#065F46", edgecolor="#34D399", lw=1)
    ax.add_patch(sig)
    ax.text(0.577, ny+0.029, "HIRING", ha="center", va="center", color="#34D399", fontsize=6, fontweight="black")
    
    ax.text(0.625, ny+0.035, n_corp, fontsize=7.2, fontweight="bold", color="#F8FAFC")
    ax.text(0.545, ny-0.01, n_desc, fontsize=6.4, color="#CBD5E1")
    ax.text(0.545, ny-0.042, f"Source: {n_src} [Direct Link →]", fontsize=6, color="#FDBA74")

plt.tight_layout()
plt.savefig("deck_assets/roadmap_news_combo.png", bbox_inches="tight", facecolor=fig.get_facecolor(), edgecolor="none")
plt.close()

# =============================================================================
# 4. PAST SELECTIONS & DISHA AI COMBO (Slide 5 Visual)
# =============================================================================
fig, ax = plt.subplots(figsize=(10, 4.2), dpi=250)
ax.set_facecolor("#0F172A")
fig.patch.set_facecolor("#0F172A")
ax.axis("off")

# Card A: Learn from Past Selection
p_card = patches.FancyBboxPatch((0.03, 0.05), 0.455, 0.90,
                               boxstyle="round,pad=0.015,rounding_size=0.03",
                               facecolor="#1E293B", edgecolor="#10B981", linewidth=1.8)
ax.add_patch(p_card)
ax.text(0.06, 0.88, "LEARN FROM PAST SELECTIONS (BRANCH-LOCKED)", fontsize=9, fontweight="black", color="#34D399")
ax.text(0.06, 0.83, "Branch: CS / IT Engineering • Anonymized Recruiter Blueprints", fontsize=7, color="#94A3B8")

# Candidate card snippet
c_box = patches.FancyBboxPatch((0.06, 0.48), 0.395, 0.32,
                              boxstyle="round,pad=0.01,rounding_size=0.02",
                              facecolor="#0F172A", edgecolor="#334155", lw=1)
ax.add_patch(c_box)
ax.text(0.08, 0.75, "Past Candidate Blueprint: Full Stack Role", fontsize=7.5, fontweight="bold", color="#F8FAFC")
ax.text(0.08, 0.705, "• Tech Stack: React, Node.js, PostgreSQL, Docker, Git", fontsize=6.5, color="#A7F3D0")
ax.text(0.08, 0.665, "• Winning Project: Real-time Distributed Chat with WebSockets", fontsize=6.5, color="#E2E8F0")
ax.text(0.08, 0.625, "• Resume Structure: Strict 1-page, 4 quantified achievement bullets", fontsize=6.5, color="#E2E8F0")
ax.text(0.08, 0.585, "• Shortlist Verdict: Selected at Tata Consultancy Services (TCS)", fontsize=6.5, fontweight="bold", color="#38BDF8")
ax.text(0.08, 0.535, "• Interview Rounds: Round 1 (DSA/SQL) • Round 2 (System Design)", fontsize=6.2, color="#94A3B8")

# Video Tutorial Preview
v_box = patches.FancyBboxPatch((0.06, 0.12), 0.395, 0.32,
                              boxstyle="round,pad=0.01,rounding_size=0.02",
                              facecolor="#0F172A", edgecolor="#EA580C", lw=1)
ax.add_patch(v_box)
ax.text(0.08, 0.39, "▶ Curated Company Interview Video Guide", fontsize=7.5, fontweight="bold", color="#FB923C")
ax.text(0.08, 0.34, "Official PMIS Corporate Interview Rounds Blueprint (IT & CS)", fontsize=6.8, color="#F8FAFC")
ax.text(0.08, 0.29, "• Complete breakdown: Technical coding test, machine round, HR prep", fontsize=6.3, color="#CBD5E1")
ax.text(0.08, 0.24, "• Youtube Curated Guide: youtube.com/watch?v=QBX7RkhuyCA", fontsize=6.2, color="#38BDF8")
ax.text(0.08, 0.18, "• Verified by corporate hiring panel for IT/Software disciplines", fontsize=6.2, color="#94A3B8")

# Card B: Find the Gap + Disha AI Guide
d_card = patches.FancyBboxPatch((0.515, 0.05), 0.455, 0.90,
                               boxstyle="round,pad=0.015,rounding_size=0.03",
                               facecolor="#1E293B", edgecolor="#0284C7", linewidth=1.8)
ax.add_patch(d_card)
ax.text(0.545, 0.88, "FIND THE GAP & DISHA AI CHATBOT", fontsize=9, fontweight="black", color="#38BDF8")
ax.text(0.545, 0.83, "Real-Time Skill Gap Comparison & 24/7 Intelligent Guidance", fontsize=7, color="#94A3B8")

# Gap comparison bar chart snippet
g_box = patches.FancyBboxPatch((0.545, 0.48), 0.395, 0.32,
                              boxstyle="round,pad=0.01,rounding_size=0.02",
                              facecolor="#0F172A", edgecolor="#334155", lw=1)
ax.add_patch(g_box)
ax.text(0.565, 0.75, "Skill Match vs Target Role (PMIS-001): 88%", fontsize=7.5, fontweight="bold", color="#F8FAFC")
ax.text(0.565, 0.70, "✓ Verified Match: Python, REST APIs, Git, React, SQL", fontsize=6.5, color="#34D399")
ax.text(0.565, 0.65, "⚠ Missing Gap: Docker Containerization, Redis Caching", fontsize=6.5, color="#F87171")
ax.text(0.565, 0.60, "→ 1-Click Action: 'Add Missing Skills to 4-Week Roadmap'", fontsize=6.5, fontweight="bold", color="#FBBF24")
ax.text(0.565, 0.54, "→ Match Status: Strong Shortlist Potential with Minor Gap", fontsize=6.2, color="#38BDF8")

# Disha AI chat snippet
ch_box = patches.FancyBboxPatch((0.545, 0.12), 0.395, 0.32,
                               boxstyle="round,pad=0.01,rounding_size=0.02",
                               facecolor="#0F172A", edgecolor="#38BDF8", lw=1)
ax.add_patch(ch_box)
ax.text(0.565, 0.39, "DISHA AI CAREER ASSISTANT (24/7 GROUNDED RAG)", fontsize=7.5, fontweight="bold", color="#38BDF8")
ax.text(0.565, 0.33, "User: 'What are the top corporate openings for Mechanical?'", fontsize=6.4, color="#94A3B8")
ax.text(0.565, 0.27, "Disha: 'Found 14 openings: Maruti Suzuki, L&T, Tata Motors.", fontsize=6.4, color="#A7F3D0")
ax.text(0.565, 0.22, "Stipend: ₹5,000/mo + ₹6,000 grant. 12-month tenure.'", fontsize=6.4, color="#A7F3D0")
ax.text(0.565, 0.16, "• Zero Hallucination • Grounded via Qdrant & BM25 Hybrid RAG", fontsize=6.2, color="#FDBA74")

plt.tight_layout()
plt.savefig("deck_assets/past_selections_gap.png", bbox_inches="tight", facecolor=fig.get_facecolor(), edgecolor="none")
plt.close()

# =============================================================================
# 5. ENTERPRISE CLOUD ARCHITECTURE DIAGRAM (Slide 6 Visual)
# =============================================================================
fig, ax = plt.subplots(figsize=(10.5, 4.4), dpi=260)
ax.set_facecolor("#0B132B")
fig.patch.set_facecolor("#0B132B")
ax.axis("off")

# 4 Tier columns
arch_tiers = [
    ("Tier 1: Client Layer", [
        "React 19 & Vite 8",
        "Tailwind CSS Dark/Light",
        "TanStack Router",
        "Responsive Mobile/PC",
        "Stateful Dashboard"
    ], "#38BDF8", 0.04),
    ("Tier 2: API Gateway", [
        "FastAPI Asynchronous",
        "JWT Auth & Security",
        "PyPDF2 / Docx Parser",
        "Cloudinary CDN Asset",
        "<15ms Route Latency"
    ], "#818CF8", 0.285),
    ("Tier 3: AI & RAG Engine", [
        "NVIDIA NIM / Llama 3",
        "Qdrant Vector Store",
        "BM25 Lexical Ranking",
        "Reciprocal Rank Fusion",
        "Structured JSON Output"
    ], "#34D399", 0.53),
    ("Tier 4: Data Layer", [
        "PostgreSQL / SQLite",
        "PMIS 24-Sector Data",
        "Branch Curated Resumes",
        "Daily Hiring News Feeds",
        "Student Profile States"
    ], "#FBBF24", 0.775)
]

w_col = 0.20
y_col = 0.12
h_col = 0.78

for title, items, col, x_col in arch_tiers:
    # Outer box
    box = patches.FancyBboxPatch((x_col, y_col), w_col, h_col,
                                boxstyle="round,pad=0.015,rounding_size=0.03",
                                facecolor="#1C2541", edgecolor=col, linewidth=1.8)
    ax.add_patch(box)
    
    # Title badge
    t_badge = patches.FancyBboxPatch((x_col+0.01, y_col+h_col-0.12), w_col-0.02, 0.09,
                                    boxstyle="round,pad=0.008,rounding_size=0.015",
                                    facecolor=col, edgecolor="none")
    ax.add_patch(t_badge)
    ax.text(x_col + w_col/2, y_col + h_col - 0.075, title,
            ha="center", va="center", color="#0B132B", fontsize=8, fontweight="black")
    
    # Items
    for it_idx, item in enumerate(items):
        iy = y_col + h_col - 0.18 - it_idx * 0.11
        # Bullet
        b_dot = patches.Circle((x_col + 0.025, iy), 0.006, facecolor=col, edgecolor="none")
        ax.add_patch(b_dot)
        ax.text(x_col + 0.042, iy, item, va="center", color="#F8FAFC", fontsize=7.2, fontweight="medium")
    
    # Forward Connector Arrow
    if x_col < 0.7:
        arr_x = x_col + w_col + 0.005
        ax.annotate("", xy=(arr_x + 0.032, y_col + h_col/2),
                    xytext=(arr_x, y_col + h_col/2),
                    arrowprops=dict(arrowstyle="<->,head_width=0.3,head_length=0.4",
                                    color="#94A3B8", lw=2))

# Bottom Pipeline Ribbon
ribbon = patches.FancyBboxPatch((0.04, 0.02), 0.935, 0.07,
                               boxstyle="round,pad=0.005,rounding_size=0.01",
                               facecolor="#0F172A", edgecolor="#334155", lw=1)
ax.add_patch(ribbon)
ax.text(0.507, 0.055, "END-TO-END PIPELINE: PDF Upload → Multipart Extraction → Qdrant Vector Search + BM25 Fusion → NVIDIA NIM Inference → Real-Time Dashboard UI",
        ha="center", va="center", color="#94A3B8", fontsize=6.8, fontweight="bold")

plt.tight_layout()
plt.savefig("deck_assets/tech_architecture_pro.png", bbox_inches="tight", facecolor=fig.get_facecolor(), edgecolor="none")
plt.close()

print("All 5 ultra-pro graphics generated successfully!")
