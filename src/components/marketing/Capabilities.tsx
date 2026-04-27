import { motion } from "framer-motion";
import { Aperture, FileText, MapPin, Shirt, Send } from "lucide-react";

const caps = [
  { icon: Aperture, name: "Director's Twin", desc: "Shot lists, previz, blocking — conditioned on your archive. PRAXIS-led." },
  { icon: FileText, name: "Line Producing", desc: "Scene breakdowns, cast and agency fees, locations, budgets, E&O. SCRIBE-led." },
  { icon: MapPin, name: "World Building", desc: "Plate libraries, real-location scouting, ShotDeck-style references. ARCHITECT-led." },
  { icon: Shirt, name: "Wardrobe & Character", desc: "Looks before fittings, character sheets, color stories. EGOS-led." },
  { icon: Send, name: "Distribution", desc: "Social, festivals, on-chain inscription, licensing — queued and tracked." },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="relative py-24 bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-sm tracking-[0.3em] text-white/50 uppercase mb-3">Capabilities</p>
          <h2 className="font-bagel text-4xl sm:text-5xl lg:text-6xl mb-12">What the studio does for you.</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {caps.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass-effect rounded-xl p-8 hover:scale-[1.02] gentle-animation"
            >
              <c.icon className="w-7 h-7 text-accent-emerald mb-5" />
              <h3 className="text-xl font-bold mb-2">{c.name}</h3>
              <p className="text-white/70 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
