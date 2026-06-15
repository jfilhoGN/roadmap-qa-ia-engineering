"use client";

import { useCallback, useRef, useState } from "react";
import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "@/app/actions/app";
import type { Note } from "@/lib/data";
import RichTextEditor from "./RichTextEditor";
import { Spinner } from "./PageLoading";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ───────────────── Editor de uma nota ─────────────────
function NoteEditor({
  note,
  onSaved,
  onDeleted,
  onBack,
}: {
  note: Note;
  onSaved: (n: { id: string; title: string; updatedAt: string }) => void;
  onDeleted: (id: string) => void;
  onBack: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const titleRef = useRef(note.title);
  const htmlRef = useRef(note.content);
  const dirtyRef = useRef(false);

  function markDirty() {
    if (!dirtyRef.current) {
      dirtyRef.current = true;
      setDirty(true);
      setSaved(false);
    }
  }

  // onChange estável (não re-renderiza o editor enquanto digita)
  const onChange = useCallback((html: string) => {
    htmlRef.current = html;
    if (!dirtyRef.current) {
      dirtyRef.current = true;
      setDirty(true);
      setSaved(false);
    }
  }, []);

  const save = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateNoteAction(note.id, titleRef.current, htmlRef.current);
      dirtyRef.current = false;
      setDirty(false);
      setSaved(true);
      onSaved({
        id: note.id,
        title: titleRef.current || "Sem título",
        updatedAt: new Date().toISOString(),
      });
    } catch {
      /* mantém dirty para tentar de novo */
    } finally {
      setSaving(false);
    }
  }, [saving, note.id, onSaved]);

  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      if (dirty) save();
    }
  }

  return (
    <div className="flex flex-col h-full" onKeyDown={onKeyDown}>
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={onBack}
          className="md:hidden shrink-0 rounded-lg px-2 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10"
        >
          ← Voltar
        </button>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            titleRef.current = e.target.value;
            markDirty();
          }}
          placeholder="Título da anotação"
          className="flex-1 bg-transparent text-xl font-bold text-white outline-none placeholder:text-white/30"
        />
        <span className="text-xs shrink-0 flex items-center gap-1.5">
          {saving ? (
            <span className="text-white/40 flex items-center gap-1.5">
              <Spinner className="h-3 w-3" /> salvando…
            </span>
          ) : dirty ? (
            <span className="text-amber-300/80">• não salvo</span>
          ) : saved ? (
            <span className="text-white/40">✓ salvo</span>
          ) : null}
        </span>
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="shrink-0 rounded-lg bg-white text-black font-semibold px-4 py-1.5 text-sm hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Salvando…" : "Salvar"}
        </button>
        <button
          onClick={() => {
            if (confirm("Excluir esta anotação?")) onDeleted(note.id);
          }}
          title="Excluir"
          className="shrink-0 rounded-lg px-2 py-1.5 text-sm text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          🗑
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <RichTextEditor
          key={note.id}
          initialHtml={note.content}
          placeholder="Escreva sua anotação aqui…"
          onChange={onChange}
        />
      </div>
    </div>
  );
}

// ───────────────── App de anotações (lista + detalhe) ─────────────────
export default function NotesApp({ initial }: { initial: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initial);
  const [selectedId, setSelectedId] = useState<string | null>(
    initial[0]?.id ?? null,
  );
  const [busy, setBusy] = useState(false);

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  async function createNew() {
    setBusy(true);
    try {
      const list = await createNoteAction("Sem título");
      setNotes(list);
      setSelectedId(list[0]?.id ?? null);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      const list = await deleteNoteAction(id);
      setNotes(list);
      setSelectedId(list[0]?.id ?? null);
    } finally {
      setBusy(false);
    }
  }

  function onSaved(u: { id: string; title: string; updatedAt: string }) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === u.id ? { ...n, title: u.title, updatedAt: u.updatedAt } : n,
      ),
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">📝 Anotações</h1>
          <p className="text-sm text-white/50 mt-1">
            Suas anotações do curso e ideias. Cada nota tem título e data.
          </p>
        </div>
        <button
          onClick={createNew}
          disabled={busy}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white text-black font-semibold px-4 py-2 hover:bg-white/90 disabled:opacity-60 transition-colors"
        >
          {busy && <Spinner className="h-4 w-4 !border-black/30 !border-t-black" />}
          {busy ? "Salvando…" : "+ Nova anotação"}
        </button>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-4 min-h-[60vh]">
        <aside className={`${selected ? "hidden md:block" : "block"} space-y-2`}>
          {notes.length === 0 && (
            <p className="text-white/30 text-sm p-3">
              Nenhuma anotação ainda. Crie a primeira.
            </p>
          )}
          {notes.map((n) => {
            const preview = stripHtml(n.content).slice(0, 60);
            const active = n.id === selectedId;
            return (
              <button
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                className={`w-full text-left rounded-xl border p-3 transition-colors ${
                  active
                    ? "border-white/25 bg-white/[0.07]"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[11px] text-white/40">
                    {formatDate(n.updatedAt)}
                  </div>
                  {n.topicId && (
                    <span className="text-[10px] font-semibold text-sky-300/80 bg-sky-500/10 ring-1 ring-sky-400/20 rounded px-1.5 py-0.5">
                      📘 tópico
                    </span>
                  )}
                </div>
                <div className="font-semibold text-white/90 truncate mt-0.5">
                  {n.title || "Sem título"}
                </div>
                {preview && (
                  <div className="text-[13px] text-white/45 truncate mt-0.5">
                    {preview}
                  </div>
                )}
              </button>
            );
          })}
        </aside>

        <section className={`${selected ? "block" : "hidden md:block"}`}>
          {selected ? (
            <NoteEditor
              key={selected.id}
              note={selected}
              onSaved={onSaved}
              onDeleted={remove}
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <div className="h-full grid place-items-center rounded-2xl border border-dashed border-white/10 text-white/30 text-sm">
              Selecione uma anotação ou crie uma nova.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
