import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  getConsent,
  grantConsent,
  denyConsent,
  initConsentOnBoot,
} from "../lib/cookieConsent";

/**
 * Lightweight cookie-consent banner.
 * - Pinned to bottom of the viewport (does not block page interaction)
 * - Offers Accept / Decline + a discreet close (= Decline)
 * - Persists choice in localStorage; re-prompts only if no prior choice
 * - Loads GA4 (gtag.js) on accept; never loads it on decline
 */
export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    initConsentOnBoot();
    const choice = getConsent();
    if (!choice) {
      // Slight delay so the banner doesn't appear during the initial paint.
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = () => {
    grantConsent();
    setVisible(false);
  };

  const handleDecline = () => {
    denyConsent();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-md z-[60]"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      data-testid="cookie-consent-banner"
    >
      <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl p-5 sm:p-6">
        <button
          type="button"
          onClick={handleDecline}
          aria-label="Decline cookies"
          className="absolute top-3 right-3 w-7 h-7 inline-flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          data-testid="cookie-consent-close"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 w-9 h-9 rounded-full bg-blue-50 inline-flex items-center justify-center">
            <Cookie className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">
              We value your privacy
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed pr-4">
              We use a single analytics cookie (Google Analytics) to understand how
              visitors use our site so we can improve it. Nothing is shared with
              advertisers.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleDecline}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            data-testid="cookie-consent-decline"
          >
            Decline
          </Button>
          <Button
            type="button"
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="cookie-consent-accept"
          >
            Accept analytics cookies
          </Button>
        </div>
      </div>
    </div>
  );
};
