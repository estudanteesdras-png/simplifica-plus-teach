import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DocumentoAtividade, DocumentoPlano } from "./DocumentoMaterial";
import type { MaterialCompleto } from "@/lib/material";

const LARGURA_PAGINA = 794; // 210mm @96dpi

/** Leitor estilo PDF: miniaturas, zoom, navegação por página e ações. */
export function LeitorPDF({
  material,
  professor,
  acoes,
}: {
  material: MaterialCompleto;
  professor?: string;
  acoes?: ReactNode;
}) {
  const [zoom, setZoom] = useState(0.62);
  const [tops, setTops] = useState<number[]>([]);
  const [altura, setAltura] = useState(0);
  const [atual, setAtual] = useState(0);
  const docRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const Documento = material.origem === "atividade" ? DocumentoAtividade : DocumentoPlano;

  useLayoutEffect(() => {
    const root = docRef.current;
    if (!root) return;
    const medir = () => {
      const base = root.getBoundingClientRect().top;
      const folhas = Array.from(root.querySelectorAll<HTMLElement>(".doc-folha"));
      setTops(folhas.map((f) => f.getBoundingClientRect().top - base));
      setAltura(root.scrollHeight);
    };
    medir();
    const t = window.setTimeout(medir, 300);
    return () => window.clearTimeout(t);
  }, [material]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || tops.length === 0) return;
    const onScroll = () => {
      const y = el.scrollTop / zoom + 40;
      let i = 0;
      tops.forEach((t, idx) => {
        if (y >= t) i = idx;
      });
      setAtual(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [tops, zoom]);

  function irPara(i: number) {
    const el = scrollRef.current;
    if (!el || !tops[i]) return void (el && (el.scrollTop = 0));
    el.scrollTo({ top: tops[i] * zoom, behavior: "smooth" });
  }

  const escalaMini = 104 / LARGURA_PAGINA;

  return (
    <div className="nao-imprimir overflow-hidden rounded-2xl border border-border bg-soft">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card px-3 py-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Página anterior"
            onClick={() => irPara(Math.max(0, atual - 1))}
          >
            <ChevronLeft size={18} />
          </Button>
          <span className="text-xs font-semibold tabular-nums">
            {atual + 1} / {Math.max(tops.length, 1)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Próxima página"
            onClick={() => irPara(Math.min(tops.length - 1, atual + 1))}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Reduzir zoom"
            onClick={() => setZoom((z) => Math.max(0.3, +(z - 0.12).toFixed(2)))}
          >
            <ZoomOut size={18} />
          </Button>
          <span className="w-12 text-center text-xs font-semibold tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ampliar zoom"
            onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.12).toFixed(2)))}
          >
            <ZoomIn size={18} />
          </Button>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">{acoes}</div>
      </div>

      <div className="grid grid-cols-[auto_minmax(0,1fr)]">
        <aside className="hidden max-h-[62vh] w-[132px] shrink-0 overflow-y-auto border-r border-border bg-card p-3 sm:block">
          {tops.map((t, i) => (
            <button
              key={i}
              onClick={() => irPara(i)}
              aria-label={`Ir para a página ${i + 1}`}
              className={`mb-3 block w-full overflow-hidden rounded-lg border-2 bg-white transition-colors ${
                atual === i ? "border-brand-purple" : "border-border"
              }`}
              style={{ height: 104 * 1.414 }}
            >
              <div className="pointer-events-none relative h-full w-full overflow-hidden">
                <div
                  style={{
                    width: LARGURA_PAGINA,
                    transform: `scale(${escalaMini}) translateY(${-t}px)`,
                    transformOrigin: "top left",
                  }}
                >
                  <Documento m={material} professor={professor} />
                </div>
              </div>
              <span className="sr-only">Página {i + 1}</span>
            </button>
          ))}
        </aside>

        <div ref={scrollRef} className="doc-scroll max-h-[62vh] overflow-auto p-4">
          <div style={{ height: altura * zoom, width: LARGURA_PAGINA * zoom }}>
            <div
              ref={docRef}
              style={{ width: LARGURA_PAGINA, transform: `scale(${zoom})`, transformOrigin: "top left" }}
            >
              <Documento m={material} professor={professor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}