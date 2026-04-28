import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Link } from "react-router-dom";
import { fadeUp } from "@/lib/animations";
import { MindloopLogo } from "./Logo";

const HLS_URL = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

export function CTA() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(HLS_URL);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_URL;
    }
  }, []);

  return (
    <section className="relative overflow-hidden py-32 md:py-44 border-t border-border/30">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay muted loop playsInline
      />
      <div className="absolute inset-0 bg-background/45 z-[1]" />
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div {...fadeUp(0)}>
          <MindloopLogo size="lg" />
        </motion.div>
        <motion.h2 {...fadeUp(0.05)} className="text-5xl md:text-7xl mt-8 font-medium tracking-[-1.5px] text-foreground">
          Start Your <span className="font-serif italic font-normal">Journey</span>
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="text-muted-foreground text-lg mt-5 max-w-xl">
          Join writers and readers building a calmer, deeper feed.
        </motion.p>
        <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-3 mt-10 justify-center">
          <Link to="/auth" className="bg-foreground text-background rounded-lg px-8 py-3.5 font-semibold text-sm hover:opacity-90 transition-opacity">
            Subscribe Now
          </Link>
          <Link to="/auth" className="liquid-glass text-foreground rounded-lg px-8 py-3.5 font-semibold text-sm">
            Start Writing
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
