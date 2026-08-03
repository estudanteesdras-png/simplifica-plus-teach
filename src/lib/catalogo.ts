import { gerarMaterialCompleto, type MaterialCompleto } from "./material";

export type Humor = "escreve" | "ouve" | "investiga" | "ideia";

export type Conteudo = {
  slug: string;
  nome: string;
  resumo: string;
  series: string[];
};

export type DisciplinaCatalogo = {
  slug: string;
  nome: string;
  resumo: string;
  gradiente: string;
  humor: Humor;
  conteudos: Conteudo[];
};

const F1 = ["2º ano — Fundamental I", "3º ano — Fundamental I", "5º ano — Fundamental I"];
const F2 = ["6º ano — Fundamental II", "7º ano — Fundamental II", "9º ano — Fundamental II"];
const TODAS = [...F1, ...F2];

export const CATALOGO: DisciplinaCatalogo[] = [
  {
    slug: "matematica",
    nome: "Matemática",
    resumo: "Do cálculo mental à estatística, com contextos reais e material concreto.",
    gradiente: "from-[#1e2a6e] via-[#2a54c8] to-[#4f7cf7]",
    humor: "investiga",
    conteudos: [
      { slug: "numeros-e-operacoes", nome: "Números e operações", resumo: "Sistema decimal, as quatro operações e cálculo mental.", series: TODAS },
      { slug: "fracoes-e-decimais", nome: "Frações e números decimais", resumo: "Representação, comparação e uso em situações do cotidiano.", series: [...F1, "6º ano — Fundamental II"] },
      { slug: "geometria", nome: "Geometria", resumo: "Formas planas, sólidos, simetria e localização no espaço.", series: TODAS },
      { slug: "grandezas-e-medidas", nome: "Grandezas e medidas", resumo: "Comprimento, massa, tempo, área e sistema monetário.", series: TODAS },
      { slug: "algebra", nome: "Álgebra e expressões", resumo: "Padrões, sequências, incógnitas e equações do 1º grau.", series: F2 },
      { slug: "estatistica-e-probabilidade", nome: "Estatística e probabilidade", resumo: "Leitura de tabelas, gráficos, média e chance de eventos.", series: TODAS },
      { slug: "problemas-do-cotidiano", nome: "Resolução de problemas", resumo: "Situações-problema com dinheiro, receitas e planejamento.", series: TODAS },
    ],
  },
  {
    slug: "lingua-portuguesa",
    nome: "Língua Portuguesa",
    resumo: "Leitura, escrita e oralidade com gêneros reais e rubricas prontas.",
    gradiente: "from-[#4338ca] via-[#5b34d6] to-[#7c3aed]",
    humor: "escreve",
    conteudos: [
      { slug: "leitura-e-interpretacao", nome: "Leitura e interpretação", resumo: "Localizar informação, inferir sentidos e identificar a intenção do texto.", series: TODAS },
      { slug: "gramatica-e-ortografia", nome: "Gramática e ortografia", resumo: "Classes de palavras, concordância, acentuação e pontuação.", series: TODAS },
      { slug: "producao-textual", nome: "Produção textual", resumo: "Planejamento, escrita e revisão com critérios claros.", series: TODAS },
      { slug: "generos-textuais", nome: "Gêneros textuais", resumo: "Carta, notícia, conto, relato, artigo de opinião e cordel.", series: TODAS },
      { slug: "literatura", nome: "Literatura e leitura literária", resumo: "Poesia, narrativa e roda de leitura mediada.", series: F2 },
      { slug: "oralidade", nome: "Oralidade e argumentação", resumo: "Debate regrado, apresentação oral e escuta ativa.", series: TODAS },
    ],
  },
  {
    slug: "ciencias",
    nome: "Ciências",
    resumo: "Investigação científica com experimentos simples e registro guiado.",
    gradiente: "from-[#0f766e] via-[#1e88b8] to-[#2a54c8]",
    humor: "ideia",
    conteudos: [
      { slug: "corpo-humano", nome: "Corpo humano e saúde", resumo: "Sistemas do corpo, higiene, alimentação e autocuidado.", series: TODAS },
      { slug: "seres-vivos", nome: "Seres vivos e ecossistemas", resumo: "Classificação, cadeias alimentares e biomas brasileiros.", series: TODAS },
      { slug: "materia-e-energia", nome: "Matéria e energia", resumo: "Estados físicos, misturas, calor, luz e eletricidade.", series: TODAS },
      { slug: "terra-e-universo", nome: "Terra e universo", resumo: "Sistema solar, movimentos da Terra, estações e fases da Lua.", series: TODAS },
      { slug: "meio-ambiente", nome: "Meio ambiente e sustentabilidade", resumo: "Água, resíduos, energia limpa e ações na comunidade.", series: TODAS },
    ],
  },
  {
    slug: "historia",
    nome: "História",
    resumo: "Fontes históricas, linha do tempo e cidadania na prática.",
    gradiente: "from-[#7c2d12] via-[#a3421c] to-[#7c3aed]",
    humor: "investiga",
    conteudos: [
      { slug: "brasil-colonia", nome: "Brasil Colônia", resumo: "Colonização, trabalho compulsório, engenhos e resistências.", series: F2 },
      { slug: "imperio-e-republica", nome: "Império e República", resumo: "Independência, abolição, proclamação e democracia.", series: F2 },
      { slug: "historia-geral", nome: "História geral", resumo: "Antiguidade, Idade Média, revoluções e mundo contemporâneo.", series: F2 },
      { slug: "povos-originarios", nome: "Povos indígenas e afro-brasileiros", resumo: "Culturas, territórios, contribuições e Lei 11.645/08.", series: TODAS },
      { slug: "cidadania", nome: "Cidadania e direitos", resumo: "Direitos, deveres, ECA e participação social.", series: TODAS },
    ],
  },
  {
    slug: "geografia",
    nome: "Geografia",
    resumo: "Espaço, mapas e território com leitura crítica de dados.",
    gradiente: "from-[#155e75] via-[#2a54c8] to-[#5b34d6]",
    humor: "investiga",
    conteudos: [
      { slug: "cartografia", nome: "Mapas e cartografia", resumo: "Legenda, escala, coordenadas e orientação.", series: TODAS },
      { slug: "relevo-clima-vegetacao", nome: "Relevo, clima e vegetação", resumo: "Paisagens naturais brasileiras e fatores climáticos.", series: TODAS },
      { slug: "populacao-e-urbanizacao", nome: "População e urbanização", resumo: "Migrações, cidades, moradia e mobilidade.", series: F2 },
      { slug: "regioes-do-brasil", nome: "Regiões do Brasil", resumo: "Características econômicas, culturais e naturais das cinco regiões.", series: TODAS },
      { slug: "territorio-e-ambiente", nome: "Território e meio ambiente", resumo: "Uso do solo, recursos naturais e impactos ambientais.", series: TODAS },
    ],
  },
  {
    slug: "ingles",
    nome: "Inglês",
    resumo: "Vocabulário, estruturas e compreensão com apoio visual constante.",
    gradiente: "from-[#1e2a6e] via-[#5b34d6] to-[#be185d]",
    humor: "ouve",
    conteudos: [
      { slug: "vocabulario-basico", nome: "Vocabulário básico", resumo: "Cores, números, família, escola e rotina.", series: TODAS },
      { slug: "verb-to-be", nome: "Verb to be e rotinas", resumo: "Apresentações pessoais, daily routine e simple present.", series: TODAS },
      { slug: "tempos-verbais", nome: "Tempos verbais", resumo: "Present, past e future em situações comunicativas.", series: F2 },
      { slug: "reading", nome: "Reading & compreensão", resumo: "Estratégias de leitura, cognatos e skimming.", series: F2 },
      { slug: "speaking", nome: "Speaking & pronúncia", resumo: "Diálogos guiados, entonação e escuta ativa.", series: TODAS },
    ],
  },
];

