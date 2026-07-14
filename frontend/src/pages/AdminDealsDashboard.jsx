import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Tag, 
  Clock,
  Calendar,
  ExternalLink,
  AlertCircle,
  FileText,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

import { api } from "../lib/api";
export const AdminDealsDashboard = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchDeals();
    }
  }, [navigate]);

  const fetchDeals = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await api.get(`/deals?published_only=false`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeals(response.data);
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast.error("Failed to load deals");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      const token = localStorage.getItem("admin_token");
      await api.delete(`/deals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deal deleted successfully");
      fetchDeals();
    } catch (error) {
      toast.error("Failed to delete deal");
    }
  };

  // Deal status helpers
  const isExpired = (endDate) => new Date(endDate) < new Date();
  const isUpcoming = (startDate) => new Date(startDate) > new Date();
  const isActive = (startDate, endDate) => {
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const publishedDeals = deals.filter(d => d.published);
  const activeDeals = publishedDeals.filter(d => isActive(d.start_date, d.end_date));
  const expiredDeals = publishedDeals.filter(d => isExpired(d.end_date));
  const draftDeals = deals.filter(d => !d.published);

  return (
    <AdminLayout title="Smart Deals">
      <div className="max-w-6xl mx-auto">
        {/* Back to Selection */}
        <Link to="/admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back to Admin Home
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Tag className="mr-3 text-orange-600" size={32} />
              Smart Deals
            </h1>
            <p className="text-gray-600 mt-1">Manage promotional deals and offers</p>
          </div>
          <Button 
            onClick={() => navigate("/admin/deals/new")}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus size={18} className="mr-2" />
            New Deal
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-1">Total Deals</div>
            <div className="text-2xl font-bold text-gray-900">{deals.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-green-600 mb-1">Active</div>
            <div className="text-2xl font-bold text-green-600">{activeDeals.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-1">Expired</div>
            <div className="text-2xl font-bold text-gray-400">{expiredDeals.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-yellow-600 mb-1">Drafts</div>
            <div className="text-2xl font-bold text-yellow-600">{draftDeals.length}</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search deals by title or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Deals List */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto text-orange-600 mb-4" size={32} />
            <p className="text-gray-600">Loading deals...</p>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Tag className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? "No deals found" : "No deals yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? "Try a different search term" : "Create your first deal to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate("/admin/deals/new")} className="bg-orange-600 hover:bg-orange-700">
                <Plus size={18} className="mr-2" />
                Create Deal
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredDeals.map((deal, index) => {
              const expired = isExpired(deal.end_date);
              const upcoming = isUpcoming(deal.start_date);
              const active = isActive(deal.start_date, deal.end_date);

              return (
                <div 
                  key={deal.id} 
                  className={`flex items-center gap-4 p-4 ${
                    index !== filteredDeals.length - 1 ? "border-b" : ""
                  } ${expired ? "bg-gray-50" : ""}`}
                >
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {deal.featured_image ? (
                      <img
                        src={deal.featured_image}
                        alt={deal.title}
                        className={`w-20 h-20 object-cover rounded-lg ${expired ? "grayscale opacity-60" : ""}`}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Tag className="text-gray-400" size={24} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold truncate ${expired ? "text-gray-500" : "text-gray-900"}`}>
                        {deal.title}
                      </h3>
                      
                      {/* Status Badges */}
                      {!deal.published && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                          Draft
                        </Badge>
                      )}
                      {deal.published && expired && (
                        <Badge className="bg-gray-600 text-white">
                          Expired
                        </Badge>
                      )}
                      {deal.published && upcoming && (
                        <Badge className="bg-blue-600 text-white">
                          Upcoming
                        </Badge>
                      )}
                      {deal.published && active && (
                        <Badge className="bg-green-600 text-white">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Tag size={14} className="mr-1" />
                        {deal.brand || "No brand"}
                      </span>
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(deal.start_date)} - {formatDate(deal.end_date)}
                      </span>
                      {deal.deal_url && (
                        <span className="flex items-center text-orange-600">
                          <ExternalLink size={14} className="mr-1" />
                          Has link
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/deals/${deal.slug}`, '_blank')}
                      title="Preview"
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/deals/edit/${deal.id}`)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(deal.id, deal.title)}
                      title="Delete"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
