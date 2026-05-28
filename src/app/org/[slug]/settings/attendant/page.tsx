"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader, OrgQuickLinks } from "@/components/dashboard-shell";
import { AttendantPresetPicker } from "@/components/attendant-preset-picker";
import {
  applyPreset,
  findMatchingPreset,
  findMatchingPresetCategory,
  type AttendantPreset,
} from "@/lib/attendant/presets";

const emptyForm = {
  name: "",
  personality: "",
  tone: "",
  characteristics: "",
  extraInstructions: "",
  fallbackMessage: "",
  fallbackEmail: "",
  fallbackPhone: "",
  widgetPrimaryColor: "#4f46e5",
};

export default function AttendantSettingsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const activePreset = useMemo(() => findMatchingPreset(form), [form]);
  const activePresetCategory = useMemo(
    () => findMatchingPresetCategory(form),
    [form],
  );

  useEffect(() => {
    void fetch(`/api/orgs/by-slug/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        const id = d.organization?.id;
        setOrgId(id);
        if (id) {
          void fetch(`/api/orgs/${id}/attendant`)
            .then((r) => r.json())
            .then((a) => {
              if (a.config) {
                setForm({
                  name: a.config.name ?? "",
                  personality: a.config.personality ?? "",
                  tone: a.config.tone ?? "",
                  characteristics: a.config.characteristics ?? "",
                  extraInstructions: a.config.extraInstructions ?? "",
                  fallbackMessage: a.config.fallbackMessage ?? "",
                  fallbackEmail: a.config.fallbackEmail ?? "",
                  fallbackPhone: a.config.fallbackPhone ?? "",
                  widgetPrimaryColor:
                    a.config.widgetPrimaryColor ?? "#4f46e5",
                });
              }
            });
        }
      });
  }, [slug]);

  function selectPreset(preset: AttendantPreset) {
    setForm((current) => ({
      ...applyPreset(current, preset),
      fallbackMessage: current.fallbackMessage,
      fallbackEmail: current.fallbackEmail,
      fallbackPhone: current.fallbackPhone,
      widgetPrimaryColor: current.widgetPrimaryColor,
    }));
  }

  async function save() {
    if (!orgId) return;
    setSaving(true);
    await fetch(`/api/orgs/${orgId}/attendant`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <PageHeader
        title="Personalidade do atendente"
        description="Escolha um preset completo ou ajuste cada campo — tudo alimenta o prompt da IA."
      />
      <OrgQuickLinks slug={slug} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Presets de personalidade
              </CardTitle>
              <CardDescription>
                Cada preset define personalidade, tom, características e
                instruções extras. Você pode editar os campos depois.
              </CardDescription>
            </CardHeader>
            <AttendantPresetPicker
              activePresetId={activePreset?.id}
              activeCategory={activePresetCategory}
              onSelect={selectPreset}
            />
            {activePreset ? (
              <p className="mt-4 text-xs text-muted-foreground">
                Preset ativo:{" "}
                <span className="font-medium text-foreground">
                  {activePreset.label}
                </span>
                . Você pode ajustar os campos abaixo; ao escolher outro preset,
                personalidade, tom e instruções serão substituídos.
              </p>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                Escolha um preset por aba ou preencha os campos manualmente.
              </p>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Identidade</CardTitle>
              <CardDescription>Nome e voz do assistente virtual.</CardDescription>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Nome do atendente</label>
                <Input
                  className="mt-1.5"
                  placeholder="Ex: Ana, Suporte Bot"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tom de voz</label>
                <Input
                  className="mt-1.5"
                  placeholder="Ex: casual, formal"
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cor do widget</label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="color"
                    value={form.widgetPrimaryColor}
                    onChange={(e) =>
                      setForm({ ...form, widgetPrimaryColor: e.target.value })
                    }
                    className="h-11 w-14 cursor-pointer rounded-xl border border-border bg-card"
                  />
                  <Input
                    value={form.widgetPrimaryColor}
                    onChange={(e) =>
                      setForm({ ...form, widgetPrimaryColor: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium">Personalidade</label>
              <Textarea
                className="mt-1.5"
                rows={2}
                placeholder="Traços centrais do agente…"
                value={form.personality}
                onChange={(e) =>
                  setForm({ ...form, personality: e.target.value })
                }
              />
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium">Características</label>
              <Textarea
                className="mt-1.5"
                rows={2}
                placeholder="Como escreve, tamanho das respostas, emojis…"
                value={form.characteristics}
                onChange={(e) =>
                  setForm({ ...form, characteristics: e.target.value })
                }
              />
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium">Instruções extras</label>
              <Textarea
                className="mt-1.5"
                rows={3}
                placeholder="Regras de comportamento, limites, quando escalar…"
                value={form.extraInstructions}
                onChange={(e) =>
                  setForm({ ...form, extraInstructions: e.target.value })
                }
              />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fallback humano</CardTitle>
              <CardDescription>
                Quando a KB não tiver resposta, o bot orienta o contato humano.
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Mensagem de fallback</label>
                <Textarea
                  className="mt-1.5"
                  rows={2}
                  value={form.fallbackMessage}
                  onChange={(e) =>
                    setForm({ ...form, fallbackMessage: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    className="mt-1.5"
                    type="email"
                    value={form.fallbackEmail}
                    onChange={(e) =>
                      setForm({ ...form, fallbackEmail: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    className="mt-1.5"
                    value={form.fallbackPhone}
                    onChange={(e) =>
                      setForm({ ...form, fallbackPhone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-4">
            <Button onClick={save} disabled={saving}>
              {saving ? "Salvando…" : "Salvar configurações"}
            </Button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Check className="h-4 w-4" />
                Salvo com sucesso
              </motion.span>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="overflow-hidden p-0">
            <div
              className="flex items-center gap-2 px-5 py-4 text-sm font-semibold text-white"
              style={{ background: form.widgetPrimaryColor }}
            >
              <UserCircle className="h-4 w-4" />
              Preview · {form.name || "Assistente"}
            </div>
            <div className="space-y-3 bg-muted/30 p-5">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-muted px-3 py-2 text-sm">
                Como funciona a devolução?
              </div>
              <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-border bg-card px-3 py-2 text-sm">
                <p className="mb-1 text-xs text-muted-foreground">
                  {form.name || "Bot"} · {form.tone || "tom padrão"}
                </p>
                {form.fallbackMessage ||
                  "Resposta baseada apenas na sua base de conhecimento."}
              </div>
              <div className="rounded-lg border border-border/60 bg-card/80 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                <p className="font-medium text-foreground/80">No prompt da IA</p>
                <p className="mt-1 line-clamp-2">
                  <span className="text-foreground/70">Personalidade: </span>
                  {form.personality || "—"}
                </p>
                <p className="mt-1 line-clamp-2">
                  <span className="text-foreground/70">Características: </span>
                  {form.characteristics || "—"}
                </p>
                {activePreset && (
                  <p className="mt-2 text-primary">Preset: {activePreset.label}</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
