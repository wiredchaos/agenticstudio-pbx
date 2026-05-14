import { ReelSection } from "@/components/agentic-landing/reel/ReelSection";
import { mergeTheme } from "@/lib/studioTheme";
import { hasFeature } from "@/lib/tier";

export function StudioReel({ studio }: { studio: any }) {
  if (!hasFeature(studio, "reel_3d")) return null;
  const videos = (studio.funnel?.reel_videos as any[]) || [];
  if (videos.length === 0) return null;

  const theme = mergeTheme(studio.brand_theme);
  return (
    <ReelSection
      videos={videos}
      accentHsl={theme.accent}
      eyebrow={`Featured Reel · ${studio.name}`}
      heading={
        <>
          The work of <em className="italic font-serif" style={{ color: `hsl(${theme.accent})` }}>{studio.founder_name || studio.name}</em>.
        </>
      }
      subheading={studio.tagline || "Watch the work."}
      defaultMix={theme.audio_mix}
    />
  );
}
