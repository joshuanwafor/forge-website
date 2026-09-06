import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import GithubSlugger from "github-slugger";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type PostFrontmatter = {
  title: string;
  description: string;
  /** ISO date, e.g. 2026-02-14 */
  date: string;
  updated?: string;
  author: string;
  authorRole?: string;
  tags: string[];
  /** Path under /public, or an absolute URL. */
  cover?: string;
  featured?: boolean;
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: number;
};

export type Heading = { id: string; text: string; level: 2 | 3 };

export type Post = PostMeta & {
  html: string;
  headings: Heading[];
};

export function tagSlug(tag: string) {
  return new GithubSlugger().slug(tag);
}

/** ~200 wpm, rounded up, minimum 1. */
function readingTimeOf(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function listPostFiles() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f));
}

function readPostFile(file: string) {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontmatter>;

  if (!fm.title || !fm.date) {
    throw new Error(`content/blog/${file}: "title" and "date" are required in frontmatter.`);
  }

  const meta: PostMeta = {
    slug,
    title: fm.title,
    description: fm.description ?? "",
    date: new Date(fm.date).toISOString(),
    updated: fm.updated ? new Date(fm.updated).toISOString() : undefined,
    author: fm.author ?? "The Forge team",
    authorRole: fm.authorRole,
    tags: fm.tags ?? [],
    cover: fm.cover,
    featured: fm.featured ?? false,
    draft: fm.draft ?? false,
    readingTime: readingTimeOf(content),
  };

  return { meta, content };
}

/** Drafts are hidden in production but visible while developing. */
function isVisible(meta: PostMeta) {
  return !meta.draft || process.env.NODE_ENV !== "production";
}

export function getAllPosts(): PostMeta[] {
  return listPostFiles()
    .map((file) => readPostFile(file).meta)
    .filter(isVisible)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getFeaturedPost(): PostMeta | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.featured) ?? posts[0];
}

export function getAllTags(): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: tagSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getPostsByTag(slug: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.some((t) => tagSlug(t) === slug));
}

/** Posts sharing the most tags, newest first, excluding the current post. */
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];

  return all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || +new Date(b.post.date) - +new Date(a.post.date))
    .slice(0, limit)
    .map((x) => x.post);
}

/** Previous/next in reverse-chronological reading order. */
export function getAdjacentPosts(slug: string) {
  const all = getAllPosts();
  const i = all.findIndex((p) => p.slug === slug);
  return {
    newer: i > 0 ? all[i - 1] : undefined,
    older: i >= 0 && i < all.length - 1 ? all[i + 1] : undefined,
  };
}

function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  // Same slugger instance and algorithm as rehype-slug, so the table of
  // contents links match the ids actually rendered into the HTML.
  const slugger = new GithubSlugger();
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    // Every heading is fed to the slugger so its duplicate counter stays in
    // step with rehype-slug, even though only h2/h3 end up in the contents.
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].replace(/[*_`]/g, "");
    const id = slugger.slug(text);

    if (level === 2 || level === 3) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = listPostFiles().find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!file) return null;

  const { meta, content } = readPostFile(file);
  if (!isVisible(meta)) return null;

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["heading-anchor"] },
    })
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeStringify)
    .process(content);

  return {
    ...meta,
    html: String(processed),
    headings: extractHeadings(content),
  };
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
