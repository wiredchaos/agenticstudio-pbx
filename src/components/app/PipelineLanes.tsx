import { useEffect, useState } from "react";
import { useStudio } from "@/hooks/useStudio";
import { supabase } from "@/integrations/supabase/client";
import { Search, FileText, Mic, Sparkles, Send } from "lucide-react";

const LANES = [
  { key: "research", label: "Research", icon: Search },
  { key: "script", label: "Script", icon: FileText },
  { key: "voice", label: "Voice", icon: Mic },
  { key: "vfx", label: "VFX", icon: Sparkles },
  { key: "distribution", label: "Distribution", icon: Send },
];

export function PipelineLanes() {
  const { data: studio } = useStudio();
  const [byDept, setByDept] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (!studio) return;
    const load = async () => {
      const { data } = await supabase
        .from("agent_runs")
        .select("id,department,summary,agent_slug,created_at")
        .eq("studio_id", studio.id)
        .not("department", "is", null)
        .order("created_at", { ascending: false })
        .limit(50);
      const grouped: Record<string, any[]> = {};
      (data || []).forEach((r: any) => {
        const k = (r.department || "").toLowerCase();
        (grouped[k] ||= []).push(r);
      });
      setByDept(grouped);
    };
    load();
  }, [studio]);

  return (
    <section>
      <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-4">Studio pipeline</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {LANES.map((l) => {
          const runs = byDept[l.key] || [];
          const last = runs[0];
          const active = runs.length > 0;
          return (
            <div key={l.key} className="glass-effect rounded-lg p-4">
              <div className="flex items-center gap-2">
                <l.icon className="w-4 h-4 text-white/60" />
                <span className="text-xs uppercase tracking-widest text-white/60">{l.label}</span>
                <span className={`ml-auto h-1.5 w-1.5 rounded-full ${active ? "bg-accent-emerald" : "bg-white/15"}`} />
              </div>
              <p className="mt-3 text-[11px] text-white/40 uppercase tracking-widest">{runs.length} runs</p>
              <p className="mt-1 text-xs text-white/70 line-clamp-2 min-h-[2rem]">
                {last?.summary || "No activity yet."}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
