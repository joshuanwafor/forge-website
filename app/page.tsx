import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pricing from "@/components/home/Pricing";
import Faq from "@/components/home/Faq";
import { Backdrop } from "@/components/ui/Backdrop";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PostCard } from "@/components/blog/PostCard";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

const stats = [
  { value: "99.4%", label: "Power uptime, last 90 days" },
  { value: "1 Gbps", label: "Fibre, dual provider failover" },
  { value: "24/7", label: "Access on monthly plans" },
  { value: "8", label: "Phone booths and meeting rooms" },
];

const spaces = [
  {
    name: "Private offices",
    description:
      "Lockable rooms for teams of two to eight. Leave your monitors set up, put your own name on the door.",
    detail: "From ₦6,000 / day",
    span: "lg:col-span-2 lg:row-span-2",
    featured: true,
  },
  {
    name: "Hot desks",
    description: "Any open seat on the shared floor. Turn up, plug in, get on with it.",
    detail: "From ₦2,000 / day",
  },
  {
    name: "Quiet zone",
    description: "No calls, no meetings, no exceptions. For the work that needs a clear head.",
    detail: "Included on every plan",
  },
  {
    name: "Meeting rooms",
    description: "Four to twelve people, with a display, a whiteboard and a door that shuts.",
    detail: "Bookable by the hour",
  },
  {
    name: "Phone booths",
    description: "Soundproofed, ventilated, and never more than twenty steps from your desk.",
    detail: "First come, first served",
  },
];

const amenities = [
  "Gigabit fibre",
  "Inverter-backed power",
  "Ergonomic chairs",
  "Standing desks",
  "Unlimited coffee",
  "Secure lockers",
  "Printing & scanning",
  "Mail handling",
  "Bike parking",
  "Showers",
];

