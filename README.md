# Forge Website

A modern, animated website for Forge - combining a tech hub workspace, startup academy, and professional courses platform.

## Features

- 🏢 **Hub** - Premium workspace and coworking space for developers
- 🎓 **Academy** - Elite startup program where failure is mandatory
- 📚 **Courses** - Professional training in Web, Mobile, Backend, and Design
- 📝 **Application Forms** - Integrated with Zoho Campaign
- ✨ **Modern UI** - Animated backgrounds, gradient effects, glass morphism
- 📱 **Fully Responsive** - Works on all devices

## Pages

- `/` - Hub (Workspace) landing page
- `/academy` - Academy program details
- `/courses` - Course offerings
- `/apply` - Academy application form
- `/waitlist` - Waitlist signup
- `/about` - Team and company information

## Getting Started

### Installation

```bash
yarn install
```

### Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Database & Integrations

### Supabase (Required)

Forms save to Supabase database. See `SETUP.md` for detailed instructions.

1. Create project at [supabase.com](https://supabase.com)
2. Run SQL schema from `lib/supabase-schema.sql`
3. Add credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Note:** Service role key bypasses RLS for server-side operations.

### Paystack Payment (Required for Courses)

Course applications require payment processing:

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxx
```

Get keys from [paystack.com](https://paystack.com). See `PAYMENT.md` for details.

### Zoho Campaign (Optional)

Forms also sync to Zoho Campaign for email marketing when configured:

```env
ZOHO_AUTH_TOKEN=your_zoho_token
ZOHO_WAITLIST_KEY=your_waitlist_key
ZOHO_ACADEMY_LIST_KEY=your_academy_key
```

## Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Payments**: Paystack (react-paystack)
- **Email Marketing**: Zoho Campaign (optional)
- **Font**: Inter (Google Fonts)
- **Animations**: CSS Keyframes + Tailwind utilities

## Project Structure

```
app/
├── (pages)
│   ├── page.tsx          # Hub homepage
│   ├── academy/          # Academy page
│   ├── courses/          # Courses page
│   ├── apply/            # Application form
│   ├── waitlist/         # Waitlist form
│   └── about/            # About page
├── api/
│   ├── waitlist/         # Waitlist API endpoint
│   └── apply/            # Application API endpoint
├── layout.tsx            # Root layout
└── globals.css           # Global styles

components/
├── Header.tsx            # Shared navigation
└── Footer.tsx            # Shared footer
```

## Key Features

### Animations
- Blob gradients with organic movement
- Rotating gradient meshes
- Animated grid patterns
- Traveling light beams
- Floating particles
- Wave effects

### Forms
- Real-time validation
- Progress tracking
- Loading states
- Success screens
- Zoho Campaign sync

### Design System
- Color-coded sections (Cyan/Blue for Hub, Orange/Red for Academy, Purple/Pink for Courses)
- Glass morphism effects
- Gradient text and buttons
- Responsive typography
- Mobile-first approach

## Deployment

Deploy on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Don't forget to add your environment variables in the Vercel dashboard.

## License

© 2025 Forge. All rights reserved.
