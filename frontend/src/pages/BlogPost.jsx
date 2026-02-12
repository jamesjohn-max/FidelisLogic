import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";
import { ArrowLeft, Calendar, Tag, User, Clock, Loader2 } from "lucide-react";
import axios from "axios";
import { Helmet } from "react-helmet-async";

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
        const response = await axios.get(BACKEND_URL + "/api/blog/posts");
        const allPosts = response.data;
        const foundPost = allPosts.find((p) => p.slug === slug);
        
        if (foundPost) {
          setPost(foundPost);
          const related = allPosts
            .filter((p) => p.category === foundPost.category && p.id !== foundPost.id)
            .slice(0, 3);
          setRelatedPosts(related);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

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

  if (error || !post) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getReadTime = (c) => {
    if (!c) return "1 min";
    const words = c.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / 200) + " min read";
  };

  const img = post.featured_image || post.image || "https://images.unsplash.com/photo-1497366216548-37526070297c";

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.seo_title || post.title,
    "description": post.seo_description || post.excerpt,
    "image": img,
    "datePublished": post.date,
    "author": { "@type": "Person", "name": post.author || "Fidelis Logic" },
    "publisher": { "@type": "Organization", "name": "Fidelis Logic LLC" },
    "mainEntityOfPage": { "@type": "WebPage" }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{post.seo_title || post.title} | Fidelis Logic</title>
        <meta name="description" content={post.seo_description || post.excerpt} />
        <meta property="og:title" content={post.seo_title || post.title} />
        <meta property="og:description" content={post.seo_description || post.excerpt} />
        <meta property="og:image" content={img} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog">
            <Button variant="outline" className="mb-8">
              <ArrowLeft className="mr-2" size={18} />
              Back to Blog
            </Button>
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full flex items-center">
              <Tag className="mr-2" size={16} />
              {post.category}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <Calendar className="mr-2" size={16} />
              {formatDate(post.date)}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="mr-2" size={16} />
              {getReadTime(post.content)}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>
          <p className="text-xl text-gray-600">{post.excerpt}</p>
          
          {post.author && (
            <div className="flex items-center mt-6 pt-6 border-t">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-5xl mx-auto">
          <img src={img} alt={post.title} className="w-full h-96 object-cover rounded-2xl shadow-2xl" />
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <article 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="bg-blue-50 rounded-2xl p-8 mt-12">
            <h3 className="text-2xl font-bold mb-4">Need Expert Guidance?</h3>
            <p className="text-gray-700 mb-6">Schedule a free consultation to discuss your needs.</p>
            <Link to="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Book Consultation</Button>
            </Link>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} to={"/blog/" + rp.slug}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all">
                    <img src={rp.featured_image || rp.image || "https://images.unsplash.com/photo-1497366216548-37526070297c"} alt={rp.title} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{rp.category}</span>
                      <h3 className="text-lg font-semibold mt-3 mb-2">{rp.title}</h3>
                      <p className="text-sm text-gray-600">{rp.excerpt}</p>
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
