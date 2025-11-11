# Quick Start Guide

Get your Forge website running in 5 minutes!

## 1. Install Dependencies

```bash
yarn install
```

## 2. Set Up Supabase (Required)

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a name, password, and region
4. Wait ~2 minutes for setup

### Create Database Tables
1. Click **SQL Editor** in Supabase dashboard
2. Copy ALL contents from `lib/supabase-schema.sql`
3. Paste into SQL Editor
4. Click **Run** (or Cmd/Ctrl + Enter)
5. You should see: "Success. No rows returned"

### Get Your Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - **Keep this secret!**

## 3. Set Up Paystack (For Course Payments)

### Get Test Keys
1. Go to [paystack.com](https://paystack.com)
2. Sign up for free account
3. Go to **Settings** → **API Keys**
4. Copy **Test Public Key** (starts with `pk_test_`)

## 4. Configure Environment

Create `.env.local` in project root:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Paystack (Required for course payments)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
```

**Important:** Keep `SUPABASE_SERVICE_ROLE_KEY` secret! Never commit to Git or expose to client.

## 5. Run Development Server

```bash
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 6. Test Forms

### Test Waitlist Form
1. Go to [http://localhost:3000/waitlist](http://localhost:3000/waitlist)
2. Fill out the form
3. Click "Join Waitlist"
4. Check Supabase dashboard → **Table Editor** → `waitlist` table
5. You should see your submission!

### Test Application Form (With Payment)
1. Go to [http://localhost:3000/apply](http://localhost:3000/apply)
2. Fill out all 8 fields
3. Click "Proceed to Payment" - Paystack modal opens
4. Use test card: **4084 0840 8408 4081**, CVV: **408**, PIN: **0000**
5. Complete payment
6. Check Supabase → `course_applications` table
7. Payment reference saved with application!

## Optional: Add Zoho Campaign

If you want email marketing integration:

```env
# Add to .env.local
ZOHO_AUTH_TOKEN=your_token_here
ZOHO_WAITLIST_KEY=your_list_key
ZOHO_ACADEMY_LIST_KEY=your_list_key
```

Get credentials from [Zoho Campaign API Settings](https://www.zoho.com/campaigns/help/api/auth-token.html)

## Troubleshooting

### Forms not submitting?
- Check browser console for errors
- Verify `.env.local` has correct Supabase credentials
- Check Supabase dashboard for table creation

### Can't see data in Supabase?
- Go to **Table Editor** (not SQL Editor)
- Select the table from left sidebar
- Data appears in rows

### Environment variables not working?
- Make sure file is named `.env.local` (not `.env`)
- Restart dev server after adding variables
- Variables must start with `NEXT_PUBLIC_` for client-side access

## Next Steps

- Customize team members in `/about` page
- Add real social media links in Footer
- Configure Zoho for email marketing (optional)
- Switch to Paystack live keys for production
- Set up custom domain
- Deploy to Vercel

## Test Cards (Development Only)

**Successful Payment:**
- Card: 4084 0840 8408 4081
- CVV: 408
- PIN: 0000

**Failed Payment:**
- Card: 5060 6666 6666 6666 4444

More test cards: [Paystack Docs](https://paystack.com/docs/payments/test-payments)

## Support

Questions? Check:
- `SETUP.md` - Detailed setup instructions
- `DATABASE.md` - Database schema details
- `PAYMENT.md` - Payment integration guide
- `README.md` - Full project documentation

