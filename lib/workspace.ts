/**
 * Floor plan, pricing and date helpers for desk bookings.
 *
 * Shared by the booking UI (client) and the booking API (server), so the price
 * a visitor sees is the price the server checks Paystack against. Rates match
 * the published Pricing section — change them in both places.
 */

export type PlanId = "day" | "week" | "month";
export type ZoneKind = "open" | "private" | "quiet";
/**
 * table4  — table across the room, 2 chairs above and 2 below
 * table4v — table running lengthways, 2 chairs either side
 * table2  — small table, 1 chair above and 1 below
 * wall2   — desk against a wall, 2 chairs facing it
 * row     — chairs along one side only; `side` says which (closed workspace)
 * desks3  — 3 desks along a wall, one chair each (private offices)
 */
export type GroupLayout = "table4" | "table4v" | "table2" | "wall2" | "row" | "desks3";

export interface Seat {
  id: string;
  label: string;
}

export interface SeatGroup {
  id: string;
  name: string;
  layout: GroupLayout;
  /** For "row": the side of the table the chairs are on. */
  side?: "above" | "below";
  seats: Seat[];
}

export interface Zone {
  id: string;
  name: string;
  kind: ZoneKind;
  blurb: string;
  /**
   * "seat": each seat is sold on its own, priced per seat.
   * "room": the whole room is sold as one unit, priced per room.
   */
  bookAs: "seat" | "room";
  /**
   * Naira per day / week / month — per seat or per room, depending on bookAs.
   * A plan left out isn't sold for this zone.
   */
  rates: Partial<Record<PlanId, number>>;
  groups: SeatGroup[];
}

export const PLANS: Record<PlanId, { label: string; unit: string; units: string; maxQty: number }> = {
  day: { label: "Day pass", unit: "day", units: "days", maxQty: 6 },
  week: { label: "Week pass", unit: "week", units: "weeks", maxQty: 4 },
  month: { label: "Month pass", unit: "month", units: "months", maxQty: 3 },
};

/** Hot desk rates. The quiet room is "included on every plan", so it uses these too. */
const HOT_DESK = { day: 3000, week: 10000, month: 20000 };

/** Per room. No monthly rate published yet, so offices are day and week only. */
const PRIVATE_OFFICE = { day: 6000, week: 42000 };

/** How far ahead a booking can start. */
export const MAX_DAYS_AHEAD = 90;

function table(
  zoneId: string,
  n: number,
  size: 2 | 4,
  layout?: GroupLayout,
  side?: SeatGroup["side"]
): SeatGroup {
  return {
    id: `${zoneId}-t${n}`,
    name: `Table ${n}`,
    layout: layout ?? (size === 4 ? "table4" : "table2"),
    side,
    seats: Array.from({ length: size }, (_, i) => ({
      id: `${zoneId}-t${n}-s${i + 1}`,
      label: `${i + 1}`,
    })),
  };
}

function office(zoneId: string): SeatGroup {
  return {
    id: `${zoneId}-desks`,
    name: "Desks",
    layout: "desks3",
    seats: Array.from({ length: 3 }, (_, i) => ({ id: `${zoneId}-d${i + 1}`, label: `${i + 1}` })),
  };
}

// Order matters: it is the reading order of the floor plan.
export const ZONES: Zone[] = [
  {
    id: "main",
    name: "Main Workspace",
    kind: "open",
    blurb: "The open floor, past reception",
    bookAs: "seat",
    rates: HOT_DESK,
    // Laid out as on the floor: table 1 top left, table 2 top right,
    // table 3 against the right-hand wall.
    groups: [table("main", 1, 4), table("main", 2, 4, "table4v"), table("main", 3, 2, "wall2")],
  },
  {
    id: "office1",
    name: "Private Office 1",
    kind: "private",
    blurb: "Lockable room, 3 desks",
    bookAs: "room",
    rates: PRIVATE_OFFICE,
    groups: [office("office1")],
  },
  {
    id: "quiet",
    name: "Closed Workspace",
    kind: "quiet",
    blurb: "The quiet room — no calls",
    bookAs: "seat",
    rates: HOT_DESK,
    // Everyone sits on one side. The two 4-seaters face each other across the
    // room, with the 2-seater between them. Listed top to bottom.
    groups: [
      table("quiet", 1, 4, "row", "above"),
      table("quiet", 2, 2, "row", "below"),
      table("quiet", 3, 4, "row", "below"),
    ],
  },
  {
    id: "office2",
    name: "Private Office 2",
    kind: "private",
    blurb: "Lockable room, 3 desks",
    bookAs: "room",
    rates: PRIVATE_OFFICE,
    groups: [office("office2")],
  },
];

export interface SeatInfo {
  seat: Seat;
  group: SeatGroup;
  zone: Zone;
}

export const SEATS: Record<string, SeatInfo> = Object.fromEntries(
  ZONES.flatMap((zone) =>
    zone.groups.flatMap((group) => group.seats.map((seat) => [seat.id, { seat, group, zone }]))
  )
);

export const SEAT_IDS = Object.keys(SEATS);
export const TOTAL_SEATS = SEAT_IDS.length;

export function zoneSeatIds(zone: Zone): string[] {
  return zone.groups.flatMap((g) => g.seats.map((s) => s.id));
}

export function seatName({ seat, group, zone }: SeatInfo): string {
  return zone.kind === "private"
    ? `${zone.name} · Desk ${seat.label}`
    : `${zone.name} · ${group.name} · Seat ${seat.label}`;
}

export interface QuoteLine {
  zone: Zone;
  seatIds: string[];
  /** Seats, or 1 for a room */
  units: number;
  rate: number;
  subtotal: number;
}

export function quote(seatIds: string[], plan: PlanId, qty: number) {
  const byZone = new Map<string, string[]>();
  for (const id of seatIds) {
    const info = SEATS[id];
    if (info) byZone.set(info.zone.id, [...(byZone.get(info.zone.id) ?? []), id]);
  }

  const lines: QuoteLine[] = ZONES.filter((z) => byZone.has(z.id)).map((zone) => {
    const ids = byZone.get(zone.id)!;
    const units = zone.bookAs === "room" ? 1 : ids.length;
    const rate = zone.rates[plan] ?? 0;
    return { zone, seatIds: ids, units, rate, subtotal: rate * qty * units };
  });

  return { lines, total: lines.reduce((sum, l) => sum + l.subtotal, 0) };
}

/** Whether this zone can be booked on the given pass. */
export function offers(zone: Zone, plan: PlanId): boolean {
  return zone.rates[plan] !== undefined;
}

/** A room zone has to be booked whole. Returns the zones that were only partly picked. */
export function partialRooms(seatIds: string[]): Zone[] {
  const picked = new Set(seatIds);
  return ZONES.filter((z) => {
    if (z.bookAs !== "room") return false;
    const ids = zoneSeatIds(z);
    const n = ids.filter((id) => picked.has(id)).length;
    return n > 0 && n < ids.length;
  });
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

// ---- Dates: plain YYYY-MM-DD calendar days, Lagos time ----

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function todayInLagos(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Same day-of-month, `months` later; clamped, so 31 Jan + 1 month is 28/29 Feb. */
export function addMonths(date: string, months: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}

/** Inclusive last day of a booking. A month pass runs to the day before the same date next month. */
export function endDate(start: string, plan: PlanId, qty: number): string {
  if (plan === "month") return addDays(addMonths(start, qty), -1);
  return addDays(start, (plan === "week" ? 7 : 1) * qty - 1);
}

export function formatDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
