import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { proLeads, organizations } from "@/lib/db/schema";
import { jsonError } from "@/lib/api/errors";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  orgSlug: z.string().optional(),
  source: z.enum(["widget", "lp", "dashboard"]).default("lp"),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());

    let organizationId: string | null = null;
    if (body.orgSlug) {
      const org = await db.query.organizations.findFirst({
        where: eq(organizations.slug, body.orgSlug),
      });
      organizationId = org?.id ?? null;
    }

    const [lead] = await db
      .insert(proLeads)
      .values({
        name: body.name,
        email: body.email.toLowerCase(),
        phone: body.phone,
        organizationId,
        source: body.source,
      })
      .returning();

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return jsonError(500, "SERVER_ERROR", "Falha ao registrar interesse");
  }
}