export function acharDisciplina(slug: string) {
  return CATALOGO.find((d) => d.slug === slug);
}

export function acharConteudo(disciplina: DisciplinaCatalogo | undefined, slug: string) {
  return disciplina?.conteudos.find((c) => c.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Coleção de materiais por conteúdo                                   */
/* ------------------------------------------------------------------ */

export type Selo = "nenhum" | "equipe" | "comunidade" | "semana";

export type ItemBiblioteca = {
  id: string;
  rotulo: string;
  tipo: "plano" | "atividade";
  disciplinaSlug: string;
  conteudoSlug: string;
  autor: string;
  publicadoEm: string;
  seloOficial: Selo;
  material: MaterialCompleto;
};

const AUTORES = [
  "Equipe Pedagógica Simplifica+",
  "Prof.ª Marina Alencar",
  "Prof. Rafael Nogueira",
  "Prof.ª Bianca Torres",
  "Prof. Eduardo Lima",
  "Prof.ª Cláudia Mendes",
];

const DURACOES_CAT = ["50 minutos", "1 hora", "2 aulas (100 min)"];

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function dataPublicacao(n: number) {
  const base = new Date("2026-02-02T10:00:00Z").getTime();
  return new Date(base - n * 86400000 * 6).toISOString();
}

/** Coleção determinística de materiais completos de um conteúdo. */
export function colecaoDe(disciplinaSlug: string, conteudoSlug: string): ItemBiblioteca[] {
  const disciplina = acharDisciplina(disciplinaSlug);
  const conteudo = acharConteudo(disciplina, conteudoSlug);
  if (!disciplina || !conteudo) return [];

  const itens: ItemBiblioteca[] = [];
  let planos = 0;
  let atividades = 0;

  conteudo.series.forEach((serie, i) => {
    (["plano", "atividade"] as const).forEach((tipo, j) => {
      const n = i * 2 + j;
      const h = hash(`${disciplinaSlug}|${conteudoSlug}|${serie}|${tipo}`);
      const material = gerarMaterialCompleto({
        disciplina: disciplina.nome,
        serie,
        tema: conteudo.nome,
        duracao: DURACOES_CAT[h % DURACOES_CAT.length],
      });
      material.origem = tipo;
      const ordem = tipo === "plano" ? ++planos : ++atividades;
      itens.push({
        id: `cat-${disciplinaSlug}-${conteudoSlug}-${tipo}-${i}`,
        rotulo: `${tipo === "plano" ? "Plano" : "Atividade"} ${String(ordem).padStart(2, "0")}`,
        tipo,
        disciplinaSlug,
        conteudoSlug,
        autor: AUTORES[h % AUTORES.length],
        publicadoEm: dataPublicacao(n),
        seloOficial:
          h % 7 === 0 ? "semana" : h % 3 === 0 ? "equipe" : h % 3 === 1 ? "comunidade" : "nenhum",
        material,
      });
    });
  });

  return itens;
}

export function totalMateriais(d: DisciplinaCatalogo) {
  return d.conteudos.reduce((s, c) => s + c.series.length * 2, 0);
}

/** Destaques da semana em todo o catálogo (curadoria oficial). */
export function destaquesGlobais(limite = 6): ItemBiblioteca[] {
  const itens: ItemBiblioteca[] = [];
  for (const d of CATALOGO) {
    for (const c of d.conteudos) {
      for (const item of colecaoDe(d.slug, c.slug)) {
        if (item.seloOficial === "semana") itens.push(item);
        if (itens.length >= limite) return itens;
      }
    }
  }
  return itens;
}