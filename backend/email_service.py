import requests
import os
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.access_key = os.environ.get('WEB3FORMS_ACCESS_KEY')
        self.api_url = "https://api.web3forms.com/submit"
        self.to_email = "info@fidelislogic.com"
        
    def send_email(self, subject: str, message: str, from_name: str = None, from_email: str = None) -> bool:
        """Send email via Web3Forms"""
        if not self.access_key:
            logger.warning("WEB3FORMS_ACCESS_KEY not set. Email not sent (development mode).")
            logger.info(f"Would send email: {subject}")
            logger.info(f"Message: {message}")
            return True  # Return True in dev mode for testing
            
        try:
            data = {
                "access_key": self.access_key,
                "subject": subject,
                "email": self.to_email,
                "message": message,
            }
            
            # Add optional from fields if provided
            if from_name:
                data["name"] = from_name
            if from_email:
                data["from_email"] = from_email
            
            response = requests.post(self.api_url, json=data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    logger.info(f"Email sent successfully via Web3Forms: {subject}")
                    return True
                else:
                    logger.error(f"Web3Forms error: {result.get('message')}")
                    return False
            else:
                logger.error(f"Web3Forms request failed with status: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to send email via Web3Forms: {str(e)}")
            return False
    
    def send_consultation_request(self, name: str, company: str, email: str, 
                                  phone: str, topic: str, preferred_date: str, 
                                  message: str) -> bool:
        """Send consultation request notification"""
        subject = f"New Consultation Request from {name}"
        
        # Build message content
        email_content = f"""
New Consultation Request Received

Contact Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: {name}
{f'Company: {company}' if company else ''}
Email: {email}
{f'Phone: {phone}' if phone else ''}
Topic: {topic}
{f'Preferred Date/Time: {preferred_date}' if preferred_date else ''}

Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This email was sent from the Fidelis Logic website contact form.
Reply to: {email}
        """
        
        return self.send_email(
            subject=subject,
            message=email_content.strip(),
            from_name=name,
            from_email=email
        )
    
    def send_newsletter_subscription(self, email: str) -> bool:
        """Send newsletter subscription notification"""
        subject = f"New Newsletter Subscription: {email}"
        
        message_content = f"""
New Newsletter Subscription

Email: {email}

Add this email to your newsletter distribution list.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This subscription was submitted through the Fidelis Logic website.
        """
        
        return self.send_email(
            subject=subject,
            message=message_content.strip(),
            from_email=email
        )

email_service = EmailService()
