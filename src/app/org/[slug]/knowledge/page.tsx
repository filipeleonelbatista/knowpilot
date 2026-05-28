"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, FileText, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader, OrgQuickLinks } from "@/components/dashboard-shell";

type Doc = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

export default function KnowledgePage() {
  const { slug } = useParams<{ slug: string }>();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetch(`/api/orgs/by-slug/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setOrgId(d.organization?.id);
        if (d.organization?.id) loadDocs(d.organization.id);
      });
  }, [slug]);

  function loadDocs(id: string) {
    void fetch(`/api/orgs/${id}/knowledge`)
      .then((r) => r.json())
      .then((d) => setDocuments(d.documents ?? []));
  }

  async function save() {
    if (!orgId || !title.trim()) return;
    setSaving(true);
    const payload = { title, content };
    if (editingId) {
      await fetch(`/api/orgs/${orgId}/knowledge/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(`/api/orgs/${orgId}/knowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setTitle("");
    setContent("");
    setEditingId(null);
    setSaving(false);
    loadDocs(orgId);
  }

  async function remove(id: string) {
    if (!orgId || !confirm("Excluir este documento?")) return;
    await fetch(`/api/orgs/${orgId}/knowledge/${id}`, { method: "DELETE" });
    loadDocs(orgId);
  }

  function startEdit(doc: Doc) {
    setEditingId(doc.id);
    setTitle(doc.title);
    setContent(doc.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Base de conhecimento"
        description="Documentos indexados com embeddings para o atendente IA."
      />
      <OrgQuickLinks slug={slug} />

      <div className="grid gap-8 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {editingId ? (
                  <Pencil className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </span>
              {editingId ? "Editar documento" : "Novo documento"}
            </CardTitle>
            <CardDescription>
              Ao salvar, o texto é dividido em chunks e indexado via Ollama.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <Input
              placeholder="Título do documento"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Cole FAQs, políticas, catálogo…"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={save} disabled={saving}>
                {saving ? "Indexando…" : "Salvar e indexar"}
              </Button>
              {editingId && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setContent("");
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="xl:col-span-3">
          <div className="mb-4 flex items-center gap-3">
            <Input
              placeholder="Buscar documentos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {filtered.length} doc{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="flex h-full flex-col p-5 transition-shadow hover:shadow-md hover:shadow-indigo-500/5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold leading-snug line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">
                      {doc.content}
                    </p>
                    <p className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {doc.updatedAt
                        ? new Date(doc.updatedAt).toLocaleDateString("pt-BR")
                        : "—"}
                    </p>
                    <div className="mt-4 flex gap-2 border-t border-border pt-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => startEdit(doc)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => remove(doc.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <Card className="py-16 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 font-medium">Nenhum documento ainda</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Adicione conteúdo ao lado para alimentar o atendente.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
