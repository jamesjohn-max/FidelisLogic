from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

class ContactForm(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    topic: str
    preferred_date: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class NewsletterSubscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "active"

class ContactFormCreate(BaseModel):
    name: str
    company: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    topic: str
    preferred_date: Optional[str] = None
    message: str

class NewsletterSubscriptionCreate(BaseModel):
    email: EmailStr
