import { PLANS, offers, zoneSeatIds, type PlanId, type Zone } from "@/lib/workspace";

/** What both the 3D view and the flat plan say about a room right now. */
export function roomState(
  zone: Zone,
  plan: PlanId,
  booked: Set<string>,
  selected: Set<string>,
  loading: boolean
) {
  const ids = zoneSeatIds(zone);
  const free = ids.filter((id) => !booked.has(id)).length;
  const sold = offers(zone, plan);
  const isRoom = zone.bookAs === "room";
  const roomFree = free === ids.length;
  const roomSelected = isRoom && ids.every((id) => selected.has(id));
  const full = isRoom ? !roomFree : free === 0;
  const rate = zone.rates[plan];

  const status = !sold
    ? "" // the price line already says which passes it's on
    : loading
      ? "Checking…"
      : isRoom
        ? `Whole room · ${roomFree ? "Available" : "Booked"}`
        : full
          ? "Full"
          : `${free} of ${ids.length} free`;

  const price =
    rate !== undefined
      ? `${formatRate(rate)} / ${PLANS[plan].unit}`
      : `${(Object.keys(PLANS) as PlanId[])
          .filter((p) => offers(zone, p))
          .map((p) => PLANS[p].unit)
          .join(" & ")} passes only`;

  return { sold, roomSelected, status, price, warn: !loading && sold && full };
}

function formatRate(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}
