import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/api/session-org";
import {
  createOrganizationForUser,
  OrganizationLimitError,
} from "@/lib/org/service";
import { canCreateFreeOrganization } from "@/lib/org/limits";

const schema = z.object({
  name: z.string().min(2).max(80),
});

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = await canCreateFreeOrganization(session.user.id);
  return NextResponse.json(limit);
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = schema.parse(await request.json());
    const org = await createOrganizationForUser(session.user.id, body.name);
    return NextResponse.json({ organization: org }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    if (error instanceof OrganizationLimitError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
            count: error.count,
            max: error.max,
          },
        },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 },
    );
  }
}
