import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MaterialCompleto } from "./material";
import type { Selo } from "./catalogo";

export const ADMIN_EMAIL = "estudante.esdras@gmail.com";

export type Teacher = {
  nome: string;
  email: string;
  escola: string;
  disciplina: string;
  preferencias: string;
  /** Rede da escola: pública ou privada. */
  tipoEscola?: "Pública" | "Privada";
  /** Turma / série em que leciona. */
  turma?: string;
  /** Marca se o cadastro inicial do professor já foi concluído. */
  onboardingOk?: boolean;
};

export type Plano = {
  id: string;
  serie: string;
  disciplina: string;
  tema: string;
  objetivo: string;
  duracao: string;
  adaptacao: string;
  conteudo: {
    objetivos: string[];
    metodologia: string[];
    recursos: string[];
    avaliacao: string[];
    observacoes: string;
  };
  rascunho: boolean;
  criadoEm: string;
};

export type Atividade = {
  id: string;
  serie: string;
  disciplina: string;
  conteudo: string;
  necessidade: string;
  enunciado: string;
  passos: string[];
  versaoAdaptada: string;
  apoioVisual: string[];
  rascunho: boolean;
  criadoEm: string;
};

export type Avaliacao = {
  id: string;
  materialId: string;
  nota: number;
  comentario: string;
  criadoEm: string;
};

export type EventoAprendizado = {
  id: string;
  tipo: "geracao" | "salvo" | "download" | "favorito" | "edicao" | "avaliacao";
  materialId?: string;
  disciplina?: string;
  serie?: string;
  adaptacao?: string;
  formato?: "plano" | "atividade" | "sequencia";
  nota?: number;
  criadoEm: string;
};

export type Notificacao = {
  id: string;
  titulo: string;
  texto: string;
  lida: boolean;
  criadoEm: string;
};

type State = {
  user: Teacher | null;
  planos: Plano[];
  atividades: Atividade[];
  materiais: MaterialCompleto[];
  favoritos: string[];
  salvos: string[];
  avaliacoes: Avaliacao[];
  eventos: EventoAprendizado[];
  downloads: Record<string, number>;
  notificacoes: Notificacao[];
  /** Selos de curadoria definidos por administradores. */
  curadoria: Record<string, Selo>;
  /** Ids de materiais do professor compartilhados na Biblioteca da Comunidade. */
  publicados: string[];
  /** Ids removidos da biblioteca por moderação. */
  removidos: string[];
  theme: "light" | "dark";
};

const STORAGE_KEY = "simplifica-tech-state-v1";

const initialState: State = {
  user: null,
  planos: [],
  atividades: [],
  materiais: [],
  favoritos: [],
  salvos: [],
  avaliacoes: [],
  eventos: [],
  downloads: {},
  curadoria: {},
  publicados: [],
  removidos: [],
  notificacoes: [
    {
      id: "n1",
      titulo: "Bem-vindo(a) ao Simplifica+ Tech",
      texto: "Comece criando seu primeiro planejamento de aula.",
      lida: false,
      criadoEm: new Date().toISOString(),
    },
    {
      id: "n2",
      titulo: "Nova sugestão da IA",
      texto: "A IA aprimorou as sugestões com base nas avaliações dos professores.",
      lida: false,
      criadoEm: new Date().toISOString(),
    },
  ],
  theme: "light",
};

type Ctx = State & {
  hydrated: boolean;
  isAdmin: boolean;
  login: (email: string, nome?: string) => void;
  logout: () => void;
  updateUser: (patch: Partial<Teacher>) => void;
  addPlano: (p: Plano) => void;
  addAtividade: (a: Atividade) => void;
  addMaterial: (m: MaterialCompleto) => void;
  removeMaterial: (id: string) => void;
  registrarEvento: (e: Omit<EventoAprendizado, "id" | "criadoEm">) => void;
  registrarDownload: (id: string) => void;
  toggleFavorito: (id: string) => void;
  toggleSalvo: (id: string) => void;
  addAvaliacao: (a: Avaliacao) => void;
  definirSelo: (id: string, selo: Selo) => void;
  togglePublicado: (id: string) => void;
  toggleRemovido: (id: string) => void;
  toggleTheme: () => void;
  marcarNotificacoesLidas: () => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state, hydrated]);

  const patch = useCallback((fn: (s: State) => State) => setState((s) => fn(s)), []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      hydrated,
      isAdmin: state.user?.email?.trim().toLowerCase() === ADMIN_EMAIL,
      login: (email, nome) =>
        patch((s) => ({
          ...s,
          user: s.user ?? {
            nome: nome?.trim() || "Professor(a)",
            email,
            escola: "Escola Municipal João Bento de Paiva",
            disciplina: "Língua Portuguesa",
            preferencias: "Aulas práticas, materiais visuais e atividades adaptadas.",
          },
        })),
      logout: () => patch((s) => ({ ...s, user: null })),
      updateUser: (p) => patch((s) => (s.user ? { ...s, user: { ...s.user, ...p } } : s)),
      addPlano: (p) => patch((s) => ({ ...s, planos: [p, ...s.planos] })),
      addAtividade: (a) => patch((s) => ({ ...s, atividades: [a, ...s.atividades] })),
      addMaterial: (m) => patch((s) => ({ ...s, materiais: [m, ...s.materiais] })),
      removeMaterial: (id) =>
        patch((s) => ({ ...s, materiais: s.materiais.filter((m) => m.id !== id) })),
      registrarEvento: (e) =>
        patch((s) => ({
          ...s,
          eventos: [
            { ...e, id: crypto.randomUUID(), criadoEm: new Date().toISOString() },
            ...s.eventos,
          ].slice(0, 200),
        })),
      registrarDownload: (id) =>
        patch((s) => ({ ...s, downloads: { ...s.downloads, [id]: (s.downloads[id] ?? 0) + 1 } })),
      toggleFavorito: (id) =>
        patch((s) => ({
          ...s,
          favoritos: s.favoritos.includes(id)
            ? s.favoritos.filter((f) => f !== id)
            : [...s.favoritos, id],
        })),
      toggleSalvo: (id) =>
        patch((s) => ({
          ...s,
          salvos: s.salvos.includes(id) ? s.salvos.filter((f) => f !== id) : [...s.salvos, id],
        })),
      addAvaliacao: (a) => patch((s) => ({ ...s, avaliacoes: [a, ...s.avaliacoes] })),
      definirSelo: (id, selo) =>
        patch((s) => ({ ...s, curadoria: { ...s.curadoria, [id]: selo } })),
      togglePublicado: (id) =>
        patch((s) => ({
          ...s,
          publicados: s.publicados.includes(id)
            ? s.publicados.filter((p) => p !== id)
            : [...s.publicados, id],
        })),
      toggleRemovido: (id) =>
        patch((s) => ({
          ...s,
          removidos: s.removidos.includes(id)
            ? s.removidos.filter((p) => p !== id)
            : [...s.removidos, id],
        })),
      toggleTheme: () => patch((s) => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" })),
      marcarNotificacoesLidas: () =>
        patch((s) => ({ ...s, notificacoes: s.notificacoes.map((n) => ({ ...n, lida: true })) })),
    }),
    [state, hydrated, patch],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de AppProvider");
  return ctx;
}