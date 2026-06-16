"use client";

import { useState } from "react";

type Claim = { text: string; supported: boolean; why: string };
type Scenario = { title: string; source: string; answer: string; claims: Claim[] };

const SCENARIOS: Scenario[] = [
  {
    title: "Contrato de API",
    source:
      "Documentação (fonte da verdade):\n• GET /v1/orders/{id} — busca um pedido pelo id.\n• POST /v1/orders — cria um novo pedido.\nNada além disso está documentado.",
    answer: "Resposta da IA sobre a API:",
    claims: [
      {
        text: "Existe GET /v1/orders/{id} para buscar um pedido.",
        supported: true,
        why: "Está explícito na documentação.",
      },
      {
        text: "Há um endpoint POST /v1/orders/bulk para criação em massa.",
        supported: false,
        why: "A doc não menciona esse endpoint — a IA inventou.",
      },
      {
        text: "A criação retorna sempre HTTP 201.",
        supported: false,
        why: "A fonte não diz nada sobre o status retornado. Plausível, mas não suportado.",
      },
    ],
  },
  {
    title: "Regra de negócio — login",
    source:
      "Requisito: a senha deve ter no mínimo 8 caracteres. A conta é bloqueada após 5 tentativas inválidas.",
    answer: "Resposta da IA sobre as regras:",
    claims: [
      {
        text: "A senha exige no mínimo 8 caracteres.",
        supported: true,
        why: "Bate exatamente com o requisito.",
      },
      {
        text: "A conta bloqueia após 3 tentativas.",
        supported: false,
        why: "O requisito diz 5 tentativas, não 3 — número trocado (alucinação).",
      },
      {
        text: "A senha precisa de pelo menos um caractere especial.",
        supported: false,
        why: "Não há essa exigência no requisito.",
      },
    ],
  },
  {
    title: "Relatório de execução",
    source:
      "Relatório: 200 testes executados; 12 falharam, todos no módulo de pagamento.",
    answer: "Resumo gerado pela IA:",
    claims: [
      {
        text: "12 testes falharam.",
        supported: true,
        why: "Está no relatório.",
      },
      {
        text: "A taxa de sucesso foi de 94%.",
        supported: true,
        why: "188 de 200 = 94%. Derivação correta a partir da fonte.",
      },
      {
        text: "O módulo de login teve 5 falhas.",
        supported: false,
        why: "O relatório só cita falhas no módulo de pagamento — login não aparece.",
      },
    ],
  },
];

export default function HallucinationHunt() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    SCENARIOS[0].claims.map(() => null),
  );
  const [checked, setChecked] = useState(false);

  const scenario = SCENARIOS[idx];
  const allAnswered = answers.every((a) => a !== null);
  const score = answers.filter(
    (a, i) => a === scenario.claims[i].supported,
  ).length;

  function mark(i: number, val: boolean) {
    if (checked) return;
    setAnswers((prev) => prev.map((a, j) => (j === i ? val : a)));
  }

  function next() {
    const n = (idx + 1) % SCENARIOS.length;
    setIdx(n);
    setAnswers(SCENARIOS[n].claims.map(() => null));
    setChecked(false);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/55">
        Leia a <strong className="text-white">fonte</strong> e classifique cada
        afirmação da IA como <strong className="text-emerald-300">suportada</strong>{" "}
        (está na fonte) ou{" "}
        <strong className="text-red-300">inventada</strong> (alucinação). É o
        treino prático de <em>faithfulness</em> — verificar a IA contra a fonte
        da verdade.
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">
          Cenário {idx + 1}/{SCENARIOS.length}: {scenario.title}
        </span>
      </div>

      <div className="rounded-2xl bg-sky-500/[0.06] ring-1 ring-sky-400/20 p-4 text-[14px] text-white/85 whitespace-pre-line">
        {scenario.source}
      </div>

      <div className="text-sm text-white/50">{scenario.answer}</div>

      <ul className="space-y-2">
        {scenario.claims.map((c, i) => {
          const ans = answers[i];
          const correct = checked && ans === c.supported;
          const wrong = checked && ans !== null && ans !== c.supported;
          return (
            <li
              key={i}
              className={`rounded-xl border p-3 ${
                correct
                  ? "border-emerald-400/40 bg-emerald-500/[0.07]"
                  : wrong
                    ? "border-red-400/40 bg-red-500/[0.07]"
                    : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="text-[15px] text-white/90 mb-2">“{c.text}”</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => mark(i, true)}
                  disabled={checked}
                  className={`text-xs rounded-md px-3 py-1.5 transition-colors ${
                    ans === true
                      ? "bg-emerald-400 text-black"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  } disabled:opacity-70`}
                >
                  Suportada
                </button>
                <button
                  onClick={() => mark(i, false)}
                  disabled={checked}
                  className={`text-xs rounded-md px-3 py-1.5 transition-colors ${
                    ans === false
                      ? "bg-red-400 text-black"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  } disabled:opacity-70`}
                >
                  Inventada
                </button>
              </div>
              {checked && (
                <div className="mt-2 text-[13px] text-white/70">
                  <span
                    className={
                      c.supported ? "text-emerald-300" : "text-red-300"
                    }
                  >
                    {c.supported ? "Suportada. " : "Inventada. "}
                  </span>
                  {c.why}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {!checked ? (
        <button
          onClick={() => setChecked(true)}
          disabled={!allAnswered}
          className="rounded-xl bg-white text-black font-semibold px-5 py-2.5 hover:bg-white/90 disabled:opacity-50 transition-colors"
        >
          Verificar
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 animate-fade-in">
          <div className="text-white">
            <span className="text-2xl font-bold">
              {score}/{scenario.claims.length}
            </span>{" "}
            <span className="text-white/60 text-sm">
              {score === scenario.claims.length
                ? "— olho clínico! 🎯"
                : "— revise a fonte com calma 🔍"}
            </span>
          </div>
          <button
            onClick={next}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
          >
            Próximo cenário →
          </button>
        </div>
      )}
    </div>
  );
}
