import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getBrandsSorted } from "../data/brands";
import { PartnershipBadge } from "./PartnershipBadge";
import { BrandLogo } from "./BrandLogo";

/**
 * Section that surfaces the curated brand ecosystem. Used on the homepage
 * and (in detailed form) on the About page.
 *
 * Props:
 *  - title, subtitle: copy overrides
 *  - variant: "compact" (logo strip + link) | "detailed" (grid of cards)
 *  - background: "white" | "gray"
 */
export const TrustedBrands = ({
  title = "Our Curated Brand Ecosystem",
  subtitle = "We partner deliberately with a short list of best-in-class platforms — chosen for outcomes, not quotas.",
  variant = "compact",
  background = "white",
  testIdPrefix = "trusted-brands"
}) => {
  const brands = getBrandsSorted();
  const bgClass = background === "gray" ? "bg-gray-50" : "bg-white";

  return (
    <section className={`py-16 lg:py-20 px-4 sm:px-6 lg:px-8 ${bgClass}`} data-testid={`${testIdPrefix}-section`}>
      {/* <div className="max-w-6xl mx-auto"> */}
<div className="max-w-[1500px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Strategic Partnerships
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-5 leading-tight" data-testid={`${testIdPrefix}-title`}>
            {title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">{subtitle}</p>
        </div>

        {variant === "compact" ? (
          <>
            {/* </> <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-10"> */}
              <div className="w-full max-w-[1500px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-7 mb-10">
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  to={`/brands/${brand.slug}`}
                 
                 className="group flex flex-col items-center justify-center min-h-[150px] px-6 py-8 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                
                 data-testid={`${testIdPrefix}-logo-${brand.slug}`}
                  title={`${brand.name} — ${brand.partnershipType}`}
                >
                  <div className="mb-2 group-hover:scale-110 transition-transform">
                    <BrandLogo
                      brand={brand}
                      size="md"
                      testId={`${testIdPrefix}-logo-img-${brand.slug}`}
                    />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-full ${
                      brand.partnershipType === "Distribution Partner"
                        ? "bg-amber-600 text-white"
                        : "bg-white text-slate-700 border border-slate-300"
                    }`}
                    data-testid={`${testIdPrefix}-partnership-${brand.slug}`}
                  >
                    {brand.partnershipType !== "Distribution Partner" && (
                      <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" aria-hidden="true" />
                    )}
                    {brand.partnershipType === "Distribution Partner" ? "Distribution" : "Channel"}
                  </span>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/brands"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                data-testid={`${testIdPrefix}-cta`}
              >
                Explore the full brand ecosystem
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  to={`/brands/${brand.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col"
                  data-testid={`${testIdPrefix}-card-${brand.slug}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <BrandLogo
                      brand={brand}
                      size="md"
                      testId={`${testIdPrefix}-card-logo-${brand.slug}`}
                    />
                    {brand.featured && (
                      <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <PartnershipBadge
                      type={brand.partnershipType}
                      size="xs"
                      testId={`${testIdPrefix}-detailed-partnership-${brand.slug}`}
                    />
                  </div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
                    {brand.category}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed flex-1 mb-4">
                    {brand.shortDescription}
                  </p>
                  <div className="flex items-center text-sm text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/brands"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                data-testid={`${testIdPrefix}-cta`}
              >
                Visit the brand hub
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
