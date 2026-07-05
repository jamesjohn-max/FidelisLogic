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
  Search,
  HelpCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { getBrandsSorted } from "../data/brands";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminFAQDashboard = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const brandOptions = getBrandsSorted();
  const brandLookup = Object.fromEntries(brandOptions.map((b) => [b.slug, b]));

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchFaqs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get(`${BACKEND_URL}/api/admin/faqs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to load FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, question) => {
    if (!window.confirm(`Delete FAQ: "${question}"?`)) return;
    try {
      const token = localStorage.getItem("admin_token");
      await axios.delete(`${BACKEND_URL}/api/faqs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("FAQ deleted");
      fetchFaqs();
    } catch (error) {
      toast.error("Failed to delete FAQ");
    }
  };

  const filtered = faqs.filter((f) => {
    const matchQuery =
      !searchQuery ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBrand = brandFilter === "all" || f.brand_slug === brandFilter;
    return matchQuery && matchBrand;
  });

  // Group by brand for display
  const grouped = filtered.reduce((acc, f) => {
    (acc[f.brand_slug] = acc[f.brand_slug] || []).push(f);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <Link
          to="/admin"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Admin Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <HelpCircle className="mr-3 text-emerald-600" size={32} />
              Brand FAQs
            </h1>
            <p className="text-gray-600 mt-1">
              Manage per-brand FAQs shown on the public site and indexed for SEO.
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/faqs/new")}
            className="bg-emerald-600 hover:bg-emerald-700"
            data-testid="admin-faq-new-button"
          >
            <Plus size={18} className="mr-2" />
            New FAQ
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search question or answer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="admin-faq-search"
            />
          </div>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            data-testid="admin-faq-brand-filter"
          >
            <option value="all">All brands</option>
            {brandOptions.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto text-emerald-600 mb-4" size={32} />
            <p className="text-gray-600">Loading FAQs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <HelpCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || brandFilter !== "all" ? "No FAQs match" : "No FAQs yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || brandFilter !== "all"
                ? "Try clearing filters"
                : "Create your first FAQ to get started"}
            </p>
            {!searchQuery && brandFilter === "all" && (
              <Button
                onClick={() => navigate("/admin/faqs/new")}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus size={18} className="mr-2" />
                Create FAQ
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([brandSlug, items]) => {
              const brand = brandLookup[brandSlug];
              return (
                <div key={brandSlug} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">
                      {brand ? brand.name : brandSlug}{" "}
                      <span className="text-gray-500 font-normal text-sm ml-2">
                        ({items.length})
                      </span>
                    </h2>
                    <a
                      href={`/brands/${brandSlug}#faq`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 hover:underline"
                    >
                      View on site →
                    </a>
                  </div>
                  {items.map((faq, idx) => (
                    <div
                      key={faq.id}
                      className={`flex items-start gap-4 p-4 ${
                        idx !== items.length - 1 ? "border-b" : ""
                      }`}
                      data-testid={`admin-faq-row-${faq.id}`}
                    >
                      <div className="w-8 text-sm text-gray-400 pt-1 tabular-nums">
                        #{faq.order ?? 0}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                          {!faq.published && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                              Draft
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/faqs/edit/${faq.id}`)}
                          title="Edit"
                          data-testid={`admin-faq-edit-${faq.id}`}
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(faq.id, faq.question)}
                          title="Delete"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`admin-faq-delete-${faq.id}`}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
