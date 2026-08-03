import { BookOpen, Compass, ListChecks, Sparkles, Target, Users } from "lucide-react";

import type { BlueprintPedagogico } from "@/lib/blueprint.functions";

function Bloco({
  icon: Icon,
  titulo,
  children,
}: {
  icon: typeof Target;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-purple">
        <Icon size={16} /> {titulo}
      </h4>
      <div className="space-y-1.5 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export function BlueprintCard({ bp }: { bp: BlueprintPedagogico }) {
  return (
    <section className="card-surface nao-imprimir space-y-5 p-6">
      <header className="flex items-center gap-3 border-b pb-4">
        <span className="grid size-10 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-glow">
          <Sparkles size={18} />
        </span>
        <div>
          <h3 className="text-base font-bold">Blueprint Pedagógico (Fase 1)</h3>
          <p className="text-xs text-muted-foreground">
            {bp.conteudo_especifico} · {bp.faixa_etaria} · conteúdo {bp.natureza_do_conteudo}
          </p>
        </div>
      </header>

      <Bloco icon={BookOpen} titulo="Habilidades BNCC">
        <ul className="space-y-1.5">
          {bp.habilidades_bncc?.map((h) => (
            <li key={h.codigo}>
              <span className="font-semibold text-foreground">{h.codigo}</span> — {h.descricao}
            </li>
          ))}
        </ul>
      </Bloco>

      <Bloco icon={Target} titulo="Objetivos de aprendizagem">
        <ul className="space-y-1.5">
          {bp.objetivos_de_aprendizagem?.map((o) => <li key={o}>• {o}</li>)}
        </ul>
        {bp.competencias_gerais?.length ? (
          <p className="pt-1 text-xs">
            <span className="font-semibold">Competências gerais:</span>{" "}
            {bp.competencias_gerais.join(" · ")}
          </p>
        ) : null}
      </Bloco>

      <Bloco icon={Compass} titulo={`Metodologia: ${bp.metodologia_escolhida?.nome ?? ""}`}>
        <p>{bp.metodologia_escolhida?.justificativa}</p>
      </Bloco>

      <Bloco icon={ListChecks} titulo="Sequência didática">
        <ol className="space-y-2">
          {bp.sequencia_didatica?.map((e, i) => (
            <li key={`${e.etapa}-${i}`} className="rounded-xl bg-soft p-3">
              <p className="text-sm font-semibold text-foreground">
                {i + 1}. {e.etapa}{" "}
                <span className="font-normal text-muted-foreground">({e.tempo})</span>
              </p>
              <p className="mt-1">{e.descricao}</p>
            </li>
          ))}
        </ol>
      </Bloco>

      <Bloco icon={Users} titulo="Estratégias DUA e inclusão">
        <ul className="space-y-1.5">
          {bp.estrategias_dua?.map((d) => (
            <li key={d.perfil}>
              <span className="font-semibold text-foreground">{d.perfil}:</span> {d.adaptacao}
            </li>
          ))}
        </ul>
      </Bloco>

      <div className="grid gap-5 md:grid-cols-2">
        <Bloco icon={ListChecks} titulo="Avaliação">
          <p>
            <span className="font-semibold text-foreground">{bp.avaliacao?.tipo}</span> —{" "}
            {bp.avaliacao?.instrumento}
          </p>
          <ul className="space-y-1">
            {bp.avaliacao?.criterios?.map((c) => <li key={c}>• {c}</li>)}
          </ul>
        </Bloco>
        <Bloco icon={Compass} titulo="Conhecimentos prévios e erros comuns">
          <ul className="space-y-1">
            {bp.conhecimentos_previos?.map((c) => <li key={c}>• {c}</li>)}
          </ul>
          <ul className="space-y-1 pt-1">
            {bp.erros_comuns_antecipados?.map((c) => <li key={c}>⚠ {c}</li>)}
          </ul>
        </Bloco>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Bloco icon={ListChecks} titulo="Recursos necessários">
          <ul className="space-y-1">
            {bp.recursos_necessarios?.map((r) => <li key={r}>• {r}</li>)}
          </ul>
        </Bloco>
        <Bloco icon={Compass} titulo="Interdisciplinaridade">
          <ul className="space-y-1">
            {bp.interdisciplinaridade?.map((r) => <li key={r}>• {r}</li>)}
          </ul>
        </Bloco>
      </div>

      {bp.nota_de_originalidade ? (
        <p className="rounded-xl bg-soft p-3 text-xs text-muted-foreground">
          <span className="font-semibold">Nota de originalidade:</span> {bp.nota_de_originalidade}
        </p>
      ) : null}
    </section>
  );
}
