import acerLogo from "../../assets/source/logos/clients/acer.png";
import cuckooLogo from "../../assets/source/logos/clients/cuckoo.png";
import dbeLogo from "../../assets/source/logos/clients/dbe.png";
import dnpLogo from "../../assets/source/logos/clients/dnp.png";
import ffkrLogo from "../../assets/source/logos/clients/ffkr.png";
import fohSanLogo from "../../assets/source/logos/clients/Foh-San.png";
import freescaleLogo from "../../assets/source/logos/clients/freescale-semiconductor.png";
import harumiLogo from "../../assets/source/logos/clients/harumi.png";
import ifrcLogo from "../../assets/source/logos/clients/ifrc.png";
import indofoodLogo from "../../assets/source/logos/clients/indofood.png";
import jabatanPerumahanLogo from "../../assets/source/logos/clients/Jabatan-Perumahan-Negara.png";
import jinXuanLogo from "../../assets/source/logos/clients/jin-xuan.png";
import kelingtonLogo from "../../assets/source/logos/clients/Kelington.png";
import peroduaLogo from "../../assets/source/logos/clients/perodua.png";
import poloClubLogo from "../../assets/source/logos/clients/Polo-Club.png";
import protonLogo from "../../assets/source/logos/clients/proton.png";
import publicisLogo from "../../assets/source/logos/clients/publicis.png";
import qlLogo from "../../assets/source/logos/clients/ql.png";
import recronLogo from "../../assets/source/logos/clients/recron.png";
import tancoLogo from "../../assets/source/logos/clients/tanco.png";
import tanjongExpressLogo from "../../assets/source/logos/clients/tanjongex.png";
import tescoLogo from "../../assets/source/logos/clients/tesco.png";
import uacLogo from "../../assets/source/logos/clients/uac-bhd.png";
import zitronLogo from "../../assets/source/logos/clients/Zitron-transparent.png";
import { site } from "./site";

type ClientLogo = {
  name: string;
  src: string | { src: string; width?: number; height?: number };
  meta: string;
};

type ClientGroup = {
  title: string;
  summary: string;
  logos: ClientLogo[];
};

export const clientsPage = {
  title: "Trusted by Malaysian Companies - Icon Learning Clients",
  description:
    "See selected public client logos and how companies work with Icon Learning through training, ISO consultancy, and technical programmes.",
  hero: {
    eyebrow: "Clients",
    heading: "Trusted by companies across Malaysia",
    primaryCta: {
      label: "Request training",
      href: "/contact",
    },
    secondaryCta: {
      label: "View programs",
      href: "/programs",
    },
  },
  engagementTypes: [
    {
      title: "Corporate training",
      body:
        "Public and in-house programmes for leadership, HR, finance, service, communication, digital skills, and other workplace capability needs.",
      href: "/programs",
    },
    {
      title: "ISO consultancy and quality systems",
      body:
        "Support for companies working on ISO management systems, audits, quality discipline, food safety, and continuous improvement.",
      href: "/programs/quality-lean-food-safety",
    },
    {
      title: "Safety and technical training",
      body:
        "Practical training lanes for OSH, safety awareness, emergency readiness, supply chain, warehousing, and operational teams.",
      href: "/programs/safety-health-environment",
    },
  ],
  cta: {
    heading: "Want to plan training for your team?",
    sub:
      "Share the audience, topic, location, preferred dates, and delivery format. Icon Learning will help you choose a relevant programme or shape an in-house session.",
    primaryCta: {
      label: "WhatsApp us",
      href: site.whatsappHref,
    },
    secondaryCta: {
      label: "Email inquiry",
      href: site.emailHref,
    },
  },
} as const;

export const clientGroups: ClientGroup[] = [
  {
    title: "Manufacturing, engineering and infrastructure",
    summary: "",
    logos: [
      { name: "Acer", src: acerLogo, meta: "Technology" },
      { name: "DNP", src: dnpLogo, meta: "Manufacturing" },
      { name: "Freescale Semiconductor", src: freescaleLogo, meta: "Electronics" },
      { name: "Kelington", src: kelingtonLogo, meta: "Engineering" },
      { name: "Perodua", src: peroduaLogo, meta: "Automotive" },
      { name: "Proton", src: protonLogo, meta: "Automotive" },
      { name: "QL", src: qlLogo, meta: "Manufacturing" },
      { name: "Recron", src: recronLogo, meta: "Manufacturing" },
      { name: "Tanco", src: tancoLogo, meta: "Infrastructure" },
      { name: "Tanjong Express", src: tanjongExpressLogo, meta: "Logistics" },
      { name: "UAC Bhd", src: uacLogo, meta: "Building materials" },
      { name: "DBE", src: dbeLogo, meta: "Industry" },
      { name: "Zitron", src: zitronLogo, meta: "Technology" },
    ],
  },
  {
    title: "Consumer, food and retail",
    summary: "",
    logos: [
      { name: "Cuckoo", src: cuckooLogo, meta: "Consumer" },
      { name: "Foh San", src: fohSanLogo, meta: "Food" },
      { name: "Harumi", src: harumiLogo, meta: "Consumer" },
      { name: "Indofood", src: indofoodLogo, meta: "Food" },
      { name: "Jin Xuan", src: jinXuanLogo, meta: "Food" },
      { name: "Polo Club", src: poloClubLogo, meta: "Retail" },
      { name: "Tesco", src: tescoLogo, meta: "Retail" },
    ],
  },
  {
    title: "Public, nonprofit and agency",
    summary: "",
    logos: [
      { name: "FFKR", src: ffkrLogo, meta: "Organisation" },
      { name: "IFRC", src: ifrcLogo, meta: "Nonprofit" },
      { name: "Jabatan Perumahan Negara", src: jabatanPerumahanLogo, meta: "Public sector" },
      { name: "Publicis", src: publicisLogo, meta: "Agency" },
    ],
  },
];
