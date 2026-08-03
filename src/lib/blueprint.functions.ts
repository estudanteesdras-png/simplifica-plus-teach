import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Entrada = z.object({
  disciplina: z.string().min(1),
  serie: z.string().min(1),
  conteudo: z.string().min(1),
  metodologia: z.string().default(""),
  dua: z.string().default(""),
  duracao: z.string().default("50 minutos"),
});

export type BlueprintPedagogico = {
  natureza_do_conteudo: string;
  conteudo_especifico: string;
  faixa_etaria: string;
  habilidades_bncc: { codigo: string; descricao: string }[];
  objetivos_de_aprendizagem: string[];
  competencias_gerais: string[];
  conhecimentos_previos: string[];
  erros_comuns_antecipados: string[];
  metodologia_escolhida: { nome: string; justificativa: string };
  sequencia_didatica: { etapa: string; tempo: string; descricao: string }[];
  recursos_necessarios: string[];
  estrategias_dua: { perfil: string; adaptacao: string }[];
  avaliacao: { tipo: string; instrumento: string; criterios: string[] };
  interdisciplinaridade: string[];
  nota_de_originalidade: string;
};

const SISTEMA = `Você é a inteligência pedagógica do Simplifica+ Tech. Você raciocina simultaneamente como cinco especialistas: coordenador(a) pedagógico(a), especialista em BNCC, professor(a) experiente da disciplina, especialista em educação inclusiva e consultor(a) educacional com conhecimento prático da realidade da sala de aula brasileira.

Sua tarefa AGORA não é escrever o documento final. Sua tarefa é PLANEJAR, produzindo um Blueprint Pedagógico estruturado em JSON (FASE 1).

Regras inegociáveis:
- Habilidades da BNCC devem ser plausíveis e coerentes com o componente e o ano; nunca invente códigos fantasiosos.
- Objetivos redigidos com verbos observáveis (resolver, comparar, argumentar), nunca "entender" ou "saber".
- Nada de "adapte conforme necessário": as estratégias DUA devem ser específicas e executáveis.
- Recursos realistas para uma escola pública brasileira comum, com alternativas de baixo custo.
- Erros comuns antecipados exigem raciocínio genuíno sobre onde alunos dessa idade travam nesse conteúdo.
- Detalhamento obrigatório: a sequência didática deve ter de 5 a 7 etapas, cada uma com tempo em minutos somando exatamente a duração informada, e cada descrição com pelo menos 3 frases explicando o que o professor fala/faz, o que os alunos fazem e como se verifica a compreensão (inclua perguntas mediadoras literais).
- Liste no mínimo 4 objetivos de aprendizagem, 4 erros comuns antecipados (com a causa cognitiva de cada um) e 4 estratégias DUA (representação, ação/expressão e engajamento), cada uma nomeando o perfil atendido e o passo concreto em sala.
- Recursos devem ser itens específicos e quantificados (ex.: "12 cartões impressos com frações equivalentes"), sempre com alternativa de baixo custo para escola pública.
- A avaliação precisa de instrumento descrito e de 3 a 5 critérios observáveis com o indicador de desempenho esperado.
- Escreva em português do Brasil, linguagem docente concreta; nunca use "adapte conforme necessário" ou frases genéricas.
- Responda SOMENTE com JSON válido, sem texto antes ou depois.`;

const SCHEMA = {
  type: "object",
  properties: {
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
};

export const gerarBlueprint = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Entrada.parse(data))
  .handler(async ({ data }): Promise<BlueprintPedagogico> => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) throw new Error("A chave da IA não está configurada.");

    const pedido = `DADOS DO PEDIDO:
- Componente curricular: ${data.disciplina}
- Ano/série: ${data.serie}
- Conteúdo específico: ${data.conteudo}
- Duração da aula: ${data.duracao}
- Metodologia preferida pelo professor: ${data.metodologia || "não informada (escolha a mais adequada e justifique)"}
- Necessidades de inclusão / DUA sinalizadas: ${data.dua || "turma regular, com atenção a diferentes ritmos de aprendizagem"}

Produza o Blueprint Pedagógico completo (FASE 1).`;

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const modelos = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-flash-latest"];
    let texto = "";
    let ultimoErro: unknown;

    for (const modelo of modelos) {
      try {
        const resposta = await ai.models.generateContent({
          model: modelo,
          contents: pedido,
          config: {
            systemInstruction: SISTEMA,
            temperature: 0.9,
            responseMimeType: "application/json",
            responseSchema: SCHEMA as never,
          },
        });
        texto = resposta.text ?? "";
        if (texto.trim()) break;
      } catch (erro) {
        ultimoErro = erro;
        console.error(`Gemini falhou no modelo ${modelo}:`, erro);
      }
    }

    if (!texto.trim()) {
      const detalhe = ultimoErro instanceof Error ? ultimoErro.message : "";
      throw new Error(
        `A IA não respondeu agora. Tente novamente em instantes.${detalhe ? ` (${detalhe})` : ""}`,
      );
    }

    try {
      return JSON.parse(texto) as BlueprintPedagogico;
    } catch {
      const inicio = texto.indexOf("{");
      const fim = texto.lastIndexOf("}");
      if (inicio >= 0 && fim > inicio) {
        return JSON.parse(texto.slice(inicio, fim + 1)) as BlueprintPedagogico;
      }
      throw new Error("Não foi possível interpretar o blueprint gerado.");
    }
  });
