"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import FloorPlan from "./FloorPlan";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import {
  MAX_DAYS_AHEAD,
  PLANS,
  SEATS,
  SEAT_IDS,
  TOTAL_SEATS,
  addDays,
  endDate,
  formatDate,
  formatNaira,
  offers,
  quote,
  seatName,
  todayInLagos,
  type PlanId,
} from "@/lib/workspace";

type Stage = "idle" | "checking" | "paying" | "confirming";

type Order = { seatIds: string[]; plan: PlanId; qty: number; startDate: string; total: number };

type Confirmation = Order & { bookingCode: string; endDate: string; email: string };

/** Paystack InlineJS v2: `new PaystackPop().newTransaction({...})`. */
type PaystackPopup = new () => { newTransaction(options: Record<string, unknown>): void };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// three.js is heavy, so the 3D view is its own chunk, fetched only when shown.
const Building3D = dynamic(() => import("./Building3D"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[460px] place-items-center rounded-xl bg-[radial-gradient(ellipse_at_50%_35%,#24242b_0%,#0d0d10_70%)] font-mono text-xs uppercase tracking-[0.14em] text-ink-400 sm:h-[540px] lg:h-[620px]">
      Building the 3D view…
    </div>
  ),
});

type View = "3d" | "plan";

let webglSupport: boolean | null = null;
function hasWebGL() {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const bySeatOrder = (a: string, b: string) => SEAT_IDS.indexOf(a) - SEAT_IDS.indexOf(b);

// "Today" comes from the visitor's clock, so it is only read in the browser —
// the home page is prerendered and must not bake in the build date.
const noopSubscribe = () => () => {};
const useToday = () => useSyncExternalStore(noopSubscribe, todayInLagos, () => "");

async function fetchBooked(start: string, end: string, signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(`/api/bookings/availability?start=${start}&end=${end}`, {
    signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error("availability");
  const json = await res.json();
  return json.booked as string[];
}

/** Unique per checkout attempt; Paystack rejects a reused reference. */
function newReference() {
  const rand = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  return `FRG-${Date.now().toString(36)}-${rand}`.toUpperCase();
}

const units = (plan: PlanId, qty: number) => `${qty} ${qty === 1 ? PLANS[plan].unit : PLANS[plan].units}`;

export default function SeatBooking() {
  const today = useToday();
  // 3D wherever WebGL works; the flat plan is the fallback and the keyboard-friendly view.
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
  const [chosenView, setChosenView] = useState<View | null>(null);
  const view: View = webgl ? (chosenView ?? "3d") : "plan";
  const [plan, setPlan] = useState<PlanId>("day");
  const [qty, setQty] = useState(1);
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [availability, setAvailability] = useState<{ key: string; booked: string[]; failed: boolean } | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [paystackReady, setPaystackReady] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const startDate = pickedDate && today && pickedDate >= today ? pickedDate : today;
  const lastDay = startDate ? endDate(startDate, plan, qty) : "";
  const rangeKey = `${startDate}_${lastDay}_${refreshTick}`;

  useEffect(() => {
    if (!startDate) return;
    const ctrl = new AbortController();
    fetchBooked(startDate, lastDay, ctrl.signal)
      .then((booked) => setAvailability({ key: rangeKey, booked, failed: false }))
      .catch(() => {
        if (!ctrl.signal.aborted) setAvailability({ key: rangeKey, booked: [], failed: true });
      });
    return () => ctrl.abort();
  }, [startDate, lastDay, rangeKey]);

  const loading = !startDate || availability?.key !== rangeKey;
  const booked = useMemo(
    () => new Set(!loading && availability ? availability.booked : []),
    [loading, availability]
  );

  // Picks that aren't free on the current dates drop out of the order (and
  // come back if the visitor switches to dates where they are free again).
  const selectedIds = useMemo(
    () => picked.filter((id) => !booked.has(id) && offers(SEATS[id].zone, plan)).sort(bySeatOrder),
    [picked, booked, plan]
  );
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  const droppedPicks = loading ? 0 : picked.length - selectedIds.length;
  const { lines, total } = quote(selectedIds, plan, qty);
  const freeSeats = TOTAL_SEATS - booked.size;

  const formValid =
    form.fullName.trim().length > 1 &&
    EMAIL_RE.test(form.email.trim()) &&
    form.phone.replace(/\D/g, "").length >= 7;
  const canPay = selectedIds.length > 0 && formValid && stage === "idle" && !loading;

  // If the next pass up costs no more for what's picked, say so.
  const longer: PlanId | null = plan === "day" ? "week" : plan === "week" ? "month" : null;
  const longerTotal =
    longer && selectedIds.length > 0 && selectedIds.every((id) => offers(SEATS[id].zone, longer))
      ? quote(selectedIds, longer, 1).total
      : null;
  const suggestLonger = longer !== null && longerTotal !== null && longerTotal <= total;

  const toggleSeat = (id: string) => {
    setError("");
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev.filter((s) => !booked.has(s)), id]
    );
  };

  /** Select every id in the group, or clear them all if they're already selected. */
  const toggleGroup = (ids: string[]) => {
    setError("");
    const allSelected = ids.every((id) => selected.has(id));
    setPicked((prev) => {
      const rest = prev.filter((id) => !ids.includes(id) && !booked.has(id));
      return allSelected ? rest : [...rest, ...ids];
    });
  };

  const removeLine = (ids: string[]) => {
    setError("");
    setPicked((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const changePlan = (next: PlanId) => {
    setPlan(next);
    setQty(1);
  };

  const confirmBooking = async (reference: string, order: Order) => {
    setStage("confirming");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatIds: order.seatIds,
          plan: order.plan,
          quantity: order.qty,
          startDate: order.startDate,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          paymentReference: reference,
        }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 409) setRefreshTick((t) => t + 1);
        setError(
          `${json.error ?? "We couldn't save your booking"}. Your payment went through — email ${site.email} with reference ${reference} and we'll sort it out or refund you.`
        );
        setStage("idle");
        return;
      }

      setConfirmation({
        ...order,
        seatIds: json.seatIds,
        bookingCode: json.bookingCode,
        endDate: json.endDate,
        email: form.email.trim(),
      });
      setStage("idle");
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setError(
        `Your payment went through but we couldn't confirm the booking. Email ${site.email} with reference ${reference}.`
      );
      setStage("idle");
    }
  };

  const pay = async () => {
    if (!canPay || !startDate) return;
    setError("");
    setStage("checking");

    // One last look, so nobody pays for a seat that went while they were typing.
    try {
      const fresh = await fetchBooked(startDate, lastDay);
      const taken = selectedIds.filter((id) => fresh.includes(id));
      if (taken.length > 0) {
        setError(
          `${taken.length === 1 ? "A seat you picked was" : `${taken.length} seats you picked were`} just booked by someone else. Pick another and try again.`
        );
        setRefreshTick((t) => t + 1);
        setStage("idle");
        return;
      }
    } catch {
      // The server checks again after payment, so carry on.
    }

    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    const PaystackPop = (window as unknown as { PaystackPop?: PaystackPopup }).PaystackPop;
    if (!key) {
      setError(`Online payment isn't switched on yet. Email ${site.email} and we'll book you in.`);
      setStage("idle");
      return;
    }
    if (!paystackReady || !PaystackPop) {
      setError("The payment window is still loading. Try again in a moment.");
      setStage("idle");
      return;
    }

    const order: Order = { seatIds: selectedIds, plan, qty, startDate, total };
    const reference = newReference();

    try {
      setStage("paying");
      new PaystackPop().newTransaction({
        key,
        email: form.email.trim(),
        amount: total * 100,
        currency: "NGN",
        reference,
        metadata: {
          custom_fields: [
            { display_name: "Name", variable_name: "full_name", value: form.fullName.trim() },
            { display_name: "Phone", variable_name: "phone", value: form.phone.trim() },
            {
              display_name: "Seats",
              variable_name: "seats",
              value: lines.map((l) => lineTitle(l.seatIds)).join("; "),
            },
            { display_name: "Dates", variable_name: "dates", value: `${startDate} to ${lastDay}` },
          ],
        },
        onSuccess: (transaction: { reference: string }) => {
          void confirmBooking(transaction.reference, order);
        },
        onCancel: () => setStage((s) => (s === "paying" ? "idle" : s)),
        onError: (err: { message?: string }) => {
          console.error("Paystack error:", err);
          setError(err?.message || "The payment window couldn't start. Please try again.");
          setStage("idle");
        },
      });
    } catch (err) {
      console.error("Paystack setup failed:", err);
      setError("Couldn't open the payment window. Please try again.");
      setStage("idle");
    }
  };

  const reset = () => {
    setConfirmation(null);
    setPicked([]);
    setError("");
    setRefreshTick((t) => t + 1);
  };

  const payLabel = {
    idle:
      selectedIds.length === 0
        ? "Pick a seat to continue"
        : !formValid
          ? "Add your details to pay"
          : `Pay ${formatNaira(total)}`,
    checking: "Checking your seats…",
    paying: "Finish paying in the Paystack window",
    confirming: "Confirming your booking…",
  }[stage];

  return (
    <Section id="book">
      <Script
        src="https://js.paystack.co/v2/inline.js"
        strategy="afterInteractive"
        onReady={() => setPaystackReady(true)}
      />

      <Container>
        <SectionHeading
          eyebrow="Book a desk"
          title="Pick the exact seat you want"
          description="See what's free on your dates, choose a chair, a whole table or a private office, and pay online. It's yours the moment payment clears."
        />

        {confirmation ? (
          <ConfirmationCard confirmation={confirmation} onReset={reset} />
        ) : (
          <div className="mt-14 grid gap-5">
            {/* ---- Dates + floor plan ---- */}
            <div className="min-w-0">
              <div className="mb-4 grid gap-4 rounded-2xl border border-white/8 bg-white/[0.025] p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-end sm:p-5">
                <div>
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
                    Pass
                  </span>
                  <div
                    role="radiogroup"
                    aria-label="Pass type"
                    className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1"
                  >
                    {(Object.keys(PLANS) as PlanId[]).map((id) => (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={plan === id}
                        onClick={() => changePlan(id)}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                          plan === id ? "bg-white text-ink-950" : "text-ink-300 hover:text-white"
                        )}
                      >
                        {PLANS[id].label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block min-w-0">
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
                    Starting
                  </span>
                  <Input
                    type="date"
                    value={startDate}
                    min={today || undefined}
                    max={today ? addDays(today, MAX_DAYS_AHEAD) : undefined}
                    onChange={(e) => setPickedDate(e.target.value || null)}
                    className="py-2.5 [color-scheme:dark]"
                  />
                </label>

                <div>
                  <span
                    id="booking-duration"
                    className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400"
                  >
                    How long
                  </span>
                  <div
                    role="group"
                    aria-labelledby="booking-duration"
                    className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1"
                  >
                    <StepButton
                      label={`Fewer ${PLANS[plan].units}`}
                      disabled={qty <= 1}
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      −
                    </StepButton>
                    <span className="min-w-[4.5rem] text-center text-sm font-medium text-white" aria-live="polite">
                      {units(plan, qty)}
                    </span>
                    <StepButton
                      label={`More ${PLANS[plan].units}`}
                      disabled={qty >= PLANS[plan].maxQty}
                      onClick={() => setQty((q) => Math.min(PLANS[plan].maxQty, q + 1))}
                    >
                      +
                    </StepButton>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/8 pt-3 text-sm sm:col-span-3">
                  <p className="text-ink-200">
                    {startDate ? (
                      <>
                        {formatDate(startDate)}
                        {lastDay !== startDate ? <> → {formatDate(lastDay)}</> : null}
                        <span className="text-ink-400">
                          {" "}
                          · {loading ? "…" : freeSeats} of {TOTAL_SEATS} seats free
                        </span>
                      </>
                    ) : (
                      <span className="text-ink-400">Loading dates…</span>
                    )}
                  </p>
                  {suggestLonger && longer && longerTotal !== null ? (
                    <button
                      type="button"
                      onClick={() => changePlan(longer)}
                      className="text-sm font-medium text-ember-400 hover:text-ember-300"
                    >
                      A {PLANS[longer].label.toLowerCase()} is {formatNaira(longerTotal)} for the whole{" "}
                      {PLANS[longer].unit} →
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-ink-950 p-3 sm:p-4">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-grid opacity-60"
                  style={{ backgroundSize: "24px 24px" }}
                />
                <div className="relative">
                  <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-xs text-ink-400">
                    <Legend className="border-white/15 bg-white/[0.03]" label="Free" />
                    <Legend className="border-ember-300 bg-ember-400" label="Your pick" />
                    <Legend className="border-white/10 text-ink-500 [background:repeating-linear-gradient(135deg,transparent_0_3px,rgb(255_255_255_/_0.07)_3px_4px)]" label="Booked" cross />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
                      {loading ? "Checking availability…" : "Tap a seat, or a table for all of it"}
                    </span>
                    {webgl ? (
                      <div
                        role="radiogroup"
                        aria-label="View"
                        className="ml-auto inline-flex rounded-full border border-white/10 bg-white/[0.03] p-0.5"
                      >
                        {(["3d", "plan"] as View[]).map((v) => (
                          <button
                            key={v}
                            type="button"
                            role="radio"
                            aria-checked={view === v}
                            onClick={() => setChosenView(v)}
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                              view === v ? "bg-white text-ink-950" : "text-ink-300 hover:text-white"
                            )}
                          >
                            {v === "3d" ? "3D view" : "Floor plan"}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {availability?.failed && !loading ? (
                    <p className="mb-3 rounded-xl border border-ember-500/25 bg-ember-500/10 px-3 py-2 text-xs text-ember-200">
                      Live availability didn&apos;t load. You can still pick seats — we check them
                      again before you pay.
                    </p>
                  ) : null}

                  {view === "3d" ? (
                    <Building3D
                      plan={plan}
                      booked={booked}
                      selected={selected}
                      loading={loading}
                      onToggleSeat={toggleSeat}
                      onToggleGroup={toggleGroup}
                    />
                  ) : (
                    <FloorPlan
                      plan={plan}
                      booked={booked}
                      selected={selected}
                      loading={loading}
                      onToggleSeat={toggleSeat}
                      onToggleGroup={toggleGroup}
                    />
                  )}
                </div>
              </div>

              {/* Keeps the total in reach while scrolling the plan; settles above the checkout */}
              {selectedIds.length > 0 ? (
                <div className="sticky bottom-4 z-30 mx-auto mt-4 max-w-2xl">
                  <a
                    href="#checkout"
                    className="flex items-center justify-between rounded-full bg-ember-400 px-6 py-4 font-semibold text-ink-950 shadow-[0_12px_40px_-8px_rgb(250_204_21_/_0.55)]"
                  >
                    <span>
                      {lines.length === 1 && lines[0].zone.bookAs === "room"
                        ? lines[0].zone.name
                        : `${selectedIds.length} ${selectedIds.length === 1 ? "seat" : "seats"}`}{" "}
                      · {formatNaira(total)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      Continue
                      <ArrowIcon />
                    </span>
                  </a>
                </div>
              ) : null}
            </div>

            {/* ---- Summary + checkout ---- */}
            <aside
              id="checkout"
              className="grid scroll-mt-24 gap-8 rounded-3xl border border-white/8 bg-white/[0.025] p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-2 lg:gap-12"
            >
              {/* Summary on the left, details and payment on the right */}
              <div>
              <h3 className="text-xl font-semibold text-white">Your booking</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-400">
                {PLANS[plan].label} · {units(plan, qty)}
                {startDate ? (
                  <>
                    {" "}
                    · {formatDate(startDate)}
                    {lastDay !== startDate ? <> – {formatDate(lastDay)}</> : null}
                  </>
                ) : null}
              </p>

              <div className="mt-5 border-t border-white/8 pt-4">
                {lines.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-ink-400">
                    Pick seats above to add them here.
                  </p>
                ) : (
                  <ul className="max-h-60 space-y-2 overflow-y-auto pr-1">
                    {lines.flatMap((line) =>
                      line.zone.bookAs === "room"
                        ? [{ key: line.zone.id, title: lineTitle(line.seatIds), ids: line.seatIds }]
                        : line.seatIds.map((id) => ({ key: id, title: seatName(SEATS[id]), ids: [id] }))
                    ).map((item) => (
                      <li key={item.key} className="flex items-center justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate text-ink-200">{item.title}</span>
                        <button
                          type="button"
                          onClick={() => removeLine(item.ids)}
                          aria-label={`Remove ${item.title}`}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {droppedPicks > 0 ? (
                  <p className="mt-3 text-xs text-ember-300">
                    {droppedPicks === 1 ? "1 seat you picked isn't" : `${droppedPicks} seats you picked aren't`}{" "}
                    free on these dates or on this pass, so {droppedPicks === 1 ? "it's" : "they've"} been left out.
                  </p>
                ) : null}
              </div>

              {lines.length > 0 ? (
                <dl className="mt-4 space-y-1.5 border-t border-white/8 pt-4 text-sm">
                  {lines.map((line) => (
                    <div key={line.zone.id} className="flex justify-between gap-3 text-ink-400">
                      <dt>
                        {line.zone.name}
                        <span className="text-ink-500">
                          {" "}
                          {line.zone.bookAs === "room" ? "" : `${line.units} × `}
                          {formatNaira(line.rate)} × {qty}
                        </span>
                      </dt>
                      <dd className="text-ink-200">{formatNaira(line.subtotal)}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <div className="mt-4 flex items-baseline justify-between border-t border-white/8 pt-4" aria-live="polite">
                <span className="text-ink-400">Total</span>
                <span className="font-display text-3xl font-semibold tracking-tight text-white">
                  {formatNaira(total)}
                </span>
              </div>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void pay();
                }}
              >
                <Field label="Full name" htmlFor="booking-name" required>
                  <Input
                    id="booking-name"
                    autoComplete="name"
                    required
                    placeholder="Ada Obi"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </Field>
                <Field label="Email" htmlFor="booking-email" hint="Your receipt and booking code go here." required>
                  <Input
                    id="booking-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="ada@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </Field>
                <Field label="Phone" htmlFor="booking-phone" required>
                  <Input
                    id="booking-phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </Field>

                {error ? (
                  <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </p>
                ) : null}

                <Button type="submit" size="lg" disabled={!canPay} className="w-full">
                  {payLabel}
                  {canPay ? <ArrowIcon /> : null}
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-400">
                  <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 018 0v4" />
                  </svg>
                  Card, transfer or USSD, through Paystack.
                </p>
              </form>
            </aside>
          </div>
        )}
      </Container>
    </Section>
  );
}

/** "Private Office 1 — whole room", or the zone and its seats. */
function lineTitle(seatIds: string[]) {
  const zone = SEATS[seatIds[0]].zone;
  return zone.bookAs === "room"
    ? `${zone.name} — whole room`
    : `${zone.name}: ${seatIds.map((id) => `${SEATS[id].group.name} seat ${SEATS[id].seat.label}`).join(", ")}`;
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full text-lg text-ink-200 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function Legend({ className, label, cross }: { className: string; label: string; cross?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={cn("grid h-4 w-4 place-items-center rounded-[5px] border", className)}>
        {cross ? (
          <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : null}
      </span>
      {label}
    </span>
  );
}

function ConfirmationCard({ confirmation: c, onReset }: { confirmation: Confirmation; onReset: () => void }) {
  const { lines } = quote(c.seatIds, c.plan, c.qty);

  return (
    <div className="mx-auto mt-14 max-w-xl rounded-3xl border border-white/8 bg-white/[0.025] p-6 text-center sm:p-10">
      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-ember-500/30 bg-ember-500/10">
        <svg className="h-8 w-8 text-ember-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h3 className="text-3xl font-semibold tracking-tight text-white">You&apos;re booked</h3>
      <p className="mt-3 text-ink-300">
        Show this code at the front desk. Your receipt is on its way to{" "}
        <span className="text-white">{c.email}</span>.
      </p>

      <div className="mt-8 rounded-2xl border border-white/8 bg-ink-950 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">Booking code</p>
        <p className="mt-2 font-mono text-3xl font-medium tracking-[0.12em] text-ember-400">{c.bookingCode}</p>
      </div>

      <dl className="mt-8 space-y-3 text-left text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-400">Dates</dt>
          <dd className="text-right text-ink-200">
            {formatDate(c.startDate)}
            {c.endDate !== c.startDate ? <> – {formatDate(c.endDate)}</> : null}
            <span className="text-ink-400"> ({units(c.plan, c.qty)})</span>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-ink-400">Space</dt>
          <dd className="space-y-1 text-right text-ink-200">
            {lines.map((l) => (
              <div key={l.zone.id}>{lineTitle(l.seatIds)}</div>
            ))}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-white/8 pt-3">
          <dt className="text-ink-400">Paid</dt>
          <dd className="font-semibold text-white">{formatNaira(c.total)}</dd>
        </div>
      </dl>

      <div className="mt-10">
        <Button type="button" variant="secondary" size="md" onClick={onReset}>
          Book another seat
        </Button>
      </div>
    </div>
  );
}
