import { site } from "./site";
import acerLogo from "../../assets/source/logos/clients/acer.png";
import dnpLogo from "../../assets/source/logos/clients/dnp.png";
import ifrcLogo from "../../assets/source/logos/clients/ifrc.png";
import peroduaLogo from "../../assets/source/logos/clients/perodua.png";
import protonLogo from "../../assets/source/logos/clients/proton.png";
import publicisLogo from "../../assets/source/logos/clients/publicis.png";
import qlLogo from "../../assets/source/logos/clients/ql.png";
import tescoLogo from "../../assets/source/logos/clients/tesco.png";

export const homeHero = {
  eyebrow: "HRD Corp claimable training provider",
  headline: "Corporate training that moves work forward",
  sub: "Icon Learning helps Malaysian teams build practical skills through HRD-claimable programs, ISO consultancy, and customized in-house training.",
  primaryCta: {
    label: "Request training",
    href: "/contact",
  },
  secondaryCta: {
    label: "View programs",
    href: "/programs",
  },
};

export const ctaCloser = {
  heading: "Ready to plan your next training?",
  sub: "Tell us what your team needs, the preferred dates, and whether you want HRD-claimable options. We will point you to the right program or outline.",
  primaryCta: {
    label: "WhatsApp us",
    href: site.whatsappHref,
  },
  secondaryCta: {
    label: "Email inquiry",
    href: site.emailHref,
  },
};

const clientLogos = [
  { name: "Acer", src: acerLogo },
  { name: "DNP", src: dnpLogo },
  { name: "IFRC", src: ifrcLogo },
  { name: "Perodua", src: peroduaLogo },
  { name: "Proton", src: protonLogo },
  { name: "Publicis", src: publicisLogo },
  { name: "QL", src: qlLogo },
  { name: "Tesco", src: tescoLogo },
];

export const proofBento = {
  eyebrow: "Proof in practice",
  heading: "Built for teams that need training to work on Monday",
  description:
    "A first look at Icon Learning's enterprise proof points, ready to expand with workshop photography and approved testimonials.",
  items: [
    {
      type: "proof",
      column: 1,
      speed: -18,
      eyebrow: "Established",
      heading: "Since 2011",
      body: "Icon Learning has supported Malaysian teams with corporate training, strategic consulting, and ISO management system consultancy.",
    },
    {
      type: "logoCloud",
      column: 1,
      speed: 12,
      eyebrow: "Clients",
      heading: "Trusted across industries",
      logos: clientLogos.slice(0, 4),
    },
    {
      type: "feature",
      column: 2,
      speed: 22,
      eyebrow: "HRD Corp",
      heading: "Claimable training, without the paperwork tone",
      body: "HRD Corp claimable programs stay visible for buyers while the experience remains practical, clear, and commercially focused.",
    },
    {
      type: "quote",
      column: 2,
      speed: -10,
      quote: "Transforming people. Powering performance. Delivering results.",
      attribution: "Icon Learning brand line",
    },
    {
      type: "logoCloud",
      column: 3,
      speed: -16,
      eyebrow: "More teams",
      heading: "Recognizable Malaysian brands",
      logos: clientLogos.slice(4),
    },
    {
      type: "feature",
      column: 3,
      speed: 18,
      eyebrow: "Consultancy",
      heading: "ISO and quality systems alongside training",
      body: "The homepage proof wall can carry both learning programs and consultancy credentials without turning into a brochure grid.",
    },
  ],
} as const;

