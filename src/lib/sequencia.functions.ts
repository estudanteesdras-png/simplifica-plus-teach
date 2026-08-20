import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SCHEMA_SEQUENCIA, SISTEMA_SEQUENCIA, type SequenciaIA } from "./sequencia.prompt";

const Entrada = z.object({
  disciplina: z.string().min(1),
  serie: z.string().min(1),
  conteudo: z.string().min(1),
  objetivo: z.string().default(""),
  adaptacao: z.string().default(""),
  recursos: z.array(z.string()).default([]),
  quantidadeAulas: z.number().int().min(3).max(5).default(4),
});

export const gerarSequencia = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Entrada.parse(data))
  .handler(async ({ data }): Promise<SequenciaIA> => {
    const { gerarJson } = await import("./gemini.server");

    const pedido = `DADOS DO PEDIDO:
- Componente curricular: ${data.disciplina}
- Ano/série: ${data.serie}
- Conteúdo específico / tema geral: ${data.conteudo}
- Objetivo geral do professor: ${data.objetivo || "não informado"}
- Necessidades de inclusão / DUA sinalizadas: ${data.adaptacao || "turma regular, com atenção a diferentes ritmos de aprendizagem"}
- Número de aulas da sequência: ${data.quantidadeAulas}

- Recursos realmente disponíveis: ${data.recursos.length ? data.recursos.join("; ") : "apenas quadro e caderno dos alunos"}

RESTRIÇÃO DE RECURSOS (obrigatória): planeje todas as aulas usando EXCLUSIVAMENTE os recursos listados. Se uma estratégia exigiria algo fora da lista, substitua por alternativa equivalente e sem custo.

Produza a sequência didática completa.`;

    return gerarJson<SequenciaIA>(SISTEMA_SEQUENCIA, pedido, SCHEMA_SEQUENCIA, {
      thinkingBudget: 512,
      maxOutputTokens: 32768,
    });
  });
