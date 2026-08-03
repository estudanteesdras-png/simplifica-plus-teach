import { GoogleGenAI } from "@google/genai";

const MODELOS = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-flash-latest"];

/** Chama o Gemini pedindo JSON estruturado e devolve o objeto já interpretado. */
export async function gerarJson<T>(
  sistema: string,
  pedido: string,
  schema: unknown,
): Promise<T> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new Error("A chave da IA não está configurada.");

  const ai = new GoogleGenAI({ apiKey });
  let texto = "";
  let ultimoErro: unknown;

  for (const modelo of MODELOS) {
    try {
      const resposta = await ai.models.generateContent({
        model: modelo,
        contents: pedido,
        config: {
          systemInstruction: sistema,
          temperature: 0.9,
          responseMimeType: "application/json",
          responseSchema: schema as never,
        },
      });
      texto = resposta.text ?? "";
      if (texto.trim()) break;
    } catch (erro) {
      ultimoErro = erro;
      console.error(`Gemini falhou no modelo ${modelo}:`, erro);
    }
  }

  if (!texto.trim()) {
    const detalhe = ultimoErro instanceof Error ? ultimoErro.message : "";
    throw new Error(
      `A IA não respondeu agora. Tente novamente em instantes.${detalhe ? ` (${detalhe})` : ""}`,
    );
  }

  try {
    return JSON.parse(texto) as T;
  } catch {
    const inicio = texto.indexOf("{");
    const fim = texto.lastIndexOf("}");
    if (inicio >= 0 && fim > inicio) return JSON.parse(texto.slice(inicio, fim + 1)) as T;
    throw new Error("Não foi possível interpretar a resposta da IA.");
  }
}
