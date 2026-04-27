const cards = [
  { h: 320, label: "Concierge — linen suit, tobacco", grad: "from-amber-900 via-stone-800 to-zinc-900" },
  { h: 220, label: "Daughter — denim, dust", grad: "from-blue-950 via-zinc-900 to-black" },
  { h: 280, label: "Father (flashback) — wool coat", grad: "from-stone-800 via-zinc-900 to-black" },
  { h: 200, label: "Cook — apron, white tee", grad: "from-zinc-700 via-zinc-900 to-black" },
  { h: 360, label: "Color story — bone, amber, dust", grad: "from-amber-100/20 via-stone-800 to-black" },
  { h: 240, label: "Boots, worn left toe", grad: "from-stone-900 via-zinc-900 to-black" },
  { h: 300, label: "Concierge — cream, evening", grad: "from-yellow-100/10 via-zinc-900 to-black" },
  { h: 260, label: "Watch, gold, scratched crystal", grad: "from-amber-950 via-zinc-900 to-black" },
];

export default function Egos() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">EGOS — Designer</p>
        <h1 className="font-bagel text-4xl">Wardrobe + character moodboard.</h1>
      </div>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {cards.map((c, i) => (
          <div key={i} style={{ height: c.h }} className={`bg-gradient-to-br ${c.grad} rounded-lg border border-white/10 p-3 break-inside-avoid flex items-end`}>
            <p className="text-[11px] text-white/80 font-mono">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
