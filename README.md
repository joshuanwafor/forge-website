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

## Zoho Campaign Integration

Forms automatically sync to Zoho Campaign when configured. See `SETUP.md` for detailed instructions.

### Quick Setup

1. Create `.env.local` in the root directory:

```env
ZOHO_AUTH_TOKEN=your_zoho_auth_token
ZOHO_API_URL=https://campaigns.zoho.com/api/v1.1
ZOHO_WAITLIST_KEY=your_waitlist_list_key
ZOHO_ACADEMY_LIST_KEY=your_academy_list_key
```

2. Get credentials from [Zoho Campaign API Settings](https://www.zoho.com/campaigns/help/api/auth-token.html)

## Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript
- **Font**: Inter (Google Fonts)
- **Animations**: CSS Keyframes + Tailwind utilities
- **API Integration**: Zoho Campaign

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
