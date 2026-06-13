// Static site content (company info, service page details, hero copy)
// Blog posts are served dynamically from the backend — do not store posts here.

export const stats = [
  {
    number: "100+",
    label: "Projects Delivered"
  },
  {
    number: "98%",
    label: "Client Satisfaction"
  },
  {
    number: "15+",
    label: "Years Experience"
  }
];

export const heroData = {
  title: "Simplifying Modern Workplace Technology Decisions",
  subtitle: "We bridge the gap between business needs and technology solutions, helping organizations choose, design, and implement the right workplace technology with confidence while working through their trusted vendors.",
  ctaPrimary: "Book a Free Consultation",
  ctaSecondary: "Explore Solutions",
  //image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=80"
    image: "/HeroImage.png",
  // Carousel images — REPLACE these placeholders with brand-approved imagery.
  // Order matters: first image is shown on initial paint.
  images: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=80",
    "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=2400&q=80",
    "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=2400&q=80",
    "https://images.unsplash.com/photo-1664575601711-67110e027b9b?auto=format&fit=crop&w=2400&q=80"
  ]
};

export const segments = [
  {
    id: "meeting-rooms",
    title: "Meeting Rooms & AV Systems",
    description: "We help design and implement Microsoft Teams Rooms, Zoom Rooms, and BYOD Meeting spaces with professional audio-visual systems.",
    icon: "Presentation",
    image: "https://images.unsplash.com/photo-1703355685722-2996b01483be",
    
    link: "/solutions/meeting-rooms"
  },
  {
    id: "headsets",
    title: "Enterprise Headsets & Collaboration Devices",
    description: "Standardize communication devices across your organization - from Call Centers to Executive suites.",
    icon: "Headphones",
    image: "/EnterpriseHeadsets.png",
    link: "/solutions/headsets"
  },
  {
    id: "workspace-experience",
    title: "Room Booking & Workspace Experience",
    description: "Hot desking, Room booking panels, Visitor management, and Workplace analytics platforms.",
    icon: "Calendar",
    image: "/bookingsystem.png",
    link: "/solutions/workspace-experience"
  },
  {
    id: "business-apps",
    title: "Business Applications for Small and Medium Businesses",
    description: "ERP, HRMS, and CRM implementation with integration, training, and ongoing support.",
    icon: "BarChart3",
    image: "/businessapps.png",
    link: "/solutions/business-apps"
  }
];

export const howWeHelp = [
  {
    step: "01",
    title: "Assess",
    description: "We analyze your current workplace setup, understand your business objectives, and identify gaps and opportunities."
  },
  {
    step: "02",
    title: "Design",
    description: "We create vendor-neutral solution architectures tailored to your needs, budget, and technical environment."
  },
  {
    step: "03",
    title: "Deliver",
    description: "We work alongside the customer’s preferred reseller or system integrator so the solution is deployed smoothly and successfully."
  },
  {
    step: "04",
    title: "Support",
    description: "We provide lifecycle support, user training, issue resolution, and continuous optimization."
  }
];

export const whyChooseUs = [
  {
    title: "Business-First, Vendor-Neutral Guidance",
    description: "We recommend solutions based on your business needs, operational goals, and user requirements, not on a one-size-fits-all product push.",
    icon: "Shield"
  },
  {
    title: "Work Through Your Trusted Vendors",
    description: "We work with your preferred reseller or system integrator, so you keep existing relationships while gaining expert guidance and delivery support.",
    icon: "Handshake"
  },
  {
    title: "End-to-End Delivery Support",
    description: "From assessment and solution design to deployment and post-go-live support, we help make sure the solution is implemented successfully.",
    icon: "RefreshCw"
  },
  {
    title: "Outcomes That Matter",
    description: "Better-fit solutions, smoother deployments, lower risk, and stronger results for both customers and delivery partners.",
    icon: "Target"
  }
];

export const testimonials = [
  {
    name: "Sarah Al-Mansouri",
    role: "IT Director",
    company: "Leading Financial Services Firm",
    content: "They simplified our Microsoft Teams Rooms deployment across 50+ locations. The structured approach and vendor-neutral guidance saved us significant time and budget.",
    rating: 5
  },
  {
    name: "Ahmed Hassan",
    role: "Operations Manager",
    company: "Healthcare Group",
    content: "Outstanding support in standardizing our headset infrastructure. The consultation process helped us make informed decisions aligned with our hybrid work model.",
    rating: 5
  },
  {
    name: "Lisa Chen",
    role: "CEO",
    company: "SMB Technology Startup",
    content: "Their business applications consulting transformed our operations. From ERP selection to training, they delivered a solution that actually works for our team.",
    rating: 5
  }
];

