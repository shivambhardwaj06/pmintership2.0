import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs("deck_assets", exist_ok=True)

# -------------------------------------------------------------
# GRAPHIC 1: Concept Flow Diagram
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 2.2), dpi=200)
ax.set_facecolor("#0F172A")
fig.patch.set_facecolor("#0F172A")
ax.axis("off")

steps = [
    ("Student\nProfile", "#3B82F6"),
    ("AI Resume\nIntelligence", "#8B5CF6"),
    ("Skill Gap\nDiagnostics", "#EC4899"),
    ("Time-Bound\nRoadmap", "#F97316"),
    ("Past Selection\nInsights", "#10B981"),
    ("Opportunity\nDiscovery", "#06B6D4")
]

x_start = 0.05
box_width = 0.12
spacing = 0.038
y_pos = 0.28
box_height = 0.44

for i, (title, color) in enumerate(steps):
    x = x_start + i * (box_width + spacing)
    # Card
    rect = patches.FancyBboxPatch((x, y_pos), box_width, box_height,
                                  boxstyle="round,pad=0.02,rounding_size=0.03",
                                  facecolor=color, edgecolor="#FFFFFF", alpha=0.92, linewidth=1.5)
    ax.add_patch(rect)
    ax.text(x + box_width/2, y_pos + box_height/2, title,
            ha="center", va="center", color="white", fontsize=9, fontweight="bold",
            linespacing=1.1)
    
    # Arrow
    if i < len(steps) - 1:
        arrow_x = x + box_width + 0.005
        ax.annotate("", xy=(arrow_x + spacing - 0.01, y_pos + box_height/2),
                    xytext=(arrow_x, y_pos + box_height/2),
                    arrowprops=dict(arrowstyle="->", color="#94A3B8", lw=2.5, mutation_scale=15))

plt.tight_layout()
plt.savefig("deck_assets/concept_flow.png", bbox_inches="tight", facecolor=fig.get_facecolor(), edgecolor="none")
plt.close()

# -------------------------------------------------------------
# GRAPHIC 2: Resume Analyzer UI Mockup Graphic
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(6.8, 6.2), dpi=220)
ax.set_facecolor("#FFFFFF")
fig.patch.set_facecolor("#FFFFFF")
ax.axis("off")

# Outer border
outer = patches.FancyBboxPatch((0.02, 0.02), 0.96, 0.96,
                              boxstyle="round,pad=0.01,rounding_size=0.03",
                              facecolor="#F8FAFC", edgecolor="#CBD5E1", linewidth=1.5)
ax.add_patch(outer)

# Top Bar
ax.text(0.06, 0.92, "AI Resume Review & Recruiter Audit", fontsize=11, fontweight="bold", color="#0F172A")
ax.text(0.06, 0.88, "PMIS Top 500 Corporate Benchmark Analysis", fontsize=8, color="#64748B")

# Score Badge
score_box = patches.FancyBboxPatch((0.74, 0.86), 0.20, 0.09,
                                   boxstyle="round,pad=0.01,rounding_size=0.02",
                                   facecolor="#ECFDF5", edgecolor="#10B981", linewidth=1.2)
ax.add_patch(score_box)
ax.text(0.84, 0.915, "ATS: 94 / 100", fontsize=9, fontweight="black", color="#047857", ha="center")
ax.text(0.84, 0.875, "Grade A+ Shortlist", fontsize=7, color="#065F46", ha="center")

# 3 Badge Strips
badges = [("1-Page Strict", "#10B981"), ("ATS Layout Pass", "#3B82F6"), ("15-Sec Scan Ready", "#F97316")]
for idx, (b_title, col) in enumerate(badges):
    bx = 0.06 + idx * 0.30
    rect = patches.FancyBboxPatch((bx, 0.77), 0.27, 0.07,
                                  boxstyle="round,pad=0.01,rounding_size=0.02",
                                  facecolor="#FFFFFF", edgecolor=col, linewidth=1)
    ax.add_patch(rect)
    ax.text(bx + 0.135, 0.805, f"✓ {b_title}", fontsize=7.5, fontweight="bold", color="#1E293B", ha="center")

# Section 1: Extracted Skills Matrix
sec1 = patches.FancyBboxPatch((0.06, 0.54), 0.88, 0.20,
                             boxstyle="round,pad=0.01,rounding_size=0.02",
                             facecolor="#FFFFFF", edgecolor="#E2E8F0", linewidth=1)
ax.add_patch(sec1)
ax.text(0.09, 0.70, "EXTRACTED SKILLS MATRIX", fontsize=8, fontweight="bold", color="#0369A1")
ax.text(0.09, 0.65, "• Tech: Python, SQL, REST APIs, React, Data Structures", fontsize=7.5, color="#1E293B")
ax.text(0.09, 0.60, "• Tools: Git Version Control, VS Code, Postman, Linux", fontsize=7.5, color="#1E293B")
ax.text(0.09, 0.55, "• Analytical: Problem Solving, Architecture Design, Team Agility", fontsize=7.5, color="#1E293B")

