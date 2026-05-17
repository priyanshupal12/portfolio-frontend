export type Market = "in" | "ar" | "us" | "uk" | "au";
export type Locale = string;

export type SanityConfig = {
  project_ID: string;
  dataset: string;
  apiVersion: string;
  useCdn: boolean;
};

export type GlobalContent = {
  nav: unknown | null;
  footer: unknown | null;
  source: string;
  market: string;
  locale: string;
};

// export type SanityOutput = {
//   nav: object | null;
//   footer: object | null;
//   source: "fallback";
//   market: "";
//   locale: "";
// };

export type QueryParams = Record<string, unknown>;
