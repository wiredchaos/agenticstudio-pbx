import { ReactNode } from "react";
import { themeStyle, type BrandTheme, mergeTheme } from "@/lib/studioTheme";
import { cn } from "@/lib/utils";

interface Props {
  theme?: BrandTheme | null;
  children: ReactNode;
  className?: string;
  asMain?: boolean;
}

export function StudioThemeProvider({ theme, children, className, asMain }: Props) {
  const Tag: any = asMain ? "main" : "div";
  return (
    <Tag data-studio-theme className={cn("min-h-screen", className)} style={themeStyle(theme)}>
      {children}
    </Tag>
  );
}

export function useBrand(theme?: BrandTheme | null) {
  return mergeTheme(theme);
}
