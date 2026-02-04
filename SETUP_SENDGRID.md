# SendGrid Setup Guide for Fidelis Logic

## Quick Setup Steps

### 1. Create SendGrid Account
- Go to https://signup.sendgrid.com/
- Sign up with your business email (info@fidelislogic.com recommended)
- Verify your email address

### 2. Get Your API Key
- Log in to SendGrid dashboard
- Navigate to: **Settings → API Keys**
- Click **Create API Key**
- Name it: "Fidelis Logic Production"
- Select **Full Access** (or minimum: Mail Send)
- Click **Create & View**
- **IMPORTANT:** Copy the API key immediately (shown only once)

### 3. Configure Backend
Add your SendGrid API key to backend environment:

```bash
# Edit /app/backend/.env
SENDGRID_API_KEY=SG.your_actual_api_key_here
```

Restart backend:
```bash
sudo supervisorctl restart backend
```

### 4. Verify Domain (Recommended for Production)
To avoid emails going to spam:
- In SendGrid: **Settings → Sender Authentication → Authenticate Your Domain**
- Follow instructions to add DNS records (SPF, DKIM)
- This improves email deliverability significantly

### 5. Test Email Sending
Submit a test form on your contact page or use curl:
```bash
curl -X POST http://localhost:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "topic": "General Inquiry",
    "message": "Testing email notifications"
  }'
```

Check SendGrid dashboard → Activity to see email delivery status.

## Current Status

✅ Backend configured to send emails via SendGrid
✅ Email service handles:
   - Contact form submissions → info@fidelislogic.com
   - Newsletter subscriptions → info@fidelislogic.com
   - Professional HTML email templates with Fidelis Logic branding

⚠️ **ACTION REQUIRED:** Add your SendGrid API key to /app/backend/.env

## SendGrid Free Tier Limits
- **100 emails/day** (3,000/month)
- Perfect for consultation requests and contact forms
- Upgrade available if you need more volume

## Email Templates Included
All emails use Fidelis Logic branded templates with:
- Cyan to blue gradient header
- Professional formatting
- Contact details in structured tables
- Mobile-responsive design

## Troubleshooting

**Emails not sending?**
1. Check SENDGRID_API_KEY is set in /app/backend/.env
2. Restart backend: `sudo supervisorctl restart backend`
3. Check logs: `tail -f /var/log/supervisor/backend.out.log`
4. Verify API key has Mail Send permission

**Emails going to spam?**
1. Complete domain authentication in SendGrid
2. Use verified sender email
3. Ask recipients to whitelist info@fidelislogic.com

## Support
- SendGrid docs: https://docs.sendgrid.com/
- API key management: https://app.sendgrid.com/settings/api_keys
