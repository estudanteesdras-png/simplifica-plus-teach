import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Heart, Layers, Printer, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { BarraDownload } from "@/components/BarraDownload";
import { Mascote } from "@/components/Mascote";
import { PageHeader } from "@/components/PageHeader";
import { RECURSOS_PADRAO, RecursosDisponiveis } from "@/components/RecursosDisponiveis";
import { Selecao } from "@/components/Selecao";
import { TelaCarregamento } from "@/components/TelaCarregamento";
import { DocumentoSequencia } from "@/components/material/DocumentoSequencia";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DISCIPLINAS, SERIES } from "@/lib/data";
import { calcularPerfil } from "@/lib/aprendizado";
import { aplicarSequencia } from "@/lib/aplicar-ia";
import { gerarSequencia } from "@/lib/sequencia.functions";
import type { SequenciaDidatica } from "@/lib/material";
import { useApp } from "@/lib/store";
import { imprimirMaterial } from "@/lib/impressao";

const QUANTIDADES = ["3 aulas", "4 aulas", "5 aulas"];

export const Route = createFileRoute("/_app/sequencias")({
  head: () => ({
    meta: [
      { title: "Sequência didática completa — Simplifica+ Tech" },
      {
        name: "description",
        content:
          "Gere de 3 a 5 aulas encadeadas sobre o mesmo tema, com progressão pedagógica, BNCC e adaptação inclusiva.",
      },
      { property: "og:title", content: "Sequência didática completa — Simplifica+ Tech" },
      {
        property: "og:description",
        content: "Planeje a semana inteira de uma vez só, com aulas introdutórias, práticas e de avaliação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sequencias,
});

function Sequencias() {
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
    quantidade: QUANTIDADES[1],
  });
  const [adaptacao, setAdaptacao] = useState(perfil.adaptacaoPreferida ?? "Sem adaptação");
  const [objetivo, setObjetivo] = useState("");
  const [recursos, setRecursos] = useState<string[]>(RECURSOS_PADRAO);
  const [gerando, setGerando] = useState(false);
  const [sequencia, setSequencia] = useState<SequenciaDidatica | null>(null);
  const criarSequencia = useServerFn(gerarSequencia);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function gerar() {
    if (!form.tema.trim()) {
      toast.error("Informe o tema da sequência didática.");
      return;
    }
    setGerando(true);
    setSequencia(null);

    const quantidadeAulas = form.quantidade.startsWith("3") ? 3 : form.quantidade.startsWith("5") ? 5 : 4;

    registrarEvento({
      tipo: "geracao",
      disciplina: form.disciplina,
      serie: form.serie,
      adaptacao,
      formato: "sequencia",
    });

    let final: SequenciaDidatica | null = null;
    try {
      const resposta = await criarSequencia({
        data: {
          disciplina: form.disciplina,
          serie: form.serie,
          conteudo: form.tema,
          objetivo,
          adaptacao,
          recursos,
          quantidadeAulas,
        },
      });
      final = aplicarSequencia(
        {
          disciplina: form.disciplina,
          serie: form.serie,
          tema: form.tema,
          adaptacao,
          professor: user?.nome,
        },
        resposta,
      );
      setSequencia(final);
      toast.success(`${final.aulas.length} aulas geradas com progressão pedagógica.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível falar com a IA agora.");
    } finally {
      if (final) {
        final.aulas.forEach((a) => addMaterial({ ...a.material, origem: "sequencia" }));
      }
      setGerando(false);
    }
  }

  function baixarSequencia() {
    if (!sequencia) return;
    registrarDownload(sequencia.id);
    registrarEvento({
      tipo: "download",
      materialId: sequencia.id,
      disciplina: sequencia.disciplina,
      serie: sequencia.serie,
      formato: "sequencia",
    });
    imprimirMaterial({
      titulo: sequencia.tema || sequencia.titulo,
      disciplina: sequencia.disciplina,
      serie: sequencia.serie,
      tipo: "sequencia",
    });
  }

  const favorito = sequencia ? favoritos.includes(sequencia.id) : false;

  return (
    <div>
      <div className="nao-imprimir">
        <PageHeader
          title="Sequência didática"
          subtitle="Planeje de 3 a 5 aulas encadeadas sobre o mesmo tema: introdução, prática/avaliação formativa e sistematização."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="nao-imprimir space-y-4">
          <div className="card-surface space-y-4 p-5">
            <div className="flex items-center gap-3">
              <Mascote humor="ideia" size={44} />
              <p className="text-sm font-semibold">Planeje a semana inteira de uma vez</p>
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
              <Label>Tema geral da sequência</Label>
              <Input
                value={form.tema}
                onChange={(e) => set("tema")(e.target.value)}
                placeholder="Ex.: Ciclo da água"
              />
            </div>
            <div className="space-y-2">
              <Label>Número de aulas</Label>
              <Selecao value={form.quantidade} onChange={set("quantidade")} options={QUANTIDADES} />
            </div>
            <div className="space-y-2">
              <Label>Foco de adaptação inclusiva</Label>
              <Selecao value={adaptacao} onChange={setAdaptacao} options={["Sem adaptação", "TEA", "TDAH", "Deficiência intelectual", "Deficiência visual"]} />
            </div>
            <div className="space-y-2">
              <Label>Objetivo geral (opcional)</Label>
              <Textarea
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                rows={3}
                placeholder="O que a turma precisa aprender ao longo dessa sequência?"
              />
            </div>

            <Button
              onClick={gerar}
              disabled={gerando}
              className="w-full bg-brand text-primary-foreground shadow-glow"
            >
              <Sparkles size={16} />{" "}
              {gerando ? "Elaborando sequência didática…" : "Gerar sequência completa"}
            </Button>

            {sequencia && !gerando && (
              <div className="flex flex-col gap-2 border-t pt-4">
                <Button variant="outline" onClick={baixarSequencia}>
                  <Printer size={16} /> Baixar PDF / imprimir sequência
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    sequencia.aulas.forEach((a) =>
                      addMaterial({ ...a.material, origem: "sequencia" }),
                    );
                    registrarEvento({
                      tipo: "salvo",
                      materialId: sequencia.id,
                      disciplina: sequencia.disciplina,
                      serie: sequencia.serie,
                      formato: "sequencia",
                    });
                    toast.success("Sequência salva no seu acervo.");
                  }}
                >
                  <Save size={16} /> Salvar no acervo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toggleFavorito(sequencia.id);
                    sequencia.aulas.forEach((a) => {
                      if (favoritos.includes(a.material.id) === favorito) {
                        toggleFavorito(a.material.id);
                      }
                    });
                    registrarEvento({
                      tipo: "favorito",
                      materialId: sequencia.id,
                      disciplina: sequencia.disciplina,
                      serie: sequencia.serie,
                      formato: "sequencia",
                    });
                  }}
                >
                  <Heart
                    size={16}
                    className={favorito ? "fill-brand-purple text-brand-purple" : ""}
                  />{" "}
                  {favorito ? "Nos favoritos" : "Favoritar"}
                </Button>
              </div>
            )}

            <p className="rounded-xl bg-soft p-3 text-xs text-muted-foreground">
              {sequencia
                ? `${sequencia.aulas.length} aulas geradas com progressão pedagógica e adaptação inclusiva.`
                : "Cada sequência inclui capa geral + uma folha dupla por aula, com cronograma, inclusão e avaliação."}{" "}
              Acervo: {materiais.length} material(is).
            </p>
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
          </div>
        </div>

        <div className="min-w-0">
          {gerando ? (
            <TelaCarregamento
              titulo="Planejando sua sequência didática…"
              etapas={[
                "Interpretando o tema, a série e o objetivo geral",
                "Organizando a progressão: introdução → prática → avaliação",
                "Escrevendo objetivos, recursos e estratégias inclusivas por aula",
                "Montando o cronograma detalhado e o alinhamento BNCC",
              ]}
            />
          ) : !sequencia ? (
            <div className="card-surface nao-imprimir grid min-h-64 place-items-center p-8 text-center text-sm text-muted-foreground">
              <p className="max-w-md">
                <Layers className="mx-auto mb-3 text-brand-purple" />
                Preencha os dados ao lado para gerar a sequência completa. Você receberá uma capa geral
                mais uma folha dupla para cada aula, pronta para impressão.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <BarraDownload
                titulo={sequencia.tema || sequencia.titulo}
                onDownload={baixarSequencia}
                descricao="Sequência pronta! Baixe todas as aulas em um único PDF organizado."
              />
              <div className="doc-scroll overflow-x-auto">
                <DocumentoSequencia s={sequencia} professor={user?.nome} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
