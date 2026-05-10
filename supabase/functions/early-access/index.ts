import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Production redirect target — do NOT trust caller-controlled Origin header.
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://agenticstudio.live";

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getClientIp(req: Request): string {
  // Use the LAST entry in x-forwarded-for (the one added by the trusted edge proxy)
  // to prevent spoofing via client-supplied prepended values.
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return "anon";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(url, serviceKey);

    const normalizedEmail = email.trim().toLowerCase();
    const ipHash = await sha256(getClientIp(req) + ":early-access");
    const emailHash = await sha256(normalizedEmail + ":early-access");

    // Rate limit: max 3 OTP requests per email OR per IP in the last 15 minutes.
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count: emailCount } = await admin
      .from("early_access_otp_log")
      .select("id", { count: "exact", head: true })
      .eq("email_hash", emailHash)
      .gte("created_at", fifteenMinAgo);
    const { count: ipCount } = await admin
      .from("early_access_otp_log")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", fifteenMinAgo);

    if ((emailCount ?? 0) >= 3 || (ipCount ?? 0) >= 5) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await admin.from("early_access").upsert({ email: normalizedEmail, source: "landing" }, { onConflict: "email" });

    const { error: otpErr } = await admin.auth.signInWithOtp({
      email: normalizedEmail,
      options: { emailRedirectTo: `${SITE_URL}/app` },
    });
    if (otpErr) console.error("otp error", otpErr);

    await admin.from("early_access_otp_log").insert({ ip_hash: ipHash, email_hash: emailHash });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("early-access error", e);
    return new Response(JSON.stringify({ error: "An internal error occurred" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
