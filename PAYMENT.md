# Payment Integration Guide

## Paystack Integration

Forge uses [Paystack](https://paystack.com) for processing course payments. The payment flow is integrated using [react-paystack](https://github.com/iamraphson/react-paystack).

## How It Works

### Course Application Payment Flow

1. **User fills out application form** (8 required fields)
2. **Clicks "Proceed to Payment"** button
3. **Paystack modal opens** with course price
4. **User completes payment** using card/bank transfer
5. **Payment verified** by Paystack
6. **Application saved to database** (only after successful payment)
7. **Confirmation email sent** (optional)
8. **Success screen shown**

## Application Fee

**All courses require a ₦5,000 application fee.**

After payment:
1. ✅ Application saved to database
2. 📧 Confirmation email sent
3. 📞 Team contacts you within 24 hours
4. 💰 Full course pricing and details shared
5. 🎓 Enrollment process begins

## Full Course Prices (Shared After Application)

| Course | Duration | Estimated Price |
|--------|----------|-----------------|
| Web Development | 12 weeks | ₦150,000 |
| Mobile Development | 14 weeks | ₦180,000 |
| Backend Development | 16 weeks | ₦200,000 |
| Design (UI/UX) | 10 weeks | ₦120,000 |

**Note:** Application fee is separate from course fee.

## Environment Setup

### Required Environment Variables

```env
# Paystack Public Key (client-side)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx

# Paystack Secret Key (server-side verification)
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
```

### Getting Your Keys

1. **Sign up** at [paystack.com](https://paystack.com)
2. **Verify your business** (required for live mode)
3. Go to **Settings** → **API Keys & Webhooks**
4. Copy **Public Key** and **Secret Key**

**Note:** Use test keys (pk_test_/sk_test_) for development!

## Testing Payments

### Paystack Test Cards

Use these test cards in development mode:

**Successful Payment:**
- **Card Number:** 4084 0840 8408 4081
- **CVV:** 408
- **Expiry:** Any future date
- **PIN:** 0000

**Failed Payment:**
- **Card Number:** 5060 6666 6666 6666 4444
- **CVV:** Any 3 digits
- **Expiry:** Any future date

**More test cards:** [Paystack Test Cards](https://paystack.com/docs/payments/test-payments)

## Payment Data Stored

When a payment succeeds, we store:

- `payment_reference` - Unique Paystack reference (e.g., "T123456789")
- `payment_status` - "success"
- `amount_paid` - Amount in Naira (e.g., 150000.00)
- All student information
- Timestamp

## Security Features

### Payment Verification

- ✅ Client receives payment reference from Paystack
- ✅ Reference sent to server with application data
- ✅ Server validates payment status before saving
- ✅ Database only stores successful payments

### Data Protection

- ✅ No card details stored on our servers
- ✅ Paystack handles all sensitive payment data
- ✅ PCI DSS compliant payment processing
- ✅ Row Level Security on database

## Webhook Integration (Future)

For production, you should set up Paystack webhooks to verify payments server-side:

1. Go to Paystack Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/paystack`
3. Subscribe to `charge.success` event
4. Verify payment signature using secret key

This provides additional security by validating payments directly with Paystack's servers.

## Refund Policy

Students who paid can request refunds within 7 days if:
- Course hasn't started
- No materials have been accessed

Process refunds via Paystack Dashboard:
1. Go to **Transactions**
2. Find the transaction
3. Click **Refund**
4. Choose full or partial refund

## Production Checklist

Before going live:

- [ ] Switch to live Paystack keys (pk_live_/sk_live_)
- [ ] Verify business with Paystack
- [ ] Set up webhook for payment verification
- [ ] Test full payment flow on staging
- [ ] Add refund policy to terms
- [ ] Set up payment failure notifications
- [ ] Configure receipt emails

## Troubleshooting

### Payment modal not opening?
- Check if `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is set
- Verify key starts with `pk_test_` or `pk_live_`
- Check browser console for errors

### Payment successful but application not saved?
- Check server logs for errors
- Verify Supabase connection
- Check payment reference is being sent
- Look for validation errors

### Using test mode in production?
- Never use test keys (pk_test_) in production!
- Always use live keys (pk_live_) for real payments
- Test thoroughly before switching to live mode

## Support

For payment issues:
- **Paystack Support:** https://paystack.com/contact
- **Documentation:** https://paystack.com/docs

For application issues:
- Contact: support@forge.ng

