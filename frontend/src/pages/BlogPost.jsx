import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";
import { StructuredData, breadcrumbSchema, blogPostSchema } from "../components/StructuredData";
import { blogPosts } from "../data/mock";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

export const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { name: "Home", url: typeof window !== "undefined" ? `${window.location.origin}/` : "" },
    { name: "Blog", url: typeof window !== "undefined" ? `${window.location.origin}/blog` : "" },
    { name: post.title, url: typeof window !== "undefined" ? window.location.href : "" }
  ];

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={`${post.category}, workplace technology, IT consulting`}
        ogType="article"
        ogImage={post.image}
        article={true}
        publishedDate={post.date}
      />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <StructuredData data={blogPostSchema(post)} />
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog">
            <Button variant="outline" className="mb-8 border-gray-300 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="mr-2" size={18} />
              Back to Blog
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full flex items-center">
              <Tag className="mr-2" size={16} />
              {post.category}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <Calendar className="mr-2" size={16} />
              {post.date}
            </span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-5xl mx-auto">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Article Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              This is a placeholder article. In a production environment, this would contain the full article content with proper formatting, images, and structured sections.
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Modern workplace technology decisions are complex. Organizations face an overwhelming number of vendors, products, and implementation approaches. This article explores key considerations and best practices.
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Key Considerations</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              When evaluating workplace technology solutions, several factors should guide your decision-making process. These include functional requirements, integration complexity, total cost of ownership, and vendor support in your region.
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Implementation Best Practices</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Successful implementations require structured project management, clear stakeholder communication, comprehensive user training, and post-deployment support. Vendor-neutral consulting helps navigate these complexities.
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The right technology partner helps you cut through market noise and deliver outcomes aligned with your business objectives. Contact us to discuss your specific requirements.
            </p>
          </div>

          {/* CTA Box */}
          <div className="bg-blue-50 rounded-2xl p-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Expert Guidance?
            </h3>
            <p className="text-gray-700 mb-6">
              Schedule a free consultation to discuss your modern workplace technology needs.
            </p>
            <Link to="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Book Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600">{relatedPost.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
