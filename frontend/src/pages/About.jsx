import { Card, CardContent } from "../components/ui/card";
import { SEO } from "../components/SEO";
import { StructuredData, organizationSchema, breadcrumbSchema } from "../components/StructuredData";
import { seoConfig } from "../data/seoConfig";

export const About = () => {
  const breadcrumbs = [
    { name: "Home", url: typeof window !== "undefined" ? `${window.location.origin}/` : "" },
    { name: "About", url: typeof window !== "undefined" ? window.location.href : "" }
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={seoConfig.about.title}
        description={seoConfig.about.description}
        keywords={seoConfig.about.keywords}
      />
      <StructuredData data={organizationSchema} />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Us
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We reduce complexity in modern workplace technology decisions—helping UAE organizations choose, implement, and optimize the right solutions with confidence.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1642957323739-5632d8a2ff3d"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 text-center">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                The modern workplace technology market is overwhelming. Vendors promote overlapping products with confusing feature sets, leaving organizations unsure what to buy and how to integrate it.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We bridge the gap between business needs and technology solutions. Through structured consulting, vendor-neutral guidance, and expert implementation, we help you make informed decisions and deliver measurable outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              Founded in the UAE, we recognized that organizations were making costly mistakes in workplace technology investments—not because of poor execution, but because of unclear requirements and vendor noise.
            </p>
            <p>
              Our consultative approach starts with understanding your business objectives, assessing your current environment, and designing solutions tailored to your needs. We then implement using the best-fit vendors available in the regional ecosystem—not based on partnerships, but on what actually works for you.
            </p>
            <p>
              Today, we serve organizations across the UAE—from SMBs implementing their first ERP system to enterprises deploying Microsoft Teams Rooms at scale. Our focus remains the same: clarity, reliability, and measurable results.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              Principles that guide how we work
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Clarity</h3>
                <p className="text-gray-600">
                  We simplify complex technology decisions with clear frameworks and honest guidance.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Reliability</h3>
                <p className="text-gray-600">
                  We deliver on commitments with structured project management and quality assurance.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Partnership</h3>
                <p className="text-gray-600">
                  We act as an extension of your team—aligned with your success, not vendor quotas.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Long-Term Support</h3>
                <p className="text-gray-600">
                  We stay beyond go-live to ensure your investment continues delivering value.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Certifications & Partner Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work across leading OEMs and distributors in the UAE. Solutions delivered based on project fit, availability, and support ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Microsoft Ecosystem</h3>
                <p className="text-gray-600 mt-2">Teams Rooms, Microsoft 365, Azure</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Collaboration Platforms</h3>
                <p className="text-gray-600 mt-2">Zoom, Webex, Google Workspace</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900">AV & Devices</h3>
                <p className="text-gray-600 mt-2">Poly, Logitech, Neat, Yealink, Jabra, Lenovo, Crestron etc.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    {/* Hiding it for now  
       Team Section 
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600">
              Experienced professionals with deep regional expertise
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Team Member {i}</h3>
                  <p className="text-gray-600 mb-2">Position Title</p>
                  <p className="text-sm text-gray-500">
                    Brief bio highlighting expertise and experience in workplace technology consulting.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
};
