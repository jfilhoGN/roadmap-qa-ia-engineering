"use client";

import { useState, useTransition } from "react";
import {
  addStudyItemAction,
  deleteStudyItemAction,
  toggleStudyItemAction,
} from "@/app/actions/app";
import type { StudyItem } from "@/lib/data";

/** Transforma URLs do texto em links clicáveis. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a
            key={i}
            href={p}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-300 hover:text-sky-200 underline underline-offset-2 break-all"
          >
            {p}
          </a>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export default function StudyList({ initial }: { initial: StudyItem[] }) {
  const [items, setItems] = useState<StudyItem[]>(initial);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();

  function add() {
    const value = text.trim();
    if (!value) return;
    setText("");
    startTransition(async () => {
      const next = await addStudyItemAction(value);
      setItems(next);
    });
  }

  function toggle(id: string, done: boolean) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done } : it)),
    );
    startTransition(async () => {
      const next = await toggleStudyItemAction(id, done);
      setItems(next);
    });
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
    startTransition(async () => {
      const next = await deleteStudyItemAction(id);
      setItems(next);
    });
  }

  const pendentes = items.filter((i) => !i.done);
  const concluidos = items.filter((i) => i.done);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-white">🎯 Próximos estudos</h1>
        <p className="text-sm text-white/50 mt-1">
          Vídeos, cursos e materiais para estudar depois. Cole um link do
          YouTube, o nome de um curso, o que quiser — e marque ao concluir.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder="Ex.: Assistir https://youtu.be/… sobre RAG"
          className="flex-1 rounded-xl bg-white/5 border border-white/10 focus:border-sky-400/50 outline-none px-4 py-2.5 text-white placeholder:text-white/30 transition-colors"
        />
        <button
          onClick={add}
          disabled={pending || !text.trim()}
          className="shrink-0 rounded-xl bg-white text-black font-semibold px-4 hover:bg-white/90 disabled:opacity-50 transition-colors"
        >
          Adicionar
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-white/30 text-sm">
          Nenhum item ainda. Adicione seu primeiro estudo acima.
        </p>
      )}

      <ul className="space-y-2">
        {pendentes.map((it) => (
          <li
            key={it.id}
            className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
          >
            <button
              onClick={() => toggle(it.id, true)}
              aria-label="Concluir"
              className="shrink-0 mt-0.5 h-5 w-5 rounded-md border border-white/25 hover:border-emerald-400 hover:bg-emerald-400/20 transition-colors"
            />
            <span className="flex-1 text-[15px] text-white/85 leading-snug">
              <Linkified text={it.text} />
            </span>
            <button
              onClick={() => remove(it.id)}
              aria-label="Remover"
              className="shrink-0 text-white/20 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {concluidos.length > 0 && (
        <>
          <h2 className="mt-8 mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">
            Concluídos ({concluidos.length})
          </h2>
          <ul className="space-y-2">
            {concluidos.map((it) => (
              <li
                key={it.id}
                className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <button
                  onClick={() => toggle(it.id, false)}
                  aria-label="Reabrir"
                  className="shrink-0 mt-0.5 h-5 w-5 rounded-md bg-emerald-400 text-black grid place-items-center text-xs font-bold"
                >
                  ✓
                </button>
                <span className="flex-1 text-[15px] text-white/40 line-through leading-snug">
                  <Linkified text={it.text} />
                </span>
                <button
                  onClick={() => remove(it.id)}
                  aria-label="Remover"
                  className="shrink-0 text-white/20 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
