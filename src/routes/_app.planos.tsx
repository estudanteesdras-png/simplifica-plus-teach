import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Heart, NotebookPen, Printer, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Mascote } from "@/components/Mascote";
import { PageHeader } from "@/components/PageHeader";
import { Selecao } from "@/components/Selecao";
import { TelaCarregamento } from "@/components/TelaCarregamento";
import { DocumentoPlano } from "@/components/material/DocumentoMaterial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DISCIPLINAS, DURACOES, SERIES } from "@/lib/data";
import { calcularPerfil } from "@/lib/aprendizado";
import { aplicarBlueprint } from "@/lib/aplicar-ia";
import { gerarBlueprint } from "@/lib/blueprint.functions";
import { gerarMaterialCompleto, type MaterialCompleto } from "@/lib/material";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/planos")({
  head: () => ({
    meta: [
      { title: "Planos de aula profissionais — Simplifica+ Tech" },
      {
        name: "description",
        content:
          "Gere planos de aula completos com BNCC, objetivos, cronograma por etapas, estratégias inclusivas e avaliação, prontos para imprimir.",
      },
      { property: "og:title", content: "Planos de aula profissionais — Simplifica+ Tech" },
      {
        property: "og:description",
        content: "Planejamento docente com padrão editorial premium e alinhamento à BNCC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Planos,
});

function Planos() {
  const {
    user,
    addMaterial,
    materiais,
    favoritos,
    toggleFavorito,
    eventos,
    avaliacoes,
    registrarEvento,
    registrarDownload,
  } = useApp();
  const perfil = useMemo(() => calcularPerfil(eventos, avaliacoes), [eventos, avaliacoes]);

  const [form, setForm] = useState({
    disciplina: perfil.disciplinaPreferida ?? DISCIPLINAS[1],
    serie: perfil.seriePreferida ?? SERIES[4],
    tema: "",
    duracao: DURACOES[1],
  });
  const [objetivo, setObjetivo] = useState("");
  const [gerando, setGerando] = useState(false);
  const [plano, setPlano] = useState<MaterialCompleto | null>(null);
  const criarBlueprint = useServerFn(gerarBlueprint);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function gerar() {
    if (!form.tema.trim()) {
      toast.error("Informe o tema da aula.");
      return;
    }
    setGerando(true);

    setPlano(null);

    const base = gerarMaterialCompleto({
      ...form,
      objetivoProfessor: objetivo,
      professor: user?.nome,
    });
    registrarEvento({
      tipo: "geracao",
      materialId: base.id,
      disciplina: form.disciplina,
      serie: form.serie,
      formato: "plano",
    });

    let final: MaterialCompleto | null = null;
    try {
      const bp = await criarBlueprint({
        data: {
          disciplina: form.disciplina,
          serie: form.serie,
          conteudo: form.tema,
          duracao: form.duracao,
          metodologia: objetivo,
          dua: perfil.adaptacaoPreferida ?? "",
        },
      });
      final = aplicarBlueprint(base, bp);
      setPlano(final);
      toast.success("Plano preenchido com o Blueprint Pedagógico da IA.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível falar com a IA agora.");
    } finally {
      if (final) addMaterial({ ...final, origem: "plano" });
      setGerando(false);
    }
  }

  const planosSalvos = materiais.filter((m) => m.origem !== "atividade").length;
  const favorito = plano ? favoritos.includes(plano.id) : false;

  return (
    <div>
      <div className="nao-imprimir">
        <PageHeader
          title="Planos de aula"
          subtitle="Planejamento docente completo: BNCC, objetivos, cronograma por etapas, perguntas mediadoras, inclusão e avaliação."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="nao-imprimir space-y-4">
          <div className="card-surface space-y-4 p-5">
            <div className="flex items-center gap-3">
              <Mascote humor="escreve" size={44} />
              <p className="text-sm font-semibold">Monte a aula desta semana</p>
            </div>
            <div className="space-y-2">
              <Label>Componente curricular</Label>
              <Selecao value={form.disciplina} onChange={set("disciplina")} options={DISCIPLINAS} />
            </div>
            <div className="space-y-2">
              <Label>Ano / série</Label>
              <Selecao value={form.serie} onChange={set("serie")} options={SERIES} />
            </div>
            <div className="space-y-2">
              <Label>Tema da aula</Label>
              <Input
                value={form.tema}
                onChange={(e) => set("tema")(e.target.value)}
                placeholder="Ex.: Ciclo da água"
              />
            </div>
            <div className="space-y-2">
              <Label>Duração</Label>
              <Selecao value={form.duracao} onChange={set("duracao")} options={DURACOES} />
            </div>
            <div className="space-y-2">
              <Label>Objetivo específico (opcional)</Label>
              <Textarea
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                rows={3}
                placeholder="O que a turma precisa aprender nesta aula?"
              />
            </div>

            <Button
              onClick={gerar}
              disabled={gerando}
              className="w-full bg-brand text-primary-foreground shadow-glow"
            >
              <Sparkles size={16} />{" "}
              {gerando ? "Elaborando Blueprint Pedagógico…" : "Gerar plano de aula"}
            </Button>

            {plano && !gerando && (
              <div className="flex flex-col gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    registrarDownload(plano.id);
                    registrarEvento({
                      tipo: "download",
                      materialId: plano.id,
                      disciplina: plano.disciplina,
                      serie: plano.serie,
                      formato: "plano",
                    });
                    window.print();
                  }}
                >
                  <Printer size={16} /> Baixar PDF / imprimir
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    addMaterial({ ...plano, origem: "plano" });
                    registrarEvento({
                      tipo: "salvo",
                      materialId: plano.id,
                      disciplina: plano.disciplina,
                      serie: plano.serie,
                      formato: "plano",
                    });
                    toast.success("Plano salvo no seu acervo.");
                  }}
                >
                  <Save size={16} /> Salvar no acervo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toggleFavorito(plano.id);
                    registrarEvento({
                      tipo: "favorito",
                      materialId: plano.id,
                      disciplina: plano.disciplina,
                      serie: plano.serie,
                      formato: "plano",
                    });
                  }}
                >
                  <Heart
                    size={16}
                    className={favorito ? "fill-brand-purple text-brand-purple" : ""}
                  />{" "}
                  {favorito ? "Favoritado" : "Favoritar"}
                </Button>
              </div>
            )}
          </div>

          <div className="card-surface space-y-2 p-5">
            <div className="flex items-center gap-2">
              <Mascote humor="investiga" size={28} />
              <p className="text-sm font-bold">A IA aprendeu com você</p>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {(perfil.insights.length ? perfil.insights : perfil.recomendacoes)
                .slice(0, 4)
                .map((i) => (
                  <li key={i}>• {i}</li>
                ))}
            </ul>
            <p className="pt-1 text-[11px] text-muted-foreground">
              {planosSalvos} plano(s) no acervo · {perfil.totalSinais} sinais de uso analisados.
            </p>
          </div>
        </div>

        <div className="min-w-0">
          {gerando ? (
            <TelaCarregamento />
          ) : !plano ? (
            <div className="card-surface nao-imprimir grid min-h-64 place-items-center p-8 text-center text-sm text-muted-foreground">
              <p className="max-w-md">
                <NotebookPen className="mx-auto mb-3 text-brand-purple" />
                Preencha os dados ao lado para receber um plano de aula em duas páginas, com ficha
                técnica BNCC, cronograma por etapas e estratégias inclusivas.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="doc-scroll overflow-x-auto">
                <DocumentoPlano m={plano} professor={user?.nome} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
