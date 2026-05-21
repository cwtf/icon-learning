import { site } from "./site";

export const contactPage = {
  title: "Contact Icon Learning - Request Corporate Training",
  description:
    "Contact Icon Learning to request corporate training, in-house programmes, ISO consultancy, or course outlines for Malaysian teams.",
  hero: {
    eyebrow: "Contact",
    heading: "Tell us what your team needs next",
    sub:
      "Share the course, audience, team size, and preferred dates. Icon Learning will help you choose the right outline, format, or next conversation.",
  },
  form: {
    eyebrow: "Training inquiry",
    heading: "Request a programme or outline",
    note:
      "This static form opens a prepared email draft so your inquiry stays in your email client. Course pages can prefill the training interest field automatically.",
    formats: ["Public programme", "In-house workshop", "Blended learning", "ISO consultancy", "Not sure yet"],
    teamSizes: ["1-5", "6-15", "16-30", "31-50", "50+"],
  },
  contactMethods: [
    {
      label: "WhatsApp",
      value: site.phone,
      href: site.whatsappHref,
      note: "Fastest for course-outline requests and date checks.",
    },
    {
      label: "Email",
      value: site.email,
      href: site.emailHref,
      note: "Best for RFQs, attachments, and internal approval trails.",
    },
    {
      label: "Phone",
      value: site.phone,
      href: site.phoneHref,
      note: "Call during office hours for a quick conversation.",
    },
    {
      label: "Address",
      value: site.address,
      href: "https://www.google.com/maps/search/?api=1&query=No%201%2C%20Jalan%20Radin%205%2C%2057000%20Sri%20Petaling%2C%20Kuala%20Lumpur",
      note: "Sri Petaling, Kuala Lumpur.",
    },
    {
      label: "Hours",
      value: site.openingHours,
      href: undefined,
      note: "Monday to Friday.",
    },
  ],
  quickActions: [
    {
      label: "WhatsApp us",
      href: site.whatsappHref,
    },
    {
      label: "Email inquiry",
      href: site.emailHref,
    },
  ],
  faqs: [
    {
      question: "Is the training HRD Corp claimable?",
      answer:
        "Ask during inquiry. Icon Learning will confirm HRD Corp claimable status for the specific programme before you proceed.",
    },
    {
      question: "Can a programme run in-house?",
      answer:
        "Yes. Many programmes can run as in-house workshops when the audience, preferred date, and delivery format are clear.",
    },
    {
      question: "What team size should I share?",
      answer:
        "Share an estimate, even if it changes later. Team size helps Icon Learning advise the format, trainer planning, and quotation.",
    },
    {
      question: "Do you deliver in English and Bahasa Malaysia?",
      answer:
        "Some programmes are available in English, Bahasa Malaysia, or both. Confirm the preferred language in your inquiry.",
    },
    {
      question: "How long after inquiry will I hear back?",
      answer:
        "Response timing depends on the request and office hours. WhatsApp is the fastest option for urgent outline or date checks.",
    },
  ],
} as const;
