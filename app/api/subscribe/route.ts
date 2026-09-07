import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { clean, isValidEmail, syncToZoho } from "@/lib/leads";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = clean(body.email, 200).toLowerCase();
    const source = clean(body.source, 40) || "website";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    if (!supabase) {
      console.error("Supabase is not configured — subscriber was not stored.");
      return NextResponse.json(
        { error: "Subscriptions are temporarily unavailable." },
        { status: 503 }
      );
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email, source }]);

    // Someone re-subscribing should just see success.
    if (error && error.code !== "23505") {
      console.error("Supabase subscriber insert failed:", error);
      return NextResponse.json(
        { error: "We couldn't save that. Please try again." },
        { status: 500 }
      );
    }

    await syncToZoho(process.env.ZOHO_NEWSLETTER_KEY, {
      "Contact Email": email,
      Source: `Newsletter (${source})`,
    });

    return NextResponse.json({ success: true, message: "Subscribed" });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
