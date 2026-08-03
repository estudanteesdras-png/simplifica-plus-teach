import { toast } from "sonner";

/** Remove acentos, pontuação e espaços, deixando o texto seguro para nome de arquivo. */
function limpar(texto: string) {
  return (texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
}

export type DadosImpressao = {
  /** Título/tema do material. */
  titulo: string;
  disciplina: string;
  serie: string;
  /** Prefixo do arquivo: Plano, Atividade, Sequencia. */
  tipo?: "plano" | "atividade" | "sequencia";
};

const PREFIXO = {
  plano: "Plano",
  atividade: "Atividade",
  sequencia: "Sequencia",
} as const;

/** Monta o nome amigável do arquivo: Plano_Tema_Materia_Serie */
export function nomeArquivo({ titulo, disciplina, serie, tipo = "plano" }: DadosImpressao) {
  return [PREFIXO[tipo], limpar(titulo), limpar(disciplina), limpar(serie)]
    .filter(Boolean)
    .join("_");
}

/**
 * Dispara a impressão/exportação em PDF com o documento limpo:
 * fecha os toasts, define o nome do arquivo pelo título do documento
 * e restaura o título original ao final.
 */
export function imprimirMaterial(dados: DadosImpressao) {
  if (typeof window === "undefined") return;
  toast.dismiss();
  const original = document.title;
  document.title = nomeArquivo(dados);
  document.documentElement.classList.add("modo-impressao");

  const restaurar = () => {
    document.title = original;
    document.documentElement.classList.remove("modo-impressao");
  };

  window.addEventListener("afterprint", restaurar, { once: true });

  window.setTimeout(() => {
    window.print();
    // fallback caso o navegador não dispare afterprint
    window.setTimeout(restaurar, 1500);
  }, 250);
}
