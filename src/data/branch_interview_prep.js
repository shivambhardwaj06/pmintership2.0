// Official PMIS Branch Interview Preparation & Video Guidance
// Tailored per academic discipline with authentic corporate interview walkthroughs and round structures

export const BRANCH_INTERVIEW_GUIDES = {
  "Computer Science / IT": {
    branchCategory: "Computer Science / IT",
    domainBadge: "Information Technology & Software Engineering",
    videoId: "QBX7RkhuyCA",
    videoUrl: "https://youtu.be/QBX7RkhuyCA?si=_mPelpAhKIMDIxpe",
    videoTitle: "MICROSOFT Coding Interview | Getting Interviewed by a Microsoft Engineer",
    channel: "Fraz & Kushal Vijay",
    videoDescription:
      "A realistic, full-length software engineering coding interview covering live data structures, algorithmic problem solving, code optimization, edge cases, and technical communication required by top technology enterprises.",
    rounds: [
      {
        roundNumber: "Round 1",
        title: "Online Technical Assessment & Coding MCQ",
        duration: "60 - 90 Minutes",
        format: "Automated Platform (HackerRank / Mettl)",
        description:
          "Screening round assessing programming fundamentals, Data Structures & Algorithms, SQL database queries, and debugging proficiency under timed conditions.",
        keyTopics: [
          "Arrays, Strings, HashMaps, Two-Pointer logic",
          "SQL joins, grouping, indexing, and subqueries",
          "Object-Oriented Programming (OOPS) & clean syntax",
          "Time & Space complexity analysis (Big-O)",
        ],
      },
      {
        roundNumber: "Round 2",
        title: "Technical Interview & Project Defense",
        duration: "45 - 60 Minutes",
        format: "1-on-1 with Senior Technical Lead",
        description:
          "In-depth live coding and project interrogation. Interviewers scrutinize the candidate's actual contributions in listed projects, API designs, and database schemas.",
        keyTopics: [
          "Live code walkthrough of projects listed on resume",
          "REST API design, error handling, status codes",
          "Concurrency, caching (Redis), asynchronous queues",
          "System architecture & schema normalization",
        ],
      },
      {
        roundNumber: "Round 3",
        title: "Techno-HR & Behavioral (STAR Method)",
        duration: "30 - 45 Minutes",
        format: "Hiring Manager & HR Panel",
        description:
          "Evaluation of workplace adaptability, motivation for PM Internship Scheme, conflict resolution, and communication agility in enterprise teams.",
        keyTopics: [
          "Why PM Internship Scheme & target corporate sector?",
          "Handling production outages or challenging deadlines",
          "Collaboration with cross-functional product teams",
          "Continuous learning & source control hygiene",
        ],
      },
    ],
    sampleQuestions: [
      {
        question: "Explain how database indexing works in SQL/PostgreSQL and what are the trade-offs of excessive indexing?",
        guidance: "Focus on B-Tree structures, read optimization vs. write penalty on INSERT/UPDATE operations.",
        sampleAnswer:
          "Indexes use data structures like B-Trees to allow logarithmic search time O(log N) instead of full table scans O(N). While indexes drastically accelerate SELECT queries, each index adds overhead to INSERT, UPDATE, and DELETE operations because the tree must be rebalanced, and they consume additional disk space.",
      },
      {
        question: "Walk us through an end-to-end full stack project you built. What was the toughest bottleneck and how did you resolve it?",
        guidance: "Use the STAR method: Situation, Task, Action, Result. Quantify the improvement (e.g. reduced latency by 40%).",
        sampleAnswer:
          "In my lead generation and analytics app, processing bulk CSV imports of 10,000+ records was causing HTTP timeouts. I decoupled the ingestion by offloading parsing to background Celery workers with a Redis queue and added database batch insertions with transaction blocks, reducing API response latency from 12s to under 350ms.",
      },
      {
        question: "How do you ensure data security and avoid SQL injection or XSS in a web application?",
        guidance: "Mention parameterized queries/ORM, JWT token hygiene, sanitized inputs, and CSP headers.",
        sampleAnswer:
          "We use parameterized queries through modern ORMs (like Prisma or SQLAlchemy) which treat user input as data rather than executable code. For XSS, React escapes variables by default, and we enforce strict Content Security Policy (CSP) headers and HTTP-only cookies for token persistence.",
      },
    ],
  },

  "Mechanical & Automobile": {
    branchCategory: "Mechanical & Automobile",
    domainBadge: "Mechanical, Automotive & Manufacturing Systems",
    videoId: "3CvKe1P30jA",
    videoUrl: "https://youtu.be/3CvKe1P30jA",
    videoTitle: "Top Mechanical Engineering Interview Questions & Answers",
    channel: "Engineering Gone Wild",
    videoDescription:
      "Comprehensive breakdown of core mechanical engineering technical and behavioral interview questions covering thermodynamics, SolidWorks CAD modeling, GD&T, and FEA stress analysis.",
    rounds: [
      {
        roundNumber: "Round 1",
        title: "Core Engineering Fundamentals & Aptitude",
        duration: "60 Minutes",
        format: "Technical Assessment",
        description:
          "Covers basic thermodynamics cycles, strength of materials, fluid mechanics, machine design formulas, and spatial reasoning.",
        keyTopics: [
          "Stress-strain curve, yield point, ultimate tensile strength",
          "Otto, Diesel, and Rankine thermodynamic cycles",
          "Bernoulli's equation & pipe head loss calculations",
          "Basics of Electric Vehicle (EV) battery cooling & chassis",
        ],
      },
      {
        roundNumber: "Round 2",
        title: "CAD/CAM Design Defense & Technical Panel",
        duration: "45 Minutes",
        format: "Technical Panel with Design Engineers",
        description:
          "Detailed inspection of CAD 3D assemblies, Geometric Dimensioning & Tolerancing (GD&T) principles, and college fabrication projects (SAE BAJA/Formula Student).",
        keyTopics: [
          "SolidWorks / AutoCAD assembly mating and interference checks",
          "GD&T datum selection, runout, position, and flatness",
          "Finite Element Analysis (FEA) boundary conditions & meshing",
          "Sheet metal bending allowances and CNC manufacturing",
        ],
      },
      {
        roundNumber: "Round 3",
        title: "Manufacturing Safety & Managerial HR",
        duration: "30 Minutes",
        format: "Plant Operations & HR Interview",
        description:
          "Evaluates candidate willingness for shop-floor deployment, shift operations, 5S principles, and industrial safety compliance.",
        keyTopics: [
          "Personal Protective Equipment (PPE) & OSHA standards",
          "5S methodology and Lean manufacturing awareness",
          "Root cause analysis (Fishbone diagram / 5-Whys)",
          "Commitment to manufacturing quality benchmarks",
        ],
      },
    ],
    sampleQuestions: [
      {
        question: "What is the difference between engineering stress and true stress, and at what point do they significantly diverge?",
        guidance: "Explain instantaneous cross-sectional area changes during necking.",
        sampleAnswer:
          "Engineering stress uses the original cross-sectional area of the specimen (F / A0), whereas true stress accounts for the instantaneous cross-sectional area (F / Ai). They diverge significantly after the yield point, particularly once necking begins, where true stress continues rising while engineering stress appears to drop.",
      },
      {
        question: "What is GD&T and why is it preferred over traditional plus-minus coordinate tolerancing?",
        guidance: "Highlight cylindrical tolerance zones vs. square tolerance zones and repeatable inspection.",
        sampleAnswer:
          "GD&T (Geometric Dimensioning and Tolerancing) provides a universal symbolic language that specifies the exact allowable variation in form, orientation, and location of features relative to functional datums. Unlike coordinate tolerancing which creates square tolerance zones, GD&T allows 57% more usable tolerance area with cylindrical zones while ensuring guaranteed assembly fit.",
      },
    ],
  },

  "Electrical & Electronics (ECE / EEE)": {
    branchCategory: "Electrical & Electronics (ECE / EEE)",
    domainBadge: "Electronics, Embedded Systems & Power Grid",
    videoId: "MUpD8BAV4Vk",
    videoUrl: "https://youtu.be/MUpD8BAV4Vk",
    videoTitle: "Electrical Engineer Interview Top 10 Questions | Live Mock Interview",
    channel: "Tusiya Tech Electrical Academy",
    videoDescription:
      "Real-world technical simulation covering electrical systems, substation switchgear, circuit debugging, PLC/SCADA automation, and power factor correction.",
    rounds: [
      {
        roundNumber: "Round 1",
        title: "Electrical Circuit Theory & Digital Logic Test",
        duration: "60 Minutes",
        format: "Online Assessment",
        description:
          "Tests Kirchhoff's laws, RLC transient circuits, Boolean algebra, Op-Amp signal conditioning, and microcontroller register basics.",
        keyTopics: [
          "KVL, KCL, Thevenin & Norton equivalent circuits",
          "Transformer losses (core vs copper) & efficiency calculation",
          "Digital gates, flip-flops, ADC resolution & sampling theorem",
          "Microcontroller architecture (STM32, Arduino, ESP32)",
        ],
      },
      {
        roundNumber: "Round 2",
        title: "Hardware & Firmware Project Defense",
        duration: "45 Minutes",
        format: "Technical Review Panel",
        description:
          "Evaluation of PCB layout skills in KiCad/Altium, circuit debugging with oscilloscopes, and Embedded C/firmware programming.",
        keyTopics: [
          "PCB trace width, ground planes, EMI/EMC mitigation",
          "I2C, SPI, and UART serial communication protocols",
          "Motor speed control using PWM and H-Bridge drivers",
          "Substation protection: relays, MCB, MCCB, and SF6 breakers",
        ],
      },
      {
        roundNumber: "Round 3",
        title: "Electrical Safety & Corporate Fit",
        duration: "30 Minutes",
        format: "Managerial HR Interview",
        description:
          "Verifies safety awareness around high voltage installations, grounding/earthing standards (IS 3043), and enterprise communication.",
        keyTopics: [
          "Lockout/Tagout (LOTO) procedures & electrical arc flash safety",
          "Neutral vs Grounding differences",
          "Power factor penalties and APFC capacitor bank operation",
          "Team problem solving on commissioning deadlines",
        ],
      },
    ],
    sampleQuestions: [
      {
        question: "Why do industrial utilities penalize low power factor, and how does a capacitor bank correct it?",
        guidance: "Explain active power (kW) vs. apparent power (kVA) and reactive current draw.",
        sampleAnswer:
          "Low power factor means inductive equipment (motors, transformers) draws excessive reactive power (kVAR), increasing total current without performing useful work. This causes $I^2R$ transmission heating losses and cable voltage drops. Shunt capacitor banks supply leading reactive power locally, neutralizing inductive lag and bringing power factor close to unity.",
      },
      {
        question: "How do you debounce a noisy mechanical push-button switch in firmware?",
        guidance: "Contrast blocking delay vs. timer interrupt sampling.",
        sampleAnswer:
          "Instead of using blocking delays like delay(50ms) which freeze CPU execution, we use a non-blocking timer interrupt (e.g., every 5ms) to sample the pin state. Only when the pin reads consistently HIGH or LOW across 4 consecutive samples do we confirm a valid press.",
      },
    ],
  },

  "Civil & Infrastructure": {
    branchCategory: "Civil & Infrastructure",
    domainBadge: "Civil, Structural & Infrastructure Planning",
    videoId: "qB-gzkR16B4",
    videoUrl: "https://youtu.be/qB-gzkR16B4",
    videoTitle: "Civil Engineering Interview Masterclass #1 | Career Paths & Site Execution",
    channel: "2i Constructions",
    videoDescription:
      "A complete masterclass on civil engineering career paths, drawing interpretation, site supervision, concrete QA/QC, and real site interview scenarios.",
    rounds: [
      {
        roundNumber: "Round 1",
        title: "Structural & Materials Engineering Test",
        duration: "60 Minutes",
        format: "Technical MCQ Assessment",
        description:
          "Evaluates understanding of IS 456 reinforced concrete norms, soil mechanics, surveying calculations, and structural mechanics.",
        keyTopics: [
          "Bending moment and shear force diagrams (BMD & SFD)",
          "Concrete grades, water-cement ratio, slump test tolerances",
          "Soil compaction, bearing capacity, and settlement",
          "Total Station surveying & GPS leveling coordinates",
        ],
      },
      {
        roundNumber: "Round 2",
        title: "Site Drawing & Quantity Surveying Defense",
        duration: "45 Minutes",
        format: "Site Engineering Panel",
        description:
          "Interrogation on structural blueprint interpretation, Bar Bending Schedule (BBS) calculations, and construction material estimation.",
        keyTopics: [
          "Bar Bending Schedule (BBS) cutting lengths & lap splices",
          "AutoCAD Civil 3D alignment and cross-sections",
          "Formwork stripping schedules as per IS 456",
          "Non-destructive testing of concrete (Rebound hammer & UPV)",
        ],
      },
      {
        roundNumber: "Round 3",
        title: "EHS Site Safety & Project Scheduling",
        duration: "30 Minutes",
        format: "Project Manager & HR Round",
        description:
          "Focuses on Environmental Health & Safety (EHS) guidelines, site supervision ethics, and project tracking in MS Project / Primavera.",
        keyTopics: [
          "Excavation shoring and scaffold safety standards",
          "Critical Path Method (CPM) and project milestone tracking",
          "Client and subcontractor communication on job sites",
          "Quality audits and snag list resolution",
        ],
      },
    ],
    sampleQuestions: [
      {
        question: "How do you calculate the unit weight of a steel reinforcement bar, and what is the minimum lap length specified in IS 456?",
        guidance: "Cite formula $D^2 / 162$ and standard lap length $24d$ to $50d$.",
        sampleAnswer:
          "The nominal weight per meter of steel rebar is given by $W = D^2 / 162$ kg/m, where D is the diameter in mm. According to IS 456:2000, the lap length in compression is not less than 24 times the bar diameter ($24d$), and in tension it is generally taken as $30d$ to $50d$ depending on concrete grade and bonding zones.",
      },
      {
        question: "What causes honeycombing in reinforced concrete, and how do you prevent it on site?",
        guidance: "Mention compaction, rebar congestion, water-cement ratio, and formwork leakage.",
        sampleAnswer:
          "Honeycombing occurs when mortar fails to fill voids around coarse aggregate due to improper needle vibration, rebar congestion, or leaking formwork seams. We prevent it by maintaining proper aggregate sizing (max 20mm in congested zones), ensuring adequate workability, using formwork vibrators where internal vibrators cannot penetrate, and sealing shutter joints.",
      },
    ],
  },

  "Chemical & Materials": {
    branchCategory: "Chemical & Materials",
    domainBadge: "Chemical Process, Refineries & Advanced Materials",
    videoId: "dSAPgA9-hQs",
    videoUrl: "https://youtu.be/dSAPgA9-hQs",
    videoTitle: "Chemical Engineer Interview Questions and Answers | How To Pass The Interview",
    channel: "CareerGuide",
    videoDescription:
      "Core chemical process engineering interview preparation on unit operations, heat exchangers, distillation, and process safety management.",
    rounds: [
      {
        roundNumber: "Round 1",
        title: "Chemical Process Fundamentals Assessment",
        duration: "60 Minutes",
        format: "Technical Assessment",
        description:
          "Evaluates mass and energy balances, thermodynamic equations of state, reaction kinetics, and fluid mechanics.",
        keyTopics: [
          "Steady-state material balance with and without reaction",
          "McCabe-Thiele method for distillation column design",
          "Heat exchanger LMTD & overall heat transfer coefficient (U)",
          "Centrifugal pump characteristics and NPSH requirements",
        ],
      },
      {
        roundNumber: "Round 2",
        title: "Process Simulation & P&ID Defense",
        duration: "45 Minutes",
        format: "Plant Technical Panel",
        description:
          "Detailed discussion of Aspen Plus / HYSYS simulations, Piping and Instrumentation Diagrams (P&ID), and valve sizing.",
        keyTopics: [
          "P&ID symbology: control loops, interlocks, fail-safe modes",
          "Distillation column reflux ratio & flooding dynamics",
          "Batch vs CSTR reactor selection and residence time",
          "Corrosion mechanisms and industrial materials selection",
        ],
      },
      {
        roundNumber: "Round 3",
        title: "HAZOP Safety & Refinery Operations",
        duration: "30 Minutes",
        format: "Plant Operations & HR Panel",
        description:
          "Evaluates process safety management (PSM), HAZOP guidewords, volatile chemical handling, and team communication in plant environments.",
        keyTopics: [
          "HAZOP analysis: Guidewords (More, Less, None, Reverse)",
          "Pressure relief valve (PRV) and rupture disc sizing",
          "Personal protective equipment for corrosive environments",
          "Environmental emissions and effluent treatment (ETP)",
        ],
      },
    ],
    sampleQuestions: [
      {
        question: "What is cavitation in centrifugal pumps, and how do you ensure NPSH available exceeds NPSH required?",
        guidance: "Explain vapor pressure, bubble collapse, impeller pitting, and installation height.",
        sampleAnswer:
          "Cavitation happens when static pressure at the pump suction eye falls below the vapor pressure of the liquid, causing vapor cavities to form. As bubbles enter high-pressure impeller regions, they implode with shockwaves that pit metal surfaces. We prevent it by ensuring NPSHA > NPSHR + 0.5m margin—achieved by elevating the feed tank, minimizing suction pipe friction, and operating at cooler fluid temperatures.",
      },
    ],
  },

  "Commerce, Finance & Management": {
    branchCategory: "Commerce, Finance & Management",
    domainBadge: "Corporate Banking, Financial Modeling & Accounting",
    videoId: "w6cAbsfT3tc",
    videoUrl: "https://youtu.be/w6cAbsfT3tc",
    videoTitle: "Top 25 Finance Interview Questions And Answers | Finance Interview Prep",
    channel: "Top Interviews",
    videoDescription:
      "In-depth guide covering 3-statement financial models, corporate valuation, working capital analysis, and financial modeling best practices.",
    rounds: [
      {
        roundNumber: "Round 1",
        title: "Accounting & Numerical Agility Assessment",
        duration: "60 Minutes",
        format: "Online Quantitative Test",
        description:
          "Tests double-entry accounting, ratio analysis (Current ratio, Debt-to-Equity, ROE), GST fundamentals, and dynamic Excel spreadsheet proficiency.",
        keyTopics: [
          "Three financial statements linkage (P&L, Balance Sheet, Cash Flow)",
          "Working capital management & cash conversion cycle",
          "Advanced Excel: XLOOKUP, INDEX-MATCH, Pivot Tables",
          "Retail banking products & credit risk evaluation",
        ],
      },
      {
        roundNumber: "Round 2",
        title: "Financial Analysis & Valuation Case Study",
        duration: "45 Minutes",
        format: "Finance Technical Panel",
        description:
          "Walkthrough of an empirical financial statement case, Non-Performing Asset (NPA) classification, and Discounted Cash Flow (DCF) concepts.",
        keyTopics: [
          "DCF valuation: Free Cash Flow, WACC, terminal value",
          "Gross NPA vs Net NPA in commercial banking",
          "Capital Adequacy Ratio (CAR) & RBI regulatory norms",
          "Financial variance analysis & budget forecasting",
        ],
      },
      {
        roundNumber: "Round 3",
        title: "Client Advisory & Corporate Ethics",
        duration: "30 Minutes",
        format: "Banking Manager & HR Interview",
        description:
          "Assesses ethical integrity, client relationship management, anti-money laundering (AML/KYC) compliance, and communication clarity.",
        keyTopics: [
          "KYC norms and Anti-Money Laundering (AML) red flags",
          "Handling high-net-worth client financial queries",
          "Professional presentation of financial data dashboards",
          "Alignment with PM Internship corporate banking goals",
        ],
      },
    ],
    sampleQuestions: [
      {
        question: "Walk us through how a ₹100 increase in depreciation impacts the three financial statements.",
        guidance: "Assume 25% tax rate. Step through Income Statement, Cash Flow, and Balance Sheet.",
        sampleAnswer:
          "1. Income Statement: Operating income drops by ₹100. At a 25% tax rate, tax drops by ₹25, so Net Income decreases by ₹75. 2. Cash Flow Statement: Net income starts at -₹75, but since depreciation is non-cash, we add back ₹100 in operating cash flow, resulting in net cash flow increasing by ₹25. 3. Balance Sheet: Cash increases by ₹25, PP&E decreases by ₹100 (net assets down ₹75). On the liabilities/equity side, retained earnings decrease by ₹75, balancing both sides perfectly.",
      },
    ],
  },

  "Biotechnology & Healthcare": {
    branchCategory: "Biotechnology & Healthcare",
    domainBadge: "Pharmaceutical QC/QA, Clinical Research & Bioprocessing",
    videoId: "WL5Kqao_eWM",
    videoUrl: "https://youtu.be/WL5Kqao_eWM",
    videoTitle: "QC Interview Questions Part 2 | Pharma Quality Control Interview Questions",
    channel: "Pharmaguideline",
    videoDescription:
      "Practical pharmaceutical quality control and analytical chemistry interview questions on HPLC, OOS/OOT investigations, and GMP compliance.",
    rounds: [
      {
        roundNumber: "Round 1",
        title: "Pharmacology & Analytical Fundamentals Test",
        duration: "60 Minutes",
        format: "Technical Assessment",
        description:
          "Assesses drug formulation basics, spectrometry calculations, pH and buffer equilibria, microbiology sterility, and dosage forms.",
        keyTopics: [
          "Beer-Lambert law & UV-Vis spectrophotometer calibration",
          "Solid dosage formulation (granulation, compression, dissolution)",
          "Pharmacopoeia standards (IP, BP, USP compliance)",
          "Sterilization techniques & cleanroom air classifications",
        ],
      },
      {
        roundNumber: "Round 2",
        title: "Analytical Instrumentation & Lab SOP Defense",
        duration: "45 Minutes",
        format: "Quality Control & R&D Panel",
        description:
          "Hands-on discussion of High-Performance Liquid Chromatography (HPLC), system suitability parameters, and standard laboratory operating procedures.",
        keyTopics: [
          "HPLC column types (C18, C8), mobile phase degassing, retention time",
          "Dissolution testing apparatus (Type I Basket & Type II Paddle)",
          "Out of Specification (OOS) and Out of Trend (OOT) investigations",
          "Calibration vs. qualification (IQ, OQ, PQ) of laboratory instruments",
        ],
      },
      {
        roundNumber: "Round 3",
        title: "Data Integrity & GMP Regulatory Round",
        duration: "30 Minutes",
        format: "QA Compliance & HR Round",
        description:
          "Verifies adherence to Good Manufacturing Practices (GMP), 21 CFR Part 11 audit trails, ALCOA+ principles, and hygiene standards.",
        keyTopics: [
          "ALCOA+ data integrity principles in pharma documentation",
          "Electronic audit trail review in chromatography software",
          "Cleanroom hygiene and gowning protocols",
          "Commitment to patient safety and quality culture",
        ],
      },
    ],
    sampleQuestions: [
      {
        question: "What is an Out of Specification (OOS) result, and what is the protocol for a Phase 1 laboratory investigation?",
        guidance: "Emphasize immediate notification, checking analytical error before touching product.",
        sampleAnswer:
          "An OOS result occurs when an analytical test value falls outside established specification limits. Phase 1 focuses exclusively on identifying or ruling out laboratory error: verifying sample preparation, checking glassware calibration, confirming HPLC mobile phase and instrument system suitability, and interviewing the testing chemist before any retesting is authorized.",
      },
    ],
  },

  "Mining & Metallurgy": {
    branchCategory: "Mining & Metallurgy",
    domainBadge: "Mining Operations, Mineral Extraction & Metallurgical Systems",
    videoId: "2d_fX7CbC_A",
    videoUrl: "https://youtu.be/2d_fX7CbC_A",
    videoTitle: "Mining Engineering Interview Questions and Answers",
    channel: "Finconvo Animation",
    videoDescription:
      "Animation-driven technical breakdown of open-pit mine planning, blast design, underground ventilation, and metallurgical quality testing.",
    rounds: [
      {
        roundNumber: "Round 1",
        title: "Mineral Processing & Metallurgy Assessment",
        duration: "60 Minutes",
        format: "Technical Assessment",
        description:
          "Tests rock mechanics fundamentals, blast furnace thermochemistry, ore dressing principles, and mechanical testing standards.",
        keyTopics: [
          "Iron-Carbon phase diagram & heat treatment (Annealing, Quenching)",
          "Crushing, grinding, froth flotation mineral separation",
          "Rock Mass Rating (RMR) and slope stability fundamentals",
          "Tensile, Brinell hardness, and Charpy impact testing",
        ],
      },
      {
        roundNumber: "Round 2",
        title: "Plant Operations & Blast Design Defense",
        duration: "45 Minutes",
        format: "Operations & Metallurgy Panel",
        description:
          "Covers blast design calculations (burden, spacing), blast furnace slag analysis, and metallurgical failure analysis.",
        keyTopics: [
          "Powder factor calculation & flyrock mitigation in blasting",
          "Steelmaking: Basic Oxygen Furnace (BOF) vs Electric Arc Furnace (EAF)",
          "Underground mine ventilation fan sizing & air quality",
          "Non-destructive testing (Ultrasonic, Dye Penetrant) of castings",
        ],
      },
      {
        roundNumber: "Round 3",
        title: "DGMS Safety Regulations & Operations Round",
        duration: "30 Minutes",
        format: "Mines Manager & HR Interview",
        description:
          "Focuses on Directorate General of Mines Safety (DGMS) statutory regulations, shift leadership, and site environmental compliance.",
        keyTopics: [
          "Mines Act statutory rules and safety management systems",
          "Emergency mine evacuation and gas detection protocols",
          "Resilience in remote mining or heavy industrial plant locations",
          "Communication with heavy machinery operators",
        ],
      },
    ],
    sampleQuestions: [
      {
        question: "Describe how heat treatment alters the microstructure of carbon steel according to the Iron-Carbon phase diagram.",
        guidance: "Contrast austenite formation above A3 line, rapid cooling into martensite, and subsequent tempering for toughness.",
        sampleAnswer:
          "Heating carbon steel into the austenite phase dissolves cementite into FCC solid solution. Rapid water/oil quenching prevents carbon diffusion, trapping carbon in a strained Body-Centered Tetragonal lattice called martensite, which is extremely hard but brittle. Re-heating to a sub-critical temperature (tempering) precipitates fine carbides, relieving internal stress and yielding optimal strength and impact toughness.",
      },
    ],
  },

  "Agriculture & Life Sciences": {
    branchCategory: "Agriculture & Life Sciences",
    domainBadge: "Agronomy, Precision Agri-Tech & Field Extension",
    videoId: "b7D3iDEhsNs",
    videoUrl: "https://youtu.be/b7D3iDEhsNs",
    videoTitle: "Agriculture Officer Interview Questions & Answers | Technical & Field Prep",
    channel: "PD Classes",
    videoDescription:
      "Professional interview guidance for agriculture and life science graduates covering crop agronomy, soil chemistry, IPM pest management, and rural extension.",
    rounds: [
      {
        roundNumber: "Round 1",
        title: "Agronomy & Crop Science Assessment",
        duration: "60 Minutes",
        format: "Technical Assessment",
        description:
          "Assesses crop classification, soil nutrient dynamics (NPK ratios), seed germination testing, and weed management.",
        keyTopics: [
          "Essential macro & micronutrients for Kharif and Rabi crops",
          "Soil texture, cation exchange capacity (CEC), and pH correction",
          "Drip & sprinkler irrigation design and water use efficiency",
          "Hybrid seed production and germination vigor testing",
        ],
      },
      {
        roundNumber: "Round 2",
        title: "Field Trials & Agri-Business Case Defense",
        duration: "45 Minutes",
        format: "Agri-Tech Technical Panel",
        description:
          "In-depth discussion on Integrated Pest Management (IPM), precision agriculture sensors, and structured field trial documentation.",
        keyTopics: [
          "Economic Threshold Level (ETL) and bio-pesticide application",
          "Replicated field trial protocols & statistical variance logging",
          "Post-harvest storage, grain moisture testing, and cold chains",
          "Soil moisture telemetry and fertigation scheduling",
        ],
      },
      {
        roundNumber: "Round 3",
        title: "Farmer Extension & Rural Engagement Round",
        duration: "30 Minutes",
        format: "Field Operations & HR Panel",
        description:
          "Evaluates candidate empathy for rural communities, local language communication, and PM Internship agriculture program objectives.",
        keyTopics: [
          "Communicating modern agronomy practices to smallholder farmers",
          "Government schemes awareness (PM-KISAN, Soil Health Card)",
          "Field survey data collection using mobile digital tools",
          "Teamwork across diverse agro-climatic zones",
        ],
      },
    ],
    sampleQuestions: [
      {
        question: "What is Integrated Pest Management (IPM), and why is relying solely on chemical pesticides discouraged?",
        guidance: "Highlight pest resistance, predator balance, Economic Injury Level (EIL), and multi-tier controls.",
        sampleAnswer:
          "IPM is a balanced ecosystem approach combining cultural (crop rotation), mechanical (pheromone traps), biological (beneficial predators like Trichogramma), and chemical methods only as a last resort when pest population crosses the Economic Threshold Level (ETL). Relying solely on chemical sprays causes chemical resistance, destroys beneficial pollinators, and increases soil toxicity.",
      },
    ],
  },
};
