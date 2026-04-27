import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

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

  if (!studio) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="text-white/60">Studio not found, or not public.</div></div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link to="/studios" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-10"><ArrowLeft className="w-4 h-4" /> All studios</Link>
        <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-3">Public studio profile</p>
        <h1 className="font-bagel text-5xl lg:text-7xl mb-4">{studio.name}</h1>
        <p className="text-white/70 text-xl mb-2">Founded by {studio.founder_name}</p>
        {studio.tagline && <p className="text-white/50 italic text-lg mb-12">"{studio.tagline}"</p>}

        <section className="mb-16">
          <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-6">Recent projects</h2>
          {projects.length === 0 && <p className="text-white/40">No public projects yet.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="glass-effect rounded-lg p-6">
                <p className="text-xs tracking-widest text-accent-blue uppercase">{p.status}</p>
                <h3 className="font-bagel text-2xl mt-1 mb-2">{p.title}</h3>
                <p className="text-white/70 text-sm">{p.logline}</p>
              </div>
            ))}
          </div>
        </section>

        {dna && (
          <section className="mb-16">
            <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-6">Director DNA — public preview · v{dna.version}</h2>
            <div className="glass-effect rounded-lg p-8 space-y-4">
              <Row label="Lenses" value={(dna.lens_preferences || []).join(" · ")} />
              <Row label="Palette" value={(dna.color_palette || []).join(" · ")} />
              <Row label="Pacing" value={dna.pacing} />
              <Row label="Lighting" value={dna.lighting} />
              <Row label="Blocking" value={dna.blocking} />
              <Row label="Motifs" value={(dna.motifs || []).join(" · ")} />
              {dna.notes && <p className="text-white/60 italic pt-4 border-t border-white/10">"{dna.notes}"</p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return <div className="flex flex-col sm:flex-row gap-2"><div className="text-xs tracking-widest uppercase text-white/40 w-32 shrink-0 pt-1">{label}</div><div className="text-white/85">{value}</div></div>;
}
