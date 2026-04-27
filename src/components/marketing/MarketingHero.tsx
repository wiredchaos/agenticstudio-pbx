import { motion } from "framer-motion";
import { Volume2, VolumeX, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export function MarketingHero() {
  const [isMuted, setIsMuted] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = isMuted ? 0 : 0.7;
    }
  }, [isMuted]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: "Studios", href: "#studios" },
    { label: "Agents", href: "#agents" },
    { label: "Manifesto", href: "#manifesto" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Founders", href: "#founders" },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* TODO: swap MOJJU moon video for Devin Teer's reel before final deck. */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-110"
        autoPlay muted loop playsInline
      >
        <source src="https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 w-full z-[110]"
      >
        <div className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"}`}>
          <div className="flex items-center justify-between">
            <Link to="/" className="font-bagel text-white text-xl tracking-wider">AGENTIC<span className="opacity-60"> STUDIOS</span></Link>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((n) => (
                <a key={n.label} href={n.href} className="text-white/90 hover:text-white font-medium gentle-animation hover:scale-105">{n.label}</a>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button onClick={() => setIsMuted(!isMuted)} className="glass-effect p-3 rounded-full text-white hover:bg-white/20 gentle-animation">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <Link to="/auth" className="hidden sm:block bg-red-600 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-md hover:bg-red-700 gentle-animation">
                Open Your Studio
              </Link>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden glass-effect p-3 rounded-full text-white">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-[80]" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isMobileMenuOpen ? "0%" : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-black/90 backdrop-blur-xl border-l border-white/10 z-[90]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full px-6 pt-20 pb-8">
          {navItems.map((n) => (
            <a key={n.label} href={n.href} className="px-4 py-3 text-white text-lg hover:bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>{n.label}</a>
          ))}
          <Link to="/auth" className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg mt-6 text-center" onClick={() => setIsMobileMenuOpen(false)}>
            Open Your Studio
          </Link>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-24 left-6 sm:left-8 lg:left-12 z-40 max-w-3xl"
      >
        <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.95] text-white text-shadow-strong">
          <span className="block">THE STUDIO</span>
          <span className="block">RUNS ITSELF.</span>
          <span className="block opacity-80">SO YOU CAN DIRECT.</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-white/80 max-w-xl text-shadow-medium">
          Agentic Studios — a platform of director-owned AI studios. Built on open infrastructure.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/auth" className="bg-red-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-red-700 gentle-animation">
            Open Your Studio
          </Link>
          <Link to="/studios/monkey-teer" className="glass-effect text-white font-semibold px-6 py-3 rounded-md hover:bg-white/20 gentle-animation">
            See Devin Teer's Studio →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
