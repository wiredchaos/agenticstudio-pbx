import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const SOLUTION_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4";

const FEATURES = [
  { title: "Curated Feed", desc: "Hand-picked, model-friendly writing surfaced where it matters." },
  { title: "Writer Tools", desc: "Drafting, distribution and analytics in a single quiet workspace." },
  { title: "Community", desc: "Conversation threads beneath every essay — readers who stay." },
  { title: "Distribution", desc: "Native posting to the platforms and models that shape discovery." },
];

export function Solution() {
  return (
    <section id="use-cases" className="px-6 md:px-12 py-32 md:py-44 border-t border-border/30 max-w-7xl mx-auto">
      <motion.p {...fadeUp(0)} className="text-xs tracking-[3px] uppercase text-muted-foreground">SOLUTION</motion.p>
      <motion.h2 {...fadeUp(0.05)} className="text-4xl md:text-6xl mt-4 font-medium tracking-[-1px] text-foreground max-w-4xl">
        The platform for <span className="font-serif italic font-normal">meaningful</span> content
      </motion.h2>
      <motion.div {...fadeUp(0.15)} className="mt-14">
        <video
          className="w-full aspect-[3/1] object-cover rounded-2xl"
          autoPlay muted loop playsInline
          src={SOLUTION_VIDEO}
        />
      </motion.div>
      <div className="grid md:grid-cols-4 gap-8 mt-16">
        {FEATURES.map((f, i) => (
          <motion.div key={f.title} {...fadeUp(0.2 + i * 0.06)}>
            <p className="font-semibold text-base text-foreground">{f.title}</p>
            <p className="text-muted-foreground text-sm mt-2">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