export const coursesShowcase = {
  eyebrow: "Program categories",
  heading: "Find the training lane that fits the work",
  description:
    "Browse the six most requested category families, then jump into the full catalog when you are ready to compare formats, durations, and team needs.",
  browseAllCta: {
    label: "Browse all 9 categories",
    href: "/programs",
  },
  categories: [
    {
      slug: "leadership-management-coaching",
      title: "Leadership, Management & Coaching",
      summary: "Build sharper supervisors, managers, and leaders through practical people-management habits.",
      intro:
        "Leadership programs focus on the everyday work of guiding people, setting priorities, and improving team performance. They can support new supervisors, experienced managers, and teams going through change.",
      topics: ["Leadership", "Coaching", "Performance", "Change"],
      courses: [
        "Leadership Boot Camp",
        "Leadership + People Management",
        "Supervisory Development Program",
        "Performance Management via KRA and KPI",
      ],
    },
    {
      slug: "quality-lean-food-safety",
      title: "Quality, Lean & Food Safety",
      summary: "Strengthen systems, audits, food safety, and continuous improvement across operations.",
      intro:
        "This category covers quality systems, ISO awareness, internal auditing, food safety, lean tools, and structured problem solving. It is built for teams responsible for standards, consistency, and operational discipline.",
      topics: ["ISO 9001", "HACCP", "GMP", "Lean"],
      courses: [
        "ISO 9001 QMS Awareness",
        "HACCP Internal Quality Audit",
        "MS 1514-2022 GMP",
        "Root Cause Analysis",
      ],
    },
    {
      slug: "safety-health-environment",
      title: "Safety, Health & Environment",
      summary: "Support safer workplaces with OSH, HIRARC, waste, fire, and emergency readiness.",
      intro:
        "Safety, health, and environment courses help operational teams identify risks, respond clearly, and meet workplace safety responsibilities. Programs range from committee training to hands-on emergency and equipment safety topics.",
      topics: ["OSH", "HIRARC", "First Aid", "Fire Safety"],
      courses: [
        "Occupational Safety & Health at Workplace",
        "Hazard Identification Risk Assessment & Risk Control",
        "First Aid CPR at Work",
        "Fire Safety Training for Fire Squad",
      ],
    },
    {
      slug: "hr-employment-law",
      title: "HR & Employment Law",
      summary: "Help managers and HR teams handle compliance, discipline, payroll, and workplace policy.",
      intro:
        "HR and employment law training gives teams a clearer way to manage people issues without drifting into avoidable compliance risk. It is useful for HR teams, department heads, and non-HR managers.",
      topics: ["Employment Act", "Payroll", "PDPA", "Discipline"],
      courses: [
        "HR for Non-HR Managers",
        "Understanding the Labour Law",
        "How to Conduct a Domestic Inquiry",
        "Anti-Bribery & Anti-Corruption",
      ],
    },
    {
      slug: "microsoft-ai-digital-skills",
      title: "Microsoft, AI & Digital Skills",
      summary: "Upgrade everyday productivity with Excel, Power BI, AI, and cyber awareness.",
      intro:
        "Digital skills programs are designed for practical workplace use, from spreadsheet confidence to dashboard reporting and safer online habits. The category also includes AI and prompt-engineering topics for modern teams.",
      topics: ["Excel", "Power BI", "AI", "Cybersecurity"],
      courses: [
        "Microsoft Excel Advanced Conditional Formatting",
        "Power BI Desktop",
        "Work Smarter, Prompt Better",
        "Human Firewall Initiative",
      ],
    },
    {
      slug: "sales-marketing-customer-service",
      title: "Sales, Marketing & Customer Service",
      summary: "Improve selling, service conversations, retail performance, and digital marketing execution.",
      intro:
        "Commercial and service programs help customer-facing teams communicate value, handle objections, and improve the customer experience. Topics span sales skills, retail, social media, and complaint handling.",
      topics: ["Sales", "Customer Care", "Digital Marketing", "Negotiation"],
      courses: [
        "High Impact Selling Skills",
        "Digital Marketing Zero to Hero",
        "Customer Care Workshop",
        "Complaints Management",
      ],
    },
  ],
} as const;

