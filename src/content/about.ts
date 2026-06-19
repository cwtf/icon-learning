import { site } from "./site";

export const aboutPage = {
  title: "About Icon Learning & Development",
  description:
    "Learn how Icon Learning & Development supports Malaysian teams through corporate training, strategic consulting, and ISO management system consultancy.",
  hero: {
    eyebrow: "About Icon Learning",
    heading: "Practical training and consultancy for teams that need work to move.",
    sub:
      "Icon Learning & Development Sdn Bhd helps Malaysian organisations plan training, strengthen workplace capability, and support quality management goals without losing sight of day-to-day work.",
    primaryCta: {
      label: "View programs",
      href: "/programs",
    },
    secondaryCta: {
      label: "Request training",
      href: "/contact",
    },
  },
  story: {
    eyebrow: "Company story",
    heading: "Established on 15 December 2011",
    body:
      "Icon Learning & Development Sdn Bhd was established on 15 December 2011 and is registered under company number 0971709-M (201101043589). The company supports corporate training, strategic consulting, and ISO management system consultancy for organisations that want practical improvement, clearer standards, and stronger workplace capability.",
    facts: [
      { label: "Established", value: "15 Dec 2011" },
      { label: "Registration", value: site.registrationNumber },
      { label: "Office", value: "Sri Petaling, Kuala Lumpur" },
    ],
  },
  services: {
    eyebrow: "What we do",
    heading: "Three ways Icon Learning supports your team",
    items: [
      {
        title: "Corporate training",
        body:
          "Public and in-house programmes across leadership, HR, quality, safety, digital skills, service, finance, supply chain, and communication.",
        tags: ["Public runs", "In-house workshops", "Team capability"],
      },
      {
        title: "Strategic consulting",
        body:
          "Focused support for organisations that need to clarify priorities, improve execution, or shape training around business needs.",
        tags: ["Business context", "Custom focus", "Practical follow-through"],
      },
      {
        title: "ISO management system consultancy",
        body:
          "Consultancy and training support for teams working with quality systems, audits, food safety, operational discipline, and continuous improvement.",
        tags: ["ISO systems", "Audits", "Quality practice"],
      },
    ],
  },
  philosophy: {
    eyebrow: "Training philosophy",
    heading: "Keep the room connected to the work",
    body:
      "A good programme should help people recognise the problem, practise the behaviour, and leave with language they can use back at work. Icon Learning keeps sessions practical through discussion, examples, activities, and adaptation to the audience.",
    principles: [
      "Start with the team need before choosing the programme.",
      "Use examples and exercises that match the workplace reality.",
      "Balance trainer input with practice, discussion, and reflection.",
      "Keep HRD Corp claimable positioning visible only where it is confirmed.",
    ],
  },
  expertise: {
    eyebrow: "Trainer expertise",
    heading: "A broad trainer and consultant network",
    body:
      "Icon Learning works with trainers and consultants across different fields, allowing programmes to be matched to the subject area, delivery format, and team context. The goal is not to make every session feel the same; it is to keep every session useful.",
    stats: [
      { label: "Program categories", value: "10" },
      { label: "Engagement lanes", value: "3" },
      { label: "Brand promise", value: "Results" },
    ],
  },
  values: {
    eyebrow: "Values",
    heading: "What shapes the work",
    items: [
      {
        title: "Practicality",
        body: "Training should help people make better decisions at work, not just collect notes.",
      },
      {
        title: "Clarity",
        body: "Programmes, outcomes, and inquiry paths should be easy for buyers and learners to understand.",
      },
      {
        title: "Fit",
        body: "Public, in-house, workshop, and blended formats should be chosen around the audience and goal.",
      },
      {
        title: "Follow-through",
        body: "The end of a session should point participants toward action, application, or the next conversation.",
      },
    ],
  },
  cta: {
    heading: "Planning training or consultancy support?",
    sub:
      "Share the team need, preferred dates, and delivery format. Icon Learning will point you to a relevant programme or next step.",
    primaryCta: {
      label: "WhatsApp us",
      href: site.whatsappHref,
    },
    secondaryCta: {
      label: "Browse programs",
      href: "/programs",
    },
  },
} as const;
