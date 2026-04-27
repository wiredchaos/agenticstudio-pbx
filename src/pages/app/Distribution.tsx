import { useEffect, useState } from "react";
import { useStudio } from "@/hooks/useStudio";
import { supabase } from "@/integrations/supabase/client";

const channels = [
  { key: "social", label: "Social" },
  { key: "festivals", label: "Festivals" },
  { key: "web3", label: "Web3 inscription" },
  { key: "licensing", label: "Licensing" },
];

export default function Distribution() {
  const { data: studio } = useStudio();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (!studio) return;
    supabase.from("distribution_handoffs").select("*").eq("studio_id", studio.id).then(({ data }) => setItems(data || []));
  }, [studio]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">Distribution</p>
        <h1 className="font-bagel text-4xl">Outputs queue.</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((c) => (
          <div key={c.key} className="glass-effect rounded-xl p-4">
            <h3 className="text-xs uppercase tracking-widest text-white/40 mb-3">{c.label}</h3>
            <div className="space-y-2">
              {items.filter((i) => i.channel === c.key).map((i) => (
                <div key={i.id} className="bg-black/30 rounded-md p-3 border border-white/5">
                  <p className="text-xs uppercase tracking-widest text-accent-blue">{i.status}</p>
                  <p className="text-sm text-white/85 mt-1">{i.destination}</p>
                </div>
              ))}
              {items.filter((i) => i.channel === c.key).length === 0 && <p className="text-white/30 text-xs">Empty</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
