import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { getBrandsSorted } from "../data/brands";
import { services } from "../data/services";

import { api } from "../lib/api";
export const FAQEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const brandOptions = getBrandsSorted();
  const serviceOptions = services;

  const [form, setForm] = useState({
    parent_type: "brand", // "brand" | "service"
    brand_slug: brandOptions[0]?.slug || "",
    service_slug: serviceOptions[0]?.slug || "",
    question: "",
    answer: "",
    order: 0,
    published: true,
  });
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    if (isEdit) {
      loadFAQ();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadFAQ = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await api.get(`/faqs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parentType = res.data.service_slug ? "service" : "brand";
      setForm({
        parent_type: parentType,
        brand_slug: res.data.brand_slug || brandOptions[0]?.slug || "",
        service_slug: res.data.service_slug || serviceOptions[0]?.slug || "",
        question: res.data.question,
        answer: res.data.answer,
        order: res.data.order ?? 0,
        published: res.data.published ?? true,
      });
    } catch (error) {
      toast.error("Failed to load FAQ");
      navigate("/admin/faqs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const payload = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        order: Number(form.order) || 0,
        published: form.published,
      };
      // Exactly one of brand_slug or service_slug — the backend enforces this.
      if (form.parent_type === "brand") {
        payload.brand_slug = form.brand_slug;
        payload.service_slug = null;
      } else {
        payload.service_slug = form.service_slug;
        payload.brand_slug = null;
      }

      if (isEdit) {
        await api.put(`/faqs/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("FAQ updated");
      } else {
        await api.post(`/faqs`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("FAQ created");
      }
      navigate("/admin/faqs");
    } catch (error) {
      const detail = error?.response?.data?.detail || "Failed to save FAQ";
      toast.error(detail);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-24">
          <Loader2 className="animate-spin mx-auto text-emerald-600 mb-4" size={32} />
          <p className="text-gray-600">Loading FAQ...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <Link
          to="/admin/faqs"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to FAQs
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {isEdit ? "Edit FAQ" : "New FAQ"}
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          These questions appear on the public brand or service page and are emitted as
          FAQPage structured data for Google indexing.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6" data-testid="faq-editor-form">
          {/* Parent type toggle */}
          <div>
            <Label className="mb-2 block">
              This FAQ is for a <span className="text-red-500">*</span>
            </Label>
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50" role="tablist">
              <button
                type="button"
                onClick={() => handleChange("parent_type", "brand")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  form.parent_type === "brand"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                data-testid="faq-editor-type-brand"
              >
                Brand
              </button>
              <button
                type="button"
                onClick={() => handleChange("parent_type", "service")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  form.parent_type === "service"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                data-testid="faq-editor-type-service"
              >
                Service
              </button>
            </div>
          </div>

          {form.parent_type === "brand" ? (
            <div>
              <Label htmlFor="brand_slug" className="mb-1.5 block">
                Brand <span className="text-red-500">*</span>
              </Label>
              <select
                id="brand_slug"
                value={form.brand_slug}
                onChange={(e) => handleChange("brand_slug", e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                data-testid="faq-editor-brand"
              >
                {brandOptions.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <Label htmlFor="service_slug" className="mb-1.5 block">
                Service <span className="text-red-500">*</span>
              </Label>
              <select
                id="service_slug"
                value={form.service_slug}
                onChange={(e) => handleChange("service_slug", e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                data-testid="faq-editor-service"
              >
                {serviceOptions.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <Label htmlFor="question" className="mb-1.5 block">
              Question <span className="text-red-500">*</span>
            </Label>
            <Input
              id="question"
              value={form.question}
              onChange={(e) => handleChange("question", e.target.value)}
              placeholder="e.g., How long does a typical deployment take?"
              required
              data-testid="faq-editor-question"
            />
          </div>

          <div>
            <Label htmlFor="answer" className="mb-1.5 block">
              Answer <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="answer"
              value={form.answer}
              onChange={(e) => handleChange("answer", e.target.value)}
              placeholder="Answer in a couple of sentences — clear, concrete, and free of jargon."
              rows={6}
              required
              data-testid="faq-editor-answer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order" className="mb-1.5 block">
                Order
              </Label>
              <Input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) => handleChange("order", e.target.value)}
                placeholder="0"
                min={0}
                data-testid="faq-editor-order"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first.</p>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(v) => handleChange("published", v)}
                data-testid="faq-editor-published"
              />
              <Label htmlFor="published">Published (visible on site)</Label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/admin/faqs")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700"
              data-testid="faq-editor-save"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> {isEdit ? "Save changes" : "Create FAQ"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
