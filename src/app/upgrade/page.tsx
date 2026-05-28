"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function UpgradeForm() {
  const params = useSearchParams();
  const orgSlug = params.get("org") ?? "";
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/public/pro-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        orgSlug: orgSlug || undefined,
        source: params.get("source") === "widget" ? "widget" : "lp",
      }),
    });
    if (!res.ok) {
      setError("Não foi possível enviar. Tente novamente.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mesh-bg flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md text-center"
        >
          <Sparkles className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-6 text-2xl font-bold">Obrigado!</h1>
          <p className="mt-3 text-muted-foreground">
            Entraremos em contato em breve sobre o Plano Pro.
          </p>
          <Link href="/" className="mt-8 inline-block">
            <Button variant="secondary">Voltar ao início</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen">
      <header className="flex items-center justify-between px-6 py-4">
        <Logo size="md" />
        <ThemeToggle />
      </header>
      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="rounded-full gradient-bg px-3 py-1 text-xs font-semibold text-primary-foreground">
            Plano Pro
          </span>
          <h1 className="mt-4 text-4xl font-bold">
            R$ 90
            <span className="text-lg font-normal text-muted-foreground">/mês</span>
          </h1>
          <ul className="mt-8 space-y-4">
            {[
              "Prioridade na fila de atendimento IA",
              "Fila de espera maior (até 8 posições)",
              "Limites de uso ampliados",
              "Suporte dedicado",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-muted-foreground">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Validação de interesse — sem checkout nesta versão.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <h2 className="text-lg font-semibold">Solicitar Pro</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Deixe seus dados e retornamos em breve.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <Input
                placeholder="Nome"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                placeholder="Telefone"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Quero o Plano Pro
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense>
      <UpgradeForm />
    </Suspense>
  );
}
