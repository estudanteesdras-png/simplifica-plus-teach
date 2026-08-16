import { GoogleGenAI } from "@google/genai";

/** Modelo principal (rápido) + fallbacks usados APENAS quando há falha real. */
const MODELO_PRINCIPAL = "gemini-3.7-flash";
const MODELOS_FALLBACK = ["gemini-3-flash-preview", "gemini-3.5-flash", "gemini-flash-latest"];

/** Tempo máximo por tentativa (ms). */
const TIMEOUT_MS = 60_000;

type Opcoes = {
  /** Orçamento de "pensamento" do modelo. Menor = resposta mais rápida. */
  thinkingBudget?: number;
  maxOutputTokens?: number;
  temperature?: number;
};

function ehErroPermanente(erro: unknown): boolean {
  const msg = erro instanceof Error ? erro.message : String(erro);
  return /API key|permission|invalid argument|"code":\s*400/i.test(msg);
}

/** 503/429 são picos temporários: vale uma nova tentativa no mesmo modelo. */
function ehTransitorio(erro: unknown): boolean {
  const msg = erro instanceof Error ? erro.message : String(erro);
  return /503|429|UNAVAILABLE|RESOURCE_EXHAUSTED|high demand/i.test(msg);
}


/** Chama o Gemini pedindo JSON estruturado e devolve o objeto já interpretado. */
export async function gerarJson<T>(
  sistema: string,
  pedido: string,
  schema: unknown,
  opcoes: Opcoes = {},
): Promise<T> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new Error("A chave da IA não está configurada.");

  const ai = new GoogleGenAI({ apiKey });
  const modelos = [MODELO_PRINCIPAL, ...MODELOS_FALLBACK];
  let texto = "";
  let ultimoErro: unknown;

  let permanente = false;

  for (const modelo of modelos) {
    // 2 tentativas por modelo: picos de demanda (503) costumam passar rápido.
    for (let tentativa = 0; tentativa < 2 && !texto.trim(); tentativa++) {
      const controlador = new AbortController();
      const timer = setTimeout(() => controlador.abort(), TIMEOUT_MS);
      try {
        const resposta = await ai.models.generateContent({
          model: modelo,
          contents: pedido,
          config: {
            abortSignal: controlador.signal,
            systemInstruction: sistema,
            temperature: opcoes.temperature ?? 0.45,
            topP: 0.9,
            maxOutputTokens: opcoes.maxOutputTokens ?? 8192,
            thinkingConfig: { thinkingBudget: opcoes.thinkingBudget ?? 512 },
            responseMimeType: "application/json",
            responseSchema: schema as never,
          },
        });
        texto = resposta.text ?? "";
        if (texto.trim()) break;
        ultimoErro = new Error(`Resposta vazia do modelo ${modelo}`);
      } catch (erro) {
        ultimoErro = erro;
        console.error(`Gemini falhou no modelo ${modelo}:`, erro);
        // Erro de configuração/credencial não melhora repetindo nem trocando de modelo.
        if (ehErroPermanente(erro)) {
          permanente = true;
          break;
        }
        if (!ehTransitorio(erro)) break;
        await new Promise((r) => setTimeout(r, 800));
      } finally {
        clearTimeout(timer);
      }
    }
    if (texto.trim() || permanente) break;
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
