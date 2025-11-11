# Database Schema Documentation

## Overview

Forge uses Supabase (PostgreSQL) to store all form submissions. This provides a reliable, scalable database with built-in authentication and Row Level Security (RLS).

## Tables

### `waitlist`

Stores waitlist signups from `/waitlist` page.

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | Auto | Primary key |
| full_name | VARCHAR(255) | Yes | Full name of applicant |
| email | VARCHAR(255) | Yes | Email address (unique) |
| phone | VARCHAR(50) | No | Phone number |
| interest | VARCHAR(100) | Yes | What they're interested in (hub/academy/courses/all) |
| referral | VARCHAR(100) | No | How they heard about us |
| message | TEXT | No | Additional message |
| created_at | TIMESTAMP | Auto | Signup timestamp |

**Indexes:**
- `email` - For fast lookups and preventing duplicates
- `created_at DESC` - For sorting by newest first

### `course_applications`

Stores course applications from `/apply` page.

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | Auto | Primary key |
| full_name | VARCHAR(255) | Yes | Full name of applicant |
| location | VARCHAR(255) | Yes | City, State/Country |
| gender | VARCHAR(50) | Yes | Gender |
| phone | VARCHAR(50) | Yes | Phone number |
| email | VARCHAR(255) | Yes | Email address |
| course_of_interest | VARCHAR(100) | Yes | web-development/mobile-development/backend-development/design |
| why_interested | TEXT | Yes | Reason for applying |
| availability | VARCHAR(100) | Yes | weekdays/weekends/evenings/flexible |
| payment_reference | VARCHAR(255) | Yes | Paystack payment reference |
| payment_status | VARCHAR(50) | Yes | Payment status (success) |
| amount_paid | DECIMAL(10,2) | Yes | Amount paid in Naira |
| created_at | TIMESTAMP | Auto | Application timestamp |

**Indexes:**
- `email` - For fast email lookups
- `created_at DESC` - For sorting by newest
- `course_of_interest` - For filtering by course
- `payment_reference` - For payment verification and lookup

## Security

### Row Level Security (RLS)

Both tables have RLS enabled:

- **Insert**: Anyone can insert (for public forms)
- **Read**: Only authenticated users (admin dashboard)
- **Update/Delete**: Not allowed via policies

This means:
- ✅ Public forms can submit data
- ✅ Only admins can view submissions
- ✅ Data cannot be modified/deleted via API

## Analytics Views

### `waitlist_stats`

Groups waitlist signups by interest and date.

```sql
SELECT interest, COUNT(*) as count, signup_date
FROM waitlist
GROUP BY interest, DATE_TRUNC('day', created_at)
```

### `application_stats`

Groups applications by course and date.

```sql
SELECT course_of_interest, COUNT(*) as count, application_date
FROM course_applications
GROUP BY course_of_interest, DATE_TRUNC('day', created_at)
```

## Querying Data

### Using Supabase Dashboard

1. Go to **Table Editor** to view data
2. Use **SQL Editor** for custom queries
3. Export data as CSV from Table Editor

### Example Queries

**Get all waitlist signups from last 7 days:**
```sql
SELECT * FROM waitlist
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

**Count applications by course:**
```sql
SELECT course_of_interest, COUNT(*) as total
FROM course_applications
GROUP BY course_of_interest
ORDER BY total DESC;
```

**Get recent applications:**
```sql
SELECT full_name, email, course_of_interest, created_at
FROM course_applications
ORDER BY created_at DESC
LIMIT 50;
```

## Backup & Export

### Manual Export
1. Go to Table Editor in Supabase
2. Select table
3. Click "Export" → "CSV"

### Automated Backups
Supabase provides automated daily backups on paid plans.

## Future Enhancements

Consider adding:
- [ ] Status tracking (pending/approved/rejected)
- [ ] Admin notes field
- [ ] Email verification status
- [ ] Last contact date
- [ ] Payment status (for courses)
- [ ] Student dashboard integration

