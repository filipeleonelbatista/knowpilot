export function buildWidgetSnippet(
  baseUrl: string,
  publicKey: string,
  position: "bottom-right" | "bottom-left" = "bottom-right",
  embedOrigin?: string,
): string {
  const siteOrigin = embedOrigin?.trim();
  const originAttr =
    siteOrigin && siteOrigin !== "null"
      ? ` data-embed-origin="${siteOrigin}"`
      : "";
  return `<script src="${baseUrl}/widget/v1.js" data-widget-key="${publicKey}" data-position="${position}"${originAttr} async></script>`;
}

export function parseAllowedOrigins(json: string): string[] {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((o): o is string => typeof o === "string");
    }
  } catch {
    // ignore
  }
  return [];
}
