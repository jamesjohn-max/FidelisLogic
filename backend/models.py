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


class FAQ(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    brand_slug: Optional[str] = None
    service_slug: Optional[str] = None
    question: str
    answer: str
    order: int = 0
    published: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class FAQCreate(BaseModel):
    brand_slug: Optional[str] = None
    service_slug: Optional[str] = None
    question: str
    answer: str
    order: Optional[int] = 0
    published: Optional[bool] = True


class FAQUpdate(BaseModel):
    brand_slug: Optional[str] = None
    service_slug: Optional[str] = None
    question: Optional[str] = None
    answer: Optional[str] = None
    order: Optional[int] = None
    published: Optional[bool] = None