export const partners = {
  videoCollaboration: [
    { name: "Poly", logo: "https://via.placeholder.com/120x60?text=Poly" },
    { name: "Yealink", logo: "https://via.placeholder.com/120x60?text=Yealink" },
    { name: "Neat", logo: "https://via.placeholder.com/120x60?text=Neat" },
    { name: "Logitech", logo: "https://via.placeholder.com/120x60?text=Logitech" }
  ],
  audioSolutions: [
    { name: "Jabra", logo: "https://via.placeholder.com/120x60?text=Jabra" },
    { name: "Sennheiser", logo: "https://via.placeholder.com/120x60?text=Sennheiser" },
    { name: "EPOS", logo: "https://via.placeholder.com/120x60?text=EPOS" },
    { name: "Shure", logo: "https://via.placeholder.com/120x60?text=Shure" },
    { name: "QSYS", logo: "https://via.placeholder.com/120x60?text=QSYS" }
  ],
  displaySharing: [
    { name: "Barco", logo: "https://via.placeholder.com/120x60?text=Barco" },
    { name: "Crestron", logo: "https://via.placeholder.com/120x60?text=Crestron" },
    { name: "Extron", logo: "https://via.placeholder.com/120x60?text=Extron" },
    { name: "Samsung", logo: "https://via.placeholder.com/120x60?text=Samsung" }
  ],
  platforms: [
    { name: "Microsoft Teams", logo: "https://via.placeholder.com/120x60?text=MS+Teams" },
    { name: "Zoom", logo: "https://via.placeholder.com/120x60?text=Zoom" },
    { name: "Webex", logo: "https://via.placeholder.com/120x60?text=Webex" },
    { name: "Google Meet", logo: "https://via.placeholder.com/120x60?text=Meet" }
  ]
};

export const roomTypes = [
  {
    title: "Executive Board Rooms",
    description: "Premium AV for high-stakes meetings",
    icon: "Crown"
  },
  {
    title: "Huddle Rooms",
    description: "Compact solutions for quick collaboration",
    icon: "Users"
  },
  {
    title: "Training Rooms",
    description: "Interactive learning environments",
    icon: "GraduationCap"
  },
  {
    title: "Auditoriums",
    description: "Large-scale presentation systems",
    icon: "Theater"
  },
  {
    title: "Townhall Spaces",
    description: "All-hands meeting solutions",
    icon: "Building"
  },
  {
    title: "Focus Rooms",
    description: "Private video calling booths",
    icon: "Video"
  }
];

export const whyChooseUsAdvantages = [
  {
    title: "Turnkey Meeting Room Deployment",
    description: "From design to installation, we handle complete Meeting Room Deployment for MTR, Zoom Rooms, and hybrid spaces.",
    icon: "CheckCircle2"
  },
  {
    title: "BYOD & BYOM Ready",
    description: "Enable Hybrid Working with seamless BYOD and BYOM solutions, supporting any device or platform.",
    icon: "Smartphone"
  },
  {
    title: "Rapid Response Support",
    description: "Annual Maintenance Contracts and Support Contracts ensure minimal downtime with priority response times.",
    icon: "Headphones"
  },
  {
    title: "Vendor-Agnostic Expertise",
    description: "Certified partners for Poly, Jabra, Yealink, Neat, Barco, Sennheiser, QSYS, and Shure solutions.",
    icon: "Award"
  }
];

export const contactInfo = {
  email: "info@fidelislogic.com",
  phone: "+971 52 360 7270",
  location: "Sharjah, United Arab Emirates",
  linkedin: "#",
  youtube: "#",
  instagram: "#"
};

export const formTopics = [
  "Meeting Room Assessment",
  "Headset Consultation",
  "Workplace Experience Platform",
  "Business Applications (ERP/HRMS/CRM)",
  "General Inquiry",
  "Request Quote",
  "Request Site Survey"
];

