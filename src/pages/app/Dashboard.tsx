import { useEffect, useState } from "react";
import { useStudio } from "@/hooks/useStudio";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Activity } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { data: studio } = useStudio();
  const [projects, setProjects] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (!studio) return;
    const load = async () => {
      const [{ data: p }, { data: r }, { data: rw }] = await Promise.all([
        supabase.from("projects").select("*").eq("studio_id", studio.id).order("created_at", { ascending: false }),
        supabase.from("agent_runs").select("*").eq("studio_id", studio.id).order("created_at", { ascending: false }).limit(20),
        supabase.from("runway_calls").select("credits_used").eq("studio_id", studio.id),
      ]);
      setProjects(p || []); setRuns(r || []);
      setCredits((rw || []).reduce((s: number, x: any) => s + Number(x.credits_used || 0), 0));
    };
    load();
    const ch = supabase.channel(`studio-${studio.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "agent_runs", filter: `studio_id=eq.${studio.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [studio]);

  const pending = runs.filter((r) => r.awaiting_approval);

  async function decide(id: string, approve: boolean) {
    await supabase.from("agent_runs").update({ awaiting_approval: false }).eq("id", id);
    toast.success(approve ? "Approved" : "Rejected");
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">NEXUS — Orchestrator</p>
        <h1 className="font-bagel text-4xl">Studio dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Active projects" value={projects.length} />
        <Stat label="Runway credits used" value={credits.toFixed(0)} />
        <Stat label="Decisions pending" value={pending.length} accent />
      </div>

      <section>
        <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-4">Decisions awaiting your approval</h2>
        {pending.length === 0 && <div className="text-white/40 text-sm">All clear. Studio is up to date.</div>}
        <div className="space-y-3">
          {pending.map((r) => (
            <div key={r.id} className="glass-effect rounded-lg p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-accent-blue">{r.agent_slug}</p>
                <p className="text-white/90">{r.summary}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => decide(r.id, true)} className="px-3 py-2 rounded-md bg-accent-emerald/20 hover:bg-accent-emerald/30 text-accent-emerald flex items-center gap-1 text-sm"><CheckCircle2 className="w-4 h-4" /> Approve</button>
                <button onClick={() => decide(r.id, false)} className="px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white/70 flex items-center gap-1 text-sm"><XCircle className="w-4 h-4" /> Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-4">Active projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="glass-effect rounded-lg p-5">
              <p className="text-xs uppercase tracking-widest text-accent-blue">{p.status}</p>
              <h3 className="font-bagel text-xl mt-1">{p.title}</h3>
              <p className="text-white/60 text-sm mt-2">{p.logline}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Live agent activity</h2>
        <div className="space-y-2">
          {runs.slice(0, 10).map((r) => (
            <div key={r.id} className="text-sm flex items-start gap-3 py-2 border-b border-white/5">
              <span className="font-mono text-[10px] uppercase text-accent-blue w-20 shrink-0 pt-1">{r.agent_slug}</span>
              <span className="text-white/80 flex-1">{r.summary}</span>
              <span className="text-white/30 text-xs shrink-0">{new Date(r.created_at).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: any; accent?: boolean }) {
  return (
    <div className="glass-effect rounded-lg p-5">
      <p className="text-xs uppercase tracking-widest text-white/40 mb-2">{label}</p>
      <p className={`font-bagel text-4xl ${accent ? "text-red-500" : "text-white"}`}>{value}</p>
    </div>
  );
}
