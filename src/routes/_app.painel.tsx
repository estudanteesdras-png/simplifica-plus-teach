import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock, Heart, Layers, NotebookPen, Sparkles, Star, Wand2 } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/painel")({
  head: () => ({
    meta: [
      { title: "Painel do professor — Simplifica+ Tech" },
      { name: "description", content: "Acesso rápido aos planejamentos, atividades e materiais." },
      { property: "og:title", content: "Painel do professor — Simplifica+ Tech" },
      { property: "og:description", content: "Seu espaço de trabalho no Simplifica+ Tech." },
    ],
  }),
  component: Painel,
});

const ATALHOS = [
  { to: "/planos", icon: NotebookPen, t: "Planos de aula", d: "Monte um plano completo em minutos." },
  { to: "/atividades", icon: Wand2, t: "Criar atividade adaptada", d: "Gere versões para diferentes perfis." },
  { to: "/sequencias", icon: Layers, t: "Sequência didática", d: "Planeje de 3 a 5 aulas encadeadas." },
  { to: "/biblioteca", icon: BookOpen, t: "Biblioteca de materiais", d: "Filtre por disciplina, série e adaptação." },
  { to: "/historico", icon: Clock, t: "Histórico", d: "Retome planos e atividades salvos." },
  { to: "/favoritos", icon: Heart, t: "Favoritos", d: "Seus materiais preferidos." },
  { to: "/ia", icon: Sparkles, t: "IA educacional", d: "Sugestões que aprendem com os feedbacks." },
] as const;

function Painel() {
  const { user, materiais, favoritos, avaliacoes } = useApp();

  const atividades = materiais.filter((m) => m.origem === "atividade");
  const sequencias = materiais.filter((m) => m.origem === "sequencia");
  const planos = materiais.filter((m) => m.origem !== "atividade" && m.origem !== "sequencia");

  const stats = [
    { label: "Atividades criadas", value: atividades.length, icon: Wand2 },
    { label: "Materiais no acervo", value: materiais.length, icon: BookOpen },
    { label: "Favoritos", value: favoritos.length, icon: Heart },
    { label: "Avaliações recebidas", value: avaliacoes.length, icon: Star },
    { label: "Planejamentos", value: planos.length, icon: NotebookPen },
    { label: "Aulas em sequência", value: sequencias.length, icon: Layers },
  ];

  return (
    <div>
      <PageHeader
        title={`Olá, ${user?.nome === "Professor(a)" ? "professor(a)!" : `${user?.nome}!`}`}
        subtitle="Escolha por onde começar hoje. Seus materiais ficam salvos automaticamente."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-surface p-4">
            <s.icon size={18} className="text-brand-purple" />
            <p className="mt-3 font-display text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-lg font-bold">Acesso rápido</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ATALHOS.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="card-surface group p-5 transition-transform hover:-translate-y-1"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-primary-foreground">
              <a.icon size={20} />
            </span>
            <p className="mt-4 font-semibold">{a.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{a.d}</p>
          </Link>
        ))}
      </div>

      {materiais.length > 0 && (
        <>
          <h2 className="mb-4 mt-10 text-lg font-bold">Continue de onde parou</h2>
          <div className="card-surface divide-y divide-border">
            {materiais
              .map((m) => ({
                id: m.id,
                t: m.titulo,
                s: `${m.origem === "atividade" ? "Atividade" : m.origem === "sequencia" ? "Sequência" : "Plano"} · ${m.disciplina}`,
              }))
              .slice(0, 5)
              .map((item) => (
                <div key={item.id} className="flex min-w-0 items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.t}</p>
                    <p className="text-xs text-muted-foreground">{item.s}</p>
                  </div>
                  <Link to="/historico" className="shrink-0 text-sm font-medium text-brand-purple">
                    Abrir
                  </Link>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}