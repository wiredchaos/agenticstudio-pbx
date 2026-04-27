import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => { document.title = "Open Your Studio — Agentic Studios"; }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-6 h-6 text-white/60 animate-spin" /></div>;
  if (user) {
    const from = (location.state as any)?.from?.pathname || "/app";
    return <Navigate to={from} replace />;
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/onboarding` },
    });
    setSending(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
    toast.success("Magic link sent. Check your inbox.");
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-effect rounded-xl p-10">
        <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-3">Agentic Studios</p>
        <h1 className="font-bagel text-4xl mb-2">Open your studio.</h1>
        <p className="text-white/60 mb-8">We'll email you a magic link. No passwords.</p>
        {sent ? (
          <div className="bg-white/5 rounded-lg p-6 text-center">
            <Mail className="w-8 h-8 mx-auto mb-3 text-accent-emerald" />
            <p className="text-white">Check {email}</p>
            <p className="text-white/50 text-sm mt-2">Click the link to come back signed in.</p>
          </div>
        ) : (
          <form onSubmit={send} className="space-y-4">
            <input type="email" required placeholder="director@yourstudio.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
            <button type="submit" disabled={sending} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md disabled:opacity-50 gentle-animation">
              {sending ? "Sending..." : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
