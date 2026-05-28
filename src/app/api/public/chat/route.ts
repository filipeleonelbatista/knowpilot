import { jsonError } from "@/lib/api/errors";
import { getInferenceQueue } from "@/lib/concurrency/inference-queue";
import { checkOllamaHealth } from "@/lib/ollama/client";
import { runRagChat } from "@/lib/rag/chat";
import {
  isOriginAllowed,
  publicCorsHeaders,
  resolveRequestOrigin,
  resolveWidgetKey,
} from "@/lib/widget/validate";
import { z } from "zod";

const schema = z.object({
  message: z.string().min(1).max(4000),
  widgetKey: z.string().min(1),
  embedOrigin: z.string().url().optional(),
});

function withCors(
  response: Response,
  origin: string | null,
): Response {
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

export async function POST(request: Request) {

  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await request.json());
  } catch {
    return withCors(
      jsonError(400, "BAD_REQUEST", "Requisição inválida"),
      request.headers.get("origin"),
    );
  }

  const origin = resolveRequestOrigin(
    request.headers.get("origin"),
    request.headers.get("referer"),
    body.embedOrigin ?? null,
  );

  const ctx = await resolveWidgetKey(body.widgetKey);
  if (!ctx) {
    return withCors(
      jsonError(401, "INVALID_KEY", "Chave do widget inválida"),
      origin,
    );
  }

  if (!isOriginAllowed(origin, ctx.allowedOrigins)) {
    return withCors(
      jsonError(403, "ORIGIN_DENIED", "Origem não autorizada"),
      origin,
    );
  }

  const healthy = await checkOllamaHealth();
  if (!healthy) {
    return withCors(
      jsonError(
        503,
        "CAPACITY_EXCEEDED",
        "Sistema sobrecarregado. Tente em 2–3 minutos.",
        { upgradeUrl: "/upgrade" },
      ),
      origin,
    );
  }

  const queue = getInferenceQueue();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      try {
        await queue.enqueue({
          id: crypto.randomUUID(),
          organizationId: ctx.organizationId,
          plan: ctx.plan,
          onQueued: (meta) => {
            send("queued", meta);
          },
          execute: async () => {
            for await (const token of runRagChat(
              ctx.organizationId,
              body.message,
            )) {
              send("token", { content: token });
            }
          },
        });
        send("done", { ok: true });
      } catch (error) {
        const code =
          error instanceof Error && "code" in error
            ? String((error as { code: string }).code)
            : "UNKNOWN";

        if (code === "QUEUE_FULL") {
          send("error", {
            code: "QUEUE_FULL",
            message:
              "Recursos em uso. Aguarde alguns minutos ou conheça o Plano Pro por R$ 90/mês.",
            upgradeUrl: `/upgrade?source=widget`,
          });
        } else if (code === "QUEUE_TIMEOUT") {
          send("error", {
            code: "QUEUE_TIMEOUT",
            message: "Tempo de espera esgotado. Tente novamente.",
          });
        } else {
          send("error", {
            code: "CAPACITY_EXCEEDED",
            message: "Sistema sobrecarregado. Tente novamente em instantes.",
            upgradeUrl: "/upgrade",
          });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      ...publicCorsHeaders(origin),
    },
  });
}

export async function OPTIONS(request: Request) {
  const origin = resolveRequestOrigin(
    request.headers.get("origin"),
    request.headers.get("referer"),
    null,
  );
  return new Response(null, {
    status: 204,
    headers: {
      ...publicCorsHeaders(origin),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
