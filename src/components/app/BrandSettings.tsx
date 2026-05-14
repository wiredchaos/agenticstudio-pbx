import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { mergeTheme, type BrandTheme, type StudioFunnel } from "@/lib/studioTheme";
import { isPremium } from "@/lib/tier";
import { StudioThemeProvider } from "@/components/studio/StudioThemeProvider";
import { Lock } from "lucide-react";

const FONTS = ["Instrument Serif", "Inter", "DM Serif Display", "Space Grotesk", "Bebas Neue", "Cormorant Garamond", "Archivo Black", "Playfair Display"];

export function BrandSettings({ studio, onSaved }: { studio: any; onSaved?: () => void }) {
  const premium = isPremium(studio);
  const [theme, setTheme] = useState<BrandTheme>(mergeTheme(studio.brand_theme));
  const [funnel, setFunnel] = useState<StudioFunnel>(studio.funnel || {});
  const [busy, setBusy] = useState(false);

  if (!premium) {
    return (
      <div className="glass-effect rounded-xl p-6 space-y-3 border border-white/10">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-white/50" />
          <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">Brand & Funnel — Premium</h2>
        </div>
        <p className="text-white/70 text-sm">
          Unlock per-studio colors, fonts, hero video, lead-magnet capture, pricing CTAs, and testimonials on your public profile.
        </p>
        <a href="/manifesto" className="inline-block text-xs uppercase tracking-widest text-accent-blue hover:text-white transition">
          Request premium →
        </a>
      </div>
    );
  }

  function set<K extends keyof BrandTheme>(k: K, v: BrandTheme[K]) {
    setTheme((t) => ({ ...t, [k]: v }));
  }
  function setF<K extends keyof StudioFunnel>(k: K, v: StudioFunnel[K]) {
    setFunnel((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setBusy(true);
    const { error } = await supabase.from("studios").update({ brand_theme: theme, funnel }).eq("id", studio.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Brand saved");
    onSaved?.();
  }

  return (
    <div className="glass-effect rounded-xl p-6 space-y-5">
      <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">Brand identity</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HSLField label="Primary (H S% L%)" value={theme.primary || ""} onChange={(v) => set("primary", v)} />
        <HSLField label="Accent" value={theme.accent || ""} onChange={(v) => set("accent", v)} />
        <HSLField label="Background" value={theme.background || ""} onChange={(v) => set("background", v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField label="Display font" value={theme.display_font || ""} onChange={(v) => set("display_font", v)} options={FONTS} />
        <SelectField label="Body font" value={theme.body_font || ""} onChange={(v) => set("body_font", v)} options={FONTS} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Logo URL" value={theme.logo_url || ""} onChange={(v) => set("logo_url", v)} />
        <TextField label="Wordmark URL" value={theme.wordmark_url || ""} onChange={(v) => set("wordmark_url", v)} />
      </div>

      <div className="border-t border-white/10 pt-5 space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-white/50">Hero media</h3>
        <p className="text-xs text-white/40">
          Upload a looped video (MP4/WebM, ≤ 20MB) or image. Reduced-motion visitors see the poster (or first frame) instead.
        </p>

        <MediaUploader
          studioId={studio.id}
          label="Hero video / image"
          accept="video/*,image/*"
          currentUrl={theme.hero_media_url || ""}
          onUploaded={(url, kind) => {
            set("hero_media_url", url);
            set("hero_media_kind", kind);
          }}
          onClear={() => {
            set("hero_media_url", "");
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <TextField label="Hero media URL (override)" value={theme.hero_media_url || ""} onChange={(v: string) => set("hero_media_url", v)} />
          </div>
          <SelectField label="Kind" value={theme.hero_media_kind || "image"} onChange={(v: string) => set("hero_media_kind", v as any)} options={["image", "video"]} />
        </div>

        <MediaUploader
          studioId={studio.id}
          label="Reduced-motion poster (image)"
          accept="image/*"
          currentUrl={theme.hero_poster_url || ""}
          onUploaded={(url) => set("hero_poster_url", url)}
          onClear={() => set("hero_poster_url", "")}
        />
      </div>

      <div className="border-t border-white/10 pt-5 space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-white/50">Funnel features</h3>
        <Toggle label="Lead magnet (email capture)" checked={!!funnel.lead_magnet} onChange={(v) => setF("lead_magnet", v)} />
        <Toggle label="Pricing / CTA block" checked={!!funnel.pricing_block} onChange={(v) => setF("pricing_block", v)} />
        <Toggle label="Testimonials" checked={!!funnel.testimonials} onChange={(v) => setF("testimonials", v)} />
        <Toggle label="Custom-domain CTA" checked={!!funnel.custom_domain_cta} onChange={(v) => setF("custom_domain_cta", v)} />
      </div>

      <div className="border-t border-white/10 pt-5">
        <h3 className="text-xs uppercase tracking-widest text-white/50 mb-3">Live preview</h3>
        <StudioThemeProvider theme={theme} className="rounded-lg overflow-hidden border border-white/10 !min-h-0">
          <div className="p-8">
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-60">Studio</p>
            <div className="text-3xl mt-2" style={{ fontFamily: "var(--brand-display)" }}>{studio.name}</div>
            <p className="opacity-70 mt-2">"{studio.tagline || "Your tagline here"}"</p>
            <button className="mt-5 px-5 py-2 rounded-md text-sm font-semibold" style={{ background: "hsl(var(--accent))", color: "hsl(var(--background))" }}>
              Call to action
            </button>
          </div>
        </StudioThemeProvider>
      </div>

      <button onClick={save} disabled={busy} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-3 rounded-md font-semibold">
        {busy ? "Saving…" : "Save brand"}
      </button>
    </div>
  );
}

function TextField({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-2.5 text-white text-sm" />
    </div>
  );
}
function HSLField(props: any) {
  return <TextField {...props} />;
}
function SelectField({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-2.5 text-white text-sm">
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/80">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function MediaUploader({
  studioId,
  label,
  accept,
  currentUrl,
  onUploaded,
  onClear,
}: {
  studioId: string;
  label: string;
  accept: string;
  currentUrl: string;
  onUploaded: (url: string, kind: "image" | "video") => void;
  onClear: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File too large (max 20 MB)");
      return;
    }
    const kind: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
    const ext = file.name.split(".").pop()?.toLowerCase() || (kind === "video" ? "mp4" : "jpg");
    const path = `${studioId}/${crypto.randomUUID()}.${ext}`;
    setBusy(true);
    const { error } = await supabase.storage.from("studio-media").upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    const { data } = supabase.storage.from("studio-media").getPublicUrl(path);
    setBusy(false);
    onUploaded(data.publicUrl, kind);
    toast.success(`${label} uploaded`);
  }

  const isVideo = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(currentUrl);
  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-widest text-white/40">{label}</label>
      <div className="flex items-start gap-3">
        {currentUrl ? (
          <div className="w-32 h-20 overflow-hidden rounded-md border border-white/10 bg-black/40 shrink-0">
            {isVideo ? (
              <video src={currentUrl} muted playsInline preload="metadata" className="w-full h-full object-cover" />
            ) : (
              <img src={currentUrl} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        ) : (
          <div className="w-32 h-20 rounded-md border border-dashed border-white/15 bg-black/30 flex items-center justify-center text-[10px] uppercase tracking-widest text-white/30 shrink-0">
            None
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="inline-flex items-center justify-center cursor-pointer text-xs uppercase tracking-widest border border-white/20 hover:border-white/40 rounded-md px-4 py-2 text-white/80 hover:text-white transition disabled:opacity-50">
            <input type="file" accept={accept} className="hidden" onChange={onFile} disabled={busy} />
            {busy ? "Uploading…" : currentUrl ? "Replace" : "Upload"}
          </label>
          {currentUrl && (
            <button
              type="button"
              onClick={onClear}
              className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white/70 transition text-left"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
