import json
import re
from pathlib import Path
from typing import List, Dict, Any

DATA_DIR = Path(__file__).parent.parent / "data"
RAW_FILE = DATA_DIR / "raw_guide_content.txt"
JSON_FILE = DATA_DIR / "iit_internship_guide.json"


def get_structured_internship_chunks() -> List[Dict[str, Any]]:
    """
    Parses and returns structured, enriched chunks for all 28 pages of the guide.
    If pre-compiled JSON exists, loads it; otherwise parses the raw guide content.
    """
    if JSON_FILE.exists():
        try:
            with open(JSON_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    return data
        except Exception:
            pass

    # Build curated high-density chunks with semantic metadata
    chunks = build_curated_chunks()

    # Save to JSON for instant future loads
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        with open(JSON_FILE, "w", encoding="utf-8") as f:
            json.dump(chunks, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Warning: could not write JSON cache: {e}")

    return chunks


def build_curated_chunks() -> List[Dict[str, Any]]:
    chunks: List[Dict[str, Any]] = []

    # 1. IIT Delhi Summer Internship 2026
    chunks.append({
        "id": "major_iit_delhi_2026",
        "title": "IIT Delhi Summer Internship 2026",
        "category": "major_iit_program",
        "page": 1,
        "organization": "IIT Delhi",
        "branches": ["All Engineering", "All Sciences", "UG", "PG"],
        "eligibility": "UG/PG students from recognised institutions. Typically pre-final year or students available full-time during summer.",
        "stipend": "No fixed central stipend. Varies by department/project/funding source (₹5k–₹15k/month based on past cycles; some unpaid).",
        "duration": "6–8 weeks (May–June/July), On-campus",
        "apply_url": "https://home.iitd.ac.in/ (Search: IIT Delhi Summer Internship / SRIP 2026)",
        "deadline": "Applications open Mar–Apr 2026, Selection Apr–May 2026",
        "timeline": "Notification: Feb–Mar 2026 | Applications: Mar–Apr 2026 | Selection: Apr–May 2026 | Internship: May–Jul 2026",
        "content": (
            "IIT Delhi Summer Internship 2026 (Page 1)\n"
            "Program: Faculty-mentored, hands-on research internship under IIT Delhi departments.\n"
            "Eligibility: UG/PG students from recognised institutions; typically pre-final year or available full-time during summer.\n"
            "Stipend: No fixed central stipend. Stipend varies by department, project, or funding source (ranges roughly ₹5k–₹15k/month based on past cycles; some unpaid).\n"
            "Duration & Mode: ~6–8 weeks (May–June/July) | On-campus.\n"
            "How to Apply: Visit official IIT Delhi website -> Search 'IIT Delhi Summer Internship / SRIP 2026' -> Register -> Upload CV & mark sheets -> Select department/project preferences -> Submit before deadline.\n"
            "Timeline: Notification: Feb–Mar 2026; Applications: Mar–Apr 2026; Selection: Apr–May 2026; Internship: May–Jul 2026."
        )
    })

    # 2. IIT Kanpur SURGE 2026
    chunks.append({
        "id": "major_iit_kanpur_surge_2026",
        "title": "IIT Kanpur SURGE 2026 (Students Undergraduate Research Graduate Excellence)",
        "category": "major_iit_program",
        "page": 2,
        "organization": "IIT Kanpur",
        "branches": ["UG Engineering", "Sciences", "Economics", "Design"],
        "eligibility": "Indian UG students from recognised institutions, IIT Kanpur students (internal track), and limited seats for Nepal & Bhutan students. Typically 2nd/3rd year. CPI generally >= ~6.0 (Non-IITK; varies by category).",
        "stipend": "Funding depends on category (Institute-funded / Project-funded / Self-funded / SAARC). Some categories receive partial financial support. Registration & administrative fees apply. Hostel & mess charges extra.",
        "duration": "8 weeks (11 May – 10 July 2026 official)",
        "apply_url": "https://surge.iitk.ac.in/",
        "deadline": "22 February 2026",
        "timeline": "Deadline: 22 Feb 2026. Program dates: 11 May - 10 July 2026.",
        "content": (
            "IIT Kanpur SURGE 2026 (Page 2)\n"
            "Program: SURGE – Students Undergraduate Research Graduate Excellence (8-week structured summer research program).\n"
            "Who Can Apply: Indian UG students from recognised institutions, IIT Kanpur students (internal track), Students from Nepal & Bhutan (limited seats).\n"
            "Eligibility: UG students (typically 2nd/3rd year); CPI generally >= ~6.0 (Non-IITK; varies by category).\n"
            "Stipend & Fees: Funding depends on category (Institute-funded / Project-funded / Self-funded / SAARC). Some categories receive partial financial support. Registration & admin fees apply; hostel & mess charges extra.\n"
            "Duration: 11 May – 10 July 2026 (official).\n"
            "How to Apply: Online application at official portal https://surge.iitk.ac.in/ - upload documents & preferences.\n"
            "Application Deadline: 22 February 2026."
        )
    })

    # 3. IIT Goa Summer Internship 2026
    chunks.append({
        "id": "major_iit_goa_2026",
        "title": "IIT Goa Summer Internship 2026 (Track A & Track B)",
        "category": "major_iit_program",
        "page": 2,
        "organization": "IIT Goa",
        "branches": ["B.Tech", "B.Sc", "B.A", "Dual Degree", "M.A.", "M.Sc.", "M.C.A."],
        "eligibility": "UG/PG students (B.Tech, B.Sc, B.A, Dual, M.A., M.Sc., M.C.A.). M.Tech is typically NOT eligible based on previous cycles. Bonafide certificate required.",
        "stipend": "Track A: Paid (earlier cycles ~₹5,000/month). Track B: Unpaid or variable (depends on project).",
        "duration": "~6–8 weeks (May – mid-July), On-campus",
        "apply_url": "IIT Goa official website (Summer Internship section)",
        "deadline": "Expected based on 2025 cycle (portal opens early 2026)",
        "timeline": "Duration: ~6–8 weeks (May – mid-July). Accommodation: Hostel & mess available (charges apply).",
        "content": (
            "IIT Goa Summer Internship 2026 (Pages 2-3)\n"
            "Program: Summer Research Internship with Track A & Track B.\n"
            "Eligibility: UG/PG students (B.Tech, B.Sc, B.A, Dual, M.A., M.Sc., M.C.A.). M.Tech typically NOT eligible. Bonafide certificate required.\n"
            "Tracks & Stipend: Track A is Paid (earlier cycles ~₹5,000/month); Track B is Unpaid or variable depending on project.\n"
            "Duration & Mode: ~6–8 weeks (May – mid-July) | On-campus.\n"
            "Accommodation: Hostel & mess available (charges apply).\n"
            "How to Apply: Visit IIT Goa official website -> Navigate to Summer Internship section -> Choose Track A or Track B -> Fill form & upload documents."
        )
    })

    # 4. IIT Roorkee SPARK Internship 2026
    chunks.append({
        "id": "major_iit_roorkee_spark_2026",
        "title": "IIT Roorkee SPARK Internship 2026",
        "category": "major_iit_program",
        "page": 3,
        "organization": "IIT Roorkee",
        "branches": ["B.Tech", "B.E", "BS-MS", "B.Arch", "M.Sc", "MA", "Engineering", "Architecture"],
        "eligibility": "UG/PG students with minimum 2 semesters completed and at least 1 semester remaining after summer.\nTypical CGPA Cut-offs:\n- IITs/IISc: > 7.5\n- NITs/IISER/NISER/IIEST/UM-DAE CBS: > 8.0\n- Other institutes: > 8.5",
        "stipend": "₹2,500 per week for institute-funded internships. Certificate on completion. Access to campus facilities.",
        "duration": "~6–8 weeks (May–July), On-campus",
        "apply_url": "https://spark.iitr.ac.in/",
        "deadline": "March 2026 (Applications open Mid-Feb 2026)",
        "timeline": "Applications open: Mid-Feb 2026 | Deadline: March 2026 | Internship: May–July 2026",
        "content": (
            "IIT Roorkee SPARK Internship 2026 (Page 3)\n"
            "Program: SPARK – Structured Program for Academic Research & Knowledge.\n"
            "Eligibility: UG/PG students (B.Tech / B.E / BS-MS / B.Arch / M.Sc / MA). Minimum 2 semesters completed; at least 1 semester remaining after summer.\n"
            "Typical CGPA Cut-offs: IITs/IISc: > 7.5; NITs/IISER/NISER/IIEST/UM-DAE CBS: > 8.0; Other institutes: > 8.5.\n"
            "Stipend & Benefits: ₹2,500 per week (for institute-funded internships), Certificate on completion, full access to campus facilities.\n"
            "Duration & Mode: ~6–8 weeks (May–July) | On-campus.\n"
            "How to Apply: Visit https://spark.iitr.ac.in/ -> Register & login -> Upload marksheet, photo, CV, 500-word research statement -> Select faculty/projects.\n"
            "Timeline: Opens Mid-Feb 2026, Deadline March 2026, Internship May–July 2026."
        )
    })

    # 5. IIT Hyderabad SURE Program 2026
    chunks.append({
        "id": "major_iit_hyderabad_sure_2026",
        "title": "IIT Hyderabad SURE Program 2026",
        "category": "major_iit_program",
        "page": 4,
        "organization": "IIT Hyderabad",
        "branches": ["UG (all branches)", "select PG in some projects", "CSE", "AI", "EE", "Mechanical", "Biomedical", "Materials"],
        "eligibility": "Non-IITH students. UG students (select PG in some projects). Generally top ~20% academic performers.",
        "stipend": "Earlier cycles offered ~₹15,000 for ~2 months (Exact amount depends on project & duration).",
        "duration": "~1–2 months, On-campus, full-time",
        "apply_url": "Official IIT Hyderabad website (SURE 2026 portal)",
        "deadline": "Portal expected Feb–Mar 2026",
        "timeline": "Portal expected Feb-Mar 2026 | Duration: ~1-2 months full-time on-campus",
        "content": (
            "IIT Hyderabad SURE Program 2026 (Page 4)\n"
            "Program: SURE – Summer Undergraduate Research Exposure.\n"
            "Eligibility: Non-IITH students; UG students (select PG in some projects); Generally top ~20% academic performers.\n"
            "Stipend: Earlier cycles offered ~₹15,000 for ~2 months (exact amount depends on project & duration).\n"
            "Duration & Mode: ~1–2 months | On-campus, full-time.\n"
            "How to Apply: Check IIT Hyderabad official website -> Navigate to SURE 2026 portal once live -> Select project -> Apply online.\n"
            "Timeline: Portal expected Feb–Mar 2026."
        )
    })

    # 6. IIT Gandhinagar SRIP 2026
    chunks.append({
        "id": "major_iit_gandhinagar_srip_2026",
        "title": "IIT Gandhinagar SRIP 2026",
        "category": "major_iit_program",
        "page": 4,
        "organization": "IIT Gandhinagar",
        "branches": ["UG all years", "1st-year PG students", "Engineering", "Sciences", "Humanities", "Interdisciplinary"],
        "eligibility": "UG (all years) and 1st-year PG students from recognised institutions.",
        "stipend": "~₹2,000 per week (based on previous cycles). Certificate, poster presentations, strong research exposure.",
        "duration": "Minimum ~8 weeks, On-campus",
        "apply_url": "Official IIT Gandhinagar SRIP portal",
        "deadline": "Check official SRIP portal when opened",
        "timeline": "Minimum ~8 weeks during summer",
        "content": (
            "IIT Gandhinagar SRIP 2026 (Page 4)\n"
            "Program: SRIP – Summer Research Internship Programme.\n"
            "Eligibility: UG (all years) and 1st-year PG students.\n"
            "Stipend: ~₹2,000 per week (based on previous cycles).\n"
            "Duration & Mode: Minimum ~8 weeks | On-campus.\n"
            "How to Apply: Apply via official SRIP portal when opened; submit Statement of Purpose (SOP) & academic details.\n"
            "Extras: Certificate on completion, poster presentations, strong research exposure."
        )
    })

    # 7. IIT Bhubaneswar Summer Internship 2026
    chunks.append({
        "id": "major_iit_bhubaneswar_2026",
        "title": "IIT Bhubaneswar Summer Internship 2026",
        "category": "major_iit_program",
        "page": 5,
        "organization": "IIT Bhubaneswar",
        "branches": ["UG", "PG", "Engineering", "Earth & Ocean Sciences", "Sciences"],
        "eligibility": "UG/PG students from IIT Bhubaneswar & other institutes.",
        "stipend": "No central stipend guarantee (depends on department or project funding).",
        "duration": "Summer vacation (May–June), On-campus",
        "apply_url": "IIT Bhubaneswar official website",
        "deadline": "Fill online application when live (May-June vacation period)",
        "timeline": "May–June summer vacation period",
        "content": (
            "IIT Bhubaneswar Summer Internship 2026 (Page 5)\n"
            "Program: Department-level summer research internships.\n"
            "Eligibility: UG/PG students from IIT Bhubaneswar & other institutes.\n"
            "Stipend: No central stipend guarantee (stipend, if any, depends on department or project).\n"
            "Duration & Mode: Summer vacation (May–June) | On-campus.\n"
            "How to Apply: Check IIT Bhubaneswar official website -> Fill online application when live -> Upload required documents."
        )
    })

    # Pro Tips & Guidelines (Pages 5, 6, 28)
    chunks.append({
        "id": "pro_tips_guidelines",
        "title": "Tips to Increase Your Chances & Application Best Practices",
        "category": "guidelines",
        "page": 5,
        "organization": "Guide Advice",
        "branches": ["All Branches"],
        "eligibility": "All applicants",
        "stipend": "N/A",
        "duration": "N/A",
        "apply_url": "N/A",
        "deadline": "N/A",
        "timeline": "Prepare before application portals open",
        "content": (
            "Tips to Increase Your Chances of Selection (Pages 5, 28):\n"
            "1. Write a project-specific SOP (Statement of Purpose), not a generic one. Tailor it to the professor's recent publications.\n"
            "2. Shortlist faculty before applying — read their research interests and reach out or align your application with active lab projects.\n"
            "3. Apply early — some portals close very fast once application volume peaks.\n"
            "4. Keep CV, semester mark sheets, and No Objection Certificate (NOC) from your college ready in advance.\n"
            "5. Safety & Verification: Always confirm official institute domains (.ac.in or .gov.in). Never pay any money or UPI transfer to 'secure' an internship. Genuine internships never ask for fees to hire you.\n"
            "6. Request written confirmation of stipend, faculty supervisor, work location, and certificate policy."
        )
    })

    # Branch-wise search checklist (Page 28)
    chunks.append({
        "id": "branch_wise_checklist",
        "title": "Branch-wise Internship Search Checklist & Opportunities",
        "category": "checklist",
        "page": 28,
        "organization": "Search Checklist",
        "branches": ["CSE", "IT", "AI", "Data", "ECE", "EEE", "VLSI", "Mechanical", "Automobile", "Civil", "Architecture", "Chemical", "Biotechnology", "Earth Sciences", "Sciences"],
        "eligibility": "All engineering and science students",
        "stipend": "Varies by sector",
        "duration": "Summer 2026",
        "apply_url": "Institute & company career portals",
        "deadline": "Varies",
        "timeline": "January - May 2026",
        "content": (
            "Branch-wise Search Checklist (Page 28):\n"
            "- Computer Science / IT / AI / Data: Software engineering, AI/ML, data science, cybersecurity, cloud, systems, research labs, NIC, C-DAC, and university faculty projects.\n"
            "- ECE / EEE / VLSI / Embedded: Semiconductor firms, telecom, electronics R&D, power utilities, automation firms, DRDO/ISRO project calls, and IIT/IISc labs.\n"
            "- Mechanical / Automobile / Production / Mechatronics: OEMs, manufacturing plants, robotics, energy, industrial R&D, and mechanical research institutes (CMERI, DRDO, Tata Motors, Maruti).\n"
            "- Civil / Architecture / Planning / Geomatics: Infrastructure firms, structural labs, CBRI, water resources, transport, GIS/remote sensing, and architecture studios.\n"
            "- Chemical / Petroleum / Polymer / Materials / Metallurgy / Mining: Process industries, refineries, steel, polymers, CSIR labs, materials labs, and geology/mining research units.\n"
            "- Biotechnology / Biomedical / Pharmacy / Food / Agriculture: Biotech and pharma R&D, hospitals/health technology firms, ICMR/ICAR institutes, food labs, and life-science research centres.\n"
            "- Environmental / Energy / Renewable / Ocean / Earth Sciences: Environmental labs, renewable energy companies, NIH, NIOT, IIRS, GSI, CSIR-NEERI, and faculty projects.\n"
            "- Science, Mathematics, Economics, Design, and Interdisciplinary: IISERs, TIFR, IISc, IIT research projects, design labs, UX/product internships, and incubated startups."
        )
    })

    # Parse 101 Additional Leads from Page 7 to 27
    leads_raw = [
        # Page 7: 1-5
        (1, "IIT Madras", "Research Internship / faculty projects", "Engineering, Sciences, AI, Ocean Engineering, Design", "Faculty/project-specific; check institute and lab pages.", 7),
        (2, "IIT Bombay", "Research & Department Projects", "CSE, EE, Mechanical, Civil, Chemical, Aerospace, Energy", "Look for faculty project calls and department notices.", 7),
        (3, "IIT Delhi", "Faculty-Led Research Projects", "All major engineering and science branches", "Project-specific; the original guide's cycle details may have changed.", 7),
        (4, "IIT Kanpur", "SURGE / faculty research", "Engineering, Sciences, Economics, Design-related projects", "Check current SURGE notice and eligibility.", 7),
        (5, "IIT Roorkee", "SPARK / research projects", "Civil, Mechanical, Electrical, CSE, Hydrology, Earth Sciences", "Check official SPARK portal and department calls.", 7),

        # Page 8: 6-10
        (6, "IIT Hyderabad", "SURE / research projects", "CSE, AI, EE, Mechanical, Biomedical, Materials", "Check current SURE notice and project list.", 8),
        (7, "IIT Gandhinagar", "SRIP", "Engineering, Sciences, Humanities, interdisciplinary research", "Check current SRIP portal.", 8),
        (8, "IIT Guwahati", "Summer Research Internship / projects", "CSE, ECE, Mechanical, Civil, Chemical, Biosciences", "Check institute and department notices.", 8),
        (9, "IIT Bhubaneswar", "Department Research Projects", "Engineering, Earth & Ocean Sciences, Sciences", "Project availability varies by department.", 8),
        (10, "IIT Indore", "Summer Research / faculty projects", "CSE, Electrical, Mechanical, Civil, Chemistry, Physics", "Check official announcements and faculty pages.", 8),

        # Page 9: 11-15
        (11, "IIT Mandi", "Research Internship / faculty projects", "CSE, Data Science, EE, Mechanical, Biosciences", "Check institute research calls.", 9),
        (12, "IIT Ropar", "Research Projects", "CSE, EE, Mechanical, Civil, Biomedical", "Check current project-specific openings.", 9),
        (13, "IIT Jodhpur", "Research Internship / projects", "AI, CSE, EE, Mechanical, Bioscience, Materials", "Check institute and faculty pages.", 9),
        (14, "IIT Patna", "Research / Summer Internship Projects", "CSE, ECE, Mechanical, Civil, Chemical, Mathematics", "Check official notices.", 9),
        (15, "IIT Bhilai", "Faculty Research Projects", "CSE, Data Science, Electrical, Mechanical", "Check institute announcements.", 9),

        # Page 10: 16-20
        (16, "IIT Dharwad", "Research Projects", "CSE, Electrical, Mechanical, interdisciplinary engineering", "Check faculty and institute pages.", 10),
        (17, "IIT Jammu", "Research Internship / projects", "CSE, EE, Mechanical, Civil, Chemical", "Check current institute calls.", 10),
        (18, "IISc Bengaluru", "Research / project internships", "Aerospace, ECE, Materials, Chemical, Bio, Physics, Computing", "Many roles are lab- or faculty-specific; verify eligibility.", 10),
        (19, "IISER Pune", "Research Internship / project calls", "Biology, Chemistry, Physics, Mathematics, Earth & Climate", "Check official internship and faculty pages.", 10),
        (20, "IISER Kolkata", "Research Projects", "Biological, Chemical, Physical, Mathematical sciences", "Check current project calls.", 10),

        # Page 11: 21-25
        (21, "IISER Mohali", "Research Internship", "Biology, Chemistry, Physics, Mathematics, Earth & Environmental", "Check institute announcements.", 11),
        (22, "IISER Bhopal", "Research Projects", "Biological Sciences, Chemistry, Physics, Mathematics, Engineering Sciences", "Check faculty and project pages.", 11),
        (23, "IISER Thiruvananthapuram", "Research Projects", "Biology, Chemistry, Physics, Mathematics", "Check current institute notices.", 11),
        (24, "NIT Tiruchirappalli (NIT Trichy)", "Faculty/Department Projects", "CSE, ECE, Civil, Mechanical, Chemical, Production", "Project-based; ask departments about current calls.", 11),
        (25, "NIT Warangal", "Research / Department Projects", "CSE, ECE, Electrical, Mechanical, Civil, Biotechnology", "Check official department announcements.", 11),

        # Page 12: 26-30
        (26, "NIT Karnataka, Surathkal", "Research Projects", "CSE, IT, ECE, Mechanical, Civil, Mining, Chemical", "Check faculty/lab pages.", 12),
        (27, "NIT Calicut", "Department Research Projects", "Architecture, Civil, Mechanical, ECE, CSE, Chemical", "Check institute and department pages.", 12),
        (28, "NIT Rourkela", "Research Projects", "Mining, Metallurgy, Chemical, Civil, Mechanical, CSE", "Check project-funded openings.", 12),
        (29, "NIT Durgapur", "Research Projects", "CSE, Electrical, Mechanical, Chemical, Metallurgy", "Check official notices.", 12),
        (30, "NIT Silchar", "Research Projects", "CSE, ECE, EE, Civil, Mechanical", "Check faculty pages and institute announcements.", 12),

        # Page 13: 31-35
        (31, "CSIR - Council of Scientific & Industrial Research", "National Laboratories / Project Internships", "Chemical, Materials, Physics, Chemistry, Biology, Engineering", "Search individual CSIR lab websites for student project calls.", 13),
        (32, "DRDO - Defence Research and Development Organisation", "Student Internship / Project Training", "Mechanical, Aerospace, Electronics, CSE, Materials, Physics", "Eligibility and access depend on lab and current policy; use official DRDO channels.", 13),
        (33, "ISRO - Indian Space Research Organisation", "Student Project / Internship opportunities", "Aerospace, Avionics, Electronics, Mechanical, CSE, Physics", "Use official ISRO centre notices; openings are centre-specific.", 13),
        (34, "BARC - Bhabha Atomic Research Centre", "Training / Project Work", "Nuclear, Chemical, Mechanical, Electrical, Materials, Physics", "Eligibility and application route vary; verify official BARC notices.", 13),
        (35, "ICMR institutes", "Research internships/projects", "Biotechnology, Biomedical, Life Sciences, Public Health, Bioinformatics", "Check individual ICMR institute notices.", 13),

        # Page 14: 36-40
        (36, "ICAR institutes", "Student research/project work", "Agriculture, Food Technology, Biotechnology, Environmental Sciences", "Check individual institute and project announcements.", 14),
        (37, "NCBS - National Centre for Biological Sciences", "Research Internships", "Biology, Bioinformatics, Neuroscience, Computational Biology", "Check official student/research opportunities.", 14),
        (38, "TIFR - Tata Institute of Fundamental Research", "Research Internships", "Physics, Chemistry, Biology, Mathematics, Computer Science", "Programs and eligibility differ by centre and discipline.", 14),
        (39, "CSIR-NCL - National Chemical Laboratory", "Project Work", "Chemical Engineering, Chemistry, Materials, Polymers", "Check official NCL project/trainee notices.", 14),
        (40, "CSIR-CMERI - Central Mechanical Engineering Research Institute", "Research Internships", "Mechanical, Manufacturing, Robotics, Energy", "Check official project openings.", 14),

        # Page 15: 41-45
        (41, "CSIR-CBRI - Central Building Research Institute", "Research Projects", "Civil, Structural, Architecture, Materials, Earthquake Engineering", "Check current project/training notices.", 15),
        (42, "CSIR-NEERI - National Environmental Engineering Research Institute", "Research Internships", "Environmental, Civil, Chemical, Biotechnology", "Check official project and student training notices.", 15),
        (43, "IISER Summer Programs", "Natural sciences and computational research", "Natural sciences and computational research", "Apply only when a specific official call is open.", 15),
        (44, "BEL - Bharat Electronics Limited", "Student Training", "Electronics, Electrical, Mechanical, CSE", "Training availability is unit-specific; confirm whether internships are accepted.", 15),
        (45, "BHEL - Bharat Heavy Electricals Limited", "Industrial Training", "Mechanical, Electrical, Electronics, Production", "Unit-wise permissions, dates and fees may differ.", 15),

        # Page 16: 46-50
        (46, "Power Grid Corporation", "Student Training", "Electrical, Civil, Electronics, IT", "Check official careers/training policy; not a guaranteed annual opening.", 16),
        (47, "NTPC", "Student Industrial Training", "Mechanical, Electrical, Civil, C&I, Chemical", "Check plant/unit-specific requirements.", 16),
        (48, "Indian Railways / RDSO", "Technical Project Exposure", "Civil, Mechanical, Electrical, Electronics, Computer Engineering", "Formal approvals and current notices required.", 16),
        (49, "ONGC", "Student Training / Project Work", "Petroleum, Chemical, Mechanical, Geology, Geophysics, Electrical", "Check official policy and regional/unit availability.", 16),
        (50, "GAIL", "Industrial Training / Projects", "Chemical, Mechanical, Electrical, Instrumentation, CSE", "Confirm availability with official HR/unit channels.", 16),

        # Page 17: 51-55
        (51, "IOCL - Indian Oil Corporation", "Industrial Training", "Chemical, Mechanical, Electrical, Instrumentation, Civil", "Unit-specific; follow official training instructions.", 17),
        (52, "Maruti Suzuki", "Engineering Internship / Projects", "Mechanical, Automobile, Production, Electrical, Electronics", "Check company careers page for current student roles.", 17),
        (53, "Tata Motors", "Engineering Internship", "Automotive, Mechanical, Electrical, Electronics, CSE, Materials", "Search official careers listings; openings vary by location.", 17),
        (54, "Mahindra", "Engineering / R&D Internships", "Automotive, Mechanical, Mechatronics, CSE, Data, Design", "Check official careers portal for student roles.", 17),
        (55, "Bosch India", "Engineering Internships", "Embedded, Automotive, Mechanical, Electronics, CSE, Data", "Search official Bosch careers listings.", 17),

        # Page 18: 56-60
        (56, "Siemens India", "Student / Engineering Internships", "Electrical, Automation, Mechanical, Electronics, CSE", "Check official careers portal and location-specific roles.", 18),
        (57, "Schneider Electric India", "Internships", "Electrical, Energy, Automation, Electronics, Sustainability", "Check official careers listings.", 18),
        (58, "Larsen & Toubro (L&T)", "Engineering Internships / Training", "Civil, Mechanical, Electrical, Construction, Instrumentation", "Business-unit and project-specific; verify through official channels.", 18),
        (59, "Tata Steel", "Technical Internships / Projects", "Metallurgy, Materials, Mechanical, Chemical, Mining, Civil", "Check official careers and campus programs.", 18),
        (60, "Reliance Industries", "Engineering / R&D Internships", "Chemical, Materials, Mechanical, Electrical, Data, Biotechnology", "Check official careers listings and business-unit requirements.", 18),

        # Page 19: 61-65
        (61, "Asian Paints", "R&D / Process Projects", "Chemical, Polymer, Materials, Mechanical, Data Analytics", "Check official careers portal for internships.", 19),
        (62, "Cipla", "R&D / Manufacturing Internships", "Pharmacy, Chemical, Biotechnology, Biomedical, Data", "Check official careers listings; regulated lab access may require specific qualifications.", 19),
        (63, "Dr. Reddy's Laboratories", "R&D / Engineering Internships", "Pharmacy, Chemistry, Chemical, Biotechnology, Data", "Check official careers listings.", 19),
        (64, "Biocon", "Research / Bioprocess Internships", "Biotechnology, Biochemistry, Microbiology, Chemical, Bioinformatics", "Check official careers and research-unit openings.", 19),
        (65, "Syngene International", "Research Internships", "Biology, Chemistry, Biotechnology, Bioinformatics, Chemical", "Check official careers; role eligibility varies.", 19),

        # Page 20: 66-70
        (66, "Thermo Fisher Scientific India", "Internships", "Biomedical, Biotechnology, Chemistry, Mechanical, Software/Data", "Check official careers listings.", 20),
        (67, "Philips India", "Engineering / Healthcare Technology Internships", "Biomedical, Electronics, Mechanical, CSE, AI/Data", "Check official careers portal.", 20),
        (68, "GE HealthCare India", "Engineering Internships", "Biomedical, Electronics, Mechanical, Software, Data", "Check official careers listings.", 20),
        (69, "Qualcomm India", "Student Engineering Internships", "ECE, EEE, CSE, Embedded Systems, VLSI", "Search official Qualcomm careers for India-based intern roles.", 20),
        (70, "Texas Instruments India", "Internships", "ECE, EEE, VLSI, Embedded Systems, CSE", "Check official careers and university eligibility.", 20),

        # Page 21: 71-75
        (71, "Intel India", "Student Internships", "CSE, ECE, VLSI, Systems, AI, Validation", "Check official careers listings.", 21),
        (72, "NVIDIA India", "Internships", "CSE, AI/ML, Computer Architecture, ECE, Systems", "Check official careers portal; roles can be competitive.", 21),
        (73, "AMD India", "Engineering Internships", "CSE, ECE, VLSI, Verification, Systems", "Check official careers listings.", 21),
        (74, "Samsung R&D Institute India", "Internships", "CSE, ECE, AI/ML, Networks, Software Systems", "Check official Samsung careers portal.", 21),
        (75, "Adobe India", "University Internships", "CSE, Data Science, AI/ML, UX, Product", "Check official careers listings and student eligibility.", 21),

        # Page 22: 76-80
        (76, "Microsoft India", "University Internships", "CSE, AI, Cloud, Data, Product, Security", "Check official careers portal for India roles.", 22),
        (77, "Google India", "Student Research / Software Internships", "CSE, AI/ML, Data, UX, Security", "Check official Google careers; role locations vary.", 22),
        (78, "Amazon India", "Student / Software Internships", "CSE, Operations Research, Data, Supply Chain, UX", "Check official Amazon jobs portal.", 22),
        (79, "Atlassian India", "Internships", "CSE, Software Engineering, Product, Data", "Check official careers listings.", 22),
        (80, "Flipkart", "Technology / Supply Chain Internships", "CSE, Data Science, Operations, Industrial Engineering", "Check official careers listings.", 22),

        # Page 23: 81-85
        (81, "Swiggy", "Technology / Analytics Internships", "CSE, Data Science, Operations Research, Product", "Check official careers portal.", 23),
        (82, "Zomato / Eternal", "Technology / Analytics Internships", "CSE, Data, Operations, Product, Design", "Check official careers listings.", 23),
        (83, "Zoho", "Software / Product Internships", "CSE, IT, ECE, Design, QA", "Check official Zoho careers and student hiring notices.", 23),
        (84, "Freshworks", "Software / Product Internships", "CSE, IT, Data, UX/Product", "Check official careers listings.", 23),
        (85, "Paytm", "Technology / Data Internships", "CSE, Data Science, Cybersecurity, Product", "Check official careers portal.", 23),

        # Page 24: 86-90
        (86, "PhonePe", "Technology / Data Internships", "CSE, Data, Security, Product, Analytics", "Check official careers listings.", 24),
        (87, "National Informatics Centre (NIC)", "Project Internship/Training", "CSE, IT, ECE, Cybersecurity, Data", "Check current NIC/state-unit policies; not all units accept interns.", 24),
        (88, "C-DAC - Centre for Development of Advanced Computing", "Project / Training Opportunities", "CSE, AI, HPC, Cybersecurity, Embedded, Electronics", "Check official C-DAC centre and course/project announcements.", 24),
        (89, "STPI / Startup Incubators", "Technical Projects", "CSE, Electronics, IoT, AI, Product Design", "Opportunities vary by incubator and startup; verify the host.", 24),
        (90, "Smart India Hackathon / Innovation Labs", "Project Collaboration", "All branches; product, hardware, software, design", "Not a guaranteed internship; use as a route to verified project opportunities.", 24),

        # Page 25: 91-95
        (91, "University Innovation / Incubation Centres", "Startup Internships", "All branches: engineering, business, design, science", "Apply directly to named incubated startups and verify the offer.", 25),
        (92, "Civil / Infrastructure consultancies", "Project Internships", "Civil, Structural, Transportation, Geotechnical, Environmental", "Search verified employer careers pages; site access and safety rules apply.", 25),
        (93, "Architecture firms", "Design Internships", "B.Arch, Urban Planning, Interior, Landscape", "Apply directly to studios; verify registration and work conditions.", 25),
        (94, "Renewable-energy companies", "Engineering Internships", "Electrical, Mechanical, Chemical, Energy, Environmental", "Search official careers pages for solar, wind, storage and grid roles.", 25),
        (95, "Water / Environmental research organisations", "Project Work", "Civil, Environmental, Chemical, Biotechnology, Geology", "Check official project vacancies and university collaborations.", 25),

        # Page 26: 96-100
        (96, "Food technology companies / labs", "Internships", "Food Technology, Chemical, Biotechnology, Microbiology, Packaging", "Verify the host lab/company and current student intake.", 26),
        (97, "Geological Survey of India (GSI)", "Earth-science projects", "Geology, Geophysics, Mining, Civil, Remote Sensing", "Check official notices; access and eligibility may be restricted.", 26),
        (98, "Survey of India", "Geospatial projects", "Geomatics, Civil, GIS, Remote Sensing, CSE", "Check official notices and project-specific eligibility.", 26),
        (99, "Indian Institute of Remote Sensing (IIRS)", "Training / Projects", "Remote Sensing, GIS, Civil, Geography, CSE, Environmental", "Check current official course and project notices.", 26),
        (100, "National Institute of Ocean Technology (NIOT)", "Project Work", "Ocean Engineering, Mechanical, Electronics, Civil, Marine Sciences", "Check official project opportunities and eligibility.", 26),

        # Page 27: 101
        (101, "National Institute of Hydrology (NIH)", "Research Projects", "Civil, Hydrology, Environmental, Geology, Data Science", "Check current official project/trainee notices.", 27),
    ]

    for num, org, role, branches_str, note, pg in leads_raw:
        branch_list = [b.strip() for b in re.split(r"[,/]", branches_str) if b.strip()]
        chunks.append({
            "id": f"lead_{num:03d}_{re.sub(r'[^a-zA-Z0-9]', '_', org).lower()}",
            "title": f"#{num}. {org} — {role}",
            "category": "additional_lead",
            "page": pg,
            "organization": org,
            "branches": branch_list,
            "eligibility": f"Suitable branches: {branches_str}",
            "stipend": "Varies by project/lab/company",
            "duration": "Summer / semester internship",
            "apply_url": f"Official {org} careers / portal",
            "deadline": "Check official notices / portal",
            "timeline": "Check official announcements",
            "content": (
                f"Internship Lead #{num}: {org} (Page {pg})\n"
                f"Role/Program: {role}\n"
                f"Suitable Branches: {branches_str}\n"
                f"Application Instructions: {note}\n"
                f"Verified Guide Note: Real recurring opportunities and legitimate research paths."
            )
        })

    return chunks
