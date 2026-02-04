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
    "telephone": "+971-X-XXXX-XXXX",
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

// Blog Post Schema
export const blogPostSchema = (post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt,
  "image": post.image,
  "datePublished": post.date,
  "dateModified": post.date,
  "author": {
    "@type": "Organization",
    "name": "Fidelis Logic LLC"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Fidelis Logic LLC",
    "logo": {
      "@type": "ImageObject",
      "url": typeof window !== "undefined" ? `${window.location.origin}/logo-color.png` : ""
    }
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
