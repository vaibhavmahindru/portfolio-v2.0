import { lazy, Suspense } from "react";
import TopBar from "@/components/TopBar";
import HeroSection from "@/components/HeroSection";
import { SectionSkeleton, PanelSkeleton } from "@/components/SkeletonLoader";
import { profile } from "@/config/profile";
import { projects } from "@/config/projects";

// Lazy load everything that is not above-the-fold
const GridBackground = lazy(() => import("@/components/GridBackground"));
const ScrollProgress = lazy(() => import("@/components/ScrollProgress"));
const ScrollAnimations = lazy(() => import("@/components/ScrollAnimations"));
const CustomCursor = lazy(() => import("@/components/CustomCursor"));
const TelemetryFeedback = lazy(() => import("@/components/TelemetryFeedback"));
const IdleDetector = lazy(() => import("@/components/IdleDetector"));
const PerformanceWidget = lazy(() => import("@/components/PerformanceWidget"));
const TerminalOverlay = lazy(() =>
  import("@/components/TerminalOverlay").then((m) => ({ default: m.default }))
);
const TerminalHintBadge = lazy(() =>
  import("@/components/TerminalOverlay").then((m) => ({ default: m.TerminalHintBadge }))
);
const EasterEggs = lazy(() => import("@/components/EasterEggs"));

// Below-fold sections
const SystemOverview = lazy(() => import("@/components/SystemOverview"));
const CapabilitiesModule = lazy(() => import("@/components/CapabilitiesModule"));
const DeployedSystems = lazy(() => import("@/components/DeployedSystems"));
const TechStackGraph = lazy(() => import("@/components/TechStackGraph"));
const BlogModule = lazy(() => import("@/components/BlogModule"));
const GitHubActivity = lazy(() => import("@/components/GitHubActivity"));
const ResumeCenter = lazy(() => import("@/components/ResumeCenter"));
const SocialModule = lazy(() => import("@/components/SocialModule"));
const ContactModule = lazy(() => import("@/components/ContactModule"));
const SystemFooter = lazy(() => import("@/components/SystemFooter"));

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Skip to content — accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to Content
      </a>

      {/* ── SR-ONLY: AI-readable plain text summary ── */}
      <div className="sr-only" aria-hidden="false">
        <h1>{profile.name} — {profile.title}</h1>
        <p>{profile.bio}</p>
        <p>Location: {profile.location}. Status: {profile.status}.</p>
        <h2>Summary</h2>
        <p>{profile.resumeBio}</p>
        <h2>Skills and Technologies</h2>
        <p>
          Languages: {profile.skills.languages}.
          Cloud: {profile.skills.cloud}.
          Databases: {profile.skills.databases}.
          Frontend: {profile.skills.frontend}.
          DevOps: {profile.skills.devops}.
          Security: {profile.skills.security}.
          Data Engineering: {profile.skills.dataEngineering}.
          AI: {profile.skills.ai}.
          Architecture: {profile.skills.architecture}.
        </p>
        <h2>Experience</h2>
        {profile.experience.map((exp, i) => (
          <div key={i}>
            <h3>{exp.title} ({exp.period})</h3>
            <p>{exp.description}</p>
          </div>
        ))}
        <h2>Projects</h2>
        {projects.map((p) => (
          <div key={p.slug}>
            <h3>{p.name} — {p.status}</h3>
            <p>{p.tagline}</p>
            <p>Role: {p.role}. Stack: {p.stack.join(", ")}.</p>
            <p>Problem: {p.problem}</p>
            <p>Approach: {p.approach}</p>
            <p>Results: {p.results}</p>
          </div>
        ))}
        <h2>Contact</h2>
        <p>
          Email: {profile.contact.email}.
          GitHub: {profile.links.github}.
          {profile.status}.
        </p>
      </div>

      {/* Critical above-fold */}
      <TopBar />

      {/* Deferred overlays + chrome — loaded after first paint */}
      <Suspense fallback={null}>
        <GridBackground />
        <ScrollProgress />
        <ScrollAnimations />
        <CustomCursor />
        <TelemetryFeedback />
        <IdleDetector />
        <PerformanceWidget />
        <TerminalOverlay />
        <TerminalHintBadge />
        <EasterEggs />
      </Suspense>

      <main id="main-content" className="relative z-10">
        <HeroSection />
        <Suspense fallback={<SectionSkeleton />}>
        <SystemOverview />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
        <CapabilitiesModule />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
        <DeployedSystems />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
        <TechStackGraph />
        </Suspense>
        {/* TODO: Uncomment when blog posts are ready
        <Suspense fallback={<SectionSkeleton />}>
          <BlogModule />
        </Suspense>
        */}
        {/* GitHub + Social + Live Status — combined section */}
        <section className="px-4 sm:px-6 py-12 md:py-16 overflow-x-hidden" id="github">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-2 mb-6" data-gsap="clip-up" data-gsap-duration="1">
              <span className="font-mono text-xs text-primary uppercase tracking-widest">
                // Connect
              </span>
              <h2 className="text-3xl font-bold text-foreground">Activity &amp; Network</h2>
            </div>
            <div className="gsap-divider h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent mb-6" />

            {/* Live Status Strip — edit values in profile.ts → liveStatus */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 scrollbar-none sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible sm:snap-none sm:pb-0 mb-6">
              {(profile.liveStatus as unknown as { label: string; value: string; color: string; border: string; bg: string }[]).map((m) => (
                <div key={m.label} className={`snap-start shrink-0 w-[42vw] max-w-[160px] sm:w-auto sm:max-w-none sm:shrink p-3 rounded-md border ${m.border} ${m.bg} backdrop-blur-sm`}>
                  <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  <p className={`font-mono text-xs font-medium mt-1 ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-5 gap-4 md:gap-6">
              <div className="md:col-span-3 min-w-0">
                <Suspense fallback={<PanelSkeleton />}>
                  <GitHubActivity />
                </Suspense>
              </div>
              <div className="md:col-span-2 min-w-0">
                <Suspense fallback={<PanelSkeleton />}>
                  <SocialModule />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
        <Suspense fallback={<SectionSkeleton />}>
        <ResumeCenter />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
        <ContactModule />
        </Suspense>
        <Suspense fallback={null}>
        <SystemFooter />
        </Suspense>
      </main>
    </div>
  );
};

export default Index;
