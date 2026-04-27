import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function OpenStudio() {
  return (
    <section id="open" className="relative py-32 bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <p className="text-sm tracking-[0.3em] text-white/50 uppercase mb-3">Open your studio</p>
          <h2 className="font-bagel text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mb-8">
            Bring your archive.<br /><span className="opacity-50">We'll bring the studio.</span>
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl">
            Sign in with email. We'll spin up your five agents, point them at your work, and hand you the keys.
            Stay managed, or run sovereign on your own infrastructure.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/auth" className="group inline-flex items-center gap-3 bg-red-600 text-white font-semibold px-7 py-4 rounded-md hover:bg-red-700 gentle-animation">
              Open your studio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="mailto:press@agenticstudios.io" className="inline-flex items-center gap-3 glass-effect text-white font-semibold px-7 py-4 rounded-md hover:bg-white/20 gentle-animation">
              Press &amp; partnerships
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
