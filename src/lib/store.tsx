import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
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
  /** Perfis conhecidos (apenas o próprio, por privacidade). */
  perfis: Record<string, Teacher>;
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

const TEMA_KEY = "simplifica-tech-tema";

const NOTIFICACOES_PADRAO: Notificacao[] = [
  {
    id: "n1",
    titulo: "Bem-vindo(a) ao Simplifica+ Tech",
    texto: "Comece criando seu primeiro planejamento de aula.",
    lida: false,
    criadoEm: new Date().toISOString(),
  },
];

const initialState: State = {
  user: null,
  perfis: {},
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
  notificacoes: NOTIFICACOES_PADRAO,
  theme: "light",
};

type Ctx = State & {
  hydrated: boolean;
  isAdmin: boolean;
  /** Cadastro com e-mail e senha. */
  cadastrar: (nome: string, email: string, senha: string) => Promise<{ erro?: string }>;
  /** Login com e-mail e senha. */
  entrar: (email: string, senha: string) => Promise<{ erro?: string }>;
  logout: () => Promise<void>;
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

function perfilDaLinha(row: Record<string, unknown>, email: string): Teacher {
  return {
    nome: (row.nome as string) || "Professor(a)",
    email: (row.email as string) || email,
    escola: (row.escola as string) ?? "",
    disciplina: (row.disciplina as string) ?? "",
    preferencias: (row.preferencias as string) ?? "",
    tipoEscola: (row.tipo_escola as string) === "Privada" ? "Privada" : "Pública",
    turma: (row.turma as string) ?? "",
    onboardingOk: Boolean(row.onboarding_ok),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const uidRef = useRef<string | null>(null);
  /** ids de materiais já gravados no banco (id local -> id definitivo). Evita duplicação. */
  const persistidosRef = useRef<Map<string, string>>(new Map());

  const patch = useCallback((fn: (s: State) => State) => setState((s) => fn(s)), []);

  /* ---------------- Tema (local, instantâneo) ---------------- */
  useEffect(() => {
    const salvo = window.localStorage.getItem(TEMA_KEY);
    if (salvo === "dark" || salvo === "light") {
      setState((s) => ({ ...s, theme: salvo }));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(TEMA_KEY, state.theme);
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  /* ---------------- Carregamento dos dados do usuário ---------------- */
  const carregar = useCallback(async (uid: string, email: string, nomeFallback?: string) => {
    const [perfil, materiais, favoritos, salvos, avaliacoes, eventos, downloads, curadoria] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
        supabase.from("materiais").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
        supabase.from("favoritos").select("material_id").eq("user_id", uid),
        supabase.from("salvos").select("material_id").eq("user_id", uid),
        supabase.from("avaliacoes").select("*").eq("user_id", uid),
        supabase.from("eventos").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(500),
        supabase.from("downloads").select("material_id,total").eq("user_id", uid),
        supabase.from("curadoria").select("material_id,selo"),
      ]);

    let linhaPerfil = perfil.data as Record<string, unknown> | null;
    if (!linhaPerfil) {
      const novo = { id: uid, nome: nomeFallback?.trim() || "Professor(a)", email };
      const { data } = await supabase.from("profiles").insert(novo).select("*").maybeSingle();
      linhaPerfil = (data as Record<string, unknown> | null) ?? novo;
    }
    const user = perfilDaLinha(linhaPerfil, email);

    persistidosRef.current = new Map(
      (materiais.data ?? []).map((row) => [row.id as string, row.id as string]),
    );

    const listaMateriais: MaterialCompleto[] = (materiais.data ?? []).map((row) => ({
      ...((row.payload ?? {}) as MaterialCompleto),
      id: row.id,
      origem: (row.origem as MaterialCompleto["origem"]) ?? "plano",
    }));

    setState((s) => ({
      ...s,
      user,
      perfis: { [user.email.trim().toLowerCase()]: user },
      materiais: listaMateriais,
      favoritos: (favoritos.data ?? []).map((f) => f.material_id),
      salvos: (salvos.data ?? []).map((f) => f.material_id),
      avaliacoes: (avaliacoes.data ?? []).map((a) => ({
        id: a.id,
        materialId: a.material_id,
        nota: a.nota,
        comentario: a.comentario,
        criadoEm: a.created_at,
      })),
      eventos: (eventos.data ?? []).map((e) => ({
        id: e.id,
        tipo: e.tipo as EventoAprendizado["tipo"],
        materialId: e.material_id ?? undefined,
        disciplina: e.disciplina ?? undefined,
        serie: e.serie ?? undefined,
        adaptacao: e.adaptacao ?? undefined,
        formato: (e.formato as EventoAprendizado["formato"]) ?? undefined,
        nota: e.nota ?? undefined,
        criadoEm: e.created_at,
      })),
      downloads: Object.fromEntries((downloads.data ?? []).map((d) => [d.material_id, d.total])),
      curadoria: Object.fromEntries(
        (curadoria.data ?? []).map((c) => [c.material_id, c.selo as Selo]),
      ),
      publicados: (materiais.data ?? []).filter((m) => m.publicado).map((m) => m.id),
      removidos: (materiais.data ?? []).filter((m) => m.removido).map((m) => m.id),
    }));
  }, []);

  /* ---------------- Sessão ---------------- */
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, session) => {
      const u = session?.user ?? null;
      if (!u) {
        uidRef.current = null;
        persistidosRef.current = new Map();
        setState((s) => ({ ...initialState, theme: s.theme }));
        setHydrated(true);
        return;
      }
      if (uidRef.current === u.id) return;
      uidRef.current = u.id;
      const nome =
        (u.user_metadata?.nome as string) || (u.user_metadata?.full_name as string) || undefined;
      void carregar(u.id, u.email ?? "", nome).finally(() => setHydrated(true));
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!data.session) setHydrated(true);
    });

    return () => sub.subscription.unsubscribe();
  }, [carregar]);

  const uid = () => uidRef.current;

  const value = useMemo<Ctx>(() => {
    return {
      ...state,
      hydrated,
      isAdmin: state.user?.email?.trim().toLowerCase() === ADMIN_EMAIL,

      cadastrar: async (nome, email, senha) => {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: {
            emailRedirectTo: window.location.origin,
            data: { nome: nome.trim() || "Professor(a)" },
          },
        });
        return error ? { erro: error.message } : {};
      },
      entrar: async (email, senha) => {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });
        return error ? { erro: error.message } : {};
      },
      logout: async () => {
        await supabase.auth.signOut();
        uidRef.current = null;
        persistidosRef.current = new Map();
        setState((s) => ({ ...initialState, theme: s.theme }));
      },

      updateUser: (p) => {
        patch((s) => {
          if (!s.user) return s;
          const user = { ...s.user, ...p };
          return { ...s, user, perfis: { [user.email.trim().toLowerCase()]: user } };
        });
        const id = uid();
        if (!id) return;
        const linha: Record<string, unknown> = {};
        if (p.nome !== undefined) linha.nome = p.nome;
        if (p.escola !== undefined) linha.escola = p.escola;
        if (p.disciplina !== undefined) linha.disciplina = p.disciplina;
        if (p.preferencias !== undefined) linha.preferencias = p.preferencias;
        if (p.tipoEscola !== undefined) linha.tipo_escola = p.tipoEscola;
        if (p.turma !== undefined) linha.turma = p.turma;
        if (p.onboardingOk !== undefined) linha.onboarding_ok = p.onboardingOk;
        if (Object.keys(linha).length) {
          void supabase.from("profiles").update(linha as never).eq("id", id);
        }
      },

      addPlano: (p) => patch((s) => ({ ...s, planos: [p, ...s.planos] })),
      addAtividade: (a) => patch((s) => ({ ...s, atividades: [a, ...s.atividades] })),

      addMaterial: (m) => {
        const id = uid();
        // Idempotência: um mesmo material (id local ou id do banco) nunca é
        // gravado/exibido duas vezes, mesmo se "Salvar no acervo" for clicado
        // depois da gravação automática ou se o efeito rodar em modo estrito.
        const mapa = persistidosRef.current;
        if (mapa.has(m.id) || [...mapa.values()].includes(m.id)) return;
        mapa.set(m.id, m.id);
        patch((s) =>
          s.materiais.some((x) => x.id === m.id) ? s : { ...s, materiais: [m, ...s.materiais] },
        );
        if (!id) return;
        void supabase
          .from("materiais")
          .insert({
            user_id: id,
            titulo: m.titulo ?? "",
            origem: m.origem ?? "plano",
            disciplina: m.disciplina ?? "",
            serie: m.serie ?? "",
            payload: JSON.parse(JSON.stringify(m)),
          })
          .select("id")
          .maybeSingle()
          .then(({ data }) => {
            if (!data?.id) return;
            persistidosRef.current.set(m.id, data.id);
            // troca o id local pelo id definitivo do banco
            patch((s) => ({
              ...s,
              materiais: s.materiais.map((x) => (x.id === m.id ? { ...x, id: data.id } : x)),
              favoritos: s.favoritos.map((f) => (f === m.id ? data.id : f)),
              salvos: s.salvos.map((f) => (f === m.id ? data.id : f)),
            }));
          });
      },

      removeMaterial: (id) => {
        patch((s) => ({ ...s, materiais: s.materiais.filter((m) => m.id !== id) }));
        if (uid()) void supabase.from("materiais").delete().eq("id", id);
      },

      registrarEvento: (e) => {
        const id = uid();
        patch((s) => ({
          ...s,
          eventos: [
            { ...e, id: crypto.randomUUID(), criadoEm: new Date().toISOString() },
            ...s.eventos,
          ].slice(0, 500),
        }));
        if (!id) return;
        void supabase.from("eventos").insert({
          user_id: id,
          tipo: e.tipo,
          material_id: e.materialId ?? null,
          disciplina: e.disciplina ?? null,
          serie: e.serie ?? null,
          adaptacao: e.adaptacao ?? null,
          formato: e.formato ?? null,
          nota: e.nota ?? null,
        });
      },

      registrarDownload: (id) => {
        const u = uid();
        const total = (state.downloads[id] ?? 0) + 1;
        patch((s) => ({ ...s, downloads: { ...s.downloads, [id]: (s.downloads[id] ?? 0) + 1 } }));
        if (!u) return;
        void supabase
          .from("downloads")
          .upsert({ user_id: u, material_id: id, total }, { onConflict: "user_id,material_id" });
      },

      toggleFavorito: (id) => {
        const u = uid();
        const ativo = state.favoritos.includes(id);
        patch((s) => ({
          ...s,
          favoritos: ativo ? s.favoritos.filter((f) => f !== id) : [...s.favoritos, id],
        }));
        if (!u) return;
        void (ativo
          ? supabase.from("favoritos").delete().eq("user_id", u).eq("material_id", id)
          : supabase.from("favoritos").insert({ user_id: u, material_id: id }));
      },

      toggleSalvo: (id) => {
        const u = uid();
        const ativo = state.salvos.includes(id);
        patch((s) => ({
          ...s,
          salvos: ativo ? s.salvos.filter((f) => f !== id) : [...s.salvos, id],
        }));
        if (!u) return;
        void (ativo
          ? supabase.from("salvos").delete().eq("user_id", u).eq("material_id", id)
          : supabase.from("salvos").insert({ user_id: u, material_id: id }));
      },

      addAvaliacao: (a) => {
        const u = uid();
        patch((s) => ({ ...s, avaliacoes: [a, ...s.avaliacoes] }));
        if (!u) return;
        void supabase.from("avaliacoes").insert({
          user_id: u,
          material_id: a.materialId,
          nota: a.nota,
          comentario: a.comentario,
        });
      },

      definirSelo: (id, selo) => {
        patch((s) => ({ ...s, curadoria: { ...s.curadoria, [id]: selo } }));
        const u = uid();
        if (!u) return;
        void supabase
          .from("curadoria")
          .upsert({ material_id: id, selo, updated_by: u }, { onConflict: "material_id" });
      },

      togglePublicado: (id) => {
        const ativo = state.publicados.includes(id);
        patch((s) => ({
          ...s,
          publicados: ativo ? s.publicados.filter((p) => p !== id) : [...s.publicados, id],
        }));
        if (uid()) void supabase.from("materiais").update({ publicado: !ativo }).eq("id", id);
      },

      toggleRemovido: (id) => {
        const ativo = state.removidos.includes(id);
        patch((s) => ({
          ...s,
          removidos: ativo ? s.removidos.filter((p) => p !== id) : [...s.removidos, id],
        }));
        if (uid()) void supabase.from("materiais").update({ removido: !ativo }).eq("id", id);
      },

      toggleTheme: () => patch((s) => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" })),
      marcarNotificacoesLidas: () =>
        patch((s) => ({ ...s, notificacoes: s.notificacoes.map((n) => ({ ...n, lida: true })) })),
    };
  }, [state, hydrated, patch]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de AppProvider");
  return ctx;
}
