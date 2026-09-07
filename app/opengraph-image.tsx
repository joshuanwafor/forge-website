import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card for every page that doesn't define its own — blog posts
 * override it with app/blog/[slug]/opengraph-image.tsx.
 *
 * The photo is a portrait shot, so it takes a full-height panel on the right
 * rather than being cropped into a letterbox band, which would throw away most
 * of the room. Read off disk and inlined: satori has no network access.
 */
function photoDataUri() {
  const file = path.join(process.cwd(), "public", "og", "hub.jpg");
  return `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`;
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#0a0a0c",
        }}
      >
        {/* Copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "700px",
            padding: "68px",
            backgroundImage:
              "radial-gradient(circle at 12% 90%, rgba(245,158,11,0.30) 0%, rgba(245,158,11,0) 60%)",
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
            <div
              style={{
                display: "flex",
                color: "#b0b0ba",
                fontSize: "23px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
              }}
            >
              {site.name}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: "68px",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "#ffffff",
              }}
            >
              A workspace that
            </div>
            <div style={{ display: "flex", fontSize: "68px", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
              <span style={{ color: "#facc15" }}>stays up</span>
              <span style={{ color: "#ffffff" }}>&nbsp;while</span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "68px",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "#ffffff",
              }}
            >
              you build.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,0.14)",
              paddingTop: "26px",
            }}
          >
            <div style={{ display: "flex", color: "#85858f", fontSize: "24px" }}>
              Private offices · Hot desks · Lagos
            </div>
            <div style={{ display: "flex", color: "#facc15", fontSize: "24px" }}>
              {site.url.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </div>

        {/* Photo panel */}
        <div style={{ display: "flex", position: "relative", width: "500px", height: "630px" }}>
          <img
            src={photoDataUri()}
            alt=""
            width={500}
            height={630}
            style={{ width: "500px", height: "630px", objectFit: "cover" }}
          />
          {/* Blend the panel edge into the copy side */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, #0a0a0c 0%, rgba(10,10,12,0.55) 18%, rgba(10,10,12,0.12) 45%, rgba(10,10,12,0.12) 100%)",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
