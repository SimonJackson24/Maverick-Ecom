# Revolut Payment Integration Guide
Last Updated: February 28, 2025

## 1. Prerequisites
- Revolut Business Account
- Completed business verification
- Access to Revolut Business Dashboard
- SSL certificate for your domain (for production)

## 2. Revolut Dashboard Setup

### 2.1 Create API Keys
1. Log in to [Revolut Business Dashboard](https://business.revolut.com/merchant)
2. Navigate to Developers → API keys
3. Generate API keys:
   - Test Environment: Generate test mode API keys
   - Production Environment: Generate live mode API keys
4. Save both public and secret keys securely

### 2.2 Configure Webhook
1. Go to Developers → Webhooks
2. Add a new webhook endpoint:
   - URL: `https://wickandwax.co/api/webhooks/revolut`
   - Events: Select all payment-related events
3. Save the webhook secret

### 2.3 Configure Payment Settings
1. Go to Settings → Payment Acceptance
2. Set up:
   - Supported currencies (GBP)
   - Payment methods
   - 3D Secure settings
   - Fraud prevention rules

## 3. Environment Configuration

### 3.1 Production Environment (.env.production)
```env
VITE_REVOLUT_API_KEY=sk_live_YOUR_REVOLUT_SECRET_KEY_HERE
VITE_REVOLUT_PUBLIC_KEY=pk_live_YOUR_REVOLUT_PUBLIC_KEY_HERE
VITE_REVOLUT_API_URL=https://merchant.revolut.com/api/1.0
VITE_REVOLUT_MERCHANT_ID=YOUR_MERCHANT_ID_HERE
VITE_REVOLUT_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE
VITE_REVOLUT_PAYMENT_RETURN_URL=https://wickandwax.co/checkout/complete
VITE_REVOLUT_PAYMENT_CANCEL_URL=https://wickandwax.co/checkout/cancel
```

### 3.2 Development Environment (.env.development)
```env
VITE_REVOLUT_API_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE
VITE_REVOLUT_PUBLIC_KEY=pk_test_YOUR_TEST_PUBLIC_KEY_HERE
VITE_REVOLUT_API_URL=https://sandbox-merchant.revolut.com/api/1.0
VITE_REVOLUT_MERCHANT_ID=YOUR_TEST_MERCHANT_ID_HERE
VITE_REVOLUT_WEBHOOK_SECRET=YOUR_TEST_WEBHOOK_SECRET_HERE
VITE_REVOLUT_PAYMENT_RETURN_URL=http://localhost:5173/checkout/complete
VITE_REVOLUT_PAYMENT_CANCEL_URL=http://localhost:5173/checkout/cancel
```

## 4. Testing the Integration

### 4.1 Test Cards
- Successful payment: 4929420573595709
- Failed payment: 4929420573595717
- 3DS required: 4929420573595725

### 4.2 Test Workflow
1. Create a test order
2. Initiate payment
3. Use test card numbers
4. Verify webhook reception
5. Check order status updates

## 5. Security Best Practices

### 5.1 API Key Security
- Never expose secret keys in frontend code
- Rotate keys periodically
- Use environment variables
- Implement key access logging

### 5.2 Webhook Security
- Validate webhook signatures
- Implement idempotency
- Use HTTPS only
- Monitor webhook failures

### 5.3 Payment Security
- Enable 3D Secure
- Set up fraud prevention rules
- Implement payment amount validation
- Add rate limiting

## 6. Monitoring and Logging

### 6.1 Payment Monitoring
- Monitor payment success rates
- Track failed payments
- Set up error alerts
- Monitor API response times

### 6.2 Logging
- Log all payment attempts
- Track webhook events
- Monitor authentication failures
- Implement audit logging

## 7. Troubleshooting

### 7.1 Common Issues
- Invalid API keys
- Webhook delivery failures
- 3DS authentication issues
- Payment validation errors

### 7.2 Support Resources
- Revolut API Documentation
- Revolut Merchant Support
- Integration Support Team
- Error Code Reference

## 8. Going Live Checklist

### 8.1 Pre-launch Verification
- [ ] Test all payment flows
- [ ] Verify webhook handling
- [ ] Check error handling
- [ ] Test refund process
- [ ] Validate security measures

### 8.2 Launch Steps
1. Switch to live API keys
2. Update webhook URLs
3. Verify SSL certificates
4. Test live payments
5. Monitor transactions

## 9. Maintenance

### 9.1 Regular Tasks
- Monitor payment success rates
- Check webhook health
- Review security logs
- Update API keys
- Test backup systems

### 9.2 Updates and Upgrades
- Keep dependencies updated
- Monitor Revolut API changes
- Update security measures
- Maintain documentation

## Support Contacts

- Revolut Business Support: https://business.revolut.com/help
- Technical Support: merchant.support@revolut.com
- Emergency Contact: +44 20 3322 8352
