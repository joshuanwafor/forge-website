import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Brand accent — the yellow of metal at working heat. Emphasis only,
        // never body text. Solid fills use 400 with ink-950 text: white on
        // yellow is around 1.9:1, dark on yellow is over 12:1.
        ember: {
          50: "#fefce8",
          100: "#fef7c3",
          200: "#feee95",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
        // Neutral ramp. Slightly cool so the ember reads warmer against it.
        ink: {
          50: "#f7f7f8",
          100: "#ededf0",
          200: "#d6d6dc",
          300: "#b0b0ba",
          400: "#85858f",
          500: "#62626c",
          600: "#4a4a53",
          700: "#35353c",
          800: "#212127",
          900: "#141418",
          950: "#0a0a0c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Display sizes with tightened tracking + leading baked in.
        "display-sm": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-xl": ["6rem", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
      },
      // Tailwind's default opacity scale jumps 5 → 10 → 20; the hairline borders
      // and tinted surfaces in this design need the values in between.
      opacity: {
        8: "0.08",
        9: "0.09",
        12: "0.12",
        14: "0.14",
        15: "0.15",
        16: "0.16",
        18: "0.18",
        22: "0.22",
        24: "0.24",
        35: "0.35",
        45: "0.45",
        65: "0.65",
        85: "0.85",
      },
      maxWidth: {
        content: "72rem",
        prose: "44rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 60px -12px rgb(250 204 21 / 0.4)",
        lift: "0 24px 60px -24px rgb(0 0 0 / 0.9)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(3%, -4%, 0) scale(1.08)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        marquee: "marquee 40s linear infinite",
        drift: "drift 18s ease-in-out infinite",
      },
      typography: () => ({
        invert: {
          css: {
            "--tw-prose-invert-body": "#b0b0ba",
            "--tw-prose-invert-headings": "#ffffff",
            "--tw-prose-invert-links": "#facc15",
            "--tw-prose-invert-bold": "#ffffff",
            "--tw-prose-invert-counters": "#85858f",
            "--tw-prose-invert-bullets": "#4a4a53",
            "--tw-prose-invert-hr": "#212127",
            "--tw-prose-invert-quotes": "#ededf0",
            "--tw-prose-invert-quote-borders": "#eab308",
            "--tw-prose-invert-captions": "#85858f",
            "--tw-prose-invert-code": "#feee95",
            "--tw-prose-invert-pre-code": "#d6d6dc",
            "--tw-prose-invert-pre-bg": "#0a0a0c",
            "--tw-prose-invert-th-borders": "#35353c",
            "--tw-prose-invert-td-borders": "#212127",
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
