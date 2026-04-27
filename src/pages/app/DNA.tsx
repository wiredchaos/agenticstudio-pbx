import { useEffect, useState } from "react";
import { useStudio } from "@/hooks/useStudio";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function DNA() {
  const { data: studio } = useStudio();
  const [dna, setDna] = useState<any>(null);
  useEffect(() => {
    if (!studio) return;
    supabase.from("director_dna").select("*").eq("studio_id", studio.id).eq("is_current", true).maybeSingle().then(({ data }) => setDna(data));
  }, [studio]);

  async function save() {
    if (!dna) return;
    await supabase.from("director_dna").update({ pacing: dna.pacing, lighting: dna.lighting, blocking: dna.blocking, notes: dna.notes, is_public: dna.is_public, lens_preferences: dna.lens_preferences, color_palette: dna.color_palette, motifs: dna.motifs }).eq("id", dna.id);
    toast.success("DNA saved");
  }

  if (!dna) return <div className="p-8 text-white/40">No DNA profile yet.</div>;

  const arr = (k: string) => (dna[k] || []).join(", ");
  const setArr = (k: string, v: string) => setDna({ ...dna, [k]: v.split(",").map((s) => s.trim()).filter(Boolean) });

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">Director DNA · v{dna.version}</p>
          <h1 className="font-bagel text-4xl">Your distilled style.</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-white/60">Public on studio profile</span>
          <Switch checked={dna.is_public} onCheckedChange={(v) => setDna({ ...dna, is_public: v })} />
        </div>
      </div>
      <div className="glass-effect rounded-xl p-6 space-y-5">
        <Field label="Lens preferences (comma-separated)" value={arr("lens_preferences")} onChange={(v) => setArr("lens_preferences", v)} />
        <Field label="Color palette" value={arr("color_palette")} onChange={(v) => setArr("color_palette", v)} />
        <Field label="Pacing" value={dna.pacing || ""} onChange={(v) => setDna({ ...dna, pacing: v })} />
        <Field label="Lighting" value={dna.lighting || ""} onChange={(v) => setDna({ ...dna, lighting: v })} />
        <Field label="Blocking" value={dna.blocking || ""} onChange={(v) => setDna({ ...dna, blocking: v })} />
        <Field label="Motifs" value={arr("motifs")} onChange={(v) => setArr("motifs", v)} />
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Notes</label>
          <textarea rows={3} value={dna.notes || ""} onChange={(e) => setDna({ ...dna, notes: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-white" />
        </div>
        <button onClick={save} className="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-md font-semibold">Save DNA</button>
      </div>
    </div>
  );
}
function Field({ label, value, onChange }: any) {
  return (<div><label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-2.5 text-white" /></div>);
}
