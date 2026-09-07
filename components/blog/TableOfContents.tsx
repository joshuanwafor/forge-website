"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blog";
import { cn } from "@/lib/cn";

/** Sticky contents list with a scroll-spy highlight. */
export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Bias the band toward the top of the viewport so the active item is the
      // heading you are reading under, not the one just scrolling into view.
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-labelledby="toc-heading" className="text-sm">
      <h2
        id="toc-heading"
        className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-ink-400"
      >
        Contents
      </h2>
      <ul className="space-y-1 border-l border-white/8">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l py-1.5 pr-2 transition-colors",
                h.level === 3 ? "pl-7" : "pl-4",
                activeId === h.id
                  ? "border-ember-500 text-white"
                  : "border-transparent text-ink-400 hover:border-white/25 hover:text-ink-100"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
