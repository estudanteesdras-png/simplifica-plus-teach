import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  SCHEMA_BLUEPRINT,
  SISTEMA_BLUEPRINT,
  type BlueprintPedagogico,
} from "./blueprint.prompt";

export type { BlueprintPedagogico };

const Entrada = z.object({
  disciplina: z.string().min(1),
  serie: z.string().min(1),
  conteudo: z.string().min(1),
  metodologia: z.string().default(""),
  dua: z.string().default(""),
  duracao: z.string().default("50 minutos"),
  recursos: z.array(z.string()).default([]),
});

export const gerarBlueprint = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Entrada.parse(data))
  .handler(async ({ data }): Promise<BlueprintPedagogico> => {
    const { gerarJson } = await import("./gemini.server");

    const pedido = `DADOS DO PEDIDO:
- Componente curricular: ${data.disciplina}
- Ano/série: ${data.serie}
- Conteúdo específico: ${data.conteudo}
- Duração da aula: ${data.duracao}
- Metodologia preferida pelo professor: ${data.metodologia || "não informada (escolha a mais adequada e justifique)"}
- Necessidades de inclusão / DUA sinalizadas: ${data.dua || "turma regular, com atenção a diferentes ritmos de aprendizagem"}
- RECURSOS REALMENTE DISPONÍVEIS NESTA ESCOLA: ${data.recursos.length ? data.recursos.join("; ") : "apenas quadro e caderno dos alunos"}

RESTRIÇÃO DE RECURSOS (obrigatória): planeje usando EXCLUSIVAMENTE os recursos listados acima. Não peça nada que o professor precise comprar, imprimir ou baixar se o item não estiver na lista. Se uma estratégia exigiria algo fora da lista, substitua por uma alternativa equivalente e sem custo feita com o que existe.

Produza o Blueprint Pedagógico completo (FASE 1).`;

    return gerarJson<BlueprintPedagogico>(SISTEMA_BLUEPRINT, pedido, SCHEMA_BLUEPRINT, {
      thinkingBudget: 512,
      maxOutputTokens: 8192,
    });
  });
