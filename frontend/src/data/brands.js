// Brand ecosystem data for Fidelis Logic's curated strategic partners.
// NOTE: Copy below is placeholder; admins should refine per brand.

export const brands = [
  {
    slug: "roomz",
    name: "ROOMZ",
    tagline: "Intelligent Room Booking for Hybrid Workplaces",
    featured: true,
    priority: 1,
    category: "Workspace Experience",
    categorySlug: "workspace-experience",
    logoText: "ROOMZ",
    accentColor: "#0EA5E9",
    heroImage: "/platform-images/roomz.png",
    shortDescription:
      "Battery-powered, display-agnostic room booking panels that make hybrid offices run smoothly — no cabling, no calendar chaos.",
    longDescription:
      "ROOMZ is a Swiss-engineered workspace experience platform that combines e-paper display panels, occupancy sensors, and cloud analytics. It integrates natively with Microsoft 365, Google Workspace, and Exchange, giving facilities teams real-time visibility into room utilization while ending the daily friction of double-booked or ghost meetings.",
    keyStrengths: [
      {
        title: "Battery-Powered, Wire-Free",
        description:
          "Panels run for up to 5 years on a single battery — no cabling, no drilling, no electrician call-outs. Deploy in minutes, not weeks."
      },
      {
        title: "Calendar-Native Integration",
        description:
          "Direct sync with Microsoft 365, Google Workspace, and Exchange. No middleware, no user migrations, no IT rework."
      },
      {
        title: "Occupancy Intelligence",
        description:
          "Built-in sensors detect real utilization vs. booked time — delivering honest data to right-size your real estate footprint."
      },
      {
        title: "Enterprise-Grade Privacy",
        description:
          "No cameras, no microphones, no personal data capture. Fully GDPR-aligned and deployable in regulated environments."
      }
    ],
    products: [
      {
        name: "ROOMZ Display",
        description:
          "E-paper room booking panel with capacitive touch, mounted outside the meeting room. Reserve, extend, or release the space at a tap."
      },
      {
        name: "ROOMZ Sensor",
        description:
          "Wireless occupancy sensor that validates real-time usage and feeds accurate analytics back to the platform."
      },
      {
        name: "ROOMZ Analytics",
        description:
          "Cloud dashboard for space utilization trends, no-show patterns, and portfolio-wide optimization insights."
      }
    ],
    useCases: [
      "Meeting rooms and huddle spaces (4–20 people)",
      "Hot desk and focus booth management",
      "Multi-site corporate portfolios with hybrid occupancy",
      "Regulated industries needing privacy-first sensing"
    ],
    fidelisRole:
      "Fidelis Logic delivers ROOMZ end-to-end across UAE organizations — from space assessment and panel placement strategy to Microsoft 365 calendar integration, rollout logistics, user training, and post-go-live analytics reviews. As an authorized UAE partner, we ensure procurement, commissioning, and lifecycle support align with your IT governance.",
    proofPoints: [
      "Swiss engineering, globally deployed",
      "Native Microsoft 365 & Google Workspace integration",
      "GDPR-compliant, privacy-first design",
      "Typical deployment: 48 hours for 20 rooms"
    ],
    relatedSolutions: [
      { name: "Workspace Experience", href: "/solutions/workspace-experience" }
    ]
  },
  {
    slug: "morbit",
    name: "Morbit",
    tagline: "Workplace Monitoring & Device Management Platform",
    featured: true,
    priority: 2,
    category: "Workspace Experience",
    categorySlug: "workspace-experience",
    logoText: "morbit",
    accentColor: "#6366F1",
    heroImage: "/platform-images/morbit.png",
    shortDescription:
      "Centralized monitoring, analytics, and device management for meeting rooms and collaboration endpoints — reduce downtime, prevent incidents, increase productivity.",
    longDescription:
      "Morbit provides IT teams with a single pane of glass to monitor meeting room devices, collaboration endpoints, and workspace infrastructure in real time. Proactive alerting, utilization analytics, and automated health checks reduce help-desk tickets and keep hybrid workspaces running without surprises.",
    keyStrengths: [
      {
        title: "Unified Device Visibility",
        description:
          "Monitor Microsoft Teams Rooms, Zoom Rooms, and third-party collaboration devices from one dashboard — across every office."
      },
      {
        title: "Proactive Incident Prevention",
        description:
          "Real-time alerts on offline devices, failing cameras, audio drops, or calendar sync issues — fixed before users notice."
      },
      {
        title: "Utilization Analytics",
        description:
          "Room-level usage data, peak-hour trends, and no-show rates to optimize space planning and reduce wasted real estate."
      },
      {
        title: "IT-Friendly Integration",
        description:
          "REST APIs, SNMP, and native connectors into ITSM tools like ServiceNow and Jira. Fits your existing ops stack."
      }
    ],
    products: [
      {
        name: "Morbit Monitoring",
        description:
          "24/7 real-time monitoring of collaboration devices with automated alerts and health scoring."
      },
      {
        name: "Morbit Analytics",
        description:
          "Workspace utilization dashboards and reports for facilities and workplace strategy teams."
      },
      {
        name: "Morbit Service Desk",
        description:
          "Integrated ticketing and remote remediation for meeting room and device incidents."
      }
    ],
    useCases: [
      "Enterprise meeting room estates (50+ rooms)",
      "Multi-site AV and collaboration device fleets",
      "IT teams seeking proactive vs. reactive support models",
      "Workplace strategy and facilities data-driven decisions"
    ],
    fidelisRole:
      "Fidelis Logic deploys Morbit as part of our managed workspace services — configuring monitors, setting alert thresholds, integrating with your ITSM tooling, and training your service-desk team. For customers without an in-house ops team, we deliver Morbit as a fully managed service.",
    proofPoints: [
      "Platform-agnostic: works with any collaboration vendor",
      "UAE-based managed service option available",
      "Deep ServiceNow and Jira integration",
      "Typical payback: 3–6 months via ticket reduction"
    ],
    relatedSolutions: [
      { name: "Workspace Experience", href: "/solutions/workspace-experience" },
      { name: "Meeting Rooms & AV", href: "/solutions/meeting-rooms" }
    ]
  },
  {
    slug: "jabra",
    name: "Jabra",
    tagline: "Enterprise Audio and Video Devices for Hybrid Work",
    featured: false,
    priority: 3,
    category: "Headsets & Devices",
    categorySlug: "headsets",
    logoText: "Jabra",
    accentColor: "#E30613",
    heroImage: "https://images.unsplash.com/photo-1769069920308-40130d50ae58",
    shortDescription:
      "Market-leading enterprise headsets and intelligent video bars built for call centers, hybrid workers, and executive use.",
    longDescription:
      "Jabra — part of GN Group — is a global leader in professional audio and video collaboration. From all-day call center headsets to Microsoft Teams and Zoom certified video bars, Jabra devices combine acoustic engineering with fleet-management tooling that IT teams can actually operate at scale.",
    keyStrengths: [
      {
        title: "All-Day Comfort Engineering",
        description:
          "Industry-leading ergonomics validated across contact-center deployments — reducing fatigue on 8+ hour shifts."
      },
      {
        title: "Teams & Zoom Certification",
        description:
          "Certified acoustic echo cancellation, sidetone, and firmware reliability on every major UC platform."
      },
      {
        title: "Jabra Xpress Fleet Management",
        description:
          "Centralized firmware, policy push, and utilization analytics — essential once you cross 200+ devices."
      },
      {
        title: "Intelligent Video Bars",
        description:
          "PanaCast video bars deliver 180° field-of-view, AI framing, and noise-suppressed audio for BYOD and native room setups."
      }
    ],
    products: [
      {
        name: "Engage Series",
        description:
          "Professional contact-center headsets with noise-cancelling microphones and quick-disconnect cabling."
      },
      {
        name: "Evolve2 Series",
        description:
          "Hybrid-worker headsets with active noise cancellation and multi-device Bluetooth pairing."
      },
      {
        name: "PanaCast Video Bars",
        description:
          "AI-powered video conferencing bars for huddle rooms through to mid-size meeting spaces."
      }
    ],
    useCases: [
      "Contact center standardization at scale",
      "Hybrid workforce headset programs",
      "BYOD and Teams-native meeting rooms",
      "Executive audio and video setups"
    ],
    fidelisRole:
      "Fidelis Logic advises on Jabra device selection by persona (call center, hybrid, executive), coordinates bulk procurement through authorized UAE channels, and manages fleet onboarding via Jabra Xpress — including firmware baselining, pairing, and user training.",
    proofPoints: [
      "Authorized UAE procurement channels",
      "Persona-based standardization frameworks",
      "Teams and Zoom certified lineup",
      "Jabra Xpress fleet deployment included"
    ],
    relatedSolutions: [
      { name: "Enterprise Headsets", href: "/solutions/headsets" },
      { name: "Meeting Rooms & AV", href: "/solutions/meeting-rooms" }
    ]
  },
  {
    slug: "poly",
    name: "Poly",
    tagline: "Professional Audio, Video, and Headsets by HP",
    featured: false,
    priority: 4,
    category: "Meeting Rooms & Headsets",
    categorySlug: "meeting-rooms",
    logoText: "Poly",
    accentColor: "#00A3E0",
    heroImage: "https://images.unsplash.com/photo-1703355685722-2996b01483be",
    shortDescription:
      "Professional-grade video conferencing systems, headsets, and voice devices — trusted in enterprise meeting rooms worldwide.",
    longDescription:
      "Poly, now part of HP, brings decades of acoustic heritage (Plantronics + Polycom) into modern Microsoft Teams Rooms and Zoom Rooms solutions. The Studio video bar lineup and Voyager headset family are staples in enterprise UC deployments globally.",
    keyStrengths: [
      {
        title: "Acoustic Pedigree",
        description:
          "Plantronics audio heritage delivers unmatched microphone clarity and speaker performance in noisy environments."
      },
      {
        title: "Teams & Zoom Room Systems",
        description:
          "Studio X and Studio E video bars certified for native MTR and Zoom Rooms with DirectorAI auto-framing."
      },
      {
        title: "Poly Lens Management",
        description:
          "Cloud-based device management for firmware, policies, and insights across Poly headsets and room systems."
      },
      {
        title: "Broad Product Portfolio",
        description:
          "From desk phones to boardroom codecs — one vendor for a full collaboration device stack."
      }
    ],
    products: [
      {
        name: "Studio X Series",
        description:
          "All-in-one video bars for huddle rooms through to large meeting spaces (Studio X30, X50, X70)."
      },
      {
        name: "Voyager Series",
        description:
          "Premium Bluetooth headsets for executives and mobile professionals, Teams and Zoom certified."
      },
      {
        name: "EncorePro & Savi",
        description:
          "Wired and DECT wireless headsets for contact centers and desk-bound knowledge workers."
      }
    ],
    useCases: [
      "Microsoft Teams Rooms deployments",
      "Executive and boardroom video systems",
      "Enterprise contact-center headset programs",
      "Desk-phone to UC migration projects"
    ],
    fidelisRole:
      "Fidelis Logic delivers Poly as part of our Meeting Rooms and Headsets services — specifying the right Studio X model per room size, deploying Poly Lens for device management, and integrating with your MTR or Zoom Rooms infrastructure.",
    proofPoints: [
      "HP-backed global support",
      "Microsoft Teams and Zoom certified lineup",
      "Poly Lens centralized management",
      "UAE authorized service partner"
    ],
    relatedSolutions: [
      { name: "Meeting Rooms & AV", href: "/solutions/meeting-rooms" },
      { name: "Enterprise Headsets", href: "/solutions/headsets" }
    ]
  },
  {
    slug: "neat",
    name: "Neat",
    tagline: "Purpose-Built Video Devices for Microsoft Teams and Zoom",
    featured: false,
    priority: 5,
    category: "Meeting Rooms",
    categorySlug: "meeting-rooms",
    logoText: "Neat.",
    accentColor: "#FF5500",
    heroImage: "https://images.unsplash.com/photo-1703355685722-2996b01483be",
    shortDescription:
      "Award-winning Norwegian-designed video devices that bring cinematic meeting experiences to Microsoft Teams Rooms and Zoom Rooms.",
    longDescription:
      "Neat is the Oslo-based video device company redefining room systems with industrial design that looks at home in executive spaces. Deep co-engineering partnerships with Microsoft and Zoom deliver unique experiences like Neat Symmetry auto-framing and Neat Sense space analytics.",
    keyStrengths: [
      {
        title: "Design-Led Aesthetics",
        description:
          "Purpose-built hardware that fits modern, premium office spaces — no more industrial beige boxes."
      },
      {
        title: "Neat Symmetry",
        description:
          "Automatic intelligent framing that equalizes every participant on screen, local and remote."
      },
      {
        title: "Neat Sense Analytics",
        description:
          "Built-in environmental sensors measure humidity, CO2, air quality, and occupancy — workspace insights without extra hardware."
      },
      {
        title: "Microsoft and Zoom Co-Engineering",
        description:
          "First-class integration with native MTR and Zoom Rooms — certified from day one of major platform releases."
      }
    ],
    products: [
      {
        name: "Neat Bar Pro",
        description:
          "Premium all-in-one video bar for medium and large meeting rooms with cinema-grade camera and 6-mic array."
      },
      {
        name: "Neat Board",
        description:
          "65-inch collaborative touch display combining whiteboard, video, and digital signage."
      },
      {
        name: "Neat Pad",
        description:
          "Multi-function touch device for room booking, meeting control, and desk reservation."
      }
    ],
    useCases: [
      "Executive boardrooms and design-forward offices",
      "Microsoft Teams Rooms flagship deployments",
      "Zoom Rooms premium experiences",
      "Space analytics pilots combined with booking systems"
    ],
    fidelisRole:
      "Fidelis Logic positions Neat for customers who care about room aesthetics as much as technical performance. We handle specification, procurement, commissioning, and integration with your UC platform of choice.",
    proofPoints: [
      "Award-winning Norwegian industrial design",
      "Native Microsoft Teams and Zoom certification",
      "Neat Sense workspace analytics included",
      "Flagship executive room partner"
    ],
    relatedSolutions: [
      { name: "Meeting Rooms & AV", href: "/solutions/meeting-rooms" }
    ]
  },
  {
    slug: "yealink",
    name: "Yealink",
    tagline: "Scalable Video Conferencing and UC Endpoints",
    featured: false,
    priority: 6,
    category: "Meeting Rooms",
    categorySlug: "meeting-rooms",
    logoText: "Yealink",
    accentColor: "#E30613",
    heroImage: "https://images.unsplash.com/photo-1762176263996-a0713a49ee4d",
    shortDescription:
      "Broad portfolio of Teams and Zoom certified room systems, desk phones, and headsets — optimized for scale deployments with strong commercial value.",
    longDescription:
      "Yealink is a global top-three UC endpoint vendor covering everything from MeetingBar video systems to DECT phones and Bluetooth headsets. The portfolio breadth and aggressive commercial positioning make Yealink a go-to choice for multi-site, budget-conscious rollouts without compromising certification coverage.",
    keyStrengths: [
      {
        title: "Portfolio Breadth",
        description:
          "Room systems, phones, headsets, and accessories from a single vendor — simplified procurement and support."
      },
      {
        title: "Strong Commercial Value",
        description:
          "Competitive pricing on certified devices makes large-estate rollouts and refresh cycles commercially viable."
      },
      {
        title: "Teams and Zoom Certified",
        description:
          "Most models are certified on both platforms — reducing lock-in and easing dual-platform organizations."
      },
      {
        title: "Yealink Device Management",
        description:
          "Cloud and on-prem management platform for firmware, configuration, and diagnostics at scale."
      }
    ],
    products: [
      {
        name: "MeetingBar A-Series",
        description:
          "All-in-one video bars for huddle to medium rooms, Microsoft Teams and Zoom certified."
      },
      {
        name: "MVC Room Systems",
        description:
          "Modular Teams Rooms bundles (compute, camera, touch panel, audio) for medium and large rooms."
      },
      {
        name: "BH and WH Headsets",
        description:
          "Wireless Bluetooth and DECT headsets for hybrid and desk-based users."
      }
    ],
    useCases: [
      "Multi-site room standardization at scale",
      "Budget-conscious MTR and Zoom Rooms deployments",
      "Desk phone to UC migration programs",
      "Mixed device estates across offices"
    ],
    fidelisRole:
      "Fidelis Logic recommends Yealink for customers prioritizing commercial value and portfolio consistency across large estates. We handle design, procurement, deployment, and device management onboarding.",
    proofPoints: [
      "Global top-three UC endpoint vendor",
      "Broad Teams and Zoom certified lineup",
      "Strong ROI on large-scale deployments",
      "Authorized UAE deployment partner"
    ],
    relatedSolutions: [
      { name: "Meeting Rooms & AV", href: "/solutions/meeting-rooms" },
      { name: "Enterprise Headsets", href: "/solutions/headsets" }
    ]
  },
  {
    slug: "logitech",
    name: "Logitech",
    tagline: "Video Conferencing, Headsets, and Collaboration Peripherals",
    featured: false,
    priority: 7,
    category: "Meeting Rooms & Peripherals",
    categorySlug: "meeting-rooms",
    logoText: "Logitech",
    accentColor: "#00B8FC",
    heroImage: "https://images.unsplash.com/photo-1770048532712-4fde5ef7eb90",
    shortDescription:
      "Widely deployed collaboration peripherals — Rally video systems, Zone headsets, and MeetUp cameras — trusted across the hybrid workplace.",
    longDescription:
      "Logitech's collaboration portfolio spans video conferencing bars, premium headsets, wireless presenters, and personal webcams. Deep compatibility with Microsoft Teams, Zoom, and Google Meet, plus the Logitech Sync management platform, makes it a reliable pick for organizations standardizing device experiences at every desk and in every room.",
    keyStrengths: [
      {
        title: "Cross-Platform Compatibility",
        description:
          "Certified on Microsoft Teams, Zoom, and Google Meet — one portfolio covers every UC platform you run."
      },
      {
        title: "Logitech Sync",
        description:
          "Cloud-based device management for cameras, video bars, and headsets from a single pane of glass."
      },
      {
        title: "Personal to Room Continuum",
        description:
          "From personal webcams to boardroom Rally Plus systems — consistent experience across form factors."
      },
      {
        title: "Rally Bar Family",
        description:
          "Native Teams and Zoom video bars with AI viewer for automatic framing and speaker focus."
      }
    ],
    products: [
      {
        name: "Rally Bar & Rally Bar Mini",
        description:
          "All-in-one video bars for medium and small meeting rooms with AI framing and modular accessories."
      },
      {
        name: "Rally Plus",
        description:
          "Modular video system for large rooms with premium PTZ camera, multiple speakers, and mic pods."
      },
      {
        name: "Zone Series Headsets",
        description:
          "Teams and Zoom certified wireless headsets for hybrid workers and desk-based professionals."
      }
    ],
    useCases: [
      "Hybrid work personal device standardization",
      "Multi-platform UC environments (Teams + Zoom + Meet)",
      "Medium to large room video systems",
      "Boardroom and training room deployments"
    ],
    fidelisRole:
      "Fidelis Logic deploys Logitech across room and personal device programs — specifying the right Rally or Zone model per use case, integrating with your preferred UC platform, and setting up Logitech Sync for ongoing fleet management.",
    proofPoints: [
      "Teams, Zoom, and Google Meet certified",
      "Logitech Sync cloud management",
      "Consistent personal-to-room device experience",
      "UAE authorized deployment partner"
    ],
    relatedSolutions: [
      { name: "Meeting Rooms & AV", href: "/solutions/meeting-rooms" },
      { name: "Enterprise Headsets", href: "/solutions/headsets" }
    ]
  }
];

// Helpers
export const getBrandBySlug = (slug) => brands.find((b) => b.slug === slug);

export const getBrandsByCategorySlug = (categorySlug) =>
  brands.filter((b) => b.categorySlug === categorySlug);

export const getFeaturedBrands = () => brands.filter((b) => b.featured);

export const getBrandsSorted = () =>
  [...brands].sort((a, b) => a.priority - b.priority);

// Mapping from solution slug to relevant brand slugs (priority-ordered)
export const solutionBrandMap = {
  "workspace-experience": ["roomz", "morbit"],
  "meeting-rooms": ["poly", "neat", "logitech", "yealink"],
  "headsets": ["jabra", "poly", "logitech"]
};