# Section 2: Best Roles Matched
sec2 = patches.FancyBboxPatch((0.06, 0.35), 0.88, 0.16,
                             boxstyle="round,pad=0.01,rounding_size=0.02",
                             facecolor="#FFFFFF", edgecolor="#E2E8F0", linewidth=1)
ax.add_patch(sec2)
ax.text(0.09, 0.47, "TARGET ROLES MATCHED (BEST FIT)", fontsize=8, fontweight="bold", color="#D97706")
ax.text(0.09, 0.42, "1. Full Stack Developer (Tata Consultancy) — 94% Match Score", fontsize=7.5, color="#0F172A", fontweight="semibold")
ax.text(0.09, 0.37, "2. Cloud Solutions Associate (Infosys Tech) — 89% Match Score", fontsize=7.5, color="#0F172A", fontweight="semibold")

# Section 3: Strengths vs Resume Gaps
sec3_l = patches.FancyBboxPatch((0.06, 0.06), 0.42, 0.26,
                               boxstyle="round,pad=0.01,rounding_size=0.02",
                               facecolor="#F0FDF4", edgecolor="#86EFAC", linewidth=1)
ax.add_patch(sec3_l)
ax.text(0.08, 0.28, "KEY STRENGTHS", fontsize=7.5, fontweight="bold", color="#15803D")
ax.text(0.08, 0.23, "• Strong engineering fundamentals", fontsize=6.8, color="#166534")
ax.text(0.08, 0.17, "• Clear section visual hierarchy", fontsize=6.8, color="#166534")
ax.text(0.08, 0.11, "• Verified project complexity", fontsize=6.8, color="#166534")

sec3_r = patches.FancyBboxPatch((0.52, 0.06), 0.42, 0.26,
                               boxstyle="round,pad=0.01,rounding_size=0.02",
                               facecolor="#FFFBEB", edgecolor="#FCD34D", linewidth=1)
ax.add_patch(sec3_r)
ax.text(0.54, 0.28, "IDENTIFIED RESUME GAPS", fontsize=7.5, fontweight="bold", color="#B45309")
ax.text(0.54, 0.23, "• Missing GitHub URLs on projects", fontsize=6.8, color="#92400E")
ax.text(0.54, 0.17, "• Needs quantifiable metrics (% / ms)", fontsize=6.8, color="#92400E")
ax.text(0.54, 0.11, "• Weak action verbs in experience", fontsize=6.8, color="#92400E")

plt.tight_layout()
plt.savefig("deck_assets/resume_analyzer_mockup.png", bbox_inches="tight", facecolor=fig.get_facecolor(), edgecolor="none")
plt.close()

# -------------------------------------------------------------
# GRAPHIC 3: 4-Tier Architecture Diagram
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 4.2), dpi=220)
ax.set_facecolor("#0F172A")
fig.patch.set_facecolor("#0F172A")
ax.axis("off")

tiers = [
    ("Tier 1: Client Layer", "React 19, Tailwind CSS, TanStack Router\nResponsive UI, Dark Mode, High Contrast", "#1E293B", "#38BDF8"),
    ("Tier 2: API & Gateway", "FastAPI Asynchronous Gateway\nJWT Auth, PyPDF2 & Docx Parser, Cloudinary", "#1E293B", "#818CF8"),
    ("Tier 3: AI & Hybrid RAG", "NVIDIA NIM / Llama 3 + Qdrant Vector Store\nBM25 Lexical Search + Reciprocal Rank Fusion", "#1E293B", "#34D399"),
    ("Tier 4: Data & Knowledge", "SQLite / PostgreSQL Relational Storage\nPMIS Structured Datasets, Live Corporate News", "#1E293B", "#FBBF24")
]

x_box = 0.04
w_box = 0.92
h_box = 0.18
y_gap = 0.06

for i, (t_title, t_desc, bg_col, border_col) in enumerate(tiers):
    y = 0.76 - i * (h_box + y_gap)
    rect = patches.FancyBboxPatch((x_box, y), w_box, h_box,
                                  boxstyle="round,pad=0.015,rounding_size=0.02",
                                  facecolor=bg_col, edgecolor=border_col, linewidth=2)
    ax.add_patch(rect)
    ax.text(x_box + 0.03, y + h_box*0.65, t_title, fontsize=10, fontweight="bold", color=border_col)
    ax.text(x_box + 0.03, y + h_box*0.25, t_desc, fontsize=8, color="#CBD5E1", linespacing=1.2)
    
    # Connectors
    if i < len(tiers) - 1:
        ax.annotate("", xy=(0.5, y - 0.005), xytext=(0.5, y - y_gap + 0.005),
                    arrowprops=dict(arrowstyle="<->", color="#94A3B8", lw=1.5))

plt.tight_layout()
plt.savefig("deck_assets/architecture_diagram.png", bbox_inches="tight", facecolor=fig.get_facecolor(), edgecolor="none")
plt.close()

print("All 3 deck assets generated successfully!")
