import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const PLATFORMS = [
  { name: "ChatGPT", desc: "Conversational answers replacing the ten blue links.", initials: "GPT" },
  { name: "Perplexity", desc: "Cited research that compresses an afternoon into a paragraph.", initials: "PX" },
  { name: "Google AI", desc: "Synthesised overviews above the search results you used to click.", initials: "G" },
];

export function SearchChanged() {
  return (
    <section id="how" className="px-6 md:px-12 pt-52 md:pt-64 pb-6 md:pb-9 text-center">
      <motion.h2 {...fadeUp(0)} className="text-5xl md:text-7xl lg:text-8xl tracking-[-2px] font-medium text-foreground">
        Search has <span className="font-serif italic font-normal">changed.</span> Have you?
      </motion.h2>
      <motion.p {...fadeUp(0.1)} className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6 mb-24">
        The first place readers go for an answer is no longer a search bar. It's a model. If your work isn't in the training set, it isn't in the conversation.
      </motion.p>
      <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-20 max-w-5xl mx-auto">
        {PLATFORMS.map((p, i) => (
          <motion.div key={p.name} {...fadeUp(0.15 + i * 0.08)} className="flex flex-col items-center">
            {/* TODO: replace placeholder badge with /assets/icon-{name}.png */}
            <div className="w-[200px] h-[200px] liquid-glass rounded-3xl flex items-center justify-center mb-6">
              <span className="font-serif italic text-5xl text-foreground/80">{p.initials}</span>
            </div>
            <p className="font-semibold text-base text-foreground">{p.name}</p>
            <p className="text-muted-foreground text-sm mt-2 max-w-xs">{p.desc}</p>
          </motion.div>
        ))}
      </div>
      <motion.p {...fadeUp(0.4)} className="text-muted-foreground text-sm">
        If you don't answer the questions, someone else will.
      </motion.p>
    </section>
  );
}
