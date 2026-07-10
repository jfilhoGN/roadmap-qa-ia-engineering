"use client";

import { useMemo, useState } from "react";
import { ALL_TOPICS, LEVEL_META, type Level } from "@/data/roadmap";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const LEVELS = Object.keys(LEVEL_META) as Level[];

export default function Glossario() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<Level | "todos">("todos");

  const q = norm(query.trim());

  const items = useMemo(() => {
    return ALL_TOPICS.filter((t) => {
      if (level !== "todos" && t.level !== level) return false;
      if (!q) return true;
      return (
        norm(t.title).includes(q) ||
        norm(t.short).includes(q) ||
        norm(t.whatIsIt).includes(q) ||
        t.tags.some((tag) => norm(tag).includes(q))
      );
    }).sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  }, [q, level]);

  // Agrupa por letra inicial do título
  const groups = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const t of items) {
      const letter = t.title[0].toUpperCase();
      const key = /[A-Z]/.test(letter) ? letter : "#";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Glossário de IA</h1>
        <p className="text-sm text-white/55 mt-1">
          Todos os {ALL_TOPICS.length} termos do roadmap, em ordem alfabética.
          Busque por termo, definição ou tag.
        </p>
      </header>

      {/* Controles */}
      <div className="sticky top-14 z-30 -mx-4 px-4 py-3 mb-6 bg-[#0a0a0f]/85 backdrop-blur border-y border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">
              🔎
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar termo (ex.: RAG, alucinação, eval, agente…)"
              className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-sky-400/50 outline-none pl-9 pr-9 py-2 text-sm text-white placeholder:text-white/30 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Limpar busca"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 text-sm"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              active={level === "todos"}
              onClick={() => setLevel("todos")}
              label="Todos"
            />
            {LEVELS.map((lvl) => (
              <Chip
                key={lvl}
                active={level === lvl}
                onClick={() => setLevel(lvl)}
                label={LEVEL_META[lvl].label}
                dot={LEVEL_META[lvl].dot}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-white/40">
          {items.length} termo{items.length === 1 ? "" : "s"}
          {q && ` para “${query}”`}
        </p>
      </div>

      {/* Lista */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <p className="text-lg">Nenhum termo encontrado.</p>
          <button
            onClick={() => {
              setQuery("");
              setLevel("todos");
            }}
            className="mt-3 text-sm text-sky-300 hover:text-sky-200"
          >
            Limpar busca e filtros
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(([letter, list]) => (
            <section key={letter}>
              <h2 className="text-sm font-bold text-white/30 mb-3 tracking-widest">
                {letter}
              </h2>
              <div className="space-y-3">
                {list.map((t) => {
                  const meta = LEVEL_META[t.level];
                  return (
                    <article
                      key={t.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-[15px] text-white/95">
                          {t.title}
                        </h3>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold ${meta.color} ${meta.soft} px-2 py-0.5 rounded-full ring-1 ${meta.ring}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
                          />
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                        {t.whatIsIt}
                      </p>
                      {t.tags.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {t.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => setQuery(tag)}
                              className="text-[11px] text-white/50 bg-white/5 hover:bg-white/10 hover:text-white/80 px-2 py-0.5 rounded transition-colors"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

function Chip({
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
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
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
