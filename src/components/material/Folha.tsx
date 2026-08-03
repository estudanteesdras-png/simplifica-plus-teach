import type { ReactNode } from "react";
import { Cerebro } from "@/components/mascotes/Cerebros";

export function Folha({
  etiqueta,
  titulo,
  subtitulo,
  variante = "azul",
  pagina,
  totalPaginas,
  children,
  semCabecalho = false,
}: {
  etiqueta?: string;
  titulo?: string;
  subtitulo?: string;
  variante?: "azul" | "roxo" | "escuro";
  pagina: number;
  totalPaginas: number;
  children: ReactNode;
  semCabecalho?: boolean;
}) {
  const faixa =
    variante === "roxo"
      ? "from-[#4338ca] via-[#5b34d6] to-[#7c3aed]"
      : variante === "escuro"
        ? "from-[#111c4e] via-[#1e2a6e] to-[#3b2a8c]"
        : "from-[#1e2a6e] via-[#2a54c8] to-[#7c3aed]";

  return (
    <section className="doc-folha">
      {!semCabecalho && (
        <header className={`doc-faixa bg-gradient-to-r ${faixa}`}>
          <Cerebro variante="ideia" size={46} className="doc-logo" />
          <div className="min-w-0">
            {etiqueta && <span className="doc-etiqueta">{etiqueta}</span>}
            {titulo && <h2 className="doc-titulo">{titulo}</h2>}
            {subtitulo && <p className="doc-subtitulo">{subtitulo}</p>}
          </div>
        </header>
      )}
      <div className="doc-corpo">{children}</div>
      <footer className="doc-rodape">
        <span>Simplifica+ Tech Educacional • Material Pedagógico Exclusivo</span>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
      </footer>
    </section>
  );
}

export function SecaoNumerada({
  numero,
  titulo,
  children,
}: {
  numero: string;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-secao">
      <h3 className="doc-secao-titulo">
        <span className="doc-secao-barra" />
        {numero}. {titulo}
      </h3>
      {children}
    </section>
  );
}

export function Caixa({
  titulo,
  cor = "azul",
  children,
}: {
  titulo?: string;
  cor?: "azul" | "roxo" | "neutra";
  children: ReactNode;
}) {
  return (
    <div className={`doc-caixa doc-caixa-${cor}`}>
      {titulo && <p className="doc-caixa-titulo">{titulo}</p>}
      {children}
    </div>
  );
}

export function Linhas({ quantidade }: { quantidade: number }) {
  return (
    <div className="doc-linhas">
      {Array.from({ length: quantidade }).map((_, i) => (
        <span key={i} className="doc-linha" />
      ))}
    </div>
  );
}
