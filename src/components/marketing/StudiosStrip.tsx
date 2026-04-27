import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const studios = [
  { name: "MonkeY Teer Studio", founder: "Devin Teer", tagline: "Stillness held a beat too long.", slug: "monkey-teer", live: true },
  { name: "COBALT ROOM", founder: "—", tagline: "Coming soon.", slug: "cobalt-room", live: false },
  { name: "SECOND HAND PICTURES", founder: "—", tagline: "Coming soon.", slug: "second-hand", live: false },
  { name: "A FILM ABOUT NOTHING", founder: "—", tagline: "Coming soon.", slug: "about-nothing", live: false },
];

export function StudiosStrip() {
  return (
    <section id="studios" className="relative py-24 bg-black text-white">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-sm tracking-[0.3em] text-white/50 uppercase mb-3">The Roster</p>
          <h2 className="font-bagel text-4xl sm:text-5xl lg:text-6xl mb-12">Director-owned studios.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studios.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link to={`/studios/${s.slug}`} className={`group block glass-effect rounded-xl p-8 h-full ${!s.live && "opacity-60"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs tracking-widest text-white/50 uppercase mb-2">{s.live ? "Founding studio" : "Sister studio"}</p>
                    <h3 className="font-bagel text-2xl sm:text-3xl">{s.name}</h3>
                    <p className="text-white/70 mt-2">Founded by {s.founder}</p>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
                <p className="mt-8 text-lg text-white/80 italic">"{s.tagline}"</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
