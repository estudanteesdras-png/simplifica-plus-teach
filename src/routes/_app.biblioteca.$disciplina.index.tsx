import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Mascote } from "@/components/Mascote";
import { acharDisciplina, totalMateriais } from "@/lib/catalogo";

export const Route = createFileRoute("/_app/biblioteca/$disciplina/")({
  loader: ({ params }) => {
    const d = acharDisciplina(params.disciplina);
    if (!d) throw notFound();
    return { nome: d.nome, resumo: d.resumo };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.nome} — Biblioteca Simplifica+ Tech` },
          { name: "description", content: loaderData.resumo },
          { property: "og:title", content: `${loaderData.nome} — Biblioteca Simplifica+ Tech` },
          { property: "og:description", content: loaderData.resumo },
        ]
      : [{ title: "Disciplina não encontrada" }, { name: "robots", content: "noindex" }],
  }),
  errorComponent: () => <SemDisciplina />,
  notFoundComponent: () => <SemDisciplina />,
  component: PaginaDisciplina,
});

function SemDisciplina() {
  return (
    <div className="card-surface p-6">
      <p className="font-bold">Disciplina não encontrada.</p>
      <Link to="/biblioteca" className="mt-2 inline-block text-sm font-semibold text-brand-blue">
        Voltar para a biblioteca
      </Link>
    </div>
  );
}

function PaginaDisciplina() {
  const { disciplina: slug } = Route.useParams();
  const disciplina = acharDisciplina(slug);
  if (!disciplina) return <SemDisciplina />;

  return (
    <div>
      <Link
        to="/biblioteca"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={16} /> Biblioteca
      </Link>

      <div
        className={`mb-6 flex items-center gap-4 rounded-3xl bg-gradient-to-r ${disciplina.gradiente} p-6 text-white`}
      >
        <Mascote humor={disciplina.humor} size={64} />
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{disciplina.nome}</h1>
          <p className="text-sm opacity-90">{disciplina.resumo}</p>
          <p className="mt-1 text-xs opacity-80">
            {disciplina.conteudos.length} conteúdos · {totalMateriais(disciplina)} materiais completos
          </p>
        </div>
      </div>

      <PageHeader title="Conteúdos" subtitle="Escolha um conteúdo para ver a coleção completa de materiais." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {disciplina.conteudos.map((c) => (
          <Link
            key={c.slug}
            to="/biblioteca/$disciplina/$conteudo"
            params={{ disciplina: disciplina.slug, conteudo: c.slug }}
            className="card-surface flex flex-col p-5"
          >
            <h2 className="text-base font-bold">{c.nome}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.resumo}</p>
            <p className="mt-3 text-xs font-semibold text-brand-blue">
              {c.series.length * 2} materiais · {c.series.length} séries
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-purple">
              Abrir coleção <ArrowRight size={15} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}