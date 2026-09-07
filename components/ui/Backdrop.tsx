import { cn } from "@/lib/cn";

/**
 * Ambient hero backdrop: a masked grid, two slow glows and film grain.
 *
 * The glows are amber rather than the brand yellow on purpose — yellow thinned
 * out over near-black reads olive, so the warm haze sits behind and the yellow
 * itself stays where it is fully saturated: type, buttons and the horizon line.
 * Deliberately cheap — three composited layers, no per-particle DOM, and the
 * drift animation is disabled under prefers-reduced-motion (see globals.css).
 */
export function Backdrop({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "subtle";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-grid mask-radial-fade" />

      <div
        className={cn(
          "absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full blur-[120px] animate-drift",
          variant === "hero" ? "bg-amber-500/24" : "bg-amber-500/12"
        )}
      />
      <div
        className={cn(
          "absolute -bottom-52 right-[-10%] h-[32rem] w-[32rem] rounded-full blur-[130px] animate-drift",
          variant === "hero" ? "bg-ember-400/16" : "bg-ember-400/9"
        )}
        style={{ animationDelay: "-9s" }}
      />

      {/* Horizon line: a single bright hairline where the glow meets the page. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember-400/35 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950" />
      <div className="absolute inset-0 bg-grain" />
    </div>
  );
}
