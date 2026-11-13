"use client";

import { cn } from "@/lib/cn";
import { roomState } from "./rooms";
import {
  PLANS,
  SEATS,
  ZONES,
  formatNaira,
  offers,
  seatName,
  zoneSeatIds,
  type PlanId,
  type Seat,
  type SeatGroup,
  type Zone,
} from "@/lib/workspace";

type SeatState = "free" | "selected" | "booked";

type FloorPlanProps = {
  plan: PlanId;
  booked: Set<string>;
  selected: Set<string>;
  loading: boolean;
  onToggleSeat: (seatId: string) => void;
  onToggleGroup: (seatIds: string[]) => void;
};

type RoomProps = FloorPlanProps & { zone: Zone };

/**
 * The whole building from above, as sketched:
 *
 *   ┌──────────────┬──────────┬──────────┐
 *   │ Main         │ Private  │ Private  │
 *   │ workspace    │ office 1 │ office 2 │
 *   │              ├──────────┴──────────┤
 *   │ ┌─────────┐  │ Corridor            │
 *   │ │Reception│  ├──────────┬──────────┤
 *   │ │         │  │ Bath/WC  │ Closed   │
 *   └─┴─────────┴──┴──────────┴──────────┘
 *        ↑ entrance
 *
 * The plan's background is the wall colour; rooms are opaque tiles laid on it
 * with a 2px gap, so the gaps read as walls. A door is a short tile-coloured
 * strip laid over a gap. Below `lg` the rooms stack and the corridor and
 * bathrooms (nothing to book there) are left out.
 */
export default function FloorPlan(props: FloorPlanProps) {
  const zone = (id: string) => ZONES.find((z) => z.id === id);
  const main = zone("main");
  const office1 = zone("office1");
  const office2 = zone("office2");
  const quiet = zone("quiet");

  return (
    <div className="grid gap-[2px] bg-white/25 p-[2px] sm:grid-cols-2 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)]">
      {main ? <MainFloor zone={main} {...props} className="sm:col-span-2 lg:col-span-1 lg:row-span-3" /> : null}
      {office1 ? (
        <Room zone={office1} {...props} door={{ side: "bottom", at: "44%" }} windows={[{ side: "top", at: "12%", size: "76%" }]} />
      ) : null}
      {office2 ? (
        <Room
          zone={office2}
          {...props}
          door={{ side: "bottom", at: "40%" }}
          windows={[
            { side: "top", at: "12%", size: "76%" },
            { side: "right", at: "22%", size: "55%" },
          ]}
        />
      ) : null}

      <Utility label="Corridor" className="hidden min-h-14 lg:col-span-2 lg:grid">
        {/* the door from the main floor */}
        <Door side="left" at="50%" center />
      </Utility>
      <div className="hidden gap-[2px] bg-white/25 lg:grid lg:grid-cols-2">
        <Utility label="Bathroom" hatched>
          <Door side="top" at="35%" />
        </Utility>
        <Utility label="Toilet" hatched>
          <Door side="top" at="35%" />
        </Utility>
      </div>

      {quiet ? <Room zone={quiet} {...props} door={{ side: "top", at: "55%" }} className="sm:col-span-2 lg:col-span-1" /> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Walls and doors
// ---------------------------------------------------------------------------

type Side = "top" | "bottom" | "left" | "right";

/**
 * A gap in a wall. Sits on the edge of its room and covers the 2px wall gap
 * next to it. `at` is the gap's start along the wall; `center` centres it there.
 */
function Door({ side, at, center, className }: { side: Side; at: string; center?: boolean; className?: string }) {
  const across = side === "top" || side === "bottom";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10 bg-ink-950",
        across ? "h-[2px] w-10" : "h-10 w-[2px]",
        side === "top" && "-top-[2px]",
        side === "bottom" && "-bottom-[2px]",
        side === "left" && "-left-[2px]",
        side === "right" && "-right-[2px]",
        center && (across ? "-translate-x-1/2" : "-translate-y-1/2"),
        className
      )}
      style={across ? { left: at } : { top: at }}
    />
  );
}

