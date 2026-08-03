import type { BlueprintPedagogico } from "./blueprint.functions";
import { gerarMaterialCompleto, type MaterialCompleto, type Questao } from "./material";
import type { ConjuntoQuestoesIA } from "./questoes.prompt";
import type { BlueprintAula, SequenciaIA } from "./sequencia.prompt";

const DIGITAL = /digital|v[ií]deo|slide|app|aplicativo|internet|computador|tablet|celular|projetor|site|online/i;

function minutosDe(tempo: string, fallback: number) {
  const n = parseInt(String(tempo).replace(/\D+/g, " ").trim(), 10);
  return Number.isFinite(n) && n > 0 && n <= 300 ? n : fallback;
}

/** Preenche os campos estruturados do layout do plano com o retorno da IA. */
export function aplicarBlueprint(m: MaterialCompleto, bp: BlueprintPedagogico): MaterialCompleto {
  const habilidades = (bp.habilidades_bncc ?? []).map((h) => ({
    codigo: h.codigo,
    texto: h.descricao,
  }));
  const recursos = bp.recursos_necessarios ?? [];
  const digitais = recursos.filter((r) => DIGITAL.test(r));
  const fisicos = recursos.filter((r) => !DIGITAL.test(r));
  const etapas = bp.sequencia_didatica ?? [];

  return {
    ...m,
    faixaEtaria: bp.faixa_etaria || m.faixaEtaria,
    codigosBNCC: habilidades.length ? habilidades.map((h) => h.codigo).join(" · ") : m.codigosBNCC,
    subtitulo: bp.conteudo_especifico || m.subtitulo,
    plano: {
      ...m.plano,
      objetivos: bp.objetivos_de_aprendizagem?.length
        ? bp.objetivos_de_aprendizagem
        : m.plano.objetivos,
      competencias: bp.competencias_gerais?.length ? bp.competencias_gerais : m.plano.competencias,
      habilidades: habilidades.length ? habilidades : m.plano.habilidades,
      recursosFisicos: fisicos.length ? fisicos : m.plano.recursosFisicos,
      recursosDigitais: digitais.length ? digitais : m.plano.recursosDigitais,
      momentos: etapas.length
        ? etapas.map((e, i) => ({
            titulo: e.etapa,
            minutos: minutosDe(e.tempo, 10),
            itens: [
              { titulo: `Etapa ${i + 1}`, texto: e.descricao },
              ...(i === 0 && bp.conhecimentos_previos?.length
                ? [
                    {
                      titulo: "Conhecimentos prévios",
                      texto: bp.conhecimentos_previos.join(" • "),
                    },
                  ]
                : []),
              ...(i === etapas.length - 1 && bp.erros_comuns_antecipados?.length
                ? [
                    {
                      titulo: "Erros comuns a antecipar",
                      texto: bp.erros_comuns_antecipados.join(" • "),
                    },
                  ]
                : []),
            ],
          }))
        : m.plano.momentos,
      perguntasOrientadoras: bp.erros_comuns_antecipados?.length
        ? bp.erros_comuns_antecipados.map((e) => `Como verificar se a turma superou: ${e}`)
        : m.plano.perguntasOrientadoras,
      inclusao: bp.estrategias_dua?.length
        ? bp.estrategias_dua.map((d) => ({ perfil: d.perfil, estrategias: d.adaptacao }))
        : m.plano.inclusao,
      avaliacaoFormativa: bp.avaliacao
        ? `${bp.avaliacao.tipo} — ${bp.avaliacao.instrumento}`
        : m.plano.avaliacaoFormativa,
      avaliacaoSomativa: bp.avaliacao?.criterios?.length
        ? bp.avaliacao.criterios.join(" • ")
        : m.plano.avaliacaoSomativa,
    },
  };
}

