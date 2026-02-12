import base64
from datetime import datetime
from fastapi import UploadFile, HTTPException
from pathlib import Path

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
ALLOWED_MIME_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png', 
    'image/gif': '.gif',
    'image/webp': '.webp'
}

async def process_image_upload(file: UploadFile, db) -> str:
    """
    Process uploaded image and store in MongoDB.
    Returns the URL to access the image.
    """
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower() if file.filename else ''
    content_type = file.content_type or ''
    
    if file_ext not in ALLOWED_EXTENSIONS and content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file content
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is 5MB. Your file: {file_size / (1024*1024):.2f}MB"
        )
    
    # Create unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    safe_filename = "".join(c for c in file.filename if c.isalnum() or c in '._-')
    image_id = f"{timestamp}_{safe_filename}"
    
    # Convert to base64
    base64_data = base64.b64encode(contents).decode('utf-8')
    
    # Determine mime type
    mime_type = content_type if content_type in ALLOWED_MIME_TYPES else 'image/jpeg'
    
    # Store in MongoDB
    image_doc = {
        "image_id": image_id,
        "filename": file.filename,
        "mime_type": mime_type,
        "data": base64_data,
        "size": file_size,
        "created_at": datetime.utcnow()
    }
    
    await db.blog_images.insert_one(image_doc)
    
    # Return API URL to fetch the image
    return f"/api/blog/images/{image_id}"


async def get_image_from_db(image_id: str, db):
    """Retrieve image from MongoDB by ID"""
    image_doc = await db.blog_images.find_one({"image_id": image_id})
    if not image_doc:
        return None
    return image_doc
