import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";
import { StructuredData, breadcrumbSchema, blogPostSchema } from "../components/StructuredData";
import { ArrowLeft, Calendar, Tag, Loader2 } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch all posts and find the one matching the slug
        const response = await axios.get(`${BACKEND_URL}/api/blog/posts`);
        const allPosts = response.data;
        const foundPost = allPosts.find((p) => p.slug === slug);
        
        if (foundPost) {
          setPost(foundPost);
          // Get related posts (same category, different post)
          const related = allPosts
            .filter((p) => p.category === foundPost.category && p.id !== foundPost.id)
            .slice(0, 3);
          setRelatedPosts(related);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (error || !post) {
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get the featured image
  const featuredImage = post.featured_image || post.image || "https://images.unsplash.com/photo-1497366216548-37526070297c";

  return (
    <div className="min-h-screen">
      <SEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt}
        keywords={post.seo_keywords || `${post.category}, workplace technology, IT consulting`}
        ogType="article"
        ogImage={featuredImage}
        article={true}
        publishedDate={post.date}
      />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <StructuredData data={blogPostSchema({
        ...post,
        image: featuredImage
      })} />

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
              {formatDate(post.date)}
            </span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
          {post.author && (
            <p className="text-sm text-gray-500 mt-4">By {post.author}</p>
          )}
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-5xl mx-auto">
          <img
            src={featuredImage}
            alt={post.title}
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Article Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Render HTML content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

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
                      src={relatedPost.featured_image || relatedPost.image || "https://images.unsplash.com/photo-1497366216548-37526070297c"}
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
