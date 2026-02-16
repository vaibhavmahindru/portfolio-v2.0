# Portfolio v5.0

A developer portfolio built as a command-center interface. React + TypeScript + Tailwind CSS, with GSAP scroll animations, a Canvas 2D particle mesh, live GitHub integration, interactive system graph, terminal overlay, and multiple easter eggs.

**Live**: _Deploy to Vercel/Netlify to see it in action._

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion |
| Animations | GSAP (scroll-triggered), Canvas 2D particle mesh |
| Routing | React Router v6 |
| Icons | Lucide React |
| Build | Vite 5, SWC |
| Linting | ESLint 9, TypeScript ESLint |
| Testing | Vitest, Testing Library |

---

## Project Structure

```
src/
  config/
    profile.ts          # Single source of truth for all personal data
    projects.ts         # Deployed projects / case studies
    blog.ts             # Blog posts (currently unused)
  components/
    HeroSection.tsx     # Bento grid hero with magnifying glass, text scramble, GitHub stats
    TopBar.tsx          # Navigation bar with mobile hamburger menu
    SystemOverview.tsx  # Career timeline
    CapabilitiesModule.tsx  # Skills grid with expandable details
    DeployedSystems.tsx # Project cards
    TechStackGraph.tsx  # Force-directed SVG system graph
    GitHubActivity.tsx  # Live GitHub contributions heatmap
    SocialModule.tsx    # Contact links
    ResumeCenter.tsx    # Credentials card
    ContactModule.tsx   # Contact form
    TerminalOverlay.tsx # Interactive terminal with 15+ commands
    EasterEggs.tsx      # Konami code, click counter, idle detector, view source
    ParticleMesh.tsx    # Canvas 2D animated background
    SystemFooter.tsx    # Footer with diagnostics panel
    BootSequence.tsx    # Startup animation
    ScrollAnimations.tsx # GSAP scroll-triggered reveals
  pages/
    Index.tsx           # Main page
    CaseStudy.tsx       # Individual project detail page
    SecretPage.tsx      # Hidden /secret route
    NotFound.tsx        # 404 page
  context/
    ThemeContext.tsx     # Dark theme provider
  hooks/
    useGsapReveal.ts    # GSAP scroll animation hook
public/
  passport.png          # Default profile photo
  alt-photo.png         # Magnifying glass hover photo
  portfolio.mp3         # Music player audio
  og-image.svg          # Open Graph image
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** (or yarn/pnpm/bun)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/vaibhavmahindru/portfolio-v2.0.git
cd portfolio-v2.0

# Install dependencies
npm install

# Start development server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## How to Fork & Customize

This portfolio is designed to be data-driven. All personal information lives in two config files. You should not need to modify any component code to make it your own.

### Step 1: Fork the repo

Click **Fork** on GitHub, then clone your fork locally.

### Step 2: Replace personal data

Edit these two files:

#### `src/config/profile.ts`

This is the **single source of truth** for everything about you. Update:

| Section | What it controls |
|---------|-----------------|
| `name`, `title`, `location` | Hero section identity |
| `bio`, `resumeBio` | About text and AI-readable summary |
| `tagline` | Subtitle in hero |
| `links` | GitHub, LinkedIn, email, resume URLs |
| `contact` | Email and form action URL |
| `experience` | Career timeline entries (version, title, company, period, description) |
| `hero` | Morph words, tech pills, status card, control panel label |
| `statusCard` | Cloud providers, uptime, experience years, response time |
| `capabilities` | Skills grid (module name, status, description, tools, details) |
| `resumeMetrics` | Credential card stats |
| `liveStatus` | Live status strip values |
| `skills` | AI-readable skills block (sr-only) |
| `terminalStack` | Terminal `stack` command output |
| `systemJson` | Terminal `status` command output |
| `meta` | Page title and meta description |

#### `src/config/projects.ts`

Each entry in the `projects` array becomes a card on the homepage and a full case study page. Fields:

- `slug` — URL path (`/projects/your-slug`)
- `name`, `status`, `role`, `tagline` — Card display
- `problem`, `approach`, `architecture`, `results`, `learnings` — Case study content
- `stack` — Technology tags
- `flow` — Architecture flow steps
- `metrics` — Key numbers
- `sourceUrl`, `liveUrl` — Links (optional)
- `liveUrls` — Multiple live links (optional, for projects with multiple sites)

### Step 3: Replace images

Drop your files into `public/`:

| File | Purpose |
|------|---------|
| `passport.png` | Default profile photo |
| `alt-photo.png` | Alternate photo shown in magnifying glass on hover |
| `portfolio.mp3` | Audio for the music player in the hero bento grid |
| `og-image.svg` | Open Graph preview image for social sharing |

### Step 4: Update meta tags

Edit `index.html` to update:
- `<title>` tag
- `<meta name="description">` tag
- `<meta property="og:*">` tags

### Step 5: Configure contact form

The contact form uses [Formspree](https://formspree.io/). Update `profile.contact.formAction` with your Formspree form URL, or replace the form action with your preferred service.

### Step 6: Deploy

Works out of the box with:

- **Vercel**: Connect your GitHub repo, framework preset = Vite, done.
- **Netlify**: Connect repo, build command = `npm run build`, publish directory = `dist`.
- **GitHub Pages**: Use `vite-plugin-gh-pages` or deploy `dist/` manually.

---

## Key Features

- **Bento grid hero** — Asymmetric card layout with identity, photo (magnifying glass hover effect), GitHub stats, live clock, music player, system status, tech pills
- **Text scramble** — Name decodes with a randomized character animation on load
- **Auto-cycling tagline** — "I BUILD {SYSTEMS} THAT SCALE." cycles through configurable words
- **Canvas 2D particle mesh** — Lightweight animated background with mouse repulsion
- **Force-directed system graph** — 13 interactive nodes with animated data packets and pulsing glow
- **Live GitHub integration** — Contributions heatmap, streak counter, 7-day mini chart, fetched from public APIs
- **GSAP scroll animations** — Section headers clip-up on scroll, gradient dividers draw in
- **Interactive terminal** — 15+ commands including `cat resume`, `ls projects`, `stack`, `status`, `whoami`, `matrix`, tab autocomplete
- **Diagnostics panel** — Real-time FPS, memory, load time, event log, network tab
- **Easter eggs** — Konami code, rapid click detector, idle detector, secret `/secret` page, logo click scramble, view source overlay
- **Mobile responsive** — Hamburger nav, bento grid stacking, reduced padding, hidden secondary cards
- **Career timeline** — Expandable version-based timeline
- **Case study pages** — Full project breakdowns with architecture flows and metrics

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 8080 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |

---

## Environment Notes

- No environment variables required for basic usage.
- GitHub API calls use public endpoints (no token needed). Rate limits apply (60 req/hr unauthenticated).
- PageSpeed Insights API is free and keyless for basic usage. Shows "DEV MODE" on localhost.
- The music player expects `public/portfolio.mp3`. Replace with your own audio file.

---

## License

This project is open source. Fork it, customize it, make it yours.
