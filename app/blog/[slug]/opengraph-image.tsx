import { ImageResponse } from "next/og";
import { getAllPosts, getPost, formatDate } from "@/lib/blog";
import { site } from "@/lib/site";

export const alt = "Forge blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

/** Social card generated per post, so shared links aren't a bare URL. */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  const title = post?.title ?? site.name;
  const meta = post
    ? `${post.author} · ${formatDate(post.date)} · ${post.readingTime} min read`
    : site.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0c",
          backgroundImage:
            "radial-gradient(circle at 82% 12%, rgba(245,158,11,0.38) 0%, rgba(245,158,11,0) 55%)",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "9999px",
              backgroundColor: "#facc15",
            }}
          />
          {/* Satori needs every multi-child node to declare a display mode, so
              keep this a single interpolated string. */}
          <div
            style={{
              display: "flex",
              color: "#b0b0ba",
              fontSize: "24px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {`${site.name} — Journal`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? "62px" : "76px",
            lineHeight: 1.1,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            maxWidth: "950px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "28px",
          }}
        >
          <div style={{ color: "#85858f", fontSize: "26px" }}>{meta}</div>
          <div style={{ color: "#facc15", fontSize: "26px" }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    size
  );
}
