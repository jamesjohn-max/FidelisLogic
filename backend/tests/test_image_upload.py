"""
Backend API Tests for Base64 Image Upload Feature
Tests: Image upload endpoint, Blog post creation with Base64 images
"""
import pytest
import requests
import os
import uuid
import base64
from io import BytesIO

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials - updated password
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "vojdov-cypcoJ-nekmy8"


class TestAuthentication:
    """Authentication tests with correct credentials"""
    
    def test_login_success(self):
        """Test successful admin login with correct password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        print("✓ Admin login successful with correct credentials")


class TestImageUpload:
    """Image upload endpoint tests - Base64 conversion"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Authentication failed")
    
    @pytest.fixture
    def auth_headers(self, auth_token):
        """Get headers with auth token"""
        return {"Authorization": f"Bearer {auth_token}"}
    
    def create_test_image(self, format='PNG', size=(100, 100), color=(255, 0, 0)):
        """Create a simple test image in memory"""
        # Create a simple PNG image manually (1x1 red pixel)
        # This is a minimal valid PNG file
        if format.upper() == 'PNG':
            # Minimal 1x1 red PNG
            png_data = bytes([
                0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,  # PNG signature
                0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,  # IHDR chunk
                0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,  # 1x1 dimensions
                0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,  # 8-bit RGB
                0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,  # IDAT chunk
                0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,  # compressed data
                0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x18, 0xDD,  
                0x8D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,  # IEND chunk
                0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
            ])
            return BytesIO(png_data), 'image/png', '.png'
        elif format.upper() == 'JPEG':
            # Minimal 1x1 red JPEG
            jpeg_data = bytes([
                0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
                0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
                0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
                0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
                0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C,
                0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
                0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D,
                0x1A, 0x1C, 0x1C, 0x20, 0x24, 0x2E, 0x27, 0x20,
                0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
                0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27,
                0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34,
                0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
                0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4,
                0x00, 0x1F, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
                0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
                0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0xFF,
                0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
                0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04,
                0x00, 0x00, 0x01, 0x7D, 0x01, 0x02, 0x03, 0x00,
                0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
                0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32,
                0x81, 0x91, 0xA1, 0x08, 0x23, 0x42, 0xB1, 0xC1,
                0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72,
                0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A,
                0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x34, 0x35,
                0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45,
                0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54, 0x55,
                0x56, 0x57, 0x58, 0x59, 0x5A, 0x63, 0x64, 0x65,
                0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75,
                0x76, 0x77, 0x78, 0x79, 0x7A, 0x83, 0x84, 0x85,
                0x86, 0x87, 0x88, 0x89, 0x8A, 0x92, 0x93, 0x94,
                0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3,
                0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2,
                0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8, 0xB9, 0xBA,
                0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9,
                0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8,
                0xD9, 0xDA, 0xE1, 0xE2, 0xE3, 0xE4, 0xE5, 0xE6,
                0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3, 0xF4,
                0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFF, 0xDA,
                0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00,
                0xFB, 0xD5, 0xDB, 0x20, 0xA8, 0xF1, 0x7F, 0xFF,
                0xD9
            ])
            return BytesIO(jpeg_data), 'image/jpeg', '.jpg'
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    def test_upload_png_image(self, auth_headers):
        """Test uploading a PNG image returns Base64 data URL"""
        img_buffer, mime_type, ext = self.create_test_image('PNG')
        
        files = {'file': (f'test_image{ext}', img_buffer, mime_type)}
        
        response = requests.post(
            f"{BASE_URL}/api/blog/upload-image",
            files=files,
            headers=auth_headers
        )
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        data = response.json()
        
        # Verify response contains URL
        assert "url" in data, "Response should contain 'url' field"
        
        # Verify it's a Base64 data URL
        url = data["url"]
        assert url.startswith("data:image/"), f"URL should be a data URL, got: {url[:50]}..."
        assert ";base64," in url, "URL should contain base64 encoding marker"
        
        # Verify the MIME type is correct
        assert "data:image/png" in url, f"Expected PNG MIME type, got: {url[:30]}"
        
        print(f"✓ PNG image uploaded successfully, returned Base64 data URL ({len(url)} chars)")
    
    def test_upload_jpeg_image(self, auth_headers):
        """Test uploading a JPEG image returns Base64 data URL"""
        img_buffer, mime_type, ext = self.create_test_image('JPEG')
        
        files = {'file': (f'test_image{ext}', img_buffer, mime_type)}
        
        response = requests.post(
            f"{BASE_URL}/api/blog/upload-image",
            files=files,
            headers=auth_headers
        )
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        data = response.json()
        
        # Verify response contains URL
        assert "url" in data
        
        # Verify it's a Base64 data URL
        url = data["url"]
        assert url.startswith("data:image/"), f"URL should be a data URL"
        assert ";base64," in url
        
        print(f"✓ JPEG image uploaded successfully, returned Base64 data URL ({len(url)} chars)")
    
    def test_upload_invalid_file_type(self, auth_headers):
        """Test uploading invalid file type is rejected"""
        # Create a fake text file
        fake_file = BytesIO(b"This is not an image")
        
        files = {'file': ('test.txt', fake_file, 'text/plain')}
        
        response = requests.post(
            f"{BASE_URL}/api/blog/upload-image",
            files=files,
            headers=auth_headers
        )
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print("✓ Invalid file type correctly rejected")
    
    def test_upload_without_auth(self):
        """Test uploading without authentication is rejected"""
        img_buffer, mime_type, ext = self.create_test_image('PNG')
        
        files = {'file': (f'test_image{ext}', img_buffer, mime_type)}
        
        response = requests.post(
            f"{BASE_URL}/api/blog/upload-image",
            files=files
        )
        
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✓ Unauthenticated upload correctly rejected")


