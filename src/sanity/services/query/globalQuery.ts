export const CHROME_QUERY = `
{
  "nav": *[_type == "header" && market == $market && locale == $locale][0]{
    brandLogo,
    navigationItems
  }
}`;
