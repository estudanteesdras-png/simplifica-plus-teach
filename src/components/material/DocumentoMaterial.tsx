import { Caixa, Folha, Linhas, SecaoNumerada } from "./Folha";
import type { MaterialCompleto, Questao } from "@/lib/material";

const LETRAS = ["A", "B", "C", "D"];

function FichaTecnica({ m }: { m: MaterialCompleto }) {
  const campos = [
    ["Componente curricular", m.disciplina],
    ["Ano / Série", m.serie],
    ["Faixa etária", m.faixaEtaria],
    ["Duração estimada", m.duracao],
    ["Códigos BNCC", m.codigosBNCC],
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

function QuestaoAluno({ q }: { q: Questao }) {
  if (q.tipo === "objetiva") {
    return (
      <div className="doc-questao">
        <p className="doc-questao-enunciado">
          {q.numero}. {q.enunciado}
        </p>
        <div className="doc-alternativas">
          {q.alternativas.map((a, i) => (
            <span key={a}>
              ({LETRAS[i]}) {a}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (q.tipo === "lacunas") {
    return (
      <div className="doc-questao">
        <p className="doc-questao-enunciado">
          {q.numero}. {q.enunciado}
        </p>
        <p className="doc-banco">[ {q.banco.join("  |  ")} ]</p>
        <div className="doc-fluxo">
          {q.campos.map((c, i) => (
            <div key={c} className="doc-fluxo-item">
              <span className="doc-fluxo-lacuna">{i + 1}. ______________________</span>
              <span className="doc-fluxo-legenda">({c})</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (q.tipo === "tabela") {
    return (
      <div className="doc-questao">
        <p className="doc-questao-enunciado">
          {q.numero}. {q.enunciado}
        </p>
        <table className="doc-tabela">
          <thead>
            <tr>
              {q.colunas.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {q.exemplos.map((e) => (
                <td key={e}>
                  <span className="doc-tabela-dica">{e}</span>
                  <span className="doc-tabela-espaco" />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  if (q.tipo === "interpretacao" || q.tipo === "contexto") {
    return (
      <div className="doc-questao">
        <p className="doc-questao-enunciado">
          {q.numero}. {q.titulo}
        </p>
        <div className="doc-texto-apoio">{q.texto}</div>
        {q.itens.map((it) => (
          <div key={it.pergunta} className="doc-subitem">
            <p>{it.pergunta}</p>
            <Linhas quantidade={2} />
          </div>
        ))}
      </div>
    );
  }
  if (q.tipo === "discursiva") {
    return (
      <div className="doc-questao">
        <p className="doc-questao-enunciado">
          {q.numero}. {q.enunciado}
        </p>
        <Linhas quantidade={q.linhas} />
      </div>
    );
  }
  return (
    <div className="doc-questao">
      <p className="doc-questao-enunciado">
        {q.numero}. {q.enunciado}
      </p>
      <p className="doc-instrucao-menor">{q.instrucao}</p>
      <div className="doc-espaco-producao">ESPAÇO PARA SUA PRODUÇÃO</div>
    </div>
  );
}

function GabaritoItem({ q }: { q: Questao }) {
  const resposta =
    q.tipo === "objetiva"
      ? `${LETRAS[q.correta]}) ${q.alternativas[q.correta]}`
      : q.tipo === "lacunas"
        ? q.gabarito.map((g, i) => `${i + 1}. ${g}`).join(" → ")
        : q.tipo === "tabela"
          ? q.colunas.map((c, i) => `${c}: ${q.exemplos[i]}`).join(" | ")
          : q.tipo === "interpretacao" || q.tipo === "contexto"
            ? ""
            : q.tipo === "discursiva"
              ? q.respostaEsperada
              : q.respostaEsperada;

  return (
    <div className="doc-gabarito-item">
      <p className="doc-gabarito-titulo">
        Questão {q.numero}
        {q.tipo === "objetiva" ? ` — Resposta: ${LETRAS[q.correta]}` : ""}
      </p>
      {resposta && (
        <p>
          <strong>Resposta esperada:</strong> {resposta}
        </p>
      )}
      {(q.tipo === "interpretacao" || q.tipo === "contexto") &&
        q.itens.map((it) => (
          <p key={it.pergunta}>
            <strong>{it.pergunta}</strong> {it.resposta}
          </p>
        ))}
      {"explicacao" in q && q.explicacao && (
        <p>
          <strong>Explicação pedagógica:</strong> {q.explicacao}
        </p>
      )}
      <p>
        <strong>Competência trabalhada:</strong> {q.competencia}
      </p>
      <p>
        <strong>Critério de correção:</strong> {q.criterio}
      </p>
    </div>
  );
}

export function DocumentoMaterial({ m, professor }: { m: MaterialCompleto; professor?: string }) {
  const todasQuestoes = m.atividade.blocos.flatMap((b) => b.questoes);
  const total = 8;

  return (
    <div className="doc-raiz">
      {/* 1 — Plano de aula: capa e ficha */}
      <Folha
        etiqueta="Simplifica+ Tech Educacional"
        titulo="PLANO DE AULA PEDAGÓGICO"
        subtitulo={m.titulo}
        pagina={1}
        totalPaginas={total}
      >
        <FichaTecnica m={m} />

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

      {/* 2 — Desenvolvimento, inclusão e avaliação */}
      <Folha
        etiqueta="Plano de aula"
        titulo="DESENVOLVIMENTO DA AULA"
        subtitulo={`${m.disciplina} • ${m.serie} • ${m.duracao}`}
        pagina={2}
        totalPaginas={total}
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

      {/* 3 e 4 — Atividade do aluno */}
      {[0, 1].map((parte) => {
        const blocos = parte === 0 ? m.atividade.blocos.slice(0, 2) : m.atividade.blocos.slice(2);
        return (
          <Folha
            key={parte}
            etiqueta={`Atividade do aluno • ${m.disciplina}`}
            titulo={m.titulo.toUpperCase()}
            subtitulo={m.serie}
            variante="azul"
            pagina={3 + parte}
            totalPaginas={total}
          >
            {parte === 0 && (
              <>
                <div className="doc-identificacao">
                  <p>
                    <strong>ALUNO(A):</strong> ______________________________________________
                  </p>
                  <p>
                    <strong>TURMA:</strong> {m.serie.split("—")[0].trim()}
                  </p>
                  <p>
                    <strong>PROFESSOR(A):</strong>{" "}
                    {professor ? professor : "_____________________________________"}
                  </p>
                  <p>
                    <strong>DATA:</strong> ____/____/______
                  </p>
                </div>
                <Caixa titulo="INSTRUÇÕES" cor="roxo">
                  <ul className="doc-lista">
                    {m.atividade.instrucoes.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </Caixa>
              </>
            )}
            {blocos.map((b) => (
              <section key={b.titulo} className="doc-bloco">
                <h3 className="doc-bloco-titulo">{b.titulo}</h3>
                {b.questoes.map((q) => (
                  <QuestaoAluno key={q.numero} q={q} />
                ))}
              </section>
            ))}
          </Folha>
        );
      })}

      {/* 5 — Produção final */}
      <Folha
        etiqueta="Atividade do aluno"
        titulo="ESPAÇO DE PRODUÇÃO E REGISTRO"
        subtitulo={m.titulo}
        pagina={5}
        totalPaginas={total}
      >
        <p className="doc-p">
          Use esta folha para finalizar a questão de produção, organizar o rascunho e registrar suas
          conclusões sobre <strong>{m.titulo}</strong>.
        </p>
        <div className="doc-espaco-grande">ESPAÇO PARA DESENHO, ESQUEMA OU CARTAZ</div>
        <p className="doc-p doc-p-rotulo">Minhas conclusões:</p>
        <Linhas quantidade={7} />
      </Folha>

      {/* 6 e 7 — Gabarito */}
      {[0, 1].map((parte) => {
        const itens = parte === 0 ? todasQuestoes.slice(0, 6) : todasQuestoes.slice(6);
        return (
          <Folha
            key={`gab-${parte}`}
            etiqueta="Exclusivo professor"
            titulo="GABARITO COMENTADO"
            subtitulo={`${m.titulo} — ${m.serie}`}
            variante="escuro"
            pagina={6 + parte}
            totalPaginas={total}
          >
            {parte === 0 && (
              <p className="doc-p">
                Gabarito orientativo com respostas esperadas, explicação pedagógica, competência
                trabalhada e critérios de correção. Pontuação total sugerida: <strong>30 pontos</strong>.
              </p>
            )}
            {itens.map((q) => (
              <GabaritoItem key={q.numero} q={q} />
            ))}
          </Folha>
        );
      })}

      {/* 8 — Versão adaptada */}
      <Folha
        etiqueta="Versão adaptada • TEA / TDAH / Deficiência Intelectual"
        titulo="ATIVIDADE ADAPTADA"
        subtitulo={`${m.titulo} — apoio visual ativo`}
        variante="roxo"
        pagina={8}
        totalPaginas={total}
      >
        <div className="doc-adaptada">
          <div className="doc-identificacao">
            <p>
              <strong>NOME:</strong> ___________________________________________
            </p>
            <p>
              <strong>TURMA:</strong> {m.serie.split("—")[0].trim()}
            </p>
            <p>
              <strong>DATA:</strong> ____/____/______
            </p>
          </div>

          <Caixa titulo="INSTRUÇÕES FACILITADAS" cor="roxo">
            <ul className="doc-lista">
              {m.adaptada.instrucoes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </Caixa>

          <h3 className="doc-passo">PASSO 1 — LIGUE CADA ETAPA AO SEU SIGNIFICADO</h3>
          <div className="doc-ligar">
            <div>
              {m.adaptada.pares.map((p) => (
                <div key={p.conceito} className="doc-ligar-item">
                  {p.conceito}
                </div>
              ))}
            </div>
            <div>
              {[...m.adaptada.pares].reverse().map((p) => (
                <div key={p.descricao} className="doc-ligar-item">
                  {p.descricao}
                </div>
              ))}
            </div>
          </div>

          <h3 className="doc-passo">PASSO 2 — PINTE A RESPOSTA CERTA</h3>
          {m.adaptada.escolhas.map((e) => (
            <div key={e.pergunta} className="doc-escolha">
              <p>{e.pergunta}</p>
              <div>
                {e.opcoes.map((o) => (
                  <span key={o} className="doc-escolha-opcao">
                    [ ] {o}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <h3 className="doc-passo">PASSO 3 — DESENHE</h3>
          <p className="doc-p-grande">{m.adaptada.desenho}</p>
          <div className="doc-espaco-grande">DESENHE AQUI</div>
        </div>
      </Folha>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Documento 1 — apenas o PLANO DE AULA (2 páginas)                    */
/* ------------------------------------------------------------------ */

export function DocumentoPlano({ m, professor }: { m: MaterialCompleto; professor?: string }) {
  const total = 2;
  return (
    <div className="doc-raiz">
      <Folha
        etiqueta="Simplifica+ Tech Educacional"
        titulo="PLANO DE AULA PEDAGÓGICO"
        subtitulo={m.titulo}
        pagina={1}
        totalPaginas={total}
      >
        <FichaTecnica m={m} />

        <div className="doc-identificacao">
          <p>
            <strong>PROFESSOR(A):</strong>{" "}
            {professor ? professor : "_____________________________________"}
          </p>
          <p>
            <strong>TURMA:</strong> {m.serie.split("—")[0].trim()}
          </p>
          <p>
            <strong>DATA DE APLICAÇÃO:</strong> ____/____/______
          </p>
        </div>

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
        etiqueta="Plano de aula"
        titulo="DESENVOLVIMENTO DA AULA"
        subtitulo={`${m.disciplina} • ${m.serie} • ${m.duracao}`}
        pagina={2}
        totalPaginas={total}
      >
        <SecaoNumerada numero="4" titulo="CRONOGRAMA DETALHADO POR ETAPAS">
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
          <Caixa titulo="Perguntas para o professor conduzir a aula" cor="neutra">
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

        <SecaoNumerada numero="6" titulo="AVALIAÇÃO & OBSERVAÇÕES FINAIS">
          <p className="doc-p">
            <strong>Avaliação formativa:</strong> {m.plano.avaliacaoFormativa}
          </p>
          <p className="doc-p">
            <strong>Avaliação somativa:</strong> {m.plano.avaliacaoSomativa}
          </p>
          <p className="doc-p doc-p-rotulo">Observações do professor / registro diário:</p>
          <Linhas quantidade={5} />
        </SecaoNumerada>
      </Folha>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Documento 2 — ATIVIDADE + GABARITO + VERSÃO ADAPTADA (6 páginas)    */
/* ------------------------------------------------------------------ */

export function DocumentoAtividade({
  m,
  professor,
}: {
  m: MaterialCompleto;
  professor?: string;
}) {
  const todasQuestoes = m.atividade.blocos.flatMap((b) => b.questoes);
  const total = 6;

  return (
    <div className="doc-raiz">
      {[0, 1].map((parte) => {
        const blocos = parte === 0 ? m.atividade.blocos.slice(0, 2) : m.atividade.blocos.slice(2);
        return (
          <Folha
            key={parte}
            etiqueta={`Folha do aluno • ${m.disciplina}`}
            titulo={m.titulo.toUpperCase()}
            subtitulo={m.serie}
            pagina={1 + parte}
            totalPaginas={total}
          >
            {parte === 0 && (
              <>
                <div className="doc-identificacao">
                  <p>
                    <strong>ALUNO(A):</strong> ______________________________________________
                  </p>
                  <p>
                    <strong>TURMA:</strong> {m.serie.split("—")[0].trim()}
                  </p>
                  <p>
                    <strong>PROFESSOR(A):</strong>{" "}
                    {professor ? professor : "_____________________________________"}
                  </p>
                  <p>
                    <strong>DATA:</strong> ____/____/______
                  </p>
                </div>
                <Caixa titulo="INSTRUÇÕES" cor="roxo">
                  <ul className="doc-lista">
                    {m.atividade.instrucoes.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </Caixa>
              </>
            )}
            {blocos.map((b) => (
              <section key={b.titulo} className="doc-bloco">
                <h3 className="doc-bloco-titulo">{b.titulo}</h3>
                {b.questoes.map((q) => (
                  <QuestaoAluno key={q.numero} q={q} />
                ))}
              </section>
            ))}
          </Folha>
        );
      })}

      <Folha
        etiqueta="Folha do aluno"
        titulo="ESPAÇO DE PRODUÇÃO E REGISTRO"
        subtitulo={m.titulo}
        pagina={3}
        totalPaginas={total}
      >
        <p className="doc-p">
          Use esta folha para finalizar a questão de produção, organizar o rascunho e registrar suas
          conclusões sobre <strong>{m.titulo}</strong>.
        </p>
        <div className="doc-espaco-grande">ESPAÇO PARA DESENHO, ESQUEMA OU CARTAZ</div>
        <p className="doc-p doc-p-rotulo">Minhas conclusões:</p>
        <Linhas quantidade={7} />
      </Folha>

      {[0, 1].map((parte) => {
        const itens = parte === 0 ? todasQuestoes.slice(0, 6) : todasQuestoes.slice(6);
        return (
          <Folha
            key={`gab-${parte}`}
            etiqueta="Exclusivo professor"
            titulo="GABARITO COMENTADO"
            subtitulo={`${m.titulo} — ${m.serie}`}
            variante="escuro"
            pagina={4 + parte}
            totalPaginas={total}
          >
            {parte === 0 && (
              <p className="doc-p">
                Gabarito orientativo com respostas esperadas, explicação pedagógica, competência
                trabalhada e critérios de correção. Pontuação total sugerida:{" "}
                <strong>30 pontos</strong>.
              </p>
            )}
            {itens.map((q) => (
              <GabaritoItem key={q.numero} q={q} />
            ))}
          </Folha>
        );
      })}

      <Folha
        etiqueta="Versão adaptada • TEA / TDAH / Deficiência Intelectual"
        titulo="ATIVIDADE ADAPTADA"
        subtitulo={`${m.titulo} — apoio visual ativo`}
        variante="roxo"
        pagina={6}
        totalPaginas={total}
      >
        <div className="doc-adaptada">
          <div className="doc-identificacao">
            <p>
              <strong>NOME:</strong> ___________________________________________
            </p>
            <p>
              <strong>TURMA:</strong> {m.serie.split("—")[0].trim()}
            </p>
            <p>
              <strong>DATA:</strong> ____/____/______
            </p>
          </div>

          <Caixa titulo="INSTRUÇÕES FACILITADAS" cor="roxo">
            <ul className="doc-lista">
              {m.adaptada.instrucoes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </Caixa>

          <h3 className="doc-passo">PASSO 1 — LIGUE CADA ETAPA AO SEU SIGNIFICADO</h3>
          <div className="doc-ligar">
            <div>
              {m.adaptada.pares.map((p) => (
                <div key={p.conceito} className="doc-ligar-item">
                  {p.conceito}
                </div>
              ))}
            </div>
            <div>
              {[...m.adaptada.pares].reverse().map((p) => (
                <div key={p.descricao} className="doc-ligar-item">
                  {p.descricao}
                </div>
              ))}
            </div>
          </div>

          <h3 className="doc-passo">PASSO 2 — PINTE A RESPOSTA CERTA</h3>
          {m.adaptada.escolhas.map((e) => (
            <div key={e.pergunta} className="doc-escolha">
              <p>{e.pergunta}</p>
              <div>
                {e.opcoes.map((o) => (
                  <span key={o} className="doc-escolha-opcao">
                    [ ] {o}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <h3 className="doc-passo">PASSO 3 — DESENHE</h3>
          <p className="doc-p-grande">{m.adaptada.desenho}</p>
          <div className="doc-espaco-grande">DESENHE AQUI</div>
        </div>
      </Folha>
    </div>
  );
}
