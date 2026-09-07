import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { clean, isValidEmail, splitName, syncToZoho } from "@/lib/leads";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const fullName = clean(body.fullName, 120);
    const email = clean(body.email, 200).toLowerCase();
    const phone = clean(body.phone, 40);
    const teamSize = clean(body.teamSize, 20);
    const interest = clean(body.interest, 80);
    const preferredDate = clean(body.preferredDate, 20);
    const preferredTime = clean(body.preferredTime, 60);
    const message = clean(body.message, 2000);

    if (!fullName || !interest || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: "Please fill in every required field." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
    }

    // Reject dates that are malformed or already in the past.
    const requested = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(requested.getTime()) || requested < today) {
      return NextResponse.json({ error: "Please pick a date in the future." }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    if (!supabase) {
      console.error("Supabase is not configured — tour request was not stored.");
      return NextResponse.json(
        { error: "Bookings are temporarily unavailable. Please email us instead." },
        { status: 503 }
      );
    }

    const { error } = await supabase.from("tour_requests").insert([
      {
        full_name: fullName,
        email,
        phone: phone || null,
        team_size: teamSize || null,
        interest,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        message: message || null,
        status: "new",
      },
    ]);

    if (error) {
      console.error("Supabase tour insert failed:", error);
      return NextResponse.json(
        { error: "We couldn't save that. Please try again." },
        { status: 500 }
      );
    }

    const { firstName, lastName } = splitName(fullName);
    await syncToZoho(process.env.ZOHO_TOUR_LIST_KEY, {
      "Contact Email": email,
      "First Name": firstName,
      "Last Name": lastName,
      Phone: phone,
      Interest: interest,
      "Team Size": teamSize,
      "Preferred Date": preferredDate,
      "Preferred Time": preferredTime,
      Message: message,
      Source: "Website Tour Request",
    });

    return NextResponse.json({ success: true, message: "Tour request received" });
  } catch (error) {
    console.error("Tour submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
