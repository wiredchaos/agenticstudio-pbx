import { useEffect, useState } from "react";
import { useStudio } from "@/hooks/useStudio";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { BrandSettings } from "@/components/app/BrandSettings";

export default function Settings() {
  const { data: studio } = useStudio();
  const [routes, setRoutes] = useState<any[]>([]);
  const [mode, setMode] = useState("managed");
  const [wallet, setWallet] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (!studio) return;
    setMode(studio.infrastructure_mode || "managed");
    setIsPublic(!!studio.is_public);
    setWallet((studio as any).director?.web3_wallet || "");
    supabase.from("model_routes").select("*").eq("studio_id", studio.id).then(({ data }) => setRoutes(data || []));
  }, [studio]);

  async function save() {
    if (!studio) return;
    await supabase.from("studios").update({ infrastructure_mode: mode, is_public: isPublic }).eq("id", studio.id);
    toast.success("Saved. API keys are stored as platform secrets — set them via support for now.");
  }

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">Settings</p>
        <h1 className="font-bagel text-4xl">Studio configuration.</h1>
      </div>

      {studio && <BrandSettings studio={studio} />}

      <div className="glass-effect rounded-xl p-6 space-y-5">
        <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">Infrastructure mode</h2>
        <div className="flex gap-3">
          {["managed", "sovereign"].map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-5 py-3 rounded-md text-sm border ${mode === m ? "bg-white/10 border-white/30 text-white" : "border-white/10 text-white/60"}`}>
              {m === "managed" ? "Managed" : "Sovereign (your hardware)"}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6 space-y-3">
        <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">Public studio profile</h2>
        <div className="flex items-center justify-between">
          <span className="text-white/70">Show this studio at /studios/{studio?.slug}</span>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6 space-y-4">
        <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">Web3 wallet</h2>
        <input value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x… or ENS" className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-2.5 text-white" />
      </div>

      <div className="glass-effect rounded-xl p-6 space-y-4">
        <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">Model routes</h2>
        <div className="space-y-2">
          {routes.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-sm">
              <span className="font-mono uppercase text-accent-blue w-24">{r.agent_slug}</span>
              <span className="text-white/80 flex-1">{r.model}</span>
              <span className="text-white/40 text-xs">↳ {r.fallback_model}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/40 italic">Defaults to the Hermes 4 stack. API keys (Runway, OpenRouter, Anthropic) are stored as platform secrets.</p>
      </div>

      <button onClick={save} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-semibold">Save</button>
    </div>
  );
}
