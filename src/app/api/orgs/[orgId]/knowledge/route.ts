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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const access = await requireOrgAccess(orgId, "member");
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kb = await db.query.knowledgeBases.findFirst({
    where: eq(knowledgeBases.organizationId, orgId),
  });
  if (!kb) {
    return NextResponse.json({ documents: [] });
  }

  const documents = await db.query.knowledgeDocuments.findMany({
    where: eq(knowledgeDocuments.knowledgeBaseId, kb.id),
    orderBy: (d, { desc }) => [desc(d.updatedAt)],
  });

  return NextResponse.json({ documents, knowledgeBaseId: kb.id });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
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
      .insert(knowledgeDocuments)
      .values({
        knowledgeBaseId: kb.id,
        title: body.title,
        content: body.content,
        updatedAt: new Date(),
      })
      .returning();

    const chunkCount = await indexDocument(doc!.id, kb.id, body.content);

    return NextResponse.json({ document: doc, chunkCount }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 },
    );
  }
}
