import { site } from "./site";

export const accessibilityPage = {
  title: "Accessibility Statement | Icon Learning",
  description:
    "Icon Learning is working toward WCAG 2.2 AA accessibility for its website. Contact us for accessibility support or feedback.",
  lastUpdated: "21 May 2026",
  hero: {
    eyebrow: "Accessibility",
    heading: "Accessibility statement",
    sub:
      "Icon Learning wants this website to be usable by as many people as possible, including people who use assistive technologies or browse with keyboard, touch, zoom, or reduced-motion settings.",
  },
  commitment: {
    eyebrow: "Target",
    heading: "Working toward WCAG 2.2 AA",
    body:
      "The redesign targets the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. This is a working commitment, not a claim that every page is already perfect. As the site grows, accessibility checks should stay part of design, content, development, and QA.",
  },
  measures: [
    "Use semantic headings, landmarks, labels, and links so pages are easier to navigate with assistive technology.",
    "Keep text contrast, focus states, and tap targets visible across responsive layouts.",
    "Support keyboard navigation for menus, tabs, filters, carousels, forms, and disclosure sections.",
    "Respect reduced-motion preferences for reveal, hover, and count-up interactions.",
    "Keep page language set to English Malaysia by default, with Bahasa Malaysia course pages marked separately where applicable.",
  ],
  knownLimitations: [
    "Some source documents and course outlines may not yet be fully remediated for accessibility because the public site currently publishes summary pages rather than downloadable outlines.",
    "Third-party destinations such as WhatsApp, email clients, Google Maps, and external sites are outside Icon Learning's direct control.",
    "Client logos and brand images depend on supplied artwork quality, but alternative text is provided where logos appear.",
  ],
  feedback: {
    heading: "Need help or found an issue?",
    body:
      "If you have trouble using any part of the website, contact Icon Learning with the page URL, the issue you experienced, and the assistive technology or browser you were using if relevant.",
    contacts: [
      { label: "Email", value: site.email, href: site.emailHref },
      { label: "WhatsApp", value: site.phone, href: site.whatsappHref },
      { label: "Phone", value: site.phone, href: site.phoneHref },
    ],
  },
  review: {
    heading: "Review approach",
    body:
      "Accessibility should be reviewed during content updates, new page launches, and pre-launch QA. The final launch pass should include keyboard checks, screen-reader spot checks, automated audits, and manual inspection of forms and navigation.",
  },
} as const;
