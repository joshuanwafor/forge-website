import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Container, Section } from "@/components/ui/Section";
import { Backdrop } from "@/components/ui/Backdrop";
import { PostCard, TagPill } from "@/components/blog/PostCard";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareLinks from "@/components/blog/ShareLinks";
import {
  formatDate,
  getAdjacentPosts,
  getAllPosts,
  getPost,
  getRelatedPosts,
} from "@/lib/blog";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Post not found" };

  const url = `${site.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const related = getRelatedPosts(post.slug);
  const { newer, older } = getAdjacentPosts(post.slug);
  const url = `${site.url}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <Header />

      <main id="main">
        <script
          type="application/ld+json"
          // Structured data for search results. Content is our own markdown frontmatter.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Article header */}
        <section className="relative overflow-hidden pb-10 pt-32 sm:pt-40">
          <Backdrop variant="subtle" />
          <Container>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-ink-400 transition-colors hover:text-white"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
              All posts
            </Link>

            <div className="mt-8 max-w-3xl">
              <div className="mb-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>

              <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
                {post.title}
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-ink-300">{post.description}</p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-white/8 pt-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ember-500/30 bg-ember-500/10 font-mono text-xs font-semibold text-ember-300">
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div className="text-sm">
                    <p className="font-medium text-white">{post.author}</p>
                    <p className="text-ink-400">
                      {post.authorRole ? `${post.authorRole} · ` : ""}
                      <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
                      {post.readingTime} min read
                    </p>
                  </div>
                </div>

                <ShareLinks title={post.title} url={url} />
              </div>
            </div>
          </Container>
        </section>

        {/* Body + contents */}
        <Container className="pb-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
            <article
              className="prose prose-invert max-w-prose
                prose-headings:font-display prose-headings:tracking-tight prose-headings:scroll-mt-28
                prose-h2:mt-14 prose-h2:text-2xl prose-h2:font-semibold
                prose-h3:mt-10 prose-h3:text-xl prose-h3:font-semibold
                prose-p:leading-[1.75]
                prose-a:font-medium prose-a:underline prose-a:decoration-ember-500/40 prose-a:underline-offset-4 hover:prose-a:decoration-ember-400
                prose-strong:text-white
                prose-blockquote:border-l-2 prose-blockquote:border-ember-500 prose-blockquote:not-italic prose-blockquote:text-ink-200
                prose-li:marker:text-ember-500/70
                prose-hr:border-white/8
                prose-img:rounded-2xl prose-img:border prose-img:border-white/8
                [&_.heading-anchor]:no-underline [&_.heading-anchor]:text-inherit"
              // Rendered from our own trusted markdown in content/blog.
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents headings={post.headings} />
              </div>
            </aside>
          </div>
        </Container>

        {/* Prev / next */}
        {newer || older ? (
          <Container className="pb-4">
            <div className="grid gap-4 border-t border-white/8 pt-10 sm:grid-cols-2">
              {older ? (
                <Link
                  href={`/blog/${older.slug}`}
                  className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-400">
                    ← Older
                  </span>
                  <p className="mt-2 font-medium text-white group-hover:text-ember-200">
                    {older.title}
                  </p>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {newer ? (
                <Link
                  href={`/blog/${newer.slug}`}
                  className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-right transition-colors hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-400">
                    Newer →
                  </span>
                  <p className="mt-2 font-medium text-white group-hover:text-ember-200">
                    {newer.title}
                  </p>
                </Link>
              ) : null}
            </div>
          </Container>
        ) : null}

        {/* Related */}
        {related.length > 0 ? (
          <Section>
            <Container>
              <h2 className="mb-8 text-2xl font-semibold tracking-tight text-white">
                Keep reading
              </h2>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <li key={p.slug} className="h-full">
                    <PostCard post={p} />
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