export const meetingRoomDetails = {
  hero: {
    title: "Meeting Rooms & AV Systems",
    subtitle: "Design, implement, and commission professional meeting spaces with Teams Rooms, Zoom Rooms, and BYOD capabilities.",
    image: "https://images.unsplash.com/photo-1703355685722-2996b01483be"
  },
  useCases: [
    {
      title: "Huddle Spaces",
      description: "4-6 person informal collaboration rooms with single display and USB conferencing bar.",
      icon: "Users"
    },
    {
      title: "Meeting Rooms",
      description: "8-12 person rooms with dual displays, ceiling microphones, and professional cameras.",
      icon: "Video"
    },
    {
      title: "Boardrooms",
      description: "Executive spaces with premium AV, wireless presentation, and full DSP audio systems.",
      icon: "Crown"
    },
    {
      title: "Training Rooms",
      description: "Flexible spaces supporting instruction, recording, and remote participation.",
      icon: "GraduationCap"
    }
  ],
  capabilities: [
    "Microsoft Teams Rooms (MTR) Design & Deployment",
    "Zoom Rooms Implementation",
    "BYOD Meeting Room Solutions",
    "Acoustic Analysis & Treatment",
    "Network Readiness Assessment",
    "Professional Installation & Commissioning",
    "User Training & Documentation",
    "Ongoing Support & Optimization"
  ]
};

export const headsetDetails = {
  hero: {
    title: "Enterprise Headsets & Collaboration Devices",
    subtitle: "Standardize communication devices across your organization with expert guidance on comfort, compatibility, and performance.",
    image: "/EnterpriseHeadsets2.png"
  },
  personas: [
    {
      title: "Call Center Agents",
      description: "Comfortable all-day wear, noise cancellation, quick disconnect, fleet management.",
      icon: "Headphones"
    },
    {
      title: "Hybrid Workers",
      description: "Versatile headsets for video calls, focus work, and mobility across office and home.",
      icon: "Laptop"
    },
    {
      title: "Executives",
      description: "Premium devices with superior audio quality, professional aesthetics, and seamless connectivity.",
      icon: "Briefcase"
    }
  ],
  whatWeSolve: [
    "Comfort & Ergonomics for Extended Use",
    "Microphone Clarity & Background Noise Control",
    "Device Standardization & Compatibility",
    "Fleet Provisioning & Management",
    "Integration with UC Platforms (Teams, Zoom, etc.)",
    "Budget Optimization Across User Personas"
  ]
};

export const workspaceExperienceDetails = {
  hero: {
    title: "Room Booking & Workspace Experience Platforms",
    subtitle: "Optimize office utilization with hot desking, room booking panels, visitor management, and workplace analytics.",
    image: "https://images.unsplash.com/photo-1718220216044-006f43e3a9b1"
  },
  capabilities: [
    {
      title: "Room Booking Systems",
      description: "Panel displays outside meeting rooms showing real-time availability and reservations.",
      icon: "CalendarCheck"
    },
    {
      title: "Hot Desking Solutions",
      description: "Enable flexible workspace reservations and optimize seating in hybrid work environments.",
      icon: "Laptop"
    },
    {
      title: "Visitor Management",
      description: "Digital check-in, badge printing, host notifications, and compliance tracking.",
      icon: "UserCheck"
    },
    {
      title: "Workplace Analytics",
      description: "Occupancy data, space utilization reports, and insights to optimize real estate costs.",
      icon: "BarChart3"
    },
    {
      title: "Wayfinding",
      description: "Digital signage and maps to help employees and visitors navigate office spaces.",
      icon: "Map"
    },
    {
      title: "Monitoring & Device Management",
      description: "Real-time monitoring and analytics to reduce downtime, prevent incidents, and increase productivity.",
      icon: "Binoculars"
    }
  ],
  platforms: [
   {
   name: "ROOMZ",
    href: "https://roomz.io",
    logo: "/platform-images/roomz.png"
   },
   {
    name: "morbit",
    href: "https://www.morbit.co.uk",
    logo: "/platform-images/morbit.png"
   }
  ]
};

export const businessAppsDetails = {
  hero: {
    title: "Business Applications for SMBs",
    subtitle: "ERP, HRMS, and CRM implementation with discovery, integration, training, and managed support.",
    image: "https://images.unsplash.com/photo-1573497019414-e44d0759d00e"
  },
  painPoints: [
    {
      title: "Fragmented Tools",
      description: "Multiple disconnected systems creating data silos and manual rework.",
      icon: "Puzzle"
    },
    {
      title: "Manual Processes",
      description: "Time-consuming spreadsheet-based workflows limiting growth and accuracy.",
      icon: "FileSpreadsheet"
    },
    {
      title: "Lack of Reporting",
      description: "No real-time visibility into financials, operations, or customer data.",
      icon: "TrendingDown"
    },
    {
      title: "Scaling Challenges",
      description: "Systems that can't keep pace with business growth and complexity.",
      icon: "AlertTriangle"
    }
  ],
  offer: [
    "Discovery & Requirements Workshops",
    "Solution Selection & Vendor Evaluation",
    "Implementation & Configuration",
    "System Integration (API, Data Migration)",
    "User Training & Change Management",
    "Managed Support & Continuous Optimization"
  ]
};
