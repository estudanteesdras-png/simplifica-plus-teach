import { Link, createFileRoute } from "@tanstack/react-router";
import { Clock, GraduationCap, HeartHandshake, Laptop, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/comece-agora")({
  head: () => ({
    meta: [
      { title: "Comece agora — Simplifica+ Tech" },
      {
        name: "description",
        content:
          "Veja como o Simplifica+ Tech economiza tempo do professor com planejamento e atividades adaptadas.",
      },
      { property: "og:title", content: "Comece agora — Simplifica+ Tech" },
      {
        property: "og:description",
        content: "Conheça a plataforma e crie sua conta em poucos passos.",
      },
    ],
  }),
  component: ComeceAgora,
});

const BENEFICIOS = [
  { icon: Clock, t: "Menos horas de planejamento", d: "Planos completos em minutos, prontos para editar." },
  { icon: HeartHandshake, t: "Inclusão na prática", d: "Adaptações para TEA, TDAH, DI e deficiência visual." },
  { icon: GraduationCap, t: "Alinhado à BNCC", d: "Materiais pensados para as escolas brasileiras." },
  { icon: ShieldCheck, t: "Organização garantida", d: "Histórico, favoritos e rascunhos sempre à mão." },
];

function ComeceAgora() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
        <Link to="/">
          <Logo />
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <div className="card-surface overflow-hidden">
          <div className="bg-brand px-6 py-10 text-primary-foreground sm:px-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Laptop size={14} /> Educação + Tecnologia
            </span>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Planejar aulas ficou simples
            </h1>
            <p className="mt-3 max-w-2xl text-sm opacity-90">
              O Simplifica+ Tech reúne planejamento de aulas, criação de atividades adaptadas e uma
              biblioteca inclusiva em uma única plataforma. Você informa a turma e o conteúdo, e a
              plataforma organiza objetivos, metodologia, recursos e avaliação para você.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-10">
            {BENEFICIOS.map((b) => (
              <div key={b.t} className="flex min-w-0 gap-3 rounded-2xl bg-soft p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card text-brand-purple">
                  <b.icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">{b.t}</p>
                  <p className="text-sm text-muted-foreground">{b.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 border-t border-border p-6 sm:p-10">
            <Button asChild size="lg" className="bg-brand text-primary-foreground shadow-glow">
              <Link to="/login" search={{ modo: "cadastro" }}>
                Criar conta
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}