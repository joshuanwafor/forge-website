import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, interest, referral, message } = body;

    // Validate required fields
    if (!fullName || !email || !interest) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to Supabase (using service role to bypass RLS)
    const { data: supabaseData, error: supabaseError } = await supabaseServer
      .from('waitlist')
      .insert([
        {
          full_name: fullName,
          email: email,
          phone: phone || null,
          interest: interest,
          referral: referral || null,
          message: message || null
        }
      ])
      .select();

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      // Continue even if Supabase fails - we still want to add to Zoho
    }

    // Zoho Campaign Configuration
    const ZOHO_API_URL = process.env.ZOHO_API_URL || 'https://campaigns.zoho.com/api/v1.1';
    const ZOHO_AUTH_TOKEN = process.env.ZOHO_AUTH_TOKEN;
    const ZOHO_LIST_KEY = process.env.ZOHO_WAITLIST_KEY;

    if (!ZOHO_AUTH_TOKEN || !ZOHO_LIST_KEY) {
      console.error('Zoho credentials not configured');
      // Still save to database/log even if Zoho fails
    }

    // Prepare data for Zoho Campaign
    const contactInfo = JSON.stringify({
      'Contact Email': email,
      'First Name': fullName.split(' ')[0] || fullName,
      'Last Name': fullName.split(' ').slice(1).join(' ') || '',
      'Phone': phone || '',
      'Interest': interest,
      'Referral Source': referral || 'Unknown',
      'Message': message || '',
      'Signup Date': new Date().toISOString(),
      'Source': 'Website Waitlist'
    });

    // Add to Zoho Campaign
    if (ZOHO_AUTH_TOKEN && ZOHO_LIST_KEY) {
      try {
        const params: Record<string, string> = {
          authtoken: ZOHO_AUTH_TOKEN,
          scope: 'CampaignsAPI',
          listkey: ZOHO_LIST_KEY,
          contactinfo: contactInfo,
          resfmt: 'JSON'
        };

        const zohoResponse = await fetch(`${ZOHO_API_URL}/json/listsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(params).toString()
        });

        const zohoResult = await zohoResponse.json();
        
        if (zohoResult.status === 'error') {
          console.error('Zoho API Error:', zohoResult);
        }
      } catch (zohoError) {
        console.error('Zoho Campaign error:', zohoError);
        // Continue even if Zoho fails
      }
    }

    // Send confirmation email (optional)
    // await sendEmail({ to: email, template: 'waitlist-confirmation' });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully added to waitlist',
        data: { email }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Waitlist submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

