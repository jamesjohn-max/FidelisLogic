// Services offered by Fidelis Logic. Single source of truth for the
// Services dropdown, /services hub page, and each /services/:slug detail page.

export const services = [
  {
    slug: "consulting",
    name: "Consulting Services",
    oneLiner: "Vendor-neutral advisory to shape the right workplace technology solution.",
    icon: "Compass",
    tagline: "Advisory that starts with your business, not a vendor's product.",
    shortDescription:
      "Independent workplace-technology consulting for UAE organisations — helping you define the right solution before anyone quotes a price.",
    longDescription:
      "We work alongside your business, IT and facilities leaders to translate real workplace outcomes into a clear technology brief. That means aligning stakeholders, benchmarking options across vendors, sizing the commercial envelope, and producing a recommendation you can defend to your board — before a single purchase order is raised.",
    engagementModel: "Fixed-fee assessments or retained advisory",
    keyBenefits: [
      {
        title: "Independent recommendation",
        description: "No hidden reseller margins. Our fee is our incentive, not the vendor we pick."
      },
      {
        title: "Board-ready business case",
        description: "Costed options, phasing plan, and success metrics documented for stakeholder buy-in."
      },
      {
        title: "Vendor-neutral shortlist",
        description: "We narrow the market to two or three fit-for-purpose options and negotiate on your behalf."
      },
      {
        title: "Faster time to decision",
        description: "Typical engagements move from kickoff to signed-off recommendation in 4–8 weeks."
      }
    ],
    deliverables: [
      "Discovery workshops with business, IT, and facilities stakeholders",
      "Current-state assessment of workspace technology estate",
      "Requirements matrix mapped to business outcomes",
      "Vendor-neutral shortlist with a scored comparison",
      "Costed recommendation with phasing plan",
      "Executive summary and detailed technical appendix"
    ],
    idealFor: [
      "Organisations at the start of a workplace refresh",
      "IT leaders replacing legacy meeting-room or workspace systems",
      "Facilities teams building a hybrid-work programme",
      "Boards weighing a build-vs-buy or platform-consolidation decision"
    ],
    relatedSolutions: ["/solutions", "/solutions/workspace-experience"],
    seo: {
      title: "IT Consulting Services UAE | Vendor-Neutral Advisory",
      description: "Independent workplace technology consulting in the UAE. We help you define, evaluate, and select the right meeting room, headset, and workspace platforms.",
      keywords: "IT consulting UAE, workplace technology advisory, vendor neutral consulting, Fidelis Logic"
    }
  },
  {
    slug: "deployment-configuration",
    name: "Deployment & Configuration",
    oneLiner: "End-to-end installation, commissioning, and platform tuning.",
    icon: "Wrench",
    tagline: "From procurement to production — one team accountable to go-live.",
    shortDescription:
      "Turn-key deployment of meeting rooms, workspace platforms, and collaboration devices — installed, commissioned, and validated by a single accountable team.",
    longDescription:
      "Once a design is signed off, execution is where most projects wobble. We take ownership from procurement through commissioning: site surveys, structured cabling coordination, device provisioning, calendar integration, network readiness, acoustic tuning, and end-user validation. Every room ships with a one-page quick-start guide and a joining-test video call recorded during handover.",
    engagementModel: "Fixed-scope project or T&M for phased rollouts",
    keyBenefits: [
      {
        title: "Single point of accountability",
        description: "One project manager owns AV, network, calendar and enablement — not four different teams."
      },
      {
        title: "Consistent room experience",
        description: "Every room commissioned against the same acceptance criteria and documented."
      },
      {
        title: "Change-managed rollout",
        description: "Pilot room proven before wave deployment. IT change-tickets aligned to your ITSM tooling."
      },
      {
        title: "Zero-surprise handover",
        description: "Live test call, user walkthrough, and a signed acceptance record before we exit."
      }
    ],
    deliverables: [
      "Site survey and installation plan per room",
      "Structured cabling coordination and QoS verification",
      "Device configuration and calendar sync (Teams / Zoom / Google)",
      "Acoustic tuning and camera framing sign-off",
      "End-user walkthrough and quick-start collateral",
      "As-built documentation and 30-day hypercare"
    ],
    idealFor: [
      "Multi-room rollouts (5–100+ meeting spaces)",
      "New office fit-outs on tight timelines",
      "Headset fleet deployments at scale",
      "Workspace-platform go-lives (booking, sensors, wayfinding)"
    ],
    relatedSolutions: ["/solutions/meeting-rooms", "/solutions/workspace-experience"],
    seo: {
      title: "AV Deployment & Configuration Services UAE | Fidelis Logic",
      description: "Turn-key deployment of meeting rooms, workspace platforms and collaboration devices across the UAE — one team accountable from procurement to go-live.",
      keywords: "AV deployment UAE, meeting room installation, workspace platform configuration, Teams Rooms rollout"
    }
  },
  {
    slug: "managed-support",
    name: "Managed Support & Maintenance",
    oneLiner: "Proactive monitoring, SLA-backed incident response, lifecycle care.",
    icon: "Headphones",
    tagline: "Keep every room, every device, every meeting running.",
    shortDescription:
      "SLA-backed managed services for meeting rooms, workspace platforms, and enterprise collaboration devices — proactive monitoring, remote remediation, and lifecycle firmware management.",
    longDescription:
      "Post go-live is where most of the value is realised — or lost. Our managed service keeps meeting rooms, video devices, and workspace platforms healthy through continuous monitoring, firmware baselining, incident response, and quarterly service reviews. We plug directly into your ITSM tool so tickets never sit in a separate queue.",
    engagementModel: "Monthly subscription per room, device fleet, or platform",
    keyBenefits: [
      {
        title: "Proactive over reactive",
        description: "Devices monitored 24/7 for offline states, camera health, calendar sync failures — resolved before users notice."
      },
      {
        title: "Predictable operating cost",
        description: "A single monthly line item covering monitoring, remediation, firmware, and quarterly reviews."
      },
      {
        title: "ITSM-integrated",
        description: "Tickets flow through ServiceNow, Jira, or your existing tool. No new portal for your team to learn."
      },
      {
        title: "Quarterly service reviews",
        description: "Utilisation data, incident trends, and improvement recommendations delivered every 90 days."
      }
    ],
    deliverables: [
      "24/7 device and platform monitoring",
      "SLA-backed incident response (severity-tiered)",
      "Remote remediation and firmware management",
      "ITSM integration (ServiceNow, Jira, Freshservice)",
      "Quarterly service reviews with utilisation analytics",
      "Optional on-site support for regulated environments"
    ],
    idealFor: [
      "Estates with 20+ managed meeting rooms",
      "Enterprises without an in-house AV/UC ops team",
      "Multi-site deployments spanning the UAE and wider GCC",
      "Regulated industries with strict availability SLAs"
    ],
    relatedSolutions: ["/solutions/meeting-rooms", "/solutions/workspace-experience"],
    seo: {
      title: "Managed AV & Workplace Support UAE | Fidelis Logic",
      description: "SLA-backed managed services for meeting rooms and workspace platforms. Proactive monitoring, incident response, and lifecycle care across the UAE.",
      keywords: "managed AV support UAE, meeting room maintenance, workspace platform monitoring, Teams Rooms managed service"
    }
  },
  {
    slug: "video-conferencing-rentals",
    name: "Video Conferencing Rentals",
    oneLiner: "Short-term hire of certified meeting-room and conferencing kit.",
    icon: "Video",
    tagline: "Enterprise-grade video conferencing — hired by the day, week, or month.",
    shortDescription:
      "Rent certified Microsoft Teams, Zoom, and BYOD video systems for events, boardroom pilots, and temporary offices — delivered, installed, and supported.",
    longDescription:
      "Not every meeting warrants a capex commitment. We supply enterprise-grade video-conferencing kit on flexible rental terms for offsites, board meetings, tenders, training sessions, and pilot pods — delivered pre-configured, tested on-site, and collected after the engagement.",
    engagementModel: "Daily, weekly or monthly rental, all-inclusive",
    keyBenefits: [
      {
        title: "Zero capex commitment",
        description: "Pay only for the days you need the kit. Ideal for events, pilots, and temporary offices."
      },
      {
        title: "Pre-configured and tested",
        description: "Kit arrives pre-paired, calendar-synced, and test-called before it leaves our workshop."
      },
      {
        title: "On-site technical support",
        description: "Optional AV technician available for high-stakes sessions (board meetings, tenders, keynote calls)."
      },
      {
        title: "Full portfolio access",
        description: "Poly Studio, Neat Bar, Logitech Rally, Jabra PanaCast — matched to your platform and room size."
      }
    ],
    deliverables: [
      "Pre-configured video bar or modular room system",
      "Delivery, installation, and joining-call verification",
      "Optional on-site AV technician",
      "Loaner accessories (headsets, remote controls, cabling)",
      "Collection and remote wipe of session data",
      "Post-event usage report"
    ],
    idealFor: [
      "Board meetings and shareholder events",
      "Training programmes and workshops",
      "Tender rooms and legal proceedings",
      "Pilot pods before full-scale rollouts",
      "Temporary offices and project sites"
    ],
    relatedSolutions: ["/solutions/meeting-rooms"],
    seo: {
      title: "Video Conferencing Rental UAE | Teams & Zoom Kit Hire",
      description: "Rent Microsoft Teams, Zoom, and BYOD meeting-room kit across the UAE. Pre-configured, delivered, installed, and supported by Fidelis Logic.",
      keywords: "video conferencing rental UAE, Teams rooms hire, Zoom room rental Dubai, AV rental"
    }
  },
  {
    slug: "workspace-audits",
    name: "Workspace Technology Audits",
    oneLiner: "Independent audit of your estate — surface gaps, risk, and opportunity.",
    icon: "ClipboardCheck",
    tagline: "Know exactly what you have, what's failing, and what to replace next.",
    shortDescription:
      "A structured audit of your meeting rooms, workspace platforms, and collaboration devices — producing a heat-map of health, risk, and prioritised investment opportunities.",
    longDescription:
      "You can't optimise what you can't see. Our workspace audit walks the estate room by room, benchmarks device health and utilisation, evaluates license spend, and models the cost of a refresh vs a repair. The output: a prioritised action list with quick wins, defer-able work, and clear replace-vs-retain calls.",
    engagementModel: "Fixed-fee, typically 3–6 weeks",
    keyBenefits: [
      {
        title: "Baseline your true estate",
        description: "Every room, device, and licence documented — often the first accurate list your team has."
      },
      {
        title: "Quantify hidden cost",
        description: "License overspend, shelf-ware, and no-show meeting rooms surfaced in monetary terms."
      },
      {
        title: "Prioritised action list",
        description: "Quick wins, medium-term investments, and end-of-life devices ranked by ROI and risk."
      },
      {
        title: "Vendor-neutral evaluation",
        description: "No incentive to recommend replacement. If it's fit for another 24 months, we'll say so."
      }
    ],
    deliverables: [
      "Physical inventory of rooms and collaboration devices",
      "Utilisation and no-show analytics (where sensor data exists)",
      "License spend review vs actual usage",
      "Refresh-vs-retain recommendation per asset",
      "Prioritised roadmap and business case",
      "Executive briefing with C-level talking points"
    ],
    idealFor: [
      "Organisations without an accurate device inventory",
      "IT leaders inheriting an unfamiliar estate",
      "Facilities teams planning a workplace redesign",
      "Finance teams pushing for licence-cost rationalisation"
    ],
    relatedSolutions: ["/solutions/workspace-experience", "/solutions/meeting-rooms"],
    seo: {
      title: "Workspace Technology Audit UAE | Meeting Room & Device Audit",
      description: "Independent audit of meeting rooms, workspace platforms and collaboration devices — surface gaps, risk, and prioritised investment opportunities.",
      keywords: "workspace audit UAE, meeting room audit, AV estate audit, workspace technology assessment"
    }
  },
  {
    slug: "technology-refresh",
    name: "Technology Refresh & Upgrades",
    oneLiner: "Plan and execute end-of-life device and platform migrations.",
    icon: "RefreshCw",
    tagline: "Refresh without the disruption — plan, phase, and swap.",
    shortDescription:
      "Structured refresh programmes for meeting rooms, headsets, and workspace platforms — end-of-life devices retired, replacements phased in, users trained on what changes.",
    longDescription:
      "Devices age. Vendors change ownership. Platforms sunset features. When a refresh is due, the question isn't just what to buy — it's how to swap without breaking the workday. We design phased migrations that pilot, prove, and roll out the new estate while retiring the old, with change comms and user training baked into the plan.",
    engagementModel: "Fixed-scope refresh programme, delivered in waves",
    keyBenefits: [
      {
        title: "Zero-downtime migration",
        description: "Pilot rooms and departments validated before wider swap. Users always have a working room."
      },
      {
        title: "Trade-in and disposal handled",
        description: "Certified WEEE-compliant disposal or trade-in credit for the old estate."
      },
      {
        title: "Coordinated user comms",
        description: "Change comms, quick-start guides, and floor-walker support during each wave."
      },
      {
        title: "Business case documented",
        description: "TCO comparison, feature-parity analysis, and phasing plan approved before we start."
      }
    ],
    deliverables: [
      "Refresh business case and TCO analysis",
      "Phased migration plan with pilot criteria",
      "Procurement and staging of replacement kit",
      "Coordinated swap-outs by room, floor, or site",
      "Old-estate disposal (WEEE certified) or trade-in",
      "User change comms and training resources"
    ],
    idealFor: [
      "Meeting-room estates reaching end-of-life",
      "Headset fleets 5+ years old with dropping call quality",
      "Workspace platforms with unsupported firmware",
      "Post-M&A estates consolidating onto one platform"
    ],
    relatedSolutions: ["/solutions/meeting-rooms", "/solutions/headsets"],
    seo: {
      title: "Meeting Room & AV Refresh Programmes UAE | Fidelis Logic",
      description: "Structured technology refresh services for meeting rooms, headsets and workspace platforms in the UAE. Phased, planned, and coordinated.",
      keywords: "AV refresh UAE, meeting room upgrade, headset fleet refresh, workspace technology migration"
    }
  },
  {
    slug: "relocation-office-moves",
    name: "Relocation & Office Moves",
    oneLiner: "Decommission, transport, and reinstate technology when you relocate.",
    icon: "Truck",
    tagline: "Move offices, not the risk of a broken meeting room.",
    shortDescription:
      "Full-lifecycle AV and workspace-technology relocation — decommissioning, secure transport, reinstallation, and full re-commissioning at the new address.",
    longDescription:
      "An office move can undo years of workspace investment in a weekend. We plan and execute the workspace-technology side of any relocation — cataloguing what moves and what's replaced, coordinating with movers and fit-out teams, and recommissioning every room in the new space so day-one meetings just work.",
    engagementModel: "Fixed-scope project tied to your move date",
    keyBenefits: [
      {
        title: "Day-one meetings work",
        description: "Every room recommissioned, calendar-synced, and test-called before hand-back."
      },
      {
        title: "Coordinated with movers",
        description: "We schedule around your fit-out contractor, movers, and IT team — one project plan for all workstreams."
      },
      {
        title: "Right-size the move",
        description: "We flag devices worth leaving behind or trading in rather than moving to the new space."
      },
      {
        title: "Insured, tracked, secure",
        description: "Device inventory tracked door-to-door with insured transport and secure staging."
      }
    ],
    deliverables: [
      "Move-out audit and device inventory",
      "Decommissioning and safe removal from source rooms",
      "Insured transport with device tracking",
      "Reinstallation at destination office",
      "Full re-commissioning and joining-call verification",
      "Optional storage between move-out and move-in"
    ],
    idealFor: [
      "HQ or regional office relocations",
      "Office consolidations post-M&A",
      "Landlord-led building moves",
      "Growth-driven expansions to new floors or sites"
    ],
    relatedSolutions: ["/solutions/meeting-rooms", "/solutions/workspace-experience"],
    seo: {
      title: "Office Move AV & Workspace Relocation UAE | Fidelis Logic",
      description: "AV and workspace technology relocation across the UAE — decommission, transport, reinstate, and recommission every room in your new office.",
      keywords: "office move AV UAE, meeting room relocation, workspace relocation Dubai, IT office move services"
    }
  },
  {
    slug: "training-adoption",
    name: "Training & User Adoption",
    oneLiner: "Turn deployed technology into daily habit through structured enablement.",
    icon: "GraduationCap",
    tagline: "Technology only pays back when people actually use it.",
    shortDescription:
      "Role-based training and change-management programmes that lift adoption of meeting rooms, workspace platforms, and collaboration tools — measured by real usage, not attendance sheets.",
    longDescription:
      "The best-designed meeting room is worthless if users default to Zooming from their laptop. We build role-based training and adoption programmes tailored to how your teams actually work — from short walkthrough videos to floor-walker support during the first two weeks, to executive champion sessions and adoption dashboards.",
    engagementModel: "Fixed-scope enablement bundle or ongoing adoption partner",
    keyBenefits: [
      {
        title: "Adoption measured, not assumed",
        description: "We track real room-utilisation and platform-engagement before and after training — outcome-based, not attendance-based."
      },
      {
        title: "Role-based content",
        description: "Executives, assistants, IT champions and end users each get material that matches their day."
      },
      {
        title: "Bite-sized formats",
        description: "60-second video walk-throughs and one-page cheat sheets — designed for adults with 30 seconds to spare."
      },
      {
        title: "Champion network",
        description: "We train and coach internal champions so knowledge stays in your business after we exit."
      }
    ],
    deliverables: [
      "Persona and journey mapping",
      "Role-based training curriculum",
      "Short-form video walkthroughs (per room type)",
      "Quick-reference cheat sheets and one-pagers",
      "Live floor-walker support during go-live weeks",
      "Adoption dashboard and 30/60/90-day reviews"
    ],
    idealFor: [
      "Post-deployment enablement programmes",
      "Platform migrations (Teams ↔ Zoom, Google → Microsoft)",
      "New office openings",
      "Organisations with distributed or hybrid workforces"
    ],
    relatedSolutions: ["/solutions/workspace-experience", "/solutions/business-apps"],
    seo: {
      title: "User Adoption & Training Services UAE | Fidelis Logic",
      description: "Role-based training and adoption programmes for meeting rooms, workspace platforms and collaboration tools across the UAE.",
      keywords: "user adoption UAE, workplace technology training, Teams training, change management workspace"
    }
  }
];

export const getServiceBySlug = (slug) => services.find((s) => s.slug === slug);
