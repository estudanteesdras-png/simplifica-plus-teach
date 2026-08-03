import { competenciasSugeridas, faixaEtaria, habilidadesBNCC, type HabilidadeBNCC } from "./bncc";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type Questao =
  | {
      tipo: "objetiva";
      numero: number;
      enunciado: string;
      alternativas: string[];
      correta: number;
      explicacao: string;
      competencia: string;
      criterio: string;
    }
  | {
      tipo: "lacunas";
      numero: number;
      enunciado: string;
      banco: string[];
      campos: string[];
      gabarito: string[];
      explicacao: string;
      competencia: string;
      criterio: string;
    }
  | {
      tipo: "tabela";
      numero: number;
      enunciado: string;
      colunas: string[];
      exemplos: string[];
      explicacao: string;
      competencia: string;
      criterio: string;
    }
  | {
      tipo: "interpretacao";
      numero: number;
      titulo: string;
      texto: string;
      itens: { pergunta: string; resposta: string }[];
      explicacao: string;
      competencia: string;
      criterio: string;
    }
  | {
      tipo: "contexto";
      numero: number;
      titulo: string;
      texto: string;
      itens: { pergunta: string; resposta: string }[];
      explicacao: string;
      competencia: string;
      criterio: string;
    }
  | {
      tipo: "discursiva";
      numero: number;
      enunciado: string;
      linhas: number;
      respostaEsperada: string;
      competencia: string;
      criterio: string;
    }
  | {
      tipo: "producao";
      numero: number;
      enunciado: string;
      instrucao: string;
      respostaEsperada: string;
      competencia: string;
      criterio: string;
    };

export type MaterialCompleto = {
  id: string;
  titulo: string;
  subtitulo: string;
  disciplina: string;
  serie: string;
  faixaEtaria: string;
  duracao: string;
  tema: string;
  codigosBNCC: string;
  criadoEm: string;
  origem?: "plano" | "atividade" | "sequencia";
  plano: {
    objetivos: string[];
    competencias: string[];
    habilidades: HabilidadeBNCC[];
    recursosFisicos: string[];
    recursosDigitais: string[];
    momentos: { titulo: string; minutos: number; itens: { titulo: string; texto: string }[] }[];
    perguntasOrientadoras: string[];
    inclusao: { perfil: string; estrategias: string }[];
    avaliacaoFormativa: string;
    avaliacaoSomativa: string;
  };
  atividade: {
    instrucoes: string[];
    blocos: { titulo: string; questoes: Questao[] }[];
  };
  adaptada: {
    perfis: string[];
    instrucoes: string[];
    pares: { conceito: string; descricao: string }[];
    escolhas: { pergunta: string; opcoes: string[]; correta: number }[];
    desenho: string;
  };
};

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

/* ------------------------------------------------------------------ */
/* Utilidades determinísticas (mesma entrada -> mesmo material)        */
/* ------------------------------------------------------------------ */

