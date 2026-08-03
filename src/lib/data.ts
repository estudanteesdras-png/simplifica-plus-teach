export const SERIES = [
  "1º ano — Fundamental I",
  "2º ano — Fundamental I",
  "3º ano — Fundamental I",
  "4º ano — Fundamental I",
  "5º ano — Fundamental I",
  "6º ano — Fundamental II",
  "7º ano — Fundamental II",
  "8º ano — Fundamental II",
  "9º ano — Fundamental II",
  "1º ano — Ensino Médio",
  "2º ano — Ensino Médio",
  "3º ano — Ensino Médio",
];

export const DISCIPLINAS = [
  "Língua Portuguesa",
  "Matemática",
  "Ciências",
  "Biologia",
  "Química",
  "Física",
  "História",
  "Geografia",
  "Filosofia",
  "Sociologia",
  "Arte",
  "Educação Física",
  "Inglês",
  "Espanhol",
  "Ensino Religioso",
  "Informática / Tecnologia",
  "Projeto de Vida",
];


export const ADAPTACOES = [
  "Sem adaptação",
  "TEA",
  "TDAH",
  "Deficiência intelectual",
  "Deficiência visual",
];

export const DURACOES = ["30 minutos", "50 minutos", "1 hora", "2 aulas (100 min)"];

export type Material = {
  id: string;
  titulo: string;
  disciplina: string;
  serie: string;
  adaptacao: string;
  descricao: string;
  notaBase: number;
  avaliacoesBase: number;
};

export const MATERIAIS: Material[] = [
  {
    id: "m1",
    titulo: "Sequência didática: leitura com apoio visual",
    disciplina: "Língua Portuguesa",
    serie: "3º ano — Fundamental I",
    adaptacao: "TEA",
    descricao:
      "Roteiro de leitura em etapas curtas com pictogramas, rotina visual e checagem de compreensão.",
    notaBase: 4.8,
    avaliacoesBase: 34,
  },
  {
    id: "m2",
    titulo: "Frações no dia a dia — atividade concreta",
    disciplina: "Matemática",
    serie: "5º ano — Fundamental I",
    adaptacao: "Deficiência intelectual",
    descricao:
      "Atividade com material manipulável e linguagem simplificada para trabalhar frações usando receitas.",
    notaBase: 4.6,
    avaliacoesBase: 21,
  },
  {
    id: "m3",
    titulo: "Ciclo da água com experimento guiado",
    disciplina: "Ciências",
    serie: "4º ano — Fundamental I",
    adaptacao: "Sem adaptação",
    descricao: "Plano de aula prático com experimento de condensação e registro em desenho.",
    notaBase: 4.5,
    avaliacoesBase: 40,
  },
  {
    id: "m4",
    titulo: "Blocos curtos de estudo — Brasil Colônia",
    disciplina: "História",
    serie: "7º ano — Fundamental II",
    adaptacao: "TDAH",
    descricao:
      "Conteúdo dividido em blocos de 10 minutos com pausas ativas e organizador gráfico.",
    notaBase: 4.7,
    avaliacoesBase: 18,
  },
  {
    id: "m5",
    titulo: "Mapas táteis do Brasil",
    disciplina: "Geografia",
    serie: "6º ano — Fundamental II",
    adaptacao: "Deficiência visual",
    descricao:
      "Guia para produzir mapas em alto-relevo com descrição em áudio e legenda em braille.",
    notaBase: 4.9,
    avaliacoesBase: 26,
  },
  {
    id: "m6",
    titulo: "Produção textual: cartas para a comunidade",
    disciplina: "Língua Portuguesa",
    serie: "8º ano — Fundamental II",
    adaptacao: "Sem adaptação",
    descricao: "Projeto de escrita alinhado à BNCC com rubrica de avaliação pronta.",
    notaBase: 4.4,
    avaliacoesBase: 15,
  },
  {
    id: "m7",
    titulo: "Jogo de operações com apoio de rotina",
    disciplina: "Matemática",
    serie: "2º ano — Fundamental I",
    adaptacao: "TDAH",
    descricao: "Jogo curto de cálculo mental com regras visuais e tempo controlado.",
    notaBase: 4.3,
    avaliacoesBase: 12,
  },
  {
    id: "m8",
    titulo: "Arte sensorial: texturas e emoções",
    disciplina: "Arte",
    serie: "1º ano — Fundamental I",
    adaptacao: "TEA",
    descricao: "Atividade sensorial com materiais variados e comunicação alternativa.",
    notaBase: 4.8,
    avaliacoesBase: 29,
  },
];

