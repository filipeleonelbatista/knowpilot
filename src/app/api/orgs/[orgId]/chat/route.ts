import { jsonError } from "@/lib/api/errors";
import { requireOrgAccess } from "@/lib/api/session-org";
import { getInferenceQueue } from "@/lib/concurrency/inference-queue";
import { checkOllamaHealth } from "@/lib/ollama/client";
import { runRagChat } from "@/lib/rag/chat";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  message: z.string().min(1).max(4000),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const access = await requireOrgAccess(orgId, "member");
  if (!access) {
    return jsonError(401, "UNAUTHORIZED", "Não autorizado");
  }

  const healthy = await checkOllamaHealth();
  if (!healthy) {
    return jsonError(
      503,
      "CAPACITY_EXCEEDED",
      "Sistema sobrecarregado. Tente em 2–3 minutos.",
      { upgradeUrl: "/upgrade" },
    );
  }

  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await request.json());
  } catch {
    return jsonError(400, "BAD_REQUEST", "Mensagem inválida");
  }

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.id, orgId),
  });
  const plan = (org?.plan ?? "free") as "free" | "pro";
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
          organizationId: orgId,
          plan,
          onQueued: (meta) => {
            send("queued", {
              position: meta.position,
              estimated_wait_seconds: meta.estimatedWaitSeconds,
            });
          },
          execute: async () => {
            for await (const token of runRagChat(orgId, body.message)) {
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
              "Recursos em uso. Aguarde alguns minutos ou conheça o Plano Pro.",
            upgradeUrl: `/upgrade?org=${org?.slug ?? ""}&source=widget`,
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
    },
  });
}
