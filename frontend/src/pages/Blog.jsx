import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { blogPosts } from "../data/mock";
import { ArrowRight } from "lucide-react";

export const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Modern Work", "Meeting Rooms", "Headsets", "Workspace Experience", "SMB Apps"];

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                  <CardContent className="p-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">{post.date}</span>
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
