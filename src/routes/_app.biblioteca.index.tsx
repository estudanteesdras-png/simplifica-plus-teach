import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Globe, Lock, Search, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Mascote } from "@/components/Mascote";
import { SeloCuradoria } from "@/components/SeloCuradoria";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  VisualizadorMaterial,
  type FichaMaterial,
} from "@/components/material/VisualizadorMaterial";
import { CATALOGO, destaquesGlobais, totalMateriais, type Selo } from "@/lib/catalogo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/biblioteca/")({
  head: () => ({
    meta: [
      { title: "Biblioteca pedagógica — Simplifica+ Tech" },
      {
        name: "description",
        content:
          "Coleções completas por disciplina e conteúdo, com selo de curadoria, prévia em PDF e download.",
      },
      { property: "og:title", content: "Biblioteca pedagógica — Simplifica+ Tech" },
      {
        property: "og:description",
        content: "Planos, atividades, gabaritos e versões adaptadas organizados por disciplina.",
      },
    ],
  }),
  component: BibliotecaHub,
});

function BibliotecaHub() {
  const {
    materiais,
    curadoria,
    publicados,
    togglePublicado,
    removidos,
    avaliacoes,
    downloads,
    removeMaterial,
  } = useApp();
  const [busca, setBusca] = useState("");
  const [ficha, setFicha] = useState<FichaMaterial | null>(null);

  const destaques = useMemo(() => destaquesGlobais(4), []);
  const disciplinas = useMemo(
    () =>
      CATALOGO.filter((d) =>
        (d.nome + d.resumo + d.conteudos.map((c) => c.nome).join(" "))
          .toLowerCase()
          .includes(busca.toLowerCase()),
      ),
    [busca],
  );
  const comunidade = materiais.filter(
    (m) => publicados.includes(m.id) && !removidos.includes(m.id),
  );

  function notaDe(id: string) {
    const minhas = avaliacoes.filter((a) => a.materialId === id);
    return minhas.length ? minhas.reduce((s, a) => s + a.nota, 0) / minhas.length : 0;
  }

  return (
    <div>
      <PageHeader
        title="Biblioteca pedagógica"
        subtitle="Coleções completas por disciplina e conteúdo — com curadoria, prévia em PDF, download e avaliação."
      />

      <div className="relative mb-8 max-w-md">
        <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar disciplina ou conteúdo"
          className="pl-9"
        />
      </div>

      <section className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <Mascote humor="ideia" size={30} />
          <h2 className="text-lg font-bold">Seleção da Semana</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {destaques.map((item) => (
            <button
              key={item.id}
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
              className="card-surface overflow-hidden text-left"
            >
              <div className="flex h-24 items-center gap-3 bg-gradient-to-r from-[#1e2a6e] via-[#2a54c8] to-[#7c3aed] p-4 text-white">
                <Mascote humor={item.tipo === "plano" ? "escreve" : "ideia"} size={44} />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                    {item.rotulo}
                  </span>
                  <p className="truncate font-display text-sm font-extrabold">
                    {item.material.titulo}
                  </p>
                </div>
              </div>
              <div className="space-y-2 p-4">
                <SeloCuradoria selo={(curadoria[item.id] ?? item.seloOficial) as Selo} />
                <p className="text-xs text-muted-foreground">
                  {item.material.disciplina} · {item.material.serie}
                </p>
                <p className="text-xs text-muted-foreground">{item.autor}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">Disciplinas</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {disciplinas.map((d) => (
            <Link
              key={d.slug}
              to="/biblioteca/$disciplina"
              params={{ disciplina: d.slug }}
              className="card-surface group overflow-hidden"
            >
              <div className={`flex h-28 items-center gap-3 bg-gradient-to-r ${d.gradiente} p-4 text-white`}>
                <Mascote humor={d.humor} size={50} />
                <div className="min-w-0">
                  <p className="font-display text-lg font-extrabold">{d.nome}</p>
                  <p className="text-xs opacity-90">
                    {d.conteudos.length} conteúdos · {totalMateriais(d)} materiais
                  </p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{d.resumo}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue">
                  Explorar conteúdos <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <Mascote humor="ouve" size={30} />
          <h2 className="text-lg font-bold">Biblioteca da Comunidade ({comunidade.length})</h2>
        </div>
        {comunidade.length === 0 ? (
          <p className="card-surface p-5 text-sm text-muted-foreground">
            Nenhum material compartilhado ainda. No seu acervo, marque um material como
            “Compartilhado” para publicá-lo aqui para outros professores.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {comunidade.map((m) => (
              <button
                key={m.id}
                onClick={() =>
                  setFicha({ id: m.id, material: m, autor: "Compartilhado por você", doProfessor: true })
                }
                className="card-surface p-4 text-left"
              >
                <SeloCuradoria selo={(curadoria[m.id] ?? "nenhum") as Selo} />
                <p className="mt-2 font-bold">{m.titulo}</p>
                <p className="text-xs text-muted-foreground">
                  {m.disciplina} · {m.serie}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <StarRating value={notaDe(m.id)} size={13} />
                  <span className="text-xs text-muted-foreground">
                    {downloads[m.id] ?? 0} downloads
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Mascote humor="investiga" size={30} />
          <h2 className="text-lg font-bold">Meu acervo ({materiais.length})</h2>
        </div>
        {materiais.length === 0 ? (
          <p className="card-surface p-5 text-sm text-muted-foreground">
            Gere um plano de aula ou uma atividade e clique em “Salvar no acervo” para vê-lo aqui,
            com prévia em PDF, estatísticas e opção de compartilhar com a comunidade.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {materiais.map((m) => {
              const ehPlano = m.origem !== "atividade";
              const publico = publicados.includes(m.id);
              return (
                <article key={m.id} className="card-surface flex flex-col overflow-hidden">
                  <div
                    className={`flex h-28 items-center gap-3 bg-gradient-to-r p-4 text-white ${
                      ehPlano
                        ? "from-[#1e2a6e] via-[#2a54c8] to-[#7c3aed]"
                        : "from-[#4338ca] via-[#5b34d6] to-[#7c3aed]"
                    }`}
                  >
                    <Mascote humor={ehPlano ? "escreve" : "ideia"} size={46} />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                        {ehPlano ? "Plano de aula" : "Atividade + gabarito"}
                      </span>
                      <p className="truncate font-display text-sm font-extrabold">{m.titulo}</p>
                      <p className="truncate text-xs opacity-90">
                        {m.disciplina} · {m.serie}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {publico ? <Globe size={14} /> : <Lock size={14} />}
                      {publico ? "Compartilhado na comunidade" : "Privado — só você vê"}
                    </div>
                    <div className="mt-auto flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-brand text-primary-foreground"
                        onClick={() => setFicha({ id: m.id, material: m, doProfessor: true })}
                      >
                        Abrir leitor
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => togglePublicado(m.id)}>
                        {publico ? "Tornar privado" : "Compartilhar"}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles size={14} className="text-brand-purple" />
        Cada abertura, download e avaliação alimenta o sistema de aprendizado da IA.
      </p>

      <VisualizadorMaterial
        ficha={ficha}
        onClose={() => setFicha(null)}
        onRemover={(id) => removeMaterial(id)}
      />
    </div>
  );
}