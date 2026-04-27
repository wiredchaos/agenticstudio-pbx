import { motion } from "framer-motion";

const agents = [
  { name: "NEXUS", role: "Orchestrator", model: "Hermes 4 405B", desc: "Coordinates the studio. Routes work across the four specialists. Surfaces the decisions that need you." },
  { name: "PRAXIS", role: "Director's Twin", model: "Hermes 4 405B + Runway Gen-4 / Act-Two", desc: "Generates shot lists and previz conditioned on your DNA. Compares 'generic' against 'you,' shot by shot." },
  { name: "SCRIBE", role: "Writer + Line Producer", model: "Hermes 4 70B", desc: "Breaks scripts into scenes, cast, locations, props, budgets, and insurance. Numbers you can defend." },
  { name: "ARCHITECT", role: "World Builder", model: "Hermes 4 70B + Runway plates", desc: "Plate references and real location suggestions. ShotDeck-style grid, location pin list." },
  { name: "EGOS", role: "Designer", model: "Hermes 4 70B + Runway stills", desc: "Wardrobe and character sheets. Pinterest-style moodboards. Looks before fittings." },
];

export function FiveAgents() {
  return (
    <section id="agents" className="relative py-24 bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-sm tracking-[0.3em] text-white/50 uppercase mb-3">The Five</p>
          <h2 className="font-bagel text-4xl sm:text-5xl lg:text-6xl mb-4">Five agents. One studio.</h2>
          <p className="text-white/70 text-lg max-w-2xl">Named, model-agnostic, opinionated. They handle the work no director wants to do — so you stay in the chair.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {agents.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass-effect rounded-xl p-8 hover:scale-[1.02] gentle-animation"
            >
              <p className="text-xs tracking-widest uppercase text-accent-blue mb-2">{a.role}</p>
              <h3 className="font-bagel text-3xl mb-4">{a.name}</h3>
              <p className="text-white/80 leading-relaxed">{a.desc}</p>
              <p className="text-xs text-white/40 mt-6 font-mono">{a.model}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
