import { Link, createFileRoute } from "@tanstack/react-router";
import { Accessibility, ArrowRight, BookOpen, NotebookPen, Sparkles } from "lucide-react";

import heroImg from "@/assets/hero-simplifica.jpg";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Simplifica+ Tech — Planejamento docente com tecnologia e inclusão" },
      {
        name: "description",
        content:
          "Planeje aulas, crie atividades adaptadas e acesse uma biblioteca inclusiva. Feito para professores da educação básica.",
      },
      {
        property: "og:title",
        content: "Simplifica+ Tech — Planejamento docente com tecnologia e inclusão",
      },
      {
        property: "og:description",
        content: "Planeje aulas, crie atividades adaptadas e acesse uma biblioteca inclusiva. Feito para professores da educação básica.",
      },
    ],
  }),
  component: Index,
});

const DESTAQUES = [
  {
    icon: NotebookPen,
    titulo: "Planejamento de aulas",
    texto:
      "Preencha série, disciplina e objetivo e receba um plano completo com metodologia, recursos e avaliação.",
  },
  {
    icon: Accessibility,
    titulo: "Atividades adaptadas",
    texto:
      "Gere versões adaptadas para TEA, TDAH, deficiência intelectual e visual em poucos segundos.",
  },
  {
    icon: BookOpen,
    titulo: "Biblioteca inclusiva",
    texto:
      "Materiais organizados por disciplina, série e tipo de adaptação, avaliados pelos próprios professores.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-5 sm:px-6">
        <Logo />
        <nav className="flex shrink-0 items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="bg-brand text-primary-foreground shadow-glow">
            <Link to="/comece-agora">Comece agora</Link>
          </Button>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-2 lg:pt-14">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-soft px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Sparkles size={14} /> Tecnologia e inclusão para professores
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
            Simplifique o planejamento docente com{" "}
            <span className="text-brand">tecnologia e inclusão</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            O Simplifica+ Tech ajuda professores da educação básica a planejar aulas mais rápido,
            criar atividades adaptadas e encontrar materiais alinhados às necessidades de cada
            estudante — sobrando mais tempo para o que importa: ensinar.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-brand text-primary-foreground shadow-glow">
              <Link to="/comece-agora">
                Comece agora <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Entrar</Link>
            </Button>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              ["+44,4%", "de matrículas com TEA em um ano (Censo Escolar 2024)"],
              ["Horas", "de planejamento fora da sala de aula economizadas"],
              ["BNCC", "materiais alinhados às escolas brasileiras"],
            ].map(([k, v]) => (
              <div key={k} className="card-surface p-4">
                <dt className="font-display text-xl font-bold text-brand-purple">{k}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-brand opacity-20 blur-2xl" />
          <img
            src={heroImg}
            alt="Professora planejando aulas com apoio da plataforma Simplifica+ Tech"
            width={1280}
            height={960}
            className="relative w-full rounded-3xl border border-border object-cover shadow-soft"
          />
        </div>
      </section>

      <section className="border-t border-border bg-card/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Tudo o que o professor precisa em um só lugar
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {DESTAQUES.map((d) => (
              <article key={d.titulo} className="card-surface p-6 transition-transform hover:-translate-y-1">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-primary-foreground">
                  <d.icon size={22} />
                </span>
                <h3 className="mt-4 text-lg font-bold">{d.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-muted-foreground sm:px-6">
        Simplifica+ Tech — Escola Municipal João Bento de Paiva · Planejamento inteligente e
        inclusivo para professores.
      </footer>
    </div>
  );
}
