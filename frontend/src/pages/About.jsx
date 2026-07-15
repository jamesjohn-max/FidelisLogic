import { Card, CardContent } from "../components/ui/card";
import { SEO } from "../components/SEO";
import { StructuredData, organizationSchema, breadcrumbSchema } from "../components/StructuredData";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { TrustedBrands } from "../components/TrustedBrands";
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
      <Breadcrumbs items={[{ name: "About" }]} className="pt-24" />
      {/* Hero Section */}
      <section className="pt-8 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Us
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We reduce complexity in modern workplace technology decisions—helping UAE organizations choose, implement, and optimize the right solutions with confidence through their trusted technolog partners.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="\aboutus.png"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 text-center">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We help organizations cut through the complexity of workplace technology by providing structured consulting, vendor-neutral guidance, and expert delivery support.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                The result is confident technology decisions and successful implementation through trusted resellers or system integrators.
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
              Trusted Partner Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work with leading OEMs and distributors in the UAE, supporting solutions that are chosen based on customer requirements, project fit, availability, and delivery readiness.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
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
             <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Workspace Experience</h3>
                <p className="text-gray-600 mt-2">ROOMZ, Morbit.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Ecosystem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" data-testid="about-partner-ecosystem-section">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 mb-14">
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                Partner Ecosystem
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-6 leading-tight">
                A curated ecosystem — not a vendor catalog.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Fidelis Logic is a UAE-based advisory and delivery partner with a
                deliberately short list of strategic brand partners. Each one earns its
                place because it solves a specific problem better than the alternatives.
              </p>
              <p className="text-gray-600 leading-relaxed">
                That discipline lets us stay honest with customers. If none of our partners
                is the right fit for your problem, we'll tell you — and help you find the
                one that is.
              </p>
            </div>
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Strategic, not transactional",
                  body: "We co-invest in relationships with vendors whose roadmaps align with our customers' futures — not whoever has the biggest margin this quarter."
                },
                {
                  title: "Authorized and accountable",
                  body: "We are authorized deployment partners for the brands we represent, with certifications, direct vendor support escalation, and lifecycle ownership."
                },
                {
                  title: "Vendor-neutral recommendations",
                  body: "Our advisory layer is not locked to any single brand. Recommendations are driven by your business case, not a quota sheet."
                },
                {
                  title: "Work through your channels",
                  body: "We integrate with your preferred resellers and system integrators — or deliver directly. Either way, the buck stops with us."
                }
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6"
                  data-testid={`about-ecosystem-pillar-${item.title.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                >
                  <h3 className="text-base font-semibold text-brand-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed brand grid */}
      <TrustedBrands
        title="Meet the brands behind our deliveries."
        subtitle="Each partner is chosen for a specific role in the modern workplace stack — from room booking and device management to headsets and video collaboration."
        variant="detailed"
        background="gray"
        testIdPrefix="about-brand-ecosystem"
      />
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
