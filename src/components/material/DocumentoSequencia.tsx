import { Caixa, Folha, Linhas, SecaoNumerada } from "./Folha";
import type { SequenciaDidatica } from "@/lib/material";

function FichaTecnicaAula({
  numero,
  titulo,
  foco,
  disciplina,
  serie,
  duracao,
  codigosBNCC,
}: {
  numero: number;
  titulo: string;
  foco: string;
  disciplina: string;
  serie: string;
  duracao: string;
  codigosBNCC: string;
}) {
  const focoLabel: Record<string, string> = {
    introducao: "Introdução / Sondagem",
    pratica: "Prática / Aprofundamento",
    avaliacao: "Avaliação / Sistematização",
    sistematizacao: "Sistematização / Fechamento",
  };

  const campos = [
    ["Aula", `${numero} — ${titulo}`],
    ["Foco", focoLabel[foco] ?? foco],
    ["Componente curricular", disciplina],
    ["Ano / Série", serie],
    ["Duração estimada", duracao],
    ["Códigos BNCC", codigosBNCC],
  ];

  return (
    <div className="doc-ficha">
      {campos.map(([r, v]) => (
        <div key={r} className="doc-ficha-item">
          <span className="doc-ficha-rotulo">{r.toUpperCase()}</span>
          <strong className="doc-ficha-valor">{v}</strong>
        </div>
      ))}
    </div>
  );
}

