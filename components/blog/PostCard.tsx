import Link from "next/link";
import { formatDate, tagSlug, type PostMeta } from "@/lib/blog";
import { cn } from "@/lib/cn";

export function PostMetaLine({
  post,
  className,
}: {
  post: PostMeta;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-400",
        className
      )}
    >
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden="true" className="text-ink-600">
        /
      </span>
      <span>{post.readingTime} min read</span>
    </div>
  );
}

export function TagPill({ tag, active = false }: { tag: string; active?: boolean }) {
  return (
    <Link
      href={`/blog/tag/${tagSlug(tag)}`}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs transition-colors",
        active
          ? "border-ember-500/50 bg-ember-500/15 text-ember-300"
          : "border-white/10 bg-white/[0.03] text-ink-400 hover:border-white/25 hover:text-white"
      )}
    >
      {tag}
    </Link>
  );
}

/** Large lead card used for the newest / featured post. */
export function FeaturedPostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.06] to-transparent p-8 transition-colors hover:border-white/15 sm:p-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ember-600/15 blur-[100px] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-ember-500/30 bg-ember-500/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-ember-300">
            <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
            Latest
          </span>
          <PostMetaLine post={post} />
        </div>

        <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          <Link href={`/blog/${post.slug}`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-300">
          {post.description}
        </p>

        <p className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ember-400">
          Read the post
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </p>
      </div>
    </article>
  );
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-white/15 hover:bg-white/[0.045]">
      <PostMetaLine post={post} className="mb-4" />

      <h3 className="text-xl font-semibold leading-snug tracking-tight text-white">
        <Link href={`/blog/${post.slug}`}>
          <span className="absolute inset-0" aria-hidden="true" />
          {post.title}
        </Link>
      </h3>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-400">
        {post.description}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/8 pt-4">
        <span className="truncate text-xs text-ink-400">{post.author}</span>
        {post.tags[0] ? (
          <span className="shrink-0 font-mono text-xs text-ember-400/80">{post.tags[0]}</span>
        ) : null}
      </div>
    </article>
  );
}
