import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import { Backdrop } from "@/components/ui/Backdrop";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FeaturedPostCard, PostCard } from "@/components/blog/PostCard";
import { getAllPosts, getAllTags, getFeaturedPost } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on building, working and shipping from Lagos — infrastructure, community and the practical side of running a workspace.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": `${site.url}/blog/rss.xml` },
  },
  openGraph: {
    title: `Blog — ${site.name}`,
    description:
      "Notes on building, working and shipping from Lagos — infrastructure, community and the practical side of running a workspace.",
    url: `${site.url}/blog`,
    type: "website",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const featured = getFeaturedPost();
  const tags = getAllTags();
  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  return (
    <>
      <Header />

      <main id="main">
        {/* Masthead */}
        <section className="relative overflow-hidden pb-14 pt-36 sm:pt-44">
          <Backdrop variant="subtle" />
          <Container>
            <Eyebrow className="mb-5">The Forge journal</Eyebrow>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl md:leading-[1.05]">
              Notes from a room where <span className="text-gradient-ember">things get built</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300">
              Infrastructure write-ups, community lessons and practical guides for anyone
              building in Lagos. No growth-hacking, no listicles.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-xs uppercase tracking-[0.16em] text-ink-400">
                Topics
              </span>
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog/tag/${tag.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-ink-300 transition-colors hover:border-white/25 hover:text-white"
                >
                  {tag.name}
                  <span className="text-ink-400">{tag.count}</span>
                </Link>
              ))}
              <a
                href="/blog/rss.xml"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-ink-300 transition-colors hover:border-white/25 hover:text-white"
              >
                RSS
              </a>
            </div>
          </Container>
        </section>

        {/* Posts */}
        <Section divider={false} className="pt-4">
          <Container>
            {posts.length === 0 ? (
              <p className="rounded-2xl border border-white/8 bg-white/[0.02] p-10 text-center text-ink-400">
                No posts published yet. Add a markdown file to{" "}
                <code className="font-mono text-ember-300">content/blog/</code> to get started.
              </p>
            ) : (
              <>
                {featured ? (
                  <Reveal>
                    <FeaturedPostCard post={featured} />
                  </Reveal>
                ) : null}

                {rest.length > 0 ? (
                  <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post, i) => (
                      <Reveal as="li" key={post.slug} delay={i * 60} className="h-full">
                        <PostCard post={post} />
                      </Reveal>
                    ))}
                  </ul>
                ) : null}
              </>
            )}
          </Container>
        </Section>

        {/* Subscribe */}
        <Section>
          <Container>
            <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.06] to-transparent p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-ember-600/15 blur-[100px]"
              />
              <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Get new posts by email
                  </h2>
                  <p className="mt-3 max-w-md text-ink-300">
                    One email a month with whatever we wrote and whatever we learned running
                    the space. Unsubscribe in one click.
                  </p>
                </div>
                <NewsletterForm />
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
