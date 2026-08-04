import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, FileText, Users } from "lucide-react";

import { Mascote } from "@/components/Mascote";
import { SeloCuradoria } from "@/components/SeloCuradoria";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import {
  VisualizadorMaterial,
  type FichaMaterial,
} from "@/components/material/VisualizadorMaterial";
import { acharConteudo, acharDisciplina, colecaoDe, type Selo } from "@/lib/catalogo";
import { useApp } from "@/lib/store";

function tituloCurto(nome: string, disciplina: string) {
  const completo = `${nome} — ${disciplina} | Simplifica+`;
  if (completo.length <= 60) return completo;
  const curto = `${nome} | Simplifica+`;
  return curto.length <= 60 ? curto : `${nome.slice(0, 45).trim()}… | Simplifica+`;
}

export const Route = createFileRoute("/_app/biblioteca/$disciplina/$conteudo")({
  loader: ({ params }) => {
    const d = acharDisciplina(params.disciplina);
    const c = acharConteudo(d, params.conteudo);
    if (!d || !c) throw notFound();
    return { nome: c.nome, resumo: c.resumo, disciplina: d.nome };
  },
  head: ({ params, loaderData }) => ({
    meta: loaderData
      ? [
          { title: tituloCurto(loaderData.nome, loaderData.disciplina) },
          { name: "description", content: loaderData.resumo },
          {
            property: "og:title",
            content: tituloCurto(loaderData.nome, loaderData.disciplina),
          },
          { property: "og:description", content: loaderData.resumo },
          {
            property: "og:url",
            content: `https://simplificatechbr.com.br/biblioteca/${params.disciplina}/${params.conteudo}`,
          },
        ]
      : [{ title: "Conteúdo não encontrado" }, { name: "robots", content: "noindex" }],
    links: [
      {
        rel: "canonical",
        href: `https://simplificatechbr.com.br/biblioteca/${params.disciplina}/${params.conteudo}`,
      },
    ],
  }),
  errorComponent: () => <SemConteudo />,
  notFoundComponent: () => <SemConteudo />,
  component: PaginaConteudo,
});

function SemConteudo() {
  return (
    <div className="card-surface p-6">
      <p className="font-bold">Conteúdo não encontrado.</p>
      <Link to="/biblioteca" className="mt-2 inline-block text-sm font-semibold text-brand-blue">
        Voltar para a biblioteca
      </Link>
    </div>
  );
}

function PaginaConteudo() {
  const { disciplina: dSlug, conteudo: cSlug } = Route.useParams();
  const disciplina = acharDisciplina(dSlug);
  const conteudo = acharConteudo(disciplina, cSlug);
  const { curadoria, removidos, avaliacoes, downloads, isAdmin } = useApp();
  const [ficha, setFicha] = useState<FichaMaterial | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "plano" | "atividade">("todos");

  const colecao = useMemo(() => colecaoDe(dSlug, cSlug), [dSlug, cSlug]);

  if (!disciplina || !conteudo) return <SemConteudo />;

  const itens = colecao
    .filter((i) => (isAdmin ? true : !removidos.includes(i.id)))
    .filter((i) => filtro === "todos" || i.tipo === filtro);

  return (
    <div>
      <Link
        to="/biblioteca/$disciplina"
        params={{ disciplina: disciplina.slug }}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={16} /> {disciplina.nome}
      </Link>

      <div
        className={`mb-6 flex items-center gap-4 rounded-3xl bg-gradient-to-r ${disciplina.gradiente} p-6 text-white`}
      >
        <Mascote humor={disciplina.humor} size={58} />
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold">{conteudo.nome}</h1>
          <p className="text-sm opacity-90">{conteudo.resumo}</p>
          <p className="mt-1 text-xs opacity-80">
            {colecao.length} materiais completos · planos, atividades, gabarito e versão adaptada
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {(
          [
            ["todos", "Todos"],
            ["plano", "Planos de aula"],
            ["atividade", "Atividades"],
          ] as const
        ).map(([v, texto]) => (
          <Button
            key={v}
            size="sm"
            variant={filtro === v ? "default" : "outline"}
            className={filtro === v ? "bg-brand text-primary-foreground" : ""}
            onClick={() => setFiltro(v)}
          >
            {texto}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {itens.map((item) => {
          const selo = (curadoria[item.id] ?? item.seloOficial) as Selo;
          const minhas = avaliacoes.filter((a) => a.materialId === item.id);
          const media = minhas.length ? minhas.reduce((s, a) => s + a.nota, 0) / minhas.length : 0;
          const questoes = item.material.atividade.blocos.reduce(
            (s, b) => s + b.questoes.length,
            0,
          );
          return (
            <article key={item.id} className="card-surface flex flex-col overflow-hidden">
              <div
                className={`flex h-28 items-center gap-3 bg-gradient-to-r p-4 text-white ${
                  item.tipo === "plano"
                    ? "from-[#1e2a6e] via-[#2a54c8] to-[#7c3aed]"
                    : "from-[#4338ca] via-[#5b34d6] to-[#7c3aed]"
                }`}
              >
                <Mascote humor={item.tipo === "plano" ? "escreve" : "ideia"} size={46} />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                    {item.rotulo}
                  </span>
                  <p className="truncate font-display text-sm font-extrabold">
                    {item.material.titulo}
                  </p>
                  <p className="truncate text-xs opacity-90">{item.material.serie}</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <SeloCuradoria selo={selo} />
                {removidos.includes(item.id) && (
                  <span className="text-xs font-semibold text-destructive">
                    Removido da biblioteca (visível só para administradores)
                  </span>
                )}
                <p className="text-sm text-muted-foreground">{item.material.subtitulo}</p>
                <p className="text-xs text-muted-foreground">
                  BNCC {item.material.codigosBNCC} · {item.material.duracao}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users size={13} /> {item.autor} ·{" "}
                  {new Date(item.publicadoEm).toLocaleDateString("pt-BR")}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText size={13} />
                  {item.tipo === "plano"
                    ? `${item.material.plano.momentos.length} etapas · 2 páginas`
                    : `${questoes} questões · 6 páginas`}
                </p>
                <div className="flex items-center gap-2">
                  <StarRating value={media} size={13} />
                  <span className="text-xs text-muted-foreground">
                    {minhas.length ? media.toFixed(1) : "sem avaliação"} ·{" "}
                    {downloads[item.id] ?? 0} downloads
                  </span>
                </div>
                <Button
                  size="sm"
                  className="mt-2 bg-brand text-primary-foreground"
                  onClick={() =>
                    setFicha({
                      id: item.id,
                      material: item.material,
                      rotulo: item.rotulo,
                      autor: item.autor,
                      publicadoEm: item.publicadoEm,
                      selo: item.seloOficial,
                    })
                  }
                >
                  Abrir leitor de PDF
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <VisualizadorMaterial ficha={ficha} onClose={() => setFicha(null)} />
    </div>
  );
}