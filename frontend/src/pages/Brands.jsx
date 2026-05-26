import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { StructuredData, breadcrumbSchema } from "../components/StructuredData";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { brands, getBrandsSorted, getFeaturedBrands } from "../data/brands";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { PartnershipBadge } from "../components/PartnershipBadge";
import { BrandLogo } from "../components/BrandLogo";
import { analytics } from "../lib/analytics";

const categories = [
  "All",
  ...Array.from(new Set(brands.map((b) => b.category)))
];

export const Brands = () => {
  const sortedBrands = getBrandsSorted();
  const featured = getFeaturedBrands();
  const nonFeatured = sortedBrands.filter((b) => !b.featured);

  const breadcrumbs = [
    { name: "Home", url: "https://www.fidelislogic.com/" },
    { name: "Brands", url: "https://www.fidelislogic.com/brands" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Brand Ecosystem | Curated Workplace Technology Partners - Fidelis Logic"
        description="Explore Fidelis Logic's curated partner ecosystem — ROOMZ, Morbit, Jabra, Poly, Neat, Yealink, and Logitech. Vendor-neutral advisory backed by authorized UAE deployment expertise."
        keywords="workplace technology brands UAE, ROOMZ UAE partner, Morbit UAE, Jabra UAE, Poly UAE, Neat UAE, Yealink UAE, Logitech UAE, collaboration device partners"
      />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <Breadcrumbs items={[{ name: "Brands" }]} />

      {/* Hero */}
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 mb-4" data-testid="brands-hero-badge">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Curated Strategic Partners
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark mb-6 leading-tight" data-testid="brands-hero-title">
              A trusted brand ecosystem, engineered around your outcomes.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl" data-testid="brands-hero-subtitle">
              We don't chase every vendor. We partner deliberately with a short list of
              best-in-class platforms — because the quality of a workplace technology
              investment is defined by how well it's specified, deployed, and supported
              over its lifecycle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                onClick={() =>
                  analytics.partnerBriefingClick({ location: "brands_hub_hero" })
                }
              >
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="brands-hero-cta">
                  Book a Partner Briefing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/solutions">
                <Button variant="outline" size="lg" data-testid="brands-hero-secondary-cta">
                  Explore Solutions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      {featured.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" data-testid="brands-featured-section">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-baseline justify-between mb-8 flex-wrap gap-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark">
                Featured Partners
              </h2>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                Flagship Workspace Experience
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featured.map((brand) => (
                <Link
                  key={brand.slug}
                  to={`/brands/${brand.slug}`}
                  className="group relative block bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-xl transition-all"
                  data-testid={`brand-featured-${brand.slug}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <BrandLogo brand={brand} size="lg" testId={`brand-featured-logo-${brand.slug}`} />
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        {brand.category}
                      </Badge>
                      <PartnershipBadge
                        type={brand.partnershipType}
                        size="xs"
                        testId={`brand-featured-partnership-${brand.slug}`}
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-brand-dark mb-3">
                    {brand.tagline}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {brand.shortDescription}
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                    Explore {brand.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Brands Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" data-testid="brands-all-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-2">
            The Complete Brand Ecosystem
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            Every brand we represent is chosen for a specific role in a modern workplace
            stack — and every deployment is wrapped in Fidelis Logic advisory and delivery.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nonFeatured.map((brand) => (
              <Link
                key={brand.slug}
                to={`/brands/${brand.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col"
                data-testid={`brand-card-${brand.slug}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <BrandLogo brand={brand} size="md" testId={`brand-card-logo-${brand.slug}`} />
                  <PartnershipBadge
                    type={brand.partnershipType}
                    size="xs"
                    testId={`brand-card-partnership-${brand.slug}`}
                  />
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
                  {brand.category}
                </div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">
                  {brand.tagline}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">
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

      {/* Our Role */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" data-testid="brands-role-section">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                Our Positioning
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-6 leading-tight">
                Advisor and delivery partner. Not a reseller.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Fidelis Logic is a UAE-based workplace technology advisory with a curated
                strategic brand ecosystem. We recommend what fits your business, your
                estate, and your lifecycle economics — not what fills a quota.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We work alongside your preferred reseller or system integrator, or deliver
                end-to-end ourselves. Either way, our accountability is to your outcomes.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Vendor-neutral recommendations tied to your business requirements",
                "Authorized deployment partner across every brand listed",
                "Single point of accountability across design, delivery, and support",
                "Independent of product quotas or single-vendor pressure"
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Want an unbiased brand recommendation?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Book a 30-minute briefing. We'll discuss your estate, use cases, and
            constraints — and send you a shortlist of 2–3 brands that actually fit.
          </p>
          <Link
            to="/contact"
            onClick={() =>
              analytics.partnerBriefingClick({ location: "brands_hub_footer" })
            }
          >
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
              data-testid="brands-footer-cta"
            >
              Book a Partner Briefing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
