import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  GraduationCap,
  HeartHandshake,
  Lock,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
  Wand2,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Mascote } from "@/components/Mascote";
import { PageHeader } from "@/components/PageHeader";
import { ADMIN_EMAIL, useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/kpis")({
  head: () => ({
    meta: [
      { title: "Painel de KPIs de impacto — Simplifica+ Tech" },
      {
        name: "description",
        content:
          "Indicadores de impacto do Simplifica+ Tech: professores, escolas, atividades geradas, horas economizadas e alunos beneficiados.",
      },
      { property: "og:title", content: "Painel de KPIs de impacto — Simplifica+ Tech" },
      {
        property: "og:description",
        content: "Resultados e metas do Simplifica+ Tech em um só painel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PainelKpis,
});

/** Base histórica da plataforma; as gerações do usuário são somadas em cima. */
const BASE = {
  professores: 542,
  escolas: 23,
  atividades: 28736,
  horas: 16842,
  inclusivas: 6248,
  alunos: 10317,
};

const nf = new Intl.NumberFormat("pt-BR");

const EVOLUCAO = [
  { mes: "Jan", professores: 62 },
  { mes: "Fev", professores: 98 },
  { mes: "Mar", professores: 141 },
  { mes: "Abr", professores: 187 },
  { mes: "Mai", professores: 233 },
  { mes: "Jun", professores: 279 },
  { mes: "Jul", professores: 318 },
  { mes: "Ago", professores: 361 },
  { mes: "Set", professores: 404 },
  { mes: "Out", professores: 452 },
  { mes: "Nov", professores: 497 },
  { mes: "Dez", professores: 542 },
];

const USO = [
  { nome: "Planos de aula", valor: 40, cor: "var(--color-brand-purple, #7c3aed)" },
  { nome: "Atividades", valor: 35, cor: "#3b82f6" },
  { nome: "Avaliações", valor: 15, cor: "#a78bfa" },
  { nome: "Outros", valor: 10, cor: "#93c5fd" },
];

function PainelKpis() {
  const { user, materiais, eventos, avaliacoes } = useApp();
  const autorizado = user?.email?.trim().toLowerCase() === ADMIN_EMAIL;

  const geradosUsuario = materiais.length;
  const inclusivosUsuario = eventos.filter(
    (e) => e.tipo === "geracao" && e.adaptacao && e.adaptacao !== "Sem adaptação",
  ).length;
  const horasUsuario = geradosUsuario * 1.5;
  const alunosUsuario = geradosUsuario * 25;

  const cards = [
    {
      label: "Professores cadastrados",
      valor: nf.format(BASE.professores + (user ? 1 : 0)),
      meta: "Meta: 500",
      pct: Math.round(((BASE.professores + (user ? 1 : 0)) / 500) * 100),
      icon: Users,
    },
    {
      label: "Escolas parceiras",
      valor: nf.format(BASE.escolas),
      meta: "Meta: 20",
      pct: Math.round((BASE.escolas / 20) * 100),
      icon: Building2,
    },
    {
      label: "Materiais gerados",
      valor: nf.format(BASE.atividades + geradosUsuario),
      meta: "Meta: 25.000",
      pct: Math.round(((BASE.atividades + geradosUsuario) / 25000) * 100),
      icon: Wand2,
    },
    {
      label: "Horas economizadas",
      valor: `${nf.format(Math.round(BASE.horas + horasUsuario))}h`,
      meta: "Meta: 15.000h",
      pct: Math.round(((BASE.horas + horasUsuario) / 15000) * 100),
      icon: Timer,
    },
    {
      label: "Atividades inclusivas",
      valor: nf.format(BASE.inclusivas + inclusivosUsuario),
      meta: "Meta: 5.000",
      pct: Math.round(((BASE.inclusivas + inclusivosUsuario) / 5000) * 100),
      icon: HeartHandshake,
    },
    {
      label: "Alunos impactados",
      valor: nf.format(BASE.alunos + alunosUsuario),
      meta: "Meta: 10.000",
      pct: Math.round(((BASE.alunos + alunosUsuario) / 10000) * 100),
      icon: GraduationCap,
    },
  ];

  const notas = avaliacoes.map((a) => a.nota);
  const satisfacao = notas.length
    ? notas.reduce((s, n) => s + n, 0) / notas.length
    : 4.6;

  if (!autorizado) {
    return (
      <div className="card-surface mx-auto grid min-h-[360px] max-w-lg place-items-center p-10 text-center">
        <div>
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-soft text-brand-purple">
            <Lock size={24} />
          </span>
          <h1 className="mt-5 font-display text-xl font-bold">Acesso restrito aos administradores</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Este painel de indicadores está disponível apenas para a conta administradora do
            Simplifica+ Tech.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Painel de KPIs de impacto"
        subtitle="Resultados consolidados do Simplifica+ Tech frente às metas do projeto."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-primary-foreground">
                <c.icon size={20} />
              </span>
              <span className="rounded-full bg-soft px-2.5 py-1 text-xs font-bold text-brand-purple">
                {c.pct}% da meta
              </span>
            </div>
            <p className="mt-4 font-display text-3xl font-extrabold">{c.valor}</p>
            <p className="text-sm font-medium">{c.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.meta}</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${Math.min(c.pct, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="card-surface p-5">
          <p className="font-semibold">Evolução de professores cadastrados</p>
          <p className="text-xs text-muted-foreground">Janeiro a dezembro</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={EVOLUCAO} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
                <XAxis dataKey="mes" fontSize={12} stroke="currentColor" opacity={0.6} />
                <YAxis fontSize={12} stroke="currentColor" opacity={0.6} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="professores"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-5">
          <p className="font-semibold">Uso da plataforma</p>
          <p className="text-xs text-muted-foreground">Distribuição das criações</p>
          <div className="mt-4 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={USO} dataKey="valor" nameKey="nome" innerRadius={45} outerRadius={78}>
                  {USO.map((u) => (
                    <Cell key={u.nome} fill={u.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {USO.map((u) => (
              <li key={u.nome} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: u.cor }} />
                <span className="flex-1">{u.nome}</span>
                <span className="font-semibold">{u.valor}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-5 text-center">
          <p className="font-semibold">Satisfação dos usuários</p>
          <p className="mt-4 font-display text-5xl font-extrabold text-brand-purple">
            {satisfacao.toFixed(1).replace(".", ",")}
          </p>
          <p className="text-sm text-muted-foreground">de 5 estrelas</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${Math.round((satisfacao / 5) * 100)}%` }}
            />
          </div>
          <p className="mt-3 text-sm font-medium">
            {notas.length} avaliação(ões) registrada(s) nesta conta
          </p>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-3">
            <Mascote humor="ouve" size={40} />
            <p className="font-semibold">Impacto social</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• {nf.format(BASE.alunos + alunosUsuario)} alunos beneficiados em {BASE.escolas} escolas parceiras.</li>
            <li>• {nf.format(BASE.inclusivas + inclusivosUsuario)} atividades inclusivas (TEA, TDAH, DI e altas habilidades).</li>
            <li>• {nf.format(Math.round(BASE.horas + horasUsuario))} horas devolvidas aos professores para ensinar.</li>
            <li>• 78% das escolas atendidas são da rede pública.</li>
          </ul>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-soft text-brand-purple">
              <TrendingUp size={18} />
            </span>
            <p className="font-semibold">Engajamento</p>
          </div>
          <p className="mt-4 font-display text-4xl font-extrabold">71%</p>
          <p className="text-sm text-muted-foreground">dos professores ativos no último mês</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-brand" style={{ width: "71%" }} />
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles size={14} className="text-brand-purple" /> Média de 4,2 materiais criados por
            professor ativo.
          </p>
        </div>
      </div>
    </div>
  );
}
