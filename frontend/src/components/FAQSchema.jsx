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
    question: "Can small businesses get ERP, HRMS, and CRM without high license costs?",
    answer: "Yes. Fidelis Logic helps small businesses deploy low-license-cost business application platforms where the core software cost can be near zero. Customers pay for the practical services they need: configuration, hosting, migration, training, reporting, and ongoing support."
  },
  {
    question: "How low can the monthly cost be?",
    answer: "For a focused small-business scope, starter plans can begin from USD 10 per month depending on hosting, modules, support level, and implementation needs. We confirm the exact monthly plan after discovery so the cost matches the modules you actually use."
  },
  {
    question: "Do you offer cloud and on-premise ERP deployment?",
    answer: "Yes. We support cloud-hosted ERP, HRMS, and CRM for quick launch, plus on-premise deployment for businesses that need local control, custom infrastructure, or specific compliance requirements."
  },
  {
    question: "Can AI help manage ERP entries for a small business?",
    answer: "Yes. Fidelis Logic can integrate ERP platforms with paid and free AI tools so business owners can draft transactions, update customer and supplier records, classify expenses, prepare reports, and review routine ERP work with fewer administrative staff. We design guardrails so AI-assisted updates can be reviewed, approved, and audited before they affect business records."
  },
  {
    question: "How quickly can a small-business ERP implementation go live?",
    answer: "A focused small-business ERP, HRMS, or CRM first phase can be implemented in less than a week when the scope is kept lean: core setup, users, roles, essential forms, basic reports, and handover. Larger migrations, integrations, or custom workflows are planned as follow-on phases."
  },
  {
    question: "Do you provide training for business applications?",
    answer: "Yes. Comprehensive user training and change management are core to our implementation approach. We run role-based training cohorts, create job-aid documentation, and offer floor-walker support during the first weeks of go-live to ensure adoption."
  },
  {
    question: "Which ERP, HRMS, and CRM platforms do you support?",
    answer: "We take a vendor-neutral approach and prioritize platforms that fit small-business budgets. Depending on requirements, this can include open-source, low-cost, cloud-hosted, or on-premise platforms without locking you into a specific vendor."
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

export const businessAppsSeoFAQs = [
  {
    question: "What is the best low cost ERP solution for a small business in the UAE?",
    answer: "The best low cost ERP solution for a small business is usually a focused platform that starts with accounting, sales, purchasing, inventory, basic reporting, and user roles before adding advanced workflows. Fidelis Logic helps small businesses in the UAE choose, configure, and support a low cost ERP solution with monthly plans from USD 10/month."
  },
  {
    question: "Can I get an affordable ERP system without expensive software licenses?",
    answer: "Yes. A small business can use an affordable ERP system with near-zero software license cost when the right low-cost or open-source platform is selected. Fidelis Logic supports configuration, hosting, migration, training, and monthly support so the budget goes toward practical business setup instead of heavy license fees."
  },
  {
    question: "Do you provide low cost ERP implementation for small businesses?",
    answer: "Yes. Fidelis Logic provides low cost ERP implementation for small businesses that need finance, purchasing, inventory, sales, HRMS, CRM, and reporting in one connected system. A lean first phase can go live in less than a week when the scope is focused."
  },
  {
    question: "Can AI reduce the staff needed to manage ERP entries?",
    answer: "Yes. AI integration can help small-business owners draft ERP entries, classify expenses, update customer and supplier records, prepare reports, and review routine tasks with entry-level or lean staffing. Fidelis Logic designs approval controls so AI-assisted ERP updates remain reviewed and auditable."
  },
  {
    question: "Is cloud ERP or on-premise ERP better for a small business?",
    answer: "Cloud ERP is usually better when a small business wants quick setup, lower maintenance, and predictable monthly cost. On-premise ERP can be better when the business needs local control, custom infrastructure, or specific data policies. Fidelis Logic offers both cloud ERP and on-premise ERP support."
  },
  {
    question: "How can Fidelis Logic help me?",
    answer: "Fidelis Logic can help you with a low cost ERP solution UAE, affordable ERP for small business, ERP implementation in less than a week, AI ERP integration UAE, low cost HRMS, low cost CRM, cloud ERP for small business, and on-premise ERP support. Low cost does not mean compromise on quality or standards. It just means we help you cut down the costs of setting up and maintaining must-have business applications for your business so you can focus on the money-making part of the business."
  }
];
