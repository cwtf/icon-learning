export const courseCategorySlugs = [
  "leadership-management-coaching",
  "quality-lean-food-safety",
  "safety-health-environment",
  "hr-employment-law",
  "microsoft-ai-digital-skills",
  "sales-marketing-customer-service",
  "finance-taxation",
  "supply-chain-shipping-warehousing",
  "communication-personal-effectiveness",
] as const;

export const courseLanguages = ["en", "ms", "en+ms"] as const;

export const deliveryFormats = [
  "Public",
  "In-house",
  "Workshop",
  "Certification",
  "Blended",
] as const;

export type CourseCategorySlug = (typeof courseCategorySlugs)[number];
export type CourseLanguage = (typeof courseLanguages)[number];
export type DeliveryFormat = (typeof deliveryFormats)[number];

export type CourseModule = {
  day?: number;
  title: string;
};

export type CourseMethodologyMix = {
  interactiveLectures?: number;
  handsOnExercises?: number;
  groupActivities?: number;
  demonstrations?: number;
  rolePlaying?: number;
  selfAssessment?: number;
};

export type Course = {
  slug: string;
  title: string;
  subtitle?: string;
  categorySlug: CourseCategorySlug;
  durationDays: 0.5 | 1 | 2 | 3;
  hrdClaimable: boolean;
  language: CourseLanguage;
  deliveryFormats: DeliveryFormat[];
  whyThisMatters: string;
  builtFor: string[];
  walkAwayWith: string[];
  modules: CourseModule[];
  methodology?: CourseMethodologyMix;
  methodologyCaption?: string;
  sourceDoc: string;
  relatedSlugs?: string[];
};

export function isCourseCategorySlug(value: string): value is CourseCategorySlug {
  return courseCategorySlugs.includes(value as CourseCategorySlug);
}
