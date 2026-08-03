# Plano: Sequência Didática Completa

## Objetivo
Adicionar ao Simplifica+ Tech uma ferramenta que gera, em um único clique, uma sequência didática de 3 a 5 aulas encadeadas sobre o mesmo tema. A sequência deve ter progressão pedagógica real (introdução → prática/avaliação formativa → sistematização/avaliação somativa), adaptação inclusiva nativa (DUA/TEA/TDAH/Deficiência Intelectual/Visual) e alinhamento à BNCC.

## Por que isso economiza tempo
O professor digita o tema e a série uma única vez e recebe o planejamento semanal completo, em vez de gerar planos avulsos e remontar a progressão manualmente.

## O que será entregue
1. Nova rota `/sequencias` no menu lateral (ícone `Layers` ou `BookMarked`).
2. Página `src/routes/_app.sequencias.tsx` com formulário idêntico ao de planos, mas com campo extra "Número de aulas" (3, 4 ou 5).
3. Nova server function `gerarSequencia` em `src/lib/sequencia.functions.ts` usando Gemini (chave já configurada).
4. Novo prompt + schema em `src/lib/sequencia.prompt.ts` para gerar um array de 3 a 5 blueprints progressivos.
5. Nova função `aplicarSequencia` em `src/lib/aplicar-ia.ts` para converter o retorno da IA em um array de `MaterialCompleto`.
6. Novo componente `DocumentoSequencia` em `src/components/material/DocumentoSequencia.tsx` que imprime todas as aulas numeradas (capa geral + uma folha por aula com ficha técnica, objetivos, cronograma, inclusão e avaliação).
7. Integração com `useApp`: registrar eventos de geração/salvo/download com `formato: "sequencia"` e salvar no acervo.

## Estrutura de dados
```ts
export type AulaSequencia = {
  numero: number;
  titulo: string;
  foco: "introducao" | "pratica" | "avaliacao" | "sistematizacao";
  duracao: string;
  material: MaterialCompleto;
};

export type SequenciaDidatica = {
  id: string;
  titulo: string;
  disciplina: string;
  serie: string;
  tema: string;
  adaptacao: string;
  aulas: AulaSequencia[];
  criadoEm: string;
};
```

## Fluxo de geração
1. Usuário preenche disciplina, série, tema, objetivo geral, adaptação e número de aulas.
2. Front chama `gerarSequencia({ disciplina, serie, conteudo, objetivo, adaptacao, quantidadeAulas })`.
3. Server function monta prompt pedindo array de blueprints progressivos.
4. Cada blueprint segue o mesmo schema de `BlueprintPedagogico`, mas com campos adicionais: `numero_aula`, `titulo_aula`, `foco_da_aula`.
5. Front recebe o array e, para cada item, chama `gerarMaterialCompleto` + `aplicarBlueprint` para produzir `MaterialCompleto`.
6. Os materiais são agrupados em `SequenciaDidatica` e renderizados.

## Critérios do prompt
- Cada aula deve ter de 5 a 7 etapas com tempos que somem a duração padrão (50 min).
- Aula 1: sondagem, conhecimentos prévios e introdução do conceito.
- Aula(s) intermediária(s): prática guiada, aprofundamento e aplicação.
- Última aula: revisão, avaliação formativa/somativa e fechamento.
- Objetivos devem progredir em complexidade (reconhecer → aplicar → argumentar/criar).
- Estratégias DUA específicas para cada perfil em cada aula.
- Habilidades BNCC coerentes e não inventadas.

## UI/UX
- Formulário na coluna esquerda (igual a `/planos`).
- Botão principal: "Gerar sequência didática".
- Estado de carregamento com etapas da progressão.
- Resultado na coluna direita com abas ou scroll contínuo mostrando cada aula numerada.
- Botões: imprimir sequência toda, salvar no acervo, favoritar.
- Mensagem de destaque: "X aulas geradas com progressão pedagógica e adaptação inclusiva".

## Arquivos a criar/editar
- Criar: `src/routes/_app.sequencias.tsx`
- Criar: `src/lib/sequencia.functions.ts`
- Criar: `src/lib/sequencia.prompt.ts`
- Criar: `src/components/material/DocumentoSequencia.tsx`
- Editar: `src/lib/aplicar-ia.ts` (adicionar `aplicarSequencia`)
- Editar: `src/routes/_app.tsx` (adicionar item no menu)
- Editar: `src/lib/store.tsx` (tipar `formato` com `"sequencia"`)

## Fora de escopo desta entrega
- Geração de avaliações/provas (segundo passo, após aprovação deste).
- Persistência em banco de dados (continua em localStorage via `useApp`).
- Mudança de provedor de IA (Gemini permanece).

## Validação
- Build sem erros.
- Rota `/sequencias` acessível no menu.
- Geração com tema de teste retorna 3 a 5 aulas com conteúdo distinto e progressivo.
- Impressão renderiza todas as aulas sequencialmente.
