import { useParams, Navigate, Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "../components/ui/button";
import { getServiceBySlug, services } from "../data/services";
import {
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Compass,
  Wrench,
  Headphones,
  Video,
  ClipboardCheck,
  RefreshCw,
  Truck,
  GraduationCap
} from "lucide-react";
import { analytics } from "../lib/analytics";

const iconMap = {
  Compass,
  Wrench,
  Headphones,
  Video,
  ClipboardCheck,
  RefreshCw,
  Truck,
  GraduationCap
};

export const ServiceDetail = () => {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const Icon = iconMap[service.icon] || Compass;

  // Extract nested arrays into local consts to avoid the local visual-edits
  // Babel plugin recursing infinitely on inline .map() over deeply-nested fields.
  const benefits = service.keyBenefits || [];
  const deliverables = service.deliverables || [];
  const idealFor = service.idealFor || [];

  // Pre-extract related services for the "Explore other services" section
  const otherServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${service.seo.title} | Fidelis Logic`}
        description={service.seo.description}
        keywords={service.seo.keywords}
      />
      <Breadcrumbs
        items={[
          { name: "Services", href: "/services" },
          { name: service.name }
        ]}
        className="pt-24"
      />

      {/* Hero */}
      <section className="pt-6 pb-14 lg:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-white to-blue-50/60">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-5 mb-6">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 inline-flex items-center justify-center">
              <Icon size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-[0.14em] mb-2">
                {service.name}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark leading-[1.1] tracking-tight" data-testid="service-hero-title">
                {service.tagline}
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mb-8">
            {service.longDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/contact"
              onClick={() =>
                analytics.consultationCtaClick({
                  location: "service_hero",
                  service: service.slug
                })
              }
            >
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="service-hero-cta-primary">
                Talk to us about {service.name}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                All services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* At a glance */}
      <section className="py-12 lg:py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Engagement model
            </p>
            <p className="text-base font-semibold text-brand-dark leading-snug">
              {service.engagementModel}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              What you get
            </p>
            <p className="text-base font-semibold text-brand-dark leading-snug">
              {deliverables.length} core deliverables — from discovery to handover.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Ideal for
            </p>
            <p className="text-base font-semibold text-brand-dark leading-snug">
              {idealFor[0]}
            </p>
          </div>
        </div>
      </section>

      {/* Key benefits */}
      <section className="py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Why this service
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark leading-tight">
              What clients get from working with us on this.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6" data-testid={`service-benefit-${idx}`}>
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white inline-flex items-center justify-center font-bold text-sm mb-4">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-2 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables + Ideal for */}
      <section className="py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Deliverables
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark leading-tight mb-6">
              What ships with every engagement
            </h2>
            <ul className="space-y-3.5">
              {deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700" data-testid="service-deliverable">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sticky top-24">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                Ideal for
              </p>
              <h3 className="text-lg font-bold text-brand-dark mb-4 leading-tight">
                Best fit if you are…
              </h3>
              <ul className="space-y-3">
                {idealFor.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="block mt-6">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Book a consultation
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Explore other services */}
      <section className="py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                Explore more
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark leading-tight">
                Other services you might need
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="mr-1.5" size={16} />
              All services
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {otherServices.map((s) => {
              const OtherIcon = iconMap[s.icon] || Compass;
              return (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all"
                  data-testid={`service-related-${s.slug}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 inline-flex items-center justify-center mb-3">
                    <OtherIcon size={18} />
                  </div>
                  <h3 className="text-base font-bold text-brand-dark mb-1 leading-tight">
                    {s.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {s.oneLiner}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-dark text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Ready to talk about {service.name.toLowerCase()}?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Share your context in a short call. If we can help, we&apos;ll say so. If we can&apos;t,
            we&apos;ll point you to who can.
          </p>
          <Link
            to="/contact"
            onClick={() =>
              analytics.consultationCtaClick({
                location: "service_footer",
                service: service.slug
              })
            }
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="service-footer-cta">
              Book a consultation
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
