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
  "description": "UAE-based IT consulting firm specializing in modern workplace technology solutions",
  "url": typeof window !== "undefined" ? window.location.origin : "",
  "logo": typeof window !== "undefined" ? `${window.location.origin}/logo-color.png` : "",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Sharjah Media City Free Zone",
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
export const blogPostSchema = (post) => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "headline": post.seo_title || post.title || "",
    "description": post.seo_description || post.excerpt || "",
    "image": post.featured_image || post.image || "",
    "datePublished": post.date || "",
    "dateModified": post.updated_at || post.date || "",
    "author": {
      "@type": "Person",
      "name": post.author || "Fidelis Logic"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fidelis Logic LLC",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo-color.png`
      }
    },
    "keywords": post.seo_keywords || (post.tags ? post.tags.join(", ") : post.category) || "",
    "articleSection": post.category || "",
    "inLanguage": "en-US"
  };
};

// Article Schema for enhanced AI discovery
export const articleSchema = (post) => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.seo_title || post.title || "",
    "alternativeHeadline": post.excerpt || "",
    "image": post.featured_image || post.image || "",
    "author": {
      "@type": "Organization",
      "name": "Fidelis Logic LLC",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fidelis Logic LLC"
    },
    "datePublished": post.date || "",
    "dateModified": post.updated_at || post.date || "",
    "description": post.seo_description || post.excerpt || "",
    "keywords": post.seo_keywords || (post.tags ? post.tags.join(", ") : post.category) || "",
    "mainEntityOfPage": currentUrl
  };
};

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
