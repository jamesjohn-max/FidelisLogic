import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Loader2, HelpCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { SEO } from "../components/SEO";
import { StructuredData, organizationSchema, breadcrumbSchema } from "../components/StructuredData";
import { FAQSchema, consultingFAQs } from "../components/FAQSchema";
import { TrustedBrands } from "../components/TrustedBrands";
import { HeroCarousel } from "../components/HeroCarousel";
import { analytics } from "../lib/analytics";
import { seoConfig } from "../data/seoConfig";
import {
  heroData,
  segments,
  stats,
  howWeHelp,
  whyChooseUs,
  whyChooseUsAdvantages,
  roomTypes,
  partners,
  testimonials
} from "../data/siteContent";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Home = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/blog/posts`);
        const apiPosts = response.data.map(post => ({
          ...post,
          image: post.featured_image || post.image || "https://images.unsplash.com/photo-1497366216548-37526070297c"
        }));
        setBlogPosts(apiPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPosts([]);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  const breadcrumbs = [
    { name: "Home", url: typeof window !== "undefined" ? window.location.origin : "" }
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={seoConfig.home.title}
        description={seoConfig.home.description}
        keywords={seoConfig.home.keywords}
        ogImage="https://images.unsplash.com/photo-1762176263996-a0713a49ee4d"
      />
      <StructuredData data={organizationSchema} />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <FAQSchema faqs={consultingFAQs} />
      {/* Hero Section — full-bleed image background with overlay */}
      <section className="relative min-h-[500px] lg:min-h-[540px] flex items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background carousel */}
        <HeroCarousel images={heroData.images} testId="home-hero-carousel" />
        {/* Multi-stop gradient overlay for premium feel + text legibility */}
        {/*<div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-brand-dark/40 lg:from-brand-dark/95 lg:via-brand-dark/65 lg:to-brand-dark/10" /> */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/50 to-black/10 lg:from-black/82 lg:via-black/42 lg:to-black/0" />
        {/* Subtle bottom fade so it doesn't compete with the stats section */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-b from-transparent to-white/95" />

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          {/*  <div className="max-w-2xl space-y-7" data-testid="home-hero-content"> */}
            <div className="max-w-2xl space-y-7 bg-slate-950/40 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.45)]" data-testid="home-hero-content">
            
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-[0.12em] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-fidelis-cyan" aria-hidden="true" />
              UAE Workplace Technology Advisory
            </span>
            
           {/* <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight" data-testid="home-hero-title"> */}
           <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.08] tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)]" data-testid="home-hero-title">
              {heroData.title}
            </h1>
            {/* <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-xl"> */}
              <p className="text-lg sm:text-xl text-gray-100 leading-relaxed max-w-xl drop-shadow-[0_3px_14px_rgba(0,0,0,0.7)]">
              {heroData.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/contact"
                onClick={() =>
                  analytics.consultationCtaClick({ location: "home_hero" })
                }
              >
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30 rounded-xl px-7">
                  {heroData.ctaPrimary}
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/solutions">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/8 border-white/35 text-white hover:bg-white/15 hover:text-white backdrop-blur-sm rounded-xl px-7"
                >
                  {heroData.ctaSecondary}
                </Button>
              </Link>
              
            </div>
            
          </div>
          
        </div>
      </section>

   

      {/* Trusted Brands / Strategic Partnerships — placed directly under the
          hero so the partner strip is visible above the fold. 
          
          
          
          */}
      <TrustedBrands
        title="Trusted by our customers, delivered through curated partnerships."
        subtitle="A deliberately short list of platforms — across meeting rooms, headsets, and workspace experience."
        variant="compact"
        background="white"
        density="tight"
        testIdPrefix="home-trusted-brands"
      />

      {/* Stats Section */}
      {/*  <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-fidelis-blue">{stat.number}</div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* What We Do Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The modern workplace technology market is complex and overwhelming. We simplify your decisions with structured consulting and vendor-neutral guidance.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {segments.map((segment) => {
              const IconComponent = LucideIcons[segment.icon];
              return (
                <Link key={segment.id} to={segment.link}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <img
                          src={segment.image}
                          alt={segment.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="text-blue-600" size={24} />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {segment.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {segment.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Help</h2>
            <p className="text-xl text-gray-600">
              A structured approach from assessment to ongoing support
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howWeHelp.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-blue-100 mb-4">{step.step}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600">
              We deliver outcomes, not just implementations
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const IconComponent = LucideIcons[item.icon];
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* Removed as per client request */}

      {/* Featured Blog Posts Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest Insights</h2>
              <p className="text-xl text-gray-600">
                Industry knowledge and practical guidance
              </p>
            </div>
            <Link to="/blog">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                View All Posts
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
          {isLoadingPosts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                    <CardContent className="p-0">
                      <img
                        src={post.featured_image || post.image || "https://images.unsplash.com/photo-1497366216548-37526070297c"}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {typeof post.date === 'string' && post.date.includes('-') 
                              ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                              : post.date
                            }
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{post.excerpt}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
              <HelpCircle className="text-blue-600" size={32} />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about our IT consulting services
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {consultingFAQs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg mb-4 px-6">
                <AccordionTrigger className="text-left text-lg font-medium text-gray-900 hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link to="/contact">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Contact Us
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Simplify Your Technology Decisions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Book a free consultation to discuss your modern workplace technology needs.
          </p>
          <Link
            to="/contact"
            onClick={() =>
              analytics.consultationCtaClick({ location: "home_footer" })
            }
          >
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
