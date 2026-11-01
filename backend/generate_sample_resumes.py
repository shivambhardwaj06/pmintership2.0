import pymupdf as fitz
from pathlib import Path

RESUMES_DIR = Path(__file__).resolve().parent / "static" / "resumes"
RESUMES_DIR.mkdir(parents=True, exist_ok=True)

CANDIDATES = [
    {
        "filename": "priya_sharma_resume.pdf",
        "name": "PRIYA SHARMA",
        "role": "Aspiring Software Development Engineer / Cloud Specialist",
        "contact": "priya.sharma@candidate.pminternship.gov.in | +91 98765 43210 | Bangalore, Karnataka",
        "links": "github.com/priyasharma-dev | linkedin.com/in/priyasharma-pmis",
        "summary": "Third-year Computer Science Engineering undergraduate with hands-on expertise in Python, FastAPI, and React. Passionate about scalable distributed systems and cloud native backend services.",
        "education": [
            ("B.Tech in Computer Science & Engineering", "State Technological University", "2023 - 2027", "CGPA: 8.4 / 10.0"),
            ("Higher Secondary Certificate (CBSE Class XII - Science)", "Delhi Public School", "2021 - 2023", "Percentage: 94.2%")
        ],
        "skills": [
            ("Programming Languages", "Python, JavaScript, TypeScript, C++, SQL"),
            ("Frameworks & Libraries", "FastAPI, React.js, Node.js, Express, Tailwind CSS"),
            ("Databases & Cloud", "PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2)"),
            ("Developer Tools", "Git, GitHub Actions, Postman, Linux / Bash, Pytest")
        ],
        "projects": [
            ("Real-Time Microservices Task Scheduler (FastAPI, Redis, Docker)", "Engineered an asynchronous task queuing pipeline handling 5,000 req/sec with Celery and Redis.", "Reduced API response latency by 45% using MongoDB compound indexing and cached read operations.", "Configured automated CI/CD unit testing with Pytest achieving 92% code coverage on GitHub Actions."),
            ("Campus Placement & Internship Portal (React, Node.js, PostgreSQL)", "Built responsive candidate dashboard serving 1,200+ students with real-time status tracking.", "Implemented secure JWT authentication with refresh token rotation and role-based access control.", "Integrated PDF resume text extractor providing automated skill tagging for campus recruiters.")
        ],
        "certifications": [
            "AWS Certified Cloud Practitioner (2024)",
            "Python Data Structures & Algorithms - HackerRank Gold Badge (5 Stars)",
            "Smart India Hackathon Finalist - Built automated civic grievance classifier"
        ]
    },
    {
        "filename": "dev_raj_resume.pdf",
        "name": "DEV RAJ SINGH",
        "role": "Full Stack Developer | Cloud & DevOps Specialist",
        "contact": "devraj.singh@candidate.pminternship.gov.in | +91 98765 43222 | Kolkata / Pan-India",
        "links": "github.com/devrajsingh | linkedin.com/in/devraj-singh | devraj-portfolio.vercel.app",
        "summary": "Full Stack Engineer with proven production experience deploying scalable SaaS web applications. 600+ algorithmic problems solved across LeetCode and HackerRank.",
        "education": [
            ("B.Tech in Computer Science and Engineering", "Maulana Abul Kalam Azad University of Technology", "2022 - 2026", "CGPA: 8.6 / 10.0"),
            ("Class XII (ISC Science - Mathematics & Computer Science)", "St. Xavier's Collegiate School", "2020 - 2022", "Percentage: 95.8%")
        ],
        "skills": [
            ("Frontend & Mobile", "React, Next.js 14, TypeScript, Tailwind CSS, Redux Toolkit"),
            ("Backend & Microservices", "Node.js, Express, Python, FastAPI, REST APIs, GraphQL"),
            ("Databases & Cache", "PostgreSQL, MongoDB Atlas, Redis, Prisma ORM"),
            ("DevOps & Cloud", "Docker, Kubernetes, AWS (S3, ECS), CI/CD GitHub Actions, Vercel")
        ],
        "projects": [
            ("Enterprise High-Concurrency SaaS Platform (Next.js, FastAPI, Redis)", "Architected multi-tenant workflow system reducing AWS hosting and database overhead by 40%.", "Engineered Redis pub/sub live notification pipeline processing 10,000 concurrent events.", "Streamlined deployment times by 50% through automated Docker container caching pipelines."),
            ("AI-Powered Semantic Document Search (Python, Vector DB, Qdrant)", "Designed hybrid BM25 and neural vector retrieval system searching 500k+ technical PDFs.", "Achieved sub-100ms search latency using Qdrant vector indexing and INT8 quantization.", "Deployed production demo on Render with 99.9% uptime and zero reported ATS formatting issues.")
        ],
        "certifications": [
            "LeetCode 600+ Problems Solved (Top 5% Global Contest Rating)",
            "Smart India Hackathon (SIH) 1st Runner Up - National Hardware/Software Edition",
            "Docker & Kubernetes Certified Associate - Linux Foundation"
        ]
    },
    {
        "filename": "rohan_deshmukh_resume.pdf",
        "name": "ROHAN DESHMUKH",
        "role": "Automotive & Mechanical Design Engineering Intern",
        "contact": "rohan.deshmukh@candidate.pminternship.gov.in | +91 98765 43233 | Pune, Maharashtra",
        "links": "grabcad.com/rohan.deshmukh | linkedin.com/in/rohan-deshmukh-auto",
        "summary": "Pre-final year Mechanical Engineering student with hands-on CAD modelling, FEA simulation, and vehicle fabrication experience. Active suspension lead for SAE BAJA all-terrain vehicle.",
        "education": [
            ("B.E. in Mechanical Engineering", "Government College of Engineering", "2023 - 2027", "CGPA: 7.9 / 10.0"),
            ("HSC Science (Maharashtra State Board)", "Fergusson College Pune", "2021 - 2023", "Percentage: 88.5%")
        ],
        "skills": [
            ("CAD & Simulation", "SolidWorks 2024, AutoCAD, ANSYS Mechanical, MATLAB & Simulink"),
            ("Manufacturing & Testing", "CNC Machining Basics, Lathe, TIG/MIG Welding, Shop-Floor Safety"),
            ("Domain Knowledge", "Thermodynamics, Finite Element Analysis (FEA), EV Battery Thermal Management"),
            ("Quality & Standards", "GD&T (ASME Y14.5), Lean Six Sigma Basics, ISO 9001 Awareness")
        ],
        "projects": [
            ("SAE BAJA All-Terrain Vehicle - Suspension Subsystem (SolidWorks & ANSYS)", "Designed custom double-wishbone front suspension handling 3.5G dynamic impact loads.", "Conducted static and modal FEA simulations reducing unsprung chassis mass by 14%.", "Fabricated chromoly steel A-arms with precise jig alignments adhering to strict safety norms."),
            ("EV Battery Pack Air Cooling Channel Optimization (Simulink & CFD)", "Modeled transient heat dissipation across 48V lithium-ion battery modules under heavy discharge.", "Decreased peak cell operating temperatures by 6.2°C through aerodynamic duct redesign.")
        ],
        "certifications": [
            "Certified SOLIDWORKS Associate in Mechanical Design (CSWA)",
            "Automotive Engineering Fundamentals - SAE India Student Member",
            "Industrial Shop-Floor Safety Certification (OSHA Standard Compliant)"
        ]
    },
    {
        "filename": "ananya_patel_resume.pdf",
        "name": "ANANYA PATEL",
        "role": "Civil & Infrastructure Project Planning Engineer",
        "contact": "ananya.patel@candidate.pminternship.gov.in | +91 98765 43244 | Ahmedabad, Gujarat",
        "links": "linkedin.com/in/ananya-patel-civil | portfolio.civil-ananya.in",
        "summary": "Final year Civil Engineering student specialized in construction milestone scheduling, Bar Bending Schedules (BBS), and concrete quality audits. Certified in Primavera P6 and MS Project.",
        "education": [
            ("B.Tech in Civil Engineering", "State Engineering Institute", "2022 - 2026", "CGPA: 8.6 / 10.0"),
            ("Class XII Science (GSEB)", "St. Ann's High School", "2020 - 2022", "Percentage: 92.0%")
        ],
        "skills": [
            ("Project Scheduling", "Primavera P6, MS Project, Microsoft Excel (Advanced Modeling)"),
            ("CAD & Structural Design", "AutoCAD Civil 3D, STAAD.Pro, Revit Architecture Basics"),
            ("Site Operations", "Bar Bending Schedules (BBS), Quantity Surveying, Concrete Slump & Cube Tests"),
            ("Safety & Compliance", "EHS Guidelines, Green Building Rating (IGBC), Quality Inspection Protocols")
        ],
        "projects": [
            ("Commercial High-Rise Infrastructure Scheduling (Primavera P6)", "Drafted baseline WBS and critical path schedule for a G+14 residential project across 18 months.", "Simulated resource allocation curves mitigating labor bottlenecks and reducing planned downtime by 12%.", "Created detailed material requirement schedules saving estimated ₹4.5 Lakhs in staging waste."),
            ("Concrete Strength Optimization with Recycled Aggregates", "Tested M25/M30 grade concrete mixes replacing 20% natural gravel with recycled aggregate.", "Achieved 28-day compressive strengths of 27.8 MPa conforming strictly to IS 456:2000.")
        ],
        "certifications": [
            "Primavera P6 Professional Project Management Certified",
            "IGBC Green Building Student Associate",
            "AutoCAD Civil 3D Certified Professional"
        ]
    },
    {
        "filename": "sneha_kulkarni_resume.pdf",
        "name": "SNEHA KULKARNI",
        "role": "Corporate Finance & Banking Operations Specialist",
        "contact": "sneha.kulkarni@candidate.pminternship.gov.in | +91 98765 43255 | Mumbai, Maharashtra",
        "links": "linkedin.com/in/sneha-kulkarni-finance",
        "summary": "B.Com Honours student with advanced financial modeling, Power BI dashboarding, and banking KYC/AML compliance proficiency. Experienced in data validation and commercial bank balance sheet analysis.",
        "education": [
            ("B.Com (Honours in Finance & Banking)", "Premier Commerce College (University of Mumbai)", "2024 - 2027", "CGPA: 8.5 / 10.0"),
            ("HSC Commerce (Maharashtra Board)", "Narsee Monjee College of Commerce", "2022 - 2024", "Percentage: 93.4%")
        ],
        "skills": [
            ("Financial Modeling", "Advanced Excel (Dynamic XLOOKUP, Nested IFs, Pivot Charts, DCF Models)"),
            ("Business Intelligence", "Power BI, Tableau Basics, SQL Queries, Data Cleansing"),
            ("Banking Operations", "KYC Norms, Anti-Money Laundering (AML) Compliance, Credit Risk Basics"),
            ("Corporate Soft Skills", "Executive Reporting, Client Communications, Cross-Department Auditing")
        ],
        "projects": [
            ("Empirical Analysis of Non-Performing Assets (NPAs) in Indian Commercial Banks", "Analyzed 5-year balance sheets of top 10 scheduled commercial banks using multi-variable regression.", "Visualized gross NPA trajectories and recovery ratios using interactive Power BI dashboards.", "Authored college research paper cited in department economic symposium."),
            ("Corporate Financial Health & Working Capital Modeling (Excel)", "Constructed 3-statement financial forecasting model for an FMCG enterprise.", "Automated inventory turnover and cash conversion cycle trackers with dynamic sensitivity tables.")
        ],
        "certifications": [
            "Advanced Financial Modeling & Valuation - Corporate Finance Institute (CFI)",
            "Microsoft Office Specialist: Excel Associate Certification",
            "SEBI Investor Awareness & NISM Mutual Funds Foundation"
        ]
    },
    {
        "filename": "drithi_nair_resume.pdf",
        "name": "DRITHI NAIR",
        "role": "Pharmaceutical Quality Control & Formulation Research Intern",
        "contact": "drithi.nair@candidate.pminternship.gov.in | +91 98765 43266 | Ahmedabad / Mumbai",
        "links": "linkedin.com/in/drithi-nair-pharma",
        "summary": "Third-year B.Pharm student trained in HPLC instrumentation, UV-Vis Spectrophotometry, and Good Laboratory Practices (GLP). Dedicated to stringent pharmaceutical quality compliance and SOP execution.",
        "education": [
            ("Bachelor of Pharmacy (B.Pharm)", "College of Pharmaceutical Sciences", "2023 - 2027", "CGPA: 8.7 / 10.0"),
            ("Class XII Science (Biology & Chemistry)", "Kendriya Vidyalaya", "2021 - 2023", "Percentage: 91.5%")
        ],
        "skills": [
            ("Analytical Instruments", "High-Performance Liquid Chromatography (HPLC), UV-Vis Spectrophotometer"),
            ("Quality Assurance", "GMP & GLP Regulations, Dissolution Apparatus, Assay Validation"),
            ("Documentation", "Standard Operating Procedures (SOPs), Lab Batch Records, Deviation Logs"),
            ("Core Sciences", "Pharmacology, Medicinal Chemistry, Biopharmaceutics, Dosage Formulations")
        ],
        "projects": [
            ("Dissolution Profile & Assay Validation of Paracetamol Tablets", "Conducted comparative in-vitro dissolution tests across 3 commercial brands using USP Apparatus II.", "Calculated f1 (difference) and f2 (similarity) factors conforming strictly to Indian Pharmacopoeia norms.", "Recorded comprehensive analytical reports with zero audit trail anomalies."),
            ("Spectrophotometric Estimation of Active Pharmaceutical Ingredients (APIs)", "Developed standard calibration curves for active compounds with linear correlation R² > 0.999.", "Documented laboratory risk assessment protocols and safe chemical waste disposal workflows.")
        ],
        "certifications": [
            "Good Manufacturing Practice (GMP) for Pharma Technicians",
            "HPLC Troubleshooting & Column Maintenance Certification",
            "Indian Pharmaceutical Association (IPA) Student Member"
        ]
    }
]

