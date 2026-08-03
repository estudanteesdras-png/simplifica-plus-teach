export type VarianteCerebro = "educador" | "pesquisador" | "inclusivo" | "ideia";

const LEGENDA: Record<VarianteCerebro, string> = {
  educador: "Cérebro Educador do Simplifica+ Tech, com chapéu de formatura",
  pesquisador: "Cérebro Pesquisador do Simplifica+ Tech, com lupa",
  inclusivo: "Cérebro Inclusivo do Simplifica+ Tech, com coração",
  ideia: "Cérebro do Simplifica+ Tech com uma ideia",
};

function CorpoCerebro() {
  return (
    <>
      <path
        d="M32 12c-5 0-8.6 2.4-9.9 5.6C17 17.3 13 20.6 13 25c0 1.7.6 3.2 1.6 4.4C12.6 30.8 11.4 33 11.4 35.5c0 2.9 1.6 5.4 4 6.7-.3.8-.4 1.7-.4 2.6 0 4.3 3.7 7.7 8.3 7.7 2.6 0 4.9-1.1 6.4-2.8V12.6c-.6-.4-1.2-.6-1.7-.6z"
        fill="url(#cerebroA)"
      />
      <path
        d="M32 12c5 0 8.6 2.4 9.9 5.6C47 17.3 51 20.6 51 25c0 1.7-.6 3.2-1.6 4.4 2 1.4 3.2 3.6 3.2 6.1 0 2.9-1.6 5.4-4 6.7.3.8.4 1.7.4 2.6 0 4.3-3.7 7.7-8.3 7.7-2.6 0-4.9-1.1-6.4-2.8V12.6c.6-.4 1.2-.6 1.7-.6z"
        fill="url(#cerebroB)"
      />
      <g stroke="rgba(255,255,255,.75)" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M32 16v34" />
        <path d="M26 22c-3 .6-4.6 2.6-4.4 5.2M24 34c-2.6.5-4.2 2.3-4 4.7M27 44c-2.4-.3-4-1.6-4.4-3.6" />
        <path d="M38 22c3 .6 4.6 2.6 4.4 5.2M40 34c2.6.5 4.2 2.3 4 4.7M37 44c2.4-.3 4-1.6 4.4-3.6" />
      </g>
      {/* rosto amigável */}
      <circle cx="27" cy="31" r="2" fill="#0f1638" />
      <circle cx="37" cy="31" r="2" fill="#0f1638" />
      <path
        d="M27.5 37c1.4 1.6 3.2 2.4 4.9 2.4s3.4-.8 4.6-2.4"
        stroke="#0f1638"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

/**
 * Mascotes-cérebro do Simplifica+ Tech em SVG puro — fundo transparente,
 * misturando-se suavemente a qualquer superfície da interface.
 */
export function Cerebro({
  variante = "ideia",
  size = 40,
  className = "",
}: {
  variante?: VarianteCerebro;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={LEGENDA[variante]}
      className={`inline-block shrink-0 align-middle ${className}`}
    >
      <defs>
        <linearGradient id="cerebroA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6d8cff" />
          <stop offset="100%" stopColor="#2a54c8" />
        </linearGradient>
        <linearGradient id="cerebroB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a978ff" />
          <stop offset="100%" stopColor="#5b34d6" />
        </linearGradient>
      </defs>

      <CorpoCerebro />

      {variante === "educador" && (
        <g>
          <path d="M32 4 48 11l-16 7-16-7 16-7z" fill="#1e2a6e" />
          <path d="M40 14.5V21c0 2.2-3.6 3.6-8 3.6S24 23.2 24 21v-6.5l8 3.5 8-3.5z" fill="#111c4e" />
          <path d="M47 11.5v7" stroke="#7c3aed" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="47" cy="19.5" r="1.8" fill="#7c3aed" />
        </g>
      )}

      {variante === "pesquisador" && (
        <g>
          <circle
            cx="45"
            cy="45"
            r="8"
            fill="rgba(124,58,237,.15)"
            stroke="#7c3aed"
            strokeWidth="3"
          />
          <path d="M51 51l7 7" stroke="#1e2a6e" strokeWidth="4" strokeLinecap="round" />
          <path d="M41 43a5 5 0 0 1 4-3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </g>
      )}

      {variante === "inclusivo" && (
        <g>
          <path
            d="M47 40c2.4-2.4 6.2-2.4 8.5 0 2.3 2.4 2.3 6.3 0 8.7L47 57.5l-8.5-8.8c-2.3-2.4-2.3-6.3 0-8.7 2.3-2.4 6.1-2.4 8.5 0z"
            fill="#ec4899"
          />
          <path d="M16 8h4M18 6v4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {variante === "ideia" && (
        <g>
          <path
            d="M32 2c-4.4 0-8 3.5-8 7.9 0 2.7 1.4 4.6 2.8 6.1h10.4c1.4-1.5 2.8-3.4 2.8-6.1C40 5.5 36.4 2 32 2z"
            fill="#fbbf24"
          />
          <path d="M28 18h8" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export const CerebroEducador = (p: { size?: number; className?: string }) => (
  <Cerebro variante="educador" {...p} />
);
export const CerebroPesquisador = (p: { size?: number; className?: string }) => (
  <Cerebro variante="pesquisador" {...p} />
);
export const CerebroInclusivo = (p: { size?: number; className?: string }) => (
  <Cerebro variante="inclusivo" {...p} />
);
