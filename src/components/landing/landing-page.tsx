"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { featureIcons } from "@/lib/icons";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const features: Array<{
  title: string;
  desc: string;
  icon: LucideIcon;
}> = [
  {
    title: "RAG que não inventa",
    desc: "Respostas baseadas só na sua base de conhecimento. Sem alucinação de preços ou políticas.",
    icon: featureIcons.rag,
  },
  {
    title: "Ollama local",
    desc: "IA no seu servidor. Privacidade total, sem enviar dados para APIs externas.",
    icon: featureIcons.local,
  },
  {
    title: "Widget em 1 linha",
    desc: "Snippet JS com Shadow DOM. Chat flutuante no site do cliente em minutos.",
    icon: featureIcons.widget,
  },
  {
    title: "Personalidade do bot",
    desc: "Nome, tom, personalidade e fallback humano quando a IA não souber responder.",
    icon: featureIcons.personality,
  },
  {
    title: "Multi-organização",
    desc: "Times, papéis e múltiplas bases. Escale sem refazer a infraestrutura.",
    icon: featureIcons.orgs,
  },
  {
    title: "Fila inteligente",
    desc: "Controle de capacidade na VPS. Prioridade Pro e UX honesta na espera.",
    icon: featureIcons.queue,
  },
];

function PricingItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{children}</span>
    </li>
  );
}

const steps = [
  { n: "01", title: "Cadastre sua KB", desc: "Documentos indexados com embeddings automáticos." },
  { n: "02", title: "Configure o atendente", desc: "Personalidade, tom e contato humano de fallback." },
  { n: "03", title: "Publique o widget", desc: "Cole o snippet no site e comece a atender." },
];

export function LandingPage() {
  return (
    <div className="mesh-bg min-h-screen">
      <header className="glass sticky top-0 z-50 border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo size="md" />
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition">
              Recursos
            </a>
            <a href="#how" className="hover:text-foreground transition">
              Como funciona
            </a>
            <a href="#pricing" className="hover:text-foreground transition">
              Planos
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block"
            >
              Entrar
            </Link>
            <Link href="/register">
              <Button size="sm">Começar grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-24 pt-16 md:pt-24">
        <motion.div
          className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--glow)" }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="relative mx-auto max-w-4xl text-center"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Powered by Ollama · RAG · Self-hosted
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl"
          >
            Seu site com um atendente IA que{" "}
            <span className="gradient-text">só fala a verdade</span> da sua base
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            KnowPilot transforma documentos em respostas confiáveis. Configure,
            embale no widget e rode tudo na sua VPS com modelos quantizados.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/register">
              <Button size="lg" className="min-w-[200px]">
                Criar conta grátis
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Já tenho conta
              </Button>
            </Link>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-indigo-500/10"
          >
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs text-muted-foreground">
                preview — widget no seu site
              </span>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
              <div className="space-y-3 text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Base de conhecimento
                </p>
                <div className="rounded-xl bg-muted/60 p-4 text-sm">
                  <p className="font-medium">Política de devolução</p>
                  <p className="mt-1 text-muted-foreground line-clamp-2">
                    Devoluções em até 7 dias úteis com nota fiscal…
                  </p>
                </div>
                <div className="rounded-xl bg-muted/60 p-4 text-sm">
                  <p className="font-medium">Horário de atendimento</p>
                  <p className="mt-1 text-muted-foreground">
                    Seg–Sex, 9h às 18h (Brasília)
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-md gradient-bg px-4 py-2.5 text-sm text-primary-foreground">
                  Qual o prazo de devolução?
                </div>
                <div className="mt-3 max-w-[95%] rounded-2xl rounded-bl-md border border-border bg-muted/80 px-4 py-3 text-sm">
                  Conforme nossa política, você tem até{" "}
                  <strong>7 dias úteis</strong> após o recebimento.
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Resposta 100% baseada na KB — sem inventar
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="features" className="border-t border-border bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold md:text-4xl">
              Tudo para vender com confiança
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Do documento ao chat embeddable, com guardrails de RAG e infra
              pensada para VPS enxuta.
            </p>
          </motion.div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-indigo-500/5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Três passos para ir ao ar
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <span className="text-5xl font-bold text-muted/80">{step.n}</span>
                <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-border bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold">Planos simples</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <p className="text-sm font-medium text-muted-foreground">Free</p>
              <p className="mt-2 text-4xl font-bold">R$ 0</p>
              <ul className="mt-6 space-y-2">
                <PricingItem>Até 3 organizações</PricingItem>
                <PricingItem>Base de conhecimento por org</PricingItem>
                <PricingItem>Widget embeddable</PricingItem>
                <PricingItem>Fila padrão (até 3 na espera)</PricingItem>
              </ul>
              <Link href="/register" className="mt-8 block">
                <Button variant="secondary" className="w-full">
                  Começar grátis
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl border-2 border-primary bg-card p-8 shadow-xl shadow-indigo-500/10"
            >
              <div className="absolute right-4 top-4 rounded-full gradient-bg px-3 py-1 text-xs font-semibold text-primary-foreground">
                Popular
              </div>
              <p className="text-sm font-medium text-primary">Pro</p>
              <p className="mt-2 text-4xl font-bold">
                R$ 90
                <span className="text-lg font-normal text-muted-foreground">
                  /mês
                </span>
              </p>
              <ul className="mt-6 space-y-2">
                <PricingItem>Prioridade na fila de IA</PricingItem>
                <PricingItem>Fila maior (até 8 posições)</PricingItem>
                <PricingItem>Suporte dedicado</PricingItem>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Contato comercial via formulário — sem checkout nesta versão.
              </p>
              <Link href="/upgrade" className="mt-6 block">
                <Button className="w-full">Solicitar Pro</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-3xl gradient-bg p-10 text-center text-primary-foreground md:p-14"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Pronto para o seu próximo cliente?
          </h2>
          <p className="mx-auto mt-4 max-w-lg opacity-90">
            Configure em minutos. Rode na sua VPS. Respostas que sua equipe
            confia.
          </p>
          <Link href="/register" className="mt-8 inline-block">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-foreground hover:bg-white/90"
            >
              Criar conta agora
            </Button>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <Logo size="sm" href="/" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KnowPilot. MIT License — estudos e
            produção self-hosted.
          </p>
        </div>
      </footer>
    </div>
  );
}
