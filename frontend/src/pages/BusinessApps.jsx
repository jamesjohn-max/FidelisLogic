import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";
import { StructuredData, breadcrumbSchema, serviceSchema } from "../components/StructuredData";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FAQSection } from "../components/FAQSection";
import { FAQSchema, businessAppsFAQs } from "../components/FAQSchema";
import { seoConfig } from "../data/seoConfig";
import { businessAppsDetails } from "../data/siteContent";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const BusinessApps = () => {
  const { hero, painPoints, offer } = businessAppsDetails;

  const breadcrumbs = [
    { name: "Home", url: typeof window !== "undefined" ? `${window.location.origin}/` : "" },
    { name: "Solutions", url: typeof window !== "undefined" ? `${window.location.origin}/solutions` : "" },
    { name: "Business Applications", url: typeof window !== "undefined" ? window.location.href : "" }
  ];

  const service = serviceSchema(
    "Business Applications for SMBs",
    "ERP, HRMS, and CRM implementation with discovery, integration, training, and managed support for small and medium businesses."
  );

  return (
    <div className="min-h-screen">
      <SEO
        title={seoConfig.businessApps.title}
        description={seoConfig.businessApps.description}
        keywords={seoConfig.businessApps.keywords}
        ogImage={hero.image}
      />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <StructuredData data={service} />
      <FAQSchema faqs={businessAppsFAQs} />
      <Breadcrumbs
        items={[
          { name: "Solutions", href: "/solutions" },
          { name: "Business Applications" }
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
                  Book SMB Systems Discovery Call
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src={hero.image}
                alt="Business applications"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Common SMB Challenges
            </h2>
            <p className="text-xl text-gray-600">
              Pain points we help organizations overcome
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {painPoints.map((pain, index) => {
              const IconComponent = LucideIcons[pain.icon];
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {pain.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{pain.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">
              End-to-end business application consulting and support
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {offer.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-lg text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Application Categories
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">ERP Systems</h3>
                <p className="text-gray-600 mb-4">
                  Centralize financials, inventory, procurement, and operations in one system.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Accounting & Financial Management</li>
                  <li>• Inventory & Supply Chain</li>
                  <li>• Procurement & Vendor Management</li>
                  <li>• Multi-Currency & Multi-Entity</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">HRMS Platforms</h3>
                <p className="text-gray-600 mb-4">
                  Automate HR processes from recruitment to payroll and performance.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Employee Records & Self-Service</li>
                  <li>• Payroll & Benefits Administration</li>
                  <li>• Time & Attendance Tracking</li>
                  <li>• Performance & Goal Management</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">CRM Solutions</h3>
                <p className="text-gray-600 mb-4">
                  Manage customer relationships, sales pipelines, and marketing automation.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Lead & Opportunity Management</li>
                  <li>• Sales Pipeline & Forecasting</li>
                  <li>• Customer Support & Ticketing</li>
                  <li>• Marketing Automation & Campaigns</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation Approach Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Approach</h2>
            <p className="text-xl text-gray-600">
              Structured methodology for successful deployments
            </p>
          </div>
          <div className="space-y-6 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Discovery & Requirements",
                description:
                  "Workshop sessions to understand your business processes, pain points, and success criteria."
              },
              {
                step: "02",
                title: "Solution Selection",
                description:
                  "Evaluate vendors based on functional fit, total cost of ownership, and UAE support ecosystem."
              },
              {
                step: "03",
                title: "Implementation & Configuration",
                description:
                  "Deploy the solution with custom workflows, integrations, and data migration."
              },
              {
                step: "04",
                title: "Training & Change Management",
                description:
                  "User training, documentation, and support to ensure adoption across your organization."
              },
              {
                step: "05",
                title: "Managed Support",
                description:
                  "Ongoing technical support, optimization, and continuous improvement."
              }
            ].map((phase, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="text-5xl font-bold text-blue-100">{phase.step}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {phase.title}
                      </h3>
                      <p className="text-gray-600">{phase.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        faqs={businessAppsFAQs}
        subtitle="Answers to common questions about ERP, HRMS, and CRM implementation for SMBs."
        testIdPrefix="business-apps-faq"
      />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Business Operations?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Schedule a free discovery call to discuss your ERP, HRMS, or CRM needs.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Book Discovery Call
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
