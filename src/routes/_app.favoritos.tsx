import { Link, createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { EstadoVazio } from "@/components/EstadoVazio";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { MATERIAIS } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Simplifica+ Tech" },
      { name: "description", content: "Materiais favoritados e salvos pelo professor." },
      { property: "og:title", content: "Favoritos — Simplifica+ Tech" },
      { property: "og:description", content: "Seus materiais preferidos em um só lugar." },
    ],
  }),
  component: Favoritos,
});

function Favoritos() {
  const { favoritos, salvos, toggleFavorito, materiais } = useApp();
  const ids = Array.from(new Set([...favoritos, ...salvos]));

  const lista = [
    ...materiais
      .filter((m) => ids.includes(m.id))
      .map((m) => ({
        id: m.id,
        titulo: m.titulo,
        disciplina: `${m.origem === "atividade" ? "Atividade" : m.origem === "sequencia" ? "Sequência" : "Plano"} · ${m.disciplina}`,
        serie: m.serie,
        descricao: m.subtitulo,
      })),
    ...MATERIAIS.filter((m) => ids.includes(m.id)).map((m) => ({
      id: m.id,
      titulo: m.titulo,
      disciplina: m.disciplina,
      serie: m.serie,
      descricao: m.descricao,
    })),
  ];

  return (
    <div>
      <PageHeader
        title="Favoritos e salvos"
        subtitle="Materiais que você marcou ao criar planos e atividades."
      />

      {lista.length === 0 ? (
        <EstadoVazio
          variante="inclusivo"
          titulo="Nenhum favorito por aqui ainda"
          descricao="Toque no coração de um material para guardá-lo na sua conta."
          acao={
            <Button asChild className="bg-brand text-primary-foreground">
              <Link to="/planos">Criar um plano de aula</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lista.map((m) => (
            <article key={m.id} className="card-surface p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <h2 className="min-w-0 font-bold">{m.titulo}</h2>
                <button onClick={() => toggleFavorito(m.id)} aria-label="Favoritar">
                  <Heart
                    size={18}
                    className={
                      favoritos.includes(m.id)
                        ? "fill-brand-purple text-brand-purple"
                        : "text-muted-foreground"
                    }
                  />
                </button>
              </div>
              <p className="mt-1 text-xs font-medium text-brand-blue">
                {m.disciplina} · {m.serie}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{m.descricao}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
