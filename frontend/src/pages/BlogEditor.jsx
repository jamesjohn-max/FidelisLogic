import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { RichTextEditor } from "../components/RichTextEditor";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Eye,
  Loader2,
  Upload
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const categories = [
  "Meeting Rooms",
  "Workspace Technology",
  "Business Applications",
  "Industry Insights",
  "Case Studies",
  "Product Reviews"
];

export const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    author: "Fidelis Logic",
    featured_image: "",
    published: false,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    tags: []
  });

  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get(`${BACKEND_URL}/api/blog/posts?published_only=false`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const post = response.data.find(p => p.id === id);
      if (post) {
        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          category: post.category || "",
          author: post.author || "Fidelis Logic",
          featured_image: post.featured_image || "",
          published: post.published || false,
          seo_title: post.seo_title || "",
          seo_description: post.seo_description || "",
          seo_keywords: post.seo_keywords || "",
          tags: post.tags || []
        });
        setTagsInput((post.tags || []).join(", "));
      } else {
        toast.error("Post not found");
        navigate("/admin/blog");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
      if (error.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: isEditing ? formData.slug : generateSlug(title)
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Use JPG, PNG, GIF, or WebP.");
      return;
    }

    setIsUploading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await axios.post(
        `${BACKEND_URL}/api/blog/upload-image`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // Use functional update to avoid stale closure
      setFormData(prev => ({ ...prev, featured_image: response.data.url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMsg = error.response?.data?.detail || "Failed to upload image";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Please fill in all required fields (Title, Content, Category)");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const tags = tagsInput.split(",").map(t => t.trim()).filter(t => t);
      
      const postData = {
        ...formData,
        tags
      };

      if (isEditing) {
        await axios.put(
          `${BACKEND_URL}/api/blog/posts/${id}`,
          postData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Post updated successfully");
      } else {
        await axios.post(
          `${BACKEND_URL}/api/blog/posts`,
          postData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Post created successfully");
      }

      navigate("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Failed to save post");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/admin/blog")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Post" : "Create New Post"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isEditing && formData.slug && (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}
              >
                <Eye size={18} className="mr-2" />
                Preview
              </Button>
            )}
            <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : (
                <Save size={18} className="mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter post title"
                    className="mt-2 text-lg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="post-url-slug"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    /blog/{formData.slug || "your-post-slug"}
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt / Summary</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief summary of the post (appears in blog listings and search results)"
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardContent className="p-6">
                <Label className="mb-3 block">Content *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Start writing your blog post..."
                />
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  🔍 SEO Settings
                </h3>
                <p className="text-sm text-gray-500">Optimize your post for search engines and AI tools</p>
                
                <div>
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                    placeholder="SEO optimized title (defaults to post title)"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seo_title?.length || 0}/60 characters (recommended)
                  </p>
                </div>

                <div>
                  <Label htmlFor="seo_description">Meta Description</Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    placeholder="Meta description for search engines (defaults to excerpt)"
                    className="mt-2"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seo_description?.length || 0}/160 characters (recommended)
                  </p>
                </div>

                <div>
                  <Label htmlFor="seo_keywords">Keywords</Label>
                  <Input
                    id="seo_keywords"
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate keywords with commas
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Publish</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Published</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, published: checked })
                    }
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {formData.published 
                    ? "✅ Post is visible to the public" 
                    : "📝 Post is saved as draft"
                  }
                </p>
              </CardContent>
            </Card>

            {/* Category & Author */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Featured Image</h3>
                <p className="text-xs text-gray-500">Max 5MB • JPG, PNG, GIF, WebP</p>
                
                {formData.featured_image ? (
                  <div className="relative">
                    <img
                      src={formData.featured_image}
                      alt="Featured"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData({ ...formData, featured_image: "" })}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <Loader2 className="animate-spin mx-auto text-blue-600" size={32} />
                    ) : (
                      <>
                        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600">Click to upload image</p>
                      </>
                    )}
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div>
                  <Label htmlFor="image_url">Or enter image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    placeholder="https://..."
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};
