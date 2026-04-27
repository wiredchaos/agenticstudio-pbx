import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) + "-" + Math.random().toString(36).slice(2, 6);
}

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [studioName, setStudioName] = useState("");
  const [founderName, setFounderName] = useState("");
  const [archiveSize, setArchiveSize] = useState("");
  const [wallet, setWallet] = useState("");
  const [styleNotes, setStyleNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    // ensure director row
    const { data: dir } = await supabase.from("directors").select("id").eq("user_id", user.id).maybeSingle();
    let directorId = dir?.id;
    if (!directorId) {
      const { data: ins } = await supabase.from("directors").insert({ user_id: user.id, display_name: founderName, web3_wallet: wallet || null }).select("id").single();
      directorId = ins?.id;
    } else {
      await supabase.from("directors").update({ display_name: founderName, web3_wallet: wallet || null }).eq("id", directorId);
    }
    if (!directorId) { setBusy(false); toast.error("Could not create director profile"); return; }

    const { data: studio, error } = await supabase.from("studios").insert({
      director_id: directorId, name: studioName, slug: slugify(studioName),
      founder_name: founderName, archive_size_estimate: archiveSize || null, style_notes: styleNotes || null, is_public: false,
    }).select("id").single();
    if (error || !studio) { setBusy(false); toast.error(error?.message || "Could not create studio"); return; }

    // seed default model routes
    const { data: agents } = await supabase.from("agents").select("slug, default_model");
    if (agents) {
      await supabase.from("model_routes").insert(agents.map((a) => ({ studio_id: studio.id, agent_slug: a.slug, model: a.default_model, fallback_model: "anthropic/claude-sonnet-4" })));
    }
    // empty DNA v1
    await supabase.from("director_dna").insert({ studio_id: studio.id, version: 1, is_current: true });

    qc.invalidateQueries({ queryKey: ["my-studio"] });
    toast.success("Studio open. Welcome.");
    navigate("/app/dashboard");
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-xl glass-effect rounded-xl p-10 space-y-5">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-2">Step one</p>
          <h1 className="font-bagel text-4xl mb-2">Name your studio.</h1>
          <p className="text-white/60">A few details. You can refine everything later.</p>
        </div>
        <Field label="Studio name" value={studioName} onChange={setStudioName} required placeholder="MonkeY Teer Studio" />
        <Field label="Founder name" value={founderName} onChange={setFounderName} required placeholder="Devin Teer" />
        <Field label="Archive size estimate" value={archiveSize} onChange={setArchiveSize} placeholder="e.g. 14 TB" />
        <Field label="Web3 wallet (optional)" value={wallet} onChange={setWallet} placeholder="0x… or ENS" />
        <div>
          <label className="block text-sm text-white/70 mb-2">Style notes</label>
          <textarea value={styleNotes} onChange={(e) => setStyleNotes(e.target.value)} rows={4} placeholder="Long lenses. Magic-hour palettes. Stillness held a beat too long."
            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
        </div>
        <button type="submit" disabled={busy} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md disabled:opacity-50 gentle-animation">
          {busy ? "Opening studio…" : "Open studio →"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm text-white/70 mb-2">{label}{required && <span className="text-red-500"> *</span>}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
    </div>
  );
}
