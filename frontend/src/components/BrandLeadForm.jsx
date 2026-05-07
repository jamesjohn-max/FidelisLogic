import { useState } from "react";
import axios from "axios";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Inline lead-gen form rendered on each brand detail page.
 * - variant="compact": narrow card for the hero side panel (3 fields stacked)
 * - variant="full": end-of-page conversion section (4-field grid)
 *
 * Submits to /api/contact with `topic` pre-tagged so sales can filter by brand.
 */
export const BrandLeadForm = ({ brand, variant = "full" }) => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const isCompact = variant === "compact";
  const formId = `brand-lead-${variant}-${brand.slug}`;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("loading");
    setErrorMsg("");

    const payload = {
      name: form.name,
      email: form.email,
      company: form.company || null,
      topic: `Brand inquiry — ${brand.name}`,
      message:
        form.message ||
        `Inbound interest in ${brand.name} via /brands/${brand.slug}. No additional message provided.`,
    };

    try {
      await axios.post(`${BACKEND_URL}/api/contact`, payload);
      setStatus("success");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.response?.data?.detail ||
          "Something went wrong. Please try again or email us directly."
      );
    }
  };

  if (status === "success") {
    return (
      <div
        className={`bg-white border border-gray-200 rounded-2xl shadow-sm ${
          isCompact ? "p-6" : "p-10"
        } text-center`}
        data-testid={`${formId}-success`}
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <h3 className={`font-bold text-brand-dark mb-2 ${isCompact ? "text-lg" : "text-2xl"}`}>
          Request received.
        </h3>
        <p className={`text-gray-600 leading-relaxed ${isCompact ? "text-sm" : "text-base"}`}>
          A {brand.name} solution lead from Fidelis Logic will be in touch within one
          business day with a tailored response.
        </p>
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6" data-testid={`${formId}-card`}>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
          Quick request
        </p>
        <h3 className="text-lg font-bold text-brand-dark mb-4 leading-tight">
          Request a {brand.name} consultation
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Full name"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            data-testid={`${formId}-name`}
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Work email"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            data-testid={`${formId}-email`}
          />
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            data-testid={`${formId}-company`}
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            data-testid={`${formId}-submit`}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…
              </>
            ) : (
              <>
                Request consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
          {status === "error" && (
            <p className="text-xs text-red-600" data-testid={`${formId}-error`}>
              {errorMsg}
            </p>
          )}
          <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
            We respond within one business day. No marketing spam.
          </p>
        </form>
      </div>
    );
  }

  // Full variant
  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/40"
      data-testid={`${formId}-section`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
          <div className="grid lg:grid-cols-5">
            <div className="lg:col-span-2 p-10 lg:p-12 bg-brand-dark text-white">
              <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-4">
                Talk to a Solution Lead
              </p>
              <h2 className="text-3xl font-bold mb-5 leading-tight">
                Build a {brand.name} programme that fits your estate.
              </h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                Share a few details and a Fidelis Logic solution lead will follow up within
                one business day with a tailored {brand.name} design, commercial shape, and
                deployment plan — no sales pressure.
              </p>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                  <span>UAE-based delivery and lifecycle support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                  <span>Vendor-neutral design — recommended only when {brand.name} fits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                  <span>Single point of accountability through go-live</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-3 p-10 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      data-testid={`${formId}-name`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Work email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      data-testid={`${formId}-email`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    data-testid={`${formId}-company`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    What would you like to discuss about {brand.name}?
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={`E.g., We have 25 meeting rooms and are evaluating ${brand.name} for our Dubai HQ refresh.`}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
                    data-testid={`${formId}-message`}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "loading"}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    data-testid={`${formId}-submit`}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Send my request
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500">
                    We respond within one business day. No marketing spam.
                  </p>
                </div>
                {status === "error" && (
                  <p className="text-sm text-red-600" data-testid={`${formId}-error`}>
                    {errorMsg}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
