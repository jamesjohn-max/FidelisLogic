import { Helmet } from "react-helmet-async";

// FAQ Schema component
export const FAQSchema = ({ faqs }) => {
  const schema = {
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
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// Common FAQs for IT Consulting
export const consultingFAQs = [
  {
    question: "What services does Fidelis Logic provide?",
    answer: "Fidelis Logic specializes in modern workplace technology solutions including Meeting Rooms, enterprise headsets, workspace experience platforms (room booking, hot desking), and business applications (ERP, HRMS, CRM) for UAE organizations."
  },
  {
    question: "Do you work with specific vendors or are you vendor-neutral?",
    answer: "We are completely vendor-neutral. Our recommendations are based solely on your business needs, budget, and technical requirements - not vendor partnerships or sales quotas."
  },
  {
    question: "What areas do you serve?",
    answer: "We primarily serve organizations across the United Arab Emirates, with deep expertise in the Middle Eastern market and understanding of regional compliance and vendor ecosystems."
  },
  {
    question: "How long does a typical consultation take?",
    answer: "Initial consultations are typically 30-60 minutes. Full assessments and solution design vary based on project scope, from a few days for simple implementations to several weeks for complex enterprise deployments."
  },
  {
    question: "Do you provide ongoing support after implementation?",
    answer: "Yes, we offer lifecycle support including user training, troubleshooting, optimization, and continuous improvement to ensure your technology investment delivers long-term value."
  }
];

export const meetingRoomsFAQs = [
  {
    question: "What's the difference between Microsoft Teams Rooms and Zoom Rooms?",
    answer: "Microsoft Teams Rooms are optimized for Microsoft 365 integration with native Teams functionality. Zoom Rooms offer similar features for Zoom-centric environments. We help you choose based on your existing UC platform, licensing, and collaboration workflows."
  },
  {
    question: "Can you design meeting rooms that work with multiple platforms?",
    answer: "Yes, BYOD (Bring Your Own Device) meeting rooms support any video conferencing platform via laptop connection, offering maximum flexibility for organizations using multiple UC platforms."
  },
  {
    question: "What's included in meeting room commissioning?",
    answer: "Commissioning includes acoustic testing, camera angle verification, audio DSP tuning, network quality checks, user training, and documentation to ensure optimal performance."
  }
];

export const headsetsFAQs = [
  {
    question: "How do you help standardize headsets across different user types?",
    answer: "We assess use cases by persona (call center, hybrid workers, executives), recommend 2-3 options per category with clear rationale, and coordinate procurement, provisioning, and fleet management."
  },
  {
    question: "Are enterprise headsets compatible with Teams and Zoom?",
    answer: "Most enterprise-grade headsets are certified for both Microsoft Teams and Zoom. We ensure compatibility with your specific UC platform and provide devices with proper certifications."
  }
];

export const workspaceFAQs = [
  {
    question: "What are the benefits of room booking systems?",
    answer: "Room booking systems reduce no-shows, eliminate ghost meetings, provide real-time availability at room entrances, and deliver analytics for optimizing office space utilization and real estate costs."
  },
  {
    question: "Can workspace experience platforms integrate with our existing systems?",
    answer: "Yes, modern platforms like Flowscape and ROOMZ integrate with Microsoft 365, Google Workspace, door access systems, and workplace management tools via APIs."
  }
];

export const businessAppsFAQs = [
  {
    question: "How long does ERP implementation take for SMBs?",
    answer: "Typical SMB ERP implementations range from 2-6 months depending on complexity, customization requirements, and data migration scope. We provide realistic timelines during discovery workshops."
  },
  {
    question: "Do you provide training for business applications?",
    answer: "Yes, comprehensive user training and change management are core to our implementation approach, ensuring adoption and maximizing ROI on your software investment."
  }
];
