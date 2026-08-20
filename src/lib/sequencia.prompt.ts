import { BASE_PEDAGOGICA } from "./blueprint.prompt";
import type { BlueprintPedagogico } from "./blueprint.functions";

export type FocoAula = "introducao" | "pratica" | "avaliacao" | "sistematizacao";

export type BlueprintAula = BlueprintPedagogico & {
  numero_aula: number;
  titulo_aula: string;
  foco_da_aula: FocoAula;
};

export type SequenciaIA = {
  titulo_geral: string;
  justificativa_progressao: string;
  aulas: BlueprintAula[];
};

export const SISTEMA_SEQUENCIA = `${BASE_PEDAGOGICA}

# TAREFA
Planejar uma sequência didática de 3 a 5 aulas sobre o mesmo tema, encadeadas com progressão pedagógica real e alinhadas à BNCC.

# EXIGÊNCIAS ESPECÍFICAS
- Progressão explícita: Aula 1 (introdução/sondagem do que a turma já sabe), aulas intermediárias (prática e aprofundamento) e última aula (avaliação/sistematização). Cada aula retoma nominalmente o que ficou da anterior.
- Cada aula: 5 a 7 etapas com tempo em minutos somando EXATAMENTE 50 minutos, e descrição com pelo menos 3 frases (o que o professor fala — com pergunta mediadora literal entre aspas —, o que os alunos fazem e como se verifica a compreensão).
- Objetivos por aula: no mínimo 4, com verbos observáveis, progredindo de reconhecer → aplicar → argumentar/criar ao longo da sequência.
- Erros comuns antecipados: no mínimo 4 por aula, cada um com a causa cognitiva ("porque o aluno pensa que...") e a intervenção imediata.
- Estratégias DUA: no mínimo 4 por aula, cobrindo representação, ação/expressão e engajamento, cada uma nomeando o perfil atendido e o passo concreto em sala.
- Recursos: itens específicos e quantificados, sempre viáveis em escola pública e com alternativa de custo zero.
- Avaliação: instrumento descrito passo a passo e de 3 a 5 critérios observáveis com o indicador de desempenho esperado.
- justificativa_progressao: explique em 3 a 4 frases por que essa ordem de aulas ensina melhor esse conteúdo específico.`;

export const SCHEMA_SEQUENCIA = {
  type: "object",
  properties: {
    titulo_geral: { type: "string" },
    justificativa_progressao: { type: "string" },
    aulas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          numero_aula: { type: "integer" },
          titulo_aula: { type: "string" },
          foco_da_aula: { type: "string", enum: ["introducao", "pratica", "avaliacao", "sistematizacao"] },
          natureza_do_conteudo: { type: "string" },
          conteudo_especifico: { type: "string" },
          faixa_etaria: { type: "string" },
          habilidades_bncc: {
            type: "array",
            items: {
              type: "object",
              properties: { codigo: { type: "string" }, descricao: { type: "string" } },
              required: ["codigo", "descricao"],
            },
          },
          objetivos_de_aprendizagem: { type: "array", items: { type: "string" } },
          competencias_gerais: { type: "array", items: { type: "string" } },
          conhecimentos_previos: { type: "array", items: { type: "string" } },
          erros_comuns_antecipados: { type: "array", items: { type: "string" } },
          metodologia_escolhida: {
            type: "object",
            properties: { nome: { type: "string" }, justificativa: { type: "string" } },
            required: ["nome", "justificativa"],
          },
          sequencia_didatica: {
            type: "array",
            items: {
              type: "object",
              properties: {
                etapa: { type: "string" },
                tempo: { type: "string" },
                descricao: { type: "string" },
              },
              required: ["etapa", "tempo", "descricao"],
            },
          },
          recursos_necessarios: { type: "array", items: { type: "string" } },
          estrategias_dua: {
            type: "array",
            items: {
              type: "object",
              properties: { perfil: { type: "string" }, adaptacao: { type: "string" } },
              required: ["perfil", "adaptacao"],
            },
          },
          avaliacao: {
            type: "object",
            properties: {
              tipo: { type: "string" },
              instrumento: { type: "string" },
              criterios: { type: "array", items: { type: "string" } },
            },
            required: ["tipo", "instrumento", "criterios"],
          },
          interdisciplinaridade: { type: "array", items: { type: "string" } },
          nota_de_originalidade: { type: "string" },
        },
        required: [
          "numero_aula",
          "titulo_aula",
          "foco_da_aula",
          "natureza_do_conteudo",
          "conteudo_especifico",
          "faixa_etaria",
          "habilidades_bncc",
          "objetivos_de_aprendizagem",
          "competencias_gerais",
          "conhecimentos_previos",
          "erros_comuns_antecipados",
          "metodologia_escolhida",
          "sequencia_didatica",
          "recursos_necessarios",
          "estrategias_dua",
          "avaliacao",
          "interdisciplinaridade",
          "nota_de_originalidade",
        ],
      },
    },
  },
  required: ["titulo_geral", "justificativa_progressao", "aulas"],
};
