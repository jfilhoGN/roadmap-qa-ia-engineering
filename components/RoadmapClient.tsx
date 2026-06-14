"use client";

import { useMemo, useState } from "react";
import {
  LEVEL_META,
  ROADMAP,
  TOTAL_TOPICS,
  type Level,
  type Topic,
} from "@/data/roadmap";
import { useProgress } from "@/lib/progress";
import TopicDetail from "./TopicDetail";

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-white/60">Seu progresso</span>
        <span className="font-semibold text-white/90">
          {done}/{total} · {pct}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TopicCard({
  topic,
  index,
  done,
  onClick,
}: {
  topic: Topic;
  index: number;
  done: boolean;
  onClick: () => void;
}) {
  const meta = LEVEL_META[topic.level];
  return (
    <button
      onClick={onClick}
      className={`group w-full max-w-sm text-left rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${
        done
          ? "bg-emerald-500/[0.07] border-emerald-400/30"
          : "bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`shrink-0 grid place-items-center h-7 w-7 rounded-lg text-[13px] font-bold ring-1 ${
            done
              ? "bg-emerald-400 text-black ring-emerald-300"
              : `${meta.soft} ${meta.color} ${meta.ring}`
          }`}
        >
          {done ? "✓" : index}
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug text-[15px] text-white/95 group-hover:text-white">
            {topic.title}
          </h3>
          <p className="mt-1 text-[13px] leading-snug text-white/55">
            {topic.short}
          </p>
        </div>
      </div>
    </button>
  );
}

export default function RoadmapClient() {
  const { isDone, toggle, done, reset, loaded } = useProgress();
  const [selected, setSelected] = useState<Topic | null>(null);
  const [filter, setFilter] = useState<Level | "todos">("todos");

  const doneCount = done.size;

  const sections = useMemo(
    () =>
      filter === "todos"
        ? ROADMAP
        : ROADMAP.filter((s) => s.level === filter),
    [filter],
  );

  return (
    <main className="relative mx-auto max-w-5xl px-4 pb-32 pt-10 sm:pt-14">
      {/* ───────────── Cabeçalho ───────────── */}
      <header className="text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-widest text-white/40 uppercase">
          COE Qualidade · Roadmap Dinâmico
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
          IA para QAs
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-white/60 leading-relaxed">
          Do básico ao especialista. Domine os termos da IA que mais importam e
          aprenda, com exemplos práticos, como transformá-los em ferramentas,
          validadores e qualidade de verdade.{" "}
          <span className="text-white/80">
            O futuro do QA é construir e validar inteligência.
          </span>
        </p>
      </header>

      {/* ───────────── Painel de progresso ───────────── */}
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-8">
        <ProgressBar done={loaded ? doneCount : 0} total={TOTAL_TOPICS} />
        {loaded && doneCount > 0 && (
          <button
            onClick={reset}
            className="mt-3 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Zerar progresso
          </button>
        )}
      </div>

      {/* ───────────── Filtro por nível ───────────── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        <FilterChip
          active={filter === "todos"}
          onClick={() => setFilter("todos")}
          label="Todos"
        />
        {(Object.keys(LEVEL_META) as Level[]).map((lvl) => (
          <FilterChip
            key={lvl}
            active={filter === lvl}
            onClick={() => setFilter(lvl)}
            label={LEVEL_META[lvl].label}
            dot={LEVEL_META[lvl].dot}
          />
        ))}
      </div>

      {/* ───────────── O MAPA ───────────── */}
      <div className="relative">
        {sections.map((section) => {
          const meta = LEVEL_META[section.level];
          return (
            <div key={section.id} className="mb-4">
              {/* Conector + Milestone do nível */}
              <div className="flex flex-col items-center">
                <div className="h-8 w-px bg-white/15" />
                <div
                  className={`relative z-10 rounded-2xl px-6 py-4 text-center ring-1 ${meta.ring} ${meta.soft} backdrop-blur`}
                >
                  <div
                    className={`flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest ${meta.color}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </div>
                  <h2 className="mt-1.5 text-xl font-bold text-white">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-[13px] text-white/55 max-w-md">
                    {section.subtitle}
                  </p>
                  <p className="mt-2 text-[12px] text-white/40 max-w-md italic">
                    🏁 Meta: {section.goal}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/15" />
              </div>

              {/* Tópicos ramificando da espinha */}
              <div className="relative">
                {section.topics.map((topic, i) => {
                  const left = i % 2 === 0;
                  return (
                    <div
                      key={topic.id}
                      className="grid grid-cols-[36px_1fr] md:grid-cols-[1fr_56px_1fr] items-center"
                    >
                      {/* Espinha central (col 1 no mobile, col 2 no desktop) */}
                      <div className="relative col-start-1 md:col-start-2 self-stretch flex justify-center">
                        <div className="w-px bg-white/15 h-full" />
                        <div className="absolute top-1/2 -translate-y-1/2 flex items-center">
                          <span
                            className={`h-3 w-3 rounded-full ring-4 ring-[#0a0a0f] ${
                              isDone(topic.id) ? "bg-emerald-400" : meta.dot
                            }`}
                          />
                        </div>
                        {/* conector horizontal (desktop) */}
                        <div
                          className={`hidden md:block absolute top-1/2 h-px w-7 bg-white/15 ${
                            left ? "right-1/2 mr-1.5" : "left-1/2 ml-1.5"
                          }`}
                        />
                      </div>

                      {/* Card do tópico */}
                      <div
                        className={`py-3 col-start-2 md:col-start-1 flex ${
                          left
                            ? "md:col-start-1 md:justify-end"
                            : "md:col-start-3 md:justify-start"
                        }`}
                      >
                        <TopicCard
                          topic={topic}
                          index={i + 1}
                          done={isDone(topic.id)}
                          onClick={() => setSelected(topic)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Fim do mapa */}
        <div className="flex flex-col items-center">
          <div className="h-8 w-px bg-white/15" />
          <div className="rounded-full bg-gradient-to-r from-emerald-400 to-violet-400 px-5 py-2 text-sm font-bold text-black">
            🎓 Engenheiro de Qualidade de IA
          </div>
        </div>
      </div>

      {/* ───────────── Rodapé ───────────── */}
      <footer className="mt-16 text-center text-xs text-white/30">
        Feito para o time de COE Qualidade · Clique em cada tópico para ver o
        exemplo aplicado a QA e um prompt para testar.
      </footer>

      {/* Drawer de detalhe */}
      <TopicDetail
        topic={selected}
        isDone={selected ? isDone(selected.id) : false}
        onToggle={() => selected && toggle(selected.id)}
        onClose={() => setSelected(null)}
      />
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dot?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-white text-black"
          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/90"
      }`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
      {label}
    </button>
  );
}
