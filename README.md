# Forge Website

Marketing site for Forge — a workspace in Lagos. Next.js 16 (App Router), Tailwind CSS 3,
TypeScript, with a file-based blog and Supabase-backed lead capture.

> **Scope note:** Forge no longer runs the Academy or the Courses programme. Those pages, the
> course application form and the Paystack integration were removed in the hub-only rework —
> see `lib/migrations/2026-09-remove-courses.sql` for the database side.

## Getting started

```bash
yarn install
cp .env.example .env.local   # then fill in your keys
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

Forms need Supabase (see [SETUP.md](SETUP.md)). Without it the site still runs — the API routes
return a clean "temporarily unavailable" response instead of crashing.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Home — spaces, pricing, community, FAQ |
| `/about` | Story, values, team |
| `/blog` | Post index with topic filters |
| `/blog/[slug]` | Post, with contents sidebar and related posts |
| `/blog/tag/[tag]` | Posts for one topic |
| `/blog/rss.xml` | RSS feed |
| `/tour` | Book a visit |
| `/waitlist` | Join the waitlist |
| `/privacy` | Privacy notice |
| `/sitemap.xml`, `/robots.txt` | Generated from `app/sitemap.ts` and `app/robots.ts` |

API routes: `POST /api/tour`, `POST /api/waitlist`, `POST /api/subscribe`.

## Writing a blog post

Posts are markdown files in `content/blog/`. The filename is the URL slug —
`content/blog/why-we-built-forge.md` becomes `/blog/why-we-built-forge`.

```markdown
---
title: "Why we built Forge"
description: "One or two sentences. Used on cards, in search results and in the social card."
date: "2026-08-18"          # required, ISO
updated: "2026-08-20"       # optional
author: "David Okechukwu"
authorRole: "Founder"        # optional
tags: ["Forge", "Community"]
featured: true               # optional — pins to the top of /blog
draft: false                 # optional — drafts are hidden in production only
cover: "/blog/cover.jpg"     # optional
---

Body in standard markdown. GitHub-flavoured: tables, task lists, strikethrough.
```

You get for free, with no extra work:

- **Static generation** for every post and topic page at build time.
- **Table of contents** built from your `##` and `###` headings, with scroll-spy.
- **Reading time** (~200 wpm) and formatted dates.
- **Syntax highlighting** in fenced code blocks.
- **Related posts** ranked by shared tags, plus previous/next links.
- **A social card** rendered per post — see `app/blog/[slug]/opengraph-image.tsx`.
- **RSS and sitemap** entries.

Everything that reads the content lives in [`lib/blog.ts`](lib/blog.ts).

## Design system

Tokens live in `tailwind.config.ts` and `app/globals.css`.

- **Colour** — `ink` (neutral ramp, `ink-950` is the page) and `ember` (the brand yellow, the
  single accent). Accent is for emphasis only; body copy is always from the `ink` ramp. Solid
  yellow fills take `text-ink-950` — white on yellow is about 1.9:1. Ambient glows are amber
  rather than yellow, because yellow thinned out over near-black reads olive.
- **Type** — Space Grotesk for display (`font-display`), Inter for body, JetBrains Mono for
  labels and metadata (`font-mono`).
- **Motion** — one shared `Reveal` component (`components/ui/Reveal.tsx`) and two slow ambient
  gradients in `components/ui/Backdrop.tsx`. Everything is disabled under
  `prefers-reduced-motion`.
- **Primitives** — `components/ui/` holds `Button`, `Section`/`Container`/`Eyebrow`/
  `SectionHeading`, `Field`/`Input`/`Select`/`Textarea`, `Backdrop` and `Reveal`. Reach for these
  before writing new one-off markup.

Site-wide copy, navigation, team and contact details are in [`lib/site.ts`](lib/site.ts).

## Project structure

```
app/
├── page.tsx              # Home
├── about/                # About
├── blog/                 # Index, [slug], tag/[tag], rss.xml, per-post OG image
├── tour/                 # Tour booking form
├── waitlist/             # Waitlist form
├── privacy/              # Privacy notice
├── api/                  # tour, waitlist, subscribe
├── sitemap.ts, robots.ts
├── layout.tsx            # Fonts, metadata, skip link
└── globals.css           # Tokens, utilities, prose styles

components/
├── Header.tsx, Footer.tsx, NewsletterForm.tsx
├── ui/                   # Design-system primitives
├── home/                 # Pricing tabs, FAQ
└── blog/                 # Post cards, table of contents, share links

content/blog/             # Markdown posts
lib/
├── blog.ts               # Markdown pipeline, tags, related posts
├── site.ts               # Site config and copy
├── leads.ts              # Form validation + Zoho sync
├── supabase.ts, supabase-server.ts
├── supabase-schema.sql   # Fresh-project schema
└── migrations/           # Incremental SQL
```

## Environment variables

See `.env.example`. Supabase is required for the forms; Zoho is optional and silently skipped
when unset.

`NEXT_PUBLIC_SITE_URL` is the canonical origin and feeds canonical tags, the sitemap, RSS and
the absolute `og:image` URL. It must be set **at build time** — `NEXT_PUBLIC_*` values are
inlined by `next build`, so setting it only on the running server has no effect. Unset, it
falls back to Vercel's own deployment domain and then to `http://localhost:3000`; there is no
hardcoded domain, deliberately, because a stale one silently points every share at a site you
do not own.

## Social cards

- **Every page except blog posts** uses `public/og/card.jpg`, a static 1200x630 JPEG wired up
  in `app/layout.tsx`. It is a static file rather than a generated route because
  `ImageResponse` only emits PNG, and a 630KB PNG of a photograph is above the size WhatsApp
  reliably fetches — the same card as JPEG is about 126KB.
- **Blog posts** get a generated card per post from `app/blog/[slug]/opengraph-image.tsx`.
  Those are text-only and small enough to serve as PNG.

To change the site card, edit `app/og-card-source/route.tsx` (the layout is React, rendered by
satori) and re-export it:

```bash
yarn dev
curl -s localhost:3000/og-card-source | sips -s format jpeg -s formatOptions 92 --out public/og/card.jpg
```

That route 404s in production; it exists only as the regeneration source. The photograph it
composites is `public/og/hub.jpg` — swap that file to change the picture.

## Scripts

```bash
yarn dev     # development server
yarn build   # production build
yarn start   # serve the production build
yarn lint    # eslint
```

## Deployment

Deploy on Vercel. Add the environment variables from `.env.example` in the project settings —
`.env.production` should not be committed with real values.

## License

© 2026 Forge. All rights reserved.
