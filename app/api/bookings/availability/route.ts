import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { isIsoDate } from "@/lib/workspace";

/**
 * GET /api/bookings/availability?start=YYYY-MM-DD&end=YYYY-MM-DD
 * The seat ids already booked on any day in the range. No personal data.
 */
export async function GET(request: NextRequest) {
  const start = request.nextUrl.searchParams.get("start");
  const end = request.nextUrl.searchParams.get("end");

  if (!isIsoDate(start) || !isIsoDate(end) || end < start) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Bookings are temporarily unavailable" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("workspace_bookings")
    .select("seat_id")
    .lte("start_date", end)
    .gte("end_date", start);

  if (error) {
    console.error("Availability lookup failed:", error);
    return NextResponse.json({ error: "Could not load availability" }, { status: 500 });
  }

  const booked = [...new Set((data ?? []).map((row) => row.seat_id as string))];
  return NextResponse.json({ booked }, { headers: { "Cache-Control": "no-store" } });
}
