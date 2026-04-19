import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";
import { StructuredData, breadcrumbSchema } from "../components/StructuredData";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { seoConfig } from "../data/seoConfig";
import { segments } from "../data/siteContent";
import { ArrowRight } from "lucide-react";

export const Solutions = () => {
  const breadcrumbs = [
    { name: "Home", url: typeof window !== "undefined" ? `${window.location.origin}/` : "" },
    { name: "Solutions", url: typeof window !== "undefined" ? window.location.href : "" }
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={seoConfig.solutions.title}
        description={seoConfig.solutions.description}
        keywords={seoConfig.solutions.keywords}
      />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <Breadcrumbs items={[{ name: "Solutions" }]} className="pt-24" />
      {/* Hero Section */}
      <section className="pt-8 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Modern Workplace Solutions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The technology market is crowded with overlapping products and confusing messaging. We help you cut through the noise with vendor-neutral consulting, structured solution design, and expert implementation.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {segments.map((segment) => {
              const IconComponent = LucideIcons[segment.icon];
              return (
                <Card key={segment.id} className="border-0 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-0">
                    <img
                      src={segment.image}
                      alt={segment.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-8">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                        <IconComponent className="text-blue-600" size={28} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {segment.title}
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {segment.description}
                      </p>
                      <Link to={segment.link}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          Learn More
                          <ArrowRight className="ml-2" size={18} />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Bridge Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why You Need a Bridge Between You and Vendors
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">The Problem</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Too many overlapping products with similar claims</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Vendor messaging focused on features, not outcomes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>No clear comparison framework for decision-making</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Integration complexity not addressed until too late</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Approach</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Vendor-neutral guidance aligned with your objectives</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Structured assessment and solution architecture</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Clear recommendations with rationale and trade-offs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Implementation using best-fit vendors in UAE ecosystem</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Not Sure Where to Start?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Book a free consultation to discuss your requirements and explore the best approach.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Schedule Discovery Call
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
