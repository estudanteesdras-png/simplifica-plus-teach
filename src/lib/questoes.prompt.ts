import { BASE_PEDAGOGICA } from "./blueprint.prompt";

export const SISTEMA_QUESTOES = `${BASE_PEDAGOGICA}

# TAREFA
Criar um conjunto de questões avaliativas sobre o conteúdo pedido, adequado ao ano/série informado, pronto para imprimir e aplicar amanhã.

# EXIGÊNCIAS ESPECÍFICAS
- 8 a 12 questões, misturando obrigatoriamente: múltipla escolha (tipo "objetiva", sempre 4 alternativas), verdadeiro ou falso (tipo "vf"), discursivas (tipo "discursiva") e problemas contextualizados (tipo "contexto", com texto de apoio de 4 a 8 linhas e 2 a 3 perguntas que exploram partes diferentes da situação).
- Progressão real de dificuldade: reconhecer → aplicar → analisar/argumentar. Nenhuma questão pode repetir o raciocínio de outra.
- Cada enunciado é autossuficiente: contexto brasileiro concreto (nomes, cidades, valores em reais, situações de bairro/escola/feira), números coerentes e nenhuma dependência de imagem, cor ou material extra.
- Objetivas: os 3 distratores representam erros plausíveis, distintos e realmente cometidos por alunos dessa idade (nunca alternativas absurdas ou de tamanho denunciador). O campo "correta" é o índice (0 a 3) da alternativa certa.
- "explicacao" (para o professor) com no mínimo 3 frases: (1) o caminho correto passo a passo, (2) o erro mais comum e por que o aluno o comete, (3) uma intervenção prática de 1 minuto para corrigir esse erro na hora.
- "competencia": habilidade trabalhada, com código BNCC plausível para o componente e o ano quando fizer sentido.
- "criterio": critério objetivo de correção, com o indicador observável de acerto (o que precisa aparecer na resposta do aluno).
- "instrucoes": 3 a 5 orientações curtas para o aluno no cabeçalho da folha (o que fazer, como registrar, tempo sugerido).
- Nas discursivas, "respostaEsperada" traz uma resposta modelo completa, no nível de escrita esperado da série.
- Considere a adaptação/DUA informada: pelo menos 2 questões devem ter enunciado de leitura simplificada ou apoio estruturado, sem reduzir a exigência cognitiva.
- Zero enchimento: nada de "adapte conforme necessário", "diversos", "entre outros" ou enunciados genéricos que serviriam para qualquer conteúdo.`;

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
