import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { proLeads } from "@/lib/db/schema";
import { requireSession } from "@/lib/api/session-org";
import { canViewLeads } from "@/lib/auth/permissions";
import { listUserOrganizations } from "@/lib/org/service";

const schema = z.object({
  status: z.enum(["new", "contacted", "converted"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgs = await listUserOrganizations(session.user.id);
  const adminOrg = orgs.find((o) => canViewLeads(o.role as "owner", false));
  if (!session.user.isPlatformAdmin && !adminOrg) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = schema.parse(await request.json());
    const [lead] = await db
      .update(proLeads)
      .set({ status: body.status })
      .where(eq(proLeads.id, id))
      .returning();

    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
}
