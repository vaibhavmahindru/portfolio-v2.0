/**
 * ─── CENTRAL PROFILE CONFIGURATION ───
 *
 * This is the SINGLE SOURCE OF TRUTH for all personal data displayed
 * across the portfolio. To update any information, edit this file only.
 *
 * Sections:
 *   A. Identity & Bio
 *   B. Links
 *   C. Contact
 *   D. Experience / Career Timeline
 *   E. Hero Section Config (morph words, tech pills, status card)
 *   F. Capabilities / Skills Grid
 *   G. Resume Credential Metrics
 *   H. Live Status Strip (Activity & Network section)
 *   I. AI-Readable Skills (sr-only block)
 *   J. Terminal Commands (stack, status)
 *   K. Meta Tags
 */

// ─── A. Identity & Bio ───────────────────────────────────────────────────────

export const profile = {
  name: "Vaibhav Mahindru",
  title: "Software Developer (Backend) + Data Engineer",
  photo: "/passport.png",
  altPhoto: "/alt-photo.png", // magnifying glass hover alternate
  location: "New Delhi, India",
  tagline: "Backend · Data Engineering · Automation",
  bio: "Backend-focused software developer and startup founder building scalable APIs, automated data pipelines, and cloud-native systems. I specialize in backend architecture, data engineering, and intelligent automation. Oh, and I do frontend too this portfolio didn't mass produce itself.",
  resumeBio:
    "Software Developer specializing in backend engineering and data systems design with 3+ years of hands-on experience building production APIs, automation pipelines, data ingestion systems, and cloud-native platforms. Founder of MoveAI, a logistics SaaS platform with 57+ REST endpoints, 65+ PostgreSQL models, and 9+ scheduled batch pipelines. Previously worked on enterprise DataOps at AIS (Azure migration, ETL pipelines, Power BI dashboards), backend engineering at Satyacom (Node.js APIs, schema design, background job processors), and data-focused systems strategy at Plaksha University (Python ETL, Power Automate, reporting automation). Also designs and delivers production websites using React, Tailwind CSS, and Framer Motion. Strong experience in Node.js, Python, PostgreSQL, AWS, and system design. Passionate about building reliable, scalable systems that transform real-world data into structured, actionable insights.",
  status: "Open to backend and data engineering opportunities",
  version: "5.0",

  // ─── B. Links ────────────────────────────────────────────────────────────────

  links: {
    github: "https://github.com/vaibhavmahindru",
    linkedin: "https://www.linkedin.com/in/vaibhav-mahindru-845604175/",
    email: "vaibhavmahindru04@gmail.com",
    resume: "https://drive.google.com/file/d/1X6AB9_PW9p_mVpa1feOr_nnXIKkjE-_J/view?usp=sharing", // TODO: Replace with hosted resume PDF URL or drop file in /public/
    resumeOnline: "https://drive.google.com/file/d/1X6AB9_PW9p_mVpa1feOr_nnXIKkjE-_J/view?usp=sharing", // TODO: Replace with online resume URL (read.cv, etc.)
  },

  // ─── C. Contact ──────────────────────────────────────────────────────────────

  contact: {
    email: "vaibhavmahindru04@gmail.com",
    formAction: "https://script.google.com/macros/s/AKfycby7mCzrzccOqjbjgn0WEeAHiHauG8OPWCBWumlgW9Z_RMlOxT4RoEg80ue4fB8Y7i_F/exec", // TODO: Replace with your deployed Apps Script URL
  },

  // ─── D. Experience / Career Timeline ─────────────────────────────────────────

  experience: [
    {
      version: "1.0",
      title: "Computer Science Student & Systems Builder",
      period: "2018 – 2022",
      subtitle: "New Delhi, India",
      description:
        "Built strong theoretical and practical foundations in Computer Science while independently developing backend systems and automation tools. Studied Data Structures, Algorithms, DBMS, Operating Systems, and Computer Networks. Designed REST APIs using Node.js/Express, built Python automation scripts for structured data processing, and designed normalized relational schemas in PostgreSQL/MySQL. Learned Linux systems, shell scripting, and deployment basics. Focused on writing production-style backend code — developing early intuition for modular architecture, data flow design, query optimization, and system reliability principles.",
    },
    {
      version: "2.0",
      title: "Software Developer",
      period: "2022 – 2023",
      subtitle: "AIS — Software Developer (DataOps)",
      description:
        "Worked on enterprise-scale data ingestion, cloud migration, and analytics transformation pipelines. Developed enterprise data ingestion and transformation pipelines with SQL-based transformation layers for analytics workloads. Built structured data models for reporting and conducted anomaly detection and trend analysis on operational data. Migrated on-prem systems to Microsoft Azure, provisioned cloud resources, and implemented monitoring automation to improve SLA adherence. Built Power BI dashboards for operational insights and automated reporting flows for business teams.",
    },
    {
      version: "3.0",
      title: "Software Developer",
      period: "2023 – 2024",
      subtitle: "Satyacom — Backend Engineering",
      description:
        "Worked as a backend developer building scalable services and database-driven systems. Built RESTful APIs using Node.js and Express, designed relational database schemas for structured data storage, and implemented authentication and authorization logic. Developed reporting modules, data export functionalities, and background job processors for asynchronous tasks. Structured modular service layers for maintainability. Focus: backend reliability, schema design, and service-layer architecture.",
    },
    {
      version: "4.0",
      title: "IT Business Analyst (Data-Focused)",
      period: "2024 – 2025",
      subtitle: "Plaksha University",
      description:
        "Worked at the intersection of business requirements and data engineering. Led requirements gathering for system enhancements, translating business needs into technical data models and workflows. Designed SQL transformation layers for operational reporting, built Python ETL scripts for multi-source data ingestion, and implemented validation, normalization, and reconciliation logic — automating reporting workflows and reducing manual effort by ~60%. Built dynamic Power BI dashboards and integrated PowerApps with Power Automate for workflow automation.",
    },
    {
      version: "5.0",
      title: "Founder / Backend & Data Platform Architect",
      period: "2024 – Present",
      subtitle: "MoveAI — New Delhi, India",
      description:
        "Designed and built MoveAI as a production-grade logistics SaaS platform handling telemetry ingestion, financial settlements, reporting systems, and AI-driven analytics. Architected modular backend with 57+ production REST endpoints using Node.js/Express. Designed 65+ PostgreSQL models covering fleet management, vehicle lifecycle, driver assignments, trip records, telemetry events, alert systems, financial settlements, and reporting. Built ingestion pipelines integrating GPS telemetry APIs with idempotent processing, retry mechanisms, and 9+ scheduled batch pipelines. Built VaYu — an AI analytics assistant using Google Gemini API with dynamic SQL generation, schema-aware prompts, and safe query execution. Deployed on AWS (EC2, RDS, S3).",
    },
  ],

  // ─── E. Hero Section Config ──────────────────────────────────────────────────

  hero: {
    /** Label shown at the top of the identity card */
    controlPanelLabel: "Systems Active",
    /** Small live indicator text below CTAs */
    currentBuild:
      "Currently building backend intelligence systems for fleet analytics",
    /** Words that auto-cycle in "I BUILD {X} THAT SCALE." */
    morphWords: [
      "SYSTEMS",
      "APIs",
      "PIPELINES",
      "AUTOMATION",
      "DATA PLATFORMS",
      "WEBSITES",
    ],
    /** Tech badges shown in the tech pills card */
    techPills: [
      "JavaScript",
      "Python",
      "SQL",
      "Node.js",
      "Express",
      "PostgreSQL",
      "MySQL",
      "React",
      "AWS",
      "Azure",
      "Docker",
      "GitHub Actions",
      "Linux",
      "Power BI",
      "REST APIs",
      "Gemini API",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Git",
      "Postman",
      "Redis",
      "Kafka",
      "MongoDB",
      "Framer Motion",
      "Pandas",
      "Figma",
    ],
  },

  // ─── E.2 Status Card (hero bento) ───────────────────────────────────────────

  statusCard: {
    cloudProviders: "AWS · Azure",
    /** Set to null to hide the compliance row. Example: "SOC2 · ISO 27001" */
    compliance: null as string | null,
    uptime: "99.9%",
    experienceYears: "3+ yrs",
    responseTime: "< 24h",
    stackLabel: "Backend + Data Engineering",
  },

  // ─── F. Capabilities / Skills Grid ───────────────────────────────────────────

  capabilities: [
    {
      module: "Backend Architecture",
      status: "ACTIVE" as const,
      description:
        "Designed and built the entire MoveAI backend — 57+ production REST endpoints, layered service architecture with multi-tenant fleet operations, background workers for async tasks, and modular service layers built for long-term maintainability.",
      tools: [
        "Node.js",
        "Express",
        "REST APIs",
        "JWT",
        "RBAC",
        "Background Workers",
        "Multi-Tenant",
        "WebSockets",
        "GraphQL",
        "Middleware Design",
        "Rate Limiting",
        "API Versioning",
        "Webhook Handlers",
        "OAuth 2.0",
        "Git",
        "Postman",
      ],
      details: [
        "57+ production-grade REST endpoints",
        "Layered architecture: routes → controllers → services → models",
        "Multi-tenant backend supporting independent fleet operations",
        "JWT authentication with role-based access control",
        "Background workers for async processing and notifications",
        "Third-party API integration: GPS telemetry, WhatsApp Business",
      ],
    },
    {
      module: "Data & Database Engineering",
      status: "ACTIVE" as const,
      description:
        "Built 9+ scheduled batch pipelines handling GPS telemetry ingestion, trip settlement computation, financial reconciliation, alert aggregation, and reporting materialization. Designed 65+ PostgreSQL models covering fleet management, vehicle lifecycle, telemetry events, financial settlements, and reporting. Composite indexing and query restructuring reduced reporting latency by ~80%.",
      tools: [
        "PostgreSQL",
        "Python",
        "ETL Pipelines",
        "Pandas",
        "Power BI",
        "Schema Design",
        "Query Optimization",
        "Batch Processing",
        "Data Validation",
        "Redis",
        "Apache Airflow",
        "Apache Spark",
        "Apache Kafka",
        "MongoDB",
        "Data Warehousing & Modeling",
      ],
      details: [
        "65+ PostgreSQL schema models across fleet, telemetry, and finance",
        "9+ scheduled batch pipelines (settlements, reconciliation, backfill)",
        "High-frequency GPS telemetry ingestion from Intangles API",
        "Composite indexing strategies — ~80% reporting latency reduction",
        "Data validation, normalization, deduplication at ingestion",
        "Pre-aggregation tables for materialized reporting pipelines",
        "Enterprise ETL at AIS: on-prem → Azure migration",
        "Power BI dashboards for operational analytics at Plaksha & AIS",
      ],
    },
    {
      module: "Cloud & DevOps",
      status: "ACTIVE" as const,
      description:
        "Production deployments on AWS (EC2, RDS, S3) for MoveAI, Azure cloud migration and provisioning at AIS, CI/CD via GitHub Actions, Docker containerization, and Linux server administration.",
      tools: [
        "AWS (EC2, RDS, S3)",
        "Azure",
        "Docker",
        "GitHub Actions",
        "Linux",
        "CI/CD",
        "Nginx",
        "PM2",
        "CloudWatch",
        "Shell Scripting",
        "Docker Compose",
        "SSL/TLS",
        "DNS Management",
      ],
      details: [
        "AWS EC2 for backend services, RDS for managed PostgreSQL, S3 for storage",
        "Azure cloud migration and resource provisioning at AIS",
        "Monitoring automation to improve SLA adherence",
        "GitHub Actions for CI/CD pipelines and deployment automation",
        "Docker containerization for consistent environments",
        "Linux server configuration, shell scripting, cron scheduling",
      ],
    },
    {
      module: "Automation & Scheduling",
      status: "ACTIVE" as const,
      description:
        "Cron-scheduled pipelines running daily at 8 AM for GPS alert processing, vehicle-to-driver mapping, and metrics aggregation. Compiled alert reports delivered to drivers via WhatsApp Business API. Power Automate workflows at Plaksha reduced manual reporting effort by ~60%.",
      tools: [
        "Cron Jobs",
        "Python Scripts",
        "WhatsApp API",
        "Power Automate",
        "Retry Logic",
        "Selenium",
        "Web Scraping",
        "Twilio",
        "Email Automation",
        "Slack Bots",
        "PowerApps",
        "Zapier",
        "n8n",
        "Make.com",
        "Appscript",
      ],
      details: [
        "Daily 8 AM cron: GPS fetch → alert processing → driver mapping → DB",
        "WhatsApp Business API: compiled alert reports sent to drivers",
        "Power Automate workflows reduced manual effort by ~60% at Plaksha",
        "Retry logic and failure recovery for unstable third-party APIs",
        "Idempotent execution to prevent duplicate processing on reruns",
        "PowerApps + Power Automate integration for workflow automation",
      ],
    },
    {
      module: "AI / LLM Integration",
      status: "ACTIVE" as const,
      description:
        "Built VaYu — an AI analytics assistant inside MoveAI that lets non-technical users query production logistics data using natural language. Integrates Google Gemini API with schema-aware prompt templates, dynamic SQL generation, validation guardrails, and safe query execution. Also built a standalone AI Data Analyst app with multi-model support (Gemini + DeepSeek). Currently exploring AI voice agents and conversational AI systems.",
      tools: [
        "Gemini API",
        "DeepSeek API",
        "OpenAI API",
        "Streamlit",
        "Schema-Aware Prompts",
        "Query Guardrails",
        "LangChain",
        "Text-Based AI Agents",
        "AI Voice Agents",
        "RAG Pipelines",
        "Vector Databases",
        "Prompt Engineering",
        "Hugging Face",
      ],
      details: [
        "VaYu: natural language → schema-aware prompt → Gemini → dynamic SQL",
        "Validation guardrails before every generated query execution",
        "Schema extraction: column types, dataset shape, statistical summaries",
        "AI Data Analyst: CSV/XLSX upload → Pandas preprocessing → LLM insights",
        "Multi-model support: Gemini API + DeepSeek API with abstracted routing",
        "Exploring: AI voice agents, text-based agents, RAG, and function calling",
      ],
    },
    {
      module: "Frontend & Web Design",
      status: "ACTIVE" as const,
      description:
        "Designed and delivered 4+ production websites — from corporate platforms to this portfolio. Built with React, Tailwind CSS, Framer Motion, and GSAP. Mobile-first responsive design, performance optimization, SEO, and full lifecycle delivery from design to deployment.",
      tools: [
        "React",
        "Next.js",
        "Tailwind CSS",
        "TypeScript",
        "Framer Motion",
        "GSAP",
        "HTML/CSS",
        "Vite",
        "Responsive Design",
        "Figma",
        "Netlify",
        "Vercel",
        "SEO Optimization",
      ],
      details: [
        "4+ production websites delivered end-to-end",
        "Portfolio built with React + Tailwind CSS + Framer Motion + GSAP",
        "Mobile-first responsive design with scroll-snap patterns",
        "Performance optimization: code splitting, lazy loading, image optimization",
        "Full lifecycle: design → implementation → hosting → domain & DNS",
        "SEO optimization, meta tags, Open Graph, and accessibility",
      ],
    },
  ],

  // ─── G. Resume Credential Metrics ────────────────────────────────────────────

  resumeMetrics: [
    // { label: "Experience", value: "3+ Years" },
    // { label: "Primary Stack", value: "Backend + Data Engineering" },
    // { label: "Projects Delivered", value: "8+ Production Systems" },
  ],

  // ─── H. Live Status Strip ────────────────────────────────────────────────────

  liveStatus: [
    {
      label: "UPTIME",
      value: "99.99%",
      color: "text-terminal-green",
      border: "border-terminal-green/20",
      bg: "bg-terminal-green/5",
    },
    {
      label: "SECURITY",
      value: "JWT + RBAC",
      color: "text-cyan-400",
      border: "border-cyan-400/20",
      bg: "bg-cyan-400/5",
    },
    {
      label: "MONITORING",
      value: "Active",
      color: "text-amber-400",
      border: "border-amber-400/20",
      bg: "bg-amber-400/5",
    },
    {
      label: "DEPLOYMENTS",
      value: "GitHub Actions",
      color: "text-violet-400",
      border: "border-violet-400/20",
      bg: "bg-violet-400/5",
    },
    {
      label: "CURRENT BUILD",
      value: "MoveAI SaaS",
      color: "text-primary",
      border: "border-primary/20",
      bg: "bg-primary/5",
    },
    {
      label: "FOCUS MODE",
      value: "ENABLED",
      color: "text-rose-400",
      border: "border-rose-400/20",
      bg: "bg-rose-400/5",
    },
  ],

  // ─── I. AI-Readable Skills (sr-only) ────────────────────────────────────────

  skills: {
    languages: "JavaScript, TypeScript, Python, SQL",
    cloud: "AWS (EC2, RDS, S3), Microsoft Azure",
    databases: "PostgreSQL, MySQL, MongoDB, Redis",
    frontend: "React, Next.js, Tailwind CSS, TypeScript, Framer Motion, GSAP, Figma, Responsive Design, HTML, CSS",
    devops: "Git, Docker, GitHub Actions, Linux, Postman",
    security: "JWT, RBAC, Authentication & Authorization",
    dataEngineering:
      "ETL Pipelines, Data Ingestion, Batch Processing, Power BI, Apache Airflow, Apache Spark, Apache Kafka, Data Warehousing",
    ai: "Google Gemini API, DeepSeek API, Dynamic SQL Generation, Hugging Face",
    architecture:
      "REST API Design, ETL Pipelines, Modular Backend Design, Multi-tenant Systems",
  },

  // ─── J. Terminal Command Data ────────────────────────────────────────────────

  terminalStack: {
    Languages: "JavaScript, TypeScript, Python, SQL",
    Backend: "Node.js, Express, REST APIs, JWT, RBAC",
    Frontend: "React, Next.js, Tailwind CSS, Framer Motion, GSAP, Figma",
    Data: "PostgreSQL, MySQL, MongoDB, Redis, ETL Pipelines, Airflow, Spark, Kafka, Power BI",
    Cloud: "AWS (EC2, RDS, S3), Azure, Docker, Linux",
    DevOps: "Git, GitHub Actions, Postman, Cron, Shell",
    "AI/LLM": "Gemini API, DeepSeek API, Hugging Face, Dynamic SQL Generation",
  },

  systemJson: {
    runtime: "Active",
    primary_function: "Backend & Data Engineering",
    cloud_integration: "AWS + Azure",
    automation_level: "High",
    status: "Open to backend and data engineering opportunities",
    location: "New Delhi, India",
    uptime: "99.9%",
  },

  // ─── K. Meta Tags ───────────────────────────────────────────────────────────

  meta: {
    pageTitle: "Vaibhav Mahindru | Backend & Data Engineer",
    description:
      "Backend-focused software developer and data engineer building scalable APIs, automation pipelines, and cloud-based data systems.",
  },
} as const;
