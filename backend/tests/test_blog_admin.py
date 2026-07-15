"""
Backend API Tests for Fidelis Logic Blog Admin Panel
Tests: Authentication, Blog CRUD, Contact Form
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "changeme"


class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_health_endpoint(self):
        """Test health check returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ Health check passed")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """Test successful admin login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
        print("✓ Admin login successful")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "wronguser",
            "password": "wrongpass"
        })
        assert response.status_code == 401
        print("✓ Invalid credentials rejected correctly")
    
    def test_login_wrong_password(self):
        """Test login with correct username but wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Wrong password rejected correctly")


class TestBlogCRUD:
    """Blog post CRUD operations tests"""
    
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
    
    def test_get_posts_public(self):
        """Test getting published posts (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/blog/posts")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Public posts endpoint works, found {len(data)} posts")
    
    def test_get_all_posts_authenticated(self, auth_headers):
        """Test getting all posts including drafts (authenticated)"""
        response = requests.get(
            f"{BASE_URL}/api/blog/posts?published_only=false",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Authenticated posts endpoint works, found {len(data)} posts")
    
    def test_create_blog_post(self, auth_headers):
        """Test creating a new blog post"""
        unique_id = str(uuid.uuid4())[:8]
        post_data = {
            "title": f"TEST_Post_{unique_id}",
            "slug": f"test-post-{unique_id}",
            "excerpt": "This is a test post excerpt",
            "content": "<p>This is the test post content with <strong>HTML</strong> formatting.</p>",
            "category": "Meeting Rooms",
            "author": "Test Author",
            "published": False,
            "tags": ["test", "automation"]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/blog/posts",
            json=post_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response data
        assert data["title"] == post_data["title"]
        assert data["slug"] == post_data["slug"]
        assert data["excerpt"] == post_data["excerpt"]
        assert data["content"] == post_data["content"]
        assert data["category"] == post_data["category"]
        assert data["published"] == False
        assert "id" in data
        
        print(f"✓ Blog post created successfully with ID: {data['id']}")
        return data["id"]
    
    def test_create_and_verify_post_persistence(self, auth_headers):
        """Test creating a post and verifying it persists in database"""
        unique_id = str(uuid.uuid4())[:8]
        post_data = {
            "title": f"TEST_Persistence_{unique_id}",
            "slug": f"test-persistence-{unique_id}",
            "excerpt": "Testing persistence",
            "content": "<p>Content for persistence test</p>",
            "category": "Industry Insights",
            "published": True
        }
        
        # Create post
        create_response = requests.post(
            f"{BASE_URL}/api/blog/posts",
            json=post_data,
            headers=auth_headers
        )
        assert create_response.status_code == 200
        created_post = create_response.json()
        post_id = created_post["id"]
        
        # Verify by fetching via slug
        get_response = requests.get(f"{BASE_URL}/api/blog/posts/{post_data['slug']}")
        assert get_response.status_code == 200
        fetched_post = get_response.json()
        
        assert fetched_post["title"] == post_data["title"]
        assert fetched_post["slug"] == post_data["slug"]
        assert fetched_post["published"] == True
        
        print(f"✓ Post persistence verified for ID: {post_id}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=auth_headers)
    
    def test_update_blog_post(self, auth_headers):
        """Test updating a blog post"""
        # First create a post
        unique_id = str(uuid.uuid4())[:8]
        post_data = {
            "title": f"TEST_Update_{unique_id}",
            "slug": f"test-update-{unique_id}",
            "excerpt": "Original excerpt",
            "content": "<p>Original content</p>",
            "category": "Meeting Rooms",
            "published": False
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/blog/posts",
            json=post_data,
            headers=auth_headers
        )
        assert create_response.status_code == 200
        post_id = create_response.json()["id"]
        
        # Update the post
        update_data = {
            "title": f"TEST_Updated_{unique_id}",
            "excerpt": "Updated excerpt",
            "published": True
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/blog/posts/{post_id}",
            json=update_data,
            headers=auth_headers
        )
        assert update_response.status_code == 200
        updated_post = update_response.json()
        
        assert updated_post["title"] == update_data["title"]
        assert updated_post["excerpt"] == update_data["excerpt"]
        assert updated_post["published"] == True
        
        print(f"✓ Blog post updated successfully: {post_id}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=auth_headers)
    
    def test_delete_blog_post(self, auth_headers):
        """Test deleting a blog post"""
        # First create a post
        unique_id = str(uuid.uuid4())[:8]
        post_data = {
            "title": f"TEST_Delete_{unique_id}",
            "slug": f"test-delete-{unique_id}",
            "excerpt": "To be deleted",
            "content": "<p>Delete me</p>",
            "category": "Meeting Rooms",
            "published": False
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/blog/posts",
            json=post_data,
            headers=auth_headers
        )
        assert create_response.status_code == 200
        post_id = create_response.json()["id"]
        
        # Delete the post
        delete_response = requests.delete(
            f"{BASE_URL}/api/blog/posts/{post_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        
        # Verify deletion - should return 404
        get_response = requests.get(f"{BASE_URL}/api/blog/posts/{post_data['slug']}")
        assert get_response.status_code == 404
        
        print(f"✓ Blog post deleted successfully: {post_id}")
    
    def test_duplicate_slug_rejected(self, auth_headers):
        """Test that duplicate slugs are rejected"""
        unique_id = str(uuid.uuid4())[:8]
        post_data = {
            "title": f"TEST_Duplicate_{unique_id}",
            "slug": f"test-duplicate-{unique_id}",
            "excerpt": "First post",
            "content": "<p>First</p>",
            "category": "Meeting Rooms",
            "published": False
        }
        
        # Create first post
        response1 = requests.post(
            f"{BASE_URL}/api/blog/posts",
            json=post_data,
            headers=auth_headers
        )
        assert response1.status_code == 200
        post_id = response1.json()["id"]
        
        # Try to create second post with same slug
        post_data["title"] = "Different title"
        response2 = requests.post(
            f"{BASE_URL}/api/blog/posts",
            json=post_data,
            headers=auth_headers
        )
        assert response2.status_code == 400
        
        print("✓ Duplicate slug correctly rejected")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=auth_headers)
    
    def test_unauthorized_create_rejected(self):
        """Test that creating post without auth is rejected"""
        post_data = {
            "title": "Unauthorized Post",
            "slug": "unauthorized-post",
            "excerpt": "Should fail",
            "content": "<p>Fail</p>",
            "category": "Meeting Rooms"
        }
        
        response = requests.post(f"{BASE_URL}/api/blog/posts", json=post_data)
        assert response.status_code in [401, 403]
        print("✓ Unauthorized create correctly rejected")


class TestContactForm:
    """Contact form endpoint tests"""
    
    def test_submit_contact_form(self):
        """Test submitting a contact form"""
        unique_id = str(uuid.uuid4())[:8]
        form_data = {
            "name": f"TEST_User_{unique_id}",
            "email": f"test_{unique_id}@example.com",
            "company": "Test Company",
            "phone": "555-1234",
            "topic": "General Inquiry",
            "message": "This is a test message from automated testing."
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=form_data)
        assert response.status_code == 200
        data = response.json()
        
        assert data["status"] == "success"
        assert "message" in data
        
        print("✓ Contact form submitted successfully")
    
    def test_contact_form_missing_fields(self):
        """Test contact form with missing required fields"""
        form_data = {
            "name": "Test User"
            # Missing email and other required fields
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=form_data)
        # Should return validation error
        assert response.status_code == 422
        print("✓ Missing fields correctly rejected")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_posts(self):
        """Clean up any TEST_ prefixed posts"""
        # Login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        if login_response.status_code != 200:
            pytest.skip("Could not authenticate for cleanup")
        
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get all posts
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
        else:
            print("✓ Cleanup completed (no posts to clean)")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
