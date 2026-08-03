import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MATERIAIS } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil do professor — Simplifica+ Tech" },
      { name: "description", content: "Dados, materiais salvos, histórico e preferências de ensino." },
      { property: "og:title", content: "Perfil do professor — Simplifica+ Tech" },
      { property: "og:description", content: "Gerencie seu perfil docente." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { user, updateUser, salvos, planos, avaliacoes } = useApp();
  const [form, setForm] = useState({
    nome: user?.nome ?? "",
    escola: user?.escola ?? "",
    disciplina: user?.disciplina ?? "",
    preferencias: user?.preferencias ?? "",
  });

  return (
    <div>
      <PageHeader title="Perfil do professor" subtitle="Seus dados e sua trajetória na plataforma." />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-surface space-y-4 p-6">
          <h2 className="font-bold">Dados</h2>
          {(
            [
              ["nome", "Nome"],
              ["escola", "Escola"],
              ["disciplina", "Disciplina"],
            ] as const
          ).map(([k, label]) => (
            <div key={k} className="space-y-2">
              <Label htmlFor={k}>{label}</Label>
              <Input
                id={k}
                value={form[k]}
                onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
              />
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="pref">Preferências de ensino</Label>
            <Textarea
              id="pref"
              rows={3}
              value={form.preferencias}
              onChange={(e) => setForm((f) => ({ ...f, preferencias: e.target.value }))}
            />
          </div>
          <Button
            className="bg-brand text-primary-foreground"
            onClick={() => {
              updateUser(form);
              toast.success("Perfil atualizado.");
            }}
          >
            Salvar alterações
          </Button>
        </section>

        <div className="space-y-6">
          <section className="card-surface p-6">
            <h2 className="font-bold">Materiais salvos ({salvos.length})</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {MATERIAIS.filter((m) => salvos.includes(m.id)).map((m) => (
                <li key={m.id}>• {m.titulo}</li>
              ))}
              {salvos.length === 0 && <li>Nenhum material salvo ainda.</li>}
            </ul>
          </section>

          <section className="card-surface p-6">
            <h2 className="font-bold">Histórico de planejamentos ({planos.length})</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {planos.slice(0, 5).map((p) => (
                <li key={p.id}>
                  • {p.tema} — {p.disciplina}
                </li>
              ))}
              {planos.length === 0 && <li>Nenhum planejamento criado ainda.</li>}
            </ul>
          </section>

          <section className="card-surface p-6">
            <h2 className="font-bold">Avaliações feitas ({avaliacoes.length})</h2>
            <ul className="mt-3 space-y-3">
              {avaliacoes.slice(0, 5).map((a) => (
                <li key={a.id} className="text-sm text-muted-foreground">
                  <StarRating value={a.nota} size={13} />
                  <p className="mt-1">
                    {MATERIAIS.find((m) => m.id === a.materialId)?.titulo}
                    {a.comentario ? ` — “${a.comentario}”` : ""}
                  </p>
                </li>
              ))}
              {avaliacoes.length === 0 && (
                <li className="text-sm text-muted-foreground">Nenhuma avaliação enviada ainda.</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}