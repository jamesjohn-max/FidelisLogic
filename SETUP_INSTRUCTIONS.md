# Fidelis Logic Website - Setup Instructions

## SendGrid Email Configuration

To enable email notifications for contact form and newsletter subscriptions:

### 1. Get SendGrid API Key

1. Visit [SendGrid](https://sendgrid.com) and create a free account
2. Navigate to **Settings → API Keys**
3. Click **Create API Key**
4. Name it "Fidelis Logic Production"
5. Select **Full Access** permissions
6. Copy the generated API key (you'll only see it once!)

### 2. Add API Key to Backend

Edit `/app/backend/.env` and add:

```bash
SENDGRID_API_KEY=your_api_key_here
```

### 3. Verify Sender Email

In SendGrid dashboard:
1. Go to **Settings → Sender Authentication**
2. Add and verify **info@fidelislogic.com** as a sender
3. Complete domain authentication for better deliverability

### 4. Restart Backend

```bash
sudo supervisorctl restart backend
```

### 5. Test Email Functionality

1. Visit the contact page at `http://localhost:3000/contact`
2. Fill out and submit the form
3. Check that email arrives at info@fidelislogic.com
4. Check backend logs: `tail -f /var/log/supervisor/backend.out.log`

## Without SendGrid API Key

The website will work without the API key:
- Forms will save to MongoDB
- Email sending will be logged but not sent
- No errors will be shown to users

This allows development/testing without email service.

## Email Templates

Email notifications are sent for:
- **Contact Form Submissions** → Sends to info@fidelislogic.com
- **Newsletter Subscriptions** → Sends to info@fidelislogic.com

Templates are in `/app/backend/email_service.py` with Fidelis Logic branding.

## SendGrid Free Tier Limits

- 100 emails/day
- 3,000 emails/month
- Perfect for contact forms and newsletters

If you exceed limits, consider upgrading or using rate limiting.
