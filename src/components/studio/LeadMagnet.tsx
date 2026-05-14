import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function LeadMagnet({ studioSlug, headline, body }: { studioSlug: string; headline?: string; body?: string }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    const { error } = await supabase.from("early_access").insert({ email, source: `studio:${studioSlug}` });
    setBusy(false);
    if (error) return toast.error("Couldn't subscribe — try again.");
    setEmail("");
    toast.success("You're on the list.");
  }

  return (
    <section className="border-y border-white/10 px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "var(--brand-display)" }}>
          {headline || "Get the next drop first."}
        </h2>
        <p className="mt-3 opacity-70">{body || "Early access to new films, voice models, and behind-the-scenes."}</p>
        <form onSubmit={submit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            className="flex-1 bg-transparent border border-white/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-current"
          />
          <button
            type="submit"
            disabled={busy}
            className="px-6 py-3 rounded-md text-sm font-semibold transition disabled:opacity-50"
            style={{ background: `hsl(var(--accent))`, color: `hsl(var(--background))` }}
          >
            {busy ? "Sending…" : "Notify me"}
          </button>
        </form>
      </div>
    </section>
  );
}
