import { Mascote } from "@/components/Mascote";

/** Tela dedicada de carregamento exibida enquanto a IA elabora o material. */
export function TelaCarregamento({
  titulo = "Planejando sua aula com inteligência e inclusão…",
  etapas,
}: {
  titulo?: string;
  etapas?: string[];
}) {
  const passos = etapas ?? [
    "Analisando o conteúdo e o ano/série",
    "Selecionando habilidades da BNCC",
    "Montando a sequência didática",
    "Criando estratégias inclusivas (DUA) e avaliação",
  ];

  return (
    <div className="card-surface nao-imprimir animar-entrada grid min-h-[420px] place-items-center p-10 text-center">
      <div className="w-full max-w-md">
        <div className="mx-auto w-fit animate-pulse">
          <Mascote humor="ideia" size={88} />
        </div>
        <h2 className="mt-6 font-display text-xl font-bold">{titulo}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Isso pode levar alguns instantes. Estamos construindo um material original — nada de
          modelos prontos.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
          <span className="text-xs font-medium text-muted-foreground">Gerando conteúdo…</span>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/3 animate-[carregando_1.4s_ease-in-out_infinite] rounded-full bg-brand" />
        </div>

        <ul className="mt-6 space-y-2 text-left text-sm text-muted-foreground">
          {passos.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-purple" />
              {p}
            </li>
          ))}
        </ul>

        {/* Esqueleto do documento em construção */}
        <div className="mt-8 space-y-3" aria-hidden>
          <div className="h-3 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="h-3 w-full animate-pulse rounded bg-secondary" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-secondary" />
          <div className="h-24 w-full animate-pulse rounded-xl bg-secondary" />
        </div>
      </div>
    </div>
  );
}

