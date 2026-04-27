import { motion } from "framer-motion";

const founders = [
  { name: "DEVIN TEER", studio: "MonkeY Teer Studio", status: "FOUNDING DIRECTOR", note: "Long lenses. Magic-hour palettes. Stillness held a beat too long." },
  { name: "—", studio: "Sister studio", status: "WANTED", note: "Independent director. Owns their archive. Opens their studio." },
  { name: "—", studio: "Sister studio", status: "WANTED", note: "Independent director. Owns their archive. Opens their studio." },
];

export function Founders() {
  return (
    <section id="founders" className="relative py-24 bg-black text-white border-t border-white/10 overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-sm tracking-[0.3em] text-white/50 uppercase mb-3">Founders</p>
          <h2 className="font-bagel text-4xl sm:text-5xl lg:text-6xl mb-3">The roster, growing.</h2>
          <p className="text-white/60 max-w-xl">Three slots open in 2026. Independent directors with archives worth querying.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {founders.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotate: i === 1 ? -1 : i === 2 ? 1 : 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="relative bg-zinc-900 border border-white/10 p-6"
              style={{ boxShadow: "0 24px 48px -12px rgba(0,0,0,0.7)" }}
            >
              {/* Polaroid-style placeholder portrait */}
              <div className="aspect-[3/4] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-white/5 mb-4 flex items-center justify-center text-white/20 font-bagel text-6xl">
                {f.name === "—" ? "?" : f.name[0]}
              </div>
              <p className="font-mono text-[10px] tracking-widest text-red-500 mb-1">{f.status}</p>
              <h3 className="font-bagel text-xl">{f.name}</h3>
              <p className="text-white/50 text-sm mb-3">{f.studio}</p>
              <p className="text-white/70 text-sm italic">"{f.note}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
