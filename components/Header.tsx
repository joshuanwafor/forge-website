"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Button, ArrowIcon } from "@/components/ui/Button";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const isActive = (href: string) =>
    href.startsWith("/#") ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-white/8 bg-ink-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-ink-950/80 to-transparent"
      )}
    >
      <nav aria-label="Main" className="container-page">
        <div className="flex h-[72px] items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex shrink-0 items-center" aria-label={`Forge home`}>
              <Image
                src="/forgetext.svg"
                alt="Forge"
                width={110}
                height={40}
                priority
                className="h-7 w-auto"
              />
            </Link>

            <ul className="hidden items-center gap-1 md:flex">
              {mainNav.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href) && item.href !== "/#spaces" && item.href !== "/#pricing"
                        ? "text-white"
                        : "text-ink-300 hover:text-white"
                    )}
                  >
                    {item.name}
                    {isActive(item.href) &&
                    item.href !== "/#spaces" &&
                    item.href !== "/#pricing" ? (
                      <span className="absolute inset-x-3 -bottom-px h-px bg-ember-500" />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button href="/waitlist" variant="ghost" size="sm">
              Join waitlist
            </Button>
            <Button href="/tour" size="sm">
              Book a tour
              <ArrowIcon />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="-mr-2 rounded-lg p-2.5 text-white transition-colors hover:bg-white/10 md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </nav>

      {isOpen ? (
        <div
          id="mobile-menu"
          className="animate-fade-in border-t border-white/8 bg-ink-950/95 backdrop-blur-xl md:hidden"
        >
          <div className="container-page py-5">
            <ul className="space-y-1">
              {mainNav.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-ink-200 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid gap-3 border-t border-white/8 pt-5" onClick={close}>
              <Button href="/tour" size="lg" className="w-full">
                Book a tour
                <ArrowIcon />
              </Button>
              <Button href="/waitlist" variant="secondary" size="lg" className="w-full">
                Join the waitlist
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
