import { useEffect } from "react";
import { Navbar } from "@/components/agentic-landing/Navbar";
import { HeroFilm } from "@/components/agentic-landing/HeroFilm";
import { ReelSection } from "@/components/agentic-landing/reel/ReelSection";
import { DEVICES } from "@/components/agentic-landing/reel/devices";
import { AgentsGrid } from "@/components/agentic-landing/AgentsGrid";
import { HybridPrinciples } from "@/components/agentic-landing/HybridPrinciples";
import { BrandFilm } from "@/components/agentic-landing/BrandFilm";
import { PraxisDemo } from "@/components/agentic-landing/PraxisDemo";
import { Process } from "@/components/agentic-landing/Process";
import { StudioStack } from "@/components/agentic-landing/StudioStack";
import { RoutingLayer } from "@/components/agentic-landing/RoutingLayer";
import { EarlyAccess } from "@/components/agentic-landing/EarlyAccess";
import { Footer } from "@/components/agentic-landing/Footer";

export default function MarketingHome() {
  useEffect(() => {
    document.title = "Agentic Studios — The AI Production Suite";
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      "content",
      "Agentic Studios — five AI agents, one studio. Built for directors who think in images. Powered by Monkey Teer Studios."
    );
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroFilm />
        <ReelSection
          videos={DEVICES}
          accentHsl="45 56% 51%"
          eyebrow="Featured Filmmaker · MonkeY Teer · Devin Teer"
          ctaPrimary={{ label: "Enter the Studio", href: "/auth" }}
          ctaSecondary={{ label: "Get Early Access", href: "#early-access" }}
          defaultMix="lofi"
        />
        <AgentsGrid />
        <HybridPrinciples />
        <BrandFilm />
        <PraxisDemo />
        <Process />
        <StudioStack />
        <RoutingLayer />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
}
