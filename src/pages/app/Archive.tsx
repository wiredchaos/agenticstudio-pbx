import { useEffect, useState } from "react";
import { useStudio } from "@/hooks/useStudio";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

export default function Archive() {
  const { data: studio } = useStudio();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (!studio) return;
    supabase.from("archive_items").select("*").eq("studio_id", studio.id).order("created_at", { ascending: false }).then(({ data }) => setItems(data || []));
  }, [studio]);
  const totalTB = items.reduce((s, i) => s + Number(i.size_bytes || 0), 0) / 1e12;

  return (
    <div className="p-8 space-y-8">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">Director's Library</p>
        <h1 className="font-bagel text-4xl">The archive.</h1>
      </div>
      <div className="glass-effect rounded-xl p-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Total indexed</p>
          <p className="font-bagel text-6xl text-accent-emerald">{totalTB.toFixed(2)} TB</p>
        </div>
        <p className="text-white/40 text-xs italic max-w-xs text-right">Archive stays on your infrastructure. Models query, never store.</p>
      </div>
      <section>
        <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-4">Items</h2>
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="glass-effect rounded-lg p-5">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-white font-bold">{it.title}</h3>
                  <p className="text-xs text-white/40">{it.source} · {(Number(it.size_bytes) / 1e9).toFixed(1)} GB</p>
                </div>
                <span className="text-xs text-white/60">{it.ingestion_progress}%</span>
              </div>
              <Progress value={it.ingestion_progress} className="h-1 mb-3" />
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                <Tag on={it.frames_extracted > 0}>Frames</Tag>
                <Tag on={it.dialogue_transcribed}>Dialogue</Tag>
                <Tag on={it.vision_tagged}>Vision tags</Tag>
                <Tag on={it.embeddings_generated}>Embeddings</Tag>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
function Tag({ on, children }: any) { return <span className={`px-2 py-1 rounded ${on ? "bg-accent-emerald/20 text-accent-emerald" : "bg-white/5 text-white/30"}`}>{children}</span>; }
