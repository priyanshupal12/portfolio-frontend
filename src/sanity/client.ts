import type { SanityConfig } from "@/types/localizeTypes";
import type { QueryParams } from "@/types/localizeTypes";

function envEnabled(value: unknown, fallback = false): boolean {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  return String(value).toLocaleLowerCase() === "true";
}

export function isSanityConfig(): SanityConfig | undefined {
  const project_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
  const useCdn = envEnabled(process.env.NEXT_PUBLIC_SANITY_USE_CDN, true);
  if (!project_ID || !dataset || !apiVersion) return;
  return { project_ID, dataset, apiVersion, useCdn };
}

function buildQuery(
  config: SanityConfig,
  query: string,
  param: QueryParams,
): string {
  const host = config.useCdn ? "apicdn.sanity.io" : "api.sanity.io";
  const baseurl = `https://${config.project_ID}.${host}/v${config.apiVersion}/data/query/${config.dataset}`;
  const searchParams = new URLSearchParams();
  searchParams.set("query", query);

  Object.entries(param).forEach(([key, value]) => {
    const paramKey = key.startsWith("$") ? key : `$${key}`;
    searchParams.set(paramKey, JSON.stringify(value));
  });

  return `${baseurl}?${searchParams.toString()}`;
}

export async function querySanity<T = unknown>({
  query,
  param,
  revalidate = 30,
}: {
  query: string;
  param: QueryParams;
  revalidate?: number;
}): Promise<T | null> {
  const config = isSanityConfig();
  if (!config) return null;
  const url = buildQuery(config, query, param);

  const response = await fetch(url, {
    method: "GET",
    next: { revalidate },
    cache: config.useCdn ? "force-cache" : "no-store",
  });

  if (!response.ok) {
    const errorMassage = await response.text();
    console.log(
      `Sanity query failed with status ${response.status}: ${errorMassage.slice(0, 200)}`,
    );
    return null;
  }

  const data = await response.json();
  if (data?.error) {
    throw new Error(data.error.description || "unknown sanity error");
  }
  return (data?.result ?? null) as T | null;
}
