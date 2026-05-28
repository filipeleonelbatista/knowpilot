import { NextResponse } from "next/server";
import { getOrgAccessBySlug } from "@/lib/org/resolve-slug";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const access = await getOrgAccessBySlug(slug);
  if (!access) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    organization: access.org,
    membership: access.membership,
  });
}
