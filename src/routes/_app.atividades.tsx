import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { ClipboardList, Heart, Printer, Save, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { BarraDownload } from "@/components/BarraDownload";
import { Mascote } from "@/components/Mascote";
import { PageHeader } from "@/components/PageHeader";
import { Selecao } from "@/components/Selecao";
import { TelaCarregamento } from "@/components/TelaCarregamento";
import { DocumentoAtividade } from "@/components/material/DocumentoMaterial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ADAPTACOES, DISCIPLINAS, SERIES } from "@/lib/data";
import { calcularPerfil } from "@/lib/aprendizado";
import { aplicarQuestoes } from "@/lib/aplicar-ia";
import { gerarQuestoes } from "@/lib/questoes.functions";
import { gerarMaterialCompleto, type MaterialCompleto } from "@/lib/material";
import { useApp } from "@/lib/store";
import { imprimirMaterial } from "@/lib/impressao";

export const Route = createFileRoute("/_app/atividades")({
  head: () => ({
    meta: [
      { title: "Criar atividades para imprimir — Simplifica+ Tech" },
      {
        name: "description",
        content:
          "Folhas de atividade completas com questões objetivas, discursivas, práticas e desafio, gabarito comentado e versão adaptada TEA/TDAH/DI.",
      },
      { property: "og:title", content: "Criar atividades para imprimir — Simplifica+ Tech" },
      {
        property: "og:description",
        content: "Atividades prontas para a sala de aula, com espaço de resposta e gabarito separado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Atividades,
});

function Atividades() {
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
    duracao: "50 minutos",
  });
  const [adaptacao, setAdaptacao] = useState(perfil.adaptacaoPreferida ?? ADAPTACOES[1]);
  const [objetivo, setObjetivo] = useState("");
  const [gerando, setGerando] = useState(false);
  const [atividade, setAtividade] = useState<MaterialCompleto | null>(null);
  const criarQuestoes = useServerFn(gerarQuestoes);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function gerar() {
    if (!form.tema.trim()) {
      toast.error("Informe o conteúdo da atividade.");
      return;
    }
    setGerando(true);

    setAtividade(null);

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
      adaptacao,
      formato: "atividade",
    });

    let final: MaterialCompleto | null = null;
    try {
      const conjunto = await criarQuestoes({
        data: {
          disciplina: form.disciplina,
          serie: form.serie,
          conteudo: form.tema,
          objetivo,
          adaptacao,
        },
      });
      final = aplicarQuestoes(base, conjunto);
      setAtividade(final);
      toast.success("Questões da IA aplicadas com gabarito e resolução comentada.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível falar com a IA agora.");
    } finally {
      if (final) addMaterial({ ...final, origem: "atividade" });
      setGerando(false);
    }
  }

  const favorito = atividade ? favoritos.includes(atividade.id) : false;


  const totalQuestoes = atividade
    ? atividade.atividade.blocos.reduce((s, b) => s + b.questoes.length, 0)
    : 0;

  return (
    <div>
      <div className="nao-imprimir">
        <PageHeader
          title="Criar atividades"
          subtitle="Folha do aluno com blocos organizados, espaço para resposta, gabarito comentado em folha separada e versão adaptada."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="nao-imprimir space-y-4">
          <div className="card-surface space-y-4 p-5">
            <div className="flex items-center gap-3">
              <Mascote humor="ideia" size={44} />
              <p className="text-sm font-semibold">Atividade pronta para imprimir</p>
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
              <Label>Conteúdo / tema</Label>
              <Input
                value={form.tema}
                onChange={(e) => set("tema")(e.target.value)}
                placeholder="Ex.: Frações no dia a dia"
              />
            </div>
            <div className="space-y-2">
              <Label>Foco de adaptação</Label>
              <Selecao value={adaptacao} onChange={setAdaptacao} options={ADAPTACOES} />
            </div>
            <div className="space-y-2">
              <Label>Objetivo específico (opcional)</Label>
              <Textarea
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                rows={3}
                placeholder="O que a turma precisa praticar nesta folha?"
              />
            </div>

            <Button
              onClick={gerar}
              disabled={gerando}
              className="w-full bg-brand text-primary-foreground shadow-glow"
            >
              <Wand2 size={16} />{" "}
              {gerando ? "Elaborando questões com a IA…" : "Gerar atividade completa"}
            </Button>

            {atividade && (
              <div className="flex flex-col gap-2 border-t pt-4">
                <Button variant="outline" onClick={baixarAtividade}>
                  <Printer size={16} /> Baixar PDF / imprimir
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    addMaterial({ ...atividade, origem: "atividade" });
                    registrarEvento({
                      tipo: "salvo",
                      materialId: atividade.id,
                      disciplina: atividade.disciplina,
                      serie: atividade.serie,
                      adaptacao,
                      formato: "atividade",
                    });
                    toast.success("Atividade salva no seu acervo.");
                  }}
                >
                  <Save size={16} /> Salvar no acervo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toggleFavorito(atividade.id);
                    registrarEvento({
                      tipo: "favorito",
                      materialId: atividade.id,
                      disciplina: atividade.disciplina,
                      serie: atividade.serie,
                      adaptacao,
                      formato: "atividade",
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
              {atividade
                ? `${totalQuestoes} questões distribuídas em ${atividade.atividade.blocos.length} blocos + gabarito e versão adaptada.`
                : "Cada folha sai com blocos objetivos, de desenvolvimento, prática e desafio, além de gabarito comentado e versão adaptada."}{" "}
              Acervo: {materiais.length} material(is).
            </p>
          </div>

          <div className="card-surface space-y-2 p-5">
            <div className="flex items-center gap-2">
              <Mascote humor="ouve" size={28} />
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
              titulo="Planejando sua aula com inteligência e inclusão…"
              etapas={[
                "Interpretando o conteúdo e o ano/série",
                "Escrevendo questões objetivas, V/F, discursivas e contextualizadas",
                "Elaborando gabarito e resolução comentada",
                "Ajustando a versão adaptada para inclusão",
              ]}
            />
          ) : !atividade ? (
            <div className="card-surface nao-imprimir grid min-h-64 place-items-center p-8 text-center text-sm text-muted-foreground">
              <p className="max-w-md">
                <ClipboardList className="mx-auto mb-3 text-brand-purple" />
                Preencha os dados ao lado para gerar a folha do aluno completa, com todas as questões
                escritas, espaço de resposta, gabarito comentado e versão adaptada.
              </p>
            </div>
          ) : (
            <div className="doc-scroll overflow-x-auto">
              <DocumentoAtividade m={atividade} professor={user?.nome} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
