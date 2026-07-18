"use client";

import { useMemo, useState } from "react";
import type { UserProgressRow } from "@/lib/data";

type Filtro = "todos" | "qa" | "agilidade";

const TABS: { id: Filtro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "qa", label: "QA" },
  { id: "agilidade", label: "Agilidade" },
];

function areaBadge(area: "qa" | "agilidade") {
  return area === "agilidade"
    ? "text-sky-300/80 bg-sky-500/10 ring-sky-400/30"
    : "text-emerald-300/80 bg-emerald-500/10 ring-emerald-400/30";
}

export default function RelatorioClient({
  rows,
  totalTopics,
  totalClaudeTopics = 0,
}: {
  rows: UserProgressRow[];
  totalTopics: number;
  /** Total de tópicos da trilha "Conhecendo o Claude" (coluna própria). */
  totalClaudeTopics?: number;
}) {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const filtered = useMemo(
    () => (filtro === "todos" ? rows : rows.filter((r) => r.area === filtro)),
    [rows, filtro],
  );

  const media = useMemo(() => {
    if (!filtered.length) return 0;
    const done = filtered.reduce((a, r) => a + r.completed, 0);
    return Math.round((done / (filtered.length * totalTopics)) * 100);
  }, [filtered, totalTopics]);

  const countArea = (area: "qa" | "agilidade") =>
    rows.filter((r) => r.area === area).length;

  const pendentes = filtered.filter((r) => r.must_change_password).length;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Relatório de progresso</h1>
        <p className="text-sm text-white/50 mt-1">
          Progresso de cada colaborador no roadmap ({totalTopics} tópicos).
          Média{" "}
          {filtro === "todos" ? "geral" : `de ${filtro === "qa" ? "QA" : "Agilidade"}`}
          : <span className="text-white/80">{media}%</span> ·{" "}
          <span className="text-white/60">
            {filtered.length} {filtered.length === 1 ? "pessoa" : "pessoas"}
          </span>
          {pendentes > 0 && (
            <>
              {" · "}
              <span className="text-amber-300/90">
                {pendentes} com senha pendente
              </span>
            </>
          )}
          .
        </p>

        {/* Filtro por área */}
        <div className="mt-4 inline-flex rounded-xl bg-white/5 ring-1 ring-white/10 p-1">
          {TABS.map((t) => {
            const n =
              t.id === "todos" ? rows.length : countArea(t.id as "qa" | "agilidade");
            return (
              <button
                key={t.id}
                onClick={() => setFiltro(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
                  filtro === t.id
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {t.label}
                <span
                  className={`text-[11px] tabular-nums ${
                    filtro === t.id ? "text-black/50" : "text-white/40"
                  }`}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-white/60 text-left">
              <th className="px-4 py-3 font-semibold">Colaborador</th>
              <th className="px-4 py-3 font-semibold w-32 whitespace-nowrap">
                Senha
              </th>
              <th className="px-4 py-3 font-semibold w-24 text-right">
                Concluído
              </th>
              {totalClaudeTopics > 0 && (
                <th className="px-4 py-3 font-semibold w-24 text-right whitespace-nowrap">
                  Claude
                </th>
              )}
              <th className="px-4 py-3 font-semibold w-1/3">Progresso</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const pct = Math.round((r.completed / totalTopics) * 100);
              return (
                <tr
                  key={r.id}
                  className="border-t border-white/10 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 text-white/90">
                    {r.username}
                    <span
                      className={`ml-2 text-[10px] font-bold uppercase tracking-wide rounded px-1.5 py-0.5 ring-1 ${areaBadge(
                        r.area,
                      )}`}
                    >
                      {r.area === "agilidade" ? "agilidade" : "qa"}
                    </span>
                    {r.is_admin && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-amber-300/80 bg-amber-500/10 ring-1 ring-amber-400/30 rounded px-1.5 py-0.5">
                        admin
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.must_change_password ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-300/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        Pendente
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Trocada
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-white/70 tabular-nums">
                    {r.completed}/{totalTopics}
                  </td>
                  {totalClaudeTopics > 0 && (
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span
                        className={
                          r.completed_claude >= totalClaudeTopics
                            ? "text-amber-300"
                            : "text-white/70"
                        }
                      >
                        {r.completed_claude}/{totalClaudeTopics}
                        {r.completed_claude >= totalClaudeTopics && " ✓"}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-white/60 tabular-nums">
                        {pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={totalClaudeTopics > 0 ? 5 : 4}
                  className="px-4 py-8 text-center text-sm text-white/40"
                >
                  Nenhum colaborador nesta área ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-white/30">
        Visível apenas para administradores. Os dados vêm do progresso salvo por
        cada colaborador.
      </p>
    </>
  );
}
