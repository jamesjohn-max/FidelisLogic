import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";
import { StructuredData, breadcrumbSchema, serviceSchema } from "../components/StructuredData";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FAQSection } from "../components/FAQSection";
import { FAQSchema, workspaceFAQs } from "../components/FAQSchema";
import { seoConfig } from "../data/seoConfig";
import { workspaceExperienceDetails } from "../data/siteContent";
import { ArrowRight } from "lucide-react";

export const WorkspaceExperience = () => {
  const { hero, capabilities, platforms } = workspaceExperienceDetails;

  const breadcrumbs = [
    { name: "Home", url: typeof window !== "undefined" ? `${window.location.origin}/` : "" },
    { name: "Solutions", url: typeof window !== "undefined" ? `${window.location.origin}/solutions` : "" },
    { name: "Workspace Experience", url: typeof window !== "undefined" ? window.location.href : "" }
  ];

  const service = serviceSchema(
    "Room Booking & Workspace Experience Platforms",
    "Optimize office utilization with hot desking, room booking panels, visitor management, and workplace analytics platforms."
  );

  return (
    <div className="min-h-screen">
      <SEO
        title={seoConfig.workspaceExperience.title}
        description={seoConfig.workspaceExperience.description}
        keywords={seoConfig.workspaceExperience.keywords}
        ogImage={hero.image}
      />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <StructuredData data={service} />
      <FAQSchema faqs={workspaceFAQs} />
      <Breadcrumbs
        items={[
          { name: "Solutions", href: "/solutions" },
          { name: "Workspace Experience" }
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
                  Book Workplace Experience Assessment
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src={hero.image}
                alt="Modern workspace experience"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Workspace Experience Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive platforms for modern hybrid workplaces
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => {
              const IconComponent = LucideIcons[capability.icon];
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {capability.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{capability.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Common Use Cases</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Hybrid Work Enablement
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Support flexible work arrangements with hot desking, advance booking, and real-time space availability.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Book desks in advance or check-in on arrival</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Find colleagues and sit near your team</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Optimize office footprint based on usage data</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Meeting Room Optimization
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Reduce no-shows, ghost meetings, and underutilized spaces with smart booking panels.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Real-time availability at room entrance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Automatic release of no-show bookings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Usage analytics to right-size meeting space inventory</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Examples Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Leading Platforms We Partner With
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We work with leading workspace experience platforms available in the UAE, recommending based on your specific requirements, integration needs, and budget.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {platforms.map((platform, index) => (
            
           /* <div
      key={index}
      className="bg-white px-8 py-4 rounded-lg shadow-md text-gray-700 font-medium"
            >
              <a
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {platform.name}
              </a>
              </div> */

             <a
                key={index}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white px-6 py-4 rounded-lg shadow-md text-gray-700 font-medium flex items-center gap-3 hover:shadow-lg transition"
              >
                <img
                  src={platform.logo}
                  alt={`${platform.name} logo`}
                  className="h-12 w-13 object-contain"
                  loading="lazy"
                />
              
              </a> 

            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Business Benefits</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cost Savings</h3>
                <p className="text-gray-600">
                  Reduce real estate costs by optimizing space utilization based on actual occupancy data.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Employee Experience</h3>
                <p className="text-gray-600">
                  Seamless booking, wayfinding, and workplace services improve satisfaction and productivity.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data-Driven Decisions</h3>
                <p className="text-gray-600">
                  Analytics and reporting enable evidence-based workplace strategy and design.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Less Downtime</h3>
                <p className="text-gray-600">
                  Proactive monitoring detects and diagnoses problems early, so IT resolves incidents faster with fewer escalations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        faqs={workspaceFAQs}
        subtitle="Answers to common questions about room booking, hot desking, and workspace platforms."
        testIdPrefix="workspace-faq"
      />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Optimize Your Workplace?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Schedule a free workplace experience assessment to explore solutions for your office.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Book Free Assessment
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
