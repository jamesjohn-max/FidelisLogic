import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, Home } from "lucide-react";

/**
 * Breadcrumbs component with visible UI and BreadcrumbList JSON-LD for SEO.
 *
 * Usage:
 *   <Breadcrumbs
 *     items={[
 *       { name: "Solutions", href: "/solutions" },
 *       { name: "Meeting Rooms" }   // last item omits href (current page)
 *     ]}
 *   />
 */
export const Breadcrumbs = ({ items = [], className = "" }) => {
  if (!items.length) return null;

  const base = typeof window !== "undefined" ? window.location.origin : "";
  const trail = [{ name: "Home", href: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": trail.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.href ? { "item": `${base}${item.href}` } : {})
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <nav
        aria-label="Breadcrumb"
        className={`py-4 ${className}`}
        data-testid="breadcrumbs-nav"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center flex-wrap gap-1.5 text-sm text-gray-600">
            {trail.map((item, index) => {
              const isLast = index === trail.length - 1;
              const isHome = index === 0;
              return (
                <li
                  key={`${item.name}-${index}`}
                  className="flex items-center gap-2"
                  data-testid={`breadcrumb-item-${index}`}
                >
                  {index > 0 && (
                    <ChevronRight
                      className="w-4 h-4 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                  {isLast || !item.href ? (
                    <span
                      className="font-semibold text-brand-dark"
                      aria-current="page"
                      data-testid={`breadcrumb-current`}
                    >
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-gray-700 hover:text-brand-red transition-colors flex items-center gap-1.5"
                      data-testid={`breadcrumb-link-${index}`}
                    >
                      {isHome && <Home className="w-4 h-4" aria-hidden="true" />}
                      {!isHome && item.name}
                      {isHome && <span className="sr-only">{item.name}</span>}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
};
