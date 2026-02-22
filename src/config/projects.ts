/**
 * ─── PROJECT / DEPLOYMENT DATA ───
 *
 * Each entry drives both the card on the homepage AND the dedicated case-study page.
 * To add a project: copy an existing entry, change the slug, and fill in your data.
 * To remove a project: delete the entry from the array.
 */

export interface Project {
  slug: string;
  name: string;
  status: "PRODUCTION" | "ACTIVE" | "EXPERIMENTAL";
  latency: string;
  scale: string;
  role: string;
  tagline: string;
  problem: string;
  approach: string;
  architecture: string;
  results: string;
  learnings: string;
  stack: string[];
  flow: string[];
  sourceUrl?: string;
  liveUrl?: string;
  liveUrls?: { label: string; url: string }[];
  metrics: { label: string; value: string }[];
}

export const projects: Project[] = [
  // ─── 1. MoveAI ──────────────────────────────────────────────────────────────
  {
    slug: "moveai",
    name: "MoveAI — Logistics SaaS Platform",
    status: "ACTIVE",
    latency: "~50ms",
    scale: "Multi-tenant",
    role: "Founder & Backend Architect",
    tagline:
      "Production-grade logistics SaaS handling telemetry ingestion, financial settlements, reporting, and AI-driven analytics.",
    problem:
      "Fleet operations required a unified platform to handle telemetry data ingestion from multiple GPS providers, per-driver financial settlements, automated reporting, and intelligent analytics — none of the existing tools integrated these workflows end-to-end.",
    approach:
      "Designed and built MoveAI as a full production backend with 57+ REST endpoints, 65+ PostgreSQL models, 9+ scheduled batch pipelines, and VaYu — an AI analytics assistant powered by Google Gemini with dynamic SQL generation and schema-aware prompts. Implemented idempotent ingestion logic, retry mechanisms for unstable third-party APIs, and composite indexing strategies that reduced reporting latency by ~80%.",
    architecture:
      "Node.js/Express Backend (57+ endpoints) → PostgreSQL (65+ models, composite indexes) → GPS Telemetry Ingestion (Intangles API) → 9+ Batch Pipelines (settlements, reconciliation, alerts, backfill) → VaYu AI Assistant (Gemini API, dynamic SQL) → AWS (EC2, RDS, S3).",
    results:
      "Production-grade platform processing high-frequency telemetry streams with automated trip settlement calculations, financial reconciliation, alert aggregation, and reporting materialization. Reduced reporting latency by ~80% via query restructuring and pre-aggregation. Zero-duplication ingestion via idempotent processing.",
    learnings:
      "Building a SaaS platform solo teaches you every tradeoff that exists. Schema design decisions made on day one compound over months. Idempotent processing and retry logic aren't optional — they're foundational. AI-driven SQL generation needs strict guardrails to prevent malformed queries.",
    stack: ["Node.js", "Express", "PostgreSQL", "Python", "AWS (EC2, RDS, S3)", "Gemini API", "REST APIs", "Cron", "JWT", "RBAC", "Docker", "React", "Tailwind CSS", "Framer Motion"],
    flow: [
      "GPS APIs",
      "Ingestion Pipeline",
      "Normalization",
      "Processing Engine",
      "PostgreSQL (65+ models)",
      "Settlement Engine",
      "VaYu AI",
      "AWS (EC2/RDS/S3)",
    ],
    // sourceUrl: undefined — private repo
    liveUrl: "https://moveai.in",
    metrics: [
      { label: "Endpoints", value: "57+" },
      { label: "DB Models", value: "65+" },
      { label: "Batch Pipelines", value: "9+" },
      { label: "Latency Reduction", value: "~80%" },
    ],
  },

  // ─── 2. GPS Driver Analytics ────────────────────────────────────────────────
  {
    slug: "gps-driver-analytics",
    name: "GPS Driver Analytics Automation",
    status: "PRODUCTION",
    latency: "~30ms",
    scale: "Fleet-level",
    role: "Backend & Automation Developer",
    tagline:
      "Automated daily GPS data processing, driver-level alert analytics, and WhatsApp alert delivery.",
    problem:
      "Manual driver alert analysis from GPS data was time-consuming and error-prone, requiring significant daily effort from the operations team. Drivers had no direct visibility into their own alert data.",
    approach:
      "Built a Python automation script running on a daily cron schedule (8 AM). It fetches previous-day GPS and alert data via REST APIs, processes alerts per vehicle, dynamically maps vehicles to drivers, aggregates driver-level metrics, stores structured results in PostgreSQL, and sends compiled alert reports to respective drivers via the WhatsApp Business API.",
    architecture:
      "Cron Scheduler (8 AM daily) → REST API Fetch (GPS + Alerts) → Per-Vehicle Alert Processing → Dynamic Vehicle-to-Driver Mapping → Metrics Aggregation → PostgreSQL Storage → WhatsApp API (compiled alerts to drivers).",
    results:
      "Reduced manual reporting effort significantly. Automated daily processing with zero manual intervention. Structured driver-level metrics available every morning before the team starts work. Drivers receive compiled alert reports directly on WhatsApp, closing the feedback loop without any manual dispatch.",
    learnings:
      "Scheduled automation is only as reliable as its error handling. Built comprehensive retry logic and logging to handle API timeouts and data inconsistencies without silent failures. WhatsApp API integration requires careful message templating and rate limit handling.",
    stack: ["Python", "REST APIs", "PostgreSQL", "Cron", "WhatsApp Business API", "Pandas", "Linux", "Shell Scripting"],
    flow: [
      "Cron (8 AM)",
      "GPS API Fetch",
      "Alert Processing",
      "Driver Mapping",
      "Aggregation",
      "PostgreSQL",
      "WhatsApp Delivery",
    ],
    metrics: [
      { label: "Schedule", value: "Daily 8 AM" },
      { label: "Processing", value: "Per-vehicle" },
      { label: "Mapping", value: "Vehicle → Driver" },
      { label: "Delivery", value: "WhatsApp API" },
    ],
  },

  // ─── 3. VaYu — AI Analytics Assistant ─────────────────────────────────────
  {
    slug: "vayu-ai-assistant",
    name: "VaYu — AI Analytics Assistant",
    status: "ACTIVE",
    latency: "~2s",
    scale: "Production",
    role: "Full-Stack Developer",
    tagline:
      "AI-powered analytics assistant with dynamic SQL generation and schema-aware prompts.",
    problem:
      "Non-technical fleet operators needed to query complex logistics data (trips, settlements, telemetry) without SQL knowledge, while ensuring query safety and data accuracy.",
    approach:
      "Built VaYu as part of MoveAI — an AI analytics assistant integrating Google Gemini API with schema-aware prompt templates that dynamically generate SQL queries. Implemented validation guardrails before query execution and built safe execution workflows to prevent malformed or destructive queries.",
    architecture:
      "Natural Language Input → Schema-Aware Prompt Template → Gemini API → Dynamic SQL Generation → Validation Guardrails → Safe Query Execution → Structured Result Output.",
    results:
      "Enabled non-technical users to query production logistics data using plain language. AI-generated SQL is validated before execution, preventing malformed queries. Grounded in actual schema and data, avoiding hallucinated results.",
    learnings:
      "AI-driven SQL generation needs strict guardrails. Schema-aware prompts dramatically improve accuracy over generic prompts. Validation before execution is non-negotiable in production systems.",
    stack: ["Python", "Google Gemini API", "DeepSeek API", "PostgreSQL", "Node.js", "Prompt Engineering", "Dynamic SQL"],
    flow: [
      "Natural Language Query",
      "Schema-Aware Prompt",
      "Gemini API",
      "SQL Generation",
      "Validation",
      "Safe Execution",
      "Structured Output",
    ],
    metrics: [
      { label: "LLM", value: "Gemini API" },
      { label: "Query Gen", value: "Dynamic SQL" },
      { label: "Safety", value: "Guardrails" },
      { label: "Data", value: "Schema-aware" },
    ],
  },

  // ─── 4. EcoFluid Engineering ────────────────────────────────────────────────
  {
    slug: "ecofluid-engineering",
    name: "EcoFluid Engineering",
    status: "PRODUCTION",
    latency: "~200ms",
    scale: "Corporate",
    role: "Full-Stack Developer",
    tagline:
      "Corporate website for an industrial engineering company.",
    problem:
      "The company needed a professional web presence to showcase their industrial engineering services, products, and capabilities to potential clients.",
    approach:
      "Designed and built a responsive corporate website handling the full lifecycle — frontend implementation, asset optimization, hosting, deployment, domain and DNS configuration, and performance tuning.",
    architecture:
      "Static Frontend → Asset Optimization → CDN → Custom Domain (ecofluidengg.com).",
    results:
      "Delivered a production-grade corporate website with optimized load times and clean SEO. Handled complete project lifecycle from design to live deployment.",
    learnings:
      "Corporate sites demand reliability and professionalism above all else. Clean design, fast load times, and straightforward navigation matter more than flashy features.",
    stack: ["HTML", "CSS", "JavaScript", "Responsive Design", "SEO", "Google Analytics", "Netlify"],
    flow: ["Design", "Frontend Build", "Optimization", "Deployment", "DNS Config"],
    liveUrl: "https://ecofluidengg.com/",
    metrics: [
      { label: "Type", value: "Corporate" },
      { label: "Status", value: "Live" },
      { label: "Lifecycle", value: "Full" },
      { label: "Performance", value: "Optimized" },
    ],
  },

  // ─── 5. Client Web Platforms (Rack & Roll + TheraChef) ──────────────────────
  {
    slug: "client-web-platforms",
    name: "Client Web Platforms",
    status: "PRODUCTION",
    latency: "~150ms",
    scale: "Consumer",
    role: "Full-Stack Developer",
    tagline:
      "Production frontend websites for consumer brands — Rack & Roll and TheraChef.",
    problem:
      "Multiple clients needed modern, responsive web platforms — Rack & Roll required a product-focused site to showcase and sell products, while TheraChef needed a content-driven site with clean navigation and engaging presentation. Both required full lifecycle delivery from design through deployment.",
    approach:
      "Designed and built responsive, mobile-first web platforms for each client. Handled the full project lifecycle including frontend implementation, structured information architecture, asset optimization, responsive design, hosting on Netlify, domain and DNS configuration, and performance tuning.",
    architecture:
      "Design → Frontend Build → Asset Optimization → Responsive Layout → Netlify Deployment → CDN.",
    results:
      "Delivered two production-grade websites — both live and serving real users. Rack & Roll drives product engagement with a mobile-first design. TheraChef delivers structured content with clean navigation. Both achieve fast load times via CDN-backed Netlify hosting.",
    learnings:
      "Product pages need to load fast and look great on mobile first — most traffic comes from phones. Content-heavy sites benefit from strong information architecture — structuring content well matters more than visual complexity. Full lifecycle ownership builds reliable delivery instincts.",
    stack: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Responsive Design", "Netlify", "Figma", "SEO"],
    flow: ["Design", "Frontend Build", "Asset Optimization", "Responsive QA", "Netlify Deploy", "DNS Config"],
    liveUrls: [
      { label: "Rack & Roll", url: "https://rackandroll.netlify.app/" },
      { label: "TheraChef", url: "https://spectacular-puppy-11875e.netlify.app/" },
      { label: "ShreeLog", url: "https://shreelog.netlify.app/" },
      { label: "Webinar Page", url: "https://webinar.moveai.in/" },

    ],
    metrics: [
      { label: "Sites Delivered", value: "4" },
      { label: "Status", value: "All Live" },
      { label: "Design", value: "Mobile-first" },
      { label: "Hosting", value: "Netlify CDN" },
    ],
  },

  // ─── 6. AI Data Analyst ───────────────────────────────────────────────────
  {
    slug: "ai-data-analyst",
    name: "AI Data Analyst",
    status: "ACTIVE",
    latency: "~2s",
    scale: "Multi-user",
    role: "Architect & Full-Stack Data Systems Developer",
    tagline:
      "AI-powered data analysis app that turns CSV/XLSX uploads into schema-aware, LLM-generated insights.",
    problem:
      "Non-technical users struggle to extract insights from structured datasets. They lack SQL knowledge, statistical understanding, and BI tooling familiarity. Traditional BI tools require manual configuration, while raw spreadsheets demand domain expertise. There was a need for a lightweight system that could accept structured datasets, understand schema context, generate meaningful summaries, and reduce friction between raw data and decision-making.",
    approach:
      "Built an interactive Streamlit application that accepts CSV/XLSX uploads, parses and inspects dataset schema, performs Pandas-based preprocessing and validation, and integrates with LLM APIs (Gemini / DeepSeek) to generate structured summaries, trends, and insights. Instead of blindly sending raw data, the system extracts column names, infers data types, summarizes dataset shape, and constructs structured prompts referencing actual schema — reducing hallucinations and increasing relevance. Guardrails validate dataset size, limit row exposure to avoid token overflow, and use summarized statistics where possible.",
    architecture:
      "User Upload → File Parser (CSV/XLSX) → Pandas DataFrame Preprocessing → Schema Extraction Layer → Prompt Construction Engine → LLM API (Gemini / DeepSeek) → Response Validation & Formatting → Interactive Insight Display.",
    results:
      "Eliminates manual Excel pivot table workflows. Makes data interpretation accessible to non-technical users. Schema-aware prompt engineering produces contextually accurate AI insights grounded in actual data — not hallucinated summaries. Multi-model support (Gemini / DeepSeek) enables model flexibility and cost optimization.",
    learnings:
      "Raw LLM calls are unreliable — schema awareness is essential. Data must be structured and validated before AI interaction to reduce hallucinations. Summarized statistics are more effective than raw data dumps for prompt engineering. Abstracting API calls across LLM providers enables model switching without code changes.",
    stack: ["Python", "Streamlit", "Pandas", "Gemini API", "DeepSeek API", "Prompt Engineering", "Data Validation"],
    flow: [
      "CSV/XLSX Upload",
      "Pandas Preprocessing",
      "Schema Extraction",
      "Prompt Construction",
      "LLM API",
      "Validation",
      "Insight Display",
    ],
    sourceUrl: "https://github.com/vaibhavmahindru/AIDataAnalyst",
    metrics: [
      { label: "Input", value: "CSV / XLSX" },
      { label: "LLMs", value: "Gemini + DeepSeek" },
      { label: "Prompts", value: "Schema-aware" },
      { label: "Guardrails", value: "Active" },
    ],
  },
];
