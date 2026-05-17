import type { Market, Locale } from "../types/localizeTypes";
import { getGlobalContent } from "../sanity/services/global.service";

export const sanityGlobalContent = async ({
  market,
  locale,
}: {
  market: Market;
  locale: Locale;
}) => {
  const data = await getGlobalContent(locale, market);
  return data;
};
