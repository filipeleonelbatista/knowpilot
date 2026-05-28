import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  knowledgeBases,
  knowledgeDocuments,
} from "@/lib/db/schema";
import { requireOrgAccess } from "@/lib/api/session-org";
import { indexDocument } from "@/lib/rag/index-document";

const docSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orgId: string; docId: string }> },
) {
  const { orgId, docId } = await params;
  const access = await requireOrgAccess(orgId, "member");
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = docSchema.parse(await request.json());
    const kb = await db.query.knowledgeBases.findFirst({
      where: eq(knowledgeBases.organizationId, orgId),
    });
    if (!kb) {
      return NextResponse.json({ error: "KB not found" }, { status: 404 });
    }

    const [doc] = await db
      .update(knowledgeDocuments)
      .set({
        title: body.title,
        content: body.content,
        updatedAt: new Date(),
      })
      .where(eq(knowledgeDocuments.id, docId))
      .returning();

    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const chunkCount = await indexDocument(doc.id, kb.id, body.content);
    return NextResponse.json({ document: doc, chunkCount });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ orgId: string; docId: string }> },
) {
  const { orgId, docId } = await params;
  const access = await requireOrgAccess(orgId, "member");
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db
    .delete(knowledgeDocuments)
    .where(eq(knowledgeDocuments.id, docId));

  return NextResponse.json({ ok: true });
}
