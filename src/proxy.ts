import { NextRequest, NextResponse } from "next/server";

const DEFAULT_MARKET = "us";
const DEFAULT_LANG = "en";
const LOCALE_COOKIE = "site_locale";

const COUNTRY_TO_LOCALE: Record<string, { market: string; lang: string }> = {
  US: { market: "us", lang: "en" },
  GB: { market: "uk", lang: "en" },
  IN: { market: "in", lang: "en" },
  FR: { market: "fr", lang: "fr" },
  DE: { market: "de", lang: "de" },
  ES: { market: "es", lang: "es" },
  IT: { market: "it", lang: "it" },
  JP: { market: "jp", lang: "ja" },
};

function parseLocaleCookie(value?: string) {
  if (!value) return null;
  const [market, lang] = value.split("-");
  if (!market || !lang) return null;
  return { market, lang };
}

function isLocalizedPath(pathname: string) {
  // Expects routes like /us/en/... or /fr/fr/...
  return /^\/[a-z]{2}\/[a-z]{2}(\/|$)/i.test(pathname);
}

function detectLocale(request: NextRequest) {
  const cookieLocale = parseLocaleCookie(request.cookies.get(LOCALE_COOKIE)?.value);
  if (cookieLocale) return cookieLocale;

  // Vercel geo country header (ISO-2) like "US", "IN", "FR".
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country && COUNTRY_TO_LOCALE[country]) {
    return COUNTRY_TO_LOCALE[country];
  }

  // Fallback using Accept-Language if no country match.
  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";
  if (acceptLanguage.startsWith("fr")) return { market: "fr", lang: "fr" };
  if (acceptLanguage.startsWith("de")) return { market: "de", lang: "de" };
  if (acceptLanguage.startsWith("es")) return { market: "es", lang: "es" };

  return { market: DEFAULT_MARKET, lang: DEFAULT_LANG };
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // 1) Allow only expected HTTP methods.
  const allowedMethods = new Set([
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ]);
  if (!allowedMethods.has(request.method)) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // 2) Block obvious path traversal attempts.
  if (pathname.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  // 3) Basic query-string length guard.
  if (nextUrl.search.length > 1024) {
    return NextResponse.json({ error: "Query too long" }, { status: 414 });
  }

  // 4) Validate content type for mutating methods if body exists.
  const mutating = new Set(["POST", "PUT", "PATCH"]);
  if (mutating.has(request.method)) {
    const contentType = request.headers.get("content-type") ?? "";
    const isJson = contentType.toLowerCase().includes("application/json");
    const isForm = contentType
      .toLowerCase()
      .includes("application/x-www-form-urlencoded");
    const isMultipart = contentType
      .toLowerCase()
      .includes("multipart/form-data");

    if (contentType && !isJson && !isForm && !isMultipart) {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 415 },
      );
    }
  }

  // Localization redirect for first-time/non-localized paths.
  if (!isLocalizedPath(pathname)) {
    const { market, lang } = detectLocale(request);
    const redirectUrl = nextUrl.clone();
    redirectUrl.pathname = `/${market}/${lang}${pathname === "/" ? "" : pathname}`;

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(LOCALE_COOKIE, `${market}-${lang}`, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: true,
      httpOnly: false,
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Run on app routes, skip internal/static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
