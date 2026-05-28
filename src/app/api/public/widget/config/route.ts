import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { attendantConfigs } from "@/lib/db/schema";
import {
  isOriginAllowed,
  resolveWidgetKey,
} from "@/lib/widget/validate";
import { jsonError } from "@/lib/api/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const widgetKey = searchParams.get("key");
  const origin = request.headers.get("origin");

  if (!widgetKey) {
    return jsonError(400, "BAD_REQUEST", "Chave obrigatória");
  }

  const ctx = await resolveWidgetKey(widgetKey);
  if (!ctx) {
    return jsonError(401, "INVALID_KEY", "Chave inválida");
  }

  if (!isOriginAllowed(origin, ctx.allowedOrigins)) {
    return jsonError(403, "ORIGIN_DENIED", "Origem não autorizada");
  }

  const config = await db.query.attendantConfigs.findFirst({
    where: eq(attendantConfigs.organizationId, ctx.organizationId),
  });

  return NextResponse.json(
    {
      name: config?.name ?? "Assistente",
      primaryColor: config?.widgetPrimaryColor ?? "#2563eb",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": origin ?? "*",
      },
    },
  );
}
