"""
Generates the official 120 PM Internship Scheme records parsed directly from the prototype dataset PDF.
"""
import json
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
BACKEND_DATA = BASE_DIR / "backend" / "data" / "pm_internships_120.json"
FRONTEND_DATA = BASE_DIR / "src" / "data" / "internships.json"

SECTORS_DATA = [
    {
        "sector_id": 1,
        "sector": "IT & Software Development",
        "companies": [
            ("Tata Consultancy Services", "Software Development Intern", "Assist with feature development, unit testing, bug fixes, documentation and code reviews.", "B.Tech/B.E. in CSE/IT or MCA/BCA; 2nd year onward preferred.", "Python or Java, data structures, Git, debugging; basic SQL preferred.", "Bengaluru", "Karnataka", "Hybrid", "3 months", "₹8,000–₹12,000/month", "26 October 2026"),
            ("Infosys", "Software Development Intern – Research & Reporting", "Assist with feature development, unit testing, bug fixes, documentation and code reviews.", "B.Tech/B.E. in CSE/IT or MCA/BCA; 2nd year onward preferred.", "Python or Java, data structures, Git, debugging; basic SQL preferred.", "Chennai", "Tamil Nadu", "Hybrid", "12 weeks", "₹8,000–₹12,000/month", "28 October 2026"),
            ("Wipro", "Software Development Intern – Data & Operations", "Assist with feature development, unit testing, bug fixes, documentation and code reviews.", "B.Tech/B.E. in CSE/IT or MCA/BCA; 2nd year onward preferred.", "Python or Java, data structures, Git, debugging; basic SQL preferred.", "Mumbai", "Maharashtra", "On-site", "6 months", "₹10,000/month", "30 October 2026"),
            ("HCLTech", "Software Development Intern – Project Support", "Assist with feature development, unit testing, bug fixes, documentation and code reviews.", "B.Tech/B.E. in CSE/IT or MCA/BCA; 2nd year onward preferred.", "Python or Java, data structures, Git, debugging; basic SQL preferred.", "New Delhi", "Delhi / NCR", "On-site", "8 weeks", "₹10,000–₹15,000/month", "25 October 2026"),
            ("Persistent Systems", "Software Development Intern – Business/Technical Analysis", "Assist with feature development, unit testing, bug fixes, documentation and code reviews.", "B.Tech/B.E. in CSE/IT or MCA/BCA; 2nd year onward preferred.", "Python or Java, data structures, Git, debugging; basic SQL preferred.", "Pan-India", "Pan-India", "Remote/Hybrid", "10 weeks", "₹9,000–₹12,000/month", "27 October 2026"),
        ]
    },
    {
        "sector_id": 2,
        "sector": "Banking & Financial Services",
        "companies": [
            ("HDFC Bank", "Finance & Banking Operations Intern", "Support data validation, customer-process documentation, market research and operational reporting.", "B.Com, BBA, B.A. Economics, MBA or related degree; undergraduate eligible.", "Excel, attention to detail, communication; finance/accounting basics.", "Bengaluru", "Karnataka", "Hybrid", "12 weeks", "₹8,000–₹12,000/month", "25 October 2026"),
            ("ICICI Bank", "Finance & Banking Operations Intern – Research & Reporting", "Support data validation, customer-process documentation, market research and operational reporting.", "B.Com, BBA, B.A. Economics, MBA or related degree; undergraduate eligible.", "Excel, attention to detail, communication; finance/accounting basics.", "Chennai", "Tamil Nadu", "Hybrid", "6 months", "₹9,000–₹12,000/month", "27 October 2026"),
            ("State Bank of India", "Finance & Banking Operations Intern – Data & Operations", "Support data validation, customer-process documentation, market research and operational reporting.", "B.Com, BBA, B.A. Economics, MBA or related degree; undergraduate eligible.", "Excel, attention to detail, communication; finance/accounting basics.", "Mumbai", "Maharashtra", "On-site", "8 weeks", "₹8,000–₹10,000/month", "29 October 2026"),
            ("Axis Bank", "Finance & Banking Operations Intern – Project Support", "Support data validation, customer-process documentation, market research and operational reporting.", "B.Com, BBA, B.A. Economics, MBA or related degree; undergraduate eligible.", "Excel, attention to detail, communication; finance/accounting basics.", "New Delhi", "Delhi / NCR", "On-site", "10 weeks", "₹10,000–₹15,000/month", "24 October 2026"),
            ("Bajaj Finance", "Finance & Banking Operations Intern – Business/Technical Analysis", "Support data validation, customer-process documentation, market research and operational reporting.", "B.Com, BBA, B.A. Economics, MBA or related degree; undergraduate eligible.", "Excel, attention to detail, communication; finance/accounting basics.", "Pan-India", "Pan-India", "Remote/Hybrid", "3 months", "₹9,000–₹12,000/month", "26 October 2026"),
        ]
    },
    {
        "sector_id": 3,
        "sector": "Oil, Gas & Energy",
        "companies": [
            ("Indian Oil Corporation", "Energy Operations & Sustainability Intern", "Help organise operational data, review safety and sustainability documentation, and prepare project summaries.", "B.Tech/B.E. in Chemical, Mechanical, Electrical, Energy or Environmental Engineering.", "Excel, safety awareness, analytical thinking; CAD/data analysis helpful.", "Bengaluru", "Karnataka", "Hybrid", "6 months", "₹8,000–₹12,000/month", "24 October 2026"),
            ("ONGC", "Energy Operations & Sustainability Intern – Research & Reporting", "Help organise operational data, review safety and sustainability documentation, and prepare project summaries.", "B.Tech/B.E. in Chemical, Mechanical, Electrical, Energy or Environmental Engineering.", "Excel, safety awareness, analytical thinking; CAD/data analysis helpful.", "Chennai", "Tamil Nadu", "Hybrid", "8 weeks", "₹8,000–₹11,000/month", "26 October 2026"),
            ("GAIL", "Energy Operations & Sustainability Intern – Data & Operations", "Help organise operational data, review safety and sustainability documentation, and prepare project summaries.", "B.Tech/B.E. in Chemical, Mechanical, Electrical, Energy or Environmental Engineering.", "Excel, safety awareness, analytical thinking; CAD/data analysis helpful.", "Mumbai", "Maharashtra", "On-site", "10 weeks", "₹10,000/month", "28 October 2026"),
            ("BPCL", "Energy Operations & Sustainability Intern – Project Support", "Help organise operational data, review safety and sustainability documentation, and prepare project summaries.", "B.Tech/B.E. in Chemical, Mechanical, Electrical, Energy or Environmental Engineering.", "Excel, safety awareness, analytical thinking; CAD/data analysis helpful.", "New Delhi", "Delhi / NCR", "On-site", "3 months", "₹10,000–₹15,000/month", "30 October 2026"),
            ("HPCL", "Energy Operations & Sustainability Intern – Business/Technical Analysis", "Help organise operational data, review safety and sustainability documentation, and prepare project summaries.", "B.Tech/B.E. in Chemical, Mechanical, Electrical, Energy or Environmental Engineering.", "Excel, safety awareness, analytical thinking; CAD/data analysis helpful.", "Pan-India", "Pan-India", "Remote/Hybrid", "12 weeks", "₹9,000–₹12,000/month", "25 October 2026"),
        ]
    },
    {
        "sector_id": 4,
        "sector": "Metals & Mining",
        "companies": [
            ("Coal India", "Industrial Operations Intern", "Assist with production data, quality documentation, process observations and safety or efficiency reports.", "B.Tech/B.E. in Mining, Metallurgy, Mechanical, Chemical or Environmental Engineering.", "Data recording, spreadsheet skills, safety-first mindset; basic process knowledge.", "Bengaluru", "Karnataka", "Hybrid", "8 weeks", "₹8,000–₹12,000/month", "30 October 2026"),
            ("NMDC", "Industrial Operations Intern – Research & Reporting", "Assist with production data, quality documentation, process observations and safety or efficiency reports.", "B.Tech/B.E. in Mining, Metallurgy, Mechanical, Chemical or Environmental Engineering.", "Data recording, spreadsheet skills, safety-first mindset; basic process knowledge.", "Chennai", "Tamil Nadu", "Hybrid", "10 weeks", "₹8,000–₹11,000/month", "25 October 2026"),
            ("Hindustan Zinc", "Industrial Operations Intern – Data & Operations", "Assist with production data, quality documentation, process observations and safety or efficiency reports.", "B.Tech/B.E. in Mining, Metallurgy, Mechanical, Chemical or Environmental Engineering.", "Data recording, spreadsheet skills, safety-first mindset; basic process knowledge.", "Mumbai", "Maharashtra", "On-site", "3 months", "₹9,000–₹12,000/month", "27 October 2026"),
            ("Vedanta", "Industrial Operations Intern – Project Support", "Assist with production data, quality documentation, process observations and safety or efficiency reports.", "B.Tech/B.E. in Mining, Metallurgy, Mechanical, Chemical or Environmental Engineering.", "Data recording, spreadsheet skills, safety-first mindset; basic process knowledge.", "New Delhi", "Delhi / NCR", "On-site", "12 weeks", "₹10,000–₹15,000/month", "29 October 2026"),
            ("Tata Steel", "Industrial Operations Intern – Business/Technical Analysis", "Assist with production data, quality documentation, process observations and safety or efficiency reports.", "B.Tech/B.E. in Mining, Metallurgy, Mechanical, Chemical or Environmental Engineering.", "Data recording, spreadsheet skills, safety-first mindset; basic process knowledge.", "Pan-India", "Pan-India", "Remote/Hybrid", "6 months", "₹10,000–₹14,000/month", "24 October 2026"),
        ]
    },
    {
        "sector_id": 5,
        "sector": "FMCG",
        "companies": [
            ("Hindustan Unilever", "Brand & Consumer Insights Intern", "Conduct competitor research, summarise consumer feedback, support campaign tracking and prepare presentations.", "BBA, B.Com, BA/BSc, Marketing, Statistics or related undergraduate programme.", "Research, Excel/Sheets, presentation skills, clear writing; social media familiarity useful.", "Bengaluru", "Karnataka", "Hybrid", "10 weeks", "₹8,000–₹12,000/month", "29 October 2026"),
            ("ITC", "Brand & Consumer Insights Intern – Research & Reporting", "Conduct competitor research, summarise consumer feedback, support campaign tracking and prepare presentations.", "BBA, B.Com, BA/BSc, Marketing, Statistics or related undergraduate programme.", "Research, Excel/Sheets, presentation skills, clear writing; social media familiarity useful.", "Chennai", "Tamil Nadu", "Hybrid", "3 months", "₹9,000–₹12,000/month", "24 October 2026"),
            ("Nestlé India", "Brand & Consumer Insights Intern – Data & Operations", "Conduct competitor research, summarise consumer feedback, support campaign tracking and prepare presentations.", "BBA, B.Com, BA/BSc, Marketing, Statistics or related undergraduate programme.", "Research, Excel/Sheets, presentation skills, clear writing; social media familiarity useful.", "Mumbai", "Maharashtra", "On-site", "12 weeks", "₹10,000/month", "26 October 2026"),
            ("Dabur", "Brand & Consumer Insights Intern – Project Support", "Conduct competitor research, summarise consumer feedback, support campaign tracking and prepare presentations.", "BBA, B.Com, BA/BSc, Marketing, Statistics or related undergraduate programme.", "Research, Excel/Sheets, presentation skills, clear writing; social media familiarity useful.", "New Delhi", "Delhi / NCR", "On-site", "6 months", "₹10,000–₹15,000/month", "28 October 2026"),
            ("Britannia Industries", "Brand & Consumer Insights Intern – Business/Technical Analysis", "Conduct competitor research, summarise consumer feedback, support campaign tracking and prepare presentations.", "BBA, B.Com, BA/BSc, Marketing, Statistics or related undergraduate programme.", "Research, Excel/Sheets, presentation skills, clear writing; social media familiarity useful.", "Pan-India", "Pan-India", "Remote/Hybrid", "8 weeks", "₹9,000–₹12,000/month", "30 October 2026"),
        ]
    },
    {
        "sector_id": 6,
        "sector": "Telecommunications",
        "companies": [
            ("Bharti Airtel", "Network & Telecom Intern", "Document network performance, support basic testing, organise issue logs and prepare technical reports.", "B.Tech/B.E. in ECE, Electrical, IT or CSE; diploma candidates for technical support projects.", "Networking fundamentals, troubleshooting, Excel; Python/Linux helpful.", "Bengaluru", "Karnataka", "Hybrid", "3 months", "₹8,000–₹12,000/month", "28 October 2026"),
            ("Vodafone Idea", "Network & Telecom Intern – Research & Reporting", "Document network performance, support basic testing, organise issue logs and prepare technical reports.", "B.Tech/B.E. in ECE, Electrical, IT or CSE; diploma candidates for technical support projects.", "Networking fundamentals, troubleshooting, Excel; Python/Linux helpful.", "Chennai", "Tamil Nadu", "Hybrid", "12 weeks", "₹8,000–₹11,000/month", "30 October 2026"),
            ("Reliance Jio", "Network & Telecom Intern – Data & Operations", "Document network performance, support basic testing, organise issue logs and prepare technical reports.", "B.Tech/B.E. in ECE, Electrical, IT or CSE; diploma candidates for technical support projects.", "Networking fundamentals, troubleshooting, Excel; Python/Linux helpful.", "Mumbai", "Maharashtra", "On-site", "6 months", "₹10,000/month", "25 October 2026"),
            ("Tata Communications", "Network & Telecom Intern – Project Support", "Document network performance, support basic testing, organise issue logs and prepare technical reports.", "B.Tech/B.E. in ECE, Electrical, IT or CSE; diploma candidates for technical support projects.", "Networking fundamentals, troubleshooting, Excel; Python/Linux helpful.", "New Delhi", "Delhi / NCR", "On-site", "8 weeks", "₹10,000–₹15,000/month", "27 October 2026"),
            ("Tejas Networks", "Network & Telecom Intern – Business/Technical Analysis", "Document network performance, support basic testing, organise issue logs and prepare technical reports.", "B.Tech/B.E. in ECE, Electrical, IT or CSE; diploma candidates for technical support projects.", "Networking fundamentals, troubleshooting, Excel; Python/Linux helpful.", "Pan-India", "Pan-India", "Remote/Hybrid", "10 weeks", "₹9,000–₹12,000/month", "29 October 2026"),
        ]
    },
    {
        "sector_id": 7,
        "sector": "Infrastructure & Construction",
        "companies": [
            ("Larsen & Toubro", "Project Planning Intern", "Track project milestones, update site documentation, assist with quantity/data sheets and progress reports.", "Civil/Mechanical/Electrical Engineering or Construction Management student.", "Excel, documentation, drawing interpretation; MS Project/AutoCAD helpful.", "Bengaluru", "Karnataka", "Hybrid", "12 weeks", "₹8,000–₹12,000/month", "27 October 2026"),
            ("Engineers India Limited", "Project Planning Intern – Research & Reporting", "Track project milestones, update site documentation, assist with quantity/data sheets and progress reports.", "Civil/Mechanical/Electrical Engineering or Construction Management student.", "Excel, documentation, drawing interpretation; MS Project/AutoCAD helpful.", "Chennai", "Tamil Nadu", "Hybrid", "6 months", "₹8,000–₹12,000/month", "29 October 2026"),
            ("IRCON International", "Project Planning Intern – Data & Operations", "Track project milestones, update site documentation, assist with quantity/data sheets and progress reports.", "Civil/Mechanical/Electrical Engineering or Construction Management student.", "Excel, documentation, drawing interpretation; MS Project/AutoCAD helpful.", "Mumbai", "Maharashtra", "On-site", "8 weeks", "₹9,000/month", "24 October 2026"),
            ("NBCC (India)", "Project Planning Intern – Project Support", "Track project milestones, update site documentation, assist with quantity/data sheets and progress reports.", "Civil/Mechanical/Electrical Engineering or Construction Management student.", "Excel, documentation, drawing interpretation; MS Project/AutoCAD helpful.", "New Delhi", "Delhi / NCR", "On-site", "10 weeks", "₹10,000–₹15,000/month", "26 October 2026"),
            ("Tata Projects", "Project Planning Intern – Business/Technical Analysis", "Track project milestones, update site documentation, assist with quantity/data sheets and progress reports.", "Civil/Mechanical/Electrical Engineering or Construction Management student.", "Excel, documentation, drawing interpretation; MS Project/AutoCAD helpful.", "Pan-India", "Pan-India", "Remote/Hybrid", "3 months", "₹10,000–₹14,000/month", "28 October 2026"),
        ]
    },
    {
        "sector_id": 8,
        "sector": "Retail & Consumer Durables",
        "companies": [
            ("Reliance Retail", "Retail Operations Intern", "Review store/consumer data, support inventory tracking, map customer journeys and summarise operational insights.", "BBA, B.Com, Economics, Statistics or related degree; undergraduate students.", "Excel, communication, customer empathy, basic data interpretation.", "Bengaluru", "Karnataka", "Hybrid", "6 months", "₹8,000–₹12,000/month", "26 October 2026"),
            ("Titan Company", "Retail Operations Intern – Research & Reporting", "Review store/consumer data, support inventory tracking, map customer journeys and summarise operational insights.", "BBA, B.Com, Economics, Statistics or related degree; undergraduate students.", "Excel, communication, customer empathy, basic data interpretation.", "Chennai", "Tamil Nadu", "Hybrid", "8 weeks", "₹8,000–₹11,000/month", "28 October 2026"),
            ("Croma", "Retail Operations Intern – Data & Operations", "Review store/consumer data, support inventory tracking, map customer journeys and summarise operational insights.", "BBA, B.Com, Economics, Statistics or related degree; undergraduate students.", "Excel, communication, customer empathy, basic data interpretation.", "Mumbai", "Maharashtra", "On-site", "10 weeks", "₹8,000–₹10,000/month", "30 October 2026"),
            ("Asian Paints", "Retail Operations Intern – Project Support", "Review store/consumer data, support inventory tracking, map customer journeys and summarise operational insights.", "BBA, B.Com, Economics, Statistics or related degree; undergraduate students.", "Excel, communication, customer empathy, basic data interpretation.", "New Delhi", "Delhi / NCR", "On-site", "3 months", "₹10,000–₹15,000/month", "25 October 2026"),
            ("Whirlpool India", "Retail Operations Intern – Business/Technical Analysis", "Review store/consumer data, support inventory tracking, map customer journeys and summarise operational insights.", "BBA, B.Com, Economics, Statistics or related degree; undergraduate students.", "Excel, communication, customer empathy, basic data interpretation.", "Pan-India", "Pan-India", "Remote/Hybrid", "12 weeks", "₹9,000–₹12,000/month", "27 October 2026"),
        ]
    },
    {
        "sector_id": 9,
        "sector": "Cement & Building Materials",
        "companies": [
            ("UltraTech Cement", "Quality & Supply Chain Intern", "Help compile quality-control records, inventory data, dispatch metrics and process-improvement observations.", "B.Tech/B.E. in Civil, Chemical, Mechanical or Industrial Engineering; BSc Chemistry.", "Excel, process documentation, quality basics, analytical skills.", "Bengaluru", "Karnataka", "Hybrid", "8 weeks", "₹8,000–₹12,000/month", "25 October 2026"),
            ("Shree Cement", "Quality & Supply Chain Intern – Research & Reporting", "Help compile quality-control records, inventory data, dispatch metrics and process-improvement observations.", "B.Tech/B.E. in Civil, Chemical, Mechanical or Industrial Engineering; BSc Chemistry.", "Excel, process documentation, quality basics, analytical skills.", "Chennai", "Tamil Nadu", "Hybrid", "10 weeks", "₹8,000–₹11,000/month", "27 October 2026"),
            ("Wonder Cement", "Quality & Supply Chain Intern – Data & Operations", "Help compile quality-control records, inventory data, dispatch metrics and process-improvement observations.", "B.Tech/B.E. in Civil, Chemical, Mechanical or Industrial Engineering; BSc Chemistry.", "Excel, process documentation, quality basics, analytical skills.", "Mumbai", "Maharashtra", "On-site", "3 months", "₹8,000–₹11,000/month", "29 October 2026"),
            ("ACC", "Quality & Supply Chain Intern – Project Support", "Help compile quality-control records, inventory data, dispatch metrics and process-improvement observations.", "B.Tech/B.E. in Civil, Chemical, Mechanical or Industrial Engineering; BSc Chemistry.", "Excel, process documentation, quality basics, analytical skills.", "New Delhi", "Delhi / NCR", "On-site", "12 weeks", "₹10,000–₹15,000/month", "24 October 2026"),
            ("Ambuja Cements", "Quality & Supply Chain Intern – Business/Technical Analysis", "Help compile quality-control records, inventory data, dispatch metrics and process-improvement observations.", "B.Tech/B.E. in Civil, Chemical, Mechanical or Industrial Engineering; BSc Chemistry.", "Excel, process documentation, quality basics, analytical skills.", "Pan-India", "Pan-India", "Remote/Hybrid", "6 months", "₹9,000–₹13,000/month", "26 October 2026"),
        ]
    },
    {
        "sector_id": 10,
        "sector": "Automotive",
        "companies": [
            ("Maruti Suzuki", "Automotive Engineering Intern", "Support component documentation, test-data analysis, quality checks and engineering project reports.", "B.Tech/B.E. in Mechanical, Automobile, Electrical, ECE or Mechatronics.", "CAD or simulation basics, Excel, problem-solving; EV knowledge helpful.", "Bengaluru", "Karnataka", "Hybrid", "10 weeks", "₹8,000–₹12,000/month", "24 October 2026"),
            ("Mahindra & Mahindra", "Automotive Engineering Intern – Research & Reporting", "Support component documentation, test-data analysis, quality checks and engineering project reports.", "B.Tech/B.E. in Mechanical, Automobile, Electrical, ECE or Mechatronics.", "CAD or simulation basics, Excel, problem-solving; EV knowledge helpful.", "Chennai", "Tamil Nadu", "Hybrid", "3 months", "₹9,000–₹12,000/month", "26 October 2026"),
            ("Tata Motors", "Automotive Engineering Intern – Data & Operations", "Support component documentation, test-data analysis, quality checks and engineering project reports.", "B.Tech/B.E. in Mechanical, Automobile, Electrical, ECE or Mechatronics.", "CAD or simulation basics, Excel, problem-solving; EV knowledge helpful.", "Mumbai", "Maharashtra", "On-site", "12 weeks", "₹10,000–₹14,000/month", "28 October 2026"),
            ("Hero MotoCorp", "Automotive Engineering Intern – Project Support", "Support component documentation, test-data analysis, quality checks and engineering project reports.", "B.Tech/B.E. in Mechanical, Automobile, Electrical, ECE or Mechatronics.", "CAD or simulation basics, Excel, problem-solving; EV knowledge helpful.", "New Delhi", "Delhi / NCR", "On-site", "6 months", "₹10,000–₹15,000/month", "30 October 2026"),
            ("TVS Motor", "Automotive Engineering Intern – Business/Technical Analysis", "Support component documentation, test-data analysis, quality checks and engineering project reports.", "B.Tech/B.E. in Mechanical, Automobile, Electrical, ECE or Mechatronics.", "CAD or simulation basics, Excel, problem-solving; EV knowledge helpful.", "Pan-India", "Pan-India", "Remote/Hybrid", "8 weeks", "₹9,000–₹12,000/month", "25 October 2026"),
        ]
    },
    {
        "sector_id": 11,
        "sector": "Pharmaceuticals",
        "companies": [
            ("Sun Pharmaceutical Industries", "Pharma Quality & Research Intern", "Assist with literature review, quality documentation, sample/data tracking and research summaries under supervision.", "B.Pharm, M.Pharm, BSc/MSc Chemistry, Microbiology or Biotechnology.", "Lab safety, accurate recordkeeping, Excel; GMP/GLP familiarity useful.", "Bengaluru", "Karnataka", "Hybrid", "3 months", "₹8,000–₹12,000/month", "30 October 2026"),
            ("Cipla", "Pharma Quality & Research Intern – Research & Reporting", "Assist with literature review, quality documentation, sample/data tracking and research summaries under supervision.", "B.Pharm, M.Pharm, BSc/MSc Chemistry, Microbiology or Biotechnology.", "Lab safety, accurate recordkeeping, Excel; GMP/GLP familiarity useful.", "Chennai", "Tamil Nadu", "Hybrid", "12 weeks", "₹9,000–₹12,000/month", "25 October 2026"),
            ("Dr. Reddy's Laboratories", "Pharma Quality & Research Intern – Data & Operations", "Assist with literature review, quality documentation, sample/data tracking and research summaries under supervision.", "B.Pharm, M.Pharm, BSc/MSc Chemistry, Microbiology or Biotechnology.", "Lab safety, accurate recordkeeping, Excel; GMP/GLP familiarity useful.", "Mumbai", "Maharashtra", "On-site", "6 months", "₹10,000–₹13,000/month", "27 October 2026"),
            ("Lupin", "Pharma Quality & Research Intern – Project Support", "Assist with literature review, quality documentation, sample/data tracking and research summaries under supervision.", "B.Pharm, M.Pharm, BSc/MSc Chemistry, Microbiology or Biotechnology.", "Lab safety, accurate recordkeeping, Excel; GMP/GLP familiarity useful.", "New Delhi", "Delhi / NCR", "On-site", "8 weeks", "₹10,000–₹15,000/month", "29 October 2026"),
            ("Zydus Lifesciences", "Pharma Quality & Research Intern – Business/Technical Analysis", "Assist with literature review, quality documentation, sample/data tracking and research summaries under supervision.", "B.Pharm, M.Pharm, BSc/MSc Chemistry, Microbiology or Biotechnology.", "Lab safety, accurate recordkeeping, Excel; GMP/GLP familiarity useful.", "Pan-India", "Pan-India", "Remote/Hybrid", "10 weeks", "₹9,000–₹12,000/month", "24 October 2026"),
        ]
    },
    {
        "sector_id": 12,
        "sector": "Aviation & Defence",
        "companies": [
            ("Hindustan Aeronautics Limited", "Engineering & Technical Documentation Intern", "Organise technical records, assist with test documentation and prepare project or maintenance summaries.", "B.Tech/B.E. in Mechanical, Electrical, ECE, Aerospace, IT or related field.", "Technical writing, CAD/electronics/software basics relevant to role; confidentiality awareness.", "Bengaluru", "Karnataka", "Hybrid", "12 weeks", "₹8,000–₹12,000/month", "29 October 2026"),
            ("Bharat Electronics Limited", "Engineering & Technical Documentation Intern – Research & Reporting", "Organise technical records, assist with test documentation and prepare project or maintenance summaries.", "B.Tech/B.E. in Mechanical, Electrical, ECE, Aerospace, IT or related field.", "Technical writing, CAD/electronics/software basics relevant to role; confidentiality awareness.", "Chennai", "Tamil Nadu", "Hybrid", "6 months", "₹9,000–₹12,000/month", "24 October 2026"),
            ("Bharat Dynamics Limited", "Engineering & Technical Documentation Intern – Data & Operations", "Organise technical records, assist with test documentation and prepare project or maintenance summaries.", "B.Tech/B.E. in Mechanical, Electrical, ECE, Aerospace, IT or related field.", "Technical writing, CAD/electronics/software basics relevant to role; confidentiality awareness.", "Mumbai", "Maharashtra", "On-site", "8 weeks", "₹9,000–₹12,000/month", "26 October 2026"),
            ("Cochin Shipyard", "Engineering & Technical Documentation Intern – Project Support", "Organise technical records, assist with test documentation and prepare project or maintenance summaries.", "B.Tech/B.E. in Mechanical, Electrical, ECE, Aerospace, IT or related field.", "Technical writing, CAD/electronics/software basics relevant to role; confidentiality awareness.", "New Delhi", "Delhi / NCR", "On-site", "10 weeks", "₹10,000–₹15,000/month", "28 October 2026"),
            ("Air India", "Engineering & Technical Documentation Intern – Business/Technical Analysis", "Organise technical records, assist with test documentation and prepare project or maintenance summaries.", "B.Tech/B.E. in Mechanical, Electrical, ECE, Aerospace, IT or related field.", "Technical writing, CAD/electronics/software basics relevant to role; confidentiality awareness.", "Pan-India", "Pan-India", "Remote/Hybrid", "3 months", "₹10,000/month", "30 October 2026"),
        ]
    },
    {
        "sector_id": 13,
        "sector": "Manufacturing & Industrial",
        "companies": [
            ("Siemens India", "Manufacturing Process Intern", "Map production workflows, collect cycle-time observations, update quality logs and propose process improvements.", "B.Tech/B.E. in Mechanical, Industrial, Production, Electrical or Mechatronics.", "Excel, process mapping, quality concepts; CAD/Lean basics beneficial.", "Bengaluru", "Karnataka", "Hybrid", "6 months", "₹8,000–₹12,000/month", "28 October 2026"),
            ("ABB India", "Manufacturing Process Intern – Research & Reporting", "Map production workflows, collect cycle-time observations, update quality logs and propose process improvements.", "B.Tech/B.E. in Mechanical, Industrial, Production, Electrical or Mechatronics.", "Excel, process mapping, quality concepts; CAD/Lean basics beneficial.", "Chennai", "Tamil Nadu", "Hybrid", "8 weeks", "₹8,000–₹11,000/month", "30 October 2026"),
            ("Bharat Forge", "Manufacturing Process Intern – Data & Operations", "Map production workflows, collect cycle-time observations, update quality logs and propose process improvements.", "B.Tech/B.E. in Mechanical, Industrial, Production, Electrical or Mechatronics.", "Excel, process mapping, quality concepts; CAD/Lean basics beneficial.", "Mumbai", "Maharashtra", "On-site", "10 weeks", "₹9,000–₹12,000/month", "25 October 2026"),
            ("Thermax", "Manufacturing Process Intern – Project Support", "Map production workflows, collect cycle-time observations, update quality logs and propose process improvements.", "B.Tech/B.E. in Mechanical, Industrial, Production, Electrical or Mechatronics.", "Excel, process mapping, quality concepts; CAD/Lean basics beneficial.", "New Delhi", "Delhi / NCR", "On-site", "3 months", "₹10,000–₹15,000/month", "27 October 2026"),
            ("Godrej & Boyce", "Manufacturing Process Intern – Business/Technical Analysis", "Map production workflows, collect cycle-time observations, update quality logs and propose process improvements.", "B.Tech/B.E. in Mechanical, Industrial, Production, Electrical or Mechatronics.", "Excel, process mapping, quality concepts; CAD/Lean basics beneficial.", "Pan-India", "Pan-India", "Remote/Hybrid", "12 weeks", "₹9,000–₹13,000/month", "29 October 2026"),
        ]
    },
    {
        "sector_id": 14,
        "sector": "Chemical Industry",
        "companies": [
            ("UPL", "Chemical Process & EHS Intern", "Support process-data review, EHS documentation, literature research and compliance tracking under supervision.", "B.Tech/B.E. Chemical, BSc/MSc Chemistry or Environmental Science.", "Lab/plant safety awareness, Excel, technical documentation; process basics.", "Bengaluru", "Karnataka", "Hybrid", "8 weeks", "₹8,000–₹12,000/month", "27 October 2026"),
            ("SRF Limited", "Chemical Process & EHS Intern – Research & Reporting", "Support process-data review, EHS documentation, literature research and compliance tracking under supervision.", "B.Tech/B.E. Chemical, BSc/MSc Chemistry or Environmental Science.", "Lab/plant safety awareness, Excel, technical documentation; process basics.", "Chennai", "Tamil Nadu", "Hybrid", "10 weeks", "₹8,000–₹11,000/month", "29 October 2026"),
            ("Aarti Industries", "Chemical Process & EHS Intern – Data & Operations", "Support process-data review, EHS documentation, literature research and compliance tracking under supervision.", "B.Tech/B.E. Chemical, BSc/MSc Chemistry or Environmental Science.", "Lab/plant safety awareness, Excel, technical documentation; process basics.", "Mumbai", "Maharashtra", "On-site", "3 months", "₹9,000–₹12,000/month", "24 October 2026"),
            ("Deepak Nitrite", "Chemical Process & EHS Intern – Project Support", "Support process-data review, EHS documentation, literature research and compliance tracking under supervision.", "B.Tech/B.E. Chemical, BSc/MSc Chemistry or Environmental Science.", "Lab/plant safety awareness, Excel, technical documentation; process basics.", "New Delhi", "Delhi / NCR", "On-site", "12 weeks", "₹10,000–₹15,000/month", "26 October 2026"),
            ("PI Industries", "Chemical Process & EHS Intern – Business/Technical Analysis", "Support process-data review, EHS documentation, literature research and compliance tracking under supervision.", "B.Tech/B.E. Chemical, BSc/MSc Chemistry or Environmental Science.", "Lab/plant safety awareness, Excel, technical documentation; process basics.", "Pan-India", "Pan-India", "Remote/Hybrid", "6 months", "₹9,000–₹12,000/month", "28 October 2026"),
        ]
    },
    {
        "sector_id": 15,
        "sector": "Media, Entertainment & Education",
        "companies": [
            ("Zee Entertainment", "Content & Audience Research Intern", "Research audience trends, prepare content calendars, review engagement metrics and assist with production or learning materials.", "Any undergraduate degree in Media, Journalism, English, Marketing, Education.", "Writing, research, spreadsheets, content planning; editing tools helpful.", "Bengaluru", "Karnataka", "Hybrid", "10 weeks", "₹8,000–₹12,000/month", "26 October 2026"),
            ("Sony Pictures Networks India", "Content & Audience Research Intern – Research & Reporting", "Research audience trends, prepare content calendars, review engagement metrics and assist with production or learning materials.", "Any undergraduate degree in Media, Journalism, English, Marketing, Education.", "Writing, research, spreadsheets, content planning; editing tools helpful.", "Chennai", "Tamil Nadu", "Hybrid", "3 months", "₹9,000–₹12,000/month", "28 October 2026"),
            ("PVR INOX", "Content & Audience Research Intern – Data & Operations", "Research audience trends, prepare content calendars, review engagement metrics and assist with production or learning materials.", "Any undergraduate degree in Media, Journalism, English, Marketing, Education.", "Writing, research, spreadsheets, content planning; editing tools helpful.", "Mumbai", "Maharashtra", "On-site", "12 weeks", "₹8,000–₹10,000/month", "30 October 2026"),
            ("Sun TV Network", "Content & Audience Research Intern – Project Support", "Research audience trends, prepare content calendars, review engagement metrics and assist with production or learning materials.", "Any undergraduate degree in Media, Journalism, English, Marketing, Education.", "Writing, research, spreadsheets, content planning; editing tools helpful.", "New Delhi", "Delhi / NCR", "On-site", "6 months", "₹10,000–₹15,000/month", "25 October 2026"),
            ("Saregama India", "Content & Audience Research Intern – Business/Technical Analysis", "Research audience trends, prepare content calendars, review engagement metrics and assist with production or learning materials.", "Any undergraduate degree in Media, Journalism, English, Marketing, Education.", "Writing, research, spreadsheets, content planning; editing tools helpful.", "Pan-India", "Pan-India", "Remote/Hybrid", "8 weeks", "₹9,000–₹12,000/month", "27 October 2026"),
        ]
    },
    {
        "sector_id": 16,
        "sector": "Agriculture & Allied Industries",
        "companies": [
            ("Godrej Agrovet", "Agriculture Research & Field Data Intern", "Compile field-trial observations, organise survey data and prepare summaries on crop, input or supply-chain topics.", "BSc/MSc Agriculture, Agronomy, Horticulture, Soil Science, Biotechnology.", "Field observation, data collection, Excel, report writing; local-language skills useful.", "Bengaluru", "Karnataka", "Hybrid", "3 months", "₹8,000–₹12,000/month", "25 October 2026"),
            ("Coromandel International", "Agriculture Research & Field Data Intern – Research & Reporting", "Compile field-trial observations, organise survey data and prepare summaries on crop, input or supply-chain topics.", "BSc/MSc Agriculture, Agronomy, Horticulture, Soil Science, Biotechnology.", "Field observation, data collection, Excel, report writing; local-language skills useful.", "Chennai", "Tamil Nadu", "Hybrid", "12 weeks", "₹8,000–₹11,000/month", "27 October 2026"),
            ("Rallis India", "Agriculture Research & Field Data Intern – Data & Operations", "Compile field-trial observations, organise survey data and prepare summaries on crop, input or supply-chain topics.", "BSc/MSc Agriculture, Agronomy, Horticulture, Soil Science, Biotechnology.", "Field observation, data collection, Excel, report writing; local-language skills useful.", "Mumbai", "Maharashtra", "On-site", "6 months", "₹8,000–₹11,000/month", "29 October 2026"),
            ("National Seeds Corporation", "Agriculture Research & Field Data Intern – Project Support", "Compile field-trial observations, organise survey data and prepare summaries on crop, input or supply-chain topics.", "BSc/MSc Agriculture, Agronomy, Horticulture, Soil Science, Biotechnology.", "Field observation, data collection, Excel, report writing; local-language skills useful.", "New Delhi", "Delhi / NCR", "On-site", "8 weeks", "₹10,000–₹15,000/month", "24 October 2026"),
            ("Nuziveedu Seeds", "Agriculture Research & Field Data Intern – Business/Technical Analysis", "Compile field-trial observations, organise survey data and prepare summaries on crop, input or supply-chain topics.", "BSc/MSc Agriculture, Agronomy, Horticulture, Soil Science, Biotechnology.", "Field observation, data collection, Excel, report writing; local-language skills useful.", "Pan-India", "Pan-India", "Remote/Hybrid", "10 weeks", "₹9,000–₹12,000/month", "26 October 2026"),
        ]
    },
    {
        "sector_id": 17,
        "sector": "Consulting Services",
        "companies": [
            ("Deloitte India", "Business & Research Analyst Intern", "Conduct desk research, clean datasets, prepare client-style presentations and document findings.", "BBA, B.Com, Economics, Statistics, Engineering; MBA students for advanced projects.", "Excel, PowerPoint, structured research, communication; SQL/Power BI helpful.", "Bengaluru", "Karnataka", "Hybrid", "12 weeks", "₹8,000–₹12,000/month", "24 October 2026"),
            ("EY India", "Business & Research Analyst Intern – Research & Reporting", "Conduct desk research, clean datasets, prepare client-style presentations and document findings.", "BBA, B.Com, Economics, Statistics, Engineering; MBA students for advanced projects.", "Excel, PowerPoint, structured research, communication; SQL/Power BI helpful.", "Chennai", "Tamil Nadu", "Hybrid", "6 months", "₹9,000–₹12,000/month", "26 October 2026"),
            ("KPMG India", "Business & Research Analyst Intern – Data & Operations", "Conduct desk research, clean datasets, prepare client-style presentations and document findings.", "BBA, B.Com, Economics, Statistics, Engineering; MBA students for advanced projects.", "Excel, PowerPoint, structured research, communication; SQL/Power BI helpful.", "Mumbai", "Maharashtra", "On-site", "8 weeks", "₹10,000–₹14,000/month", "28 October 2026"),
            ("PwC India", "Business & Research Analyst Intern – Project Support", "Conduct desk research, clean datasets, prepare client-style presentations and document findings.", "BBA, B.Com, Economics, Statistics, Engineering; MBA students for advanced projects.", "Excel, PowerPoint, structured research, communication; SQL/Power BI helpful.", "New Delhi", "Delhi / NCR", "On-site", "10 weeks", "₹10,000–₹15,000/month", "30 October 2026"),
            ("Grant Thornton Bharat", "Business & Research Analyst Intern – Business/Technical Analysis", "Conduct desk research, clean datasets, prepare client-style presentations and document findings.", "BBA, B.Com, Economics, Statistics, Engineering; MBA students for advanced projects.", "Excel, PowerPoint, structured research, communication; SQL/Power BI helpful.", "Pan-India", "Pan-India", "Remote/Hybrid", "3 months", "₹9,000–₹13,000/month", "25 October 2026"),
        ]
    },
    {
        "sector_id": 18,
        "sector": "Textile Manufacturing",
        "companies": [
            ("Arvind Limited", "Textile Production & Sustainability Intern", "Support production/quality data, material testing records, waste tracking and sustainability documentation.", "Textile Technology, Fashion Technology, Chemical, Mechanical or Environmental Science.", "Excel, quality checks, material knowledge; sustainability reporting helpful.", "Bengaluru", "Karnataka", "Hybrid", "6 months", "₹8,000–₹12,000/month", "30 October 2026"),
            ("Vardhman Textiles", "Textile Production & Sustainability Intern – Research & Reporting", "Support production/quality data, material testing records, waste tracking and sustainability documentation.", "Textile Technology, Fashion Technology, Chemical, Mechanical or Environmental Science.", "Excel, quality checks, material knowledge; sustainability reporting helpful.", "Chennai", "Tamil Nadu", "Hybrid", "8 weeks", "₹8,000–₹11,000/month", "25 October 2026"),
            ("Trident Group", "Textile Production & Sustainability Intern – Data & Operations", "Support production/quality data, material testing records, waste tracking and sustainability documentation.", "Textile Technology, Fashion Technology, Chemical, Mechanical or Environmental Science.", "Excel, quality checks, material knowledge; sustainability reporting helpful.", "Mumbai", "Maharashtra", "On-site", "10 weeks", "₹8,000–₹11,000/month", "27 October 2026"),
            ("Raymond Lifestyle", "Textile Production & Sustainability Intern – Project Support", "Support production/quality data, material testing records, waste tracking and sustainability documentation.", "Textile Technology, Fashion Technology, Chemical, Mechanical or Environmental Science.", "Excel, quality checks, material knowledge; sustainability reporting helpful.", "New Delhi", "Delhi / NCR", "On-site", "3 months", "₹10,000–₹15,000/month", "29 October 2026"),
            ("Welspun Living", "Textile Production & Sustainability Intern – Business/Technical Analysis", "Support production/quality data, material testing records, waste tracking and sustainability documentation.", "Textile Technology, Fashion Technology, Chemical, Mechanical or Environmental Science.", "Excel, quality checks, material knowledge; sustainability reporting helpful.", "Pan-India", "Pan-India", "Remote/Hybrid", "12 weeks", "₹9,000–₹12,000/month", "24 October 2026"),
        ]
    },
    {
        "sector_id": 19,
        "sector": "Gems & Jewellery",
        "companies": [
            ("Titan Company", "Merchandising & Retail Analytics Intern", "Assist with product catalogue data, inventory analysis, customer trends and merchandising reports.", "BBA, B.Com, Fashion/Design, Economics or Marketing student.", "Excel, visual presentation, communication, attention to detail.", "Bengaluru", "Karnataka", "Hybrid", "8 weeks", "₹8,000–₹12,000/month", "29 October 2026"),
            ("Kalyan Jewellers", "Merchandising & Retail Analytics Intern – Research & Reporting", "Assist with product catalogue data, inventory analysis, customer trends and merchandising reports.", "BBA, B.Com, Fashion/Design, Economics or Marketing student.", "Excel, visual presentation, communication, attention to detail.", "Chennai", "Tamil Nadu", "Hybrid", "10 weeks", "₹8,000–₹11,000/month", "24 October 2026"),
            ("Senco Gold", "Merchandising & Retail Analytics Intern – Data & Operations", "Assist with product catalogue data, inventory analysis, customer trends and merchandising reports.", "BBA, B.Com, Fashion/Design, Economics or Marketing student.", "Excel, visual presentation, communication, attention to detail.", "Mumbai", "Maharashtra", "On-site", "3 months", "₹8,000–₹11,000/month", "26 October 2026"),
            ("Rajesh Exports", "Merchandising & Retail Analytics Intern – Project Support", "Assist with product catalogue data, inventory analysis, customer trends and merchandising reports.", "BBA, B.Com, Fashion/Design, Economics or Marketing student.", "Excel, visual presentation, communication, attention to detail.", "New Delhi", "Delhi / NCR", "On-site", "12 weeks", "₹10,000–₹15,000/month", "28 October 2026"),
            ("PN Gadgil Jewellers", "Merchandising & Retail Analytics Intern – Business/Technical Analysis", "Assist with product catalogue data, inventory analysis, customer trends and merchandising reports.", "BBA, B.Com, Fashion/Design, Economics or Marketing student.", "Excel, visual presentation, communication, attention to detail.", "Pan-India", "Pan-India", "Remote/Hybrid", "6 months", "₹9,000–₹12,000/month", "30 October 2026"),
        ]
    },
    {
        "sector_id": 20,
        "sector": "Travel & Hospitality",
        "companies": [
            ("Indian Hotels Company (Taj)", "Hospitality & Guest Experience Intern", "Map guest journeys, review feedback, support service operations and summarise booking or experience trends.", "Hotel Management, Tourism, Travel, Business or Marketing student.", "Customer service, communication, organisation; languages beneficial.", "Bengaluru", "Karnataka", "Hybrid", "10 weeks", "₹8,000–₹12,000/month", "28 October 2026"),
            ("EIH (The Oberoi Group)", "Hospitality & Guest Experience Intern – Research & Reporting", "Map guest journeys, review feedback, support service operations and summarise booking or experience trends.", "Hotel Management, Tourism, Travel, Business or Marketing student.", "Customer service, communication, organisation; languages beneficial.", "Chennai", "Tamil Nadu", "Hybrid", "3 months", "₹9,000–₹12,000/month", "30 October 2026"),
            ("ITC Hotels", "Hospitality & Guest Experience Intern – Data & Operations", "Map guest journeys, review feedback, support service operations and summarise booking or experience trends.", "Hotel Management, Tourism, Travel, Business or Marketing student.", "Customer service, communication, organisation; languages beneficial.", "Mumbai", "Maharashtra", "On-site", "12 weeks", "₹8,000–₹11,000/month", "25 October 2026"),
            ("Lemon Tree Hotels", "Hospitality & Guest Experience Intern – Project Support", "Map guest journeys, review feedback, support service operations and summarise booking or experience trends.", "Hotel Management, Tourism, Travel, Business or Marketing student.", "Customer service, communication, organisation; languages beneficial.", "New Delhi", "Delhi / NCR", "On-site", "6 months", "₹10,000–₹15,000/month", "27 October 2026"),
            ("MakeMyTrip", "Hospitality & Guest Experience Intern – Business/Technical Analysis", "Map guest journeys, review feedback, support service operations and summarise booking or experience trends.", "Hotel Management, Tourism, Travel, Business or Marketing student.", "Customer service, communication, organisation; languages beneficial.", "Pan-India", "Pan-India", "Remote/Hybrid", "8 weeks", "₹10,000–₹14,000/month", "29 October 2026"),
        ]
    },
    {
        "sector_id": 21,
        "sector": "Healthcare",
        "companies": [
            ("Apollo Hospitals", "Healthcare Operations & Research Intern", "Support non-clinical operations, survey analysis, service-quality documentation and literature review.", "Healthcare Management, Public Health, Life Sciences, Statistics or related degree.", "Data privacy awareness, Excel, research and documentation.", "Bengaluru", "Karnataka", "Hybrid", "3 months", "₹8,000–₹12,000/month", "27 October 2026"),
            ("Fortis Healthcare", "Healthcare Operations & Research Intern – Research & Reporting", "Support non-clinical operations, survey analysis, service-quality documentation and literature review.", "Healthcare Management, Public Health, Life Sciences, Statistics or related degree.", "Data privacy awareness, Excel, research and documentation.", "Chennai", "Tamil Nadu", "Hybrid", "12 weeks", "₹8,000–₹11,000/month", "29 October 2026"),
            ("Max Healthcare", "Healthcare Operations & Research Intern – Data & Operations", "Support non-clinical operations, survey analysis, service-quality documentation and literature review.", "Healthcare Management, Public Health, Life Sciences, Statistics or related degree.", "Data privacy awareness, Excel, research and documentation.", "Mumbai", "Maharashtra", "On-site", "6 months", "₹9,000–₹12,000/month", "24 October 2026"),
            ("Narayana Health", "Healthcare Operations & Research Intern – Project Support", "Support non-clinical operations, survey analysis, service-quality documentation and literature review.", "Healthcare Management, Public Health, Life Sciences, Statistics or related degree.", "Data privacy awareness, Excel, research and documentation.", "New Delhi", "Delhi / NCR", "On-site", "8 weeks", "₹10,000–₹15,000/month", "26 October 2026"),
            ("Metropolis Healthcare", "Healthcare Operations & Research Intern – Business/Technical Analysis", "Support non-clinical operations, survey analysis, service-quality documentation and literature review.", "Healthcare Management, Public Health, Life Sciences, Statistics or related degree.", "Data privacy awareness, Excel, research and documentation.", "Pan-India", "Pan-India", "Remote/Hybrid", "10 weeks", "₹9,000–₹12,000/month", "28 October 2026"),
        ]
    },
    {
        "sector_id": 22,
        "sector": "Mobility & Transportation",
        "companies": [
            ("Ashok Leyland", "Mobility & Logistics Analytics Intern", "Analyse delivery or mobility data, document operational bottlenecks and prepare performance summaries.", "Engineering, Logistics, Operations, Statistics, Business or Supply Chain student.", "Excel, analytical thinking, data visualisation; SQL/Python helpful.", "Bengaluru", "Karnataka", "Hybrid", "12 weeks", "₹8,000–₹12,000/month", "26 October 2026"),
            ("Bajaj Auto", "Mobility & Logistics Analytics Intern – Research & Reporting", "Analyse delivery or mobility data, document operational bottlenecks and prepare performance summaries.", "Engineering, Logistics, Operations, Statistics, Business or Supply Chain student.", "Excel, analytical thinking, data visualisation; SQL/Python helpful.", "Chennai", "Tamil Nadu", "Hybrid", "6 months", "₹9,000–₹12,000/month", "28 October 2026"),
            ("Ola Electric", "Mobility & Logistics Analytics Intern – Data & Operations", "Analyse delivery or mobility data, document operational bottlenecks and prepare performance summaries.", "Engineering, Logistics, Operations, Statistics, Business or Supply Chain student.", "Excel, analytical thinking, data visualisation; SQL/Python helpful.", "Mumbai", "Maharashtra", "On-site", "8 weeks", "₹10,000/month", "30 October 2026"),
            ("Ather Energy", "Mobility & Logistics Analytics Intern – Project Support", "Analyse delivery or mobility data, document operational bottlenecks and prepare performance summaries.", "Engineering, Logistics, Operations, Statistics, Business or Supply Chain student.", "Excel, analytical thinking, data visualisation; SQL/Python helpful.", "New Delhi", "Delhi / NCR", "On-site", "10 weeks", "₹10,000–₹15,000/month", "25 October 2026"),
            ("Blue Dart", "Mobility & Logistics Analytics Intern – Business/Technical Analysis", "Analyse delivery or mobility data, document operational bottlenecks and prepare performance summaries.", "Engineering, Logistics, Operations, Statistics, Business or Supply Chain student.", "Excel, analytical thinking, data visualisation; SQL/Python helpful.", "Pan-India", "Pan-India", "Remote/Hybrid", "3 months", "₹9,000–₹12,000/month", "27 October 2026"),
        ]
    },
    {
        "sector_id": 23,
        "sector": "Power & Utilities",
        "companies": [
            ("NTPC", "Power Systems & Sustainability Intern", "Support energy data tracking, asset documentation, efficiency analysis and sustainability reporting.", "Electrical/Power Engineering, Mechanical, Environmental Engineering.", "Excel, technical documentation, basic power/energy concepts.", "Bengaluru", "Karnataka", "Hybrid", "6 months", "₹8,000–₹12,000/month", "25 October 2026"),
            ("Power Grid Corporation of India", "Power Systems & Sustainability Intern – Research & Reporting", "Support energy data tracking, asset documentation, efficiency analysis and sustainability reporting.", "Electrical/Power Engineering, Mechanical, Environmental Engineering.", "Excel, technical documentation, basic power/energy concepts.", "Chennai", "Tamil Nadu", "Hybrid", "8 weeks", "₹8,000–₹11,000/month", "27 October 2026"),
            ("NHPC", "Power Systems & Sustainability Intern – Data & Operations", "Support energy data tracking, asset documentation, efficiency analysis and sustainability reporting.", "Electrical/Power Engineering, Mechanical, Environmental Engineering.", "Excel, technical documentation, basic power/energy concepts.", "Mumbai", "Maharashtra", "On-site", "10 weeks", "₹9,000–₹12,000/month", "29 October 2026"),
            ("Tata Power", "Power Systems & Sustainability Intern – Project Support", "Support energy data tracking, asset documentation, efficiency analysis and sustainability reporting.", "Electrical/Power Engineering, Mechanical, Environmental Engineering.", "Excel, technical documentation, basic power/energy concepts.", "New Delhi", "Delhi / NCR", "On-site", "3 months", "₹10,000–₹15,000/month", "24 October 2026"),
            ("Adani Power", "Power Systems & Sustainability Intern – Business/Technical Analysis", "Support energy data tracking, asset documentation, efficiency analysis and sustainability reporting.", "Electrical/Power Engineering, Mechanical, Environmental Engineering.", "Excel, technical documentation, basic power/energy concepts.", "Pan-India", "Pan-India", "Remote/Hybrid", "12 weeks", "₹10,000–₹13,000/month", "26 October 2026"),
        ]
    },
    {
        "sector_id": 24,
        "sector": "Logistics & Warehousing",
        "companies": [
            ("Container Corporation of India", "Supply Chain & Warehouse Operations Intern", "Track shipment/inventory metrics, document warehouse processes and help prepare service-level reports.", "BBA/B.Com, Logistics, Industrial Engineering, Supply Chain or Operations.", "Excel, coordination, data accuracy, process mapping; ERP familiarity useful.", "Bengaluru", "Karnataka", "Hybrid", "8 weeks", "₹8,000–₹12,000/month", "24 October 2026"),
            ("Delhivery", "Supply Chain & Warehouse Operations Intern – Research & Reporting", "Track shipment/inventory metrics, document warehouse processes and help prepare service-level reports.", "BBA/B.Com, Logistics, Industrial Engineering, Supply Chain or Operations.", "Excel, coordination, data accuracy, process mapping; ERP familiarity useful.", "Chennai", "Tamil Nadu", "Hybrid", "10 weeks", "₹8,000–₹11,000/month", "26 October 2026"),
            ("Gati", "Supply Chain & Warehouse Operations Intern – Data & Operations", "Track shipment/inventory metrics, document warehouse processes and help prepare service-level reports.", "BBA/B.Com, Logistics, Industrial Engineering, Supply Chain or Operations.", "Excel, coordination, data accuracy, process mapping; ERP familiarity useful.", "Mumbai", "Maharashtra", "On-site", "3 months", "₹8,000–₹11,000/month", "28 October 2026"),
            ("VRL Logistics", "Supply Chain & Warehouse Operations Intern – Project Support", "Track shipment/inventory metrics, document warehouse processes and help prepare service-level reports.", "BBA/B.Com, Logistics, Industrial Engineering, Supply Chain or Operations.", "Excel, coordination, data accuracy, process mapping; ERP familiarity useful.", "New Delhi", "Delhi / NCR", "On-site", "12 weeks", "₹10,000–₹15,000/month", "30 October 2026"),
            ("Safexpress", "Supply Chain & Warehouse Operations Intern – Business/Technical Analysis", "Track shipment/inventory metrics, document warehouse processes and help prepare service-level reports.", "BBA/B.Com, Logistics, Industrial Engineering, Supply Chain or Operations.", "Excel, coordination, data accuracy, process mapping; ERP familiarity useful.", "Pan-India", "Pan-India", "Remote/Hybrid", "6 months", "₹9,000–₹12,000/month", "25 October 2026"),
        ]
    }
]

