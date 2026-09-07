"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/ui/Button";

type Status = "idle" | "loading" | "done" | "error";

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: compact ? "footer" : "blog" }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus("done");
      setMessage("You're on the list. Look out for the next issue.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={compact ? "footer-email" : "blog-email"} className="sr-only">
          Email address
        </label>
        <input
          id={compact ? "footer-email" : "blog-email"}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-ink-400 transition-colors focus:border-ember-500/60 focus:bg-white/8"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-ember-400 px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-ember-300 disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
          {status === "loading" ? null : <ArrowIcon />}
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className={`mt-3 text-sm ${status === "error" ? "text-red-400" : "text-emerald-400"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