const ADAPT_ESTRATEGIAS: Record<string, string[]> = {
  TEA: [
    "Use rotina visual com a sequência da aula fixada na lousa.",
    "Reduza estímulos sonoros e ofereça instruções curtas e literais.",
    "Antecipe transições entre as etapas com aviso de 2 minutos.",
  ],
  TDAH: [
    "Divida a atividade em blocos de 10 a 15 minutos com pausas ativas.",
    "Destaque a instrução principal em negrito e uma tarefa por vez.",
    "Combine sinais de retomada de foco com a turma.",
  ],
  "Deficiência intelectual": [
    "Simplifique o vocabulário e use exemplos do cotidiano do estudante.",
    "Ofereça material concreto e manipulável para apoiar o raciocínio.",
    "Repita o comando com apoio de modelo resolvido.",
  ],
  "Deficiência visual": [
    "Disponibilize a versão em áudio e em fonte ampliada (24pt).",
    "Descreva oralmente todas as imagens e esquemas.",
    "Prepare material tátil em alto-relevo para os conceitos centrais.",
  ],
  "Sem adaptação": [
    "Mantenha comandos claros e critérios de avaliação visíveis à turma.",
    "Reserve momento de retomada coletiva ao final.",
  ],
};

export function estrategias(adaptacao: string) {
  return ADAPT_ESTRATEGIAS[adaptacao] ?? ADAPT_ESTRATEGIAS["Sem adaptação"];
}

export function gerarPlano(input: {
  serie: string;
  disciplina: string;
  tema: string;
  objetivo: string;
  duracao: string;
  adaptacao: string;
}) {
  const tema = input.tema || "o tema da aula";
  return {
    objetivos: [
      `Compreender os conceitos centrais de ${tema} em ${input.disciplina}.`,
      input.objetivo
        ? `Desenvolver a habilidade: ${input.objetivo}.`
        : `Relacionar ${tema} com situações do cotidiano da turma.`,
      `Participar das atividades respeitando os diferentes ritmos de aprendizagem.`,
    ],
    metodologia: [
      `Acolhida e sondagem (5 min): pergunta disparadora sobre ${tema}.`,
      `Exposição dialogada (15 min): conceitos essenciais com apoio visual.`,
      `Atividade prática em duplas: aplicação guiada do conteúdo (${input.duracao}).`,
      `Socialização e sistematização (10 min): registro coletivo no caderno.`,
    ],
    recursos: [
      "Quadro e material impresso adaptado",
      "Slides ou cartazes com apoio visual",
      "Material manipulável ou objetos do cotidiano",
      "Roteiro do estudante em linguagem acessível",
    ],
    avaliacao: [
      "Observação da participação durante a atividade prática.",
      "Registro escrito ou oral do estudante ao final da aula.",
      "Autoavaliação rápida com escala de carinhas ou notas de 1 a 5.",
    ],
    observacoes: [
      `Duração prevista: ${input.duracao}. Turma: ${input.serie}.`,
      ...estrategias(input.adaptacao),
    ].join(" "),
  };
}

export function gerarAtividade(input: {
  serie: string;
  disciplina: string;
  conteudo: string;
  necessidade: string;
}) {
  const conteudo = input.conteudo || "o conteúdo trabalhado";
  return {
    enunciado: `Leia com atenção e resolva as questões sobre ${conteudo}, aplicando o que foi estudado em ${input.disciplina} no ${input.serie}.`,
    passos: [
      `Retome com a turma os pontos principais de ${conteudo}.`,
      "Resolva o exemplo modelo junto com os estudantes.",
      "Peça que resolvam as questões individualmente ou em duplas.",
      "Faça a correção coletiva registrando as estratégias usadas.",
    ],
    versaoAdaptada:
      input.necessidade === "Sem adaptação"
        ? `Versão padrão: enunciado direto, 5 questões sobre ${conteudo} com espaço para registro.`
        : `Versão adaptada para ${input.necessidade}: enunciado reduzido a uma instrução por vez, 3 questões essenciais sobre ${conteudo}, tempo ampliado e apoio do professor na leitura. ${estrategias(input.necessidade).join(" ")}`,
    apoioVisual:
      input.necessidade === "Deficiência visual"
        ? ["Material em fonte ampliada 24pt", "Descrição em áudio", "Esquema tátil em alto-relevo"]
        : [
            "Pictogramas indicando cada etapa",
            "Cartão com a rotina da atividade",
            "Exemplo resolvido em destaque",
          ],
  };
}