import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function EarlyAccess() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading"); setMsg("");
    try {
      const { error } = await supabase.functions.invoke("early-access", {
        body: { email },
      });
      if (error) throw error;
      setStatus("ok");
      setMsg("Magic link sent. Check your inbox.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMsg(err?.message ?? "Something went wrong.");
    }
  };

  return (
    <section id="early-access" className="relative bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "hsl(var(--gold))" }}>
          Early Access
        </p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">Open your studio.</h2>
        <p className="mt-4 text-muted-foreground">
          We'll send you a magic link — no passwords, no friction.
        </p>

        <form onSubmit={submit} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            className="flex-1 border bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
            style={{ borderColor: "hsl(var(--gold) / 0.4)" }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-7 py-3 text-xs uppercase tracking-[0.25em] text-black disabled:opacity-50"
            style={{ background: "hsl(var(--gold))" }}
          >
            {status === "loading" ? "Sending…" : "Get Access"}
          </button>
        </form>
        {msg && (
          <p className={`mt-4 text-xs uppercase tracking-[0.2em] ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}>
            {msg}
          </p>
        )}
        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          No spam. Unsubscribe any time.
        </p>
      </div>
    </section>
  );
}
