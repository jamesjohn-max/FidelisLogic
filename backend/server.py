from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List

from models import ContactForm, ContactFormCreate, NewsletterSubscription, NewsletterSubscriptionCreate
from email_service import email_service

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Fidelis Logic API"}


@api_router.post("/contact", response_model=dict)
async def submit_contact_form(form_data: ContactFormCreate, background_tasks: BackgroundTasks):
    """Handle contact form submission"""
    try:
        # Create contact form object
        contact = ContactForm(**form_data.dict())
        
        # Save to database
        await db.contacts.insert_one(contact.dict())
        
        # Send email notification in background
        background_tasks.add_task(
            email_service.send_consultation_request,
            contact.name,
            contact.company,
            contact.email,
            contact.phone,
            contact.topic,
            contact.preferred_date,
            contact.message
        )
        
        logger.info(f"Contact form submitted by {contact.email}")
        
        return {
            "status": "success",
            "message": "Thank you for your inquiry. We'll contact you within 24 hours."
        }
        
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process your request. Please try again.")


@api_router.post("/newsletter", response_model=dict)
async def subscribe_newsletter(subscription: NewsletterSubscriptionCreate, background_tasks: BackgroundTasks):
    """Handle newsletter subscription"""
    try:
        # Check if email already exists
        existing = await db.newsletters.find_one({"email": subscription.email})
        if existing:
            return {
                "status": "info",
                "message": "You're already subscribed to our newsletter!"
            }
        
        # Create subscription object
        newsletter_sub = NewsletterSubscription(**subscription.dict())
        
        # Save to database
        await db.newsletters.insert_one(newsletter_sub.dict())
        
        # Send notification in background
        background_tasks.add_task(
            email_service.send_newsletter_subscription,
            newsletter_sub.email
        )
        
        logger.info(f"Newsletter subscription: {newsletter_sub.email}")
        
        return {
            "status": "success",
            "message": "Successfully subscribed to our newsletter!"
        }
        
    except Exception as e:
        logger.error(f"Error processing newsletter subscription: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to subscribe. Please try again.")


@api_router.get("/contacts", response_model=List[ContactForm])
async def get_contacts():
    """Get all contact form submissions (admin endpoint)"""
    contacts = await db.contacts.find().sort("created_at", -1).to_list(100)
    return [ContactForm(**contact) for contact in contacts]


@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "fidelis-logic-api"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
