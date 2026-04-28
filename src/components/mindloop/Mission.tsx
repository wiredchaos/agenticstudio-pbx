import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const MISSION_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4";

const P1 = "We're building a space where curiosity meets clarity — where readers find depth, writers find reach, and every newsletter becomes a conversation worth having.";
const P2 = "A platform where content, community, and insight flow together — with less noise, less friction, and more meaning for everyone involved.";
const HIGHLIGHT_WORDS = new Set(["curiosity", "meets", "clarity"]);

function ScrollWords({ text, baseClass, container }: { text: string; baseClass: string; container: React.RefObject<HTMLDivElement> }) {
  const { scrollYProgress } = useScroll({ target: container, offset: ["start 0.85", "end 0.4"] });
  const words = text.split(" ");
  return (
    <p className={baseClass}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        const stripped = w.replace(/[^a-zA-Z]/g, "").toLowerCase();
        const isHighlight = HIGHLIGHT_WORDS.has(stripped);
        return (
          <motion.span
            key={i}
            style={{ opacity, color: isHighlight ? "hsl(var(--foreground))" : "hsl(var(--hero-subtitle))" }}
            className="inline-block mr-2"
          >
            {w}
          </motion.span>
        );
      })}
    </p>
  );
}

export function Mission() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section id="philosophy" className="pt-0 pb-32 md:pb-44 px-6 md:px-12">
      <div className="flex justify-center mb-16">
        <video
          className="w-full max-w-[800px] aspect-square object-cover rounded-3xl"
          autoPlay muted loop playsInline
          src={MISSION_VIDEO}
        />
      </div>
      <div ref={ref} className="max-w-5xl mx-auto text-center">
        <ScrollWords container={ref} text={P1} baseClass="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px]" />
        <div className="h-10" />
        <ScrollWords container={ref} text={P2} baseClass="text-xl md:text-2xl lg:text-3xl font-medium mt-10" />
      </div>
    </section>
  );
}
