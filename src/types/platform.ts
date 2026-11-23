export type PageId =
  | 'home'
  | 'ai-robot'
  | 'ai-automation'
  | 'ai-shopping'
  | 'ai-business'
  | 'ai-video'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'auth'
  | 'dashboard';

export type PlanTier = 'starter' | 'growth' | 'enterprise';
export type DivisionId = 'ai-robot' | 'ai-automation' | 'ai-shopping' | 'ai-business' | 'ai-video';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  company: string;
  plan: PlanTier;
  role: 'customer' | 'admin';
  aiCreditsUsed: number;
  aiCreditsLimit: number;
  activeServices: DivisionId[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AutomationTask {
  id: string;
  userId: string;
  title: string;
  category: 'support' | 'email' | 'workflow' | 'task';
  status: 'active' | 'paused' | 'completed';
  trigger: string;
  runsCount: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface BusinessCustomer {
  id: string;
  userId: string;
  name: string;
  email: string;
  company: string;
  stage: 'lead' | 'active' | 'retained';
  monthlyValue: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  orderType: 'merchandise' | 'subscription';
  itemSummary: string;
  totalAmount: number;
  currency: string;
  paymentMethod: 'upi_scanner';
  upiTransactionRef: string;
  payerName: string;
  payerPhone: string;
  shippingAddress: string;
  status: 'pending_verification' | 'verified' | 'fulfilled';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: 'Fashion & Apparel' | 'Footwear' | 'Accessories' | 'Affiliate Partner';
  priceInr: number;
  originalPriceInr?: number;
  image: string;
  sizes: string[];
  description: string;
  affiliateBadge?: string;
  affiliateUrl?: string;
}

export interface CartItem {
  product: ProductItem;
  size: string;
  quantity: number;
}

export interface PricingPlan {
  id: PlanTier;
  name: string;
  audience: string;
  priceInr: number;
  priceUsd: number;
  creditsLimit: number;
  workflowsLimit: string;
  crmLimit: string;
  videoScripts: string;
  supportSla: string;
  features: string[];
  highlighted?: boolean;
}

export const PLATFORM_CONTACT = {
  brand: 'EZ AI WORLD',
  phone: '9987353491',
  phoneFormatted: '+91 99873 53491',
  email: 'tenvilla60@gmail.com',
  upiPayee: 'Ezhil Arasan',
  upiId: 'ezhila486@oksbi',
  upiBank: 'Equitas Bank 2490',
  scannerImage: '/assets/aistudio/Screenshot_20261113_003507_cdafb790.jpg',
} as const;

export const PLATFORM_IMAGES = {
  heroCore: '/src/assets/images/hero_ai_core_1795411004158.jpg',
  robotHardware: '/src/assets/images/ai_robot_hardware_1795411003826.jpg',
  videoStudio: '/src/assets/images/ai_video_studio_1795411003858.jpg',
  shopJacket: '/src/assets/images/shop_tech_jacket_1795411004471.jpg',
  shopSneakers: '/src/assets/images/shop_tech_sneakers_1795411003558.jpg',
  shopAccessories: '/src/assets/images/shop_tech_accessories_1795411003937.jpg',
} as const;

export const DIVISIONS: {
  id: DivisionId;
  index: string;
  name: string;
  shortTitle: string;
  tagline: string;
  capabilities: string[];
  metric: string;
  image: string;
}[] = [
  {
    id: 'ai-robot',
    index: '01',
    name: 'AI Robot Assistant',
    shortTitle: 'AI Robot',
    tagline: 'Enterprise conversational intelligence, instant customer Q&A, and 24/7 executive support.',
    capabilities: [
      'AI Chatbot Interface',
      'Customer Support Assistant',
      'Question-Answering Engine',
      'Executive Business Assistant',
    ],
    metric: '180ms avg response',
    image: PLATFORM_IMAGES.robotHardware,
  },
  {
    id: 'ai-automation',
    index: '02',
    name: 'AI Automation',
    shortTitle: 'AI Automation',
    tagline: 'Autonomous customer support routing, email sequences, workflow triggers, and task control.',
    capabilities: [
      'Automated Customer Support',
      'Email Sequence Automation',
      'Workflow Blueprint Engine',
      'Task Management Console',
    ],
    metric: '14 hrs/wk saved',
    image: PLATFORM_IMAGES.heroCore,
  },
  {
    id: 'ai-shopping',
    index: '03',
    name: 'Online Shopping',
    shortTitle: 'AI Shopping',
    tagline: 'Curated modern fashion, footwear, accessories, and affiliate partner drops with UPI scanner checkout.',
    capabilities: [
      'Fashion & Apparel Store',
      'Technical Footwear & Gear',
      'Live Cart & UPI Scanner Pay',
      'Affiliate Partner Catalog',
    ],
    metric: 'Instant UPI checkout',
    image: PLATFORM_IMAGES.shopJacket,
  },
  {
    id: 'ai-business',
    index: '04',
    name: 'AI Business Services',
    shortTitle: 'AI Business',
    tagline: 'Small-business analytics, executive AI reports, revenue forecasting, and live CRM management.',
    capabilities: [
      'Small Business AI Suite',
      'Business Analytics Dashboard',
      'AI Executive Reports',
      'Customer Pipeline CRM',
    ],
    metric: '360° client telemetry',
    image: PLATFORM_IMAGES.heroCore,
  },
  {
    id: 'ai-video',
    index: '05',
    name: 'AI Video Creator',
    shortTitle: 'AI Video',
    tagline: 'Promotional storyboards, YouTube breakdowns, Instagram Reels scripts, and paid ad creative tools.',
    capabilities: [
      'Promotional Video Creator',
      'Social Media Video Tools',
      'Ad Campaign Script Lab',
      'YouTube & Instagram Kits',
    ],
    metric: '10x faster scripting',
    image: PLATFORM_IMAGES.videoStudio,
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    audience: 'For solo founders and emerging digital stores',
    priceInr: 1499,
    priceUsd: 19,
    creditsLimit: 2500,
    workflowsLimit: '5 active workflows',
    crmLimit: 'Up to 250 CRM accounts',
    videoScripts: '20 scripts / month',
    supportSla: 'Business hours email & UPI desk',
    features: [
      'AI Robot Assistant (2,500 monthly queries)',
      '5 automated email & support workflows',
      'Online Shopping store access & order tracking',
      'Standard AI Business Analytics reports',
      '20 YouTube & Instagram video scripts/mo',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    audience: 'For scaling commerce brands and operating teams',
    priceInr: 4999,
    priceUsd: 59,
    creditsLimit: 15000,
    workflowsLimit: '25 active workflows',
    crmLimit: 'Up to 2,500 CRM accounts',
    videoScripts: '120 scripts / month',
    supportSla: 'Priority 4-hour engineering support',
    highlighted: true,
    features: [
      'AI Robot Assistant (15,000 monthly queries)',
      '25 multi-step business & CRM automations',
      'Full Online Shopping + Affiliate promotion tools',
      'Executive AI insights & cohort telemetry',
      '120 ad, YouTube & Reels production packages/mo',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    audience: 'For multi-division international organizations',
    priceInr: 14999,
    priceUsd: 179,
    creditsLimit: 100000,
    workflowsLimit: 'Unlimited workflows',
    crmLimit: 'Unlimited CRM accounts',
    videoScripts: 'Unlimited scripts',
    supportSla: 'Dedicated solutions engineer (99.95% SLA)',
    features: [
      'AI Robot Assistant (100,000+ monthly queries)',
      'Custom workflow orchestration & webhook triggers',
      'Dedicated commerce storefront & bulk UPI reconciliation',
      'Custom KPI board & executive briefing exports',
      'Unlimited multi-channel video campaign studio',
    ],
  },
];

export const SHOP_PRODUCTS: ProductItem[] = [
  {
    id: 'ez-shell-01',
    sku: 'EZ-APP-101',
    name: 'Meridian Technical Trench Shell',
    category: 'Fashion & Apparel',
    priceInr: 4899,
    originalPriceInr: 6200,
    image: PLATFORM_IMAGES.shopJacket,
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Water-repellent structured matte navy shell tailored for urban travel and crisp executive layering.',
  },
  {
    id: 'ez-runner-02',
    sku: 'EZ-FTW-204',
    name: 'Cobalt Carbon Knit Sneakers',
    category: 'Footwear',
    priceInr: 3699,
    originalPriceInr: 4500,
    image: PLATFORM_IMAGES.shopSneakers,
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    description:
      'Lightweight engineered knit upper with high-rebound obsidian sole and cobalt stabilizer heel.',
  },
  {
    id: 'ez-chrono-03',
    sku: 'EZ-ACC-309',
    name: 'Obsidian Titanium Chrono & Carry Set',
    category: 'Accessories',
    priceInr: 5499,
    originalPriceInr: 6900,
    image: PLATFORM_IMAGES.shopAccessories,
    sizes: ['One Size'],
    description:
      'Brushed dark titanium timepiece paired with matte leather eyewear case and structured canvas travel duffle.',
  },
  {
    id: 'ez-blazer-04',
    sku: 'EZ-APP-118',
    name: 'Monolith Structured Field Coat',
    category: 'Fashion & Apparel',
    priceInr: 4299,
    originalPriceInr: 5100,
    image: PLATFORM_IMAGES.shopJacket,
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Minimalist weather-sealed cotton-nylon blend with concealed storm placket and precision matte hardware.',
  },
  {
    id: 'ez-sprint-05',
    sku: 'EZ-FTW-219',
    name: 'Apex Obsidian Low-Top Trainers',
    category: 'Footwear',
    priceInr: 3299,
    originalPriceInr: 3999,
    image: PLATFORM_IMAGES.shopSneakers,
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    description:
      'Breathable all-day studio trainer built with reinforced arch support and dual-density traction outsole.',
  },
  {
    id: 'ez-aff-06',
    sku: 'EZ-AFF-402',
    name: 'Creator Studio Hardware & Carry Kit',
    category: 'Affiliate Partner',
    priceInr: 6499,
    originalPriceInr: 7999,
    image: PLATFORM_IMAGES.videoStudio,
    sizes: ['Standard Kit'],
    description:
      'Curated affiliate partner bundle for YouTube and Reels creators: acoustic desk kit, lens case, and studio mount.',
    affiliateBadge: 'Partner Deal · 18% Affiliate Commission Eligible',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'Before consolidating with EZ AI WORLD, our support inbox and client CRM lived in four disconnected spreadsheets. Within six weeks, automated triage resolved 64% of tier-1 tickets and recovered 18 hours per week for our account leads.',
    name: 'Arvind Subramanian',
    role: 'Head of Operations',
    company: 'Kaveri Logistics Tech',
    metric: '-64% ticket backlog in 6 weeks',
  },
  {
    quote:
      'Our digital retail drop needed fast ad creatives and streamlined checkout. Using AI Video Creator for Reels scripts alongside the built-in storefront lifted our campaign return on ad spend from 1.9x to 3.4x in one quarter.',
    name: 'Meera Deshmukh',
    role: 'Founder & Creative Director',
    company: 'Vastra Studio Mumbai',
    metric: '3.4x ROAS across Q3 campaign',
  },
  {
    quote:
      'The AI Business Services dashboard gave our finance and sales team one clean source of truth. Executive weekly reports that used to take two days of manual CSV cleanup now generate in thirty seconds.',
    name: 'Daniel Lindqvist',
    role: 'Managing Partner',
    company: 'Nordic Advisory Group',
    metric: '16 hrs/mo saved on reporting',
  },
];
