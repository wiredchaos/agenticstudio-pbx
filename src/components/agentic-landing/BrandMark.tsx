import { cn } from "@/lib/utils";

type Variant = "mark" | "lockup" | "wordmark";

interface BrandMarkProps {
  variant?: Variant;
  className?: string;
  shimmer?: boolean;
  glow?: boolean;
  size?: number;
}

const SRC: Record<Variant, string> = {
  mark: "/brand/agentic-mark.png",
  lockup: "/brand/agentic-lockup-on-black.png",
  wordmark: "/brand/agentic-wordmark.png",
};

export function BrandMark({
  variant = "mark",
  className,
  shimmer = true,
  glow = false,
  size,
}: BrandMarkProps) {
  return (
    <span
      className={cn(
        "inline-block align-middle brand-mark",
        shimmer && "brand-shimmer",
        glow && "brand-glow",
        className
      )}
      style={size ? { height: size } : undefined}
    >
      <img
        src={SRC[variant]}
        alt="Agentic Studios"
        className="block h-full w-auto select-none"
        draggable={false}
      />
    </span>
  );
}
