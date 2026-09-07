import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { clean, isValidEmail, splitName, syncToZoho } from "@/lib/leads";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const fullName = clean(body.fullName, 120);
    const email = clean(body.email, 200).toLowerCase();
    const interest = clean(body.interest, 80);
    const phone = clean(body.phone, 40);
    const referral = clean(body.referral, 80);
    const message = clean(body.message, 2000);

    if (!fullName || !interest) {
      return NextResponse.json(
        { error: "Please fill in your name and what you're looking for." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    if (!supabase) {
      console.error("Supabase is not configured — waitlist entry was not stored.");
      return NextResponse.json(
        { error: "Sign-ups are temporarily unavailable. Please email us instead." },
        { status: 503 }
      );
    }

    const { error } = await supabase.from("waitlist").insert([
      {
        full_name: fullName,
        email,
        phone: phone || null,
        interest,
        referral: referral || null,
        message: message || null,
      },
    ]);

    if (error) {
      // A repeat sign-up is a success from the visitor's point of view.
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "Already on the waitlist" });
      }
      console.error("Supabase waitlist insert failed:", error);
      return NextResponse.json({ error: "We couldn't save that. Please try again." }, { status: 500 });
    }

    const { firstName, lastName } = splitName(fullName);
    await syncToZoho(process.env.ZOHO_WAITLIST_KEY, {
      "Contact Email": email,
      "First Name": firstName,
      "Last Name": lastName,
      Phone: phone,
      Interest: interest,
      "Referral Source": referral || "Unknown",
      Message: message,
      "Signup Date": new Date().toISOString(),
      Source: "Website Waitlist",
    });

    return NextResponse.json({ success: true, message: "Added to the waitlist" });
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
