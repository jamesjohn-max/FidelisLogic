import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { solutionBrandMap, getBrandBySlug } from "../data/brands";
import { PartnershipBadge } from "./PartnershipBadge";

/**
 * Inline section on solution pages that surfaces the brands Fidelis Logic
 * delivers for that solution. Expects `solutionSlug` matching brands.solutionBrandMap.
 */
export const SolutionBrands = ({
  solutionSlug,
  title = "Brands we deliver for this solution",
  subtitle = "Curated partners — each selected for a specific role in modern workplace estates."
}) => {
  const slugs = solutionBrandMap[solutionSlug] || [];
  const brands = slugs.map(getBrandBySlug).filter(Boolean);
  if (brands.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white" data-testid="solution-brands-section">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-10 flex-wrap gap-2">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Brand Ecosystem
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark">{title}</h2>
            <p className="text-gray-600 mt-3 max-w-2xl">{subtitle}</p>
          </div>
          <Link
            to="/brands"
            className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1.5 text-sm shrink-0"
            data-testid="solution-brands-see-all"
          >
            See all brands
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              to={`/brands/${brand.slug}`}
              className="group bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-white hover:border-blue-300 hover:shadow-lg transition-all flex flex-col"
              data-testid={`solution-brand-${brand.slug}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="text-xl font-bold"
                  style={{ color: brand.accentColor }}
                >
                  {brand.logoText}
                </div>
                {brand.featured && (
                  <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Featured
                  </span>
                )}
              </div>
              <div className="mb-3">
                <PartnershipBadge
                  type={brand.partnershipType}
                  size="xs"
                  testId={`solution-brand-partnership-${brand.slug}`}
                />
              </div>
              <p className="text-sm font-semibold text-brand-dark mb-2">{brand.tagline}</p>
              <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">
                {brand.shortDescription}
              </p>
              <div className="flex items-center text-sm text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                Learn more
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
