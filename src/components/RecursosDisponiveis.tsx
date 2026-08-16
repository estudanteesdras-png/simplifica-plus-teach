import { Check } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const RECURSOS_DISPONIVEIS = [
  "Quadro e giz/pincel",
  "Caderno e lápis dos alunos",
  "Impressora / cópias",
  "Livro didático",
  "Internet na sala",
  "Projetor / TV",
  "Computadores ou tablets",
  "Celular dos alunos",
  "Material reciclável",
  "Papel, tesoura e cola",
  "Laboratório / sala extra",
  "Pátio ou espaço externo",
] as const;

/** Padrão realista de escola pública: só o essencial vem marcado. */
export const RECURSOS_PADRAO = ["Quadro e giz/pincel", "Caderno e lápis dos alunos"];

export function RecursosDisponiveis({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const alternar = (item: string) =>
    onChange(value.includes(item) ? value.filter((r) => r !== item) : [...value, item]);

  return (
    <div className="space-y-2">
      <Label>O que você tem disponível?</Label>
      <p className="text-[11px] leading-snug text-muted-foreground">
        A IA vai planejar usando somente o que estiver marcado — nada de pedir material que você
        precisaria comprar.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {RECURSOS_DISPONIVEIS.map((item) => {
          const ativo = value.includes(item);
          return (
            <button
              key={item}
              type="button"
              aria-pressed={ativo}
              onClick={() => alternar(item)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                ativo
                  ? "border-transparent bg-brand text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-soft",
              )}
            >
              {ativo && <Check size={11} />}
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
