// Brand ecosystem data for Fidelis Logic's curated strategic partners.
// Copy is written for premium B2B advisory positioning — concise, outcome-led,
// and free of vendor marketing fluff. Update via this file only (single source of truth).

export const brands = [
  {
    slug: "roomz",
    name: "ROOMZ",
    tagline: "Wire-free room booking for hybrid workplaces",
    featured: true,
    priority: 1,
    partnershipType: "Distribution Partner",
    category: "Workspace Experience",
    categorySlug: "workspace-experience",
    logoText: "ROOMZ",
    accentColor: "#0EA5E9",
    heroImage: "/platform-images/roomz.png",
    shortDescription:
      "Swiss-engineered, battery-powered room booking panels and occupancy sensors that make hybrid offices run on time — without cabling, calendar conflicts, or ghost meetings.",
    longDescription:
      "ROOMZ is a Swiss workspace experience platform combining e-paper booking panels, occupancy sensors, and cloud analytics. It integrates natively with Microsoft 365, Google Workspace, and Exchange — giving facilities and IT teams real-time visibility into room utilisation while ending the daily friction of double-bookings and no-shows. As ROOMZ's UAE Distribution Partner, Fidelis Logic owns the full lifecycle in-region.",
    keyStrengths: [
      {
        title: "Battery-powered, wire-free deployment",
        description:
          "Up to five years on a single battery — no cabling, no drilling, no electrician callouts. Twenty rooms can be live within forty-eight hours."
      },
      {
        title: "Calendar-native by design",
        description:
          "Direct sync with Microsoft 365, Google Workspace, and Exchange. No middleware, no user migrations, no IT rework."
      },
      {
        title: "Honest occupancy intelligence",
        description:
          "Embedded sensors measure real utilisation versus booked time — surfacing the data you need to right-size your real estate footprint."
      },
      {
        title: "Privacy-first, regulator-ready",
        description:
          "No cameras, no microphones, no personal data capture. GDPR-aligned and deployable in regulated environments without legal review delays."
      }
    ],
    products: [
      {
        name: "ROOMZ Display",
        description:
          "E-paper booking panel with capacitive touch — reserve, extend, or release the room at a tap. Mounted outside every meeting space."
      },
      {
        name: "ROOMZ Sensor",
        description:
          "Wireless occupancy sensor that validates real-time usage and feeds accurate data back to the analytics layer."
      },
      {
        name: "ROOMZ Analytics",
        description:
          "Cloud dashboard for utilisation trends, no-show patterns, and portfolio-wide optimisation insights."
      }
    ],
    useCases: [
      "Meeting rooms and huddle spaces (4–20 people)",
      "Hot desks and focus booth management",
      "Multi-site portfolios with hybrid occupancy",
      "Regulated industries needing privacy-first sensing"
    ],
    fidelisRole:
      "As ROOMZ's UAE Distribution Partner, Fidelis Logic owns specification, procurement, and deployment in-region. We handle space assessment, panel placement strategy, Microsoft 365 calendar integration, rollout logistics, user enablement, and post-go-live analytics reviews — with lifecycle support aligned to your IT governance.",
    proofPoints: [
      "Swiss engineering, deployed across global enterprises",
      "Native Microsoft 365 and Google Workspace integration",
      "GDPR-compliant, privacy-first hardware",
      "Twenty rooms typically live within forty-eight hours"
    ],
    relatedSolutions: [
      { name: "Workspace Experience", href: "/solutions/workspace-experience" }
    ]
  },
  {
    slug: "morbit",
    name: "Morbit",
    tagline: "Workspace monitoring and device management for IT operations",
    featured: true,
    priority: 2,
    partnershipType: "Channel Partner",
    category: "Workspace Experience",
    categorySlug: "workspace-experience",
    logoText: "morbit",
    accentColor: "#6366F1",
    heroImage: "/platform-images/morbit.png",
    shortDescription:
      "A single pane of glass for meeting room devices, collaboration endpoints, and workspace infrastructure — fewer tickets, less downtime, smarter space decisions.",
    longDescription:
      "Morbit gives IT teams real-time visibility across every collaboration endpoint and meeting room device in the estate. Proactive alerting, utilisation analytics, and automated health checks reduce help-desk load and keep hybrid workspaces running without surprises. Fidelis Logic deploys Morbit as a managed service or alongside your existing IT operations team.",
    keyStrengths: [
      {
        title: "Unified device visibility",
        description:
          "Microsoft Teams Rooms, Zoom Rooms, and third-party collaboration devices on one dashboard — across every office, every region."
      },
      {
        title: "Proactive incident prevention",
        description:
          "Real-time alerts on offline devices, failing cameras, audio drops, and calendar sync issues — resolved before users notice."
      },
      {
        title: "Workspace utilisation analytics",
        description:
          "Room-level usage, peak-hour trends, and no-show rates — the evidence facilities and workplace strategy teams need to right-size space."
      },
      {
        title: "Operations-ready integration",
        description:
          "REST APIs, SNMP, and native connectors into ServiceNow and Jira. Slots into your existing operations stack without rework."
      }
    ],
    products: [
      {
        name: "Morbit Monitoring",
        description:
          "24/7 real-time monitoring of collaboration devices with automated alerts and continuous health scoring."
      },
      {
        name: "Morbit Analytics",
        description:
          "Workspace utilisation dashboards and reports for facilities, IT, and workplace strategy teams."
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
      "Teams shifting from reactive to proactive support",
      "Workplace strategy and facilities decision-making"
    ],
    fidelisRole:
      "Fidelis Logic deploys Morbit as part of our managed workspace services — configuring monitors, tuning alert thresholds, integrating ServiceNow or Jira, and training your service-desk team. For customers without an in-house operations function, we run Morbit end-to-end as a fully managed service.",
    proofPoints: [
      "Vendor-agnostic — works with any collaboration platform",
      "UAE-based managed service option",
      "Deep ServiceNow and Jira integration",
      "Typical payback in three to six months via ticket reduction"
    ],
    relatedSolutions: [
      { name: "Workspace Experience", href: "/solutions/workspace-experience" },
      { name: "Meeting Rooms & AV", href: "/solutions/meeting-rooms" }
    ]
  },
  {
    slug: "jabra",
    name: "Jabra",
    tagline: "Enterprise audio and intelligent video for hybrid work",
    featured: false,
    priority: 3,
    partnershipType: "Channel Partner",
    category: "Headsets & Devices",
    categorySlug: "headsets",
    logoText: "Jabra",
    accentColor: "#E30613",
    heroImage: "https://images.unsplash.com/photo-1769069920308-40130d50ae58",
    shortDescription:
      "Market-leading enterprise headsets and AI-powered video bars built for contact centres, hybrid workers, and executive collaboration — at the scale enterprise IT actually has to operate.",
    longDescription:
      "Jabra — part of GN Group — combines decades of acoustic engineering with fleet-management tooling that holds up in 5,000-device estates. From all-day contact-centre headsets to certified Microsoft Teams and Zoom video bars, the portfolio is curated for enterprises that need consistency across personas without compromising user experience.",
    keyStrengths: [
      {
        title: "All-day acoustic comfort",
        description:
          "Industry-leading ergonomics validated across contact-centre deployments — measurable reduction in fatigue on eight-hour shifts."
      },
      {
        title: "Teams and Zoom certified",
        description:
          "Certified echo cancellation, sidetone, and firmware reliability across every major UC platform — no surprises at scale."
      },
      {
        title: "Jabra Xpress fleet management",
        description:
          "Centralised firmware control, policy push, and utilisation analytics — essential once you cross 200+ devices."
      },
      {
        title: "Intelligent PanaCast video",
        description:
          "180° field of view, AI framing, and noise-suppressed audio for BYOD spaces and native Teams Rooms alike."
      }
    ],
    products: [
      {
        name: "Engage series",
        description:
          "Professional contact-centre headsets with noise-cancelling mics and quick-disconnect cabling."
      },
      {
        name: "Evolve2 series",
        description:
          "Hybrid-worker headsets with active noise cancellation and multi-device Bluetooth pairing."
      },
      {
        name: "PanaCast video bars",
        description:
          "AI-powered video conferencing bars for huddle rooms through to mid-size meeting spaces."
      }
    ],
    useCases: [
      "Contact-centre standardisation at scale",
      "Hybrid workforce headset programmes",
      "BYOD and Teams-native meeting rooms",
      "Executive audio and video setups"
    ],
    fidelisRole:
      "Fidelis Logic advises on Jabra device selection by persona — call centre, hybrid worker, executive — coordinates bulk procurement through authorised UAE channels, and runs fleet onboarding via Jabra Xpress, including firmware baselining, pairing, and user enablement.",
    proofPoints: [
      "Authorised UAE procurement channels",
      "Persona-based standardisation frameworks",
      "Teams and Zoom certified across the lineup",
      "Fleet deployment via Jabra Xpress included"
    ],
    relatedSolutions: [
      { name: "Enterprise Headsets", href: "/solutions/headsets" },
      { name: "Meeting Rooms & AV", href: "/solutions/meeting-rooms" }
    ]
  },
  {
    slug: "poly",
    name: "Poly",
    tagline: "Professional audio, video, and headsets — engineered by HP",
    featured: false,
    priority: 4,
    partnershipType: "Channel Partner",
    category: "Meeting Rooms & Headsets",
    categorySlug: "meeting-rooms",
    logoText: "Poly",
    accentColor: "#00A3E0",
    heroImage: "https://images.unsplash.com/photo-1703355685722-2996b01483be",
    shortDescription:
      "Professional-grade video conferencing, voice devices, and headsets — Plantronics and Polycom heritage, now backed by HP's global enterprise reach.",
    longDescription:
      "Poly, now part of HP, brings decades of acoustic engineering into modern Microsoft Teams Rooms and Zoom Rooms deployments. The Studio video bar lineup and Voyager headset family are staples in enterprise UC programmes worldwide — chosen for clarity in noisy environments and depth of cloud management.",
    keyStrengths: [
      {
        title: "Plantronics acoustic pedigree",
        description:
          "Microphone and speaker performance that holds up in open-plan offices and noisy contact centres alike."
      },
      {
        title: "Studio X for Teams and Zoom",
        description:
          "Studio X and E-series video bars certified for native MTR and Zoom Rooms with DirectorAI auto-framing."
      },
      {
        title: "Poly Lens cloud management",
        description:
          "Single console for firmware, policy, and insights across Poly headsets and room systems."
      },
      {
        title: "End-to-end portfolio",
        description:
          "From desk phones to boardroom codecs — one vendor for the full enterprise collaboration stack."
      }
    ],
    products: [
      {
        name: "Studio X series",
        description:
          "All-in-one video bars for huddle rooms through to large meeting spaces (Studio X30, X50, X70)."
      },
      {
        name: "Voyager series",
        description:
          "Premium Bluetooth headsets for executives and mobile professionals — Teams and Zoom certified."
      },
      {
        name: "EncorePro & Savi",
        description:
          "Wired and DECT wireless headsets for contact centres and desk-bound knowledge workers."
      }
    ],
    useCases: [
      "Microsoft Teams Rooms deployments",
      "Executive and boardroom video systems",
      "Enterprise contact-centre headset programmes",
      "Desk-phone to UC migration projects"
    ],
    fidelisRole:
      "Fidelis Logic delivers Poly across our Meeting Rooms and Headsets services — specifying the right Studio X model per room size, deploying Poly Lens for centralised management, and integrating with your existing MTR or Zoom Rooms infrastructure.",
    proofPoints: [
      "HP-backed global support footprint",
      "Microsoft Teams and Zoom certified across the range",
      "Poly Lens centralised cloud management",
      "Authorised UAE service partner"
    ],
    relatedSolutions: [
      { name: "Meeting Rooms & AV", href: "/solutions/meeting-rooms" },
      { name: "Enterprise Headsets", href: "/solutions/headsets" }
    ]
  },
  {
    slug: "neat",
    name: "Neat",
    tagline: "Purpose-built video devices for Microsoft Teams and Zoom",
    featured: false,
    priority: 5,
    partnershipType: "Channel Partner",
    category: "Meeting Rooms",
    categorySlug: "meeting-rooms",
    logoText: "Neat.",
    accentColor: "#FF5500",
    heroImage: "https://images.unsplash.com/photo-1703355685722-2996b01483be",
    shortDescription:
      "Award-winning Norwegian-designed video devices that bring cinematic meeting experiences — and built-in workspace analytics — to Microsoft Teams Rooms and Zoom Rooms.",
    longDescription:
      "Neat, headquartered in Oslo, is redefining room systems with industrial design that belongs in executive spaces. Deep co-engineering relationships with Microsoft and Zoom unlock unique experiences such as Neat Symmetry auto-framing and Neat Sense environmental analytics — without bolt-on hardware.",
    keyStrengths: [
      {
        title: "Design-led aesthetics",
        description:
          "Purpose-built hardware that fits modern, premium offices — no industrial beige boxes on the wall."
      },
      {
        title: "Neat Symmetry framing",
        description:
          "Automatic intelligent framing equalises every participant on screen — local and remote — without manual adjustment."
      },
      {
        title: "Built-in Neat Sense analytics",
        description:
          "Environmental sensors capture humidity, CO₂, air quality, and occupancy. Workspace insight without extra hardware."
      },
      {
        title: "Microsoft and Zoom co-engineering",
        description:
          "First-class integration with native MTR and Zoom Rooms — certified from day one of major platform releases."
      }
    ],
    products: [
      {
        name: "Neat Bar Pro",
        description:
          "Premium all-in-one video bar for medium and large meeting rooms — cinema-grade camera, 6-mic array."
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
      "Workspace analytics pilots paired with booking systems"
    ],
    fidelisRole:
      "Fidelis Logic positions Neat for customers who care about room aesthetics as much as technical performance. We handle specification, procurement, commissioning, and integration with your UC platform of choice.",
    proofPoints: [
      "Award-winning Norwegian industrial design",
      "Native Microsoft Teams and Zoom certification",
      "Neat Sense workspace analytics included",
      "Flagship choice for executive spaces"
    ],
    relatedSolutions: [
      { name: "Meeting Rooms & AV", href: "/solutions/meeting-rooms" }
    ]
  },
  {
    slug: "yealink",
    name: "Yealink",
    tagline: "Scalable UC endpoints for multi-site deployments",
    featured: false,
    priority: 6,
    partnershipType: "Channel Partner",
    category: "Meeting Rooms",
    categorySlug: "meeting-rooms",
    logoText: "Yealink",
    accentColor: "#E30613",
    heroImage: "https://images.unsplash.com/photo-1762176263996-a0713a49ee4d",
    shortDescription:
      "Broad portfolio of Microsoft Teams and Zoom certified room systems, desk phones, and headsets — built for scale rollouts where commercial value matters as much as certification.",
    longDescription:
      "Yealink is a global top-three UC endpoint vendor — from MeetingBar video systems to DECT phones and Bluetooth headsets. Portfolio breadth and competitive commercial positioning make Yealink the go-to choice for multi-site, budget-conscious rollouts that still need full Teams and Zoom certification.",
    keyStrengths: [
      {
        title: "End-to-end portfolio",
        description:
          "Room systems, phones, headsets, and accessories from one vendor — simplified procurement, simplified support."
      },
      {
        title: "Strong commercial value",
        description:
          "Competitive pricing on certified devices makes large-estate rollouts and refresh cycles financially viable."
      },
      {
        title: "Teams and Zoom dual-certified",
        description:
          "Most models are certified on both platforms — reducing lock-in and easing dual-platform organisations."
      },
      {
        title: "Yealink Device Management",
        description:
          "Cloud and on-prem management for firmware, configuration, and diagnostics at scale."
      }
    ],
    products: [
      {
        name: "MeetingBar A-series",
        description:
          "All-in-one video bars for huddle to medium rooms — Microsoft Teams and Zoom certified."
      },
      {
        name: "MVC room systems",
        description:
          "Modular Teams Rooms bundles (compute, camera, touch panel, audio) for medium and large rooms."
      },
      {
        name: "BH and WH headsets",
        description:
          "Wireless Bluetooth and DECT headsets for hybrid and desk-based users."
      }
    ],
    useCases: [
      "Multi-site room standardisation at scale",
      "Budget-conscious MTR and Zoom Rooms deployments",
      "Desk-phone to UC migration programmes",
      "Mixed device estates across regional offices"
    ],
    fidelisRole:
      "Fidelis Logic recommends Yealink for customers prioritising commercial value and portfolio consistency across large estates. We handle design, procurement, deployment, and onboarding into Yealink Device Management.",
    proofPoints: [
      "Global top-three UC endpoint vendor",
      "Broad Teams and Zoom certified lineup",
      "Strong ROI on large-scale deployments",
      "Authorised UAE deployment partner"
    ],
    relatedSolutions: [
      { name: "Meeting Rooms & AV", href: "/solutions/meeting-rooms" },
      { name: "Enterprise Headsets", href: "/solutions/headsets" }
    ]
  },
  {
    slug: "logitech",
    name: "Logitech",
    tagline: "Video, headsets, and peripherals across the hybrid workplace",
    featured: false,
    priority: 7,
    partnershipType: "Channel Partner",
    category: "Meeting Rooms & Peripherals",
    categorySlug: "meeting-rooms",
    logoText: "Logitech",
    accentColor: "#00B8FC",
    heroImage: "https://images.unsplash.com/photo-1770048532712-4fde5ef7eb90",
    shortDescription:
      "Widely deployed collaboration peripherals — Rally video systems, Zone headsets, and MeetUp cameras — covering every form factor from personal desk to boardroom.",
    longDescription:
      "Logitech's collaboration portfolio spans video conferencing bars, premium headsets, and personal webcams. Deep certification across Microsoft Teams, Zoom, and Google Meet — combined with the Logitech Sync management platform — makes it a reliable choice for organisations standardising device experiences across every desk and every room.",
    keyStrengths: [
      {
        title: "Cross-platform certification",
        description:
          "Certified on Microsoft Teams, Zoom, and Google Meet — one portfolio covers every UC platform you run."
      },
      {
        title: "Logitech Sync management",
        description:
          "Cloud-based device management for cameras, video bars, and headsets from a single console."
      },
      {
        title: "Personal-to-room continuum",
        description:
          "From personal webcams to boardroom Rally Plus systems — consistent experience across every form factor."
      },
      {
        title: "Rally Bar AI viewer",
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
          "Modular video system for large rooms — premium PTZ camera, multiple speakers, and mic pods."
      },
      {
        name: "Zone series headsets",
        description:
          "Teams and Zoom certified wireless headsets for hybrid workers and desk-based professionals."
      }
    ],
    useCases: [
      "Hybrid work personal device standardisation",
      "Multi-platform UC environments (Teams + Zoom + Meet)",
      "Medium to large room video systems",
      "Boardroom and training room deployments"
    ],
    fidelisRole:
      "Fidelis Logic deploys Logitech across room and personal device programmes — specifying the right Rally or Zone model per use case, integrating with your preferred UC platform, and configuring Logitech Sync for ongoing fleet management.",
    proofPoints: [
      "Teams, Zoom, and Google Meet certified",
      "Logitech Sync cloud management",
      "Consistent personal-to-room device experience",
      "Authorised UAE deployment partner"
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
