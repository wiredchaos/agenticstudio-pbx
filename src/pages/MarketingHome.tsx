import { useEffect } from "react";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { StudiosStrip } from "@/components/marketing/StudiosStrip";
import { FiveAgents } from "@/components/marketing/FiveAgents";
import { Manifesto } from "@/components/marketing/Manifesto";
import { Capabilities } from "@/components/marketing/Capabilities";
import { Founders } from "@/components/marketing/Founders";
import { OpenStudio } from "@/components/marketing/OpenStudio";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function MarketingHome() {
  useEffect(() => {
    document.title = "Agentic Studios — The studio runs itself. So you can direct.";
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute("content", "Agentic Studios — a platform of director-owned AI studios. Five named agents handle the work no director wants to do. Built on open infrastructure.");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        <MarketingHero />
        <StudiosStrip />
        <FiveAgents />
        <Manifesto />
        <Capabilities />
        <Founders />
        <OpenStudio />
      </main>
      <MarketingFooter />
    </div>
  );
}
