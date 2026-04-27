import { motion } from "framer-motion";

const tenets = [
  { kicker: "01", line: "Directors keep the archive." , detail: "Footage, scripts, dailies, every reference frame — yours. Models query, never store. Sovereign mode keeps it on your hardware." },
  { kicker: "02", line: "Approvals are first-class.", detail: "Agents draft. Directors decide. Every output has three actions: approve, send to distribution, inscribe to chain." },
  { kicker: "03", line: "Open infrastructure, no lock-in.", detail: "Hermes 4 by default. Swap to Anthropic, OpenRouter, or your own endpoints. Your DNA travels with you." },
  { kicker: "04", line: "The aesthetic is the product.", detail: "Built by people who shoot. The platform should disappear into the work — not the other way around." },
];

export function Manifesto() {
  return (
    <section id="manifesto" className="relative py-32 bg-black text-white border-t border-white/10 overflow-hidden">
      {/* Subtle film grain texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "3px 3px" }} />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-sm tracking-[0.3em] text-white/50 uppercase mb-3">Manifesto</p>
          <h2 className="font-bagel text-4xl sm:text-5xl lg:text-7xl leading-[0.95] mb-16 max-w-4xl">
            Built by filmmakers,<br />for filmmakers,<br /><span className="opacity-50">on their own terms.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-5xl">
          {tenets.map((t, i) => (
            <motion.div
              key={t.kicker}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <p className="font-mono text-xs text-white/40 mb-3">{t.kicker}</p>
              <h3 className="font-bagel text-2xl sm:text-3xl mb-3">{t.line}</h3>
              <p className="text-white/70 leading-relaxed">{t.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
