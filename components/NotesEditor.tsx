"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { saveNotesAction } from "@/app/actions/app";

type Status = "idle" | "saving" | "saved";

export default function NotesEditor({ initial }: { initial: string }) {
  const [content, setContent] = useState(initial);
  const [tab, setTab] = useState<"editar" | "preview">("editar");
  const [status, setStatus] = useState<Status>("idle");
  const firstRender = useRef(true);

  // Autosave com debounce
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setStatus("saving");
    const t = setTimeout(() => {
      saveNotesAction(content)
        .then(() => setStatus("saved"))
        .catch(() => setStatus("idle"));
    }, 800);
    return () => clearTimeout(t);
  }, [content]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-end justify-between mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">📝 Anotações</h1>
          <p className="text-sm text-white/50 mt-1">
            Suas anotações do curso e ideias. Suporta Markdown e salva
            automaticamente.
          </p>
        </div>
        <span className="text-xs text-white/40 shrink-0">
          {status === "saving"
            ? "salvando…"
            : status === "saved"
              ? "✓ salvo"
              : ""}
        </span>
      </div>

      <div className="inline-flex rounded-lg bg-white/5 p-1 mb-3">
        {(["editar", "preview"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              tab === t ? "bg-white text-black" : "text-white/60 hover:text-white"
            }`}
          >
            {t === "editar" ? "Editar" : "Pré-visualizar"}
          </button>
        ))}
      </div>

      {tab === "editar" ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva aqui… Use Markdown: # títulos, **negrito**, - listas, `código`, [links](url)…"
          className="w-full min-h-[60vh] rounded-2xl bg-white/[0.03] border border-white/10 focus:border-white/25 outline-none p-5 text-[15px] leading-relaxed text-white/90 placeholder:text-white/30 font-mono resize-y"
        />
      ) : (
        <div className="min-h-[60vh] rounded-2xl bg-white/[0.03] border border-white/10 p-6">
          {content.trim() ? (
            <div className="text-[15px] leading-relaxed text-white/85">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-white mt-6 mb-3 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-white mt-6 mb-2.5">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-white mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => <p className="my-3">{children}</p>,
                  ul: ({ children }) => (
                    <ul className="my-3 list-disc pl-5 space-y-1 marker:text-white/30">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-3 list-decimal pl-5 space-y-1 marker:text-white/40">
                      {children}
                    </ol>
                  ),
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
                    <blockquote className="my-4 border-l-2 border-white/20 pl-4 text-white/70">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-white/30">Nada para pré-visualizar ainda.</p>
          )}
        </div>
      )}
    </div>
  );
}
