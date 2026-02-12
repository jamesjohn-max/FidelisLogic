from pathlib import Path
from dotenv import load_dotenv

# Load environment variables FIRST before any other imports that need them
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from typing import List, Optional
from datetime import datetime
import base64

from models import ContactForm, ContactFormCreate, NewsletterSubscription, NewsletterSubscriptionCreate
from blog_models import BlogPost, BlogPostCreate, BlogPostUpdate, User, Token, LoginRequest
from auth import verify_password, get_password_hash, create_access_token, decode_access_token
from email_service import email_service

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Authentication middleware
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    username = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return username


# Authentication endpoints
@api_router.post("/auth/login", response_model=Token)
async def login(login_data: LoginRequest):
    """Admin login"""
    user = await db.users.find_one({"username": login_data.username})
    if not user or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": login_data.username})
    return {"access_token": access_token, "token_type": "bearer"}


@api_router.post("/auth/create-admin")
async def create_admin(username: str, password: str):
    """Create admin user (use once to set up)"""
    # Check if any admin exists
    existing_user = await db.users.find_one({"username": username})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = get_password_hash(password)
    user = User(username=username, hashed_password=hashed_password)
    await db.users.insert_one(user.dict())
    
    return {"message": "Admin user created successfully"}


# Blog endpoints
@api_router.get("/blog/posts", response_model=List[BlogPost])
async def get_all_posts(published_only: bool = True):
    """Get all blog posts"""
    query = {"published": True} if published_only else {}
    posts = await db.blog_posts.find(query).sort("date", -1).to_list(100)
    return [BlogPost(**post) for post in posts]


@api_router.get("/blog/posts/{slug}", response_model=BlogPost)
async def get_post_by_slug(slug: str):
    """Get a single blog post by slug"""
    post = await db.blog_posts.find_one({"slug": slug})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Increment views
    await db.blog_posts.update_one(
        {"slug": slug},
        {"$inc": {"views": 1}}
    )
    
    return BlogPost(**post)


@api_router.post("/blog/posts", response_model=BlogPost)
async def create_post(post_data: BlogPostCreate, current_user: str = Depends(get_current_user)):
    """Create a new blog post (protected)"""
    # Check if slug already exists
    existing = await db.blog_posts.find_one({"slug": post_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="A post with this slug already exists")
    
    post = BlogPost(**post_data.dict())
    await db.blog_posts.insert_one(post.dict())
    logger.info(f"Blog post created: {post.title} by {current_user}")
    
    return post


@api_router.put("/blog/posts/{post_id}", response_model=BlogPost)
async def update_post(post_id: str, post_data: BlogPostUpdate, current_user: str = Depends(get_current_user)):
    """Update a blog post (protected)"""
    existing = await db.blog_posts.find_one({"id": post_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    update_data = {k: v for k, v in post_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    
    updated_post = await db.blog_posts.find_one({"id": post_id})
    logger.info(f"Blog post updated: {post_id} by {current_user}")
    
    return BlogPost(**updated_post)


@api_router.delete("/blog/posts/{post_id}")
async def delete_post(post_id: str, current_user: str = Depends(get_current_user)):
    """Delete a blog post (protected)"""
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    logger.info(f"Blog post deleted: {post_id} by {current_user}")
    return {"message": "Blog post deleted successfully"}


# Maximum file size: 5MB
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
MIME_TYPES = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
}

@api_router.post("/blog/upload-image")
async def upload_image(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    """Upload an image for blog post (max 5MB, jpg/png/gif/webp only)
    
    Returns a Base64 data URL for persistent storage in the database.
    This approach works in containerized/ephemeral environments where
    filesystem storage is not persistent.
    """
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size by reading content
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is 5MB. Your file: {file_size / (1024*1024):.2f}MB"
        )
    
    # Convert to Base64 data URL
    mime_type = MIME_TYPES.get(file_ext, 'image/jpeg')
    base64_data = base64.b64encode(contents).decode('utf-8')
    data_url = f"data:{mime_type};base64,{base64_data}"
    
    logger.info(f"Image uploaded by {current_user}: {file.filename} ({file_size / 1024:.1f}KB)")
    
    # Return Base64 data URL (works directly in <img src>)
    return {"url": data_url}


# Original endpoints
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
