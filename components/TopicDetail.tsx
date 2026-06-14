"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LEVEL_META, type Topic } from "@/data/roadmap";
import { DEEP_DIVES } from "@/data/deepDives";

function Article({ markdown }: { markdown: string }) {
  return (
    <div className="text-[15px] leading-relaxed text-white/85">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="text-xl font-bold text-white mt-7 mb-2.5 first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-white mt-7 mb-2.5 first:mt-0 flex items-center gap-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[15px] font-semibold text-white/95 mt-5 mb-1.5">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="my-3">{children}</p>,
          ul: ({ children }) => (
            <ul className="my-3 space-y-1.5 list-disc pl-5 marker:text-white/30">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 space-y-1.5 list-decimal pl-5 marker:text-white/40">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => <em className="text-white/90">{children}</em>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="font-mono text-[13px] bg-white/10 text-emerald-200/90 px-1.5 py-0.5 rounded">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-violet-400/50 bg-violet-500/[0.07] rounded-r-lg pl-4 pr-3 py-2 text-white/80">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-6 border-white/10" />,
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full text-[13px] border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-white/10 bg-white/5 px-3 py-2 text-left font-semibold text-white/90">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-white/10 px-3 py-2 align-top text-white/80">
              {children}
            </td>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

function CopyPrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
      className="text-xs font-medium rounded-md px-2.5 py-1 bg-white/10 hover:bg-white/20 transition-colors"
    >
      {copied ? "✓ Copiado" : "Copiar prompt"}
    </button>
  );
}

function Block({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h4 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-white/50 mb-1.5">
        <span aria-hidden>{icon}</span>
        {label}
      </h4>
      <div className="text-[15px] leading-relaxed text-white/85">{children}</div>
    </section>
  );
}

export default function TopicDetail({
  topic,
  isDone,
  onToggle,
  onClose,
}: {
  topic: Topic | null;
  isDone: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  // Fecha com ESC
  useEffect(() => {
    if (!topic) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [topic, onClose]);

  if (!topic) return null;
  const meta = LEVEL_META[topic.level];
  const deepDive = DEEP_DIVES[topic.id];
  const readingMinutes = deepDive
    ? Math.max(1, Math.round(deepDive.split(/\s+/).length / 200))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* drawer */}
      <aside className="relative h-full w-full max-w-xl bg-[#101018] border-l border-white/10 shadow-2xl flex flex-col animate-slide-in">
        <header className="p-6 pb-4 border-b border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${meta.color} ${meta.soft} px-2.5 py-1 rounded-full ring-1 ${meta.ring}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              <h2 className="mt-3 text-2xl font-bold leading-tight">
                {topic.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="shrink-0 h-9 w-9 grid place-items-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 text-lg"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {topic.tags.map((t) => (
              <span
                key={t}
                className="text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded"
              >
                #{t}
              </span>
            ))}
          </div>
        </header>

        <div className="detail-scroll flex-1 overflow-y-auto p-6">
          {deepDive ? (
            <>
              <div className="mb-5 flex items-center gap-2 text-xs text-white/40">
                <span aria-hidden>⏱️</span>
                <span>~{readingMinutes} min de leitura</span>
              </div>
              <Article markdown={deepDive} />
              <hr className="my-7 border-white/10" />
            </>
          ) : (
            <>
              <Block label="O que é" icon="📘">
                {topic.whatIsIt}
              </Block>

              <Block label="Por que importa para o QA" icon="🎯">
                {topic.whyQA}
              </Block>

              <Block label="Exemplo aplicado a QA" icon="🧪">
                <div className="rounded-xl bg-white/[0.04] ring-1 ring-white/10 p-4">
                  {topic.qaExample}
                </div>
              </Block>
            </>
          )}

          {topic.prompt && (
            <Block label="Prompt para experimentar" icon="⚡">
              <div className="rounded-xl bg-black/40 ring-1 ring-white/10 p-4 relative">
                <div className="flex justify-end mb-2">
                  <CopyPrompt text={topic.prompt} />
                </div>
                <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-emerald-200/90">
                  {topic.prompt}
                </pre>
              </div>
            </Block>
          )}

          {topic.videos && topic.videos.length > 0 && (
            <Block label="Vídeos para aprofundar" icon="🎥">
              <ul className="space-y-2">
                {topic.videos.map((v) => (
                  <li key={v.url}>
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-white/[0.04] ring-1 ring-white/10 hover:ring-red-400/40 hover:bg-white/[0.07] transition-all p-3 group"
                    >
                      <span className="shrink-0 grid place-items-center h-9 w-9 rounded-lg bg-red-500/15 text-red-300 text-base">
                        ▶
                      </span>
                      <span className="text-[14px] text-white/85 group-hover:text-white leading-snug">
                        {v.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {topic.resources && topic.resources.length > 0 && (
            <Block label="Para se aprofundar (leitura)" icon="🔗">
              <ul className="space-y-1.5">
                {topic.resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-300 hover:text-sky-200 underline underline-offset-2 break-words"
                    >
                      {r.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>

        <footer className="p-4 border-t border-white/10">
          <button
            onClick={onToggle}
            className={`w-full rounded-xl py-3 font-semibold transition-colors ${
              isDone
                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40 hover:bg-emerald-500/25"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {isDone ? "✓ Concluído — desmarcar" : "Marcar como concluído"}
          </button>
        </footer>
      </aside>
    </div>
  );
}