const audiences = [
  {
    tag: "Solo",
    title: "Freelancers and remote workers",
    points: ["Somewhere to be that isn't your kitchen", "Day rates with no commitment"],
  },
  {
    tag: "Teams",
    title: "Startups of two to eight",
    points: ["Private rooms that scale month to month", "No fit-out, no landlord, no lawyers"],
  },
  {
    tag: "Visiting",
    title: "Founders passing through Lagos",
    points: ["Week passes with meeting room time", "Address and mail handling if you need it"],
  },
  {
    tag: "Studios",
    title: "Design and engineering shops",
    points: ["Adjacent private offices for split teams", "Room to run your own demo night"],
  },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <Header />

      <main id="main">
        {/* Hero */}
        <section className="relative flex min-h-[88svh] items-center overflow-hidden pb-20 pt-32 sm:pt-40">
          <Backdrop />
          <Container>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-ink-300 backdrop-blur-sm animate-fade-up">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Desks available this week
              </div>

              <h1
                className="mt-8 text-[2.75rem] font-semibold leading-[1.04] tracking-tight text-white animate-fade-up sm:text-6xl lg:text-7xl"
                style={{ animationDelay: "80ms" }}
              >
                A workspace that
                <br />
                <span className="text-gradient-ember">stays up</span> while you build.
              </h1>

              <p
                className="mt-7 max-w-xl text-lg leading-relaxed text-ink-300 animate-fade-up sm:text-xl"
                style={{ animationDelay: "160ms" }}
              >
                Private offices, hot desks and quiet rooms in Lagos — on power and fibre
                engineered so a bad grid day never costs you an afternoon.
              </p>

              <div
                className="mt-10 flex flex-col gap-3 animate-fade-up sm:flex-row sm:items-center"
                style={{ animationDelay: "240ms" }}
              >
                <Button href="/tour" size="lg">
                  Book a tour
                  <ArrowIcon />
                </Button>
                <Button href="#pricing" variant="secondary" size="lg">
                  See pricing
                </Button>
              </div>

              <p
                className="mt-6 font-mono text-xs text-ink-400 animate-fade-up"
                style={{ animationDelay: "300ms" }}
              >
                Day passes from ₦2,000 · No membership required
              </p>
            </div>
          </Container>
        </section>

        {/* Stats band */}
        <section className="border-y border-white/8 bg-white/[0.015]">
          <Container>
            <dl className="grid grid-cols-2 divide-x divide-y divide-white/8 sm:grid-cols-4 sm:divide-y-0">
              {stats.map((stat) => (
                <div key={stat.label} className="px-2 py-8 first:pl-0 sm:px-6 sm:py-10">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      {stat.value}
                    </span>
                    <span className="mt-2 block text-xs leading-relaxed text-ink-400 sm:text-sm">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        {/* Spaces */}
        <Section id="spaces" divider={false}>
          <Container>
            <SectionHeading
              eyebrow="The space"
              title="Five kinds of room, one building"
              description="Every plan gets you the whole building — the difference is where your desk lives and how long it's yours."
            />

            <div className="mt-14 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {spaces.map((space, i) => (
                <Reveal
                  key={space.name}
                  delay={i * 70}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 p-6 transition-colors hover:border-white/20 ${
                    space.featured
                      ? "bg-gradient-to-br from-ember-600/12 via-white/[0.03] to-transparent lg:col-span-2 lg:row-span-2 lg:p-8"
                      : "bg-white/[0.02] hover:bg-white/[0.045]"
                  }`}
                >
                  {space.featured ? (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ember-500/15 blur-[80px]"
                    />
                  ) : null}

                  <div className="relative">
                    <h3
                      className={`font-semibold text-white ${
                        space.featured ? "text-2xl lg:text-3xl" : "text-lg"
                      }`}
                    >
                      {space.name}
                    </h3>
                    <p
                      className={`mt-3 leading-relaxed text-ink-400 ${
                        space.featured ? "max-w-sm text-base" : "text-sm"
                      }`}
                    >
                      {space.description}
                    </p>
                  </div>

                  <p className="relative mt-8 font-mono text-xs uppercase tracking-wider text-ember-400">
                    {space.detail}
                  </p>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>

        {/* Amenities marquee */}
        <div className="relative overflow-hidden border-y border-white/8 py-5">
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {[...amenities, ...amenities].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex shrink-0 items-center gap-10 font-mono text-sm uppercase tracking-[0.14em] text-ink-400"
              >
                {item}
                <span aria-hidden="true" className="text-ember-600/60">
                  ✦
                </span>
              </span>
            ))}
          </div>
          {/* Fade the marquee into the page edges */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-950 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-950 to-transparent"
          />
        </div>

        {/* Who it's for */}
        <Section divider={false}>
          <Container>
            <SectionHeading
              eyebrow="Who works here"
              title="Built for people who need more than a desk"
              description="Roughly half the building is engineers. The rest is designers, founders and a couple of writers who like the quiet floor."
            />

            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {audiences.map((item, i) => (
                <Reveal
                  as="li"
                  key={item.title}
                  delay={i * 70}
                  className="flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-white/15 hover:bg-white/[0.045]"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-ember-400">
                    {item.tag}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-white">
                    {item.title}
                  </h3>
                  <ul className="mt-5 space-y-2.5 border-t border-white/8 pt-5">
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-2.5 text-sm leading-snug text-ink-400">
                        <span aria-hidden="true" className="text-ember-500">
                          →
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        {/* Pricing */}
        <Section id="pricing">
          <Container>
            <SectionHeading
              align="center"
              eyebrow="Pricing"
              title="Published rates, no sales call"
              description="Pay by the day, the week or the month. Everything below includes power, fibre, coffee and the community."
            />
            <div className="mt-14">
              <Pricing />
            </div>
          </Container>
        </Section>

        {/* Community + latest writing */}
        <Section id="community">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Community"
                title="Demo night, third Thursday"
                description="Five minutes, software that actually runs, broken builds welcome. Open to anyone, whether or not you work here."
              />
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ember-400 hover:text-ember-300"
              >
                Read the blog
                <ArrowIcon />
              </Link>
            </div>

            {posts.length > 0 ? (
              <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Reveal as="li" key={post.slug} delay={i * 70} className="h-full">
                    <PostCard post={post} />
                  </Reveal>
                ))}
              </ul>
            ) : null}
          </Container>
        </Section>

        {/* FAQ */}
        <Section>
          <Container>
            <SectionHeading align="center" eyebrow="Questions" title="Before you visit" />
            <div className="mt-12">
              <Faq />
            </div>
          </Container>
        </Section>

        {/* Final CTA */}
        <Section>
          <Container>
            <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.07] to-transparent px-6 py-16 text-center sm:px-12 sm:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-600/20 blur-[110px]"
              />

              <div className="relative">
                <Eyebrow className="mb-5">Come and see it</Eyebrow>
                <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.08]">
                  Bring the work you&apos;ve been putting off
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg text-ink-300">
                  Tours take fifteen minutes. Or skip the tour, buy a day pass and judge the
                  room from a chair.
                </p>

                <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button href="/tour" size="lg">
                    Book a tour
                    <ArrowIcon />
                  </Button>
                  <Button href={`mailto:${site.email}`} variant="secondary" size="lg">
                    Email us
                  </Button>
                </div>

                <p className="mt-10 font-mono text-xs uppercase tracking-[0.14em] text-ink-400">
                  {site.address.line1} · {site.address.line2} ·{" "}
                  <a href={`mailto:${site.email}`} className="text-ink-300 hover:text-white">
                    {site.email}
                  </a>
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
