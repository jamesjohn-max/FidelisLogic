/**
 * Cookie consent + GA4 loader.
 *
 * Strategy:
 *  - dataLayer + gtag stub are initialised in index.html so analytics calls
 *    made before consent never throw — they're simply queued.
 *  - When the user accepts, we inject the gtag.js script. On load, we replay
 *    the standard `js` + `config` calls and any queued events flush naturally.
 *  - When the user declines, no remote script ever loads.
 *  - Choice is persisted in localStorage so we don't re-prompt on every visit.
 */

const STORAGE_KEY = "fl_cookie_consent"; // "granted" | "denied"
const GA_MEASUREMENT_ID = "G-EEXXM8VHSC";
const GA_SCRIPT_FLAG = "__fl_ga_loaded";

export const getConsent = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setConsent = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage blocked — proceed without persistence */
  }
};

export const loadGtag = () => {
  if (typeof window === "undefined") return;
  if (window[GA_SCRIPT_FLAG]) return; // already loaded
  window[GA_SCRIPT_FLAG] = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Once the remote script is in flight, send the standard init events.
  // gtag() is already defined as a dataLayer.push wrapper in index.html.
  if (typeof window.gtag === "function") {
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);
  }
};

export const grantConsent = () => {
  setConsent("granted");
  loadGtag();
};

export const denyConsent = () => {
  setConsent("denied");
};

// On every page load, if the user previously granted consent, ensure GA is loaded.
export const initConsentOnBoot = () => {
  if (getConsent() === "granted") {
    loadGtag();
  }
};
