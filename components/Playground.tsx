"use client";

import { useState } from "react";
import TokenVisualizer from "./playground/TokenVisualizer";
import JsonValidator from "./playground/JsonValidator";
import HallucinationHunt from "./playground/HallucinationHunt";

const TABS = [
  {
    id: "tokens",
    label: "Tokens & Custo",
    icon: "🔢",
    desc: "Visualize tokens, janela de contexto e custo.",
  },
  {
    id: "json",
    label: "Validador JSON",
    icon: "✅",
    desc: "Valide a saída estruturada contra um schema.",
  },
  {
    id: "alucinacao",
    label: "Caça à Alucinação",
    icon: "🔍",
    desc: "Treine faithfulness: a IA inventou ou não?",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Playground() {
  const [tab, setTab] = useState<TabId>("tokens");

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">🧪 Playground</h1>
        <p className="text-sm text-white/55 mt-1">
          Coloque em prática o que aprendeu nos artigos. Estes módulos rodam
          local, sem custo. (A <strong className="text-white">Arena de Red
          Team</strong> com IA real chega na próxima fase.)
        </p>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-white text-black"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span aria-hidden>{t.icon}</span>
            {t.label}
          </button>
        ))}
        <span className="shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-white/[0.03] text-white/30 cursor-not-allowed ring-1 ring-white/5">
          <span aria-hidden>🔥</span>
          Arena Red Team
          <span className="text-[10px] uppercase bg-white/10 rounded px-1.5 py-0.5">
            em breve
          </span>
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        {tab === "tokens" && <TokenVisualizer />}
        {tab === "json" && <JsonValidator />}
        {tab === "alucinacao" && <HallucinationHunt />}
      </div>
    </main>
  );
}
