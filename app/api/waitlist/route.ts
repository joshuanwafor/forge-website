import { NextRequest, NextResponse } from 'next/server';

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

    // Zoho Campaign Configuration
    const ZOHO_API_URL = process.env.ZOHO_API_URL || 'https://campaigns.zoho.com/api/v1.1';
    const ZOHO_AUTH_TOKEN = process.env.ZOHO_AUTH_TOKEN;
    const ZOHO_LIST_KEY = process.env.ZOHO_WAITLIST_KEY;

    if (!ZOHO_AUTH_TOKEN || !ZOHO_LIST_KEY) {
      console.error('Zoho credentials not configured');
      // Still save to database/log even if Zoho fails
    }

    // Prepare data for Zoho Campaign
    const zohoData = {
      listkey: ZOHO_LIST_KEY,
      contactinfo: JSON.stringify({
        'Contact Email': email,
        'First Name': fullName.split(' ')[0] || fullName,
        'Last Name': fullName.split(' ').slice(1).join(' ') || '',
        'Phone': phone || '',
        'Interest': interest,
        'Referral Source': referral || 'Unknown',
        'Message': message || '',
        'Signup Date': new Date().toISOString(),
        'Source': 'Website Waitlist'
      }),
      resfmt: 'JSON'
    };

    // Add to Zoho Campaign
    if (ZOHO_AUTH_TOKEN && ZOHO_LIST_KEY) {
      try {
        const zohoResponse = await fetch(`${ZOHO_API_URL}/json/listsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            authtoken: ZOHO_AUTH_TOKEN,
            scope: 'CampaignsAPI',
            ...zohoData
          }).toString()
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

    // TODO: Also save to your database here
    // await db.waitlist.create({ fullName, email, phone, interest, referral, message });

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

