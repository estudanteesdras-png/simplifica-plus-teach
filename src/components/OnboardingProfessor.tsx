import { useState } from "react";
import { toast } from "sonner";

import { Mascote } from "@/components/Mascote";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DISCIPLINAS, SERIES } from "@/lib/data";
import { useApp } from "@/lib/store";

const TIPOS = ["Pública", "Privada"] as const;

/** Cadastro inicial do professor, exibido uma única vez após o login. */
export function OnboardingProfessor() {
  const { user, updateUser } = useApp();
  const [nome, setNome] = useState(user?.nome === "Professor(a)" ? "" : (user?.nome ?? ""));
  const [escola, setEscola] = useState("");
  const [tipo, setTipo] = useState<string>(TIPOS[0]);
  const [disciplina, setDisciplina] = useState<string>(DISCIPLINAS[1] ?? "");
  const [turma, setTurma] = useState<string>(SERIES[4] ?? "");

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !escola.trim()) {
      toast.error("Preencha seu nome e o nome da escola.");
      return;
    }
    updateUser({
      nome: nome.trim(),
      escola: escola.trim(),
      tipoEscola: tipo === "Privada" ? "Privada" : "Pública",
      disciplina,
      turma,
      onboardingOk: true,
    });
    toast.success("Cadastro concluído. Bom planejamento!");
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-navy/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={salvar}
        className="card-surface w-full max-w-lg space-y-4 p-6 shadow-glow"
      >
        <div className="flex items-center gap-3">
          <Mascote humor="escreve" size={48} />
          <div>
            <h2 className="font-display text-lg font-bold">Vamos personalizar sua experiência</h2>
            <p className="text-sm text-muted-foreground">
              Conte um pouco sobre você e sua escola.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ob-nome">Nome</Label>
          <Input
            id="ob-nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como você quer ser chamado(a)?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ob-escola">Nome da escola</Label>
          <Input
            id="ob-escola"
            value={escola}
            onChange={(e) => setEscola(e.target.value)}
            placeholder="Ex.: Escola Municipal João Bento de Paiva"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Tipo de escola</Label>
            <div className="grid grid-cols-2 gap-2">
              {TIPOS.map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={tipo === t ? "default" : "outline"}
                  aria-pressed={tipo === t}
                  onClick={() => setTipo(t)}
                  className={tipo === t ? "bg-brand text-primary-foreground" : ""}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ob-disciplina">Matéria que ensina</Label>
            <Input
              id="ob-disciplina"
              list="ob-disciplinas"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
              placeholder="Digite ou escolha uma matéria"
            />
            <datalist id="ob-disciplinas">
              {DISCIPLINAS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ob-turma">Turma / série</Label>
          <Input
            id="ob-turma"
            list="ob-series"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            placeholder="Digite ou escolha a turma (ex.: 9º ano, 2º ano EM)"
          />
          <datalist id="ob-series">
            {SERIES.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>


        <Button type="submit" className="w-full bg-brand text-primary-foreground shadow-glow">
          Concluir cadastro
        </Button>
      </form>
    </div>
  );
}