export const trainingApproach = {
  eyebrow: "Training approach",
  heading: "A practical path from need to follow-through",
  description:
    "Each engagement starts with the work your team needs to improve, then shapes the program around delivery format, audience, and practical next steps.",
  steps: [
    {
      eyebrow: "Discover",
      heading: "Understand the team need and business context",
      body: "Before proposing a course, Icon Learning clarifies the audience, current challenges, and outcomes the team needs to see after training.",
      points: [
        "Map goals, roles, and constraints before choosing a program.",
        "Separate must-have outcomes from nice-to-have topics.",
        "Identify whether public, in-house, or blended delivery fits best.",
      ],
      media: {
        eyebrow: "Needs map",
        title: "Context before content",
        items: ["Audience", "Goals", "Constraints", "Format"],
        footer: "Discover",
      },
    },
    {
      eyebrow: "Customize",
      heading: "Adapt the content to the workplace reality",
      body: "Programs can be tuned for public runs, in-house teams, or focused workshops so examples and activities stay relevant to the people in the room.",
      points: [
        "Adjust emphasis without turning the program into a one-off maze.",
        "Use workplace examples that make the learning easier to apply.",
        "Keep HRD-claimable requirements visible where they are confirmed.",
      ],
      media: {
        eyebrow: "Program fit",
        title: "Right-sized delivery",
        items: ["Public", "In-house", "Workshop", "Blended"],
        footer: "Customize",
      },
    },
    {
      eyebrow: "Deliver",
      heading: "Run practical workshops with clear participation",
      body: "Delivery focuses on usable skills, guided discussion, exercises, and trainer-led structure rather than passive slide reading.",
      points: [
        "Keep sessions active through discussion, practice, and reflection.",
        "Connect frameworks to decisions people make at work.",
        "Give teams enough structure to leave with a shared language.",
      ],
      media: {
        eyebrow: "Workshop flow",
        title: "Practical session design",
        items: ["Briefing", "Practice", "Discussion", "Action"],
        footer: "Deliver",
      },
    },
    {
      eyebrow: "Reinforce",
      heading: "Turn the session into action after training",
      body: "The close of the program points learners back to application through action plans, assessments, or follow-up where the engagement calls for it.",
      points: [
        "Capture practical commitments while the learning is fresh.",
        "Use assessments or follow-up only when they add value.",
        "Help managers see what support learners may need next.",
      ],
      media: {
        eyebrow: "Follow-through",
        title: "From workshop to workplace",
        items: ["Action plan", "Assessment", "Manager notes", "Follow-up"],
        footer: "Reinforce",
      },
    },
  ],
} as const;

export const serviceSolutions = {
  eyebrow: "Services and solutions",
  heading: "Three ways to bring the training into the work",
  description:
    "Start with a public program, bring a workshop in-house, or pair training with ISO and quality management support.",
  items: [
    {
      eyebrow: "Corporate training",
      title: "Corporate Training Programs",
      description:
        "Practical programs across leadership, HR, quality, safety, digital skills, sales, service, and communication for Malaysian teams.",
      points: ["Public runs", "In-house workshops", "HRD Corp claimable where confirmed", "Team skill gaps"],
      href: "/programs",
    },
    {
      eyebrow: "Consultancy",
      title: "ISO & Quality Management Solutions",
      description:
        "Support for teams working on quality systems, audits, food safety, lean practice, and structured problem solving.",
      points: ["ISO", "Audits", "Food safety", "Lean"],
      href: "/programs/quality-lean-food-safety",
    },
    {
      eyebrow: "Technical and safety",
      title: "Technical & Safety Training",
      description:
        "Operational programs for workplace safety, health, environment, emergency response, and equipment-related awareness.",
      points: ["OSH", "HIRARC", "Fire safety", "First aid"],
      href: "/programs/safety-health-environment",
    },
  ],
} as const;

export const outcomesProof = {
  eyebrow: "Outcomes and proof",
  heading: "Proof points without inflated numbers",
  description:
    "Until Icon Learning confirms broader metrics, this section surfaces only facts already supported by the current catalog structure and company positioning.",
  items: [
    {
      label: "Established",
      value: "Since 2011",
      description:
        "Icon Learning has been operating since 2011, supporting teams through corporate training and consultancy.",
    },
    {
      label: "Catalog breadth",
      value: "9",
      countTo: 9,
      description:
        "Top-level program categories structure the catalog, from leadership and HR to safety, quality, digital skills, and more.",
    },
    {
      label: "Homepage focus",
      value: "6",
      countTo: 6,
      description:
        "Priority category families are surfaced on the homepage so buyers can scan the most requested training lanes quickly.",
    },
    {
      label: "Engagement lanes",
      value: "3",
      countTo: 3,
      description:
        "Corporate training, ISO consultancy, and customized in-house learning stay visible as distinct ways to work with the team.",
    },
  ],
} as const;
