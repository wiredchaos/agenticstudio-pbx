import { useState } from "react";
import { MapPin, Sparkles } from "lucide-react";

const plates = [
  { caption: "Magic hour, Mojave, 35mm", grad: "from-amber-950 via-orange-950 to-zinc-900" },
  { caption: "Echo Park / fruit stalls / 02:14", grad: "from-violet-950 via-zinc-900 to-black" },
  { caption: "Ludlow diner, fluorescent", grad: "from-emerald-950 via-zinc-900 to-black" },
  { caption: "Highway 40, dusk", grad: "from-rose-950 via-zinc-900 to-black" },
  { caption: "Empty motel pool", grad: "from-cyan-950 via-zinc-900 to-black" },
  { caption: "Father's studio interior", grad: "from-amber-900 via-stone-900 to-black" },
  { caption: "Beirut hotel corridor", grad: "from-yellow-950 via-zinc-900 to-black" },
  { caption: "Heat distortion / asphalt", grad: "from-orange-950 via-red-950 to-black" },
  { caption: "Doorway / late afternoon", grad: "from-amber-950 via-zinc-900 to-black" },
];
const locations = ["Trona, CA — desert + abandoned plant", "Ludlow, CA — Route 66 diner", "Echo Park, LA — night market", "Salton Sea — water + decay", "Joshua Tree — magic hour granite"];

export default function Architect() {
  const [prompt, setPrompt] = useState("");
  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">ARCHITECT — World Builder</p>
        <h1 className="font-bagel text-4xl">Plates and locations.</h1>
      </div>
      <div className="glass-effect rounded-xl p-6 flex gap-3">
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Mojave, magic hour, dust on the lens…" className="flex-1 bg-black/40 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/30" />
        <button className="bg-red-600 hover:bg-red-700 px-6 rounded-md font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate plates</button>
      </div>
      <section>
        <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-4">Plate references</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {plates.map((p, i) => (
            <div key={i} className={`aspect-video bg-gradient-to-br ${p.grad} rounded-lg border border-white/10 p-3 flex items-end`}>
              <p className="text-[11px] text-white/80 font-mono">{p.caption}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-4">Suggested real locations</h2>
        <ul className="space-y-2">{locations.map((l) => (<li key={l} className="flex items-center gap-3 text-white/80"><MapPin className="w-4 h-4 text-accent-emerald" />{l}</li>))}</ul>
      </section>
    </div>
  );
}
