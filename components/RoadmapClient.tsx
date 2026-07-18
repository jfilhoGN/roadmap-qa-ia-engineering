"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LEVEL_META,
  QA_PRIMARY_TOPICS,
  ROADMAP,
  isRelevant,
  type Level,
  type RoadmapView,
  type Section,
  type Topic,
} from "@/data/roadmap";
import { resetProgressAction, toggleProgressAction } from "@/app/actions/app";
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
  dimmed,
  onClick,
}: {
  topic: Topic;
  index: number;
  done: boolean;
  dimmed: boolean;
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
      } ${dimmed && !done ? "opacity-55 hover:opacity-100" : ""}`}
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
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold leading-snug text-[15px] text-white/95 group-hover:text-white">
              {topic.title}
            </h3>
            {dimmed && (
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-emerald-300/70 bg-emerald-500/10 ring-1 ring-emerald-400/25 rounded px-1.5 py-0.5">
                foco QA
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] leading-snug text-white/55">
            {topic.short}
          </p>
        </div>
      </div>
    </button>
  );
}

const LS_KEY = "roadmap-progress";

/** Textos do cabeçalho por lente de visualização. */
const VIEW_HEADER: Record<
  RoadmapView,
  { badge: string; title: string; sub: string; highlight: string }
> = {
  geral: {
    badge: "COE Qualidade & Agilidade · Roadmap Dinâmico",
    title: "Roadmap de IA",
    sub: "Domine a IA de ponta a ponta: dos fundamentos aos agentes. O conteúdo é o mesmo para todos —",
    highlight:
      " escolha sua lente (QA ou Agilidade) e veja cada conceito aplicado à sua área.",
  },
  qa: {
    badge: "COE Qualidade · Roadmap Dinâmico",
    title: "IA para QAs",
    sub: "Domine a IA de ponta a ponta: dos fundamentos aos agentes, com exemplos reais de QA em cada passo.",
    highlight:
      " Aqui você não aprende a usar IA — aprende a construí-la, testá-la e confiar nela.",
  },
  agilidade: {
    badge: "Agilidade · Roadmap Dinâmico",
    title: "IA para Agilistas",
    sub: "Domine a IA de ponta a ponta: dos fundamentos aos agentes, com exemplos reais de Agilidade em cada passo.",
    highlight:
      " Aqui você não aprende a usar IA — aprende a colocá-la a serviço do fluxo e do time.",
  },
  claude: {
    badge: "COE Qualidade & Agilidade · Trilha Claude",
    title: "Conhecendo o Claude",
    sub: "O roadmap completo do ecossistema Claude: do app ao Claude Code, da API aos agentes.",
    highlight:
      " Prepare-se para usar tudo do Claude — e para a certificação que vem aí.",
  },
};

const VIEW_TABS: { view: RoadmapView; href: string; label: string }[] = [
  { view: "geral", href: "/", label: "🌐 Geral" },
  { view: "qa", href: "/qa", label: "🧪 QA" },
  { view: "agilidade", href: "/agilidade", label: "🔄 Agilidade" },
];

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function RoadmapClient({
  initialDone = [],
  isPublic = false,
  view = "qa",
  roadmapSections = ROADMAP,
}: {
  initialDone?: string[];
  isPublic?: boolean;
  view?: RoadmapView;
  /** Seções do mapa (default: roadmap principal; /claude passa o seu). */
  roadmapSections?: Section[];
}) {
  const [done, setDone] = useState<Set<string>>(() => new Set(initialDone));
  const [selected, setSelected] = useState<Topic | null>(null);
  const [filter, setFilter] = useState<Level | "todos">("todos");
  const [query, setQuery] = useState("");

  // Tópicos deste mapa (o progresso no banco é compartilhado entre mapas;
  // contamos só o que pertence a este).
  const allTopics = useMemo(
    () => roadmapSections.flatMap((s) => s.topics),
    [roadmapSections],
  );
  const topicIds = useMemo(
    () => new Set(allTopics.map((t) => t.id)),
    [allTopics],
  );
  const totalTopics = allTopics.length;

  // Modo público: progresso vive só no navegador (localStorage), nada no banco.
  useEffect(() => {
    if (!isPublic) return;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setDone(new Set(JSON.parse(raw) as string[]));
    } catch {}
  }, [isPublic]);

  const doneCount = useMemo(
    () => [...done].filter((id) => topicIds.has(id)).length,
    [done, topicIds],
  );
  const isDone = useCallback((id: string) => done.has(id), [done]);

  const toggle = useCallback(
    (id: string) => {
      setDone((prev) => {
        const next = new Set(prev);
        const willComplete = !next.has(id);
        if (willComplete) next.add(id);
        else next.delete(id);
        if (isPublic) {
          try {
            localStorage.setItem(LS_KEY, JSON.stringify([...next]));
          } catch {}
        } else {
          void toggleProgressAction(id, willComplete).catch(() => {});
        }
        return next;
      });
    },
    [isPublic],
  );

  const reset = useCallback(() => {
    setDone(new Set());
    if (isPublic) {
      try {
        localStorage.removeItem(LS_KEY);
      } catch {}
    } else {
      void resetProgressAction().catch(() => {});
    }
  }, [isPublic]);

  // Progresso por nível
  const perLevel = useMemo(() => {
    const acc: Record<Level, { done: number; total: number }> = {
      basico: { done: 0, total: 0 },
      intermediario: { done: 0, total: 0 },
      avancado: { done: 0, total: 0 },
      especialista: { done: 0, total: 0 },
    };
    for (const t of allTopics) {
      acc[t.level].total++;
      if (done.has(t.id)) acc[t.level].done++;
    }
    return acc;
  }, [done, allTopics]);

  // "Continuar de onde parou": 1º tópico relevante ainda não concluído.
  const nextTopic = useMemo(
    () => allTopics.find((t) => !done.has(t.id) && isRelevant(t.id, view)),
    [done, view, allTopics],
  );

  const q = norm(query.trim());
  const matches = useCallback(
    (t: Topic) =>
      !q ||
      norm(t.title).includes(q) ||
      norm(t.short).includes(q) ||
      t.tags.some((tag) => norm(tag).includes(q)),
    [q],
  );

  const sections = useMemo(
    () =>
      filter === "todos"
        ? roadmapSections
        : roadmapSections.filter((s) => s.level === filter),
    [filter, roadmapSections],
  );

  // Seções com seus tópicos visíveis (aplica busca), preservando o índice original.
  const visibleSections = useMemo(
    () =>
      sections
        .map((s) => ({
          section: s,
          topics: s.topics
            .map((topic, i) => ({ topic, index: i + 1 }))
            .filter(({ topic }) => matches(topic)),
        }))
        .filter((s) => s.topics.length > 0),
    [sections, matches],
  );

  const totalMatches = visibleSections.reduce(
    (a, s) => a + s.topics.length,
    0,
  );

  return (
    <main className="relative mx-auto max-w-5xl px-4 pb-32 pt-10 sm:pt-14">
      {/* ───────────── Cabeçalho ───────────── */}
      <header className="text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-widest text-white/40 uppercase">
          {VIEW_HEADER[view].badge}
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
          {VIEW_HEADER[view].title}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-white/60 leading-relaxed">
          {VIEW_HEADER[view].sub}
          <span className="text-white/80">{VIEW_HEADER[view].highlight}</span>
        </p>
      </header>

      {/* ───────────── Seletor de lente (área logada; o mapa Claude não tem lentes) ───────────── */}
      {!isPublic && view !== "claude" && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {VIEW_TABS.map((t) => (
            <Link
              key={t.view}
              href={t.href}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                view === t.view
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/60 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      )}

      {/* ───────────── Painel de progresso ───────────── */}
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-6">
        <ProgressBar done={doneCount} total={totalTopics} />

        {/* Progresso por nível */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(LEVEL_META) as Level[]).map((lvl) => {
            const { done: d, total } = perLevel[lvl];
            const pct = total ? Math.round((d / total) * 100) : 0;
            return (
              <button
                key={lvl}
                onClick={() => setFilter(filter === lvl ? "todos" : lvl)}
                className={`text-left rounded-xl px-3 py-2 ring-1 transition-colors ${
                  filter === lvl
                    ? "bg-white/10 ring-white/25"
                    : "bg-white/[0.02] ring-white/10 hover:bg-white/[0.06]"
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 text-[11px] font-semibold ${LEVEL_META[lvl].color}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${LEVEL_META[lvl].dot}`}
                  />
                  {LEVEL_META[lvl].label}
                </div>
                <div className="mt-1 text-[13px] text-white/70 tabular-nums">
                  {d}/{total}
                </div>
                <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${LEVEL_META[lvl].dot}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-3">
          {nextTopic && (
            <button
              onClick={() => setSelected(nextTopic)}
              className="inline-flex items-center gap-2 rounded-lg bg-white text-black text-sm font-semibold px-3.5 py-2 hover:bg-white/90 transition-colors"
            >
              ▶ Continuar
              <span className="max-w-[16rem] truncate font-normal text-black/60">
                {nextTopic.title}
              </span>
            </button>
          )}
          {doneCount > 0 && (
            <button
              onClick={reset}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Zerar progresso
            </button>
          )}
        </div>
      </div>

      {/* ───────────── Controles: busca + filtro por nível (sticky) ───────────── */}
      <div className="sticky top-14 z-30 -mx-4 px-4 py-3 mb-8 bg-[#0a0a0f]/85 backdrop-blur border-y border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">
              🔎
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar tópico (ex.: MCP, eval, Jira, agente…)"
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
        </div>
        {q && (
          <p className="mt-2 text-xs text-white/40">
            {totalMatches} resultado{totalMatches === 1 ? "" : "s"} para “{query}”
          </p>
        )}
      </div>

      {/* ───────────── O MAPA ───────────── */}
      <div className="relative">
        {visibleSections.map(({ section, topics }) => {
          const meta = LEVEL_META[section.level];
          const lvl = perLevel[section.level];
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
                    <span className="text-white/40 font-semibold normal-case tracking-normal">
                      · {lvl.done}/{lvl.total}
                    </span>
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
                {topics.map(({ topic, index }, i) => {
                  const left = i % 2 === 0;
                  const dimmed =
                    view === "agilidade" && QA_PRIMARY_TOPICS.has(topic.id);
                  return (
                    <div
                      key={topic.id}
                      className="grid grid-cols-[36px_1fr] md:grid-cols-[1fr_56px_1fr] items-center"
                    >
                      {/* Espinha central */}
                      <div className="relative col-start-1 md:col-start-2 self-stretch flex justify-center">
                        <div className="w-px bg-white/15 h-full" />
                        <div className="absolute top-1/2 -translate-y-1/2 flex items-center">
                          <span
                            className={`h-3 w-3 rounded-full ring-4 ring-[#0a0a0f] ${
                              isDone(topic.id) ? "bg-emerald-400" : meta.dot
                            }`}
                          />
                        </div>
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
                          index={index}
                          done={isDone(topic.id)}
                          dimmed={dimmed}
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

        {totalMatches === 0 && (
          <div className="text-center py-16 text-white/40">
            <p className="text-lg">Nenhum tópico encontrado.</p>
            <button
              onClick={() => {
                setQuery("");
                setFilter("todos");
              }}
              className="mt-3 text-sm text-sky-300 hover:text-sky-200"
            >
              Limpar busca e filtros
            </button>
          </div>
        )}

        {/* Fim do mapa */}
        {totalMatches > 0 && !q && filter === "todos" && (
          <div className="flex flex-col items-center">
            <div className="h-8 w-px bg-white/15" />
            <div className="rounded-full bg-gradient-to-r from-emerald-400 to-violet-400 px-5 py-2 text-sm font-bold text-black">
              🎓 {view === "agilidade"
                ? "Agilista de IA"
                : view === "claude"
                  ? "Especialista em Claude"
                  : "Engenheiro de Qualidade de IA"}
            </div>
          </div>
        )}
      </div>

      {/* ───────────── Rodapé ───────────── */}
      <footer className="mt-16 text-center text-xs text-white/30">
        {view === "qa"
          ? "Feito para o time de COE Qualidade · Clique em cada tópico para ver o exemplo aplicado a QA e um prompt para testar."
          : view === "agilidade"
            ? "Feito para o time de Agilidade · Clique em cada tópico para ver o exemplo aplicado a Agilidade e um prompt para testar."
            : view === "claude"
              ? "Trilha Conhecendo o Claude · Clique em cada tópico para ver o guia, um prompt para experimentar e os cursos oficiais."
              : "Feito para os times de COE Qualidade & Agilidade · Clique em cada tópico e use os links de área para ver o exemplo aplicado ao seu contexto."}
      </footer>

      {/* Drawer de detalhe */}
      <TopicDetail
        topic={selected}
        isDone={selected ? isDone(selected.id) : false}
        onToggle={() => selected && toggle(selected.id)}
        onClose={() => setSelected(null)}
        showNotes={!isPublic}
        view={view}
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
