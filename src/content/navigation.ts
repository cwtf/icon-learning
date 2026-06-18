import { site } from "./site";

export const navigationItems = [
  {
    label: "Programs",
    href: "/#categories",
    children: [{ label: "View Full Catalog", href: "/programs/?hrdClaimable=true" }],
  },
  { label: "Solutions", href: "/#services" },
  { label: "Clients", href: "/#home-clients" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

export const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Programs", href: "/programs" },
      { label: "About us", href: "/about-us" },
      { label: "Clients", href: "/clients" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "HRD claimable programs", href: "/programs?hrdClaimable=true" },
      { label: "Leadership & coaching", href: "/programs/leadership-management-coaching" },
      { label: "Quality & food safety", href: "/programs/quality-lean-food-safety" },
      { label: "Safety & health", href: "/programs/safety-health-environment" },
      { label: "Digital skills", href: "/programs/microsoft-ai-digital-skills" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Accessibility", href: "/accessibility-statement" },
      { label: "Email inquiry", href: site.emailHref },
      { label: "WhatsApp", href: site.whatsappHref },
    ],
  },
];
