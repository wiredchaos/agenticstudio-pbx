import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function StudiosDirectory() {
  const [studios, setStudios] = useState<any[]>([]);
  useEffect(() => {
    document.title = "Studios — Agentic Studios";
    supabase.from("studios").select("*").eq("is_public", true).order("created_at").then(({ data }) => setStudios(data || []));
  }, []);
  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-10"><ArrowLeft className="w-4 h-4" /> Back</Link>
        <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-3">The Roster</p>
        <h1 className="font-bagel text-5xl lg:text-6xl mb-12">All studios.</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studios.map((s) => (
            <Link key={s.id} to={`/studios/${s.slug}`} className="group glass-effect rounded-xl p-8 block">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs tracking-widest uppercase text-white/40 mb-2">{s.tagline || "Studio"}</p>
                  <h2 className="font-bagel text-3xl">{s.name}</h2>
                  <p className="text-white/60 mt-2">Founded by {s.founder_name}</p>
                </div>
                <ArrowUpRight className="w-6 h-6 text-white/30 group-hover:text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
