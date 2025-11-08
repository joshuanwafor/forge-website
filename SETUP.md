# Environment Setup

## Zoho Campaign Integration

To enable form submissions and Zoho Campaign integration, create a `.env.local` file in the root directory with the following variables:

```env
# Zoho Campaign API Configuration
# Get your auth token from: https://www.zoho.com/campaigns/help/api/auth-token.html

ZOHO_AUTH_TOKEN=your_zoho_auth_token_here
ZOHO_API_URL=https://campaigns.zoho.com/api/v1.1

# Zoho Campaign List Keys
# Get list keys from your Zoho Campaign dashboard
ZOHO_WAITLIST_KEY=your_waitlist_list_key_here
ZOHO_ACADEMY_LIST_KEY=your_academy_list_key_here
```

## How to Get Zoho Campaign Credentials

1. **Auth Token**: 
   - Go to https://www.zoho.com/campaigns/
   - Navigate to Settings > API
   - Generate your API auth token

2. **List Keys**:
   - Go to your Zoho Campaign dashboard
   - Navigate to Contacts > Mailing Lists
   - Click on your list and copy the list key from the URL or settings

## Testing Forms

- **Waitlist Form**: http://localhost:3000/waitlist
- **Application Form**: http://localhost:3000/apply

Forms will work without Zoho credentials but won't sync to your email list.

