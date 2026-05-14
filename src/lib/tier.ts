import type { StudioFunnel } from "./studioTheme";

export type StudioTier = "basic" | "premium";

const BASIC_ALLOWED: (keyof StudioFunnel)[] = ["email_capture"];
const PREMIUM_ONLY: (keyof StudioFunnel)[] = ["reel_3d"];

export function hasFeature(
  studio: { tier?: string | null; funnel?: StudioFunnel | null } | null | undefined,
  key: keyof StudioFunnel
): boolean {
  if (!studio) return false;
  const tier = (studio.tier as StudioTier) || "basic";
  if (tier === "premium") return Boolean(studio.funnel?.[key]);
  return BASIC_ALLOWED.includes(key);
}

export function isPremium(studio: { tier?: string | null } | null | undefined) {
  return studio?.tier === "premium";
}
