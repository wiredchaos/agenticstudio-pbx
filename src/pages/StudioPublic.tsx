import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { StudioThemeProvider } from "@/components/studio/StudioThemeProvider";
import { BrandHero } from "@/components/studio/BrandHero";
import { LeadMagnet } from "@/components/studio/LeadMagnet";
import { PricingBlock } from "@/components/studio/PricingBlock";
import { StudioReel } from "@/components/studio/StudioReel";
import { hasFeature, isPremium } from "@/lib/tier";

export default function StudioPublic() {
  const { slug } = useParams();
  const [studio, setStudio] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [dna, setDna] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data: s } = await supabase.from("studios").select("*").eq("slug", slug).eq("is_public", true).maybeSingle();
      setStudio(s);
      if (!s) return;
      document.title = `${s.name} — Agentic Studios`;
      const { data: p } = await supabase.from("projects").select("*").eq("studio_id", s.id);
      setProjects(p || []);
      const { data: d } = await supabase.from("director_dna").select("*").eq("studio_id", s.id).eq("is_public", true).eq("is_current", true).maybeSingle();
      setDna(d);
    })();
  }, [slug]);

  if (!studio) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/60">Studio not found, or not public.</div>
      </div>
    );
  }

  const theme = studio.brand_theme || {};
  const premium = isPremium(studio);

  return (
    <StudioThemeProvider theme={theme} asMain>
      <div className="px-6 pt-8">
        <Link to="/studios" className="inline-flex items-center gap-2 opacity-60 hover:opacity-100">
          <ArrowLeft className="w-4 h-4" /> All studios
        </Link>
      </div>

      <BrandHero theme={theme} name={studio.name} tagline={studio.tagline} />

      <StudioReel studio={studio} />

      <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
        <p className="opacity-70 text-lg">Founded by {studio.founder_name}</p>

        <section>
          <h2 className="text-sm tracking-[0.3em] uppercase opacity-50 mb-6">Recent projects</h2>
          {projects.length === 0 && <p className="opacity-50">No public projects yet.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="rounded-lg p-6 border" style={{ borderColor: "hsl(var(--accent) / 0.3)", background: "hsl(var(--foreground) / 0.03)" }}>
                <p className="text-xs tracking-widest uppercase" style={{ color: "hsl(var(--accent))" }}>{p.status}</p>
                <h3 className="text-2xl mt-1 mb-2" style={{ fontFamily: "var(--brand-display)" }}>{p.title}</h3>
                <p className="opacity-70 text-sm">{p.logline}</p>
              </div>
            ))}
          </div>
        </section>

        {dna && (
          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase opacity-50 mb-6">Director DNA · v{dna.version}</h2>
            <div className="rounded-lg p-8 space-y-4 border" style={{ borderColor: "hsl(var(--accent) / 0.2)" }}>
              <Row label="Lenses" value={(dna.lens_preferences || []).join(" · ")} />
              <Row label="Palette" value={(dna.color_palette || []).join(" · ")} />
              <Row label="Pacing" value={dna.pacing} />
              <Row label="Lighting" value={dna.lighting} />
              <Row label="Blocking" value={dna.blocking} />
              <Row label="Motifs" value={(dna.motifs || []).join(" · ")} />
              {dna.notes && <p className="opacity-60 italic pt-4 border-t border-white/10">"{dna.notes}"</p>}
            </div>
          </section>
        )}
      </div>

      {hasFeature(studio, "pricing_block") && <PricingBlock funnel={studio.funnel} />}
      {hasFeature(studio, "lead_magnet") && <LeadMagnet studioSlug={studio.slug} />}

      <footer className="px-6 py-10 text-center text-[10px] uppercase tracking-[0.3em] opacity-40 border-t border-white/10">
        {premium ? (
          <span>{studio.name} · powered by Agentic Studios</span>
        ) : (
          <Link to="/" className="hover:opacity-100">Powered by Agentic Studios — start your studio</Link>
        )}
      </footer>
    </StudioThemeProvider>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="text-xs tracking-widest uppercase opacity-50 w-32 shrink-0 pt-1">{label}</div>
      <div className="opacity-90">{value}</div>
    </div>
  );
}
