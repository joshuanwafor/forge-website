import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Backdrop } from "@/components/ui/Backdrop";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { site, team, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Forge is a workspace in Lagos built around one measure: uninterrupted hours. Here's who runs it and what we optimise for.",
  alternates: { canonical: "/about" },
};

const timeline = [
  {
    period: "The problem",
    title: "Three productive hours a day",
    body: "We logged every place we tried to work from in Lagos for three months. Power, internet, noise and furniture failed in that order, and a normal day yielded about three hours of real work.",
  },
  {
    period: "The bet",
    title: "Spend on the boring things",
    body: "Inverters before furniture. Network before branding. Phone booths before a logo. None of it photographs well; all of it is what you feel at 3pm on a bad grid day.",
  },
  {
    period: "The correction",
    title: "One room, run properly",
    body: "We tried running programmes alongside the space and learned we're better at doing one thing well. Forge is a workspace — not an accelerator, not a school.",
  },
  {
    period: "Now",
    title: "Measuring what matters",
    body: "We track uninterrupted hours, uplink latency and desk availability, and publish what we can. If something breaks, members hear it from us first.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden pb-16 pt-36 sm:pt-44">
          <Backdrop variant="subtle" />
          <Container>
            <div className="max-w-3xl">
              <Eyebrow className="mb-5">About Forge</Eyebrow>
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
                We optimise for one number:{" "}
                <span className="text-gradient-ember">uninterrupted hours</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-300">
                Not desks sold, not events run, not community size. Hours where somebody sat
                down to work and nothing in the building stopped them. Every decision we make
                about this space is judged against that.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href="/tour" size="lg">
                  Book a tour
                  <ArrowIcon />
                </Button>
                <Button href="/blog" variant="secondary" size="lg">
                  Read the blog
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Story timeline */}
        <Section>
          <Container>
            <SectionHeading
              eyebrow="How we got here"
              title="A spreadsheet, not a business plan"
              description="Forge started as a log of every place in Lagos that was almost good enough to work from."
            />

            <ol className="mt-14 grid gap-5 sm:grid-cols-2">
              {timeline.map((item, i) => (
                <Reveal
                  as="li"
                  key={item.title}
                  delay={i * 70}
                  className="relative flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-7 transition-colors hover:border-white/15"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-ember-400">
                    {item.period}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-400">{item.body}</p>
                </Reveal>
              ))}
            </ol>
          </Container>
        </Section>

        {/* Values */}
        <Section>
          <Container>
            <SectionHeading
              eyebrow="What we hold to"
              title="Four things we won't trade away"
            />

            <ul className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {values.map((value, i) => (
                <Reveal as="li" key={value.title} delay={i * 70} className="border-t border-white/8 pt-6">
                  <h3 className="text-lg font-semibold text-white">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-400">
                    {value.description}
                  </p>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        {/* Team */}
        <Section>
          <Container>
            <SectionHeading
              eyebrow="The people"
              title="Who you'll actually meet"
              description="A small team. If something in the building is wrong, one of these three is the person who fixes it."
            />

            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member, i) => (
                <Reveal
                  as="li"
                  key={member.name}
                  delay={i * 70}
                  className="flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-7 transition-colors hover:border-white/15 hover:bg-white/[0.045]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ember-500/30 bg-ember-500/10 font-mono text-sm font-medium text-ember-300">
                    {member.initials}
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-white">{member.name}</h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-ember-400">
                    {member.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-400">{member.bio}</p>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        {/* CTA */}
        <Section>
          <Container>
            <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.07] to-transparent px-6 py-14 text-center sm:px-12 sm:py-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-56 w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-600/20 blur-[110px]"
              />
              <div className="relative">
                <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Come and judge it from a chair
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-ink-300">
                  A day pass costs ₦2,000 and tells you more than any tour. Ask us the awkward
                  questions while you&apos;re here.
                </p>
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button href="/tour" size="lg">
                    Book a tour
                    <ArrowIcon />
                  </Button>
                  <Button href={`mailto:${site.email}`} variant="secondary" size="lg">
                    {site.email}
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
