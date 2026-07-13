import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "../components/ui/button";
import { services } from "../data/services";
import {
  ArrowRight,
  Compass,
  Wrench,
  Headphones,
  Video,
  ClipboardCheck,
  RefreshCw,
  Truck,
  GraduationCap
} from "lucide-react";

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

export const Services = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Services | Fidelis Logic — UAE Workplace Technology Advisory"
        description="Consulting, deployment, managed support, audits, refresh programmes, relocations, rentals, and training — the full workspace-technology services lineup delivered across the UAE."
        keywords="workplace technology services UAE, AV consulting Dubai, meeting room deployment, managed AV support"
      />
      <Breadcrumbs
        items={[{ name: "Services" }]}
        className="pt-24"
      />

      {/* Hero */}
      <section className="pt-6 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-white to-blue-50/60">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-[0.14em] mb-4">
            Services
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark leading-[1.05] tracking-tight mb-6" data-testid="services-hero-title">
            The full lifecycle of workspace technology, under one accountable partner.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            From the first advisory conversation to day-90 adoption reviews, Fidelis Logic
            covers every stage that turns a technology idea into a working workplace.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Compass;
              return (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="group bg-white border border-gray-200 rounded-2xl p-7 hover:border-blue-300 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  data-testid={`services-card-${service.slug}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 inline-flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-lg font-bold text-brand-dark mb-2 leading-tight">
                    {service.name}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    {service.oneLiner}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                    Learn more
                    <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Not sure which service you need?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            A 30-minute call is usually enough to point you at the right starting service —
            or to tell you honestly that you don't need us yet.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Book a 30-minute call
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
