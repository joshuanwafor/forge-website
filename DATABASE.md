# Database schema

Forge stores form submissions in Supabase (PostgreSQL). The full DDL is in
`lib/supabase-schema.sql`; this file is the human-readable reference.

All writes go through server-side API routes using the service-role key, so RLS grants `SELECT`
to authenticated users only and no anonymous `INSERT` policy exists.

## `waitlist`

People who want a desk when one frees up. Written by `POST /api/waitlist` from `/waitlist`.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | UUID | auto | Primary key |
| `full_name` | VARCHAR(255) | yes | |
| `email` | VARCHAR(255) | yes | Unique — a repeat sign-up returns success, not an error |
| `phone` | VARCHAR(50) | no | |
| `interest` | VARCHAR(100) | yes | Hot desk / Private office / Monthly membership / Meeting rooms / Community events only |
| `referral` | VARCHAR(100) | no | How they heard about us |
| `message` | TEXT | no | |
| `created_at` | TIMESTAMPTZ | auto | |

Index: `created_at DESC`.

## `tour_requests`

Visit bookings. Written by `POST /api/tour` from `/tour`.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | UUID | auto | Primary key |
| `full_name` | VARCHAR(255) | yes | |
| `email` | VARCHAR(255) | yes | Not unique — people book more than once |
| `phone` | VARCHAR(50) | no | |
| `team_size` | VARCHAR(20) | no | `1`, `2–4`, `5–8`, `9+` |
| `interest` | VARCHAR(100) | yes | What they came to look at |
| `preferred_date` | DATE | yes | Rejected server-side if in the past |
| `preferred_time` | VARCHAR(60) | yes | Morning / Afternoon / Evening slot |
| `message` | TEXT | no | |
| `status` | VARCHAR(20) | yes | `new` \| `confirmed` \| `completed` \| `cancelled` |
| `created_at` | TIMESTAMPTZ | auto | |

Indexes: `(preferred_date, status)` for the front-desk view, `created_at DESC` for the log.

### Front-desk query

```sql
select full_name, email, phone, team_size, interest, preferred_time, message
from tour_requests
where status = 'new' and preferred_date >= current_date
order by preferred_date, created_at;
```

## `newsletter_subscribers`

Blog and footer sign-ups. Written by `POST /api/subscribe`.

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | UUID | auto | Primary key |
| `email` | VARCHAR(255) | yes | Unique — re-subscribing is a no-op that returns success |
| `source` | VARCHAR(40) | yes | `footer`, `blog`, … — which form they used |
| `created_at` | TIMESTAMPTZ | auto | |

## Retired tables

`course_applications` backed the Academy/Courses application flow, which no longer exists. The
migration leaves the table alone because it still contains real applications and payment
references. Export it, then drop it by hand:

```sql
drop table course_applications;
```

## Migrations

`lib/migrations/` holds dated, additive SQL. Run them in filename order against an existing
database; `lib/supabase-schema.sql` is the current state for a fresh one.
