import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";
import { StructuredData, breadcrumbSchema, serviceSchema } from "../components/StructuredData";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FAQSection } from "../components/FAQSection";
import { FAQSchema, headsetsFAQs } from "../components/FAQSchema";
import { SolutionBrands } from "../components/SolutionBrands";
import { seoConfig } from "../data/seoConfig";
import { headsetDetails } from "../data/siteContent";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const Headsets = () => {
  const { hero, personas, whatWeSolve } = headsetDetails;

  const breadcrumbs = [
    { name: "Home", url: typeof window !== "undefined" ? `${window.location.origin}/` : "" },
    { name: "Solutions", url: typeof window !== "undefined" ? `${window.location.origin}/solutions` : "" },
    { name: "Enterprise Headsets", url: typeof window !== "undefined" ? window.location.href : "" }
  ];

  const service = serviceSchema(
    "Enterprise Headsets & Collaboration Devices",
    "Standardize communication devices across your organization. Expert guidance on enterprise headsets for call centers, hybrid workers, and executives."
  );

  return (
    <div className="min-h-screen">
      <SEO
        title={seoConfig.headsets.title}
        description={seoConfig.headsets.description}
        keywords={seoConfig.headsets.keywords}
        ogImage={hero.image}
      />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <StructuredData data={service} />
      <FAQSchema faqs={headsetsFAQs} />
      <Breadcrumbs
        items={[
          { name: "Solutions", href: "/solutions" },
          { name: "Enterprise Headsets" }
        ]}
        className="pt-24"
      />
      {/* Hero Section */}
      <section className="pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                {hero.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {hero.subtitle}
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Request Headset Recommendation
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src={hero.image}
                alt="Enterprise headsets"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Personas Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Solutions for Every User</h2>
            <p className="text-xl text-gray-600">
              Different roles have different needs—we help you match devices to personas
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {personas.map((persona, index) => {
              const IconComponent = LucideIcons[persona.icon];
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {persona.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{persona.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Solve Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Solve</h2>
            <p className="text-xl text-gray-600">
              Common challenges in enterprise headset deployments
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {whatWeSolve.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-lg text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Approach</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-blue-100 mb-4">01</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Assess User Needs</h3>
                <p className="text-gray-600">
                  Survey your teams to understand work patterns, UC platform usage, and comfort preferences.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-blue-100 mb-4">02</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Recommend Shortlist</h3>
                <p className="text-gray-600">
                  Provide 2-3 vendor-neutral options per persona with clear rationale and pricing.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-blue-100 mb-4">03</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Deploy & Support</h3>
                <p className="text-gray-600">
                  Coordinate procurement, provisioning, user training, and ongoing fleet management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Ecosystem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Brand & Platform Ecosystem
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            We work across leading collaboration device OEMs available in the UAE—including Poly, Jabra, Logitech, and others—recommending based on your UC platform, budget, and user requirements.
          </p>
        </div>
      </section>

      {/* Brand Ecosystem */}
      <SolutionBrands
        solutionSlug="headsets"
        title="Headset brands we standardize on"
        subtitle="Persona-fit recommendations backed by fleet-management tooling — so comfort, certification, and IT operations are all addressed."
      />

      {/* FAQ Section */}
      <FAQSection
        faqs={headsetsFAQs}
        subtitle="Answers to common questions about standardizing enterprise communication devices."
        testIdPrefix="headsets-faq"
      />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Need Help Choosing the Right Headsets?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Schedule a free consultation to discuss your collaboration device needs.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Headset Recommendation
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
