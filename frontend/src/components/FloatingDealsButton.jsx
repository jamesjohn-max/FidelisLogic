import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tag, X } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Floating CTA that surfaces Smart Deals on every public page.
// Hidden on /admin routes and on /deals itself. Dismissible per-session.
export const FloatingDealsButton = () => {
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/deals/active`);
        setActiveCount(Array.isArray(res.data) ? res.data.length : 0);
      } catch {
        setActiveCount(0);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("fl_deals_fab_dismissed");
    if (stored === "1") setDismissed(true);
  }, []);

  const path = location.pathname;
  const isHidden =
    dismissed ||
    path.startsWith("/admin") ||
    path.startsWith("/deals") ||
    activeCount === 0;

  if (isHidden) return null;

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem("fl_deals_fab_dismissed", "1");
    setDismissed(true);
  };

  return (
    <Link
      to="/deals"
      aria-label={`Smart Deals — ${activeCount} active`}
      data-testid="floating-deals-button"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <div className="relative flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-all">
        <Tag className="w-5 h-5" />
        <span className="font-semibold text-sm">Smart Deals</span>
        {activeCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 bg-white text-orange-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-orange-500"
            data-testid="floating-deals-count"
          >
            {activeCount}
          </span>
        )}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="hidden sm:flex absolute -top-2 -left-2 w-6 h-6 items-center justify-center rounded-full bg-white text-gray-500 hover:text-gray-800 shadow border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
          data-testid="floating-deals-dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </Link>
  );
};
