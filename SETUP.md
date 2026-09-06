# Environment setup

Copy `.env.example` to `.env.local` and fill in the values below.

## Supabase (required for forms)

Without Supabase the site still builds and runs — the form endpoints return a 503 with a
readable message rather than failing.

### 1. Create the project

1. Sign up at [supabase.com](https://supabase.com) and create a project.
2. Wait for the database to finish provisioning (~2 minutes).

### 2. Create the tables

**New project:** open **SQL Editor**, paste the whole of `lib/supabase-schema.sql`, and run it.
That creates `waitlist`, `tour_requests` and `newsletter_subscribers`, their indexes, and RLS
policies.

**Existing project** that already had the old course tables: run
`lib/migrations/2026-09-remove-courses.sql` instead. It only adds — the old
`course_applications` table is deliberately left in place so you can export it first.

### 3. Copy the credentials

**Project Settings → API**:

| Value | Environment variable |
| --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | `SUPABASE_SERVICE_ROLE_KEY` |

The service-role key bypasses Row Level Security. It is used only in the server-side API routes
and must never reach the browser or a public repository.

### How writes work

Every insert happens in an API route using the service-role key, so no anonymous `INSERT`
policy is needed. The RLS policies in the schema grant `SELECT` to authenticated users only, so
your team can read submissions from the Supabase dashboard while the public cannot.

## Zoho Campaigns (optional)

When these are set, new sign-ups are also pushed to a Zoho mailing list. When they are unset the
sync is skipped silently — and if Zoho fails, the visitor's submission still succeeds.

1. **Auth token** — Zoho Campaigns → Settings → API → generate a token.
2. **List keys** — Contacts → Mailing Lists. Create the lists you want, then copy each list key.

| Variable | List |
| --- | --- |
| `ZOHO_AUTH_TOKEN` | — |
| `ZOHO_API_URL` | Defaults to `https://campaigns.zoho.com/api/v1.1` |
| `ZOHO_WAITLIST_KEY` | Waitlist sign-ups |
| `ZOHO_TOUR_LIST_KEY` | Tour requests |
| `ZOHO_NEWSLETTER_KEY` | Newsletter subscribers |

## Site URL

`NEXT_PUBLIC_SITE_URL` must be the canonical origin (no trailing slash). It is used for
canonical tags, `sitemap.xml`, the RSS feed and social card URLs. Getting this wrong mostly
shows up as bad links in search results and feed readers.

## Deployment

Add the same variables in your host's project settings. Do not commit real values to
`.env.production` — anything in the repository is readable by anyone who can clone it.
