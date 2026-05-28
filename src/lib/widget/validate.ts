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
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

/** Resolves site origin for embed validation (CORS Origin can be "null" in iframes). */
export function resolveRequestOrigin(
  originHeader: string | null,
  refererHeader: string | null,
  embedOrigin: string | null,
): string | null {
  if (originHeader && originHeader !== "null") return originHeader;
  if (embedOrigin) {
    try {
      return new URL(embedOrigin).origin;
    } catch {
      // allow bare origin strings like https://www.example.com
      if (/^https?:\/\//.test(embedOrigin)) return embedOrigin.replace(/\/$/, "");
    }
  }
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

export function publicCorsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin = origin && origin !== "null" ? origin : "*";
  return { "Access-Control-Allow-Origin": allowOrigin };
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
