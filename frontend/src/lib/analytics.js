/**
 * Thin GA4 event-tracking wrapper. Safely no-ops if gtag isn't loaded
 * (e.g., ad-blockers, dev/test environments).
 *
 * GA4 event naming convention: snake_case verbs, ≤40 chars.
 * Params: keep keys snake_case, values short strings/numbers.
 *
 * Reference: window.gtag('event', name, params).
 */

const isGtagAvailable = () =>
  typeof window !== "undefined" && typeof window.gtag === "function";

export const trackEvent = (name, params = {}) => {
  if (!isGtagAvailable()) return;
  try {
    window.gtag("event", name, params);
  } catch {
    /* swallow — analytics must never break UX */
  }
};

// Convenience helpers for the events we track across the site.
export const analytics = {
  consultationCtaClick: (params) => trackEvent("consultation_cta_click", params),
  partnerBriefingClick: (params) => trackEvent("partner_briefing_click", params),
  brandLeadSubmit: (params) => trackEvent("brand_lead_submit", params),
  brandLeadSubmitError: (params) => trackEvent("brand_lead_submit_error", params),
  brandLeadStart: (params) => trackEvent("brand_lead_start", params),
  contactFormSubmit: (params) => trackEvent("contact_form_submit", params),
  floatingDealsClick: (params) => trackEvent("floating_deals_click", params),
  solutionBrandClick: (params) => trackEvent("solution_brand_click", params),
};
