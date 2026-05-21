import type { GlobalContent, Market, Locale } from "@/types/localizeTypes";
import { ALLOWED_MARKETS } from "@/constents/localizeVars";
import { ALLOWED_LOCALE } from "@/constents/localizeVars";
import { isSanityConfig, querySanity } from "../client";
import { CHROME_QUERY } from "./query/globalQuery";

function normalizeMarket(market: string): Market {
  if (ALLOWED_MARKETS.has(market)) return market as Market;
  return "in";
}

function normalizeLocale(locale: string, normalizedMarket: Market): Locale {
  const normalizedLocale = ALLOWED_LOCALE[normalizedMarket as Market] || ["en"];
  if (normalizedLocale.includes(locale)) return locale as Locale;
  return normalizedLocale[0];
}

function normalizeMarketLocalePair(
  locale: string,
  market: string,
): { market: Market; locale: Locale } {
  const normalizedMarket = normalizeMarket(market);
  const normalizedLocale = normalizeLocale(locale, normalizedMarket);
  return { market: normalizedMarket, locale: normalizedLocale };
}

async function fetchSanityContent(normalizedMarketLangPair: {
  market: Market;
  locale: Locale;
}) {
  return querySanity({
    query: CHROME_QUERY,
    param: normalizedMarketLangPair,
  });
}

function normalizeGlobalDocument(document: unknown): Pick<GlobalContent, "nav" | "footer"> {
  if (!document || typeof document !== "object") {
    return { nav: null, footer: null };
  }

  const record = document as Record<string, unknown>;
  return {
    nav: record.nav ?? null,
    footer: record.footer ?? null,
  };
}

export async function getGlobalContent(
  locale: string,
  market: string,
): Promise<GlobalContent> {
  const normalizedMarketLocalePair = normalizeMarketLocalePair(locale, market);
  if (!isSanityConfig()) {
    return {
      nav: null,
      footer: null,
      source: "fallback",
      market: "",
      locale: ""
    };
  }
  try {
    const document = await fetchSanityContent(normalizedMarketLocalePair);
    const safeDocument = normalizeGlobalDocument(document);
    return {
      nav: safeDocument.nav,
      footer: safeDocument.footer,
      source: "sanity",
      market: normalizedMarketLocalePair.market,
      locale: normalizedMarketLocalePair.locale,
    };
  } catch (error) {
    console.log("error while fetching from sanity", error);
    return {
      nav: null,
      footer: null,
      source: "sanity-error",
      market: normalizedMarketLocalePair.market,
      locale: normalizedMarketLocalePair.locale,
    };
  }
}
