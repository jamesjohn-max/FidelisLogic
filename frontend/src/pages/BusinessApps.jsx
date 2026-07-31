import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";
import { StructuredData, breadcrumbSchema, serviceSchema, webPageSchema } from "../components/StructuredData";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FAQSection } from "../components/FAQSection";
import { FAQSchema, businessAppsFAQs, businessAppsSeoFAQs } from "../components/FAQSchema";
import { seoConfig } from "../data/seoConfig";
import { businessAppsDetails } from "../data/siteContent";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Database,
  FileSpreadsheet,
  Puzzle,
  Server,
  ShieldCheck,
  TrendingDown
} from "lucide-react";

export const BusinessApps = () => {
  const { hero } = businessAppsDetails;

  const breadcrumbs = [
    { name: "Home", url: typeof window !== "undefined" ? `${window.location.origin}/` : "" },
    { name: "Solutions", url: typeof window !== "undefined" ? `${window.location.origin}/solutions` : "" },
    { name: "Business Applications", url: typeof window !== "undefined" ? window.location.href : "" }
  ];

  const service = serviceSchema(
    "Low-Cost ERP, HRMS, and CRM for Small Businesses",
    "Affordable ERP, HRMS, CRM, and AI ERP integration with near-zero license cost platform options, cloud or on-prem deployment, configuration support, training, and monthly payment plans."
  );

  const canonicalUrl = "https://www.fidelislogic.com/solutions/business-apps";
  const webPage = webPageSchema(
    seoConfig.businessApps.title,
    seoConfig.businessApps.description,
    canonicalUrl
  );

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Low-Cost ERP, HRMS, CRM, and AI Integration Plans for Small Businesses",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Small Business Cloud ERP, HRMS, CRM, and AI Integration",
        priceCurrency: "USD",
        price: "10",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          priceCurrency: "USD",
          price: "10",
          unitText: "MONTH"
        },
        description: "Starter monthly plan for small businesses from USD 10/month, with configuration, AI-assisted ERP integration, and support scoped after discovery."
      },
      {
        "@type": "Offer",
        name: "On-Premise ERP, HRMS, and CRM Deployment",
        description: "Self-hosted business application deployment with implementation, configuration, training, and support available on monthly payment plans."
      }
    ]
  };

  const allBusinessAppsFAQs = [...businessAppsFAQs, ...businessAppsSeoFAQs];

  return (
    <div className="min-h-screen">
      <SEO
        title={seoConfig.businessApps.title}
        description={seoConfig.businessApps.description}
        keywords={seoConfig.businessApps.keywords}
        ogImage={hero.image}
        canonicalUrl={canonicalUrl}
      />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <StructuredData data={webPage} />
      <StructuredData data={service} />
      <StructuredData data={offerCatalogSchema} />
      <FAQSchema faqs={allBusinessAppsFAQs} />
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
              <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                Small-business ERP + HRMS + CRM with AI
              </div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                {hero.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Ask for a Small Business ERP Plan
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    Compare Cloud vs On-Prem
                  </Button>
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                {[
                  ["From", "USD 10/month", "starter plan"],
                  ["License", "Almost Zero", "for eligible platforms"],
                  ["Go Live", "< 1 Week", "lean first phase"]
                ].map(([label, value, helper]) => (
                  <div key={label} className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
                    <p className="mt-1 text-sm text-gray-500">{helper}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src={hero.image}
                alt="Small business team using ERP, HRMS, CRM, and AI dashboards"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Business Software Without Enterprise License Shock
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with the modules you need today, keep your monthly spend predictable, and add depth when your operations are ready.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {valueCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{card.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI ERP Integration Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Bot className="text-white" size={28} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                AI Integration as a Core ERP Advantage
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Fidelis Logic connects ERP platforms with paid and free AI tools so small-business owners can keep records moving even with entry-level staff or no dedicated admin team. AI can assist with routine entries, updates, classifications, reminders, and reporting while approval controls keep the owner in charge.
              </p>
            </div>
            <div className="grid gap-6">
              {aiFeatures.map((feature) => (
                <Card key={feature.title} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Common Small Business Challenges
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
                  Centralize accounting, inventory, purchasing, sales orders, projects, and operations in one low-cost system.
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
                  Automate employee records, onboarding, leave, attendance, payroll workflows, and approvals.
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
                  Manage leads, opportunities, quotations, customer follow-up, service tickets, and sales reporting.
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

      {/* Deployment Options Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cloud, On-Prem, or Hybrid</h2>
            <p className="text-xl text-gray-600">
              Choose the deployment model that matches your budget, control needs, and growth plan.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {deploymentOptions.map((option, index) => {
              const bullets = option.bullets;
              return (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{option.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{option.description}</p>
                  <ul className="space-y-3">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-gray-600">
                        <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Affordable ERP, HRMS, CRM, and AI ERP Integration in the UAE
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Fidelis Logic helps small businesses move away from spreadsheets and disconnected tools into an integrated business application platform. We configure ERP for finance and operations, HRMS for people workflows, CRM for sales and customer follow-up, and AI integrations that help owners maintain ERP records with fewer manual admin hours. Cloud and on-premise deployment options are designed for lean monthly budgets, with a focused first phase that can go live in less than a week.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {seoHighlights.map((highlight) => (
              <div key={highlight} className="flex items-start space-x-4">
                <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-1" size={22} />
                <p className="text-lg text-gray-700">{highlight}</p>
              </div>
            ))}
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
                title: "Low-Cost Platform Selection",
                description:
                  "Evaluate open-source and affordable platforms based on functional fit, total cost of ownership, deployment model, and UAE support needs."
              },
              {
                step: "03",
                title: "Implementation in Less Than a Week",
                description:
                  "Launch a lean first phase with core setup, users, roles, essential forms, basic reports, and handover in less than a week when the scope is focused."
              },
              {
                step: "04",
                title: "Training & Change Management",
                description:
                  "User training, documentation, and support to ensure adoption across your organization."
              },
              {
                step: "05",
                title: "Monthly Managed Support",
                description:
                  "Ongoing support, hosting reviews, report tuning, module additions, and continuous improvement under predictable monthly plans."
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
        subtitle="Answers to common questions about low-cost ERP, HRMS, CRM, and AI integration for small businesses."
        testIdPrefix="business-apps-faq"
      />
      <FAQSection
        faqs={businessAppsSeoFAQs}
        title="Low Cost ERP Search Questions"
        subtitle="Search-focused answers for small businesses comparing affordable ERP, HRMS, CRM, cloud, on-premise, and AI ERP integration options."
        testIdPrefix="business-apps-seo-faq"
      />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start ERP, HRMS, or CRM Without Heavy License Cost?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Schedule a free discovery call to scope the right modules, deployment model, and monthly payment plan for your business.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Request a Low-Cost Business Apps Plan
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
