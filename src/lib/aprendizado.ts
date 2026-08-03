import type { Avaliacao, EventoAprendizado } from "./store";

export type PerfilAprendizado = {
  totalSinais: number;
  disciplinaPreferida?: string;
  seriePreferida?: string;
  formatoPreferido?: "plano" | "atividade";
  adaptacaoPreferida?: string;
  notaMedia: number | null;
  insights: string[];
  recomendacoes: string[];
};

const PESO: Record<EventoAprendizado["tipo"], number> = {
  geracao: 1,
  salvo: 2,
  download: 3,
  favorito: 3,
  edicao: 2,
  avaliacao: 4,
};

function topo(mapa: Map<string, number>) {
  let melhor: string | undefined;
  let maior = 0;
  for (const [k, v] of mapa) if (v > maior) [melhor, maior] = [k, v];
  return melhor;
}

export function calcularPerfil(
  eventos: EventoAprendizado[],
  avaliacoes: Avaliacao[],
): PerfilAprendizado {
  const disciplinas = new Map<string, number>();
  const series = new Map<string, number>();
  const formatos = new Map<string, number>();
  const adaptacoes = new Map<string, number>();

  for (const e of eventos) {
    const peso = PESO[e.tipo] ?? 1;
    if (e.disciplina) disciplinas.set(e.disciplina, (disciplinas.get(e.disciplina) ?? 0) + peso);
    if (e.serie) series.set(e.serie, (series.get(e.serie) ?? 0) + peso);
    if (e.formato) formatos.set(e.formato, (formatos.get(e.formato) ?? 0) + peso);
    if (e.adaptacao) adaptacoes.set(e.adaptacao, (adaptacoes.get(e.adaptacao) ?? 0) + peso);
  }

  const notas = [
    ...avaliacoes.map((a) => a.nota),
    ...eventos.filter((e) => typeof e.nota === "number").map((e) => e.nota as number),
  ];
  const notaMedia = notas.length ? notas.reduce((s, n) => s + n, 0) / notas.length : null;

  const disciplinaPreferida = topo(disciplinas);
  const seriePreferida = topo(series);
  const formatoPreferido = topo(formatos) as PerfilAprendizado["formatoPreferido"];
  const adaptacaoPreferida = topo(adaptacoes);

  const insights: string[] = [];
  const recomendacoes: string[] = [];

  if (disciplinaPreferida)
    insights.push(
      `Você trabalha com mais frequência em ${disciplinaPreferida} — os materiais já abrem pré-configurados nesse componente.`,
    );
  if (seriePreferida)
    insights.push(`O ano/série mais recorrente nos seus materiais é ${seriePreferida}.`);
  if (formatoPreferido)
    insights.push(
      formatoPreferido === "atividade"
        ? "Você baixa mais folhas de atividade do que planos — priorizamos blocos de questões prontos para imprimir."
        : "Você usa mais planos de aula — reforçamos o cronograma por etapas e as perguntas mediadoras.",
    );
  if (adaptacaoPreferida && adaptacaoPreferida !== "Sem adaptação")
    insights.push(
      `As adaptações para ${adaptacaoPreferida} são as mais utilizadas na sua conta e vêm sempre incluídas.`,
    );
  if (notaMedia !== null)
    insights.push(
      `Média das suas avaliações: ${notaMedia.toFixed(1)} de 5,0 em ${notas.length} feedback(s).`,
    );

  if (eventos.length < 3)
    recomendacoes.push(
      "Gere, baixe e avalie alguns materiais para que a curadoria se ajuste ao seu perfil de turma.",
    );
  if (notaMedia !== null && notaMedia < 4)
    recomendacoes.push(
      "Suas notas indicam materiais longos demais: experimente reduzir a duração para 50 minutos e focar em dois blocos de questões.",
    );
  if (notaMedia !== null && notaMedia >= 4.5)
    recomendacoes.push(
      "O padrão atual está funcionando bem — mantenha os desafios contextualizados, que são os mais bem avaliados.",
    );
  if (formatoPreferido === "atividade")
    recomendacoes.push("Sugestão: gere o plano da mesma aula para registrar o diário de classe.");
  if (formatoPreferido === "plano")
    recomendacoes.push("Sugestão: gere a folha de atividade correspondente para aplicar em sala.");

  return {
    totalSinais: eventos.length,
    disciplinaPreferida,
    seriePreferida,
    formatoPreferido,
    adaptacaoPreferida,
    notaMedia,
    insights,
    recomendacoes,
  };
}
