import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";
import { StructuredData, breadcrumbSchema } from "../components/StructuredData";
import { seoConfig } from "../data/seoConfig";
import { blogPosts as staticBlogPosts } from "../data/mock";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/blog/posts`);
        // Combine API posts with static posts, API posts first
        const apiPosts = response.data.map(post => ({
          ...post,
          image: post.featured_image || "https://images.unsplash.com/photo-1497366216548-37526070297c"
        }));
        // Only use static posts if no API posts exist
        setPosts(apiPosts.length > 0 ? apiPosts : staticBlogPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        // Fallback to static posts on error
        setPosts(staticBlogPosts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const breadcrumbs = [
    { name: "Home", url: typeof window !== "undefined" ? `${window.location.origin}/` : "" },
    { name: "Blog", url: typeof window !== "undefined" ? window.location.href : "" }
  ];

  const categories = ["All", "Meeting Rooms", "Workspace Technology", "Business Applications", "Industry Insights", "Case Studies", "Product Reviews"];

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <SEO
        title={seoConfig.blog.title}
        description={seoConfig.blog.description}
        keywords={seoConfig.blog.keywords}
      />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Insights & Guidance
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Practical knowledge on modern workplace technology, vendor selection, and implementation best practices.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No posts found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                    <CardContent className="p-0">
                      <img
                        src={post.image || post.featured_image || "https://images.unsplash.com/photo-1497366216548-37526070297c"}
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                        <div className="flex items-center text-blue-600 font-medium text-sm">
                          Read More <ArrowRight className="ml-2" size={16} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Subscribe to our newsletter for insights on modern workplace technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
