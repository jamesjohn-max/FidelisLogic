import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";
import { StructuredData, breadcrumbSchema, serviceSchema } from "../components/StructuredData";
import { seoConfig } from "../data/seoConfig";
import { meetingRoomDetails } from "../data/mock";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const MeetingRooms = () => {
  const { hero, useCases, capabilities } = meetingRoomDetails;

  const breadcrumbs = [
    { name: "Home", url: typeof window !== "undefined" ? `${window.location.origin}/` : "" },
    { name: "Solutions", url: typeof window !== "undefined" ? `${window.location.origin}/solutions` : "" },
    { name: "Meeting Rooms & AV", url: typeof window !== "undefined" ? window.location.href : "" }
  ];

  const service = serviceSchema(
    "Meeting Rooms & AV Systems",
    "Expert consultation for Microsoft Teams Rooms, Zoom Rooms, and BYOD meeting spaces. Professional AV system design, installation, and commissioning."
  );

  return (
    <div className="min-h-screen">
      <SEO
        title={seoConfig.meetingRooms.title}
        description={seoConfig.meetingRooms.description}
        keywords={seoConfig.meetingRooms.keywords}
        ogImage={hero.image}
      />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <StructuredData data={service} />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
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
                  Book Free Meeting Room Consultation
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src={hero.image}
                alt="Meeting room technology"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meeting Room Types</h2>
            <p className="text-xl text-gray-600">
              Tailored solutions for every collaboration scenario
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => {
              const IconComponent = LucideIcons[useCase.icon];
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{useCase.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Capabilities</h2>
            <p className="text-xl text-gray-600">
              End-to-end meeting room consultation and delivery
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => (
              <div key={index} className="flex items-start space-x-4">
                <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-lg text-gray-700">{capability}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Expertise
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We work across leading OEMs and distributors in the UAE. Solutions delivered based on project fit, availability, and support ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Microsoft Teams Rooms</h3>
                <p className="text-gray-600">
                  Certified MTR design and deployment for seamless Microsoft 365 integration.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Zoom Rooms</h3>
                <p className="text-gray-600">
                  Expert implementation of Zoom's native room systems and appliances.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">BYOD Solutions</h3>
                <p className="text-gray-600">
                  Platform-agnostic rooms supporting laptops, wireless presentation, and any UC client.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Meeting Spaces?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Schedule a free consultation to discuss your meeting room requirements.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Book Free Consultation
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            {/*<Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Request Site Survey
            </Button> */}
          </div>
        </div>
      </section>
    </div>
  );
};
