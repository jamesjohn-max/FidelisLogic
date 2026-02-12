import { Helmet } from "react-helmet-async";

export const StructuredData = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Fidelis Logic LLC",
  "legalName": "Fidelis Logic LLC",
  "description": "UAE-based IT consulting firm specializing in modern workplace technology solutions including Microsoft Teams Rooms, Zoom Rooms, enterprise headsets, workspace experience platforms, and business applications.",
  "url": typeof window !== "undefined" ? window.location.origin : "",
  "logo": typeof window !== "undefined" ? `${window.location.origin}/logo-color.png` : "",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+971-52-360-7270",
    "email": "info@fidelislogic.com",
    "contactType": "customer service",
    "availableLanguage": ["en", "ar"]
  },
  "sameAs": [
    "https://linkedin.com/company/fidelis-logic",
    "https://youtube.com/@fidelislogic",
    "https://instagram.com/fidelislogic"
  ]
};

// Service Schema
export const serviceSchema = (serviceName, description) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": serviceName,
  "description": description,
  "provider": {
    "@type": "Organization",
    "name": "Fidelis Logic LLC"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United Arab Emirates"
  }
});

// Blog Post Schema - Enhanced for SEO and AI tools
export const blogPostSchema = (post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": typeof window !== "undefined" ? window.location.href : ""
  },
  "headline": post.seo_title || post.title,
  "description": post.seo_description || post.excerpt,
  "image": {
    "@type": "ImageObject",
    "url": post.featured_image || post.image,
    "width": 1200,
    "height": 630
  },
  "datePublished": post.date,
  "dateModified": post.updated_at || post.date,
  "author": {
    "@type": "Person",
    "name": post.author || "Fidelis Logic",
    "url": typeof window !== "undefined" ? window.location.origin : ""
  },
  "publisher": {
    "@type": "Organization",
    "name": "Fidelis Logic LLC",
    "logo": {
      "@type": "ImageObject",
      "url": typeof window !== "undefined" ? `${window.location.origin}/logo-color.png` : "",
      "width": 200,
      "height": 60
    }
  },
  "keywords": post.seo_keywords || post.tags?.join(", ") || post.category,
  "articleSection": post.category,
  "wordCount": post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0,
  "inLanguage": "en-US"
});

// Article Schema for enhanced AI discovery
export const articleSchema = (post) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.seo_title || post.title,
  "alternativeHeadline": post.excerpt,
  "image": post.featured_image || post.image,
  "author": {
    "@type": "Organization",
    "name": "Fidelis Logic LLC",
    "url": typeof window !== "undefined" ? window.location.origin : ""
  },
  "publisher": {
    "@type": "Organization",
    "name": "Fidelis Logic LLC"
  },
  "datePublished": post.date,
  "dateModified": post.updated_at || post.date,
  "description": post.seo_description || post.excerpt,
  "articleBody": post.content ? post.content.replace(/<[^>]*>/g, '') : "",
  "keywords": post.seo_keywords || post.tags?.join(", ") || post.category,
  "mainEntityOfPage": typeof window !== "undefined" ? window.location.href : ""
});

// WebPage Schema for better indexing
export const webPageSchema = (title, description, url) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": title,
  "description": description,
  "url": url,
  "isPartOf": {
    "@type": "WebSite",
    "name": "Fidelis Logic",
    "url": typeof window !== "undefined" ? window.location.origin : ""
  },
  "publisher": {
    "@type": "Organization",
    "name": "Fidelis Logic LLC"
  }
});

// FAQ Schema
export const faqSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Breadcrumb Schema
export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});
