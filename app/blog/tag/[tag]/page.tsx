import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Backdrop } from "@/components/ui/Backdrop";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PostCard } from "@/components/blog/PostCard";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

type Params = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag } = await params;
  const match = getAllTags().find((t) => t.slug === tag);

  if (!match) return { title: "Topic not found" };

  return {
    title: `${match.name} — Blog`,
    description: `${match.count} post${match.count === 1 ? "" : "s"} about ${match.name} from the ${site.name} team.`,
    alternates: { canonical: `/blog/tag/${match.slug}` },
  };
}

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const tags = getAllTags();
  const match = tags.find((t) => t.slug === tag);

  if (!match) notFound();

  const posts = getPostsByTag(tag);

  return (
    <>
      <Header />

      <main id="main">
        <section className="relative overflow-hidden pb-12 pt-36 sm:pt-44">
          <Backdrop variant="subtle" />
          <Container>
            <Eyebrow className="mb-5">Topic</Eyebrow>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {match.name}
            </h1>
            <p className="mt-4 text-ink-400">
              {match.count} post{match.count === 1 ? "" : "s"}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-2">
              <Link
                href="/blog"
                className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-ink-300 transition-colors hover:border-white/25 hover:text-white"
              >
                All posts
              </Link>
              {tags.map((t) => (
                <Link
                  key={t.slug}
                  href={`/blog/tag/${t.slug}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
                    t.slug === match.slug
                      ? "border-ember-500/50 bg-ember-500/15 text-ember-300"
                      : "border-white/10 bg-white/[0.03] text-ink-300 hover:border-white/25 hover:text-white"
                  )}
                >
                  {t.name}
                  <span className="text-ink-400">{t.count}</span>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <Section divider={false} className="pt-2">
          <Container>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal as="li" key={post.slug} delay={i * 60} className="h-full">
                  <PostCard post={post} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
