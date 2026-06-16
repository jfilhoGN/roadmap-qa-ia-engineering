"use client";

import { useMemo, useState } from "react";

const SAMPLE = `FAIL  src/checkout.cy.ts > finaliza compra com cupom
  AssertionError: expected '#total' to have text 'R$ 90,00' but got 'R$ 100,00'
  at Context.eval (webpack:///./src/checkout.cy.ts:42:18)
  - cupom DESC10 não foi aplicado ao subtotal
  - request POST /api/cart/coupon retornou 200 mas total inalterado
  - reproduz em Chrome 120 e Firefox 121`;

// Janelas de contexto comuns (tokens)
const WINDOWS = [
  { label: "8K", value: 8_000 },
  { label: "128K", value: 128_000 },
  { label: "200K", value: 200_000 },
  { label: "1M", value: 1_000_000 },
];

function estimateTokens(text: string): number {
  if (!text) return 0;
  const chars = text.length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  // Estimativa: média entre ~chars/4 e ~palavras*1.33 (heurística, não exata)
  const byChars = chars / 4;
  const byWords = words * 1.33;
  return Math.round((byChars + byWords) / 2);
}

export default function TokenVisualizer() {
  const [text, setText] = useState(SAMPLE);
  const [windowSize, setWindowSize] = useState(200_000);
  const [pricePerM, setPricePerM] = useState(3); // US$/1M tokens (ilustrativo)

  const { chars, words, tokens, pct, cost } = useMemo(() => {
    const tokens = estimateTokens(text);
    return {
      chars: text.length,
      words: text.trim().split(/\s+/).filter(Boolean).length,
      tokens,
      pct: Math.min(100, (tokens / windowSize) * 100),
      cost: (tokens / 1_000_000) * pricePerM,
    };
  }, [text, windowSize, pricePerM]);

  const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
      <div className="text-[11px] uppercase tracking-wide text-white/40">
        {label}
      </div>
      <div className="text-lg font-bold text-white tabular-nums">{value}</div>
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/55">
        Cole um texto (um log, uma user story, um documento) e veja{" "}
        <strong className="text-white">quantos tokens</strong> ele consome,
        quanto cabe na janela de contexto e o custo estimado. Reforça os
        conceitos de <em>tokens, janela de contexto e custo</em>.
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setText(SAMPLE)}
          className="text-xs rounded-md px-2.5 py-1 bg-white/10 hover:bg-white/20 transition-colors"
        >
          Carregar exemplo (log de teste)
        </button>
        <button
          onClick={() => setText("")}
          className="text-xs rounded-md px-2.5 py-1 bg-white/10 hover:bg-white/20 transition-colors"
        >
          Limpar
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Cole seu texto aqui…"
        className="w-full min-h-[180px] rounded-2xl bg-white/[0.03] border border-white/10 focus:border-white/25 outline-none p-4 font-mono text-[13px] leading-relaxed text-white/90 resize-y"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Caracteres" value={chars.toLocaleString("pt-BR")} />
        <Stat label="Palavras" value={words.toLocaleString("pt-BR")} />
        <Stat label="≈ Tokens" value={tokens.toLocaleString("pt-BR")} />
        <Stat label="≈ Custo (input)" value={`US$ ${cost.toFixed(4)}`} />
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-sm text-white/60">Janela de contexto</span>
          <div className="flex gap-1">
            {WINDOWS.map((w) => (
              <button
                key={w.value}
                onClick={() => setWindowSize(w.value)}
                className={`text-xs rounded-md px-2.5 py-1 transition-colors ${
                  windowSize === w.value
                    ? "bg-white text-black"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-xs text-white/50">
          Usa <strong className="text-white">{pct.toFixed(2)}%</strong> de uma
          janela de {windowSize.toLocaleString("pt-BR")} tokens.
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-white/60">
        <span>Preço por 1M tokens (US$, ilustrativo):</span>
        <input
          type="number"
          step="0.5"
          min="0"
          value={pricePerM}
          onChange={(e) => setPricePerM(Number(e.target.value) || 0)}
          className="w-20 rounded-lg bg-white/5 border border-white/10 focus:border-white/25 outline-none px-2 py-1 text-white"
        />
      </div>

      <p className="text-xs text-white/35">
        ⚠️ Os tokens são uma <strong>estimativa</strong> (cada modelo tem seu
        próprio tokenizador). Os preços são ilustrativos — ajuste para o seu
        modelo. O objetivo é a intuição: texto não é cobrado por caractere nem
        por palavra, e sim por token.
      </p>
    </div>
  );
}
