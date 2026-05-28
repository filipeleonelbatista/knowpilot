"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  variant?: "empty" | "inline";
  freeOrgCount: number;
  maxFreeOrgs: number;
};

export function CreateOrgForm({
  variant = "inline",
  freeOrgCount,
  maxFreeOrgs,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atLimit = freeOrgCount >= maxFreeOrgs;
  const remaining = Math.max(0, maxFreeOrgs - freeOrgCount);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (atLimit) return;
    setError(null);
    setLoading(true);
    const res = await fetch("/api/orgs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      const msg =
        data.error?.message ??
        data.error ??
        "Não foi possível criar a organização";
      setError(String(msg));
      return;
    }
    const data = await res.json();
    setName("");
    router.refresh();
    if (data.organization?.slug) {
      router.push(`/org/${data.organization.slug}/knowledge`);
    }
  }

  const limitBanner = atLimit ? (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
      <p className="font-medium text-amber-800 dark:text-amber-300">
        Limite do plano Free atingido ({maxFreeOrgs}/{maxFreeOrgs} organizações)
      </p>
      <p className="mt-1 text-muted-foreground">
        No plano Free você pode ter até {maxFreeOrgs} organizações. Ative o Pro
        em uma org ou solicite upgrade para criar mais.
      </p>
      <Link href="/upgrade" className="mt-3 inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
        <Sparkles className="h-4 w-4" />
        Conhecer Plano Pro — R$ 90/mês
      </Link>
    </div>
  ) : (
    <p className="text-xs text-muted-foreground">
      Plano Free: {freeOrgCount}/{maxFreeOrgs} organizações
      {remaining > 0 && ` · ${remaining} restante${remaining > 1 ? "s" : ""}`}
    </p>
  );

  if (variant === "empty") {
    return (
      <Card className="mx-auto max-w-md text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <CardHeader>
          <CardTitle>Crie sua primeira organização</CardTitle>
          <CardDescription>
            Cada organização tem base de conhecimento, atendente e widgets
            próprios. No plano Free, até {maxFreeOrgs} organizações por conta.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} className="space-y-4 px-6 pb-6">
          {limitBanner}
          <Input
            placeholder="Ex: Minha Loja, Cliente ACME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={atLimit}
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || atLimit}
          >
            {loading ? "Criando…" : "Criar organização"}
          </Button>
        </form>
      </Card>
    );
  }

  if (atLimit) {
    return (
      <div className="space-y-3">
        {limitBanner}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {limitBanner}
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="text-sm font-medium">Nova organização</label>
          <Input
            className="mt-1.5"
            placeholder="Nome do projeto ou cliente"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="shrink-0 gap-1.5">
          <Plus className="h-4 w-4" />
          {loading ? "Criando…" : "Adicionar"}
        </Button>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 sm:col-span-2">
            {error}
          </p>
        )}
      </motion.form>
    </div>
  );
}
