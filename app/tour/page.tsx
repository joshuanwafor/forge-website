"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Backdrop } from "@/components/ui/Backdrop";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { Field, FormSuccess, Input, Select, Textarea } from "@/components/ui/Field";
import { site } from "@/lib/site";

const interests = [
  "Hot desk",
  "Private office",
  "Monthly membership",
  "Meeting room only",
  "Not sure yet",
];

const timeSlots = ["Morning (9am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 7pm)"];

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  teamSize: "1",
  interest: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
};

/** Tomorrow, so nobody can request a tour in the past. */
function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function TourPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const update =
    (field: keyof typeof initialState) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Could not send your request");

      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return (
      <>
        <Header />
        <main id="main" className="relative flex min-h-[80svh] items-center overflow-hidden py-32">
          <Backdrop variant="subtle" />
          <Container>
            <FormSuccess
              title="Tour requested"
              message={`We'll confirm your slot by email within one working day. If it's urgent, reply to that email or ring us on ${site.phone}.`}
            >
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/blog" variant="secondary" size="lg">
                  Read the blog
                </Button>
                <Button href="/" size="lg">
                  Back to home
                  <ArrowIcon />
                </Button>
              </div>
            </FormSuccess>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main id="main">
        <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
          <Backdrop variant="subtle" />
          <Container>
            <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
              {/* Pitch */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Eyebrow className="mb-5">Book a tour</Eyebrow>
                <h1 className="text-4xl font-semibold leading-[1.06] tracking-tight text-white sm:text-5xl">
                  Fifteen minutes, no pitch
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-ink-300">
                  We&apos;ll show you the floors, the quiet zone and the plant room — then leave
                  you to sit and work for as long as you like.
                </p>

                <ul className="mt-10 space-y-4 border-t border-white/8 pt-8">
                  {[
                    "See the space at a normal working hour, not an empty one",
                    "Ask about power, network and notice periods — we'll give you numbers",
                    "Stay on afterwards with a free half-day pass",
                  ].map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink-300">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-ember-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>

                <p className="mt-10 font-mono text-xs uppercase tracking-[0.14em] text-ink-400">
                  Or just email{" "}
                  <a href={`mailto:${site.email}`} className="text-ember-400 hover:text-ember-300">
                    {site.email}
                  </a>
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={onSubmit}
                className="rounded-3xl border border-white/8 bg-white/[0.025] p-6 backdrop-blur-sm sm:p-8"
                noValidate={false}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="fullName" required className="sm:col-span-2">
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      autoComplete="name"
                      value={form.fullName}
                      onChange={update("fullName")}
                      placeholder="Ada Obi"
                    />
                  </Field>

                  <Field label="Email" htmlFor="email" required>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="ada@example.com"
                    />
                  </Field>

                  <Field label="Phone" htmlFor="phone">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="+234 800 000 0000"
                    />
                  </Field>

                  <Field label="What are you looking at?" htmlFor="interest" required>
                    <Select
                      id="interest"
                      name="interest"
                      required
                      value={form.interest}
                      onChange={update("interest")}
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      {interests.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="How many people?" htmlFor="teamSize" required>
                    <Select
                      id="teamSize"
                      name="teamSize"
                      required
                      value={form.teamSize}
                      onChange={update("teamSize")}
                    >
                      {["1", "2–4", "5–8", "9+"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Preferred date" htmlFor="preferredDate" required>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      required
                      min={minDate()}
                      value={form.preferredDate}
                      onChange={update("preferredDate")}
                      className="[color-scheme:dark]"
                    />
                  </Field>

                  <Field label="Preferred time" htmlFor="preferredTime" required>
                    <Select
                      id="preferredTime"
                      name="preferredTime"
                      required
                      value={form.preferredTime}
                      onChange={update("preferredTime")}
                    >
                      <option value="" disabled>
                        Select a slot
                      </option>
                      {timeSlots.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field
                    label="Anything we should know?"
                    htmlFor="message"
                    hint="Accessibility needs, a specific room you want to see, awkward questions — all welcome."
                    className="sm:col-span-2"
                  >
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={update("message")}
                      placeholder="We're four people and need somewhere we can take calls all day…"
                    />
                  </Field>
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "loading"}
                  className="mt-8 w-full"
                >
                  {status === "loading" ? "Sending…" : "Request a tour"}
                  {status === "loading" ? null : <ArrowIcon />}
                </Button>

                <p className="mt-4 text-center text-xs text-ink-400">
                  We only use your details to arrange the visit. No mailing list unless you ask.
                </p>
              </form>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
