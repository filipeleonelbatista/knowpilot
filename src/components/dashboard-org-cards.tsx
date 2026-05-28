"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { orgActionIcons } from "@/lib/icons";
import { Card } from "@/components/ui/card";

type Org = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
};

const actions: Array<{
  key: keyof typeof orgActionIcons;
  label: string;
  icon: LucideIcon;
  desc: string;
}> = [
  {
    key: "knowledge",
    label: "Base de conhecimento",
    icon: orgActionIcons.knowledge,
    desc: "Documentos e RAG",
  },
  {
    key: "attendant",
    label: "Atendente",
    icon: orgActionIcons.attendant,
    desc: "Personalidade e tom",
  },
  {
    key: "widget",
    label: "Widget nos sites",
    icon: orgActionIcons.widget,
    desc: "Copiar snippet",
  },
  {
    key: "preview",
    label: "Preview",
    icon: orgActionIcons.preview,
    desc: "Testar o chat",
  },
];

function hrefFor(slug: string, key: (typeof actions)[number]["key"]) {
  const map = {
    knowledge: `/org/${slug}/knowledge`,
    attendant: `/org/${slug}/settings/attendant`,
    widget: `/org/${slug}/settings/widget`,
    preview: `/org/${slug}/preview`,
  };
  return map[key];
}

export function DashboardOrgCards({ orgs }: { orgs: Org[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {orgs.map((org, i) => (
        <motion.div
          key={org.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card className="overflow-hidden p-0">
            <div className="gradient-bg px-6 py-5 text-primary-foreground">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{org.name}</h2>
                  <p className="mt-1 text-sm opacity-90">
                    {org.role} · Plano{" "}
                    <span className="font-semibold uppercase">{org.plan}</span>
                  </p>
                </div>
                {org.plan === "pro" && (
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold">
                    PRO
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.key}
                    href={hrefFor(org.slug, action.key)}
                    className="group flex flex-col items-center bg-card p-4 text-center transition hover:bg-muted/50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110 group-hover:bg-primary/15">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="mt-2 text-xs font-semibold">{action.label}</span>
                    <span className="mt-0.5 text-[10px] text-muted-foreground">
                      {action.desc}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
