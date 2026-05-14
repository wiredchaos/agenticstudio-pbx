// MCP bridge — single dispatcher for studio "departments"
// Pexels + Open Library work immediately; Exa/Fastio return 501 until secrets added.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type Body = {
  provider: "exa" | "fastio" | "pexels" | "openlibrary";
  action: string;
  params?: Record<string, unknown>;
};

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function handlePexels(action: string, params: any) {
  const key = Deno.env.get("PEXELS_API_KEY");
  if (!key) return { status: 501, body: { error: "not_configured", missing_secret: "PEXELS_API_KEY" } };
  if (action !== "search") return { status: 400, body: { error: "unknown_action" } };
  const q = encodeURIComponent(String(params?.query ?? ""));
  const per = Math.min(Number(params?.per_page ?? 10), 20);
  const r = await fetch(`https://api.pexels.com/videos/search?query=${q}&per_page=${per}`, {
    headers: { Authorization: key },
  });
  return { status: r.status, body: await r.json() };
}

async function handleOpenLibrary(action: string, params: any) {
  if (action !== "search") return { status: 400, body: { error: "unknown_action" } };
  const q = encodeURIComponent(String(params?.query ?? ""));
  const r = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=10`);
  return { status: r.status, body: await r.json() };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }

  if (!body?.provider || !body?.action) return json(400, { error: "missing_provider_or_action" });

  try {
    switch (body.provider) {
      case "exa":
        return json(501, { error: "not_configured", missing_secret: "EXA_API_KEY" });
      case "fastio":
        return json(501, { error: "not_configured", missing_secret: "FASTIO_API_KEY" });
      case "pexels": {
        const r = await handlePexels(body.action, body.params || {});
        return json(r.status, r.body);
      }
      case "openlibrary": {
        const r = await handleOpenLibrary(body.action, body.params || {});
        return json(r.status, r.body);
      }
      default:
        return json(400, { error: "unknown_provider" });
    }
  } catch (e) {
    return json(500, { error: "bridge_error", message: String((e as Error).message) });
  }
});