function seedOf(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function makeRng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const pick = <T,>(rng: () => number, arr: T[]) => arr[Math.floor(rng() * arr.length) % arr.length];
const intBetween = (rng: () => number, a: number, b: number) => a + Math.floor(rng() * (b - a + 1));

function embaralhar<T>(rng: () => number, arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------ */
/* Matriz pedagógica por componente curricular                         */
/* ------------------------------------------------------------------ */

type Kit = {
  fluxo: [string, string, string];
  fluxoLegenda: [string, string, string];
  colunas: [string, string, string];
  exemplos: [string, string, string];
  metodo: { pergunta: string; correta: string; distratores: string[]; explicacao: string };
  papel: { pergunta: string; correta: string; distratores: string[]; explicacao: string };
  contextos: string[];
  recursosFisicos: string[];
  recursosDigitais: string[];
  perguntasGuia: string[];
  producao: string;
};

const KITS: Record<string, Kit> = {
  "Língua Portuguesa": {
    fluxo: ["LEITURA ATENTA", "COMPREENSÃO", "REGISTRO ESCRITO"],
    fluxoLegenda: ["Entro em contato com o texto", "Organizo as ideias principais", "Escrevo minha resposta"],
    colunas: ["INFORMAÇÃO EXPLÍCITA", "INFERÊNCIA", "OPINIÃO DO LEITOR"],
    exemplos: ["Está escrita no texto", "Concluo a partir de pistas", "É o que eu penso sobre o assunto"],
    metodo: {
      pergunta: "Ao ler um texto para responder perguntas, o primeiro passo mais adequado é:",
      correta: "Ler o texto inteiro com atenção antes de responder",
      distratores: [
        "Responder de memória, sem consultar o texto",
        "Copiar a primeira frase do texto",
        "Ler apenas o título e adivinhar o restante",
      ],
      explicacao:
        "A leitura integral garante a compreensão global do texto e evita respostas baseadas em fragmentos isolados.",
    },
    papel: {
      pergunta: "Uma informação que NÃO aparece escrita no texto, mas que o leitor conclui a partir de pistas, chama-se:",
      correta: "Inferência",
      distratores: ["Informação explícita", "Título", "Cópia literal"],
      explicacao: "Inferir é construir sentido combinando pistas do texto com conhecimentos prévios do leitor.",
    },
    contextos: [
      "um bilhete deixado na geladeira de casa",
      "um cartaz de campanha de doação na escola",
      "uma notícia do jornal do bairro",
      "as instruções de um jogo comprado na papelaria",
    ],
    recursosFisicos: [
      "Folhas de atividade impressas (versão regular e adaptada)",
      "Textos ampliados em cartaz para leitura coletiva",
      "Fichas de vocabulário e dicionário de sala",
      "Quadro branco e marcadores coloridos",
    ],
    recursosDigitais: [
      "Projetor para leitura compartilhada do texto",
      "Áudio do texto gravado pelo professor para escuta prévia",
    ],
    perguntasGuia: [
      "Quem escreveu este texto e para quem ele foi escrito?",
      "Qual pista do texto te ajudou a chegar a essa conclusão?",
      "Se mudássemos o final, o que aconteceria com a mensagem?",
    ],
    producao: "Escreva um pequeno texto (5 a 8 linhas) sobre o tema, usando um começo, um meio e um fim.",
  },
  Matemática: {
    fluxo: ["LER O PROBLEMA", "ESCOLHER A ESTRATÉGIA", "CONFERIR O RESULTADO"],
    fluxoLegenda: ["Identifico os dados", "Decido o cálculo a usar", "Verifico se a resposta faz sentido"],
    colunas: ["DADO DO PROBLEMA", "OPERAÇÃO USADA", "RESPOSTA COM UNIDADE"],
    exemplos: ["Números e informações do enunciado", "Adição, subtração, multiplicação ou divisão", "Resultado + o que ele representa"],
    metodo: {
      pergunta: "Antes de calcular, o passo mais importante para resolver um problema é:",
      correta: "Identificar os dados e o que a pergunta está pedindo",
      distratores: [
        "Somar todos os números que aparecem no enunciado",
        "Escolher a operação mais fácil de fazer",
        "Escrever a resposta sem os cálculos",
      ],
      explicacao:
        "A interpretação do enunciado orienta a escolha da operação; somar todos os números é um erro comum de leitura.",
    },
    papel: {
      pergunta: "Uma resposta matemática completa em um problema do cotidiano deve apresentar:",
      correta: "O resultado acompanhado da unidade e do sentido do problema",
      distratores: ["Apenas o número final", "Apenas a conta armada", "Apenas o desenho da situação"],
      explicacao:
        "Comunicar o resultado com a unidade (reais, litros, alunos) mostra compreensão do contexto, não só do cálculo.",
    },
    contextos: [
      "a compra do lanche na cantina da escola",
      "a divisão de materiais entre os grupos da turma",
      "a organização de uma feira de troca de livros",
      "o controle de gastos de uma festa junina",
    ],
    recursosFisicos: [
      "Folhas de atividade impressas (versão regular e adaptada)",
      "Material dourado, tampinhas ou fichas para contagem",
      "Régua, papel quadriculado e lápis de cor",
      "Quadro branco e marcadores coloridos",
    ],
    recursosDigitais: [
      "Projetor para resolução coletiva passo a passo",
      "Planilha ou aplicativo de calculadora para conferência dos resultados",
    ],
    perguntasGuia: [
      "Qual dado do problema você usou primeiro? Por quê?",
      "É possível chegar ao mesmo resultado por outro caminho?",
      "Sua resposta faz sentido no contexto da situação apresentada?",
    ],
    producao: "Crie um problema parecido usando uma situação da sua casa ou do seu bairro e resolva-o.",
  },
  Ciências: {
    fluxo: ["OBSERVAR", "INVESTIGAR", "CONCLUIR"],
    fluxoLegenda: ["Registro o que percebo", "Testo e comparo hipóteses", "Explico com base nas evidências"],
    colunas: ["OBSERVAÇÃO", "HIPÓTESE", "EVIDÊNCIA"],
    exemplos: ["O que os sentidos ou instrumentos mostram", "Possível explicação a ser testada", "Dado que confirma ou nega a hipótese"],
    metodo: {
      pergunta: "Em uma investigação científica escolar, uma hipótese é:",
      correta: "Uma explicação provável que ainda precisa ser testada",
      distratores: [
        "Uma conclusão definitiva sobre o fenômeno",
        "Uma opinião que não pode ser verificada",
        "A cópia do que está escrito no livro",
      ],
      explicacao: "A hipótese antecede o teste; ela orienta a coleta de dados e pode ser confirmada ou refutada.",
    },
    papel: {
      pergunta: "O registro de dados durante um experimento serve principalmente para:",
      correta: "Permitir comparar os resultados e sustentar a conclusão",
      distratores: [
        "Deixar o caderno mais organizado",
        "Substituir a leitura do conteúdo",
        "Mostrar apenas quem trabalhou mais rápido",
      ],
      explicacao: "Sem registro não há evidência; a conclusão científica se apoia em dados observáveis e comparáveis.",
    },
    contextos: [
      "o consumo de água na escola durante uma semana",
      "a separação do lixo reciclável na cozinha de casa",
      "o crescimento de uma planta na janela da sala",
      "a variação da temperatura ao longo do dia no pátio",
    ],
    recursosFisicos: [
      "Folhas de atividade impressas (versão regular e adaptada)",
      "Materiais simples para a investigação (copos, régua, etiquetas)",
      "Caderno de registro e lápis de cor",
      "Quadro branco e marcadores coloridos",
    ],
    recursosDigitais: [
      "Projetor para exibição de imagens e esquemas",
      "Vídeo curto (2 a 3 min) relacionado ao fenômeno estudado",
    ],
    perguntasGuia: [
      "O que você esperava que acontecesse? E o que aconteceu de fato?",
      "Qual evidência sustenta a sua conclusão?",
      "Como esse fenômeno aparece no dia a dia da sua casa?",
    ],
    producao: "Desenhe e explique, em etapas, o fenômeno estudado usando setas e legendas.",
  },
  História: {
    fluxo: ["FONTE HISTÓRICA", "ANÁLISE", "INTERPRETAÇÃO"],
    fluxoLegenda: ["Documento, foto, objeto ou relato", "Quem produziu, quando e por quê", "Explicação sobre o passado"],
    colunas: ["MUDANÇA", "PERMANÊNCIA", "FONTE CONSULTADA"],
    exemplos: ["O que se transformou com o tempo", "O que continua parecido hoje", "De onde veio a informação"],
    metodo: {
      pergunta: "Fontes históricas são:",
      correta: "Registros do passado, como documentos, fotografias, objetos e relatos",
      distratores: [
        "Apenas os livros didáticos atuais",
        "Somente aquilo que foi filmado",
        "Opiniões dos alunos sobre o passado",
      ],
      explicacao: "A História se constrói a partir de vestígios variados, escritos e não escritos, sempre interpretados criticamente.",
    },
    papel: {
      pergunta: "Comparar diferentes fontes sobre um mesmo acontecimento é importante porque:",
      correta: "Cada fonte apresenta um ponto de vista que precisa ser confrontado",
      distratores: [
        "Todas as fontes contam exatamente a mesma coisa",
        "Somente a fonte mais antiga é verdadeira",
        "Isso torna o estudo mais demorado, sem outro objetivo",
      ],
      explicacao: "O confronto de fontes revela intencionalidades e amplia a compreensão do processo histórico.",
    },
    contextos: [
      "as fotografias antigas da família dos estudantes",
      "os nomes das ruas do bairro da escola",
      "os objetos guardados pelos avós",
      "as festas tradicionais da cidade",
    ],
    recursosFisicos: [
      "Folhas de atividade impressas (versão regular e adaptada)",
      "Reproduções de fotografias e documentos históricos",
      "Linha do tempo em papel kraft",
      "Quadro branco e marcadores coloridos",
    ],
    recursosDigitais: [
      "Projetor para leitura coletiva das imagens",
      "Acervo digital de museus para comparação de fontes",
    ],
    perguntasGuia: [
      "Quem produziu essa fonte e com qual intenção?",
      "O que mudou e o que permaneceu em relação aos dias de hoje?",
      "Qual voz não aparece nesse registro?",
    ],
    producao: "Escreva um pequeno relato comparando o passado estudado com a vida atual do seu bairro.",
  },
  Geografia: {
    fluxo: ["OBSERVAR O LUGAR", "REPRESENTAR", "EXPLICAR"],
    fluxoLegenda: ["Percebo elementos do espaço", "Registro em mapa, croqui ou gráfico", "Relaciono natureza e sociedade"],
    colunas: ["ELEMENTO NATURAL", "ELEMENTO CONSTRUÍDO", "IMPACTO OBSERVADO"],
    exemplos: ["Rio, relevo, vegetação", "Rua, ponte, moradia", "O que muda para as pessoas"],
    metodo: {
      pergunta: "A legenda de um mapa serve para:",
      correta: "Explicar o significado das cores e dos símbolos utilizados",
      distratores: ["Indicar o autor do mapa", "Mostrar a data de impressão", "Decorar a folha do mapa"],
      explicacao: "Sem legenda o leitor não decodifica os símbolos; ela é parte essencial da linguagem cartográfica.",
    },
    papel: {
      pergunta: "A paisagem de um lugar é resultado:",
      correta: "Da combinação entre elementos naturais e a ação humana ao longo do tempo",
      distratores: [
        "Apenas das formas de relevo",
        "Apenas das construções feitas pelas pessoas",
        "De fatores que nunca se modificam",
      ],
      explicacao: "A paisagem é dinâmica e revela a interação entre natureza e sociedade em diferentes tempos.",
    },
    contextos: [
      "o trajeto de casa até a escola",
      "as enchentes na rua próxima ao córrego",
      "a feira livre que ocupa a praça aos domingos",
      "a área verde do bairro e sua ocupação",
    ],
    recursosFisicos: [
      "Folhas de atividade impressas (versão regular e adaptada)",
      "Mapas do bairro, do município e do Brasil",
      "Papel quadriculado, régua e lápis de cor",
      "Quadro branco e marcadores coloridos",
    ],
    recursosDigitais: [
      "Projetor com imagens de satélite do entorno da escola",
      "Mapa digital interativo para comparação de escalas",
    ],
    perguntasGuia: [
      "O que você observa nesse lugar que foi feito pela natureza? E pelas pessoas?",
      "Quem é mais afetado por essa mudança no espaço?",
      "Como representar essa informação em um mapa simples?",
    ],
    producao: "Desenhe um croqui do lugar estudado com legenda e escreva duas conclusões.",
  },
  Arte: {
    fluxo: ["APRECIAR", "EXPERIMENTAR", "CRIAR"],
    fluxoLegenda: ["Observo a obra com atenção", "Testo materiais e gestos", "Produzo minha versão autoral"],
    colunas: ["ELEMENTO DA LINGUAGEM", "MATERIAL UTILIZADO", "SENSAÇÃO PROVOCADA"],
    exemplos: ["Cor, forma, ritmo, textura", "Tinta, papel, som, corpo", "O que a obra faz sentir"],
    metodo: {
      pergunta: "Ao apreciar uma obra de arte, descrever antes de julgar é importante porque:",
      correta: "Permite observar os elementos presentes antes de formar opinião",
      distratores: [
        "Impede que o observador tenha opinião própria",
        "Garante que todos gostem da mesma obra",
        "Substitui o processo de criação",
      ],
      explicacao: "A descrição sustenta a leitura estética: primeiro observo, depois interpreto e finalmente avalio.",
    },
    papel: {
      pergunta: "Um trabalho artístico autoral se caracteriza por:",
      correta: "Apresentar escolhas próprias de materiais, formas e intenções",
      distratores: [
        "Copiar fielmente a obra de outro artista",
        "Usar somente materiais caros",
        "Seguir um único modelo definido pelo professor",
      ],
      explicacao: "A autoria envolve decisão criativa; a referência inspira, mas não substitui a produção pessoal.",
    },
    contextos: [
      "os grafismos presentes nos muros do bairro",
      "as músicas cantadas nas festas da comunidade",
      "as embalagens coloridas do mercado",
      "as danças que a turma conhece",
    ],
    recursosFisicos: [
      "Folhas de atividade impressas (versão regular e adaptada)",
      "Tintas, giz de cera, papéis de texturas variadas",
      "Reproduções de obras para apreciação",
      "Quadro branco e marcadores coloridos",
    ],
    recursosDigitais: ["Projetor para apreciação das obras", "Áudio com trilhas para experimentação sonora"],
    perguntasGuia: [
      "O que você vê nesta obra antes de dizer se gostou?",
      "Qual escolha do artista mais chamou sua atenção?",
      "Que material você usaria para criar algo com essa mesma sensação?",
    ],
    producao: "Crie sua produção autoral no espaço indicado e escreva o título e a intenção da obra.",
  },
  "Educação Física": {
    fluxo: ["EXPERIMENTAR", "ADAPTAR REGRAS", "AVALIAR A PRÁTICA"],
    fluxoLegenda: ["Vivencio a prática corporal", "Ajusto para todos participarem", "Reflito sobre o que funcionou"],
    colunas: ["PRÁTICA CORPORAL", "ADAPTAÇÃO PROPOSTA", "PARTICIPAÇÃO GARANTIDA"],
    exemplos: ["Jogo, dança, luta, ginástica", "Mudança de regra ou material", "Quem passa a participar melhor"],
    metodo: {
      pergunta: "Adaptar as regras de um jogo na aula de Educação Física tem como objetivo principal:",
      correta: "Garantir que todos os estudantes possam participar",
      distratores: [
        "Fazer o jogo terminar mais rápido",
        "Escolher os melhores jogadores da turma",
        "Deixar a atividade mais difícil para poucos",
      ],
      explicacao: "A adaptação é um princípio inclusivo: preserva o sentido da prática ampliando a participação.",
    },
    papel: {
      pergunta: "Durante o exercício físico, o aumento dos batimentos cardíacos indica que:",
      correta: "O corpo está enviando mais sangue e oxigênio aos músculos",
      distratores: [
        "O corpo está adoecendo",
        "A atividade deve ser interrompida imediatamente",
        "O coração diminuiu o esforço",
      ],
      explicacao: "É uma resposta fisiológica esperada ao esforço, e não um sinal de problema em pessoas saudáveis.",
    },
    contextos: [
      "a brincadeira no intervalo da escola",
      "o jogo da rua no fim de semana",
      "a caminhada até a escola",
      "a dança na festa da comunidade",
    ],
    recursosFisicos: [
      "Folhas de atividade impressas (versão regular e adaptada)",
      "Bolas, cones, cordas e coletes",
      "Cronômetro e apito",
      "Quadro branco e marcadores coloridos",
    ],
    recursosDigitais: ["Projetor com vídeo curto da prática corporal", "Cronômetro digital projetado para a turma"],
    perguntasGuia: [
      "Qual regra dificultou a participação de alguém da turma?",
      "Que adaptação vocês propõem para a próxima rodada?",
      "O que seu corpo sentiu antes, durante e depois da prática?",
    ],
    producao: "Registre a adaptação criada pelo seu grupo e explique quem passou a participar melhor.",
  },
};

const kitDe = (disciplina: string) => KITS[disciplina] ?? KITS["Ciências"];

/* ------------------------------------------------------------------ */
/* Estratégias inclusivas                                              */
/* ------------------------------------------------------------------ */

const INCLUSAO = [
  {
    perfil: "Transtorno do Espectro Autista (TEA)",
    estrategias:
      "Antecipar a rotina da aula com apoio visual fixado na lousa. Utilizar a folha adaptada, com alto contraste, redução de poluição visual e enunciados diretos e literais. Avisar transições com 2 minutos de antecedência e permitir apoio sensorial (abafadores, objeto regulador) quando necessário.",
  },
  {
    perfil: "TDAH",
    estrategias:
      "Fracionar a tarefa em micro-etapas com checagem a cada bloco. Destacar uma instrução por vez e permitir mobilidade controlada entre as etapas. Utilizar sinalizador visual de tempo restante e combinar um gesto discreto de retomada de foco.",
  },
  {
    perfil: "Deficiência Intelectual / AEE",
    estrategias:
      "Priorizar correspondência concreta (ligar colunas, pintar, marcar com legenda) e reduzir a carga de escrita. Apresentar sempre um exemplo resolvido, usar material manipulável e valorizar a expressão por desenho e oralidade no registro final.",
  },
];

/* ------------------------------------------------------------------ */
/* Geração do material completo                                        */
/* ------------------------------------------------------------------ */

export type EntradaMaterial = {
  disciplina: string;
  serie: string;
  tema: string;
  duracao: string;
  objetivoProfessor?: string;
  professor?: string;
};

export function gerarMaterialCompleto(entrada: EntradaMaterial): MaterialCompleto {
  const tema = entrada.tema.trim() || "o conteúdo da aula";
  const temaBaixo = tema.charAt(0).toLowerCase() + tema.slice(1);
  const kit = kitDe(entrada.disciplina);
  const rng = makeRng(seedOf(`${entrada.disciplina}|${entrada.serie}|${tema}|${entrada.duracao}`));
  const habilidades = habilidadesBNCC(entrada.disciplina, entrada.serie);
  const contextoA = pick(rng, kit.contextos);
  const contextoB = pick(
    rng,
    kit.contextos.filter((c) => c !== contextoA),
  );

  const minutosTotais = /100/.test(entrada.duracao)
    ? 100
    : /2 aulas/i.test(entrada.duracao)
      ? 100
      : /1 hora/i.test(entrada.duracao)
        ? 60
        : /50/.test(entrada.duracao)
          ? 50
          : 30;
  const m1 = Math.round(minutosTotais * 0.2);
  const m3 = Math.round(minutosTotais * 0.2);
  const m2 = minutosTotais - m1 - m3;

  /* ---------------- Atividade do aluno ---------------- */

  const q1Alts = embaralhar(rng, [kit.metodo.correta, ...kit.metodo.distratores]);
  const q2Alts = embaralhar(rng, [kit.papel.correta, ...kit.papel.distratores]);

  // Questão 3: leitura de dados (tabela pequena, valores calculados)
  const g1 = intBetween(rng, 12, 28);
  const g2 = intBetween(rng, 8, 24);
  const g3 = intBetween(rng, 10, 26);
  const total = g1 + g2 + g3;
  const maior = Math.max(g1, g2, g3);
  const nomeMaior = maior === g1 ? "Grupo A" : maior === g2 ? "Grupo B" : "Grupo C";
  const q3Alts = embaralhar(rng, [
    `${total} registros no total`,
    `${total - g3} registros no total`,
    `${maior} registros no total`,
    `${g1 + g2 - g3} registros no total`,
  ]);

  // Questão 4: situação do cotidiano com resposta verificável
  const preco = intBetween(rng, 3, 9);
  const qtd = intBetween(rng, 4, 12);
  const gasto = preco * qtd;
  const q4Alts = embaralhar(rng, [
    `R$ ${gasto},00`,
    `R$ ${preco + qtd},00`,
    `R$ ${gasto - preco},00`,
    `R$ ${gasto + preco},00`,
  ]);

  const questoesBloco1: Questao[] = [
    {
      tipo: "objetiva",
      numero: 1,
      enunciado: kit.metodo.pergunta,
      alternativas: q1Alts,
      correta: q1Alts.indexOf(kit.metodo.correta),
      explicacao: kit.metodo.explicacao,
      competencia: `Procedimentos próprios de ${entrada.disciplina}.`,
      criterio: "Acerto integral. Sem pontuação parcial em questão objetiva.",
    },
    {
      tipo: "objetiva",
      numero: 2,
      enunciado: kit.papel.pergunta,
      alternativas: q2Alts,
      correta: q2Alts.indexOf(kit.papel.correta),
      explicacao: kit.papel.explicacao,
      competencia: "Compreensão conceitual e uso da linguagem específica do componente.",
      criterio: "Acerto integral. Retomar oralmente com quem marcar distrator.",
    },
    {
      tipo: "objetiva",
      numero: 3,
      enunciado: `A turma registrou observações sobre ${temaBaixo} em três grupos: Grupo A = ${g1}, Grupo B = ${g2} e Grupo C = ${g3}. Analisando a tabela, é correto afirmar que a turma reuniu:`,
      alternativas: q3Alts,
      correta: q3Alts.indexOf(`${total} registros no total`),
      explicacao: `Somando os três grupos: ${g1} + ${g2} + ${g3} = ${total}. Erro comum: marcar ${maior} (o ${nomeMaior}, maior valor isolado) em vez do total da turma.`,
      competencia: "Leitura e interpretação de dados organizados em tabela.",
      criterio: "Acerto integral. Verificar se o erro foi de leitura da tabela ou de cálculo.",
    },
    {
      tipo: "objetiva",
      numero: 4,
      enunciado: `Durante o estudo de ${temaBaixo}, a turma organizou ${contextoA}. Cada item necessário custa R$ ${preco},00 e serão comprados ${qtd} itens. O valor total gasto será de:`,
      alternativas: q4Alts,
      correta: q4Alts.indexOf(`R$ ${gasto},00`),
      explicacao: `${qtd} × R$ ${preco},00 = R$ ${gasto},00. Trata-se de uma situação de proporcionalidade direta entre quantidade e valor.`,
      competencia: "Aplicação de raciocínio quantitativo em situação real do cotidiano escolar.",
      criterio: "Acerto integral. Aceitar registro do cálculo na margem como evidência de estratégia.",
    },
  ];

  const questoesBloco2: Questao[] = [
    {
      tipo: "lacunas",
      numero: 5,
      enunciado: `Complete o diagrama do percurso de trabalho utilizado nesta aula sobre ${temaBaixo}, preenchendo as lacunas com as expressões do quadro:`,
      banco: embaralhar(rng, [...kit.fluxo]),
      campos: kit.fluxoLegenda,
      gabarito: [...kit.fluxo],
      explicacao: `A sequência correta é ${kit.fluxo.join(" → ")}, pois cada etapa depende do resultado da anterior.`,
      competencia: "Organização do pensamento em etapas e modelagem de processos.",
      criterio: "1 ponto por lacuna correta. A ordem deve ser respeitada.",
    },
    {
      tipo: "tabela",
      numero: 6,
      enunciado: `Preencha a tabela com um exemplo seu para cada coluna, relacionado a ${temaBaixo}:`,
      colunas: kit.colunas,
      exemplos: kit.exemplos,
      explicacao: `Respostas pessoais coerentes com as definições: ${kit.colunas
        .map((c, i) => `${c} = ${kit.exemplos[i]}`)
        .join("; ")}.`,
      competencia: "Classificação conceitual e transposição para exemplos próprios.",
      criterio: "Cada coluna vale 1 ponto. Aceitar exemplos diferentes desde que pertinentes.",
    },
  ];

  const textoInterp = `Na Escola Municipal Vila Nova, a turma do ${entrada.serie.split("—")[0].trim()} decidiu investigar ${temaBaixo} a partir de ${contextoB}. Durante duas semanas, os estudantes registraram tudo o que observavam em um caderno coletivo. No início, cada grupo trabalhava sozinho e as informações não combinavam entre si. Depois de uma conversa com a professora, a turma criou uma ficha comum, com os mesmos campos para todos. A partir daí, as informações passaram a ser comparáveis e o grupo conseguiu apresentar uma conclusão única para toda a escola, exposta no mural do pátio.`;

  const questoesBloco3: Questao[] = [
    {
      tipo: "interpretacao",
      numero: 7,
      titulo: "Leia o relato abaixo e responda",
      texto: textoInterp,
      itens: [
        {
          pergunta: "a) Qual problema a turma enfrentou no início da investigação?",
          resposta:
            "Cada grupo registrava as informações de um jeito diferente, por isso os dados não podiam ser comparados.",
        },
        {
          pergunta: "b) Qual atitude resolveu esse problema e por quê?",
          resposta:
            "A criação de uma ficha comum, com os mesmos campos, padronizou o registro e tornou as informações comparáveis.",
        },
        {
          pergunta: "c) Retire do texto uma informação que NÃO está escrita, mas que você concluiu ao ler.",
          resposta:
            "Resposta pessoal com base em pistas do texto (ex.: o trabalho coletivo exigiu combinados; a professora atuou como mediadora).",
        },
      ],
      explicacao:
        "As questões a e b exigem localização de informação explícita; a questão c mobiliza inferência a partir de pistas textuais.",
      competencia: "Compreensão leitora: localização de informações e inferência.",
      criterio: "a) e b) 2 pontos cada, com informação do texto. c) 2 pontos se a inferência for sustentada pelo texto.",
    },
    {
      tipo: "contexto",
      numero: 8,
      titulo: "Desafio contextualizado",
      texto: `Sua turma foi convidada a apresentar, na reunião de pais, o que aprendeu sobre ${temaBaixo}, usando como exemplo ${contextoA}. Vocês têm 5 minutos de apresentação e um cartaz para produzir.`,
      itens: [
        {
          pergunta: "a) Quais três informações não podem faltar no cartaz? Justifique a escolha de uma delas.",
          resposta:
            "Resposta pessoal coerente: o conceito central estudado, um exemplo do cotidiano e a conclusão da turma, com justificativa pertinente.",
        },
        {
          pergunta: "b) Como vocês explicariam esse conteúdo para alguém que nunca estudou o assunto?",
          resposta:
            "Explicação em linguagem simples, com um exemplo concreto e uso correto dos termos aprendidos na aula.",
        },
      ],
      explicacao:
        "A questão avalia a transposição do conteúdo para uma situação comunicativa real, exigindo seleção e hierarquização de informações.",
      competencia: "Comunicação, argumentação e síntese do conhecimento estudado.",
      criterio:
        "Até 4 pontos: 2 pela seleção pertinente das informações e 2 pela clareza e correção conceitual da explicação.",
    },
  ];

  const questoesBloco4: Questao[] = [
    {
      tipo: "discursiva",
      numero: 9,
      enunciado: `Explique, com suas palavras, o que você entendeu sobre ${temaBaixo} e qual foi a etapa mais importante do trabalho realizado na aula.`,
      linhas: 5,
      respostaEsperada: `Espera-se que o estudante retome o conceito central de ${temaBaixo} e relacione uma das etapas (${kit.fluxo.join(", ")}) à sua própria aprendizagem.`,
      competencia: "Metacognição e uso da linguagem específica do componente.",
      criterio:
        "Até 3 pontos: 2 pela correção conceitual e 1 pela justificativa própria. Erros ortográficos não descontam pontos nesta questão.",
    },
    {
      tipo: "discursiva",
      numero: 10,
      enunciado: `Cite duas situações do dia a dia — na sua casa, na escola ou no bairro — em que o que foi estudado sobre ${temaBaixo} pode ser usado. Explique cada uma.`,
      linhas: 6,
      respostaEsperada: `Duas situações concretas e pertinentes (por exemplo: ${contextoA}; ${contextoB}), cada uma acompanhada de explicação do uso do conteúdo.`,
      competencia: "Transferência do conhecimento para contextos reais.",
      criterio: "Até 4 pontos: 2 por situação (1 pela pertinência e 1 pela explicação).",
    },
    {
      tipo: "producao",
      numero: 11,
      enunciado: kit.producao,
      instrucao: "Use o espaço abaixo. Capriche na organização e na legenda.",
      respostaEsperada:
        "Produção autoral coerente com o tema, com organização visível (título, etapas ou legenda) e uso correto dos conceitos.",
      competencia: "Produção autoral e organização das ideias.",
      criterio: "Até 4 pontos: 2 pela correção conceitual, 1 pela organização e 1 pela autoria.",
    },
  ];

  /* ---------------- Material final ---------------- */

  return {
    id: `${Date.now().toString(36)}-${Math.floor(rng() * 1e6).toString(36)}`,
    titulo: tema,
    subtitulo: `${entrada.disciplina} • ${entrada.serie}`,
    disciplina: entrada.disciplina,
    serie: entrada.serie,
    faixaEtaria: faixaEtaria(entrada.serie),
    duracao: entrada.duracao,
    tema,
    codigosBNCC: habilidades.map((h) => h.codigo).join(" • "),
    criadoEm: new Date().toISOString(),
    plano: {
      objetivos: [
        `Compreender os conceitos centrais de ${temaBaixo} e o vocabulário próprio de ${entrada.disciplina}.`,
        entrada.objetivoProfessor?.trim()
          ? `${entrada.objetivoProfessor.trim().replace(/\.$/, "")}.`
          : `Aplicar o percurso ${kit.fluxo.join(" → ")} na resolução de uma situação real.`,
        `Relacionar ${temaBaixo} a situações do cotidiano, como ${contextoA} e ${contextoB}.`,
        "Registrar conclusões de forma organizada, respeitando os diferentes ritmos de aprendizagem da turma.",
      ],
      competencias: competenciasSugeridas(entrada.disciplina),
      habilidades,
      recursosFisicos: kit.recursosFisicos,
      recursosDigitais: kit.recursosDigitais,
      momentos: [
        {
          titulo: "Momento 1: Acolhida e Sensibilização",
          minutos: m1,
          itens: [
            {
              titulo: `Pergunta disparadora (${Math.round(m1 / 2)} min)`,
              texto: `Inicie perguntando: "Onde vocês já viram ${temaBaixo} fora da escola?". Registre as hipóteses no quadro sem corrigi-las neste momento — elas serão retomadas ao final.`,
            },
            {
              titulo: `Apresentação do percurso (${m1 - Math.round(m1 / 2)} min)`,
              texto: `Apresente o esquema de trabalho da aula: ${kit.fluxo[0]} → ${kit.fluxo[1]} → ${kit.fluxo[2]}. Deixe-o visível durante toda a aula como apoio de rotina.`,
            },
          ],
        },
        {
          titulo: "Momento 2: Prática Guiada e Mãos na Massa",
          minutos: m2,
          itens: [
            {
              titulo: `Investigação em pequenos grupos (${Math.round(m2 * 0.4)} min)`,
              texto: `Organize grupos de 3 a 4 estudantes com a situação de ${contextoA}. Cada grupo registra observações na ficha comum e classifica os achados nas categorias ${kit.colunas.join(", ")}.`,
            },
            {
              titulo: `Aplicação da folha de atividades (${m2 - Math.round(m2 * 0.4)} min)`,
              texto: "Distribua a folha impressa (versão regular e adaptada). Leia as instruções em voz alta, resolva a questão 1 coletivamente como exemplo e circule pela sala mediando sem entregar respostas prontas.",
            },
          ],
        },
        {
          titulo: "Momento 3: Sistematização e Avaliação",
          minutos: m3,
          itens: [
            {
              titulo: `Socialização (${Math.round(m3 / 2)} min)`,
              texto: "Convide dois grupos a apresentarem as respostas das questões 7 e 8. Retome as hipóteses iniciais do quadro e confronte-as com as conclusões da turma.",
            },
            {
              titulo: `Fechamento e autoavaliação (${m3 - Math.round(m3 / 2)} min)`,
              texto: "Feche com a síntese coletiva escrita no quadro e peça uma autoavaliação rápida (escala de 1 a 5 ou carinhas) sobre a compreensão do conteúdo.",
            },
          ],
        },
      ],
      perguntasOrientadoras: kit.perguntasGuia,
      inclusao: INCLUSAO,
      avaliacaoFormativa: `Observação contínua durante a investigação: participação no grupo, uso do vocabulário de ${entrada.disciplina}, capacidade de justificar escolhas e retomada das hipóteses iniciais.`,
      avaliacaoSomativa:
        "Análise da folha de atividades conforme os critérios do gabarito (total de 30 pontos). Considerar a versão adaptada com os mesmos critérios conceituais, ajustando a exigência de registro escrito.",
    },
    atividade: {
      instrucoes: [
        "Leia cada questão com atenção antes de responder.",
        "Use caneta azul ou preta nas respostas escritas e lápis nos desenhos.",
        "Nas questões abertas, escreva com suas palavras — respostas copiadas não serão consideradas.",
        "Se tiver dúvida em alguma questão, marque com um X ao lado e chame o professor.",
      ],
      blocos: [
        { titulo: "Bloco 1 — Conceitos e Procedimentos (Objetivas)", questoes: questoesBloco1 },
        { titulo: "Bloco 2 — Organização e Diagramas", questoes: questoesBloco2 },
        { titulo: "Bloco 3 — Interpretação e Desafio Contextualizado", questoes: questoesBloco3 },
        { titulo: "Bloco 4 — Questões Discursivas e Produção", questoes: questoesBloco4 },
      ],
    },
    adaptada: {
      perfis: ["TEA", "TDAH", "Deficiência Intelectual"],
      instrucoes: [
        "Siga as etapas numeradas, uma de cada vez.",
        "Use lápis de cor para ligar e para pintar.",
        "Se precisar de ajuda, levante a mão e chame o professor.",
      ],
      pares: kit.fluxo.map((c, i) => ({ conceito: c, descricao: kit.fluxoLegenda[i] })),
      escolhas: [
        {
          pergunta: `1. O que fazemos PRIMEIRO ao estudar ${temaBaixo}?`,
          opcoes: [kit.fluxo[0], kit.fluxo[2]],
          correta: 0,
        },
        {
          pergunta: "2. Quando terminamos o trabalho, o que fazemos com o resultado?",
          opcoes: ["Guardamos sem mostrar para ninguém", kit.fluxo[2]],
          correta: 1,
        },
      ],
      desenho: `Desenhe uma situação do seu dia a dia em que aparece ${temaBaixo}. Depois escreva UMA palavra embaixo do desenho.`,
    },
  };
}
