import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { attendantConfigs } from "@/lib/db/schema";
import {
  isOriginAllowed,
  normalizeHttpOrigin,
  publicCorsHeaders,
  resolveRequestOrigin,
  resolveWidgetKey,
} from "@/lib/widget/validate";
import { jsonError } from "@/lib/api/errors";

function withCors(response: Response, origin: string | null): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(publicCorsHeaders(origin))) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const widgetKey = searchParams.get("key");
  const embedOrigin = searchParams.get("embedOrigin");

  const origin = resolveRequestOrigin(
    request.headers.get("origin"),
    request.headers.get("referer"),
    normalizeHttpOrigin(embedOrigin),
  );

  const requestOriginHeader = request.headers.get("origin");

  if (!widgetKey) {
    return withCors(
      jsonError(400, "BAD_REQUEST", "Chave obrigatória"),
      requestOriginHeader,
    );
  }

  const ctx = await resolveWidgetKey(widgetKey);
  if (!ctx) {
    return withCors(jsonError(401, "INVALID_KEY", "Chave inválida"), requestOriginHeader);
  }

  if (!isOriginAllowed(origin, ctx.allowedOrigins)) {
    return withCors(
      jsonError(403, "ORIGIN_DENIED", "Origem não autorizada"),
      requestOriginHeader,
    );
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
      headers: publicCorsHeaders(requestOriginHeader),
    },
  );
}
