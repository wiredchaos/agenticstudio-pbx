import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const HERO_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4";

export function Hero() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const { error } = await supabase.from("subscribers").insert({ email, source: "hero" });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") toast.success("You're already on the list — thanks!");
      else toast.error("Something went wrong. Try again?");
      return;
    }
    toast.success("Subscribed. Welcome to Mindloop.");
    setEmail("");
  };

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-background">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline
        src={HERO_VIDEO}
      />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="relative z-10 pt-28 md:pt-32 px-6 md:px-12 flex flex-col items-center text-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="flex -space-x-2">
            {["#3a3a3a", "#5a5a5a", "#7a7a7a"].map((c, i) => (
              <span key={i} className="w-8 h-8 rounded-full border-2 border-background" style={{ background: c }} />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">7,000+ people already subscribed</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] text-foreground max-w-5xl"
        >
          Get <span className="font-serif italic font-normal">Inspired</span> with Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg text-hero-subtitle max-w-2xl"
        >
          Join our feed for meaningful updates, news around technology and a shared journey toward depth and direction.
        </motion.p>

        <motion.form
          onSubmit={onSubscribe}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="liquid-glass rounded-full p-2 max-w-lg w-full mt-10 flex items-center gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="flex-1 bg-transparent outline-none px-5 py-3 text-foreground placeholder:text-muted-foreground"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="bg-foreground text-background rounded-full px-8 py-3 text-sm font-semibold tracking-wide disabled:opacity-60"
          >
            {submitting ? "..." : "SUBSCRIBE"}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
