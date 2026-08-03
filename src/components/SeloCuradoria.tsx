import type { Selo } from "@/lib/catalogo";

const INFO: Record<Exclude<Selo, "nenhum">, { texto: string; classe: string; ponto: string }> = {
  equipe: {
    texto: "Avaliado pela equipe",
    classe: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    ponto: "bg-emerald-500",
  },
  comunidade: {
    texto: "Destaque da Comunidade",
    classe: "bg-brand-purple/12 text-brand-purple",
    ponto: "bg-brand-purple",
  },
  semana: {
    texto: "Seleção da Semana",
    classe: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    ponto: "bg-amber-500",
  },
};

export function SeloCuradoria({ selo, compacto = false }: { selo: Selo; compacto?: boolean }) {
  if (selo === "nenhum") return null;
  const info = INFO[selo];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${info.classe}`}
    >
      <span className={`h-2 w-2 rounded-full ${info.ponto}`} />
      {compacto ? info.texto.split(" ")[0] : info.texto}
    </span>
  );
}