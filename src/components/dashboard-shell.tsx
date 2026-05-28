import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { orgActionIcons } from "@/lib/icons";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

const quickLinks: Array<{
  href: (slug: string) => string;
  label: string;
  icon: LucideIcon;
}> = [
  { href: (s) => `/org/${s}/knowledge`, label: "Base", icon: orgActionIcons.knowledge },
  {
    href: (s) => `/org/${s}/settings/attendant`,
    label: "Atendente",
    icon: orgActionIcons.attendant,
  },
  { href: (s) => `/org/${s}/settings/widget`, label: "Widget", icon: orgActionIcons.widget },
  { href: (s) => `/org/${s}/preview`, label: "Preview", icon: orgActionIcons.preview },
];

export function OrgQuickLinks({ slug }: { slug: string }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {quickLinks.map((l) => {
        const Icon = l.icon;
        return (
          <Link
            key={l.label}
            href={l.href(slug)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
          >
            <Icon className="h-3.5 w-3.5" />
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
