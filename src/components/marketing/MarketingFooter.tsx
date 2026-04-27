import { Link } from "react-router-dom";

const stack = ["Hermes 4 405B", "Hermes 4 70B", "Runway Gen-4", "Runway Act-Two", "Anthropic (optional)", "OpenRouter", "Supabase Realtime", "Open infrastructure"];

export function MarketingFooter() {
  return (
    <footer className="relative py-20 bg-zinc-950 text-white border-t border-white/10">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 md:col-span-5">
            <div className="font-bagel text-3xl tracking-wider mb-4">AGENTIC <span className="opacity-60">STUDIOS</span></div>
            <p className="text-white/60 leading-relaxed mb-6 max-w-md">
              A platform of director-owned AI studios. Five named agents handle the work no director wants to do — so you stay in the chair.
            </p>
            <div className="flex gap-4">
              <Link to="/auth" className="bg-red-600 px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-700">Open your studio</Link>
              <Link to="/studios" className="glass-effect px-5 py-2 rounded-md text-sm font-semibold hover:bg-white/20">Browse studios</Link>
            </div>
          </div>

          <div className="col-span-6 md:col-span-3">
            <h4 className="text-sm tracking-widest uppercase text-white/40 mb-4">Platform</h4>
            <ul className="space-y-3 text-white/80">
              <li><Link to="/studios" className="hover:text-white">Studios</Link></li>
              <li><Link to="/studios/monkey-teer" className="hover:text-white">MonkeY Teer Studio</Link></li>
              <li><a href="#agents" className="hover:text-white">The Five Agents</a></li>
              <li><a href="#manifesto" className="hover:text-white">Manifesto</a></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-4">
            <h4 className="text-sm tracking-widest uppercase text-white/40 mb-4">Default model stack</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-white/70">
              {stack.map((s) => (<div key={s}>{s}</div>))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-16 flex flex-col md:flex-row justify-between items-center text-xs text-white/40">
          <div>© 2026 Agentic Studios. Directors keep the archive.</div>
          <div className="font-mono">v0.1 — Built on open infrastructure.</div>
        </div>
      </div>
    </footer>
  );
}
