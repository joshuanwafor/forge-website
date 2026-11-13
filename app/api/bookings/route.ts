import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { clean, isValidEmail } from "@/lib/leads";
import {
  MAX_DAYS_AHEAD,
  PLANS,
  SEATS,
  addDays,
  endDate,
  isIsoDate,
  offers,
  partialRooms,
  quote,
  todayInLagos,
  type PlanId,
} from "@/lib/workspace";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function bookingCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "FRG-" + Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

function fail(error: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, ...extra }, { status });
}

type Verification = { ok: true; status: "success" | "unverified" } | { ok: false; reason: string };

/** Ask Paystack whether the reference was paid in full, in naira. */
async function verifyPayment(reference: string, expectedKobo: number): Promise<Verification> {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret?.startsWith("sk_")) {
    // Without a secret key there is no way to ask Paystack. Keep the booking so
    // a customer who has paid isn't turned away, but flag it for a manual check.
    console.warn(`PAYSTACK_SECRET_KEY is not an sk_ key; booking ${reference} saved as unverified`);
    return { ok: true, status: "unverified" };
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" }
    );
    const json = await res.json();
    const tx = json?.data;

    if (!res.ok || !json?.status || tx?.status !== "success") {
      return { ok: false, reason: "That payment didn't go through" };
    }
    if (tx.currency !== "NGN" || tx.amount !== expectedKobo) {
      console.error("Paystack amount mismatch", { reference, expectedKobo, paid: tx.amount });
      return { ok: false, reason: "The amount paid doesn't match the booking total" };
    }
    return { ok: true, status: "success" };
  } catch (error) {
    console.error("Paystack verification error:", error);
    return { ok: false, reason: "We couldn't reach Paystack to check the payment" };
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request", 400);
  }

  // ---- Validate ----
  const { seatIds, plan, quantity, startDate, paymentReference } = body;
  const fullName = clean(body.fullName, 120);
  const email = clean(body.email, 200).toLowerCase();
  const phone = clean(body.phone, 40);

  if (
    !Array.isArray(seatIds) ||
    seatIds.length === 0 ||
    new Set(seatIds).size !== seatIds.length ||
    !seatIds.every((id) => typeof id === "string" && SEATS[id])
  ) {
    return fail("Pick at least one seat.", 400);
  }
  const seats = seatIds as string[];
  if (partialRooms(seats).length > 0) return fail("Private offices are booked as a whole room.", 400);

  if (typeof plan !== "string" || !(plan in PLANS)) return fail("Pick a day, week or month pass.", 400);
  const planId = plan as PlanId;
  const notOffered = [...new Set(seats.map((id) => SEATS[id].zone))].filter((z) => !offers(z, planId));
  if (notOffered.length > 0) {
    return fail(`${notOffered[0].name} isn't available on a ${PLANS[planId].label.toLowerCase()}.`, 400);
  }
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > PLANS[planId].maxQty) {
    return fail("That duration isn't available.", 400);
  }

  const today = todayInLagos();
  if (!isIsoDate(startDate) || startDate < today || startDate > addDays(today, MAX_DAYS_AHEAD)) {
    return fail(`Pick a start date in the next ${MAX_DAYS_AHEAD} days.`, 400);
  }
  if (!fullName) return fail("Please add your name.", 400);
  if (!isValidEmail(email)) return fail("That email address doesn't look right.", 400);
  if (!phone) return fail("Please add a phone number.", 400);
  if (typeof paymentReference !== "string" || !paymentReference || paymentReference.length > 100) {
    return fail("Payment reference missing.", 400);
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    console.error("Supabase is not configured — paid booking was not stored:", paymentReference);
    return fail("Bookings are temporarily unavailable", 503, { paymentReference });
  }

  const end = endDate(startDate, planId, qty);
  const { lines, total } = quote(seats, planId, qty);

  // ---- A retried request for the same payment returns the booking already made ----
  const { data: existing, error: existingError } = await supabase
    .from("workspace_bookings")
    .select("booking_code, seat_id, start_date, end_date")
    .eq("payment_reference", paymentReference);
  if (existingError) {
    console.error("Booking lookup failed:", existingError);
    return fail("We couldn't save your booking", 500, { paymentReference });
  }
  if (existing && existing.length > 0) {
    return NextResponse.json({
      bookingCode: existing[0].booking_code,
      seatIds: existing.map((r) => r.seat_id),
      startDate: existing[0].start_date,
      endDate: existing[0].end_date,
    });
  }

  // ---- Payment ----
  const verification = await verifyPayment(paymentReference, total * 100);
  if (!verification.ok) return fail(verification.reason, 402, { paymentReference });

  // ---- Seats still free? ----
  const { data: clashes, error: clashError } = await supabase
    .from("workspace_bookings")
    .select("seat_id")
    .in("seat_id", seats)
    .lte("start_date", end)
    .gte("end_date", startDate);
  if (clashError) {
    console.error("Clash check failed:", clashError);
    return fail("We couldn't save your booking", 500, { paymentReference });
  }
  if (clashes && clashes.length > 0) {
    return fail("Someone else booked one of those seats a moment ago", 409, {
      paymentReference,
      takenSeatIds: [...new Set(clashes.map((c) => c.seat_id))],
    });
  }

  // ---- One row per seat; a room's price is split across its desks ----
  const code = bookingCode();
  const shareOf = new Map(
    lines.flatMap((l) => l.seatIds.map((id) => [id, Math.round((l.subtotal / l.seatIds.length) * 100) / 100]))
  );
  const rows = seats.map((seatId) => ({
    booking_code: code,
    seat_id: seatId,
    zone_id: SEATS[seatId].zone.id,
    plan: planId,
    quantity: qty,
    start_date: startDate,
    end_date: end,
    full_name: fullName,
    email,
    phone,
    amount_paid: shareOf.get(seatId) ?? 0,
    booking_total: total,
    payment_reference: paymentReference,
    payment_status: verification.status,
  }));

  const { error: insertError } = await supabase.from("workspace_bookings").insert(rows);
  if (insertError) {
    console.error("Booking insert failed:", insertError);
    // 23P01: the no-overlap constraint; 23505: unique (reference, seat). Both mean a race.
    if (insertError.code === "23P01" || insertError.code === "23505") {
      return fail("Someone else booked one of those seats a moment ago", 409, { paymentReference });
    }
    return fail("We couldn't save your booking", 500, { paymentReference });
  }

  return NextResponse.json({ bookingCode: code, seatIds: seats, startDate, endDate: end });
}
