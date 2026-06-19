import type { CourseCategorySlug, CourseLanguage } from "./courses/schema";

export type ProgramCategory = {
  slug: CourseCategorySlug;
  title: string;
  shortTitle: string;
  summary: string;
  overview: string;
  focusAreas: string[];
  audience: string[];
  deliveryFormats: string[];
  relatedCategorySlugs: CourseCategorySlug[];
};

export const programCategories: ProgramCategory[] = [
  {
    slug: "leadership-management-coaching",
    title: "Leadership, Management & Coaching",
    shortTitle: "Leadership",
    summary: "Build sharper supervisors, managers, and leaders through practical people-management habits.",
    overview:
      "Leadership, management, and coaching programmes help supervisors and managers turn intent into consistent workplace behaviour. The category covers people management, performance conversations, change readiness, coaching habits, motivation, influence, and strategic execution for teams that need clearer direction and stronger accountability.",
    focusAreas: ["Leadership habits", "People management", "Coaching", "Performance", "Change"],
    audience: ["Supervisors", "New managers", "Department heads", "Team leads", "High-potential employees"],
    deliveryFormats: ["Public programmes", "In-house workshops", "Management cohorts", "Team retreats"],
    relatedCategorySlugs: ["communication-personal-effectiveness", "hr-employment-law", "sales-marketing-customer-service"],
  },
  {
    slug: "quality-lean-food-safety",
    title: "Quality, Lean & Food Safety",
    shortTitle: "Quality",
    summary: "Strengthen systems, audits, food safety, and continuous improvement across operations.",
    overview:
      "Quality, lean, and food safety training supports teams responsible for standards, audits, process discipline, and operational improvement. Topics include ISO 9001, ISO 14001, HACCP, GMP, halal and food handling, 5S and 6S, 7QC tools, root cause analysis, lean practice, and practical problem solving.",
    focusAreas: ["ISO systems", "Internal audits", "Food safety", "Lean tools", "Problem solving"],
    audience: ["Quality teams", "Operations managers", "Process owners", "Food safety teams", "Internal auditors"],
    deliveryFormats: ["Public programmes", "In-house workshops", "Audit preparation", "Certification-oriented training"],
    relatedCategorySlugs: ["safety-health-environment", "supply-chain-shipping-warehousing", "microsoft-ai-digital-skills"],
  },
  {
    slug: "safety-health-environment",
    title: "Safety, Health & Environment",
    shortTitle: "Safety",
    summary: "Support safer workplaces with OSH, HIRARC, waste, fire, and emergency readiness.",
    overview:
      "Safety, health, and environment programmes help teams recognize hazards, apply practical controls, and improve daily prevention routines. The category spans OSH awareness, HIRARC, chemical and PPE safety, emergency response, fire safety, first aid, waste handling, ergonomics, and workplace safety coordination.",
    focusAreas: ["OSH awareness", "HIRARC", "Emergency response", "PPE", "Environmental practice"],
    audience: ["Safety committee members", "Operations teams", "Site supervisors", "Facilities teams", "Production employees"],
    deliveryFormats: ["In-house workshops", "Practical demonstrations", "Safety briefings", "Public programmes"],
    relatedCategorySlugs: ["quality-lean-food-safety", "hr-employment-law", "supply-chain-shipping-warehousing"],
  },
  {
    slug: "hr-employment-law",
    title: "HR & Employment Law",
    shortTitle: "HR",
    summary: "Help managers and HR teams handle compliance, discipline, payroll, and workplace policy.",
    overview:
      "HR and employment law training gives HR teams and line managers a clearer foundation for workplace decisions. Programmes cover labour law, employment contracts, payroll compliance, discipline and misconduct, absenteeism, domestic inquiry, PDPA, employee handbooks, and anti-bribery awareness.",
    focusAreas: ["Employment law", "Payroll", "Discipline", "Documentation", "Compliance"],
    audience: ["HR teams", "Line managers", "Business owners", "Payroll administrators", "Department heads"],
    deliveryFormats: ["Public programmes", "In-house briefings", "Manager workshops", "Compliance refreshers"],
    relatedCategorySlugs: ["leadership-management-coaching", "communication-personal-effectiveness", "finance-taxation"],
  },
  {
    slug: "ai",
    title: "AI",
    shortTitle: "AI",
    summary: "Help teams apply AI tools, prompting, and implementation planning with practical workplace judgment.",
    overview:
      "AI programmes help teams move from curiosity to practical application. The category covers prompt engineering, everyday productivity with AI tools, responsible review habits, AI implementation planning, workflow integration, and business use-case development for teams that need useful output without losing professional judgment.",
    focusAreas: ["Prompting", "AI productivity", "Implementation", "Workflow integration", "Responsible review"],
    audience: ["Office teams", "Managers", "Finance teams", "Executives", "Project teams"],
    deliveryFormats: ["Hands-on workshops", "In-house labs", "Public programmes", "Implementation planning"],
    relatedCategorySlugs: ["microsoft-ai-digital-skills", "finance-taxation", "communication-personal-effectiveness"],
  },
  {
    slug: "microsoft-ai-digital-skills",
    title: "Microsoft & Digital Skills",
    shortTitle: "Digital",
    summary: "Upgrade everyday productivity with Excel, Power BI, Microsoft Office, and cyber awareness.",
    overview:
      "Microsoft and digital skills programmes focus on tools people use at work every day. The category includes Excel, Power BI, Microsoft Office productivity, social media execution, cyber awareness, and practical data habits for teams that need faster, cleaner, more confident output.",
    focusAreas: ["Excel", "Power BI", "Office productivity", "Cyber awareness", "Digital productivity"],
    audience: ["Office teams", "Executives", "Analysts", "Managers", "Sales and marketing teams"],
    deliveryFormats: ["Hands-on workshops", "In-house labs", "Public programmes", "Blended practice"],
    relatedCategorySlugs: ["ai", "finance-taxation", "sales-marketing-customer-service"],
  },
  {
    slug: "sales-marketing-customer-service",
    title: "Sales, Marketing & Customer Service",
    shortTitle: "Sales",
    summary: "Improve selling, service conversations, retail performance, and digital marketing execution.",
    overview:
      "Sales, marketing, and customer service programmes help customer-facing teams communicate value, handle objections, manage complaints, and improve service consistency. The category spans selling skills, customer care, hospitality, retail, negotiation, digital marketing, and complaint handling.",
    focusAreas: ["Selling skills", "Customer care", "Complaint handling", "Digital marketing", "Retail service"],
    audience: ["Sales teams", "Customer service teams", "Retail staff", "Front-line supervisors", "Marketing teams"],
    deliveryFormats: ["In-house workshops", "Role-play sessions", "Public programmes", "Service refreshers"],
    relatedCategorySlugs: ["communication-personal-effectiveness", "leadership-management-coaching", "microsoft-ai-digital-skills"],
  },
  {
    slug: "finance-taxation",
    title: "Finance & Taxation",
    shortTitle: "Finance",
    summary: "Give non-finance teams the confidence to read numbers and make better business decisions.",
    overview:
      "Finance and taxation programmes help non-finance teams understand the numbers behind business performance. Topics include financial statements, cost and cash-flow thinking, credit control, accounting systems, transfer pricing, e-invoicing, and practical decision-making with financial information.",
    focusAreas: ["Financial literacy", "Cost control", "Credit control", "E-invoicing", "Business analysis"],
    audience: ["Non-finance managers", "Business owners", "Department heads", "Administrators", "Finance support teams"],
    deliveryFormats: ["Public programmes", "In-house workshops", "Executive briefings", "Hands-on exercises"],
    relatedCategorySlugs: ["ai", "microsoft-ai-digital-skills", "supply-chain-shipping-warehousing"],
  },
  {
    slug: "supply-chain-shipping-warehousing",
    title: "Supply Chain, Shipping & Warehousing",
    shortTitle: "Supply chain",
    summary: "Sharpen the practical skills behind procurement, shipping, inventory, and warehouse control.",
    overview:
      "Supply chain, shipping, and warehousing programmes support teams managing goods, documents, inventory, and supplier or customer commitments. Training covers warehouse control, inventory accuracy, store management, shipping fundamentals, Incoterms 2020, procurement, and logistics coordination.",
    focusAreas: ["Warehouse control", "Inventory", "Shipping", "Incoterms", "Procurement"],
    audience: ["Supply chain professionals", "Logistics managers", "Warehouse supervisors", "Import/export officers", "Procurement teams"],
    deliveryFormats: ["Public programmes", "In-house workshops", "Operational refreshers", "Scenario-based training"],
    relatedCategorySlugs: ["quality-lean-food-safety", "finance-taxation", "safety-health-environment"],
  },
  {
    slug: "communication-personal-effectiveness",
    title: "Communication & Personal Effectiveness",
    shortTitle: "Communication",
    summary: "Improve the everyday habits behind clearer communication, teamwork, and personal productivity.",
    overview:
      "Communication and personal effectiveness programmes strengthen the habits that make work easier to coordinate. The category covers presentation, interpersonal communication, NLP, teamwork, time management, problem solving, decision making, personal productivity, and practical team alignment.",
    focusAreas: ["Communication", "Teamwork", "Presentation", "Problem solving", "Productivity"],
    audience: ["Executives", "Project teams", "Team leads", "Customer-facing staff", "Cross-functional teams"],
    deliveryFormats: ["In-house workshops", "Team sessions", "Public programmes", "Activity-based learning"],
    relatedCategorySlugs: ["leadership-management-coaching", "sales-marketing-customer-service", "hr-employment-law"],
  },
];

export const programCategoryMap = new Map(programCategories.map((category) => [category.slug, category]));

export const durationFilters = [
  { value: "all", label: "All durations" },
  { value: "0.5", label: "1/2 day" },
  { value: "1", label: "1 day" },
  { value: "2", label: "2 days" },
  { value: "3", label: "3 days" },
] as const;

export const languageFilters: Array<{ value: "all" | CourseLanguage; label: string }> = [
  { value: "all", label: "All languages" },
  { value: "en", label: "English" },
  { value: "ms", label: "Bahasa Malaysia" },
  { value: "en+ms", label: "English + BM" },
];

export function formatDuration(days: number) {
  if (days === 0.5) return "1/2 day";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export function formatLanguage(language: CourseLanguage) {
  if (language === "ms") return "Bahasa Malaysia";
  if (language === "en+ms") return "English + BM";
  return "English";
}
