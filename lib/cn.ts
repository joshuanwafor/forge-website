/** Tiny class-name joiner. Falsy values are dropped. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
