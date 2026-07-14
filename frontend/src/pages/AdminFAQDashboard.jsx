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
import { toast } from "sonner";
import { getBrandsSorted } from "../data/brands";

import { api } from "../lib/api";
export const AdminFAQDashboard = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [parentFilter, setParentFilter] = useState("all"); // all | brand:<slug> | service:<slug>
  const [isLoading, setIsLoading] = useState(true);

  const brandOptions = getBrandsSorted();
  const serviceOptions = services;
  const brandLookup = Object.fromEntries(brandOptions.map((b) => [b.slug, b]));
  const serviceLookup = Object.fromEntries(serviceOptions.map((s) => [s.slug, s]));

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
      const response = await api.get(`/admin/faqs`, {
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
      await api.delete(`/faqs/${id}`, {
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
    let matchParent = true;
    if (parentFilter !== "all") {
      const [type, slug] = parentFilter.split(":");
      matchParent = type === "brand" ? f.brand_slug === slug : f.service_slug === slug;
    }
    return matchQuery && matchParent;
  });

  // Group by parent (brand:<slug> or service:<slug>) for display
  const grouped = filtered.reduce((acc, f) => {
    const key = f.service_slug ? `service:${f.service_slug}` : `brand:${f.brand_slug}`;
    (acc[key] = acc[key] || []).push(f);
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
            value={parentFilter}
            onChange={(e) => setParentFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            data-testid="admin-faq-parent-filter"
          >
            <option value="all">All FAQs</option>
            <optgroup label="Brands">
              {brandOptions.map((b) => (
                <option key={`brand-${b.slug}`} value={`brand:${b.slug}`}>
                  {b.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Services">
              {serviceOptions.map((s) => (
                <option key={`service-${s.slug}`} value={`service:${s.slug}`}>
                  {s.name}
                </option>
              ))}
            </optgroup>
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
              {searchQuery || parentFilter !== "all" ? "No FAQs match" : "No FAQs yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || parentFilter !== "all"
                ? "Try clearing filters"
                : "Create your first FAQ to get started"}
            </p>
            {!searchQuery && parentFilter === "all" && (
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
            {Object.entries(grouped).map(([key, items]) => {
              const [type, slug] = key.split(":");
              const parent = type === "brand" ? brandLookup[slug] : serviceLookup[slug];
              const publicHref = type === "brand" ? `/brands/${slug}` : `/services/${slug}`;
              const typeLabel = type === "brand" ? "Brand" : "Service";
              const typeChipClass =
                type === "brand"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200";
              return (
                <div key={key} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${typeChipClass}`}>
                        {typeLabel}
                      </span>
                      <h2 className="font-semibold text-gray-900">
                        {parent ? parent.name : slug}{" "}
                        <span className="text-gray-500 font-normal text-sm ml-2">
                          ({items.length})
                        </span>
                      </h2>
                    </div>
                    <a
                      href={publicHref}
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
