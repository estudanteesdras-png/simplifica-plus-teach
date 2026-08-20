import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SCHEMA_QUESTOES, SISTEMA_QUESTOES, type ConjuntoQuestoesIA } from "./questoes.prompt";

const Entrada = z.object({
  disciplina: z.string().min(1),
  serie: z.string().min(1),
  conteudo: z.string().min(1),
  objetivo: z.string().default(""),
  adaptacao: z.string().default(""),
  recursos: z.array(z.string()).default([]),
});

export const gerarQuestoes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Entrada.parse(data))
  .handler(async ({ data }): Promise<ConjuntoQuestoesIA> => {
    const { gerarJson } = await import("./gemini.server");

    const pedido = `DADOS DO PEDIDO:
- Componente curricular: ${data.disciplina}
- Ano/série: ${data.serie}
- Conteúdo específico: ${data.conteudo}
- Objetivo do professor: ${data.objetivo || "não informado"}
- Foco de adaptação / DUA: ${data.adaptacao || "turma regular com diferentes ritmos"}

- Recursos realmente disponíveis: ${data.recursos.length ? data.recursos.join("; ") : "apenas quadro e caderno dos alunos"}

RESTRIÇÃO DE RECURSOS (obrigatória): as questões e as instruções só podem exigir o que está listado acima. Nada de recortes coloridos, sites, vídeos ou materiais que o professor teria de comprar se não estiverem na lista.

Monte o conjunto de questões variadas com gabarito e resolução comentada.`;

    return gerarJson<ConjuntoQuestoesIA>(SISTEMA_QUESTOES, pedido, SCHEMA_QUESTOES, {
      thinkingBudget: 512,
      maxOutputTokens: 16384,
    });
  });
