import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { RichTextEditor } from "../components/RichTextEditor";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  Tag, 
  Link as LinkIcon,
  Calendar,
  Loader2,
  ExternalLink,
  Image as ImageIcon
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const DealEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    brand: "",
    featured_image: "",
    deal_url: "",
    start_date: "",
    end_date: "",
    published: false,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    tags: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (isEditing) {
      fetchDeal();
    }
  }, [id, navigate, isEditing]);

  const fetchDeal = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/deals?published_only=false`);
      const deal = response.data.find(d => d.id === id);
      if (deal) {
        // Format dates for input fields
        const formatDateForInput = (dateStr) => {
          if (!dateStr) return "";
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0];
        };

        setFormData({
          title: deal.title || "",
          slug: deal.slug || "",
          excerpt: deal.excerpt || "",
          content: deal.content || "",
          brand: deal.brand || "",
          featured_image: deal.featured_image || "",
          deal_url: deal.deal_url || "",
          start_date: formatDateForInput(deal.start_date),
          end_date: formatDateForInput(deal.end_date),
          published: deal.published || false,
          seo_title: deal.seo_title || "",
          seo_description: deal.seo_description || "",
          seo_keywords: deal.seo_keywords || "",
          tags: deal.tags || []
        });
      } else {
        toast.error("Deal not found");
        navigate("/admin/deals");
      }
    } catch (error) {
      toast.error("Failed to load deal");
      navigate("/admin/deals");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Maximum size is 5MB.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const token = localStorage.getItem("admin_token");
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await axios.post(
        `${BACKEND_URL}/api/deals/upload-image`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setFormData(prev => ({ ...prev, featured_image: response.data.url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleContentChange = useCallback((newContent) => {
    setFormData(prev => ({ ...prev, content: newContent }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!formData.start_date) {
      toast.error("Start date is required");
      return;
    }
    if (!formData.end_date) {
      toast.error("End date is required");
      return;
    }
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast.error("End date must be after start date");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      
      // Convert dates to ISO format
      const submitData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };

      if (isEditing) {
        await axios.put(`${BACKEND_URL}/api/deals/${id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Deal updated successfully");
      } else {
        await axios.post(`${BACKEND_URL}/api/deals`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Deal created successfully");
      }
      navigate("/admin/deals");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save deal");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-orange-600" size={32} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? "Edit Deal" : "New Deal"}>
      <div className="max-w-4xl mx-auto">
        <Link to="/admin/deals" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back to Deals
        </Link>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Tag className="text-orange-600 mr-3" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Deal" : "Create New Deal"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Deal Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter deal title..."
                required
              />
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="deal-url-slug"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Preview: /deals/{formData.slug || "your-slug"}
              </p>
            </div>

            {/* Brand */}
            <div>
              <Label htmlFor="brand">Brand Name</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g., Microsoft, Logitech, Poly..."
              />
            </div>

            {/* Deal URL */}
            <div>
              <Label htmlFor="deal_url">Deal Link (External URL)</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="deal_url"
                  type="url"
                  value={formData.deal_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, deal_url: e.target.value }))}
                  placeholder="https://example.com/deal"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Link where users can access or purchase this deal
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="end_date">End Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt">Short Description / Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief summary of the deal..."
                rows={2}
              />
            </div>

            {/* Featured Image */}
            <div>
              <Label>Featured Image</Label>
              <div className="mt-2 space-y-3">
                {formData.featured_image ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.featured_image}
                      alt="Featured"
                      className="h-48 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, featured_image: "" }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <ImageIcon className="mx-auto text-gray-400 mb-3" size={32} />
                    <p className="text-sm text-gray-600 mb-3">Upload an image for this deal</p>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                    <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      {isUploadingImage ? (
                        <Loader2 size={18} className="mr-2 animate-spin" />
                      ) : (
                        <Upload size={18} className="mr-2" />
                      )}
                      {isUploadingImage ? "Uploading..." : "Upload Image"}
                    </div>
                  </label>
                  
                  <span className="text-gray-400">or</span>
                  
                  <Input
                    type="url"
                    value={formData.featured_image?.startsWith('data:') ? '' : formData.featured_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="Paste image URL..."
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Rich Text Content */}
            <div>
              <Label>Deal Content</Label>
              <p className="text-sm text-gray-500 mb-2">
                Full description with images, videos, and formatting
              </p>
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Write the full deal description here..."
              />
            </div>

            {/* SEO Fields */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                    placeholder="SEO optimized title (defaults to deal title)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="seo_description">Meta Description</Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                    placeholder="Brief description for search engines..."
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="seo_keywords">Keywords</Label>
                  <Input
                    id="seo_keywords"
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3..."
                  />
                </div>
              </div>
            </div>

            {/* Published Toggle */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <Label htmlFor="published" className="text-base font-medium">
                  Publish Deal
                </Label>
                <p className="text-sm text-gray-500">
                  Make this deal visible on the website
                </p>
              </div>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/deals")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    {isEditing ? "Update Deal" : "Create Deal"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
