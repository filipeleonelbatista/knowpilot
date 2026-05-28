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

export function isOriginAllowed(
  origin: string | null,
  allowedOrigins: string[],
): boolean {
  if (allowedOrigins.length === 0) return true;
  if (!origin) return false;
  return allowedOrigins.some(
    (allowed) =>
      allowed === "*" ||
      origin === allowed ||
      origin === allowed.replace(/\/$/, ""),
  );
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
