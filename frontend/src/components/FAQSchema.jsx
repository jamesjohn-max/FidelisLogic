import { Helmet } from "react-helmet-async";

// FAQ Schema component - emits FAQPage JSON-LD for indexing.
// Uses both Helmet (for head placement) AND an inline <script> tag so the
// schema reliably lands in the DOM. Googlebot parses JSON-LD from anywhere
// in the document, so the inline body script is a valid fallback if Helmet
// is filtered by the environment.
export const FAQSchema = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

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
  const jsonString = JSON.stringify(schema);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{jsonString}</script>
      </Helmet>
      <script
        type="application/ld+json"
        data-testid="faq-jsonld"
        dangerouslySetInnerHTML={{ __html: jsonString }}
      />
    </>
  );
};

// Common FAQs for IT Consulting (used on Home page)
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
    question: "Can you work with our existing reseller or system integrator?",
    answer: "Yes. We help you define the right solution based on your business needs, then work alongside your preferred vendor to support deployment. You benefit from expert guidance without disrupting your existing supplier relationships."
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

// Meeting Rooms FAQs
export const meetingRoomsFAQs = [
  {
    question: "What's the difference between Microsoft Teams Rooms and Zoom Rooms?",
    answer: "Microsoft Teams Rooms are optimized for Microsoft 365 integration with native Teams functionality, calendar sync, and Teams Admin Center management. Zoom Rooms offer similar capabilities for Zoom-centric environments with Zoom Whiteboard and flexible controller options. We help you choose based on your existing UC platform, licensing, and collaboration workflows."
  },
  {
    question: "Can you design meeting rooms that work with multiple video platforms?",
    answer: "Yes. BYOD (Bring Your Own Device) and BYOM (Bring Your Own Meeting) rooms support any video conferencing platform via USB or wireless connection, offering maximum flexibility for organizations using multiple UC platforms such as Teams, Zoom, Webex, and Google Meet."
  },
  {
    question: "What's included in meeting room commissioning?",
    answer: "Commissioning includes acoustic testing and treatment, camera angle verification and framing, audio DSP tuning, network quality-of-service checks, end-to-end test calls, user walkthroughs, and one-page quick-start documentation left in every room."
  },
  {
    question: "Which room sizes do you typically design for?",
    answer: "We design for huddle spaces (4-6 people), standard meeting rooms (8-12 people), boardrooms, training rooms, auditoriums, townhall spaces, and focus/phone booths. Each size has a distinct AV design pattern — single USB bar for huddle, ceiling microphone arrays and dual cameras for boardrooms."
  },
  {
    question: "How long does a typical meeting room rollout take?",
    answer: "A single room can be designed, procured, installed, and commissioned in 3-6 weeks. Multi-room rollouts (20+ rooms) are typically phased over 3-6 months, with a pilot room validated before wider deployment."
  },
  {
    question: "Do you handle network and cabling work, or just AV?",
    answer: "We scope and supervise network readiness including VLANs, QoS, and PoE requirements, and coordinate structured cabling with your facilities partner. Our consulting ensures the network and AV teams are aligned before installation begins."
  }
];

// Headsets FAQs
export const headsetsFAQs = [
  {
    question: "How do you help standardize headsets across different user types?",
    answer: "We assess use cases by persona — call center agents, hybrid workers, executives, and field staff — recommend 2-3 options per category with clear rationale, and coordinate procurement, fleet provisioning, and ongoing management through tools like Jabra Xpress or Poly Lens."
  },
  {
    question: "Are enterprise headsets compatible with Microsoft Teams and Zoom?",
    answer: "Most enterprise-grade headsets from Jabra, Poly, EPOS, Sennheiser, and Logitech are certified for both Microsoft Teams and Zoom. Certification guarantees acoustic echo cancellation, proper sidetone, and reliable firmware updates on your UC platform."
  },
  {
    question: "What's the difference between DECT, Bluetooth, and wired headsets?",
    answer: "DECT headsets offer the best wireless range and audio quality for desk-bound workers. Bluetooth models suit hybrid workers needing multi-device pairing with laptops and phones. Wired USB models are the most reliable for call center environments where uptime is critical."
  },
  {
    question: "How do you handle headset fleet management at scale?",
    answer: "Fleet management platforms like Jabra Xpress, Poly Lens, and Logitech Sync allow IT teams to push firmware updates remotely, monitor utilization, track inventory, and proactively replace failing devices — essential once you cross a few hundred headsets."
  },
  {
    question: "Can you help with bulk procurement and asset tagging?",
    answer: "Yes. We coordinate bulk ordering through your preferred reseller, asset tagging for IT records, pre-pairing for specific users, and structured rollout logistics to minimize disruption during deployment."
  }
];

// Workspace Experience FAQs
export const workspaceFAQs = [
  {
    question: "What are the benefits of a room booking system?",
    answer: "Room booking systems reduce no-shows, eliminate ghost meetings, provide real-time availability at room entrances via panel displays, and deliver analytics for optimizing office space utilization and real estate costs. Most customers report 20-35% reduction in wasted floor space within six months."
  },
  {
    question: "Can workspace experience platforms integrate with our existing systems?",
    answer: "Yes. Platforms like ROOMZ, Flowscape, Condeco, and Morbit integrate with Microsoft 365, Google Workspace, Exchange calendaring, door access control systems, visitor management, and workplace management tools via REST APIs and native connectors."
  },
  {
    question: "How does hot desking work in practice?",
    answer: "Employees reserve desks in advance through a mobile app or on arrival via QR code. Desk sensors confirm occupancy, analytics show utilization patterns, and facilities teams use the data to right-size the office footprint for hybrid work."
  },
  {
    question: "Do these systems support visitor management and compliance?",
    answer: "Yes. Modern visitor management includes pre-registration, digital check-in kiosks, badge printing, automated host notifications, NDA capture, and audit logs that satisfy compliance requirements for regulated industries."
  },
  {
    question: "Can we start with just one feature like room booking and add more later?",
    answer: "Absolutely. Most platforms are modular — you can start with room booking, add desk reservation, visitor management, analytics, and wayfinding over time without replacing the core platform."
  }
];

// Business Applications FAQs
export const businessAppsFAQs = [
  {
    question: "How long does ERP implementation take for SMBs?",
    answer: "Typical SMB ERP implementations range from 2-6 months depending on complexity, customization requirements, and data migration scope. A realistic phased plan includes 3 weeks of discovery, 5 weeks of configuration, 4 weeks of user acceptance testing and training, then go-live with hypercare."
  },
  {
    question: "Do you provide training for business applications?",
    answer: "Yes. Comprehensive user training and change management are core to our implementation approach. We run role-based training cohorts, create job-aid documentation, and offer floor-walker support during the first weeks of go-live to ensure adoption."
  },
  {
    question: "Which ERP, HRMS, and CRM platforms do you support?",
    answer: "We take a vendor-neutral approach. We help evaluate and implement platforms such as Microsoft Dynamics 365, Odoo, SAP Business One, Zoho, Salesforce, HubSpot, and regional HRMS solutions — recommending the best fit for your size, budget, and existing tech stack."
  },
  {
    question: "How do you handle data migration from our legacy systems?",
    answer: "Data migration is treated as a distinct workstream. We audit source data quality, define mapping rules, run multiple migration rehearsals against the staging environment, and reconcile records post-migration before go-live."
  },
  {
    question: "What happens after go-live?",
    answer: "We provide hypercare for the first 30-60 days with rapid issue resolution, then transition to managed support for continuous optimization — adding modules, refining workflows, and scaling as your business grows."
  }
];
