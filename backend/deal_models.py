from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class Deal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str  # Rich HTML content
    brand: str
    featured_image: Optional[str] = None
    deal_url: Optional[str] = None  # External link to the deal
    
    # Deal dates
    start_date: datetime
    end_date: datetime
    
    # Status
    published: bool = False
    
    # SEO Fields
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    
    # Metadata
    views: int = 0
    tags: List[str] = []
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class DealCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    brand: str
    featured_image: Optional[str] = None
    deal_url: Optional[str] = None
    start_date: datetime
    end_date: datetime
    published: bool = False
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    tags: List[str] = []

class DealUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    brand: Optional[str] = None
    featured_image: Optional[str] = None
    deal_url: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    published: Optional[bool] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    tags: Optional[List[str]] = None
