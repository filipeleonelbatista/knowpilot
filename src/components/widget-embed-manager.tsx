"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Code2,
  Copy,
  Globe,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildWidgetSnippet,
  parseAllowedOrigins,
} from "@/lib/widget/snippet";

type WidgetKeyRow = {
  id: string;
  publicKey: string;
  label: string | null;
  allowedOrigins: string;
  active: boolean;
  createdAt: string | Date;
};

type Props = {
  orgId: string;
};

export function WidgetEmbedManager({ orgId }: Props) {
  const [keys, setKeys] = useState<WidgetKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [origins, setOrigins] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const loadKeys = useCallback((showLoading = false) => {
    if (showLoading) setLoading(true);
    void fetch(`/api/orgs/${orgId}/widget-keys`)
      .then((r) => r.json())
      .then((d) => setKeys(d.keys ?? []))
      .finally(() => setLoading(false));
  }, [orgId]);

  useEffect(() => {
    void fetch(`/api/orgs/${orgId}/widget-keys`)
      .then((r) => r.json())
      .then((d) => setKeys(d.keys ?? []))
      .finally(() => setLoading(false));
  }, [orgId]);

  async function createWidget(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const originList = origins
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    if (originList.length === 0) {
      setError("Informe pelo menos um domínio permitido.");
      return;
    }
    setCreating(true);
    const res = await fetch(`/api/orgs/${orgId}/widget-keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: label.trim() || originList[0],
        allowedOrigins: originList,
      }),
    });
    setCreating(false);
    if (!res.ok) {
      setError("Falha ao gerar widget.");
      return;
    }
    setLabel("");
    setOrigins("");
    loadKeys(true);
  }

  function copySnippet(key: WidgetKeyRow) {
    const snippet = buildWidgetSnippet(baseUrl, key.publicKey);
    void navigator.clipboard.writeText(snippet);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Widgets nos seus sites
          </CardTitle>
          <CardDescription>
            Cada site usa um snippet com chave própria. Cole antes do{" "}
            <code className="rounded bg-muted px-1">&lt;/body&gt;</code> em
            qualquer página HTML ou CMS.
          </CardDescription>
        </CardHeader>

        {loading ? (
          <p className="pb-6 text-sm text-muted-foreground">Carregando…</p>
        ) : keys.length === 0 ? (
          <p className="pb-6 text-sm text-muted-foreground">
            Nenhum widget gerado ainda. Crie o primeiro abaixo.
          </p>
        ) : (
          <ul className="space-y-4 pb-2">
            {keys.map((key) => {
              const originsList = parseAllowedOrigins(key.allowedOrigins);
              const snippet = buildWidgetSnippet(baseUrl, key.publicKey);
              return (
                <motion.li
                  key={key.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-border bg-muted/20 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {key.label ?? "Widget"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Domínios: {originsList.join(", ") || "—"}
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        {key.publicKey}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="gap-1.5"
                      onClick={() => copySnippet(key)}
                    >
                      {copiedId === key.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copiar snippet
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="relative mt-3 rounded-lg border border-border bg-zinc-950 p-3 dark:bg-black/50">
                    <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400/90">
                      {snippet}
                    </pre>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Adicionar em outro site
          </CardTitle>
          <CardDescription>
            Gere uma nova chave para cada domínio (loja, landing, blog, cliente
            diferente). A IA usa a mesma base de conhecimento desta organização.
          </CardDescription>
        </CardHeader>
        <form onSubmit={createWidget} className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Nome do site (opcional)
            </label>
            <Input
              className="mt-1.5"
              placeholder="Ex: Site principal, Blog, Loja BR"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Domínios permitidos
            </label>
            <Input
              className="mt-1.5"
              placeholder="https://meusite.com, https://www.meusite.com"
              value={origins}
              onChange={(e) => setOrigins(e.target.value)}
              required
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Separe múltiplos domínios com vírgula. Em desenvolvimento use{" "}
              <code className="rounded bg-muted px-1">http://localhost:3000</code>
            </p>
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <Button type="submit" disabled={creating} className="gap-1.5">
            <Code2 className="h-4 w-4" />
            {creating ? "Gerando…" : "Gerar snippet para este site"}
          </Button>
        </form>
      </Card>

      <div className="rounded-xl border border-border bg-card/50 p-5 text-sm text-muted-foreground">
        <p className="flex items-center gap-2 font-medium text-foreground">
          <ExternalLink className="h-4 w-4 text-primary" />
          Como instalar
        </p>
        <ol className="mt-3 list-inside list-decimal space-y-2">
          <li>Copie o snippet do site desejado acima.</li>
          <li>Cole no HTML do site, antes do fechamento do body.</li>
          <li>Publique e teste o botão de chat no canto da tela.</li>
          <li>
            Para outro domínio, crie um novo widget em &quot;Adicionar em outro
            site&quot;.
          </li>
        </ol>
      </div>
    </div>
  );
}
