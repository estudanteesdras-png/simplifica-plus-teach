import { useState } from "react";
import { Download, Globe, Heart, Lock, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StarRating } from "@/components/StarRating";
import { SeloCuradoria } from "@/components/SeloCuradoria";
import { LeitorPDF } from "./LeitorPDF";
import { DocumentoAtividade, DocumentoPlano } from "./DocumentoMaterial";
import type { MaterialCompleto } from "@/lib/material";
import type { Selo } from "@/lib/catalogo";
import { useApp } from "@/lib/store";
import { imprimirMaterial } from "@/lib/impressao";

export type FichaMaterial = {
  id: string;
  material: MaterialCompleto;
  rotulo?: string;
  autor?: string;
  publicadoEm?: string;
  selo?: Selo;
  /** Materiais do próprio professor podem ser compartilhados ou removidos. */
  doProfessor?: boolean;
};

export function VisualizadorMaterial({
  ficha,
  onClose,
  onRemover,
}: {
  ficha: FichaMaterial | null;
  onClose: () => void;
  onRemover?: (id: string) => void;
}) {
  const {
    user,
    isAdmin,
    favoritos,
    toggleFavorito,
    avaliacoes,
    addAvaliacao,
    registrarDownload,
    registrarEvento,
    downloads,
    curadoria,
    definirSelo,
    publicados,
    togglePublicado,
    removidos,
    toggleRemovido,
  } = useApp();
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");

  if (!ficha) return null;
  const m = ficha.material;
  const tipo = m.origem === "atividade" ? "atividade" : "plano";
  const selo: Selo = curadoria[ficha.id] ?? ficha.selo ?? "nenhum";
  const minhas = avaliacoes.filter((a) => a.materialId === ficha.id);
  const media = minhas.length ? minhas.reduce((s, a) => s + a.nota, 0) / minhas.length : 0;
  const publico = publicados.includes(ficha.id);
  const Documento = tipo === "atividade" ? DocumentoAtividade : DocumentoPlano;

  function baixar() {
    if (!ficha) return;
    registrarDownload(ficha.id);
    registrarEvento({
      tipo: "download",
      materialId: ficha.id,
      disciplina: m.disciplina,
      serie: m.serie,
      formato: tipo,
    });
    imprimirMaterial({
      titulo: m.tema || m.titulo,
      disciplina: m.disciplina,
      serie: m.serie,
      tipo,
    });
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto">
        <DialogHeader className="nao-imprimir">
          <DialogTitle className="flex flex-wrap items-center gap-2">
            {ficha.rotulo && (
              <span className="rounded-md bg-soft px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-blue">
                {ficha.rotulo}
              </span>
            )}
            {m.titulo}
            <SeloCuradoria selo={selo} />
          </DialogTitle>
          <DialogDescription>
            {m.disciplina} · {m.serie} · {m.duracao} · BNCC {m.codigosBNCC}
            {ficha.autor ? ` · ${ficha.autor}` : ""}
            {ficha.publicadoEm
              ? ` · ${new Date(ficha.publicadoEm).toLocaleDateString("pt-BR")}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <LeitorPDF
          material={m}
          professor={user?.nome}
          acoes={
            <>
              <Button size="sm" className="bg-brand text-primary-foreground" onClick={baixar}>
                <Download size={15} /> Baixar PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  registrarEvento({
                    tipo: "edicao",
                    materialId: ficha.id,
                    disciplina: m.disciplina,
                    serie: m.serie,
                    formato: tipo,
                  });
                  toast.success(
                    "A IA registrou este material como base de edição — os próximos materiais seguirão este formato.",
                  );
                }}
              >
                <Sparkles size={15} /> Editar com IA
              </Button>
              <Button
                size="sm"
                variant="outline"
                aria-label="Favoritar material"
                onClick={() => {
                  toggleFavorito(ficha.id);
                  registrarEvento({
                    tipo: "favorito",
                    materialId: ficha.id,
                    disciplina: m.disciplina,
                    serie: m.serie,
                    formato: tipo,
                  });
                }}
              >
                <Heart
                  size={15}
                  className={favoritos.includes(ficha.id) ? "fill-brand-purple text-brand-purple" : ""}
                />
              </Button>
              {ficha.doProfessor && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      togglePublicado(ficha.id);
                      toast.success(
                        publico
                          ? "Material voltou a ser privado."
                          : "Material compartilhado na Biblioteca da Comunidade.",
                      );
                    }}
                  >
                    {publico ? <Globe size={15} /> : <Lock size={15} />}
                    {publico ? "Compartilhado" : "Privado"}
                  </Button>
                  {onRemover && (
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label="Excluir material"
                      onClick={() => {
                        onRemover(ficha.id);
                        onClose();
                      }}
                    >
                      <Trash2 size={15} />
                    </Button>
                  )}
                </>
              )}
            </>
          }
        />

        {isAdmin && (
          <div className="nao-imprimir rounded-2xl border border-dashed border-brand-purple/40 bg-soft p-4">
            <p className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck size={16} className="text-brand-purple" /> Curadoria (administrador)
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["equipe", "Aprovar — Avaliado pela equipe"],
                  ["comunidade", "Destaque da Comunidade"],
                  ["semana", "Seleção da Semana"],
                  ["nenhum", "Remover selo"],
                ] as const
              ).map(([valor, texto]) => (
                <Button
                  key={valor}
                  size="sm"
                  variant={selo === valor ? "default" : "outline"}
                  className={selo === valor ? "bg-brand text-primary-foreground" : ""}
                  onClick={() => {
                    definirSelo(ficha.id, valor);
                    toast.success("Curadoria atualizada.");
                  }}
                >
                  {texto}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toggleRemovido(ficha.id);
                  toast.success(
                    removidos.includes(ficha.id)
                      ? "Material restaurado na biblioteca."
                      : "Material removido da biblioteca.",
                  );
                }}
              >
                {removidos.includes(ficha.id) ? "Restaurar material" : "Remover da biblioteca"}
              </Button>
            </div>
          </div>
        )}

        <div className="nao-imprimir grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
          <div className="rounded-2xl bg-soft p-4">
            <h3 className="text-sm font-semibold">Avalie este material</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Suas notas e comentários ensinam a IA a ajustar enunciados e formatos.
            </p>
            <div className="mt-3">
              <StarRating value={nota} onChange={setNota} />
            </div>
            <Textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="O que funcionou com a sua turma?"
              rows={3}
              className="mt-3 bg-card"
            />
            <Button
              className="mt-3 w-full bg-brand text-primary-foreground"
              onClick={() => {
                addAvaliacao({
                  id: crypto.randomUUID(),
                  materialId: ficha.id,
                  nota,
                  comentario,
                  criadoEm: new Date().toISOString(),
                });
                registrarEvento({
                  tipo: "avaliacao",
                  materialId: ficha.id,
                  disciplina: m.disciplina,
                  serie: m.serie,
                  nota,
                  formato: tipo,
                });
                setComentario("");
                toast.success("Avaliação registrada — obrigado por ensinar a IA!");
              }}
            >
              Enviar avaliação
            </Button>
          </div>

          <div className="rounded-2xl bg-soft p-4">
            <h3 className="text-sm font-semibold">Estatísticas de uso</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Downloads</span>
                <strong>{downloads[ficha.id] ?? 0}</strong>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Avaliações</span>
                <strong>{minhas.length}</strong>
              </p>
              <div className="flex items-center gap-2">
                <StarRating value={media} size={14} />
                <span className="text-xs text-muted-foreground">
                  {minhas.length ? media.toFixed(1) : "sem nota"}
                </span>
              </div>
            </div>
            {minhas.slice(0, 3).map((a) => (
              <p key={a.id} className="mt-2 rounded-xl bg-card p-2 text-xs text-muted-foreground">
                “{a.comentario || "Sem comentário."}”
              </p>
            ))}
          </div>
        </div>

        {/* versão em tamanho real usada só na impressão / PDF */}
        <div className="apenas-impressao">
          <Documento m={m} professor={user?.nome} />
        </div>
      </DialogContent>
    </Dialog>
  );
}