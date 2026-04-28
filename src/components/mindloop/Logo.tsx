type Props = { size?: "sm" | "lg" };

/** Concentric circles logo for Mindloop. */
export function MindloopLogo({ size = "sm" }: Props) {
  const outer = size === "lg" ? "w-10 h-10" : "w-7 h-7";
  const inner = size === "lg" ? "w-5 h-5" : "w-3 h-3";
  return (
    <span className={`relative ${outer} rounded-full border-2 border-foreground/60 inline-flex items-center justify-center shrink-0`}>
      <span className={`${inner} rounded-full border border-foreground/60`} />
    </span>
  );
}
