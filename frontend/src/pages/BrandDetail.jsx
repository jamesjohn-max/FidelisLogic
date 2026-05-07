import { useParams, Link, Navigate } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { StructuredData, breadcrumbSchema } from "../components/StructuredData";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { getBrandBySlug, getBrandsSorted } from "../data/brands";
import { ArrowRight, CheckCircle2, Sparkles, ArrowLeft } from "lucide-react";
import { PartnershipBadge } from "../components/PartnershipBadge";
import { BrandLeadForm } from "../components/BrandLeadForm";

export const BrandDetail = () => {
  const { slug } = useParams();
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return <Navigate to="/brands" replace />;
  }

  const otherBrands = getBrandsSorted()
    .filter((b) => b.slug !== brand.slug)
    .slice(0, 3);

  const primaryUseCase = brand.useCases[0];
  const primarySolution = brand.relatedSolutions[0];
  const headlineProofs = brand.proofPoints.slice(0, 3);
  const strengths = brand.keyStrengths;
  const products = brand.products;
  const useCases = brand.useCases;
  const relatedSolutions = brand.relatedSolutions;

  const breadcrumbs = [
    { name: "Home", url: "https://fidelislogic.com/" },
    { name: "Brands", url: "https://fidelislogic.com/brands" },
    { name: brand.name, url: `https://fidelislogic.com/brands/${brand.slug}` }
  ];

  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": brand.name,
    "description": brand.shortDescription,
    "slogan": brand.tagline
  };

  const accentTint = `${brand.accentColor}0D`;
  const heroBg = { background: `linear-gradient(135deg, ${accentTint} 0%, #ffffff 70%)` };
  const deliveryBg = { background: `linear-gradient(135deg, ${accentTint} 0%, #ffffff 100%)` };
  const accentTextStyle = { color: brand.accentColor };
  const accentBgStyle = { backgroundColor: brand.accentColor };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${brand.name} UAE Partner | ${brand.tagline} - Fidelis Logic`}
        description={`${brand.shortDescription} Delivered in the UAE by Fidelis Logic with design, deployment, and lifecycle support.`}
        keywords={`${brand.name} UAE, ${brand.name} partner UAE, ${brand.category.toLowerCase()} UAE, Fidelis Logic ${brand.name}`}
      />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <StructuredData data={brandSchema} />
      <Breadcrumbs
        items={[
          { name: "Brands", href: "/brands" },
          { name: brand.name }
        ]}
      />

      {/* Hero */}
      <section
        className="pt-12 pb-16 px-4 sm:px-6 lg:px-8"
        style={heroBg}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {brand.featured && (
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100" data-testid="brand-featured-badge">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Featured Partner
                  </Badge>
                )}
                <PartnershipBadge
                  type={brand.partnershipType}
                  size="sm"
                  testId="brand-partnership-badge"
                />
              </div>
              <div
                className="text-5xl sm:text-6xl font-bold tracking-tight mb-6"
                style={accentTextStyle}
                data-testid="brand-logo-wordmark"
              >
                {brand.logoText}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-5 leading-tight" data-testid="brand-hero-title">
                {brand.tagline}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl" data-testid="brand-hero-description">
                {brand.longDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="brand-hero-cta-primary">
                    Book a {brand.name} Consultation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                {primarySolution && (
                  <Link to={primarySolution.href}>
                    <Button variant="outline" size="lg" data-testid="brand-hero-cta-secondary">
                      Explore {primarySolution.name}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  At a glance
                </p>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500 mb-1">Partnership</dt>
                    <dd>
                      <PartnershipBadge
                        type={brand.partnershipType}
                        size="sm"
                        testId="brand-partnership-badge-glance"
                      />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 mb-1">Category</dt>
                    <dd className="text-base font-semibold text-brand-dark">{brand.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 mb-1">Ideal for</dt>
                    <dd className="text-base text-brand-dark">{brand.useCases[0]}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 mb-2">Proof points</dt>
                    <dd className="space-y-2">
                      {brand.proofPoints.slice(0, 3).map((p) => (
                        <div key={p} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
              <BrandLeadForm brand={brand} variant="compact" />
            </div>
          </div>
        </div>
      </section>

      {/* Why this brand */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white" data-testid="brand-strengths-section">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
              Why {brand.name}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark leading-tight">
              What makes {brand.name} a deliberate choice in our ecosystem.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {strengths.map((strength, idx) => (
              <div key={idx} className="flex gap-4" data-testid={`brand-strength-${idx}`}>
                <div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                  style={accentBgStyle}
                >
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-2">
                    {strength.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{strength.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" data-testid="brand-products-section">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
              Product Portfolio
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark leading-tight">
              Where {brand.name} fits in your estate.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-6"
                data-testid={`brand-product-${idx}`}
              >
                <h3 className="text-lg font-semibold text-brand-dark mb-3">{product.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white" data-testid="brand-usecases-section">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                Where we deploy {brand.name}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-6 leading-tight">
                Use cases and environments.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {brand.name} earns its place in the estates where it clearly outperforms
                alternatives on the factors that matter most. Here's where we typically
                position it.
              </p>
            </div>
            <div>
              <ul className="space-y-4">
                {useCases.map((useCase, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-lg"
                    data-testid={`brand-usecase-${idx}`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-gray-800 font-medium">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fidelis delivery wrap */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={deliveryBg}
        data-testid="brand-delivery-section"
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
              How Fidelis Logic delivers {brand.name}
            </p>
            <h2 className="text-3xl font-bold text-brand-dark mb-6 leading-tight">
              Advisory and delivery, wrapped around the technology.
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-8">{brand.fidelisRole}</p>
            <div className="flex flex-wrap gap-2">
              {relatedSolutions.map((sol) => (
                <Link
                  key={sol.href}
                  to={sol.href}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                  data-testid={`brand-related-solution-${sol.href}`}
                >
                  {sol.name}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other brands */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" data-testid="brand-related-section">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-8 flex-wrap gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark">
              Other brands in the ecosystem
            </h2>
            <Link
              to="/brands"
              className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1.5 text-sm"
              data-testid="brand-see-all-link"
            >
              See all brands
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherBrands.map((b) => (
              <Link
                key={b.slug}
                to={`/brands/${b.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col"
                data-testid={`brand-related-${b.slug}`}
              >
                <div
                  className="text-xl font-bold mb-3"
                  style={{ color: b.accentColor }}
                >
                  {b.logoText}
                </div>
                <div className="mb-2">
                  <PartnershipBadge
                    type={b.partnershipType}
                    size="xs"
                    testId={`brand-related-partnership-${b.slug}`}
                  />
                </div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-2">
                  {b.category}
                </p>
                <h3 className="text-base font-semibold text-brand-dark mb-2">
                  {b.tagline}
                </h3>
                <div className="mt-auto pt-3 flex items-center text-sm text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Full lead form */}
      <BrandLeadForm brand={brand} variant="full" />

      {/* All brands link */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/40">
        <div className="max-w-5xl mx-auto text-center">
          <Link
            to="/brands"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            data-testid="brand-footer-cta-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all brands
          </Link>
        </div>
      </section>
    </div>
  );
};
