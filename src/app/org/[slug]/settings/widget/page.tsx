"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader, OrgQuickLinks } from "@/components/dashboard-shell";
import { WidgetEmbedManager } from "@/components/widget-embed-manager";

export default function WidgetSettingsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`/api/orgs/by-slug/${slug}`)
      .then((r) => r.json())
      .then((d) => setOrgId(d.organization?.id ?? null));
  }, [slug]);

  return (
    <div>
      <PageHeader
        title="Widget para sites"
        description="Um snippet por site. Copie e cole no HTML de cada projeto ou cliente desta organização."
      />
      <OrgQuickLinks slug={slug} />
      {orgId ? (
        <WidgetEmbedManager orgId={orgId} />
      ) : (
        <p className="text-muted-foreground">Carregando…</p>
      )}
    </div>
  );
}