# Map company names to their logo filename if available
LOGO_MAP = {
    "Tata Consultancy Services": "tcs.png",
    "Infosys": "infosys.png",
    "Wipro": "wipro.png",
    "HCLTech": "hcltech.png",
    "Persistent Systems": "tata.png",
    "HDFC Bank": "hdfcbank.png",
    "ICICI Bank": "icicibank.png",
    "State Bank of India": "sbi.png",
    "Axis Bank": "hdfcbank.png",
    "Bajaj Finance": "bajajauto.png",
    "Indian Oil Corporation": "ril.png",
    "ONGC": "adani.png",
    "GAIL": "lt.png",
    "BPCL": "ril.png",
    "HPCL": "ril.png",
    "Coal India": "tata.png",
    "NMDC": "adani.png",
    "Hindustan Zinc": "vedanta.png",
    "Vedanta": "vedanta.png",
    "Tata Steel": "tata.png",
    "Hindustan Unilever": "hul.png",
    "ITC": "itc.png",
    "Nestlé India": "nestle.png",
    "Dabur": "dabur.png",
    "Britannia Industries": "britannia.png",
    "Bharti Airtel": "airtel.png",
    "Vodafone Idea": "airtel.png",
    "Reliance Jio": "ril.png",
    "Tata Communications": "tata.png",
    "Tejas Networks": "tata.png",
    "Larsen & Toubro": "lt.png",
    "Engineers India Limited": "lt.png",
    "IRCON International": "lt.png",
    "NBCC (India)": "lt.png",
    "Tata Projects": "tata.png",
    "Reliance Retail": "ril.png",
    "Titan Company": "titan.png",
    "Croma": "tata.png",
    "Asian Paints": "asianpaints.png",
    "Whirlpool India": "whirlpool.png",
    "UltraTech Cement": "adityabirla.png",
    "Shree Cement": "adityabirla.png",
    "Wonder Cement": "adityabirla.png",
    "ACC": "adani.png",
    "Ambuja Cements": "adani.png",
    "Maruti Suzuki": "marutisuzuki.png",
    "Mahindra & Mahindra": "mahindra.png",
    "Tata Motors": "tatamotors.png",
    "Hero MotoCorp": "heromotocorp.png",
    "TVS Motor": "bajajauto.png",
    "Sun Pharmaceutical Industries": "sunpharma.png",
    "Cipla": "cipla.png",
    "Dr. Reddy's Laboratories": "drreddys.png",
    "Lupin": "sunpharma.png",
    "Zydus Lifesciences": "sunpharma.png",
    "Hindustan Aeronautics Limited": "hal.png",
    "Bharat Electronics Limited": "bel.png",
    "Bharat Dynamics Limited": "bel.png",
    "Cochin Shipyard": "lt.png",
    "Air India": "tata.png",
    "Siemens India": "siemens.png",
    "ABB India": "abb.png",
    "Bharat Forge": "bharatforge.png",
    "Thermax": "thermax.png",
    "Godrej & Boyce": "godrej.png",
    "UPL": "upl.png",
    "SRF Limited": "srf.png",
    "Aarti Industries": "aarti.png",
    "Deepak Nitrite": "deepak.png",
    "PI Industries": "pi.png",
    "Zee Entertainment": "zee.png",
    "Sony Pictures Networks India": "sony.png",
    "PVR INOX": "pvr.png",
    "Sun TV Network": "suntv.png",
    "Saregama India": "saregama.png",
    "Godrej Agrovet": "godrej.png",
    "Coromandel International": "coromandel.png",
    "Rallis India": "tata.png",
    "National Seeds Corporation": "gov.png",
    "Nuziveedu Seeds": "seeds.png",
    "Deloitte India": "deloitte.png",
    "EY India": "ey.png",
    "KPMG India": "kpmg.png",
    "PwC India": "pwc.png",
    "Grant Thornton Bharat": "gt.png",
    "Arvind Limited": "arvind.png",
    "Vardhman Textiles": "vardhman.png",
    "Trident Group": "trident.png",
    "Raymond Lifestyle": "raymond.png",
    "Welspun Living": "welspun.png",
    "Kalyan Jewellers": "kalyan.png",
    "Senco Gold": "senco.png",
    "Rajesh Exports": "rajesh.png",
    "PN Gadgil Jewellers": "png.png",
    "Indian Hotels Company (Taj)": "tata.png",
    "EIH (The Oberoi Group)": "oberoi.png",
    "ITC Hotels": "itc.png",
    "Lemon Tree Hotels": "lemontree.png",
    "MakeMyTrip": "makemytrip.png",
    "Apollo Hospitals": "apollo.png",
    "Fortis Healthcare": "fortis.png",
    "Max Healthcare": "max.png",
    "Narayana Health": "narayana.png",
    "Metropolis Healthcare": "metropolis.png",
    "Ashok Leyland": "hinduja.png",
    "Bajaj Auto": "bajajauto.png",
    "Ola Electric": "ola.png",
    "Ather Energy": "ather.png",
    "Blue Dart": "bluedart.png",
    "NTPC": "ntpc.png",
    "Power Grid Corporation of India": "powergrid.png",
    "NHPC": "nhpc.png",
    "Tata Power": "tatapower.png",
    "Adani Power": "adani.png",
    "Container Corporation of India": "concor.png",
    "Delhivery": "delhivery.png",
    "Gati": "gati.png",
    "VRL Logistics": "vrl.png",
    "Safexpress": "safexpress.png",
}

