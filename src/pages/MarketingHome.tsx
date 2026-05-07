import { useEffect } from "react";
import { Navbar } from "@/components/agentic-landing/Navbar";
import { Hero } from "@/components/agentic-landing/Hero";
import { AgentsGrid } from "@/components/agentic-landing/AgentsGrid";
import { PraxisDemo } from "@/components/agentic-landing/PraxisDemo";
import { Process } from "@/components/agentic-landing/Process";
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
        <Hero />
        <AgentsGrid />
        <PraxisDemo />
        <Process />
        <RoutingLayer />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
}
