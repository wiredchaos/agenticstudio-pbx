export function FilmStripRail({ side }: { side: "left" | "right" }) {
  const sprockets = Array.from({ length: 24 });
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-0 ${side}-0 z-10 hidden h-full w-6 flex-col justify-around py-4 md:flex`}
      style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0))" }}
    >
      {sprockets.map((_, i) => (
        <div
          key={i}
          className="mx-auto h-3 w-3 rounded-[2px]"
          style={{ background: "rgba(201,165,58,0.55)" }}
        />
      ))}
    </div>
  );
}
