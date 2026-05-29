import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { widgetKeys, organizations } from "@/lib/db/schema";

export type WidgetContext = {
  widgetKeyId: string;
  organizationId: string;
  plan: "free" | "pro";
  allowedOrigins: string[];
};

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

export function extractOriginFromReferer(referer: string | null): string | null {
  if (!referer) return null;
  return normalizeHttpOrigin(referer);
}

/** Rejects opaque origins (`null` string) and non-http(s) values. */
export function normalizeHttpOrigin(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    if (/^https?:\/\//.test(trimmed)) {
      try {
        return new URL(trimmed.replace(/\/$/, "")).origin;
      } catch {
        return null;
      }
    }
    return null;
  }
}

/** Resolves site origin for embed validation (CORS Origin can be "null" in iframes). */
export function resolveRequestOrigin(
  originHeader: string | null,
  refererHeader: string | null,
  embedOrigin: string | null,
): string | null {
  const fromHeader = normalizeHttpOrigin(originHeader);
  if (fromHeader) return fromHeader;

  const fromEmbed = normalizeHttpOrigin(embedOrigin);
  if (fromEmbed) return fromEmbed;

  return extractOriginFromReferer(refererHeader);
}

export function isOriginAllowed(
  origin: string | null,
  allowedOrigins: string[],
): boolean {
  if (allowedOrigins.length === 0) return true;
  if (!origin) return false;
  const normalized = origin.replace(/\/$/, "");
  return allowedOrigins.some((allowed) => {
    const entry = allowed.replace(/\/$/, "");
    return entry === "*" || normalized === entry;
  });
}

/**
 * CORS: `Access-Control-Allow-Origin` must echo the request's `Origin` header.
 * Opaque / sandboxed pages send `Origin: null`; the response must use the literal `null`,
 * not the logical site URL from embedOrigin (or the browser blocks the body on 200).
 */
export function publicCorsHeaders(originHeader: string | null): Record<string, string> {
  if (originHeader == null) {
    return { "Access-Control-Allow-Origin": "*" };
  }
  const t = originHeader.trim();
  if (t === "") return { "Access-Control-Allow-Origin": "*" };
  if (t === "null") return { "Access-Control-Allow-Origin": "null" };
  return { "Access-Control-Allow-Origin": t };
}

export async function resolveWidgetKey(
  publicKey: string,
): Promise<WidgetContext | null> {
  const row = await db
    .select({
      widgetKeyId: widgetKeys.id,
      organizationId: widgetKeys.organizationId,
      allowedOrigins: widgetKeys.allowedOrigins,
      active: widgetKeys.active,
      plan: organizations.plan,
    })
    .from(widgetKeys)
    .innerJoin(organizations, eq(widgetKeys.organizationId, organizations.id))
    .where(eq(widgetKeys.publicKey, publicKey))
    .limit(1);

  const item = row[0];
  if (!item || !item.active) return null;

  return {
    widgetKeyId: item.widgetKeyId,
    organizationId: item.organizationId,
    plan: item.plan as "free" | "pro",
    allowedOrigins: parseAllowedOrigins(item.allowedOrigins),
  };
}
