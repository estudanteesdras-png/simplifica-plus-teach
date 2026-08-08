import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Download,
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
          "Indicadores reais de uso do Simplifica+ Tech: professores, escolas, materiais gerados, horas economizadas e atividades inclusivas.",
      },
      { property: "og:title", content: "Painel de KPIs de impacto — Simplifica+ Tech" },
      {
        property: "og:description",
        content: "Indicadores reais de uso do Simplifica+ Tech em um só painel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PainelKpis,
});

const nf = new Intl.NumberFormat("pt-BR");
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const CORES: Record<string, string> = {
  "Planos de aula": "#7c3aed",
  Atividades: "#3b82f6",
  "Sequências didáticas": "#a78bfa",
  Outros: "#93c5fd",
};

function PainelKpis() {
  const {
    user,
    perfis,
    materiais,
    eventos,
    avaliacoes,
    downloads,
    favoritos,
    salvos,
  } = useApp();

  const autorizado = user?.email?.trim().toLowerCase() === ADMIN_EMAIL;

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

  const professores = Object.keys(perfis).length;
  const escolas = new Set(
    Object.values(perfis)
      .map((p) => p.escola?.trim().toLowerCase())
      .filter((e): e is string => Boolean(e)),
  ).size;

  const geracoes = eventos.filter((e) => e.tipo === "geracao");
  // Materiais gerados = itens realmente salvos no histórico do usuário no banco.
  const totalMateriais = new Set(materiais.map((m) => m.id)).size;
  const totalFavoritos = new Set([...favoritos, ...salvos]).size;
  const inclusivas = geracoes.filter(
    (e) => e.adaptacao && e.adaptacao !== "Sem adaptação",
  ).length;
  // 1,5 h economizada por material salvo no histórico.
  const horas = Math.round(totalMateriais * 1.5);
  const totalDownloads = Object.values(downloads).reduce((s, n) => s + n, 0);

  const cards = [
    { label: "Materiais gerados", valor: nf.format(totalMateriais), icon: Wand2 },
    { label: "Favoritos salvos", valor: nf.format(totalFavoritos), icon: HeartHandshake },
    { label: "Horas economizadas", valor: `${nf.format(horas)}h`, icon: Timer },
    { label: "Atividades inclusivas", valor: nf.format(inclusivas), icon: Users },
    { label: "Downloads realizados", valor: nf.format(totalDownloads), icon: Download },
    { label: "Escolas representadas", valor: nf.format(escolas || (professores ? 1 : 0)), icon: Building2 },
  ];


  // Evolução mensal real das gerações registradas no app.
  const porMes = new Map<string, number>();
  for (const m of materiais) {
    const d = new Date(m.criadoEm);
    if (Number.isNaN(d.getTime())) continue;
    const chave = `${d.getFullYear()}-${d.getMonth()}`;
    porMes.set(chave, (porMes.get(chave) ?? 0) + 1);
  }
  const evolucao = [...porMes.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([chave, valor]) => {
      const [ano, mes] = chave.split("-");
      return { mes: `${MESES[Number(mes)]}/${ano.slice(2)}`, materiais: valor };
    });

  // Distribuição real por formato dos materiais criados.
  const contagem = {
    "Planos de aula": materiais.filter((m) => (m.origem ?? "plano") === "plano").length,
    Atividades: materiais.filter((m) => m.origem === "atividade").length,
    "Sequências didáticas": materiais.filter((m) => m.origem === "sequencia").length,
  };
  const totalFormatos = Object.values(contagem).reduce((s, n) => s + n, 0);
  const uso = Object.entries(contagem)
    .filter(([, v]) => v > 0)
    .map(([nome, v]) => ({
      nome,
      valor: Math.round((v / totalFormatos) * 100),
      quantidade: v,
      cor: CORES[nome] ?? CORES.Outros,
    }));

  const notas = avaliacoes.map((a) => a.nota);
  const satisfacao = notas.length ? notas.reduce((s, n) => s + n, 0) / notas.length : 0;
  const alunos = totalMateriais * 25;

  const vazio = (
    <p className="grid h-full place-items-center text-sm text-muted-foreground">
      Ainda não há dados registrados.
    </p>
  );

  return (
    <div>
      <PageHeader
        title="Painel de KPIs de impacto"
        subtitle="Indicadores calculados apenas a partir do uso real registrado na plataforma."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card-surface card-interativo p-5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-primary-foreground">
              <c.icon size={20} />
            </span>
            <p className="mt-4 font-display text-3xl font-extrabold">{c.valor}</p>
            <p className="text-sm font-medium">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="card-surface p-5">
          <p className="font-semibold">Evolução de materiais criados</p>
          <p className="text-xs text-muted-foreground">Por mês, conforme o uso da plataforma</p>
          <div className="mt-4 h-64 w-full">
            {evolucao.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucao} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
                  <XAxis dataKey="mes" fontSize={12} stroke="currentColor" opacity={0.6} />
                  <YAxis allowDecimals={false} fontSize={12} stroke="currentColor" opacity={0.6} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="materiais"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              vazio
            )}
          </div>
        </div>

        <div className="card-surface p-5">
          <p className="font-semibold">Uso da plataforma</p>
          <p className="text-xs text-muted-foreground">Distribuição real das criações</p>
          <div className="mt-4 h-52 w-full">
            {uso.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={uso} dataKey="quantidade" nameKey="nome" innerRadius={45} outerRadius={78}>
                    {uso.map((u) => (
                      <Cell key={u.nome} fill={u.cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              vazio
            )}
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {uso.map((u) => (
              <li key={u.nome} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: u.cor }} />
                <span className="flex-1">{u.nome}</span>
                <span className="font-semibold">
                  {u.quantidade} ({u.valor}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-5 text-center">
          <p className="font-semibold">Satisfação dos usuários</p>
          <p className="mt-4 font-display text-5xl font-extrabold text-brand-purple">
            {notas.length ? satisfacao.toFixed(1).replace(".", ",") : "—"}
          </p>
          <p className="text-sm text-muted-foreground">de 5 estrelas</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-brand transition-all"
              style={{ width: `${Math.round((satisfacao / 5) * 100)}%` }}
            />
          </div>
          <p className="mt-3 text-sm font-medium">
            {notas.length} avaliação(ões) registrada(s)
          </p>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-3">
            <Mascote humor="ouve" size={40} />
            <p className="font-semibold">Impacto social</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• {nf.format(alunos)} alunos alcançados (estimativa de 25 por material gerado).</li>
            <li>• {nf.format(inclusivas)} atividades com adaptação inclusiva geradas.</li>
            <li>• {nf.format(horas)} horas de preparação economizadas.</li>
            <li>• {nf.format(escolas)} escola(s) representadas pelos perfis cadastrados.</li>
          </ul>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-soft text-brand-purple">
              <TrendingUp size={18} />
            </span>
            <p className="font-semibold">Produtividade</p>
          </div>
          <p className="mt-4 font-display text-4xl font-extrabold">
            {professores ? (totalMateriais / professores).toFixed(1).replace(".", ",") : "0"}
          </p>
          <p className="text-sm text-muted-foreground">materiais por professor cadastrado</p>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles size={14} className="text-brand-purple" /> {nf.format(eventos.length)} eventos
            de uso registrados na plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
