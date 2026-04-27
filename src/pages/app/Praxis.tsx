import { useState } from "react";
import { ChevronDown, Sparkles, CheckCircle2, Send, Link2 } from "lucide-react";
import { toast } from "sonner";

const mockShots = [
  { n: 1, lens: "85mm", framing: "Wide", movement: "Static", duration: "8s", note: "Key in window. Magic hour. Hold." },
  { n: 2, lens: "135mm", framing: "MS", movement: "Slow push", duration: "6s", note: "Back of head, dust on shoulders." },
  { n: 3, lens: "85mm", framing: "Two-shot", movement: "Static", duration: "12s", note: "Both turned away from camera." },
  { n: 4, lens: "135mm", framing: "CU", movement: "Static", duration: "6s", note: "Hands on the urn. No dialogue." },
  { n: 5, lens: "85mm", framing: "MCU", movement: "Slow pan L→R", duration: "9s", note: "Listening, not reacting." },
  { n: 6, lens: "35mm", framing: "Wide", movement: "Static", duration: "5s", note: "Doorway. Empty chair behind." },
  { n: 7, lens: "85mm", framing: "OTS", movement: "Static", duration: "7s", note: "Heat distortion in background." },
  { n: 8, lens: "135mm", framing: "ECU", movement: "Static", duration: "4s", note: "Eye, no blink. Hold." },
  { n: 9, lens: "85mm", framing: "MS", movement: "Handheld drift", duration: "10s", note: "Walks out of frame slowly." },
  { n: 10, lens: "85mm", framing: "Wide", movement: "Static", duration: "8s", note: "Empty room. Wind only." },
  { n: 11, lens: "135mm", framing: "CU", movement: "Static", duration: "6s", note: "Door handle turning." },
  { n: 12, lens: "85mm", framing: "Wide", movement: "Static", duration: "11s", note: "She steps out. Door stays open." },
];

export default function Praxis() {
  const [script, setScript] = useState("");
  const [shots, setShots] = useState<typeof mockShots>([]);
  const [thinking, setThinking] = useState(false);
  const [thinkOpen, setThinkOpen] = useState(true);
  const [approved, setApproved] = useState<Set<number>>(new Set());

  async function generate() {
    if (!script.trim()) return;
    setThinking(true); setShots([]); setThinkOpen(true);
    await new Promise((r) => setTimeout(r, 1400));
    setShots(mockShots);
    setThinking(false);
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">PRAXIS — Director's Twin</p>
        <h1 className="font-bagel text-4xl">Shot list, conditioned on your DNA.</h1>
        <p className="text-white/60 mt-2">Paste a scene. PRAXIS pulls your DNA from the archive and drafts a shot list.</p>
      </div>

      <div className="glass-effect rounded-xl p-6 space-y-4">
        <textarea value={script} onChange={(e) => setScript(e.target.value)} rows={6}
          placeholder="EXT. MOJAVE — MAGIC HOUR. She steps out of the trailer holding the urn..."
          className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/30 focus:outline-none font-mono text-sm" />
        <button onClick={generate} disabled={thinking} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-semibold flex items-center gap-2 disabled:opacity-50">
          <Sparkles className="w-4 h-4" /> {thinking ? "Pulling DNA…" : "Generate shot list"}
        </button>
      </div>

      {(thinking || shots.length > 0) && (
        <div className="glass-effect rounded-xl">
          <button onClick={() => setThinkOpen(!thinkOpen)} className="w-full flex items-center justify-between p-4 text-left">
            <span className="text-xs tracking-[0.2em] uppercase text-white/50">{thinking ? "Thinking…" : "Reasoning log"}</span>
            <ChevronDown className={`w-4 h-4 transition ${thinkOpen ? "rotate-180" : ""}`} />
          </button>
          {thinkOpen && (
            <pre className="px-4 pb-4 text-xs text-white/60 font-mono whitespace-pre-wrap">{`Pulling director DNA v3 from archive...
Anchor on 85mm and 135mm — director rarely uses below 50mm.
Magic-hour palette weights amber 0.62, cool shadow 0.31.
Holding shots 1.4x longer than baseline coverage.
Drafting 12 shots, ranking by DNA fit...
${thinking ? "▍" : "Done."}`}</pre>
          )}
        </div>
      )}

      {shots.length > 0 && (
        <section>
          <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-4">12 shots — generic prompt vs. your DNA</h2>
          <div className="space-y-3">
            {shots.map((s) => (
              <div key={s.n} className="glass-effect rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <div className="font-bagel text-3xl text-white/30 w-12">{String(s.n).padStart(2, "0")}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3 text-xs text-white/60 mb-2">
                      <span className="font-mono">{s.lens}</span><span>·</span><span>{s.framing}</span><span>·</span><span>{s.movement}</span><span>·</span><span>{s.duration}</span>
                    </div>
                    <p className="text-white/85 italic">"{s.note}"</p>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="aspect-video bg-zinc-900 border border-white/10 rounded flex items-center justify-center text-[10px] text-white/30 uppercase tracking-widest">Generic prompt</div>
                      <div className="aspect-video bg-gradient-to-br from-amber-950/40 via-zinc-900 to-black border border-accent-emerald/30 rounded flex items-center justify-center text-[10px] text-accent-emerald uppercase tracking-widest">DNA loaded</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 justify-end">
                  <button onClick={() => { setApproved(new Set(approved).add(s.n)); toast.success(`Shot ${s.n} approved`); }} className={`px-3 py-1.5 rounded text-xs flex items-center gap-1 ${approved.has(s.n) ? "bg-accent-emerald/30 text-accent-emerald" : "bg-white/5 hover:bg-white/10 text-white/70"}`}><CheckCircle2 className="w-3 h-3" /> Approve</button>
                  <button onClick={() => toast.success("Sent to distribution")} className="px-3 py-1.5 rounded text-xs bg-white/5 hover:bg-white/10 text-white/70 flex items-center gap-1"><Send className="w-3 h-3" /> Distribute</button>
                  <button onClick={() => toast.success("Mock inscription queued")} className="px-3 py-1.5 rounded text-xs bg-white/5 hover:bg-white/10 text-white/70 flex items-center gap-1"><Link2 className="w-3 h-3" /> Inscribe</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
