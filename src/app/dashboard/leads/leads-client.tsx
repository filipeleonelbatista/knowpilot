"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  orgName: string | null;
  createdAt: string;
};

export function LeadsAdminClient() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    void fetch("/api/admin/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads ?? []));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l)),
    );
  }

  return (
    <div>
      <PageHeader
        title="Leads Plano Pro"
        description="Área interna — não linkada na navegação."
      />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-4 font-medium">Nome</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Telefone</th>
                <th className="p-4 font-medium">Org</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-border transition hover:bg-muted/30"
                >
                  <td className="p-4">{lead.name}</td>
                  <td className="p-4">{lead.email}</td>
                  <td className="p-4">{lead.phone}</td>
                  <td className="p-4">{lead.orgName ?? "—"}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateStatus(lead.id, "contacted")}
                    >
                      Contacted
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateStatus(lead.id, "converted")}
                    >
                      Converted
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leads.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">
            Nenhum lead registrado.
          </p>
        )}
      </Card>
    </div>
  );
}
