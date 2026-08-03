import { Cerebro } from "@/components/mascotes/Cerebros";

export type Humor = "escreve" | "ouve" | "investiga" | "ideia";

const MAPA = {
  escreve: "educador",
  ouve: "inclusivo",
  investiga: "pesquisador",
  ideia: "ideia",
} as const;

/** Mascote-cérebro do Simplifica+ Tech (SVG, sem fundo branco). */
export function Mascote({
  humor = "ideia",
  size = 40,
  className = "",
}: {
  humor?: Humor;
  size?: number;
  className?: string;
}) {
  return <Cerebro variante={MAPA[humor]} size={size} className={className} />;
}
