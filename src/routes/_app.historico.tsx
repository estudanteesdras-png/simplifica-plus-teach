import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardList, FileText, Heart, Layers, Printer, Trash2 } from "lucide-react";

import { EstadoVazio } from "@/components/EstadoVazio";
import { PageHeader } from "@/components/PageHeader";
import { DocumentoAtividade, DocumentoPlano } from "@/components/material/DocumentoMaterial";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MaterialCompleto } from "@/lib/material";
import { useApp } from "@/lib/store";
import { imprimirMaterial } from "@/lib/impressao";

export const Route = createFileRoute("/_app/historico")({
  head: () => ({
    meta: [
      { title: "Histórico — Simplifica+ Tech" },
      { name: "description", content: "Planejamentos e atividades salvos, incluindo rascunhos." },
      { property: "og:title", content: "Histórico — Simplifica+ Tech" },
      { property: "og:description", content: "Retome seus materiais quando quiser." },
    ],
  }),
  component: Historico,
});

function Historico() {
  const {
    user,
    materiais,
    favoritos,
    toggleFavorito,
    removeMaterial,
    registrarDownload,
    registrarEvento,
  } = useApp();
  const [aberto, setAberto] = useState<MaterialCompleto | null>(null);

  const atividades = materiais.filter((m) => m.origem === "atividade");
  const sequencias = materiais.filter((m) => m.origem === "sequencia");
  const planos = materiais.filter((m) => m.origem !== "atividade" && m.origem !== "sequencia");
  const data = (s: string) => new Date(s).toLocaleDateString("pt-BR");

  function baixar(m: MaterialCompleto) {
    setAberto(m);
    registrarDownload(m.id);
    registrarEvento({
      tipo: "download",
      materialId: m.id,
      disciplina: m.disciplina,
      serie: m.serie,
      formato: m.origem === "atividade" ? "atividade" : m.origem === "sequencia" ? "sequencia" : "plano",
    });
    imprimirMaterial({
      titulo: m.tema || m.titulo,
      disciplina: m.disciplina,
      serie: m.serie,
      tipo: m.origem === "atividade" ? "atividade" : m.origem === "sequencia" ? "sequencia" : "plano",
    });
  }

  const Cartao = ({ m }: { m: MaterialCompleto }) => (
    <article className="card-surface p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 truncate font-bold">
            {m.origem === "atividade" ? (
              <ClipboardList size={16} className="shrink-0 text-brand-purple" />
            ) : m.origem === "sequencia" ? (
              <Layers size={16} className="shrink-0 text-brand-purple" />
            ) : (
              <FileText size={16} className="shrink-0 text-brand-purple" />
            )}
            {m.titulo}
          </h2>
          <p className="text-xs text-muted-foreground">
            {m.disciplina} · {m.serie} · {m.duracao} · {data(m.criadoEm)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            aria-label="Favoritar"
            onClick={() => toggleFavorito(m.id)}
          >
            <Heart
              size={14}
              className={favoritos.includes(m.id) ? "fill-brand-purple text-brand-purple" : ""}
            />
          </Button>
          <Button variant="outline" size="sm" onClick={() => baixar(m)}>
            <Printer size={14} /> PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label="Remover"
            onClick={() => removeMaterial(m.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      {m.codigosBNCC && (
        <p className="mt-3 text-xs font-medium text-brand-blue">{m.codigosBNCC}</p>
      )}
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{m.subtitulo}</p>
    </article>
  );

  return (
    <div>
      <div className="nao-imprimir">
        <PageHeader title="Histórico" subtitle="Tudo o que você criou fica salvo aqui." />

        <Tabs defaultValue="planos">
          <TabsList>
            <TabsTrigger value="planos">Planejamentos ({planos.length})</TabsTrigger>
            <TabsTrigger value="atividades">Atividades ({atividades.length})</TabsTrigger>
            <TabsTrigger value="sequencias">Sequências ({sequencias.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="planos" className="mt-5 space-y-4">
            {planos.length === 0 && (
              <EstadoVazio
                variante="educador"
                titulo="Nenhuma aula gerada ainda"
                descricao="Assim que você criar um plano de aula, ele fica guardado aqui na sua conta."
              />
            )}
            {planos.map((m) => (
              <Cartao key={m.id} m={m} />
            ))}
          </TabsContent>

          <TabsContent value="atividades" className="mt-5 space-y-4">
            {atividades.length === 0 && (
              <EstadoVazio
                variante="inclusivo"
                titulo="Nenhuma atividade salva ainda"
                descricao="Gere uma atividade adaptada e ela aparece aqui automaticamente."
              />
            )}
            {atividades.map((m) => (
              <Cartao key={m.id} m={m} />
            ))}
          </TabsContent>

          <TabsContent value="sequencias" className="mt-5 space-y-4">
            {sequencias.length === 0 && (
              <EstadoVazio
                variante="pesquisador"
                titulo="Nenhuma sequência didática ainda"
                descricao="Monte uma sequência completa e ela fica salva na sua conta."
              />
            )}
            {sequencias.map((m) => (
              <Cartao key={m.id} m={m} />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {aberto && (
        <div className="doc-scroll mt-8 overflow-x-auto">
          {aberto.origem === "atividade" ? (
            <DocumentoAtividade m={aberto} professor={user?.nome} />
          ) : (
            <DocumentoPlano m={aberto} professor={user?.nome} />
          )}
        </div>
      )}
    </div>
  );
}
