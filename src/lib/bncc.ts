// Banco curado de referências BNCC por componente curricular e ano.
// Usado para compor a ficha técnica dos materiais do Simplifica+ Tech.

export type HabilidadeBNCC = { codigo: string; texto: string };

export const COMPETENCIAS_GERAIS: Record<string, string> = {
  CG01: "Conhecimento — Valorizar e utilizar os conhecimentos historicamente construídos para entender e explicar a realidade.",
  CG02: "Pensamento Científico, Crítico e Criativo — Exercitar a curiosidade intelectual para investigar causas, elaborar hipóteses e resolver problemas.",
  CG04: "Comunicação — Utilizar diferentes linguagens para expressar-se e partilhar informações, experiências e ideias.",
  CG05: "Cultura Digital — Compreender, utilizar e criar tecnologias digitais de forma crítica, significativa e ética.",
  CG07: "Argumentação — Argumentar com base em fatos, dados e informações confiáveis para defender ideias e pontos de vista.",
  CG09: "Empatia e Cooperação — Exercitar a empatia, o diálogo e a cooperação, fazendo-se respeitar e promovendo o respeito ao outro.",
  CG10: "Responsabilidade e Cidadania — Agir pessoal e coletivamente com autonomia, responsabilidade e determinação.",
};

const anoDaSerie = (serie: string) => {
  const n = parseInt(serie, 10);
  return Number.isFinite(n) && n >= 1 && n <= 9 ? n : 5;
};

const SIGLA: Record<string, string> = {
  "Língua Portuguesa": "LP",
  Matemática: "MA",
  Ciências: "CI",
  História: "HI",
  Geografia: "GE",
  Arte: "AR",
  "Educação Física": "EF",
};

const EIXOS: Record<string, { fund1: string[]; fund2: string[] }> = {
  "Língua Portuguesa": {
    fund1: [
      "Ler e compreender textos de diferentes gêneros, localizando informações explícitas e inferindo sentidos.",
      "Produzir textos considerando finalidade, interlocutor e características do gênero.",
    ],
    fund2: [
      "Analisar efeitos de sentido produzidos por recursos linguísticos e discursivos nos textos lidos.",
      "Planejar, produzir e revisar textos com progressão temática e adequação ao gênero.",
    ],
  },
  Matemática: {
    fund1: [
      "Resolver e elaborar problemas do cotidiano utilizando as operações e o cálculo mental ou escrito.",
      "Ler, interpretar e representar dados em tabelas e gráficos simples.",
    ],
    fund2: [
      "Resolver e elaborar problemas com números racionais, proporcionalidade e álgebra em contextos reais.",
      "Interpretar, coletar e representar dados estatísticos, avaliando a adequação das representações.",
    ],
  },
  Ciências: {
    fund1: [
      "Investigar fenômenos naturais e tecnológicos do cotidiano, registrando observações e conclusões.",
      "Relacionar hábitos e práticas cotidianas à saúde, ao ambiente e ao uso consciente dos recursos.",
    ],
    fund2: [
      "Elaborar hipóteses, planejar e executar investigações, analisando dados e comunicando resultados.",
      "Relacionar conhecimentos científicos e tecnológicos a problemas socioambientais contemporâneos.",
    ],
  },
  História: {
    fund1: [
      "Identificar mudanças e permanências na vida cotidiana, comparando diferentes tempos e grupos sociais.",
      "Reconhecer fontes históricas variadas como forma de conhecer o passado.",
    ],
    fund2: [
      "Analisar processos históricos considerando causas, consequências e diferentes sujeitos envolvidos.",
      "Confrontar fontes e interpretações sobre um mesmo acontecimento histórico.",
    ],
  },
  Geografia: {
    fund1: [
      "Descrever e comparar características dos lugares de vivência, representando-os em mapas simples.",
      "Relacionar a ocupação do espaço às condições naturais e às atividades humanas.",
    ],
    fund2: [
      "Analisar a produção do espaço geográfico considerando dinâmicas naturais, sociais e econômicas.",
      "Interpretar mapas, gráficos e imagens para explicar fenômenos espaciais.",
    ],
  },
  Arte: {
    fund1: [
      "Experimentar materiais, gestos e suportes diversos em processos de criação artística.",
      "Apreciar produções artísticas de diferentes culturas, descrevendo sensações e elementos observados.",
    ],
    fund2: [
      "Pesquisar e criar produções artísticas autorais articulando elementos da linguagem estudada.",
      "Analisar contextos de produção e circulação das obras apreciadas.",
    ],
  },
  "Educação Física": {
    fund1: [
      "Experimentar e fruir práticas corporais, respeitando regras combinadas e a diversidade dos colegas.",
      "Identificar mudanças corporais e sensações provocadas pela prática de atividades físicas.",
    ],
    fund2: [
      "Praticar e recriar práticas corporais, propondo adaptações que garantam a participação de todos.",
      "Analisar criticamente a presença das práticas corporais na sociedade e na mídia.",
    ],
  },
};

export function habilidadesBNCC(disciplina: string, serie: string): HabilidadeBNCC[] {
  const ano = anoDaSerie(serie);
  const sigla = SIGLA[disciplina] ?? "CI";
  const prefixo = `EF${String(ano).padStart(2, "0")}${sigla}`;
  const eixo = EIXOS[disciplina] ?? EIXOS["Ciências"];
  const textos = ano <= 5 ? eixo.fund1 : eixo.fund2;
  const base = ano <= 5 ? 2 : 5;
  return textos.map((texto, i) => ({
    codigo: `${prefixo}${String(base + i * 5).padStart(2, "0")}`,
    texto,
  }));
}

export function competenciasSugeridas(disciplina: string): string[] {
  const mapa: Record<string, string[]> = {
    "Língua Portuguesa": ["CG04", "CG07"],
    Matemática: ["CG02", "CG05"],
    Ciências: ["CG02", "CG10"],
    História: ["CG01", "CG07"],
    Geografia: ["CG01", "CG10"],
    Arte: ["CG04", "CG09"],
    "Educação Física": ["CG09", "CG10"],
  };
  return (mapa[disciplina] ?? ["CG02", "CG09"]).map((k) => `${k} — ${COMPETENCIAS_GERAIS[k]}`);
}

export function faixaEtaria(serie: string) {
  const ano = anoDaSerie(serie);
  return `${ano + 5} a ${ano + 6} anos`;
}
