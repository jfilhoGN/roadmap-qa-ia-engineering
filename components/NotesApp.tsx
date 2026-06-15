"use client";

import { useRef, useState } from "react";
import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "@/app/actions/app";
import type { Note } from "@/lib/data";

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

// ───────────────── Editor de uma nota (rich-text) ─────────────────
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
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const titleRef = useRef(note.title);
  const htmlRef = useRef(note.content);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  function schedule() {
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        await updateNoteAction(note.id, titleRef.current, htmlRef.current);
        setStatus("saved");
        onSaved({
          id: note.id,
          title: titleRef.current || "Sem título",
          updatedAt: new Date().toISOString(),
        });
      } catch {
        setStatus("idle");
      }
    }, 700);
  }

  function exec(command: string) {
    document.execCommand(command, false);
    editorRef.current?.focus();
    htmlRef.current = editorRef.current?.innerHTML ?? "";
    schedule();
  }

  const ToolbarBtn = ({
    cmd,
    children,
    title: t,
  }: {
    cmd: string;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      title={t}
      // preventDefault no mousedown mantém a seleção dentro do editor
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => exec(cmd)}
      className="h-8 min-w-8 px-2 grid place-items-center rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
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
            schedule();
          }}
          placeholder="Título da anotação"
          className="flex-1 bg-transparent text-xl font-bold text-white outline-none placeholder:text-white/30"
        />
        <span className="text-xs text-white/40 shrink-0 w-16 text-right">
          {status === "saving" ? "salvando…" : status === "saved" ? "✓ salvo" : ""}
        </span>
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

      {/* Barra de ferramentas */}
      <div className="flex items-center gap-0.5 rounded-lg bg-white/5 border border-white/10 p-1 mb-2 flex-wrap">
        <ToolbarBtn cmd="bold" title="Negrito (Ctrl+B)">
          <b>B</b>
        </ToolbarBtn>
        <ToolbarBtn cmd="italic" title="Itálico (Ctrl+I)">
          <i>I</i>
        </ToolbarBtn>
        <ToolbarBtn cmd="underline" title="Sublinhado (Ctrl+U)">
          <u>U</u>
        </ToolbarBtn>
        <span className="w-px h-5 bg-white/10 mx-1" />
        <ToolbarBtn cmd="insertUnorderedList" title="Lista com marcadores">
          • Lista
        </ToolbarBtn>
        <ToolbarBtn cmd="insertOrderedList" title="Lista numerada">
          1. Lista
        </ToolbarBtn>
      </div>

      {/* Área editável */}
      <div
        ref={editorRef}
        // key garante remontagem ao trocar de nota (sem pulo de cursor)
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Escreva sua anotação aqui…"
        onInput={(e) => {
          htmlRef.current = (e.target as HTMLDivElement).innerHTML;
          schedule();
        }}
        dangerouslySetInnerHTML={{ __html: note.content }}
        className="rte flex-1 min-h-[55vh] overflow-y-auto rounded-2xl bg-white/[0.03] border border-white/10 focus:border-white/25 p-5 text-[15px] leading-relaxed text-white/90"
      />
    </div>
  );
}

// ───────────────── App de anotações (lista + detalhe) ─────────────────
export default function NotesApp({ initial }: { initial: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initial);
  const [selectedId, setSelectedId] = useState<string | null>(
    initial[0]?.id ?? null,
  );

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  async function createNew() {
    const list = await createNoteAction("Sem título");
    setNotes(list);
    setSelectedId(list[0]?.id ?? null); // mais recente primeiro
  }

  async function remove(id: string) {
    const list = await deleteNoteAction(id);
    setNotes(list);
    setSelectedId(list[0]?.id ?? null);
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
          className="shrink-0 rounded-xl bg-white text-black font-semibold px-4 py-2 hover:bg-white/90 transition-colors"
        >
          + Nova anotação
        </button>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-4 min-h-[60vh]">
        {/* Lista */}
        <aside
          className={`${selected ? "hidden md:block" : "block"} space-y-2`}
        >
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
                <div className="text-[11px] text-white/40">
                  {formatDate(n.updatedAt)}
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

        {/* Detalhe / editor */}
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
