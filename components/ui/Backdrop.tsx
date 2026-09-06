import { cn } from "@/lib/cn";

/**
 * Ambient hero backdrop: a masked grid, two slow ember glows and film grain.
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
          variant === "hero" ? "bg-ember-600/20" : "bg-ember-600/10"
        )}
      />
      <div
        className={cn(
          "absolute -bottom-52 right-[-10%] h-[32rem] w-[32rem] rounded-full blur-[130px] animate-drift",
          variant === "hero" ? "bg-amber-500/12" : "bg-amber-500/8"
        )}
        style={{ animationDelay: "-9s" }}
      />

      {/* Horizon line: a single bright hairline where the glow meets the page. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember-500/30 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950" />
      <div className="absolute inset-0 bg-grain" />
    </div>
  );
}
