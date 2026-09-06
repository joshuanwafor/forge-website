import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 " +
  "focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

const variants: Record<Variant, string> = {
  primary:
    "bg-ember-500 text-white shadow-[0_8px_30px_-8px_rgb(255_90_15_/_0.6)] hover:bg-ember-400 hover:shadow-[0_12px_40px_-8px_rgb(255_90_15_/_0.75)] active:bg-ember-600",
  secondary:
    "border border-white/15 bg-white/5 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/10",
  ghost: "text-ink-300 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type StyleProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = StyleProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

type LinkProps = StyleProps & {
  href: string;
  /** Force a plain <a> even for an internal-looking path. */
  external?: boolean;
};

/** `next/link` can't handle these — they leave the app or move within the page. */
function needsPlainAnchor(href: string) {
  return (
    href.startsWith("#") ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

/**
 * One button. Renders a <button>, a <Link>, or an <a> depending on the props,
 * so every call site gets the same styling and focus treatment.
 */
export function Button(props: ButtonProps | LinkProps) {
  const classes = cn(
    base,
    variants[props.variant ?? "primary"],
    sizes[props.size ?? "md"],
    props.className
  );

  if (props.href !== undefined) {
    const { href, external, children } = props as LinkProps;

    if (external || needsPlainAnchor(href)) {
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          className={classes}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant, size, className, children, href, ...buttonProps } = props as ButtonProps;
  void variant;
  void size;
  void className;
  void href;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 transition-transform group-hover:translate-x-0.5", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
