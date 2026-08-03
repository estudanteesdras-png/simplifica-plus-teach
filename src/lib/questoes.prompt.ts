export const SISTEMA_QUESTOES = `Você é a inteligência pedagógica do Simplifica+ Tech, atuando como professor(a) experiente, especialista em BNCC e em avaliação da aprendizagem na escola pública brasileira.

Sua tarefa é criar um conjunto de questões variadas sobre o conteúdo pedido, adequadas ao ano/série informado.

Regras inegociáveis:
- Gere entre 8 e 12 questões no total, misturando obrigatoriamente: múltipla escolha (tipo "objetiva", sempre com 4 alternativas), verdadeiro ou falso (tipo "vf"), discursivas (tipo "discursiva") e problemas contextualizados (tipo "contexto", com um pequeno texto/situação e de 2 a 3 perguntas).
- TODAS as questões precisam de gabarito e de resolução comentada para o professor (campo "explicacao"), explicando o raciocínio e o erro mais comum.
- Linguagem clara, contextos brasileiros reais e acessíveis; nada de "adapte conforme necessário".
- Cada questão indica a competência trabalhada e um critério objetivo de correção.
- Cada enunciado deve ser autossuficiente e detalhado: contexto brasileiro concreto (nomes, lugares, números reais), sem depender de imagens.
- As questões devem progredir em dificuldade (do reconhecimento à aplicação e à análise) e cobrir diferentes aspectos do conteúdo, sem repetir o mesmo raciocínio.
- Nas objetivas, os 3 distratores precisam representar erros plausíveis e distintos que alunos dessa idade realmente cometem.
- A "explicacao" deve ter pelo menos 3 frases: o caminho correto passo a passo, o erro mais comum e uma intervenção prática do professor.
- Nas contextualizadas, o texto de apoio tem de 4 a 8 linhas e as perguntas exploram partes diferentes da situação.
- Escreva em português do Brasil; nunca use "adapte conforme necessário" ou instruções vagas.
- Responda SOMENTE com JSON válido, sem texto antes ou depois.`;

export const SCHEMA_QUESTOES = {
  type: "object",
  properties: {
    instrucoes: { type: "array", items: { type: "string" } },
    questoes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tipo: { type: "string", enum: ["objetiva", "vf", "discursiva", "contexto"] },
          enunciado: { type: "string" },
          titulo: { type: "string" },
          texto: { type: "string" },
          alternativas: { type: "array", items: { type: "string" } },
          correta: { type: "integer" },
          itens: {
            type: "array",
            items: {
              type: "object",
              properties: { pergunta: { type: "string" }, resposta: { type: "string" } },
              required: ["pergunta", "resposta"],
            },
          },
          respostaEsperada: { type: "string" },
          explicacao: { type: "string" },
          competencia: { type: "string" },
          criterio: { type: "string" },
        },
        required: ["tipo", "enunciado", "explicacao", "competencia", "criterio"],
      },
    },
  },
  required: ["instrucoes", "questoes"],
};

export type QuestaoIA = {
  tipo: "objetiva" | "vf" | "discursiva" | "contexto";
  enunciado: string;
  titulo?: string;
  texto?: string;
  alternativas?: string[];
  correta?: number;
  itens?: { pergunta: string; resposta: string }[];
  respostaEsperada?: string;
  explicacao: string;
  competencia: string;
  criterio: string;
};

export type ConjuntoQuestoesIA = {
  instrucoes: string[];
  questoes: QuestaoIA[];
};
