"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatPanel } from "@/components/chat-panel";
import { PageHeader, OrgQuickLinks } from "@/components/dashboard-shell";

export default function PreviewChatPage() {
  const { slug } = useParams<{ slug: string }>();
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`/api/orgs/by-slug/${slug}`)
      .then((r) => r.json())
      .then((d) => setOrgId(d.organization?.id));
  }, [slug]);

  return (
    <div>
      <PageHeader
        title="Preview do chat"
        description="Teste o atendente com a base de conhecimento indexada."
      />
      <OrgQuickLinks slug={slug} />
      {orgId ? (
        <ChatPanel endpoint={`/api/orgs/${orgId}/chat`} body={{}} />
      ) : (
        <p className="text-muted-foreground">Carregando…</p>
      )}
    </div>
  );
}
