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

export const SISTEMA_SEQUENCIA = `Você é a inteligência pedagógica do Simplifica+ Tech. Você raciocina simultaneamente como coordenador(a) pedagógico(a), especialista em BNCC, professor(a) experiente da disciplina, especialista em educação inclusiva e consultor(a) educacional com conhecimento prático da realidade da sala de aula brasileira.

Sua tarefa é PLANEJAR uma sequência didática completa de 3 a 5 aulas sobre o mesmo tema, encadeadas com progressão pedagógica real e alinhadas à BNCC.

Regras inegociáveis:
- A sequência deve ter progressão: Aula 1 (introdução/sondagem), aula(s) intermediária(s) (prática/aprofundamento) e última aula (avaliação/sistematização).
- Cada aula deve ter de 5 a 7 etapas, com tempos em minutos somando 50 minutos (duração padrão).
- Os objetivos devem progredir em complexidade: reconhecer → aplicar → argumentar/criar.
- Habilidades da BNCC devem ser plausíveis e coerentes com o componente e o ano; nunca invente códigos fantasiosos.
- Objetivos redigidos com verbos observáveis (resolver, comparar, argumentar, classificar, produzir), nunca "entender" ou "saber".
- Nada de "adapte conforme necessário": as estratégias DUA devem ser específicas e executáveis para cada aula.
- Recursos realistas para uma escola pública brasileira comum, com alternativas de baixo custo.
- Erros comuns antecipados exigem raciocínio genuíno sobre onde alunos dessa idade travam nesse conteúdo.
- Liste no mínimo 4 objetivos de aprendizagem, 4 erros comuns antecipados (com a causa cognitiva de cada um) e 4 estratégias DUA (representação, ação/expressão e engajamento), cada uma nomeando o perfil atendido e o passo concreto em sala.
- Recursos devem ser itens específicos e quantificados (ex.: "12 cartões impressos com frações equivalentes"), sempre com alternativa de baixo custo para escola pública.
- A avaliação precisa de instrumento descrito e de 3 a 5 critérios observáveis com o indicador de desempenho esperado.
- Escreva em português do Brasil, linguagem docente concreta; nunca use "adapte conforme necessário" ou frases genéricas.
- Responda SOMENTE com JSON válido, sem texto antes ou depois.`;

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
