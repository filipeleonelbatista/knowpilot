import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { attendantConfigs } from "@/lib/db/schema";
import { requireOrgAccess } from "@/lib/api/session-org";

const schema = z.object({
  name: z.string().min(1),
  personality: z.string(),
  tone: z.string(),
  characteristics: z.string(),
  extraInstructions: z.string(),
  fallbackMessage: z.string(),
  fallbackEmail: z.string().email().optional().or(z.literal("")),
  fallbackPhone: z.string().optional(),
  widgetPrimaryColor: z.string().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const access = await requireOrgAccess(orgId, "member");
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await db.query.attendantConfigs.findFirst({
    where: eq(attendantConfigs.organizationId, orgId),
  });

  return NextResponse.json({ config });
}

export async function PUT(
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
    const [config] = await db
      .update(attendantConfigs)
      .set({
        name: body.name,
        personality: body.personality,
        tone: body.tone,
        characteristics: body.characteristics,
        extraInstructions: body.extraInstructions,
        fallbackMessage: body.fallbackMessage,
        fallbackEmail: body.fallbackEmail || null,
        fallbackPhone: body.fallbackPhone || null,
        widgetPrimaryColor: body.widgetPrimaryColor ?? "#2563eb",
      })
      .where(eq(attendantConfigs.organizationId, orgId))
      .returning();

    return NextResponse.json({ config });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