/** A window in an outside wall, drawn the way plans do: a pale strip in the wall line. */
function WindowMark({ side, at, size, always }: { side: Side; at: string; size: string; always?: boolean }) {
  const across = side === "top" || side === "bottom";
  return (
    <span
      aria-hidden="true"
      title="Window with blackout blind"
      className={cn(
        "pointer-events-none absolute z-10 bg-sky-200/80",
        always ? "block" : "hidden lg:block",
        across ? "h-[2px]" : "w-[2px]",
        side === "top" && "-top-[2px]",
        side === "bottom" && "-bottom-[2px]",
        side === "left" && "-left-[2px]",
        side === "right" && "-right-[2px]"
      )}
      style={across ? { left: at, width: size } : { top: at, height: size }}
    />
  );
}

/** A wall drawn inside a room (reception's walls), positioned in % of the room. */
function Wall({ className }: { className: string }) {
  return <span aria-hidden="true" className={cn("pointer-events-none absolute bg-white/25", className)} />;
}

/** Rooms with nothing to book: the corridor, bathroom and toilet. */
function Utility({
  label,
  hatched,
  className,
  children,
}: {
  label: string;
  hatched?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative place-items-center bg-ink-950 p-3",
        className ?? "grid",
        hatched && "[background-image:repeating-linear-gradient(135deg,transparent_0_9px,rgb(255_255_255_/_0.025)_9px_11px)]"
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-600">{label}</span>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared room pieces
// ---------------------------------------------------------------------------

function RoomHeader({ zone, price, status, warn }: { zone: Zone; price: string; status: string; warn: boolean }) {
  return (
    <header className="relative flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
      <div>
        <h3 className="font-semibold leading-tight text-white">{zone.name}</h3>
        <p className="mt-0.5 text-xs text-ink-400">{zone.blurb}</p>
      </div>
      <div className="text-right">
        <p className="font-mono text-xs uppercase tracking-wider text-ember-400">{price}</p>
        <p className={cn("mt-0.5 font-mono text-[11px] uppercase tracking-wider", warn ? "text-red-400" : "text-ink-400")}>
          {status}
        </p>
      </div>
    </header>
  );
}

/** A table top or desk. Also a button that picks every free seat at it. */
function Surface({
  className,
  label,
  vertical,
  selected,
  disabled,
  onClick,
  ariaLabel,
}: {
  className: string;
  label: string;
  vertical?: boolean;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={cn(
        className,
        "grid shrink-0 place-items-center rounded-lg border font-mono text-[9px] uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed",
        selected
          ? "border-ember-400/70 bg-ember-500/15 text-ember-300"
          : "border-white/8 bg-white/[0.05] text-ink-400 enabled:hover:border-ember-400/50 enabled:hover:text-ink-200"
      )}
    >
      <span className={vertical ? "[writing-mode:vertical-rl]" : undefined}>{label}</span>
    </button>
  );
}

/** One table or desk with its chairs, in the shape it has on the floor. */
function Group({ group, zone, room }: { group: SeatGroup; zone: Zone; room: RoomProps }) {
  const { plan, booked, selected, loading, onToggleSeat, onToggleGroup } = room;
  const isRoom = zone.bookAs === "room";
  const sold = offers(zone, plan);

  // A private office toggles as one unit; a table toggles only its free seats.
  const targetIds = isRoom ? zoneSeatIds(zone) : group.seats.map((s) => s.id).filter((id) => !booked.has(id));
  const unavailable = !sold || targetIds.length === 0 || (isRoom && targetIds.some((id) => booked.has(id)));
  const allSelected = !unavailable && targetIds.every((id) => selected.has(id));

  const chair = (seat: Seat) => (
    <Chair
      key={seat.id}
      seat={seat}
      plan={plan}
      state={booked.has(seat.id) ? "booked" : selected.has(seat.id) ? "selected" : "free"}
      disabled={loading || unavailable}
      onClick={() => (isRoom ? onToggleGroup(targetIds) : onToggleSeat(seat.id))}
    />
  );

  const surface = (className: string, label: string, vertical?: boolean) => (
    <Surface
      className={className}
      label={label}
      vertical={vertical}
      selected={allSelected}
      disabled={loading || unavailable}
      onClick={() => onToggleGroup(targetIds)}
      ariaLabel={`${allSelected ? "Deselect" : "Select"} ${isRoom ? zone.name : `all free seats at ${zone.name} ${group.name}`}`}
    />
  );

  const [a, b, c, d] = group.seats;

  switch (group.layout) {
    case "table4":
      return (
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex gap-2">
            {chair(a)}
            {chair(b)}
          </div>
          {surface("h-12 w-[88px]", group.name)}
          <div className="flex gap-2">
            {chair(c)}
            {chair(d)}
          </div>
        </div>
      );

    case "table4v":
      return (
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col gap-2">
            {chair(a)}
            {chair(b)}
          </div>
          {surface("h-[88px] w-12", group.name, true)}
          <div className="flex flex-col gap-2">
            {chair(c)}
            {chair(d)}
          </div>
        </div>
      );

    case "table2":
      return (
        <div className="flex flex-col items-center gap-1.5">
          {chair(a)}
          {surface("h-12 w-14", group.name)}
          {chair(b)}
        </div>
      );

    case "wall2":
      return (
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col gap-2">
            {chair(a)}
            {chair(b)}
          </div>
          {surface("h-[88px] w-9", group.name, true)}
        </div>
      );

    case "row": {
      // Chairs on one side only. Width: n chairs of 40px with 8px between.
      const chairs = <div className="flex gap-2">{group.seats.map(chair)}</div>;
      const top = surface("h-9", group.name);
      return (
        <div className="flex flex-col items-stretch gap-1.5">
          {group.side === "above" ? chairs : null}
          {top}
          {group.side !== "above" ? chairs : null}
        </div>
      );
    }

    case "desks3":
      return (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex gap-2">
            {group.seats.map((seat) => (
              <div key={seat.id} className="flex flex-col items-center gap-1.5">
                <div aria-hidden="true" className="h-8 w-11 rounded-md border border-white/8 bg-white/[0.05]" />
                {chair(seat)}
              </div>
            ))}
          </div>
          {surface(
            "h-9 w-full max-w-[13rem] text-[10px]",
            !sold ? "Not on this pass" : unavailable ? "Booked" : allSelected ? "Office selected" : "Book whole office"
          )}
        </div>
      );
  }
}

// ---------------------------------------------------------------------------
// Main floor
// ---------------------------------------------------------------------------

function MainFloor({ className, ...props }: RoomProps & { className?: string }) {
  const { zone } = props;
  const state = roomState(props.zone, props.plan, props.booked, props.selected, props.loading);
  const [t1, t2, t3] = zone.groups;

  return (
    <section aria-label={zone.name} className={cn("relative flex flex-col bg-ink-950", className, !state.sold && "opacity-60")}>
      {/* Doors in the outer wall: one at the top between the tables, the entrance into reception */}
      <Door side="top" at="54%" />
      {/* A window in each corner; the bottom-left one is reception's */}
      <WindowMark side="left" at="3%" size="12%" always />
      <WindowMark side="top" at="84%" size="13%" always />
      <WindowMark side="left" at="85%" size="12%" always />
      <WindowMark side="bottom" at="84%" size="13%" />
      <Door side="bottom" at="12%" className="hidden w-14 lg:block" />

      <div className="p-4 pb-0 sm:p-5 sm:pb-0">
        <RoomHeader zone={zone} price={state.price} status={state.status} warn={state.warn} />
      </div>

      {/* Reception's walls are drawn over a 2×2 grid; its door faces the tables. */}
      <div className="relative grid min-h-[24rem] flex-1 grid-cols-[46fr_54fr] grid-rows-[54fr_46fr]">
        <Wall className="left-0 top-[54%] h-[2px] w-[46%]" />
        <Wall className="left-[46%] top-[54%] h-[14%] w-[2px]" />
        <Wall className="bottom-0 left-[46%] h-[20%] w-[2px]" />

        <div className="flex items-center justify-center p-2">
          <Group group={t1} zone={zone} room={props} />
        </div>
        <div className="flex items-center justify-center p-2">
          <Group group={t2} zone={zone} room={props} />
        </div>
        <div className="relative grid place-items-center p-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Reception</span>
          <span className="pointer-events-none absolute bottom-2 left-[26%] -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em] text-ember-400/80">
            ↑ Entrance
          </span>
        </div>
        {/* The wall desk sits against the main floor's right-hand wall */}
        <div className="flex items-center justify-end py-2">
          <Group group={t3} zone={zone} room={props} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Bookable rooms
// ---------------------------------------------------------------------------

function Room({
  className,
  door,
  windows = [],
  ...props
}: RoomProps & {
  className?: string;
  door: { side: Side; at: string };
  windows?: Array<{ side: Side; at: string; size: string }>;
}) {
  const { zone } = props;
  const state = roomState(props.zone, props.plan, props.booked, props.selected, props.loading);
  // The closed workspace is laid out top to bottom; the rest sit in a row.
  const stacked = zone.groups.every((g) => g.layout === "row");

  return (
    <section aria-label={zone.name} className={cn("relative flex flex-col bg-ink-950 p-4 sm:p-5", className, !state.sold && "opacity-60")}>
      {state.roomSelected ? <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ember-500/[0.07]" /> : null}
      {/* Doors open onto the corridor, which is only drawn from lg up */}
      <Door side={door.side} at={door.at} className="hidden lg:block" />
      {windows.map((w, i) => (
        <WindowMark key={i} {...w} />
      ))}

      <RoomHeader zone={zone} price={state.price} status={state.status} warn={state.warn} />

      <div
        className={cn(
          "relative flex flex-1 items-center pb-1 pt-6",
          stacked ? "flex-col justify-between gap-7" : "flex-wrap justify-around gap-x-4 gap-y-6"
        )}
      >
        {zone.groups.map((group) => (
          <Group key={group.id} group={group} zone={zone} room={props} />
        ))}
      </div>
    </section>
  );
}

function Chair({
  seat,
  state,
  disabled,
  plan,
  onClick,
}: {
  seat: Seat;
  state: SeatState;
  disabled: boolean;
  plan: PlanId;
  onClick: () => void;
}) {
  const info = SEATS[seat.id];
  const rate = info.zone.rates[plan];
  const label =
    state === "booked"
      ? `${seatName(info)}, already booked`
      : rate === undefined
        ? `${seatName(info)}, not available on a ${PLANS[plan].unit} pass`
        : `${seatName(info)}, ${formatNaira(rate)} per ${PLANS[plan].unit}${info.zone.bookAs === "room" ? " for the whole office" : ""}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || state === "booked"}
      aria-pressed={state === "selected"}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border font-mono text-xs font-medium transition-all duration-150",
        state === "free" &&
          "border-white/15 bg-white/[0.03] text-ink-300 enabled:hover:border-ember-400/70 enabled:hover:bg-ember-500/10 enabled:hover:text-white",
        state === "selected" && "border-ember-300 bg-ember-400 text-ink-950 shadow-[0_0_24px_-4px_rgb(250_204_21_/_0.6)]",
        state === "booked" &&
          "cursor-not-allowed border-white/10 text-ink-500 [background:repeating-linear-gradient(135deg,transparent_0_5px,rgb(255_255_255_/_0.05)_5px_7px)]",
        disabled && state === "free" && "cursor-not-allowed opacity-60"
      )}
    >
      {state === "booked" ? (
        <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : state === "selected" ? (
        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        seat.label
      )}
    </button>
  );
}
