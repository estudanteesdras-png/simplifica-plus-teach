import type { ReactNode } from "react";

import { Cerebro, type VarianteCerebro } from "@/components/mascotes/Cerebros";

/**
 * Estado vazio ilustrado com o mascote-cérebro do Simplifica+ Tech.
 */
export function EstadoVazio({
  titulo,
  descricao,
  variante = "ideia",
  acao,
}: {
  titulo: string;
  descricao?: string;
  variante?: VarianteCerebro;
  acao?: ReactNode;
}) {
  return (
    <div className="card-surface animar-entrada grid min-h-[280px] place-items-center p-10 text-center">
      <div className="max-w-sm">
        <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-soft">
          <Cerebro variante={variante} size={64} className="animate-[flutuar_3s_ease-in-out_infinite]" />
        </span>
        <h2 className="mt-5 font-display text-lg font-bold">{titulo}</h2>
        {descricao && <p className="mt-2 text-sm text-muted-foreground">{descricao}</p>}
        {acao && <div className="mt-5 flex justify-center">{acao}</div>}
      </div>
    </div>
  );
}