def generate_pdf_resume(c: dict):
    doc = fitz.open()
    # Standard A4: 595 x 842 points
    page = doc.new_page(width=595, height=842)
    
    # Margins and layout
    margin_x = 42
    curr_y = 40
    line_w = 595 - (2 * margin_x)
    
    # 1. Header Name
    page.insert_text((margin_x, curr_y), c["name"], fontsize=18, fontname="helv", color=(0.08, 0.18, 0.36))
    curr_y += 18
    
    # Role subtitle
    page.insert_text((margin_x, curr_y), c["role"], fontsize=10.5, fontname="helv", color=(0.85, 0.40, 0.05))
    curr_y += 14
    
    # Contact info & links
    page.insert_text((margin_x, curr_y), c["contact"], fontsize=8.5, fontname="helv", color=(0.25, 0.25, 0.25))
    curr_y += 12
    page.insert_text((margin_x, curr_y), c["links"], fontsize=8.5, fontname="helv", color=(0.15, 0.35, 0.65))
    curr_y += 14
    
    # Divider line
    page.draw_line((margin_x, curr_y), (margin_x + line_w, curr_y), color=(0.75, 0.8, 0.88), width=1)
    curr_y += 14
    
    # Section: Professional Summary
    page.insert_text((margin_x, curr_y), "PROFESSIONAL SUMMARY", fontsize=10, fontname="helv", color=(0.08, 0.18, 0.36))
    curr_y += 13
    # Word wrap summary
    rect = fitz.Rect(margin_x, curr_y, margin_x + line_w, curr_y + 35)
    page.insert_textbox(rect, c["summary"], fontsize=8.5, fontname="helv", color=(0.2, 0.2, 0.2))
    curr_y += 32
    
    # Section: Education
    page.insert_text((margin_x, curr_y), "ACADEMIC EDUCATION", fontsize=10, fontname="helv", color=(0.08, 0.18, 0.36))
    curr_y += 13
    for degree, institution, period, grade in c["education"]:
        page.insert_text((margin_x, curr_y), f"• {degree} — {institution}", fontsize=8.5, fontname="helv", color=(0.1, 0.1, 0.1))
        page.insert_text((margin_x + line_w - 140, curr_y), f"{period} | {grade}", fontsize=8, fontname="helv", color=(0.4, 0.4, 0.4))
        curr_y += 13
    curr_y += 4
    
    # Section: Technical Skills
    page.insert_text((margin_x, curr_y), "CORE TECHNICAL COMPETENCIES", fontsize=10, fontname="helv", color=(0.08, 0.18, 0.36))
    curr_y += 13
    for category, skill_list in c["skills"]:
        page.insert_text((margin_x, curr_y), f"• {category}: ", fontsize=8.5, fontname="helv", color=(0.1, 0.1, 0.1))
        offset = len(category) * 5.2 + 25
        page.insert_text((margin_x + offset, curr_y), skill_list, fontsize=8.5, fontname="helv", color=(0.3, 0.3, 0.3))
        curr_y += 13
    curr_y += 4
    
    # Section: Key Projects
    page.insert_text((margin_x, curr_y), "KEY PROJECTS & DELIVERABLES", fontsize=10, fontname="helv", color=(0.08, 0.18, 0.36))
    curr_y += 13
    for proj_title, *bullets in c["projects"]:
        page.insert_text((margin_x, curr_y), f"► {proj_title}", fontsize=9, fontname="helv", color=(0.15, 0.35, 0.65))
        curr_y += 12
        for b in bullets:
            page.insert_text((margin_x + 12, curr_y), f"– {b}", fontsize=8, fontname="helv", color=(0.25, 0.25, 0.25))
            curr_y += 12
        curr_y += 3
    
    # Section: Certifications & Honours
    page.insert_text((margin_x, curr_y), "HONOURS & CERTIFICATIONS", fontsize=10, fontname="helv", color=(0.08, 0.18, 0.36))
    curr_y += 13
    for cert in c["certifications"]:
        page.insert_text((margin_x + 8, curr_y), f"✔ {cert}", fontsize=8.2, fontname="helv", color=(0.15, 0.5, 0.25))
        curr_y += 12

    dest = RESUMES_DIR / c["filename"]
    doc.save(str(dest))
    print(f"Generated PDF: {dest} (Size: {dest.stat().st_size} bytes)")

def main():
    for c in CANDIDATES:
        generate_pdf_resume(c)
    print("All 6 candidate sample resumes generated successfully!")

if __name__ == "__main__":
    main()
