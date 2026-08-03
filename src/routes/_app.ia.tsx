import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Brain, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Selecao } from "@/components/Selecao";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ADAPTACOES, DISCIPLINAS, SERIES, gerarAtividade, estrategias } from "@/lib/data";
import { calcularPerfil } from "@/lib/aprendizado";
import { Mascote } from "@/components/Mascote";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/ia")({
  head: () => ({
    meta: [
      { title: "IA educacional — Simplifica+ Tech" },
      {
        name: "description",
        content:
          "A IA gera atividades, sugere adaptações e aprende com as avaliações dos professores.",
      },
      { property: "og:title", content: "IA educacional — Simplifica+ Tech" },
      { property: "og:description", content: "Sugestões que melhoram com o uso e o feedback." },
    ],
  }),
  component: IA,
});

const ETAPAS = [
  "Analisando a necessidade da turma...",
  "Gerando atividade adaptada...",
  "Aprimorando sugestões com base nos feedbacks...",
];

function IA() {
  const { avaliacoes, atividades, eventos } = useApp();
  const perfil = useMemo(() => calcularPerfil(eventos, avaliacoes), [eventos, avaliacoes]);
  const [serie, setSerie] = useState(SERIES[3]);
  const [disciplina, setDisciplina] = useState(DISCIPLINAS[2]);
  const [necessidade, setNecessidade] = useState(ADAPTACOES[1]);
  const [conteudo, setConteudo] = useState("");
  const [etapa, setEtapa] = useState(-1);
  const [resultado, setResultado] = useState<ReturnType<typeof gerarAtividade> | null>(null);

  useEffect(() => {
    if (etapa < 0 || etapa >= ETAPAS.length) return;
    const t = setTimeout(() => {
      if (etapa === ETAPAS.length - 1) {
        setResultado(gerarAtividade({ serie, disciplina, conteudo, necessidade }));
        setEtapa(ETAPAS.length);
      } else {
        setEtapa((e) => e + 1);
      }
    }, 1100);
    return () => clearTimeout(t);
  }, [etapa, serie, disciplina, conteudo, necessidade]);

  const mediaFeedback = avaliacoes.length
    ? (avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length).toFixed(1)
    : "—";

  return (
    <div>
      <section className="card-surface mb-6 p-5">
        <div className="flex items-center gap-3">
          <Mascote humor="ouve" size={44} />
          <div>
            <h2 className="text-base font-bold">O que a IA já aprendeu com você</h2>
            <p className="text-xs text-muted-foreground">
              {perfil.totalSinais} sinais analisados (gerações, salvamentos, downloads, favoritos e
              avaliações).
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-purple">
              Padrões identificados
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {perfil.insights.length ? (
                perfil.insights.map((i) => <li key={i}>• {i}</li>)
              ) : (
                <li>• Ainda estamos aprendendo o seu perfil de turma.</li>
              )}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-purple">
              Ajustes aplicados nos próximos materiais
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {perfil.recomendacoes.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PageHeader
        title="IA educacional"
        subtitle="Gera atividades, sugere adaptações e aprende com as avaliações da biblioteca."
      />

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="card-surface space-y-4 p-5">
          <div className="space-y-2">
            <Label>Série</Label>
            <Selecao value={serie} onChange={setSerie} options={SERIES} />
          </div>
          <div className="space-y-2">
            <Label>Disciplina</Label>
            <Selecao value={disciplina} onChange={setDisciplina} options={DISCIPLINAS} />
          </div>
          <div className="space-y-2">
            <Label>Conteúdo ou dificuldade da turma</Label>
            <Input
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Ex.: interpretação de texto"
            />
          </div>
          <div className="space-y-2">
            <Label>Perfil de necessidade</Label>
            <Selecao value={necessidade} onChange={setNecessidade} options={ADAPTACOES} />
          </div>
          <Button
            className="w-full bg-brand text-primary-foreground shadow-glow"
            onClick={() => {
              setResultado(null);
              setEtapa(0);
            }}
            disabled={etapa >= 0 && etapa < ETAPAS.length}
          >
            <Sparkles size={16} /> Gerar com IA
          </Button>

          <div className="rounded-2xl bg-soft p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <Brain size={16} /> Aprendizado da IA
            </p>
            <p className="mt-2 text-muted-foreground">
              {avaliacoes.length} avaliação(ões) analisadas · nota média {mediaFeedback} ·{" "}
              {atividades.length} atividade(s) do seu histórico consideradas nas próximas sugestões.
            </p>
          </div>
        </div>

        <div className="card-surface p-6">
          {etapa >= 0 && etapa < ETAPAS.length && (
            <div className="space-y-4">
              <Progress value={((etapa + 1) / ETAPAS.length) * 100} />
              {ETAPAS.slice(0, etapa + 1).map((e) => (
                <p key={e} className="animate-in fade-in text-sm text-muted-foreground">
                  {e}
                </p>
              ))}
            </div>
          )}

          {etapa < 0 && (
            <div className="grid h-full min-h-64 place-items-center text-center text-sm text-muted-foreground">
              <p>
                Informe o contexto da turma e a IA vai analisar a necessidade, gerar a atividade e
                aprimorar a sugestão com base nos feedbacks dos professores.
              </p>
            </div>
          )}

          {resultado && (
            <div className="space-y-5">
              <div>
                <h3 className="mb-1 font-semibold text-brand-purple">Atividade sugerida</h3>
                <p className="text-sm text-muted-foreground">{resultado.enunciado}</p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-brand-purple">Adaptação recomendada</h3>
                <p className="text-sm text-muted-foreground">{resultado.versaoAdaptada}</p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-brand-purple">Conteúdo reorganizado</h3>
                <ol className="space-y-1.5 text-sm text-muted-foreground">
                  {resultado.passos.map((p, i) => (
                    <li key={p}>
                      {i + 1}. {p}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-brand-purple">Estratégias de apoio</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {estrategias(necessidade).map((e) => (
                    <li key={e}>• {e}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}