class TestBlogPostWithBase64Image:
    """Test creating and retrieving blog posts with Base64 images"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Authentication failed")
    
    @pytest.fixture
    def auth_headers(self, auth_token):
        """Get headers with auth token"""
        return {"Authorization": f"Bearer {auth_token}"}
    
    def test_create_post_with_base64_image(self, auth_headers):
        """Test creating a blog post with Base64 featured image"""
        unique_id = str(uuid.uuid4())[:8]
        
        # First upload an image
        # Create minimal PNG
        png_data = bytes([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
            0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
            0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
            0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x18, 0xDD,
            0x8D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
            0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ])
        
        files = {'file': ('test.png', BytesIO(png_data), 'image/png')}
        upload_response = requests.post(
            f"{BASE_URL}/api/blog/upload-image",
            files=files,
            headers=auth_headers
        )
        
        assert upload_response.status_code == 200, f"Image upload failed: {upload_response.text}"
        base64_url = upload_response.json()["url"]
        
        # Create blog post with the Base64 image
        post_data = {
            "title": f"TEST_Base64Image_{unique_id}",
            "slug": f"test-base64-image-{unique_id}",
            "excerpt": "Testing Base64 image storage",
            "content": "<p>This post has a Base64 featured image</p>",
            "category": "Meeting Rooms",
            "author": "Test Author",
            "featured_image": base64_url,
            "published": True,
            "tags": ["test", "base64", "image"]
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/blog/posts",
            json=post_data,
            headers=auth_headers
        )
        
        assert create_response.status_code == 200, f"Post creation failed: {create_response.text}"
        created_post = create_response.json()
        
        # Verify the Base64 image is stored
        assert created_post["featured_image"] == base64_url
        assert created_post["featured_image"].startswith("data:image/")
        
        post_id = created_post["id"]
        post_slug = created_post["slug"]
        
        print(f"✓ Blog post created with Base64 image, ID: {post_id}")
        
        # Verify retrieval via slug
        get_response = requests.get(f"{BASE_URL}/api/blog/posts/{post_slug}")
        assert get_response.status_code == 200
        fetched_post = get_response.json()
        
        # Verify Base64 image persists
        assert fetched_post["featured_image"] == base64_url
        assert fetched_post["featured_image"].startswith("data:image/")
        
        print(f"✓ Base64 image persisted and retrieved correctly")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=auth_headers)
        print(f"✓ Test post cleaned up")
    
    def test_get_posts_with_base64_images(self, auth_headers):
        """Test that blog listing returns posts with Base64 images correctly"""
        response = requests.get(f"{BASE_URL}/api/blog/posts")
        assert response.status_code == 200
        
        posts = response.json()
        
        # Check if any posts have Base64 images
        base64_posts = [p for p in posts if p.get("featured_image", "").startswith("data:image/")]
        
        print(f"✓ Blog posts retrieved: {len(posts)} total, {len(base64_posts)} with Base64 images")
        
        # Verify Base64 images are valid format
        for post in base64_posts:
            img = post["featured_image"]
            assert ";base64," in img, f"Invalid Base64 format in post: {post['title']}"
        
        print("✓ All Base64 images have valid format")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_posts(self):
        """Clean up any TEST_ prefixed posts"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        if login_response.status_code != 200:
            pytest.skip("Could not authenticate for cleanup")
        
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        posts_response = requests.get(
            f"{BASE_URL}/api/blog/posts?published_only=false",
            headers=headers
        )
        
        if posts_response.status_code == 200:
            posts = posts_response.json()
            deleted_count = 0
            for post in posts:
                if post["title"].startswith("TEST_"):
                    requests.delete(
                        f"{BASE_URL}/api/blog/posts/{post['id']}",
                        headers=headers
                    )
                    deleted_count += 1
            print(f"✓ Cleaned up {deleted_count} test posts")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