/** Converte o conjunto de questões da IA para os blocos da folha de atividade. */
export function aplicarQuestoes(m: MaterialCompleto, c: ConjuntoQuestoesIA): MaterialCompleto {
  const objetivas: Questao[] = [];
  const vf: Questao[] = [];
  const discursivas: Questao[] = [];
  const contextos: Questao[] = [];
  let n = 0;

  for (const q of c.questoes ?? []) {
    n += 1;
    const base = { numero: n, competencia: q.competencia, criterio: q.criterio };
    if (q.tipo === "objetiva" && q.alternativas?.length) {
      objetivas.push({
        tipo: "objetiva",
        ...base,
        enunciado: q.enunciado,
        alternativas: q.alternativas,
        correta: Math.max(0, Math.min(q.alternativas.length - 1, q.correta ?? 0)),
        explicacao: q.explicacao,
      });
    } else if (q.tipo === "vf") {
      vf.push({
        tipo: "objetiva",
        ...base,
        enunciado: q.enunciado,
        alternativas: q.alternativas?.length ? q.alternativas : ["Verdadeiro", "Falso"],
        correta: Math.max(0, Math.min(1, q.correta ?? 0)),
        explicacao: q.explicacao,
      });
    } else if (q.tipo === "contexto") {
      contextos.push({
        tipo: "contexto",
        ...base,
        titulo: q.titulo || "Situação-problema",
        texto: q.texto || q.enunciado,
        itens: q.itens?.length
          ? q.itens
          : [{ pergunta: q.enunciado, resposta: q.respostaEsperada ?? "" }],
        explicacao: q.explicacao,
      });
    } else {
      discursivas.push({
        tipo: "discursiva",
        ...base,
        enunciado: q.enunciado,
        linhas: 4,
        respostaEsperada: q.respostaEsperada || q.explicacao,
      });
    }
  }

  const blocos = [
    { titulo: "Bloco 1 — Múltipla escolha", questoes: objetivas },
    { titulo: "Bloco 2 — Verdadeiro ou falso", questoes: vf },
    { titulo: "Bloco 3 — Questões discursivas", questoes: discursivas },
    { titulo: "Bloco 4 — Problemas contextualizados", questoes: contextos },
  ].filter((b) => b.questoes.length > 0);

  if (!blocos.length) return m;

  return {
    ...m,
    atividade: {
      instrucoes: c.instrucoes?.length ? c.instrucoes : m.atividade.instrucoes,
      blocos,
    },
  };
}

/** Converte os blueprints de uma sequência didática em aulas com MaterialCompleto. */
export function aplicarSequencia(
  entrada: {
    disciplina: string;
    serie: string;
    tema: string;
    adaptacao: string;
    professor?: string;
  },
  sequencia: SequenciaIA,
): {
  id: string;
  titulo: string;
  disciplina: string;
  serie: string;
  tema: string;
  adaptacao: string;
  criadoEm: string;
  aulas: {
    numero: number;
    titulo: string;
    foco: "introducao" | "pratica" | "avaliacao" | "sistematizacao";
    duracao: string;
    material: MaterialCompleto;
  }[];
} {
  const aulas = (sequencia.aulas ?? []).map((bp: BlueprintAula) => {
    const base = gerarMaterialCompleto({
      disciplina: entrada.disciplina,
      serie: entrada.serie,
      tema: `${entrada.tema} — ${bp.titulo_aula}`,
      duracao: "50 minutos",
      objetivoProfessor: bp.objetivos_de_aprendizagem?.[0] ?? "",
      professor: entrada.professor,
    });

    const material = aplicarBlueprint(base, bp);

    return {
      numero: bp.numero_aula,
      titulo: bp.titulo_aula,
      foco: bp.foco_da_aula,
      duracao: "50 minutos",
      material,
    };
  });

  return {
    id: `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`,
    titulo: sequencia.titulo_geral || `Sequência didática: ${entrada.tema}`,
    disciplina: entrada.disciplina,
    serie: entrada.serie,
    tema: entrada.tema,
    adaptacao: entrada.adaptacao,
    criadoEm: new Date().toISOString(),
    aulas,
  };
}
