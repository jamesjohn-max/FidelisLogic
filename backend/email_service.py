from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.api_key = os.environ.get('SENDGRID_API_KEY')
        self.from_email = "noreply@fidelislogic.com"
        self.to_email = "info@fidelislogic.com"
        
    def send_email(self, subject: str, html_content: str, to_email: Optional[str] = None) -> bool:
        """Send email via SendGrid"""
        if not self.api_key:
            logger.warning("SENDGRID_API_KEY not set. Email not sent (development mode).")
            logger.info(f"Would send email: {subject} to {to_email or self.to_email}")
            return True  # Return True in dev mode for testing
            
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=to_email or self.to_email,
                subject=subject,
                html_content=html_content
            )
            
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            
            if response.status_code in [200, 202]:
                logger.info(f"Email sent successfully: {subject}")
                return True
            else:
                logger.error(f"Email send failed with status: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False
    
    def send_consultation_request(self, name: str, company: Optional[str], email: str, 
                                  phone: Optional[str], topic: str, preferred_date: Optional[str], 
                                  message: str) -> bool:
        """Send consultation request notification"""
        subject = f"New Consultation Request from {name}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #22D3EE 0%, #2563EB 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0;">New Consultation Request</h1>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
                        <h2 style="color: #2563EB; margin-top: 0;">Contact Details</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">{name}</td>
                            </tr>
                            {f'<tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Company:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">{company}</td></tr>' if company else ''}
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:{email}" style="color: #2563EB;">{email}</a></td>
                            </tr>
                            {f'<tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">{phone}</td></tr>' if phone else ''}
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Topic:</strong></td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">{topic}</td>
                            </tr>
                            {f'<tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Preferred Date/Time:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">{preferred_date}</td></tr>' if preferred_date else ''}
                        </table>
                        
                        <h3 style="color: #2563EB; margin-top: 30px;">Message</h3>
                        <p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #22D3EE;">
                            {message}
                        </p>
                        
                        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                            This email was sent from the Fidelis Logic website contact form.
                        </p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        return self.send_email(subject, html_content)
    
    def send_newsletter_subscription(self, email: str) -> bool:
        """Send newsletter subscription notification"""
        subject = f"New Newsletter Subscription: {email}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #22D3EE 0%, #2563EB 100%); padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">New Newsletter Subscription</h2>
                    </div>
                    <div style="background: #f9fafb; padding: 20px;">
                        <p><strong>Email:</strong> {email}</p>
                        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                            Add this email to your newsletter distribution list.
                        </p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        return self.send_email(subject, html_content)

email_service = EmailService()
