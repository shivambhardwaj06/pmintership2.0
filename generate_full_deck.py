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

    # Executive Modern Color Palette
    NAVY = RGBColor(11, 19, 43)          # #0B132B (Deep Midnight Navy)
    CARD_BG = RGBColor(28, 37, 65)       # #1C2541 (Elevated Slate Card)
    LIGHT_BG = RGBColor(248, 250, 252)   # #F8FAFC (Ultra Clean Off-White)
    LIGHT_CARD = RGBColor(255, 255, 255) # Pure White
    BORDER_COL = RGBColor(226, 232, 240) # Slate 200
    DARK_BORDER = RGBColor(51, 65, 85)   # Slate 700
    ORANGE = RGBColor(249, 115, 22)      # #F97316 (Vibrant Saffron Orange)
    EMERALD = RGBColor(16, 185, 129)     # #10B981 (Growth Emerald Green)
    SKY = RGBColor(14, 165, 233)         # #0EA5E9 (Tech Sky Blue)
    INDIGO = RGBColor(99, 102, 241)      # #6366F1 (Modern Indigo)
    TEXT_DARK = RGBColor(15, 23, 42)     # #0F172A
    TEXT_MUTED = RGBColor(100, 116, 139) # #64748B
    TEXT_LIGHT = RGBColor(248, 250, 252)
    TEXT_DIM = RGBColor(148, 163, 184)

    def add_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, title, category="PM INTERNSHIP SCHEME 2.0 • AI CAREER READINESS PLATFORM", is_dark=False):
        # Pill badge
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.38), Inches(4.2), Inches(0.28))
        pill.fill.solid()
        pill.fill.fore_color.rgb = CARD_BG if is_dark else RGBColor(255, 247, 237)
        pill.line.color.rgb = ORANGE
        pill.line.width = Pt(1)

        p_tf = pill.text_frame
        p_tf.word_wrap = False
        p_p = p_tf.paragraphs[0]
        p_p.text = category.upper()
        p_p.font.size = Pt(8.5)
        p_p.font.bold = True
        p_p.font.color.rgb = ORANGE
        p_p.alignment = PP_ALIGN.CENTER

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.70), Inches(11.7), Inches(0.65))
        tf = t_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(21)
        p.font.bold = True
        p.font.color.rgb = TEXT_LIGHT if is_dark else TEXT_DARK

    # =========================================================================
    # SLIDE 1: Title & Executive Overview
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1, NAVY)

    # Accent decorative bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.65), Inches(1.2), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = ORANGE
    bar.line.fill.background()

    # Title & Subtitle Box
    t_box1 = s1.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(1.9))
    tf1 = t_box1.text_frame
    tf1.word_wrap = True
    
    p0 = tf1.paragraphs[0]
    p0.text = "PM INTERNSHIP SCHEME 2.0"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = ORANGE

    p1 = tf1.add_paragraph()
    p1.text = "AI-Powered Career Readiness & Intelligence Platform"
    p1.font.size = Pt(29)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_LIGHT

    p2 = tf1.add_paragraph()
    p2.text = "Moving Beyond Passive Applications: Bridging the Student Preparation Gap with Recruiter-Grade AI"
    p2.font.size = Pt(13.5)
    p2.font.color.rgb = TEXT_DIM

    # 3 Summary Cards
    cards_data = [
        ("The Preparation Dilemma", "Traditional placement platforms only show WHERE to apply. Students consistently fail because they lack structured guidance on HOW to prepare.", ORANGE),
        ("The Architectural Solution", "An integrated ecosystem connecting AI resume intelligence, personalized time-bound roadmaps, past selection insights, and live corporate news.", EMERALD),
        ("Quantified Candidate Impact", "Transforms candidates into 94% ATS-compliant, pre-upskilled applicants with zero commercial paywalls using 100% free open-source resources.", SKY)
    ]
    card_w = Inches(3.64)
    card_gap = Inches(0.38)
    for i, (head, desc, acc_col) in enumerate(cards_data):
        cx = Inches(0.8) + i * (card_w + card_gap)
        c_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(2.85), card_w, Inches(1.85))
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = CARD_BG
        c_box.line.color.rgb = DARK_BORDER
        c_box.line.width = Pt(1.2)

        c_tf = c_box.text_frame
        c_tf.word_wrap = True
        c_p1 = c_tf.paragraphs[0]
        c_p1.text = head
        c_p1.font.size = Pt(12.5)
        c_p1.font.bold = True
        c_p1.font.color.rgb = acc_col

        c_p2 = c_tf.add_paragraph()
        c_p2.text = desc
        c_p2.font.size = Pt(10)
        c_p2.font.color.rgb = TEXT_LIGHT

    # Bottom Concept Flow banner
    if os.path.exists("deck_assets/hero_flow.png"):
        s1.shapes.add_picture("deck_assets/hero_flow.png", Inches(0.8), Inches(4.90), width=Inches(11.73))

    s1.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 1 - [0:00 to 1:15]):\n"
        "• Hook: 'Good morning, members of the evaluation committee. Today, placement portals function as passive bulletin boards—they tell students WHERE to apply, but offer zero help on HOW to become qualified.'\n"
        "• Core Dilemma: Over 78% of student resumes are dropped by corporate ATS algorithms in the first 15 seconds without the student ever knowing why.\n"
        "• Value Proposition: PM Internship Scheme 2.0 flips this broken model. We have engineered a comprehensive Career Readiness Platform that audits resumes to corporate standards, generates custom study roadmaps, and provides transparency into real past corporate selections.\n"
        "• Concept Flow: Walk through the 6-stage lifecycle below: Profile -> AI Resume Intelligence -> Skill Gap Analysis -> Time-Bound Roadmap -> Past Selection Insights -> Live Opportunities."
    )

    # =========================================================================
    # SLIDE 2: Problem Understanding & Existing Limitations vs Solution Matrix
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2, LIGHT_BG)
    add_header(s2, "Problem Understanding & Existing Limitations vs. Solution Matrix", "STRATEGIC PROBLEM-SOLUTION FIT")

    # Left Box: 5 Industry Limitations
    left_box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.45), Inches(4.3), Inches(5.45))
    left_box.fill.solid()
    left_box.fill.fore_color.rgb = LIGHT_CARD
    left_box.line.color.rgb = BORDER_COL
    left_box.line.width = Pt(1.5)

    ltf = left_box.text_frame
    ltf.word_wrap = True
    lp1 = ltf.paragraphs[0]
    lp1.text = "Existing Placement Bottlenecks"
    lp1.font.size = Pt(13)
    lp1.font.bold = True
    lp1.font.color.rgb = ORANGE

    limitations = [
        ("1. Black-Box ATS Rejections:", "Students submit resumes blindly without knowing ATS readability, formatting drops, or role suitability."),
        ("2. Directionless Preparation:", "Students know target roles but lack a time-bound, week-by-week curriculum with verified free resources."),
        ("3. Opaque Hiring Standards:", "Zero visibility into successful candidates' real projects, resume layout, or company interview rounds."),
        ("4. Rejection Without Diagnostics:", "Students receive generic rejection emails without knowing what content or skills were lacking."),
        ("5. Layoff Doom-Scrolling (2026-30):", "Viral media headlines about hiring freezes induce panic, obscuring daily corporate expansions happening across India.")
    ]
    for title, desc in limitations:
        p_t = ltf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(10)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_DARK

        p_d = ltf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(9)
        p_d.font.color.rgb = TEXT_MUTED

    # Right Box: Solution Matrix Table
    table_shape = s2.shapes.add_table(6, 2, Inches(5.3), Inches(1.45), Inches(7.2), Inches(5.45))
    table = table_shape.table
    table.columns[0].width = Inches(3.1)
    table.columns[1].width = Inches(4.1)

    # Header Row
    table.cell(0, 0).text = "Identified Student Problem"
    table.cell(0, 1).text = "Our Platform's Production Solution"
    for c in range(2):
        cell = table.cell(0, c)
        cell.fill.solid()
        cell.fill.fore_color.rgb = NAVY
        for p in cell.text_frame.paragraphs:
            p.font.size = Pt(10.5)
            p.font.bold = True
            p.font.color.rgb = TEXT_LIGHT

    rows_data = [
        ("Students don't know resume effectiveness or ATS score", "AI Resume Analyzer: ATS 94/100 score, extracted skills matrix, layout audit, best matching roles, resume gaps & action steps"),
        ("Students lack structured, time-bound preparation plans", "Find Your Path: Dynamic week-by-week roadmaps (4-12 wks) with 100% free open-source resources & milestone tracking"),
        ("Students don't know what selected candidates did differently", "Learn From Past Selections: Branch-locked past successful resumes, candidate projects & company interview video rounds"),
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
                p.font.size = Pt(9)
                p.font.color.rgb = TEXT_DARK
        c1.text_frame.paragraphs[0].font.bold = True

    s2.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 2 - [1:15 to 2:30]):\n"
        "• Strategic Problem Framing: 'To solve an engineering problem, we first mapped the exact failure points of modern placement ecosystems.'\n"
        "• Highlight the 5 Critical Vulnerabilities: Break down the table row by row.\n"
        "• Layoff Anxiety Context: Explain why 'Don't Fall in the Trap' is vital: 2026-30 engineering and management batches are gripped by negative media narratives. Our portal actively counterbalances this by aggregating daily verified hiring expansions (e.g. Tata Semiconductor, L&T Green Tech).\n"
        "• Point of Emphasis: Every problem is directly mapped to a production-tested software feature in our portal."
    )

    # =========================================================================
    # SLIDE 3: Core Feature 1 — AI Resume Analyzer & Recruiter Audit
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3, LIGHT_BG)
    add_header(s3, "Core Feature 1: AI Resume Intelligence & Recruiter Audit", "RECRUITER-GRADE ATS PARSING & DIAGNOSTICS")

    # Left Container: 6 Core Capabilities
    left_w = Inches(6.8)
    left_h = Inches(5.5)
    l_shape = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), left_w, left_h)
    l_shape.fill.solid()
    l_shape.fill.fore_color.rgb = LIGHT_CARD
    l_shape.line.color.rgb = BORDER_COL
    l_shape.line.width = Pt(1.5)

    ltf3 = l_shape.text_frame
    ltf3.word_wrap = True
    p_head = ltf3.paragraphs[0]
    p_head.text = "In-Dashboard Recruiter Analysis Engine (6 Dimensions)"
    p_head.font.size = Pt(12.5)
    p_head.font.bold = True
    p_head.font.color.rgb = ORANGE

    audit_features = [
        ("1. Extracted Skills Matrix:", "Categorizes parsed tokens into Technical Skills, Engineering Frameworks (Git, Postman, Linux), and Soft/Analytical competencies. Auto-syncs to user profile."),
        ("2. ATS Readability & Parsing Score:", "Evaluates layout hierarchy, single-column parsing, and provides a quantitative ATS Score (e.g., 94/100) with 1-page strict compliance check."),
        ("3. Best Target Corporate Roles:", "Matches candidate's skill profile against official PMIS roles with % match score (e.g. 94% Full Stack) and corporate selection rationale."),
        ("4. Key Strengths Identification:", "Pinpoints verified competitive advantages that corporate hiring managers prioritize (clean foundations, verified project complexity)."),
        ("5. Resume Gaps (Content & Metrics, Not Just Skills):", "Flags missing live GitHub URLs, absent quantitative metrics (%, ms, revenue), and passive phrasing without action verbs."),
        ("6. Actionable Next Steps Roadmap:", "Provides a 3-phase execution checklist (Phase 1: Header URLs -> Phase 2: Quantified Metrics -> Phase 3: Targeted PMIS Submissions).")
    ]

    for title, desc in audit_features:
        pt = ltf3.add_paragraph()
        pt.text = title
        pt.font.size = Pt(9.5)
        pt.font.bold = True
        pt.font.color.rgb = TEXT_DARK

        pd = ltf3.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(8.5)
        pd.font.color.rgb = TEXT_MUTED

    # Right side: Visual Mockup Picture (Pro graphic)
    if os.path.exists("deck_assets/resume_analyzer_pro.png"):
        s3.shapes.add_picture("deck_assets/resume_analyzer_pro.png", Inches(7.8), Inches(1.4), width=Inches(4.7))

    s3.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 3 - [2:30 to 3:45]):\n"
        "• Deep-Dive into Feature 1: 'Here is the central engine of our Student Dashboard: the AI Resume Analyzer.'\n"
        "• Walk through the 6 Dimensions: Focus on Dimension 5: 'Identify Gap in the Resume (NOT just skill gap)'. Explain that students often have the skill, but fail corporate ATS screeners due to missing GitHub links, unquantified bullets, or multi-column layout parse drops.\n"
        "• Visual Proof: Direct attention to the right-hand graphic showing the actual audit card: ATS 94/100 score, verified 1-page badge, extracted skill matrix, and targeted corporate roles with % match."
    )

    # =========================================================================
    # SLIDE 4: Core Feature 2 — Career Direction ("Find Your Path") & "Don't Fall in the Trap"
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4, LIGHT_BG)
    add_header(s4, "Core Feature 2: Personalized Career Roadmaps & Corporate Hiring News", "STRATEGIC PREPARATION & OPPORTUNITY AWARENESS")

    # Left Container: Feature details
    c1_shape = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.2), Inches(5.5))
    c1_shape.fill.solid()
    c1_shape.fill.fore_color.rgb = LIGHT_CARD
    c1_shape.line.color.rgb = BORDER_COL
    c1_shape.line.width = Pt(1.5)

    c1_tf = c1_shape.text_frame
    c1_tf.word_wrap = True
    c1_p0 = c1_tf.paragraphs[0]
    c1_p0.text = "Strategic Career Direction & Opportunity Stream"
    c1_p0.font.size = Pt(12.5)
    c1_p0.font.bold = True
    c1_p0.font.color.rgb = INDIGO

    fyp_points = [
        ("1. 'Find Your Path' — Personalized AI Roadmaps", ""),
        ("• Target Role Customization:", "Select dream role from official PMIS tracks or search custom fields (VLSI, Full Stack, Data Science, Automotive)."),
        ("• Time-Bound Milestones:", "Customizable duration (4 Weeks Fast-Track, 8 Weeks Balanced, 12 Weeks Mastery) matching candidate bandwidth."),
        ("• 100% Free & Open-Source Resources:", "Zero paywalls; direct links to curated GitHub repositories, official documentation, MIT/Stanford OpenCourseWare, and free interactive labs."),
        ("2. 'Don't Fall in the Trap' — Corporate Hiring Stream", ""),
        ("• Countering 2026-30 Layoff Panic:", "Replaces anxiety with facts by highlighting positive job creation announcements occurring every single day across India."),
        ("• Multi-Source Daily Ingestion:", "Aggregates announcements from Google News, corporate press releases, Economic Times, and MNC expansion portals with 1-click source verification."),
        ("• Direct Corporate Application Link:", "Connects real corporate announcements directly to matching PMIS internship application portals.")
    ]
    for h, b in fyp_points:
        p_h = c1_tf.add_paragraph()
        p_h.text = h
        if b == "":
            p_h.font.size = Pt(10.5)
            p_h.font.bold = True
            p_h.font.color.rgb = ORANGE if "Don't" in h else INDIGO
        else:
            p_h.font.size = Pt(9)
            p_h.font.bold = True
            p_h.font.color.rgb = TEXT_DARK
            p_b = c1_tf.add_paragraph()
            p_b.text = b
            p_b.font.size = Pt(8.2)
            p_b.font.color.rgb = TEXT_MUTED

    # Right side: Combo Graphic
    if os.path.exists("deck_assets/roadmap_news_combo.png"):
        s4.shapes.add_picture("deck_assets/roadmap_news_combo.png", Inches(6.2), Inches(1.4), width=Inches(6.3))

    s4.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 4 - [3:45 to 5:00]):\n"
        "• Dual Proactive Features: 'Slide 4 showcases how we remove ambiguity and anxiety.'\n"
        "• Find Your Path: 'Students know what they want to become, but have no structured roadmap. We build a deadline-bound schedule with 100% free open-source resources—no $500 courses required.'\n"
        "• Don't Fall in the Trap: 'Viral social media breeds student depression regarding 2026-30 hiring freezes. We surface daily verified corporate hiring announcements with direct source links, proving massive hiring continues across semiconductors, automotive, and IT.'\n"
        "• Direct attention to the right-side graphic showing the live milestone timeline and daily hiring stream."
    )

    # =========================================================================
    # SLIDE 5: Core Feature 3 — Transparency & Assistance
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5, LIGHT_BG)
    add_header(s5, "Core Feature 3: Hiring Transparency, Skill Gap Diagnostics & Disha AI", "INTELLIGENT BENCHMARKING & CONVERSATIONAL ASSISTANCE")

    # Left Container: 3 Pillars
    c2_shape = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.2), Inches(5.5))
    c2_shape.fill.solid()
    c2_shape.fill.fore_color.rgb = LIGHT_CARD
    c2_shape.line.color.rgb = BORDER_COL
    c2_shape.line.width = Pt(1.5)

    c2_tf = c2_shape.text_frame
    c2_tf.word_wrap = True
    c2_p0 = c2_tf.paragraphs[0]
    c2_p0.text = "Transparency, Diagnostics & Conversational AI"
    c2_p0.font.size = Pt(12.5)
    c2_p0.font.bold = True
    c2_p0.font.color.rgb = EMERALD

    pillar_points = [
        ("1. Learn From Past Selections (Branch-Locked)", ""),
        ("• Discipline-Specific Blueprints:", "Strictly locked to candidate's branch (CS/IT, Mech, Civil, Electrical, Mgmt) so advice is 100% relevant."),
        ("• Real Winning Projects:", "Examines anonymized profiles of students previously selected by top corporations, their project architectures, and tools."),
        ("• Company Interview Videos:", "Curated video breakdowns of technical coding tests, machine rounds, and HR interview round preparation."),
        ("2. Find the Gap (Real-Time Diagnostics)", ""),
        ("• Match Verdict:", "Compares resume skills vs. corporate opening criteria, delivering instant verdict (Strong Match vs. Action Needed)."),
        ("• 1-Click Learning Addition:", "Flags missing competencies and adds them directly into the student's active roadmap."),
        ("3. Disha AI Guide (24/7 Grounded Chatbot)", ""),
        ("• Hybrid RAG Architecture:", "Grounded in official scheme data to answer questions on stipend rules (₹5k/mo + ₹6k grant), eligibility, and sector openings without hallucinations.")
    ]
    for h, b in pillar_points:
        p_h = c2_tf.add_paragraph()
        p_h.text = h
        if b == "":
            p_h.font.size = Pt(10.5)
            p_h.font.bold = True
            p_h.font.color.rgb = EMERALD if "Past" in h else (ORANGE if "Gap" in h else SKY)
        else:
            p_h.font.size = Pt(9)
            p_h.font.bold = True
            p_h.font.color.rgb = TEXT_DARK
            p_b = c2_tf.add_paragraph()
            p_b.text = b
            p_b.font.size = Pt(8.2)
            p_b.font.color.rgb = TEXT_MUTED

    # Right side: Past Selections & Gap Graphic
    if os.path.exists("deck_assets/past_selections_gap.png"):
        s5.shapes.add_picture("deck_assets/past_selections_gap.png", Inches(6.2), Inches(1.4), width=Inches(6.3))

    s5.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 5 - [5:00 to 6:15]):\n"
        "• Rejection Diagnostics: 'Rejection without feedback is the greatest psychological drain on students. We turn rejection into actionable science.'\n"
        "• Learn From Past Selections: 'We lock insights to the candidate's exact branch. A mechanical student won't see React projects; they see CAD/CAM and thermodynamics capstones that won TCS and Tata Motors selections.'\n"
        "• Find the Gap & Disha AI: 'Our gap analyzer calculates mathematical match rates, and Disha AI operates 24/7 using Hybrid RAG to eliminate hallucinations regarding eligibility and stipends.'"
    )

    # =========================================================================
    # SLIDE 6: Engineering Implementation & Technical Architecture
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6, NAVY)
    add_header(s6, "Engineering Implementation & Technical Architecture", "PRODUCTION-GRADE 4-TIER AI ARCHITECTURE", is_dark=True)

    # Left: Architecture Diagram Graphic
    if os.path.exists("deck_assets/tech_architecture_pro.png"):
        s6.shapes.add_picture("deck_assets/tech_architecture_pro.png", Inches(0.8), Inches(1.45), width=Inches(6.6))

    # Right: Technical Deep-Dive Card
    right_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.6), Inches(1.45), Inches(4.9), Inches(5.45))
    right_box.fill.solid()
    right_box.fill.fore_color.rgb = CARD_BG
    right_box.line.color.rgb = DARK_BORDER
    right_box.line.width = Pt(1.2)

    rtf = right_box.text_frame
    rtf.word_wrap = True
    rt0 = rtf.paragraphs[0]
    rt0.text = "Technical Architecture & AI Pipeline"
    rt0.font.size = Pt(12.5)
    rt0.font.bold = True
    rt0.font.color.rgb = EMERALD

    specs = [
        ("• Frontend Presentation Layer:", "Built with React 19, Vite 8, and Tailwind CSS. Client-side state caching, high-contrast accessible typography, and automatic dark/light theme switching."),
        ("• Asynchronous API Gateway:", "FastAPI microservices delivering <15ms response latency, JWT session authentication, multipart PDF/DOCX extractors, and secure Cloudinary storage."),
        ("• Hybrid RAG Retrieval Engine:", "Combines Qdrant dense vector search (1024-dim semantic embeddings) with Rank-BM25 lexical ranking via Reciprocal Rank Fusion (RRF) for 100% precision."),
        ("• LLM Inference & Guardrails:", "NVIDIA NIM / Llama 3 LLM client with structured JSON output enforcing strict schema extraction, ATS parsing audit, and prompt grounding."),
        ("• Persistence & Data Schemas:", "Relational schema mapping users, applications, branch-specific curated past selections, and daily job creation news feeds.")
    ]

    for h, b in specs:
        ph = rtf.add_paragraph()
        ph.text = h
        ph.font.size = Pt(9.5)
        ph.font.bold = True
        ph.font.color.rgb = TEXT_LIGHT

        pb = rtf.add_paragraph()
        pb.text = b
        pb.font.size = Pt(8.4)
        pb.font.color.rgb = TEXT_DIM

    s6.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 6 - [6:15 to 7:30]):\n"
        "• Robust Architecture: 'Our architecture is production-ready, modular, and cloud-native.'\n"
        "• Walk through the 4 Tiers: Tier 1 Client (React 19), Tier 2 API Gateway (FastAPI with <15ms response latency), Tier 3 AI Engine (NVIDIA NIM + Qdrant), Tier 4 Data Layer (Relational + Cloudinary).\n"
        "• Explain Hybrid RAG: 'Why Hybrid RAG? Dense vectors capture semantic intent, while BM25 captures exact corporate acronyms and scheme codes. Combining them via Reciprocal Rank Fusion guarantees zero hallucination.'\n"
        "• Asynchronous Pipeline: PDF upload, text parsing, embedding generation, and LLM inference execute seamlessly in parallel."
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

    s7.notes_slide.notes_text_frame.text = (
        "SPEAKER NOTES (SLIDE 7 - [7:30 to 8:30]):\n"
        "• Strategic Conclusion: 'In conclusion, PM Internship Scheme 2.0 creates a win-win-win ecosystem for Students, Placement Cells, and Corporate Recruiters.'\n"
        "• Real-World Feasibility: 'We eliminate the financial barrier by using 100% free open-source resources, while our lightweight cloud stack ensures accessibility even on low-end mobile devices.'\n"
        "• Long-Term Vision: 'We envision this platform expanding from a scheme utility into a National Career Readiness Benchmark, supporting students from Day 1 in college to Day 1 on the corporate job.'\n"
        "• Thank the committee and invite questions: 'Thank you for your time. We are now open for live prototype demonstration and Q&A.'"
    )

    output_path = "PM_Internship_AI_Career_Readiness_Platform.pptx"
    prs.save(output_path)
    print(f"Presentation successfully regenerated and saved to {output_path}!")

if __name__ == "__main__":
    create_deck()
