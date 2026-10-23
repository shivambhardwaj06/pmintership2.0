import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color definitions
    NAVY = RGBColor(15, 23, 42)        # #0F172A
    CARD_BG = RGBColor(30, 41, 59)     # #1E293B
    LIGHT_BG = RGBColor(248, 250, 252) # #F8FAFC
    LIGHT_CARD = RGBColor(255, 255, 255)
    BORDER_COL = RGBColor(226, 232, 240)
    DARK_BORDER = RGBColor(51, 65, 85)
    ORANGE = RGBColor(234, 88, 12)     # #EA580C
    EMERALD = RGBColor(16, 185, 129)   # #10B981
    SKY = RGBColor(2, 132, 199)        # #0284C7
    TEXT_DARK = RGBColor(15, 23, 42)
    TEXT_MUTED = RGBColor(100, 116, 139)
    TEXT_LIGHT = RGBColor(241, 245, 249)
    TEXT_DIM = RGBColor(148, 163, 184)
    INDIGO = RGBColor(79, 70, 229)

    def add_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, title, category="PM INTERNSHIP SCHEME 2.0 • AI CAREER READINESS", is_dark=False):
        # Category pill/subtitle
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.35))
        tf_c = cat_box.text_frame
        tf_c.word_wrap = True
        p_c = tf_c.paragraphs[0]
        p_c.text = category.upper()
        p_c.font.size = Pt(10)
        p_c.font.bold = True
        p_c.font.color.rgb = ORANGE if is_dark else ORANGE

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.5), Inches(0.6))
        tf = title_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = TEXT_LIGHT if is_dark else TEXT_DARK

    # =========================================================================
    # SLIDE 1: Title & Executive Overview
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1, NAVY)

    # Accent decorative bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.7), Inches(0.8), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = ORANGE
    bar.line.fill.background()

    # Title & Subtitle
    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(11.7), Inches(1.8))
    tf1 = t_box.text_frame
    tf1.word_wrap = True
    
    p0 = tf1.paragraphs[0]
    p0.text = "PM INTERNSHIP SCHEME 2.0"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = ORANGE

    p1 = tf1.add_paragraph()
    p1.text = "AI-Powered Career Readiness & Intelligence Platform"
    p1.font.size = Pt(30)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_LIGHT

    p2 = tf1.add_paragraph()
    p2.text = "Moving Beyond Passive Job Applications to Proactive Student Preparation & Corporate Readiness"
    p2.font.size = Pt(14)
    p2.font.color.rgb = TEXT_DIM

    # 3 Summary Cards
    cards_data = [
        ("The Core Dilemma", "Traditional placement platforms only show WHERE to apply. Students fail because they lack structured guidance on HOW to prepare.", ORANGE),
        ("The Paradigm Shift", "An integrated ecosystem connecting AI resume diagnostics, custom time-bound roadmaps, past selection insights, and live corporate news.", EMERALD),
        ("Measured Outcome", "Transforms student candidates into 95% ATS-compliant, pre-upskilled, interview-ready applicants matching top 500 corporate standards.", SKY)
    ]
    card_w = Inches(3.64)
    card_gap = Inches(0.38)
    for i, (head, desc, acc_col) in enumerate(cards_data):
        cx = Inches(0.8) + i * (card_w + card_gap)
        c_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(2.9), card_w, Inches(1.8))
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = CARD_BG
        c_box.line.color.rgb = DARK_BORDER
        c_box.line.width = Pt(1)

        c_tf = c_box.text_frame
        c_tf.word_wrap = True
        c_p1 = c_tf.paragraphs[0]
        c_p1.text = head
        c_p1.font.size = Pt(13)
        c_p1.font.bold = True
        c_p1.font.color.rgb = acc_col

        c_p2 = c_tf.add_paragraph()
        c_p2.text = desc
        c_p2.font.size = Pt(10.5)
        c_p2.font.color.rgb = TEXT_LIGHT

    # Bottom Concept Flow banner
    if os.path.exists("deck_assets/concept_flow.png"):
        s1.shapes.add_picture("deck_assets/concept_flow.png", Inches(0.8), Inches(4.95), width=Inches(11.73))

    s1.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 1):\n"
        "- Welcome the committee. Introduce PM Internship Scheme 2.0 as a proactive career readiness platform.\n"
        "- Emphasize our core differentiator: Traditional portals only show listings and take applications, leaving students blind to why they get rejected.\n"
        "- Our platform bridges the critical preparation gap through AI resume intelligence, personalized roadmaps, and past hiring transparency.\n"
        "- Walk through the 6-stage concept flow: Profile -> Resume Intelligence -> Gap Diagnostics -> Roadmap -> Past Insights -> Opportunity Discovery."
    )

    # =========================================================================
    # SLIDE 2: Problem Understanding & Existing Limitations vs Solution Matrix
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2, LIGHT_BG)
    add_header(s2, "Problem Understanding & Existing Limitations vs. Solutions Matrix", "STRATEGIC PROBLEM-SOLUTION FIT")

    # Left Box: 5 Industry Limitations
    left_box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.45), Inches(4.3), Inches(5.4))
    left_box.fill.solid()
    left_box.fill.fore_color.rgb = LIGHT_CARD
    left_box.line.color.rgb = BORDER_COL
    left_box.line.width = Pt(1.5)

    ltf = left_box.text_frame
    ltf.word_wrap = True
    lp1 = ltf.paragraphs[0]
    lp1.text = "Existing Placement Limitations"
    lp1.font.size = Pt(14)
    lp1.font.bold = True
    lp1.font.color.rgb = ORANGE

    limitations = [
        ("1. Black-Box Resumes:", "Students submit resumes blindly without knowing ATS readability, structure flaws, or role match."),
        ("2. Directionless Preparation:", "Students know target roles but lack a step-by-step, time-bound roadmap with free tools."),
        ("3. Opaque Hiring Standards:", "Zero visibility into previous successful candidates' projects, tech stacks, or interview blueprints."),
        ("4. Rejection Without Feedback:", "Students get rejected without actionable diagnostic feedback on what content was missing."),
        ("5. Layoff Panic (2026-30):", "Macroeconomic doom-scrolling creates depression while real daily job creation is overlooked.")
    ]
    for title, desc in limitations:
        p_t = ltf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(10.5)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_DARK

        p_d = ltf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = TEXT_MUTED

    # Right Box: Solution Matrix Table
    table_shape = s2.shapes.add_table(6, 2, Inches(5.3), Inches(1.45), Inches(7.2), Inches(5.4))
    table = table_shape.table
    table.columns[0].width = Inches(3.2)
    table.columns[1].width = Inches(4.0)

    # Header Row
    table.cell(0, 0).text = "Identified Student Problem"
    table.cell(0, 1).text = "Our Platform's AI Solution"
    for c in range(2):
        cell = table.cell(0, c)
        cell.fill.solid()
        cell.fill.fore_color.rgb = NAVY
        for p in cell.text_frame.paragraphs:
            p.font.size = Pt(11)
            p.font.bold = True
            p.font.color.rgb = TEXT_LIGHT

    rows_data = [
        ("Students don't know resume effectiveness or ATS score", "AI Resume Analyzer: ATS 94/100 score, extracted skills, layout review, best roles, resume gaps & action steps"),
        ("Students lack structured, time-bound preparation plans", "Find Your Path: Dynamic, customized week-by-week roadmaps (4-12 wks) with 100% free open-source resources"),
        ("Students don't know what selected candidates did differently", "Learn From Past Selections: Branch-locked past successful resumes, candidate projects & interview video rounds"),
        ("Students face post-rejection confusion with no feedback", "Find the Gap: Real-time skill gap analysis vs corporate job criteria with 1-click addition to learning goals"),
        ("Macroeconomic layoff anxiety (2026-30) & scattered news", "Don't Fall in the Trap: Daily verified corporate hiring news, MNC expansion announcements with direct source links")
    ]

    for r_idx, (prob, sol) in enumerate(rows_data):
        row_num = r_idx + 1
        c0 = table.cell(row_num, 0)
        c1 = table.cell(row_num, 1)
        c0.text = prob
        c1.text = sol

        bg_col = RGBColor(241, 245, 249) if r_idx % 2 == 0 else LIGHT_CARD
        for c_cell in (c0, c1):
            c_cell.fill.solid()
            c_cell.fill.fore_color.rgb = bg_col
            for p in c_cell.text_frame.paragraphs:
                p.font.size = Pt(9.5)
                p.font.color.rgb = TEXT_DARK
        c1.text_frame.paragraphs[0].font.bold = True

    s2.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 2):\n"
        "- Highlight the 5 core problems identified in student placement journeys.\n"
        "- Contrast legacy black-box job boards with our transparency-first model.\n"
        "- Explain the psychological barrier: Students in the 2026-30 cycle suffer from layoff panic; our 'Don't Fall in the Trap' module highlights active daily corporate hiring.\n"
        "- Conclude by showing that every single limitation is met with a dedicated, working software feature."
    )

    # =========================================================================
    # SLIDE 3: Core Feature 1 — AI Resume Analyzer & Recruiter Audit
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3, LIGHT_BG)
    add_header(s3, "Core Feature 1: AI Resume Intelligence & Recruiter Audit", "DEEP RECRUITER AUDIT & COMPLIANCE")

    # Left Container: 6 Core Capabilities
    left_w = Inches(7.0)
    left_h = Inches(5.5)
    l_shape = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), left_w, left_h)
    l_shape.fill.solid()
    l_shape.fill.fore_color.rgb = LIGHT_CARD
    l_shape.line.color.rgb = BORDER_COL
    l_shape.line.width = Pt(1.5)

    ltf3 = l_shape.text_frame
    ltf3.word_wrap = True
    p_head = ltf3.paragraphs[0]
    p_head.text = "In-Dashboard Recruiter Analysis Engine (6 Key Dimensions)"
    p_head.font.size = Pt(13)
    p_head.font.bold = True
    p_head.font.color.rgb = ORANGE

    audit_features = [
        ("1. Extracted Skills Matrix:", "Categorizes extracted tokens into Technical Skills, Engineering Frameworks (Git, Postman, Linux), and Soft/Analytical proficiencies."),
        ("2. ATS Readability & Parsing Score:", "Evaluates layout hierarchy, single-column parsing, and provides a quantitative ATS Score (e.g., 94/100) with 1-page strict compliance."),
        ("3. Best Target Corporate Roles:", "Matches candidate's skill profile against official PMIS roles with % match score (e.g. 94% Full Stack) and corporate selection rationale."),
        ("4. Key Strengths Identification:", "Pinpoints verified competitive advantages that corporate hiring managers prioritize (clean foundations, verified project complexity)."),
        ("5. Resume Gaps (Content & Metrics, Not Just Skills):", "Flags missing live GitHub URLs, absent quantitative metrics (%, ms, revenue), and passive phrasing without action verbs."),
        ("6. Actionable Next Steps Roadmap:", "Provides a 3-phase execution checklist (Phase 1: Header URLs -> Phase 2: Quantified Metrics -> Phase 3: Targeted PMIS Submissions).")
    ]

    for title, desc in audit_features:
        pt = ltf3.add_paragraph()
        pt.text = title
        pt.font.size = Pt(10)
        pt.font.bold = True
        pt.font.color.rgb = TEXT_DARK

        pd = ltf3.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(9)
        pd.font.color.rgb = TEXT_MUTED

    # Right side: Visual Mockup Picture
    if os.path.exists("deck_assets/resume_analyzer_mockup.png"):
        s3.shapes.add_picture("deck_assets/resume_analyzer_mockup.png", Inches(8.1), Inches(1.4), width=Inches(4.4))

    s3.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 3):\n"
        "- Direct attention to the right side visual mockup showing actual output from our integrated Student Dashboard.\n"
        "- Explain that our AI Resume Analyzer is not just a basic keyword matcher; it acts as a virtual corporate screener.\n"
        "- Emphasize point 5: We specifically identify RESUME CONTENT GAPS (missing GitHub links, lack of metrics) separate from SKILL GAPS.\n"
        "- Point 6 gives students a crystal clear 3-step action plan to reach 99% selection probability."
    )

    # =========================================================================
    # SLIDE 4: Core Feature 2 — Career Direction ("Find Your Path") & "Don't Fall in the Trap"
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4, LIGHT_BG)
    add_header(s4, "Core Feature 2: Personalized Career Roadmaps & Job Creation News", "STRATEGIC PREPARATION & OPPORTUNITY AWARENESS")

    # Card 1: Find Your Path (Personalized Career Roadmaps)
    c1_shape = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.45), Inches(5.7), Inches(5.4))
    c1_shape.fill.solid()
    c1_shape.fill.fore_color.rgb = LIGHT_CARD
    c1_shape.line.color.rgb = BORDER_COL
    c1_shape.line.width = Pt(1.5)

    c1_tf = c1_shape.text_frame
    c1_tf.word_wrap = True
    c1_p0 = c1_tf.paragraphs[0]
    c1_p0.text = "1. 'Find Your Path' — Personalized AI Roadmaps"
    c1_p0.font.size = Pt(13)
    c1_p0.font.bold = True
    c1_p0.font.color.rgb = INDIGO

    fyp_points = [
        ("• Target Role Customization:", "Student selects their dream role from official PMIS tracks or searches custom domains (VLSI, Full Stack, Data Science, Automotive)."),
        ("• Time-Bound Milestones:", "Customizable preparation windows (4 Weeks Fast-Track, 8 Weeks Balanced, 12 Weeks Mastery) tailored to candidate's available study bandwidth."),
        ("• Structured Weekly Syllabus:", "Breaks learning into Week 1 (Core Foundations), Week 2 (Hands-on Projects), Week 3 (Frameworks), and Week 4 (Mock Interviews & PMIS Submission)."),
        ("• 100% Free & Open-Source Resources:", "Direct links to curated GitHub repositories, official documentation, MIT/Stanford OpenCourseWare, and free interactive practice labs."),
        ("• Interactive Progress Tracking:", "Checkable weekly milestones stored in student profile to ensure continuous accountability.")
    ]
    for h, b in fyp_points:
        p_h = c1_tf.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10)
        p_h.font.bold = True
        p_h.font.color.rgb = TEXT_DARK

        p_b = c1_tf.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9)
        p_b.font.color.rgb = TEXT_MUTED

    # Card 2: Don't Fall in the Trap (Job Creation News)
    c2_shape = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.45), Inches(5.7), Inches(5.4))
    c2_shape.fill.solid()
    c2_shape.fill.fore_color.rgb = LIGHT_CARD
    c2_shape.line.color.rgb = BORDER_COL
    c2_shape.line.width = Pt(1.5)

    c2_tf = c2_shape.text_frame
    c2_tf.word_wrap = True
    c2_p0 = c2_tf.paragraphs[0]
    c2_p0.text = "2. 'Don't Fall in the Trap' — Daily Corporate Hiring Stream"
    c2_p0.font.size = Pt(13)
    c2_p0.font.bold = True
    c2_p0.font.color.rgb = ORANGE

    trap_points = [
        ("• Combating 2026-30 Layoff Depression:", "Viral media highlights layoffs and freezes, triggering student panic. This module proves that massive hiring continues daily across core sectors."),
        ("• Daily Multi-Source Ingestion:", "Aggregates verified corporate job creation announcements from Google News, corporate press releases, Economic Times, and MNC expansion portals."),
        ("• Focus on Real Opportunity Creation:", "Surfaces new GCC investments, green hydrogen plants, semiconductor fabrication units, automotive tech hubs, and corporate expansion drives."),
        ("• Transparent Source Links & Dates:", "Every opportunity card provides transparent timestamps, company tags, and 1-click external source verification links."),
        ("• Accessible from Home (Login-Protected):", "Keeps student dashboard focused on active tasks, while allowing explore-mode for all registered candidates.")
    ]
    for h, b in trap_points:
        p_h = c2_tf.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10)
        p_h.font.bold = True
        p_h.font.color.rgb = TEXT_DARK

        p_b = c2_tf.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9)
        p_b.font.color.rgb = TEXT_MUTED

    s4.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 4):\n"
        "- Detail the dual proactive modules: Guidance (Find Your Path) + Opportunity Reality (Don't Fall in the Trap).\n"
        "- 'Find Your Path' ensures students never ask 'what should I study next?'—it creates a deadline-driven curriculum with curated free resources.\n"
        "- 'Don't Fall in the Trap' directly addresses the severe mental health and motivation crisis among 2026-30 batch students.\n"
        "- By highlighting corporate hiring announcements daily, students stay motivated and proactive."
    )

    # =========================================================================
    # SLIDE 5: Core Feature 3 — Transparency & Assistance
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5, LIGHT_BG)
    add_header(s5, "Core Feature 3: Hiring Transparency, Gap Diagnostics & Disha AI", "INTELLIGENT BENCHMARKING & CONVERSATIONAL ASSISTANCE")

    # 3 Pillar Cards
    pillars = [
        ("Learn From Past Selections", [
            ("Branch-Locked Insights:", "Locked to candidate's discipline (CS/IT, Mech, Civil, Electrical, Mgmt) so insights are strictly relevant."),
            ("Raw Resume Blueprint:", "Examines past selected candidates' real project structures, technical skills, and layout formats."),
            ("Company Interview Videos:", "Curated video breakdowns of technical coding, design rounds, and HR interviews provided for each branch.")
        ], EMERALD),
        ("Find the Gap (Diagnostics)", [
            ("Target Role Matchup:", "Compares candidate's extracted skills against official corporate selection criteria."),
            ("Match Status Verdict:", "Provides instant classification: 'Strong Match', 'Moderate Gap', or 'Action Needed'."),
            ("1-Click Learning Addition:", "Identifies exact missing competencies and adds them directly to the student's learning roadmap.")
        ], ORANGE),
        ("Disha AI Assistant", [
            ("24/7 Portal Guidance:", "Conversational assistant grounded via Hybrid RAG to help students navigate when stuck."),
            ("Internship Inquiries:", "Instantly queries corporate listings across 24 sectors, stipend rules (₹5k/mo + ₹6k grant), and eligibility."),
            ("General Career Advice:", "Provides grounded answers to career questions without hallucinations.")
        ], SKY)
    ]

    p_w = Inches(3.72)
    p_gap = Inches(0.28)
    for i, (title, points, acc_col) in enumerate(pillars):
        px = Inches(0.8) + i * (p_w + p_gap)
        p_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, Inches(1.45), p_w, Inches(5.4))
        p_box.fill.solid()
        p_box.fill.fore_color.rgb = LIGHT_CARD
        p_box.line.color.rgb = BORDER_COL
        p_box.line.width = Pt(1.5)

        p_tf = p_box.text_frame
        p_tf.word_wrap = True
        pt0 = p_tf.paragraphs[0]
        pt0.text = title
        pt0.font.size = Pt(13)
        pt0.font.bold = True
        pt0.font.color.rgb = acc_col

        for sub_h, sub_d in points:
            p1 = p_tf.add_paragraph()
            p1.text = sub_h
            p1.font.size = Pt(10)
            p1.font.bold = True
            p1.font.color.rgb = TEXT_DARK

            p2 = p_tf.add_paragraph()
            p2.text = sub_d
            p2.font.size = Pt(9)
            p2.font.color.rgb = TEXT_MUTED

    s5.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 5):\n"
        "- Pillar 1: 'Learn From Past Selections' solves the opacity problem. Students can't copy other branches; they see exact winning profiles for their engineering or management branch.\n"
        "- Pillar 2: 'Find the Gap' transforms vague rejections into precise math—showing missing competencies and adding them to the roadmap.\n"
        "- Pillar 3: 'Disha AI' is our 24/7 intelligent guide. Grounded with Hybrid RAG (Qdrant + BM25), it answers scheme rules, eligibility, and openings accurately without hallucination."
    )

    # =========================================================================
    # SLIDE 6: Engineering Implementation & Technical Architecture
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6, NAVY)
    add_header(s6, "Engineering Implementation & Technical Architecture", "MODULAR 4-TIER AI ARCHITECTURE", is_dark=True)

    # Left: Architecture Diagram Graphic
    if os.path.exists("deck_assets/architecture_diagram.png"):
        s6.shapes.add_picture("deck_assets/architecture_diagram.png", Inches(0.8), Inches(1.5), width=Inches(6.2))

    # Right: Technical Deep-Dive Card
    right_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.3), Inches(1.5), Inches(5.2), Inches(5.35))
    right_box.fill.solid()
    right_box.fill.fore_color.rgb = CARD_BG
    right_box.line.color.rgb = DARK_BORDER
    right_box.line.width = Pt(1)

    rtf = right_box.text_frame
    rtf.word_wrap = True
    rt0 = rtf.paragraphs[0]
    rt0.text = "Technical Specifications & AI Pipeline"
    rt0.font.size = Pt(13)
    rt0.font.bold = True
    rt0.font.color.rgb = EMERALD

    specs = [
        ("• Frontend Presentation Layer:", "React 19, Tailwind CSS, TanStack Router with client-side state caching, high-contrast accessible typography, and dark/light system adaptation."),
        ("• Asynchronous API Gateway:", "FastAPI microservices delivering <15ms response times, JWT session security, multipart PDF/DOCX resume text extraction, and Cloudinary storage."),
        ("• Hybrid RAG Retrieval Engine:", "Combines Qdrant dense vector search (1024-dim semantic embeddings) with Rank-BM25 lexical search using Reciprocal Rank Fusion (RRF)."),
        ("• LLM Inference & Guardrails:", "NVIDIA NIM / Llama 3 LLM client with structured JSON output enforcing strict schema extraction, ATS parsing audit, and prompt grounding."),
        ("• Persistence & Data Schemas:", "Relational schema mapping users, applications, branch-specific curated past selections, and daily job creation news feeds.")
    ]

    for h, b in specs:
        ph = rtf.add_paragraph()
        ph.text = h
        ph.font.size = Pt(10)
        ph.font.bold = True
        ph.font.color.rgb = TEXT_LIGHT

        pb = rtf.add_paragraph()
        pb.text = b
        pb.font.size = Pt(8.8)
        pb.font.color.rgb = TEXT_DIM

    s6.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 6):\n"
        "- Explain the robust 4-tier engineering stack: Frontend (React 19/Tailwind), API Gateway (FastAPI), AI Engine (NVIDIA NIM + Qdrant), Data Layer (SQL + Cloudinary).\n"
        "- Highlight Hybrid RAG: We don't just rely on vectors; we fuse BM25 keyword precision with vector semantics, eliminating hallucinations.\n"
        "- All resume parsing and roadmaps run asynchronously with strict JSON schema guardrails."
    )

    # =========================================================================
    # SLIDE 7: Scalability, Feasibility, Real-World Impact & Long-Term Vision
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7, LIGHT_BG)
    add_header(s7, "Scalability, Feasibility, Real-World Impact & Long-Term Vision", "PRODUCTION IMPACT & STRATEGIC ROADMAP")

    # 4 Quadrant Cards
    quads = [
        ("1. Scalability & Deployment", [
            ("Institutional Rollout:", "Easily deployable at college placement-cell level and scalable to 100+ universities."),
            ("Multi-Domain Breadth:", "Engineered to scale beyond PMIS into national apprenticeships, PSU hiring, and private tech drives."),
            ("Stateless Cloud Backend:", "Containerized FastAPI microservices scale horizontally with low compute overhead.")
        ], SKY),
        ("2. Feasibility & Accessibility", [
            ("Zero Cost for Students:", "Eliminates commercial course paywalls by prioritizing verified open-source and free resources."),
            ("Low Hardware Barrier:", "100% web-based; operates smoothly on entry-level smartphones and basic laptops."),
            ("Lightweight AI Integration:", "Hybrid retrieval minimizes token cost while maximizing grounded output accuracy.")
        ], EMERALD),
        ("3. Tri-Party Real-World Impact", [
            ("For Students:", "Transforms rejection anxiety into structured daily progress, 95% ATS score, and interview confidence."),
            ("For Placement Cells:", "Automates resume audits, identifies branch-level skill gaps, and accelerates recruitment drives."),
            ("For Recruiters:", "Access to pre-screened, role-aligned candidates ready for Day-1 productivity.")
        ], ORANGE),
        ("4. Long-Term Strategic Vision", [
            ("Continuous Career Ecosystem:", "From 1st-year college exploration to Day-1 corporate onboarding."),
            ("National Placement Standard:", "Creating an open benchmark for verifiable skill preparedness across Indian academia."),
            ("Recruiter Loop Feedback:", "Closing the loop with automated corporate feedback informing student learning plans.")
        ], INDIGO)
    ]

    qw = Inches(5.7)
    qh = Inches(2.6)
    coords = [
        (Inches(0.8), Inches(1.45)),  # Top-Left
        (Inches(6.8), Inches(1.45)),  # Top-Right
        (Inches(0.8), Inches(4.25)),  # Bottom-Left
        (Inches(6.8), Inches(4.25))   # Bottom-Right
    ]

    for (q_title, q_items, acc_col), (qx, qy) in zip(quads, coords):
        q_box = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, qx, qy, qw, qh)
        q_box.fill.solid()
        q_box.fill.fore_color.rgb = LIGHT_CARD
        q_box.line.color.rgb = BORDER_COL
        q_box.line.width = Pt(1.5)

        q_tf = q_box.text_frame
        q_tf.word_wrap = True
        qt0 = q_tf.paragraphs[0]
        qt0.text = q_title
        qt0.font.size = Pt(12)
        qt0.font.bold = True
        qt0.font.color.rgb = acc_col

        for sub_h, sub_d in q_items:
            p1 = q_tf.add_paragraph()
            p1.text = f"{sub_h} {sub_d}"
            p1.font.size = Pt(8.8)
            p1.font.color.rgb = TEXT_DARK
            p1.paragraphs = [p1]

    s7.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 7):\n"
        "- Conclude the presentation by summarizing the transformative real-world impact across students, colleges, and recruiters.\n"
        "- Emphasize feasibility: Zero student cost, accessible on low-end devices, open-source first.\n"
        "- Outline the long-term vision: Evolving from a single scheme tool into a comprehensive, national career readiness standard.\n"
        "- Thank the judges and open the floor for Q&A and live prototype demonstration."
    )

    output_path = "PM_Internship_AI_Career_Readiness_Platform.pptx"
    prs.save(output_path)
    print(f"Presentation successfully saved to {output_path}!")

if __name__ == "__main__":
    create_deck()
