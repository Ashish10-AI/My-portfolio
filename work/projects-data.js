/**
 * ─── PROJECT DATA ──────────────────────────────────────────
 * Each entry = one CATEGORY.
 * categoryProjects[] = all projects in that category.
 * Each project has: title, image, problem, solution, tools,
 *   liveDemo, github
 *
 * HOW TO EXTEND:
 * Add new objects to categoryProjects[] with the same shape.
 * The rendering engine picks them up automatically.
 * ──────────────────────────────────────────────────────────── */

const PROJECTS_DATA = {

  /* ── CATEGORY 1: WEB DESIGN ─────────────────────────────── */
  "saas-platform-redesign": {
    id: "saas-platform-redesign",
    num: "01",
    category: "Web Design",
    categoryColor: "purple",
    title: "SaaS Platform — Complete UI Overhaul",
    tagline: "Turning a 78% bounce rate into a conversion machine through design-driven strategy.",
    coverEmoji: "🖥️",
    techStack: ["Figma", "Webflow", "CSS", "JavaScript", "Responsive Design"],
    problem: {
      heading: "The Problem",
      text: "The client's SaaS landing page was bleeding users. With a 78% bounce rate, visitors were leaving without taking any meaningful action."
    },
    solution: {
      heading: "The Solution",
      text: "I performed a complete UI/UX audit, rebuilt the information architecture, and designed a modern, conversion-focused landing page in Figma."
    },
    tools: [
      { name: "Figma", desc: "Design & Prototyping" },
      { name: "Webflow", desc: "No-code Development" },
      { name: "CSS3", desc: "Custom Animations" },
      { name: "Google Analytics", desc: "Conversion Tracking" },
      { name: "Hotjar", desc: "Heatmap Analysis" },
      { name: "Lottie", desc: "Micro-animations" }
    ],
    results: [
      { metric: "Bounce Rate", before: "78%", after: "34%", icon: "📉" },
      { metric: "Conversions", before: "1×", after: "3.2×", icon: "📈" },
      { metric: "Avg Session", before: "0:42", after: "3:15", icon: "⏱️" },
      { metric: "Mobile Conv.", before: "0.3%", after: "4.8%", icon: "📱" }
    ],
    screenshots: [
      "screenshots/saas-1.png",
      "screenshots/saas-2.png",
      "screenshots/saas-3.png"
    ],
    liveDemo: "#",
    github: "https://github.com/Ashish10-AI",
    isWebProject: true,
    prevProject: "ecommerce-price-bot",
    nextProject: "youtube-growth-system",

    categoryProjects: [
      {
        title: "SaaS Platform — Complete UI Overhaul",
        image: "screenshots/saas-1.png",
        problem: "Client's page had 78% bounce rate. Visitors left without any meaningful action.",
        solution: "Full redesign in Figma → Webflow with modern hierarchy, trust signals & micro-interactions.",
        tools: ["Figma", "Webflow", "CSS3", "JavaScript"],
        liveDemo: "#",
        github: "https://github.com/Ashish10-AI"
      },
      {
        title: "Portfolio Website — Modern Redesign",
        image: null,
        problem: "Freelance designer had an outdated WordPress site that wasn't converting leads.",
        solution: "Built a custom coded portfolio with smooth animations, interactive case study system, and contact form.",
        tools: ["HTML", "CSS", "JavaScript", "GSAP"],
        liveDemo: "#",
        github: "#"
      },
      {
        title: "E-Commerce Landing Page",
        image: null,
        problem: "Fashion startup's landing page had poor mobile experience, losing 40% of mobile traffic.",
        solution: "Redesigned with mobile-first approach, optimized images, lazy loading, and streamlined checkout flow.",
        tools: ["HTML", "CSS", "JavaScript", "Shopify"],
        liveDemo: "#",
        github: "#"
      }
    ]
  },

  /* ── CATEGORY 2: VIDEO EDITING ──────────────────────────── */
  "youtube-growth-system": {
    id: "youtube-growth-system",
    num: "02",
    category: "Video Editing",
    categoryColor: "pink",
    title: "Tech Creator — 0 to 45K Subs in 6 Months",
    tagline: "A complete video editing system that transformed raw footage into viral content.",
    coverEmoji: "🎬",
    techStack: ["Premiere Pro", "DaVinci Resolve", "CapCut", "After Effects", "Photoshop"],
    problem: {
      heading: "The Problem",
      text: "The creator had passion and great knowledge but zero visual identity."
    },
    solution: {
      heading: "The Solution",
      text: "I built a complete editing pipeline: hook structure, dynamic captions, branded lower thirds, custom motion graphics."
    },
    tools: [
      { name: "Premiere Pro", desc: "Primary Editing" },
      { name: "DaVinci Resolve", desc: "Color Grading" },
      { name: "After Effects", desc: "Motion Graphics" },
      { name: "CapCut", desc: "Short-form Content" },
      { name: "Photoshop", desc: "Thumbnails" },
      { name: "Canva", desc: "Channel Art" }
    ],
    results: [
      { metric: "Subscribers", before: "2K", after: "45K", icon: "👥" },
      { metric: "Watch Time", before: "1:20", after: "6:40", icon: "⏱️" },
      { metric: "Total Views", before: "15K", after: "2M+", icon: "👁️" },
      { metric: "Avg. Views", before: "300", after: "50K+", icon: "📈" }
    ],
    screenshots: [
      "screenshots/youtube-1.png",
      "screenshots/youtube-2.png",
      "screenshots/youtube-3.png"
    ],
    liveDemo: "#",
    github: null,
    isWebProject: false,
    prevProject: "saas-platform-redesign",
    nextProject: "lifestyle-brand-identity",

    categoryProjects: [
      {
        title: "Tech Creator — 0 to 45K Subs",
        image: "screenshots/youtube-1.png",
        problem: "Raw footage, no visual identity, poor retention. Under 300 views per video.",
        solution: "Full editing system — hooks, motion graphics, color grading & optimized thumbnails.",
        tools: ["Premiere Pro", "After Effects", "Photoshop"],
        liveDemo: "#",
        github: null
      },
      {
        title: "Product Launch Campaign Video",
        image: null,
        problem: "SaaS company needed a cinematic product launch video but had zero video content.",
        solution: "Produced a 90-second launch video with motion graphics, voiceover sync, and platform cuts.",
        tools: ["DaVinci Resolve", "After Effects", "Audition"],
        liveDemo: "#",
        github: null
      },
      {
        title: "Instagram Reels Strategy",
        image: null,
        problem: "Fitness brand's reels were getting under 500 views with no engagement.",
        solution: "Created hook-first editing style with trend audio, dynamic text overlays, and visual branding.",
        tools: ["CapCut", "Premiere Pro", "Canva"],
        liveDemo: "#",
        github: null
      }
    ]
  },

  /* ── CATEGORY 3: BRAND IDENTITY ─────────────────────────── */
  "lifestyle-brand-identity": {
    id: "lifestyle-brand-identity",
    num: "03",
    category: "Brand Identity",
    categoryColor: "blue",
    title: "Lifestyle Brand — Identity System from Scratch",
    tagline: "From zero brand presence to 18K followers in 3 months with a complete visual identity.",
    coverEmoji: "✦",
    techStack: ["Figma", "Canva", "Illustrator", "Photoshop", "Brand Strategy"],
    problem: {
      heading: "The Problem",
      text: "A wellness startup needed a full brand identity for their Instagram and TikTok launch."
    },
    solution: {
      heading: "The Solution",
      text: "I designed a comprehensive brand identity system: logos, color palette, typography, 20+ templates."
    },
    tools: [
      { name: "Figma", desc: "Brand System Design" },
      { name: "Canva", desc: "Template Creation" },
      { name: "Illustrator", desc: "Logo Design" },
      { name: "Photoshop", desc: "Visual Assets" },
      { name: "Notion", desc: "Brand Guidelines" },
      { name: "Coolors", desc: "Palette Generation" }
    ],
    results: [
      { metric: "Followers", before: "0", after: "18K", icon: "👥" },
      { metric: "First Reel", before: "—", after: "250K+", icon: "🎥" },
      { metric: "Templates", before: "0", after: "20+", icon: "📋" },
      { metric: "Design Time", before: "4h/post", after: "15min", icon: "⚡" }
    ],
    screenshots: [
      "screenshots/brand-1.png",
      "screenshots/brand-2.png",
      "screenshots/brand-3.png"
    ],
    liveDemo: "#",
    github: null,
    isWebProject: false,
    prevProject: "youtube-growth-system",
    nextProject: "ecommerce-price-bot",

    categoryProjects: [
      {
        title: "Lifestyle Brand — Identity System",
        image: "screenshots/brand-1.png",
        problem: "Wellness startup needed full identity — logo, palette, templates — for social launch.",
        solution: "Logo system, 20+ social templates, thumbnail library & brand guidelines in Figma + Canva.",
        tools: ["Figma", "Illustrator", "Canva"],
        liveDemo: "#",
        github: null
      },
      {
        title: "Tech Startup — Brand Refresh",
        image: null,
        problem: "AI startup looked generic. No personality, zero brand recognition in a crowded market.",
        solution: "Created bold identity with custom wordmark, neon color system, icon library, and pitch deck.",
        tools: ["Figma", "Illustrator", "Photoshop"],
        liveDemo: "#",
        github: null
      },
      {
        title: "Food Delivery — Visual Identity",
        image: null,
        problem: "Local food delivery service had inconsistent branding across app, social, and packaging.",
        solution: "Unified brand system with warm palette, custom illustrations, packaging design, and templates.",
        tools: ["Illustrator", "Canva", "Photoshop"],
        liveDemo: "#",
        github: null
      }
    ]
  },

  /* ── CATEGORY 4: PYTHON AUTOMATION ──────────────────────── */
  "ecommerce-price-bot": {
    id: "ecommerce-price-bot",
    num: "04",
    category: "Python Automation",
    categoryColor: "green",
    title: "E-Commerce Intel — Price Monitor & Alert Bot",
    tagline: "Automated competitor price tracking that saved 100+ hours/month and generated $12K extra revenue.",
    coverEmoji: "🐍",
    techStack: ["Python", "Selenium", "BeautifulSoup", "Google Sheets API", "Telegram Bot"],
    problem: {
      heading: "The Problem",
      text: "The client was manually tracking 500+ competitor prices across 8 e-commerce sites every morning."
    },
    solution: {
      heading: "The Solution",
      text: "I built a Python-based automated scraping system using Selenium and BeautifulSoup with Telegram alerts."
    },
    tools: [
      { name: "Python", desc: "Core Language" },
      { name: "Selenium", desc: "Dynamic Scraping" },
      { name: "BeautifulSoup", desc: "HTML Parsing" },
      { name: "Sheets API", desc: "Data Reporting" },
      { name: "Telegram API", desc: "Alert Bot" },
      { name: "Cron", desc: "Task Scheduling" }
    ],
    results: [
      { metric: "Hours Saved", before: "120h/mo", after: "0h/mo", icon: "⏱️" },
      { metric: "Revenue Impact", before: "—", after: "$12K Q1", icon: "💰" },
      { metric: "Products Tracked", before: "500", after: "2,000+", icon: "📦" },
      { metric: "Alert Speed", before: "Next day", after: "Instant", icon: "⚡" }
    ],
    screenshots: [
      "screenshots/bot-1.png",
      "screenshots/bot-2.png",
      "screenshots/bot-3.png"
    ],
    liveDemo: "#",
    github: "https://github.com/Ashish10-AI",
    isWebProject: true,
    prevProject: "lifestyle-brand-identity",
    nextProject: "saas-platform-redesign",

    categoryProjects: [
      {
        title: "E-Commerce Intel — Price Monitor & Alert Bot",
        image: "screenshots/bot-1.png",
        problem: "Client tracked 500+ competitor prices manually across 8 sites — 4 hours every morning.",
        solution: "Python scraper (Selenium + BS4), Sheets API reporting, Telegram bot with price-drop alerts.",
        tools: ["Python", "Selenium", "BeautifulSoup", "Telegram API"],
        liveDemo: "#",
        github: "https://github.com/Ashish10-AI"
      },
      {
        title: "Social Media Auto-Scheduler",
        image: null,
        problem: "Marketing agency spent 6+ hours weekly manually posting across 5 client accounts.",
        solution: "Built Python automation with API integrations for scheduled posting and weekly report generation.",
        tools: ["Python", "REST APIs", "Automation"],
        liveDemo: "#",
        github: "#"
      },
      {
        title: "Data Pipeline Dashboard",
        image: null,
        problem: "E-commerce client had sales data scattered across Shopify, Google Ads, and email platforms.",
        solution: "Python ETL pipeline pulling from multiple APIs into a real-time Streamlit dashboard.",
        tools: ["Python", "Streamlit", "Pandas", "APIs"],
        liveDemo: "#",
        github: "#"
      }
    ]
  }
};
