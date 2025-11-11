# Environment Setup

## Supabase Database Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the database to be ready (takes ~2 minutes)

### 2. Set Up Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `lib/supabase-schema.sql`
3. Paste and run the SQL commands to create tables:
   - `waitlist` - Stores waitlist signups
   - `course_applications` - Stores course applications

### 3. Get Supabase Credentials

1. Go to **Project Settings** > **API**
2. Copy your:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon/Public Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY) - **Keep this secret!**

## Zoho Campaign Integration (Optional)

To also sync form submissions to Zoho Campaign for email marketing:

### Get Zoho Credentials

1. **Auth Token**: 
   - Go to https://www.zoho.com/campaigns/
   - Navigate to Settings > API
   - Generate your API auth token

2. **List Keys**:
   - Go to your Zoho Campaign dashboard
   - Navigate to Contacts > Mailing Lists
   - Create two lists: "Waitlist" and "Academy Applications"
   - Copy the list keys from each list settings

## Paystack Payment Integration

### Get Paystack API Keys

1. Create account at [https://paystack.com](https://paystack.com)
2. Go to **Settings** > **API Keys & Webhooks**
3. Copy your:
   - **Public Key** (for client-side)
   - **Secret Key** (for server-side verification)
4. Use test keys for development (starts with `pk_test_`)
5. Switch to live keys for production (starts with `pk_live_`)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Paystack Configuration (REQUIRED for course payments)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx

# Zoho Campaign API Configuration (OPTIONAL)
ZOHO_AUTH_TOKEN=your_zoho_auth_token_here
ZOHO_API_URL=https://campaigns.zoho.com/api/v1.1
ZOHO_WAITLIST_KEY=your_waitlist_list_key_here
ZOHO_ACADEMY_LIST_KEY=your_academy_list_key_here
```

## Testing Forms

- **Waitlist Form**: http://localhost:3000/waitlist
- **Application Form**: http://localhost:3000/apply

### What Happens When Forms are Submitted:

**Waitlist Form:**
1. ✅ **Data saved to Supabase** (always, required)
2. ✅ **Synced to Zoho Campaign** (optional, if configured)
3. ✅ **Success screen shown** to user

**Course Application Form:**
1. 💳 **Paystack payment modal opens**
2. ✅ **Payment processed** (required)
3. ✅ **Data saved to Supabase** (only after successful payment)
4. ✅ **Synced to Zoho Campaign** (optional, if configured)
5. ✅ **Success screen shown** to user

## Course Fees

### Application Fee
**₦5,000** - Required for all course applications (paid upfront)

### Full Course Fee
**₦100,000** - All courses (4-6 months intensive program) **- DISCOUNTED PRICE**

After application payment:
- Application saved to database
- Team contacts you within 24 hours
- Full course details and payment plans provided
- Enrollment process begins

**Note:** The ₦100,000 course fee is a special discounted rate for our intensive mentorship program.

