import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bell } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/notificacoes")({
  head: () => ({
    meta: [
      { title: "Mensagens e notificações — Simplifica+ Tech" },
      { name: "description", content: "Avisos da plataforma e sugestões da IA educacional." },
      { property: "og:title", content: "Mensagens e notificações — Simplifica+ Tech" },
      { property: "og:description", content: "Acompanhe novidades e sugestões." },
    ],
  }),
  component: Notificacoes,
});

function Notificacoes() {
  const { notificacoes, marcarNotificacoesLidas } = useApp();

  useEffect(() => {
    marcarNotificacoesLidas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageHeader title="Mensagens e notificações" subtitle="Avisos da plataforma e da IA." />
      <div className="card-surface divide-y divide-border">
        {notificacoes.map((n) => (
          <div key={n.id} className="flex gap-3 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-soft text-brand-purple">
              <Bell size={16} />
            </span>
            <div className="min-w-0">
              <p className="font-semibold">{n.titulo}</p>
              <p className="text-sm text-muted-foreground">{n.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}