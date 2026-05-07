import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function PraxisDemo() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true); setError(null); setOutput("");
    try {
      const { data, error } = await supabase.functions.invoke("praxis-demo", {
        body: { prompt },
      });
      if (error) throw error;
      setOutput((data as any)?.output ?? "");
    } catch (e: any) {
      setError(e?.message ?? "Demo unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "hsl(var(--gold))" }}>
          Live Demo
        </p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">Try PRAXIS</h2>
        <p className="mt-4 text-muted-foreground">
          Describe a scene in one or two sentences. PRAXIS will generate a cinematic shot list in
          real time — no sign-up required.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
          rows={5}
          placeholder="A lone figure walks across a salt flat at dusk…"
          className="mt-8 w-full resize-none border bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          style={{ borderColor: "hsl(var(--gold) / 0.4)" }}
        />
        <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>{prompt.length}/500 · 3 free demo runs per hour</span>
          <button
            onClick={submit}
            disabled={loading || !prompt.trim()}
            className="px-5 py-2 text-black transition disabled:opacity-50"
            style={{ background: "hsl(var(--gold))" }}
          >
            {loading ? "Generating…" : "Generate Shot List"}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        {output && (
          <pre className="mt-8 whitespace-pre-wrap border p-6 font-sans text-sm text-foreground"
               style={{ borderColor: "hsl(var(--gold) / 0.3)" }}>
            {output}
          </pre>
        )}
      </div>
    </section>
  );
}
