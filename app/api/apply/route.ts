import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      fullName,
      location,
      gender,
      phone,
      email,
      courseOfInterest,
      whyInterested,
      availability,
      paymentReference,
      paymentStatus,
      amountPaid
    } = body;

    // Validate required fields
    if (!fullName || !location || !gender || !phone || !email || !courseOfInterest || !whyInterested || !availability) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate payment
    if (!paymentReference || !paymentStatus || paymentStatus !== 'success') {
      return NextResponse.json(
        { error: 'Payment required to complete application' },
        { status: 400 }
      );
    }

    // Save to Supabase (using service role to bypass RLS)
    const { data: supabaseData, error: supabaseError } = await supabaseServer
      .from('course_applications')
      .insert([
        {
          full_name: fullName,
          location: location,
          gender: gender,
          phone: phone,
          email: email,
          course_of_interest: courseOfInterest,
          why_interested: whyInterested,
          availability: availability,
          payment_reference: paymentReference,
          payment_status: paymentStatus,
          amount_paid: amountPaid
        }
      ])
      .select();

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return NextResponse.json(
        { error: 'Failed to save application', details: supabaseError.message },
        { status: 500 }
      );
    }

    // Zoho Campaign Configuration
    const ZOHO_API_URL = process.env.ZOHO_API_URL || 'https://campaigns.zoho.com/api/v1.1';
    const ZOHO_AUTH_TOKEN = process.env.ZOHO_AUTH_TOKEN;
    const ZOHO_LIST_KEY = process.env.ZOHO_ACADEMY_LIST_KEY;

    if (!ZOHO_AUTH_TOKEN || !ZOHO_LIST_KEY) {
      console.error('Zoho credentials not configured');
    }

    // Prepare data for Zoho Campaign
    const contactInfo = JSON.stringify({
      'Contact Email': email,
      'First Name': fullName.split(' ')[0] || fullName,
      'Last Name': fullName.split(' ').slice(1).join(' ') || '',
      'Phone': phone,
      'Location': location,
      'Gender': gender,
      'Course of Interest': courseOfInterest,
      'Why Interested': whyInterested,
      'Availability': availability,
      'Application Date': new Date().toISOString(),
      'Source': 'Course Application'
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

    // Send notification email to admin
    // await sendEmail({ 
    //   to: 'admin@forge.com', 
    //   template: 'new-application',
    //   data: { fullName, email }
    // });

    // Send confirmation email to applicant
    // await sendEmail({ 
    //   to: email, 
    //   template: 'application-received',
    //   data: { fullName }
    // });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully',
        data: { email }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

