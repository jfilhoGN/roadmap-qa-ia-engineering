"use client";

import { useState } from "react";

const SAMPLE_OUTPUT = `{
  "mensagem": "Timeout no serviço de pagamento",
  "severidade": "alta",
  "modulo": "checkout",
  "acao_sugerida": "Reprocessar e abrir bug se persistir"
}`;

const SAMPLE_SCHEMA = `{
  "mensagem": "string",
  "severidade": "string",
  "modulo": "string",
  "acao_sugerida": "string"
}`;

const BROKEN_OUTPUT = `{
  "mensagem": "Timeout no serviço de pagamento",
  "severidade": 3,
  "modulo": "checkout",
}`;

type FieldResult = {
  field: string;
  expected: string;
  status: "ok" | "missing" | "wrongType";
  got?: string;
};

function typeOf(v: unknown): string {
  if (Array.isArray(v)) return "array";
  if (v === null) return "null";
  return typeof v;
}

export default function JsonValidator() {
  const [output, setOutput] = useState(SAMPLE_OUTPUT);
  const [schema, setSchema] = useState(SAMPLE_SCHEMA);
  const [result, setResult] = useState<{
    parseError?: string;
    schemaError?: string;
    fields?: FieldResult[];
    pass?: boolean;
  } | null>(null);

  function validate() {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(output);
    } catch (e) {
      setResult({
        parseError: `JSON inválido: ${(e as Error).message}`,
      });
      return;
    }
    let schemaObj: Record<string, string>;
    try {
      schemaObj = JSON.parse(schema);
    } catch (e) {
      setResult({ schemaError: `Schema inválido: ${(e as Error).message}` });
      return;
    }

    const fields: FieldResult[] = Object.entries(schemaObj).map(
      ([field, expected]) => {
        if (!(field in parsed)) return { field, expected, status: "missing" };
        const got = typeOf(parsed[field]);
        if (got !== expected)
          return { field, expected, status: "wrongType", got };
        return { field, expected, status: "ok", got };
      },
    );
    setResult({ fields, pass: fields.every((f) => f.status === "ok") });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/55">
        Cole uma <strong className="text-white">saída JSON</strong> (como a que
        uma IA retornaria) e o <strong className="text-white">schema esperado</strong>{" "}
        (campo: tipo). O validador confere se é JSON válido e se cada campo
        existe com o tipo certo — exatamente o que um{" "}
        <em>validador na sua pipeline</em> faz para confiar na saída do modelo.
      </p>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => {
            setOutput(SAMPLE_OUTPUT);
            setSchema(SAMPLE_SCHEMA);
            setResult(null);
          }}
          className="text-xs rounded-md px-2.5 py-1 bg-white/10 hover:bg-white/20 transition-colors"
        >
          Exemplo válido
        </button>
        <button
          onClick={() => {
            setOutput(BROKEN_OUTPUT);
            setSchema(SAMPLE_SCHEMA);
            setResult(null);
          }}
          className="text-xs rounded-md px-2.5 py-1 bg-white/10 hover:bg-white/20 transition-colors"
        >
          Exemplo com erro
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/50 mb-1.5">
            Saída da IA (JSON)
          </label>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className="w-full min-h-[200px] rounded-2xl bg-white/[0.03] border border-white/10 focus:border-white/25 outline-none p-4 font-mono text-[13px] text-white/90 resize-y"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">
            Schema esperado (campo: &quot;tipo&quot;)
          </label>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            className="w-full min-h-[200px] rounded-2xl bg-white/[0.03] border border-white/10 focus:border-white/25 outline-none p-4 font-mono text-[13px] text-white/90 resize-y"
          />
        </div>
      </div>

      <p className="text-xs text-white/40">
        Tipos aceitos no schema: <code className="text-emerald-200/90">string</code>,{" "}
        <code className="text-emerald-200/90">number</code>,{" "}
        <code className="text-emerald-200/90">boolean</code>,{" "}
        <code className="text-emerald-200/90">array</code>,{" "}
        <code className="text-emerald-200/90">object</code>.
      </p>

      <button
        onClick={validate}
        className="rounded-xl bg-white text-black font-semibold px-5 py-2.5 hover:bg-white/90 transition-colors"
      >
        Validar
      </button>

      {result && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 animate-fade-in">
          {result.parseError && (
            <p className="text-red-300">✗ {result.parseError}</p>
          )}
          {result.schemaError && (
            <p className="text-red-300">✗ {result.schemaError}</p>
          )}
          {result.fields && (
            <>
              <div
                className={`font-bold mb-3 ${
                  result.pass ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {result.pass
                  ? "✓ Saída válida — todos os campos conferem"
                  : "✗ Saída reprovada"}
              </div>
              <ul className="space-y-1.5 text-sm">
                {result.fields.map((f) => (
                  <li key={f.field} className="flex items-center gap-2">
                    {f.status === "ok" ? (
                      <span className="text-emerald-300">✓</span>
                    ) : (
                      <span className="text-red-300">✗</span>
                    )}
                    <code className="text-white/90">{f.field}</code>
                    <span className="text-white/40">
                      {f.status === "ok" && `(${f.expected})`}
                      {f.status === "missing" &&
                        `— faltando (esperado ${f.expected})`}
                      {f.status === "wrongType" &&
                        `— esperado ${f.expected}, veio ${f.got}`}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
