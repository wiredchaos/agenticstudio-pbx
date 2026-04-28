import { useEffect } from "react";
import { Navbar } from "@/components/mindloop/Navbar";
import { Hero } from "@/components/mindloop/Hero";
import { SearchChanged } from "@/components/mindloop/SearchChanged";
import { Mission } from "@/components/mindloop/Mission";
import { Solution } from "@/components/mindloop/Solution";
import { DevinReel } from "@/components/mindloop/DevinReel";
import { CTA } from "@/components/mindloop/CTA";
import { Footer } from "@/components/mindloop/Footer";

export default function MarketingHome() {
  useEffect(() => {
    document.title = "Mindloop — Get Inspired with Us";
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      "content",
      "Mindloop — a calmer, deeper feed for writers and readers. Meaningful updates, news around technology, and a shared journey toward depth and direction."
    );
  }, []);

  return (
    <div className="mindloop min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <SearchChanged />
        <Mission />
        <Solution />
        <DevinReel />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
