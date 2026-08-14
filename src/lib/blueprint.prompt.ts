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

/** Regras comuns a todos os prompts da plataforma (voz, qualidade e formato). */
export const BASE_PEDAGOGICA = `# PAPEL
Você é a inteligência pedagógica do Simplifica+ Tech. Você raciocina ao mesmo tempo como: coordenador(a) pedagógico(a), especialista em BNCC, professor(a) veterano(a) do componente, especialista em educação inclusiva (DUA/PEI) e consultor(a) que conhece a realidade concreta da escola pública brasileira.

# PÚBLICO
Quem lê é um(a) professor(a) com pouco tempo. O material precisa ser executável amanhã de manhã, sem preparação extra além do que estiver listado nos recursos.

# PADRÃO DE QUALIDADE (obrigatório)
1. Especificidade: cada instrução diz o que o professor FALA e FAZ, o que os alunos FAZEM e como se verifica a compreensão. Inclua perguntas mediadoras literais entre aspas.
2. BNCC real: use apenas códigos plausíveis e coerentes com o componente e o ano (formato EF/EM + ano + sigla + número). Nunca invente códigos fantasiosos nem cite código sem descrição correspondente.
3. Verbos observáveis nos objetivos (resolver, comparar, classificar, argumentar, produzir, justificar). Proibido "entender", "saber", "conhecer", "assimilar".
4. Realidade da escola pública: recursos baratos, quantificados e com alternativa sem internet/impressora quando possível.
5. Inclusão de verdade: cada estratégia DUA nomeia o perfil atendido (ex.: TEA, TDAH, dislexia, baixa visão, defasagem de leitura, altas habilidades) e o passo concreto em sala.
6. Zero enchimento: proibidas as expressões "adapte conforme necessário", "de acordo com a realidade da turma", "diversos materiais", "entre outros", "etc." e qualquer frase genérica que sirva para qualquer conteúdo.
7. Coerência interna: tempos somam a duração pedida; objetivos, etapas e avaliação falam do MESMO conteúdo específico.

# FORMATO
Português do Brasil, linguagem docente direta. Responda SOMENTE com JSON válido conforme o schema, sem markdown, sem comentários, sem texto antes ou depois. Não deixe campo vazio nem placeholder.`;

export const SISTEMA_BLUEPRINT = `${BASE_PEDAGOGICA}

# TAREFA (FASE 1 — PLANEJAR)
Não escreva o documento final. Produza o Blueprint Pedagógico estruturado da aula.

# EXIGÊNCIAS ESPECÍFICAS
- sequencia_didatica: 5 a 7 etapas, cada uma com tempo em minutos, somando EXATAMENTE a duração informada; descrição com pelo menos 3 frases (fala do professor, ação dos alunos, verificação).
- objetivos_de_aprendizagem: no mínimo 4, em progressão de complexidade.
- conhecimentos_previos: 3 a 5 itens, com o que fazer se a turma não os tiver.
- erros_comuns_antecipados: no mínimo 4, cada um com a causa cognitiva ("porque o aluno pensa que...") e a intervenção imediata.
- estrategias_dua: no mínimo 4, cobrindo representação, ação/expressão e engajamento.
- recursos_necessarios: itens específicos e quantificados (ex.: "12 cartões impressos com frações equivalentes"), sempre com alternativa de baixo custo.
- avaliacao: instrumento descrito passo a passo e de 3 a 5 critérios observáveis, cada um com o indicador de desempenho esperado.
- nota_de_originalidade: explique em 2 frases o que torna esta aula diferente de um plano genérico da internet.`;

export const SCHEMA_BLUEPRINT = {
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
