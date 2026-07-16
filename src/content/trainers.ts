export type TrainerLink = {
  label: string;
  note: string;
  href: string;
};

export type Trainer = {
  id: string;
  name: string;
  role: string;
  bio: string;
  highlights: string[];
  links: TrainerLink[];
  /** Public profile URLs for Person JSON-LD sameAs. */
  sameAs: string[];
};

export const trainers: Trainer[] = [
  {
    id: "christopher-wong",
    name: "Christopher Wong",
    role: "Technical Trainer & Automation Consultant",
    bio: "Christopher Wong brings over a decade of production engineering experience across banking and government — ING Bank Singapore and the Inland Revenue Authority of Singapore — to hands-on AI and automation training for Malaysian SMEs. Every workshop is backed by real, shipped AI work rather than slideware, so participants learn from live, deployed applications built with the very techniques taught in class.",
    highlights: [
      "10+ years production engineering — ING Bank Singapore & IRAS Singapore",
      "Delivers HRD Corp-registered AI and automation workshops",
      "Teaches with live, production AI tools used directly in class",
    ],
    links: [
      {
        label: "SheetClaw",
        note: "Multi-provider LLM Excel add-in",
        href: "https://github.com/cwtf/SheetClaw",
      },
      {
        label: "AI Board Games",
        note: "Live AI gaming platform on Cloudflare",
        href: "https://aiboard.games",
      },
      {
        label: "Wiki Globe",
        note: "Real-time multi-API 3D data demo",
        href: "https://cwtf.github.io/wiki-globe/",
      },
    ],
    sameAs: ["https://github.com/cwtf"],
  },
];

export const trainerMap = new Map(trainers.map((trainer) => [trainer.id, trainer]));