export function DocumentoSequencia({ s, professor }: { s: SequenciaDidatica; professor?: string }) {
  const totalPaginas = 1 + s.aulas.length * 2;

  return (
    <div className="doc-raiz">
      {/* Capa geral */}
      <Folha
        etiqueta="Simplifica+ Tech Educacional"
        titulo="SEQUÊNCIA DIDÁTICA COMPLETA"
        subtitulo={s.titulo}
        pagina={1}
        totalPaginas={totalPaginas}
      >
        <div className="doc-identificacao">
          <p>
            <strong>PROFESSOR(A):</strong>{" "}
            {professor ? professor : "_____________________________________"}
          </p>
          <p>
            <strong>TURMA:</strong> {s.serie.split("—")[0].trim()}
          </p>
          <p>
            <strong>DATA DE INÍCIO:</strong> ____/____/______
          </p>
        </div>

        <SecaoNumerada numero="1" titulo="VISÃO GERAL DA PROGRESSÃO">
          <p className="doc-p">{s.tema}</p>
          <Caixa titulo="Por que essa sequência?" cor="roxo">
            <p className="doc-p">
              A sequência foi organizada para que os estudantes avancem do reconhecimento do conceito até
              a aplicação e a argumentação, respeitando os diferentes ritmos de aprendizagem.
            </p>
          </Caixa>
        </SecaoNumerada>

        <SecaoNumerada numero="2" titulo="AULAS DA SEQUÊNCIA">
          <table className="doc-tabela">
            <thead>
              <tr>
                <th>Aula</th>
                <th>Título</th>
                <th>Foco pedagógico</th>
              </tr>
            </thead>
            <tbody>
              {s.aulas.map((a) => (
                <tr key={a.numero}>
                  <td className="doc-td-perfil">{a.numero}ª aula</td>
                  <td>{a.titulo}</td>
                  <td>{a.foco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SecaoNumerada>

        <SecaoNumerada numero="3" titulo="ADAPTAÇÃO INCLUSIVA NESTA SEQUÊNCIA">
          <p className="doc-p">
            <strong>Perfil atendido:</strong> {s.adaptacao || "Turma regular com atenção aos diferentes ritmos"}
          </p>
          <p className="doc-p">
            Cada aula inclui estratégias concretas de acessibilidade (representação, ação/expressão e
            engajamento), descritas no cronograma de cada dia.
          </p>
        </SecaoNumerada>
      </Folha>

      {/* Uma folha dupla por aula */}
      {s.aulas.map((aula, idx) => {
        const paginaBase = 2 + idx * 2;
        const m = aula.material;

        return (
          <div key={aula.numero}>
            <Folha
              etiqueta={`${aula.numero}ª aula da sequência`}
              titulo={aula.titulo.toUpperCase()}
              subtitulo={`${m.disciplina} • ${m.serie}`}
              pagina={paginaBase}
              totalPaginas={totalPaginas}
            >
              <FichaTecnicaAula
                numero={aula.numero}
                titulo={aula.titulo}
                foco={aula.foco}
                disciplina={m.disciplina}
                serie={m.serie}
                duracao={m.duracao}
                codigosBNCC={m.codigosBNCC}
              />

              <SecaoNumerada numero="1" titulo="OBJETIVOS DE APRENDIZAGEM">
                <ul className="doc-lista">
                  {m.plano.objetivos.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </SecaoNumerada>

              <SecaoNumerada numero="2" titulo="COMPETÊNCIAS GERAIS & HABILIDADES BNCC">
                <Caixa titulo="Competências Gerais da Educação Básica" cor="roxo">
                  <ul className="doc-lista">
                    {m.plano.competencias.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </Caixa>
                <Caixa titulo="Habilidades específicas (referência BNCC)" cor="azul">
                  <ul className="doc-lista">
                    {m.plano.habilidades.map((h) => (
                      <li key={h.codigo}>
                        <strong>{h.codigo}:</strong> {h.texto}
                      </li>
                    ))}
                  </ul>
                </Caixa>
              </SecaoNumerada>

              <SecaoNumerada numero="3" titulo="MATERIAIS & RECURSOS NECESSÁRIOS">
                <table className="doc-tabela">
                  <thead>
                    <tr>
                      <th>Recursos físicos / materiais</th>
                      <th>Recursos tecnológicos / digitais</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {m.plano.recursosFisicos.map((r) => (
                          <p key={r}>• {r}</p>
                        ))}
                      </td>
                      <td>
                        {m.plano.recursosDigitais.map((r) => (
                          <p key={r}>• {r}</p>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </SecaoNumerada>
            </Folha>

            <Folha
              etiqueta={`${aula.numero}ª aula da sequência`}
              titulo="DESENVOLVIMENTO DA AULA"
              subtitulo={`${m.disciplina} • ${m.serie} • ${m.duracao}`}
              pagina={paginaBase + 1}
              totalPaginas={totalPaginas}
            >
              <SecaoNumerada numero="4" titulo="CRONOGRAMA DETALHADO">
                {m.plano.momentos.map((mo) => (
                  <div key={mo.titulo} className="doc-momento">
                    <p className="doc-momento-titulo">
                      {mo.titulo} <span>({mo.minutos} minutos)</span>
                    </p>
                    {mo.itens.map((it) => (
                      <p key={it.titulo} className="doc-momento-item">
                        <strong>{it.titulo}:</strong> {it.texto}
                      </p>
                    ))}
                  </div>
                ))}
                <Caixa titulo="Perguntas orientadoras para o professor mediar" cor="neutra">
                  <ol className="doc-lista-num">
                    {m.plano.perguntasOrientadoras.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ol>
                </Caixa>
              </SecaoNumerada>

              <SecaoNumerada numero="5" titulo="ESTRATÉGIAS INCLUSIVAS (TEA, TDAH & AEE)">
                <table className="doc-tabela">
                  <tbody>
                    {m.plano.inclusao.map((i) => (
                      <tr key={i.perfil}>
                        <td className="doc-td-perfil">{i.perfil}</td>
                        <td>{i.estrategias}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SecaoNumerada>

              <SecaoNumerada numero="6" titulo="AVALIAÇÃO & OBSERVAÇÕES PEDAGÓGICAS">
                <p className="doc-p">
                  <strong>Avaliação formativa:</strong> {m.plano.avaliacaoFormativa}
                </p>
                <p className="doc-p">
                  <strong>Avaliação somativa:</strong> {m.plano.avaliacaoSomativa}
                </p>
                <p className="doc-p doc-p-rotulo">Anotações do professor / registro diário:</p>
                <Linhas quantidade={5} />
              </SecaoNumerada>
            </Folha>
          </div>
        );
      })}
    </div>
  );
}