def generate_records():
    records = []
    rec_num = 1
    for sec in SECTORS_DATA:
        sector_name = sec["sector"]
        sector_id = sec["sector_id"]
        for comp in sec["companies"]:
            company, title, summary, eligibility, skills, city, state, mode, duration, stipend, deadline = comp
            rec_id = f"PMIS-{rec_num:03d}"
            logo_file = LOGO_MAP.get(company, "pm_internship_logo_eng.svg")
            
            # Form clean text representation for RAG and search
            content = (
                f"Record {rec_id} | {company}\n"
                f"Sector: {sector_name}\n"
                f"Internship Title: {title}\n"
                f"Role Summary: {summary}\n"
                f"Eligibility & Education: {eligibility}\n"
                f"Key Skills: {skills}\n"
                f"Location: {city}, {state} | Work Mode: {mode}\n"
                f"Duration: {duration} | Monthly Stipend: {stipend}\n"
                f"Application Deadline: {deadline} | Status: Open (PMIS Prototype Listing)\n"
                f"How to Apply: Login or Register on the PM Internship Portal and apply through your Student Dashboard."
            )

            records.append({
                "id": rec_id,
                "record_num": rec_num,
                "sector": sector_name,
                "sector_id": sector_id,
                "company": company,
                "title": title,
                "summary": summary,
                "eligibility": eligibility,
                "skills": skills,
                "city": city,
                "state": state,
                "location": f"{city}, {state}",
                "mode": mode,
                "duration": duration,
                "stipend": stipend,
                "deadline": deadline,
                "status": "Open",
                "logo": logo_file,
                "content": content
            })
            rec_num += 1

    return records

def main():
    records = generate_records()
    print(f"Generated {len(records)} official PM internship records across 24 sectors.")

    # Save to backend
    BACKEND_DATA.parent.mkdir(parents=True, exist_ok=True)
    with open(BACKEND_DATA, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    print(f"Saved to {BACKEND_DATA}")

    # Save to frontend
    FRONTEND_DATA.parent.mkdir(parents=True, exist_ok=True)
    with open(FRONTEND_DATA, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    print(f"Saved to {FRONTEND_DATA}")

if __name__ == "__main__":
    main()
