import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { widgetKeys } from "@/lib/db/schema";
import { requireOrgAccess } from "@/lib/api/session-org";

const schema = z.object({
  allowedOrigins: z.array(z.string()).min(1),
  label: z.string().min(1).max(80).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const access = await requireOrgAccess(orgId, "admin");
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await db
    .select()
    .from(widgetKeys)
    .where(eq(widgetKeys.organizationId, orgId))
    .orderBy(desc(widgetKeys.createdAt));

  return NextResponse.json({ keys });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const access = await requireOrgAccess(orgId, "admin");
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = schema.parse(await request.json());
    const publicKey = `wk_${nanoid(24)}`;

    const [key] = await db
      .insert(widgetKeys)
      .values({
        organizationId: orgId,
        publicKey,
        label: body.label ?? body.allowedOrigins[0] ?? "Site",
        allowedOrigins: JSON.stringify(body.allowedOrigins),
      })
      .returning();

    return NextResponse.json({ key }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
