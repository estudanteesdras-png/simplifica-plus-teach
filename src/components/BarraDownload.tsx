import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  /** Texto do material (tema ou título) usado no nome do arquivo. */
  titulo: string;
  onDownload: () => void;
  descricao?: string;
};

/**
 * Faixa de destaque exibida logo acima do material gerado, com o botão
 * de download direto em PDF bem visível.
 */
export function BarraDownload({ titulo, onDownload, descricao }: Props) {
  return (
    <div className="nao-imprimir card-surface flex flex-col gap-3 border-brand-purple/30 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold">{titulo}</p>
        <p className="text-xs text-muted-foreground">
          {descricao ?? "Pronto! Baixe agora em PDF, limpo e organizado para impressão."}
        </p>
      </div>
      <Button
        onClick={onDownload}
        size="lg"
        className="shrink-0 bg-brand text-primary-foreground shadow-glow"
      >
        <Download size={18} /> Baixar PDF agora
      </Button>
    </div>
  );
}
