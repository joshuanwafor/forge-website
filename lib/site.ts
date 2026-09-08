/**
 * Single source of truth for site-wide copy, navigation and contact details.
 * Edit here rather than hunting through page components.
 */

/**
 * Canonical origin, used for canonical tags, the sitemap, RSS, JSON-LD and the
 * absolute og:image URL. Getting it wrong points every share and every crawler
 * at somebody else's site, so there is deliberately no hardcoded domain here:
 * set NEXT_PUBLIC_SITE_URL, or let Vercel supply its own domain at build time.
 */
/**
 * The apex is the canonical host.
 *
 * Note it currently 307-redirects to www, which means canonical tags and the
 * og:image point one hop away from the host actually serving. Flip the redirect
 * in the Vercel domain settings so www redirects to the apex, and the two agree.
 */
const PRODUCTION_ORIGIN = "https://gotoforge.ng";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  // Vercel system variables: the stable production domain, then the
  // per-deployment URL so preview builds resolve to themselves.
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return process.env.NODE_ENV === "production"
    ? PRODUCTION_ORIGIN
    : "http://localhost:3000";
}

export const site = {
  name: "Forge",
  tagline: "A workspace for people who build",
  description:
    "Forge is a workspace for developers, designers and founders in Nigeria. Private offices, hot desks, meeting rooms, gigabit fibre and a community that ships.",
  url: resolveSiteUrl(),
  email: "hello@gotoforge.ng",
  phone: "+234 800 000 0000",
  address: {
    line1: "Forge Hub",
    line2: "Lagos, Nigeria",
  },
  social: {
    twitter: "https://twitter.com/forgehub",
    instagram: "https://instagram.com/forgehub",
    linkedin: "https://linkedin.com/company/forgehub",
    github: "https://github.com/forgehub",
  },
} as const;

export const mainNav = [
  { name: "Workspace", href: "/#spaces" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
] as const;

export const footerNav = [
  {
    heading: "Workspace",
    links: [
      { name: "Spaces", href: "/#spaces" },
      { name: "Pricing", href: "/#pricing" },
      { name: "Book a tour", href: "/tour" },
      { name: "Community", href: "/#community" },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Waitlist", href: "/waitlist" },
      { name: "Contact", href: `mailto:${site.email}` },
    ],
  },
  {
    heading: "Resources",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "RSS feed", href: "/blog/rss.xml" },
    ],
  },
] as const;

/**
 * Placeholder team data — replace names, roles and bios with the real crew.
 */
export const team = [
  {
    name: "David Okechukwu",
    role: "Founder",
    bio: "Serial entrepreneur with 10+ years building and scaling tech companies. Started Forge to give Lagos builders a room worth showing up to.",
    initials: "DO",
  },
  {
    name: "Amara Williams",
    role: "Community",
    bio: "Community builder extraordinaire. Runs the events calendar and makes sure nobody eats lunch alone on their first day.",
    initials: "AW",
  },
  {
    name: "Michael Chen",
    role: "Operations",
    bio: "Operations lead. Keeps the power on, the fibre fast and the coffee flowing — the unglamorous work that makes a hub usable.",
    initials: "MC",
  },
] as const;

export const values = [
  {
    title: "Built for focus",
    description:
      "Quiet zones, real desks and chairs you can sit in for eight hours. The room should disappear so the work can happen.",
  },
  {
    title: "Uptime is a feature",
    description:
      "Redundant power and gigabit fibre with failover. A workspace that drops mid-deploy is not a workspace.",
  },
  {
    title: "Community, not networking",
    description:
      "No forced mixers. Just people building nearby, and the occasional demo night where you can show what you shipped.",
  },
  {
    title: "Fair, legible pricing",
    description:
      "Day rates, week rates, month rates. Published on the site. No sales call required to find out what a desk costs.",
  },
] as const;
