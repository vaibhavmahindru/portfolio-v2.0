import { useState } from "react";
import GridBackground from "@/components/GridBackground";
import ScrollProgress from "@/components/ScrollProgress";
import TopBar from "@/components/TopBar";
import BootSequence from "@/components/BootSequence";
import HeroSection from "@/components/HeroSection";
import SystemOverview from "@/components/SystemOverview";
import CapabilitiesModule from "@/components/CapabilitiesModule";
import DeployedSystems from "@/components/DeployedSystems";
import TechStackGraph from "@/components/TechStackGraph";
import LiveStatusPanel from "@/components/LiveStatusPanel";
import ResumeCenter from "@/components/ResumeCenter";
import SocialModule from "@/components/SocialModule";
import ContactModule from "@/components/ContactModule";
import SystemFooter from "@/components/SystemFooter";
import CustomCursor from "@/components/CustomCursor";

const Index = () => {
  const [booted, setBooted] = useState(false);

  return (
    <div className="dark relative min-h-screen bg-background text-foreground overflow-x-hidden cursor-none lg:cursor-none">
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}

      <CustomCursor />
      <GridBackground />
      <ScrollProgress />
      <TopBar />

      <main className="relative z-10">
        <HeroSection />
        <SystemOverview />
        <CapabilitiesModule />
        <DeployedSystems />
        <TechStackGraph />
        <LiveStatusPanel />
        <ResumeCenter />
        <SocialModule />
        <ContactModule />
        <SystemFooter />
      </main>
    </div>
  );
};

export default Index;
