"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { Spinner } from "./PageLoading";
import { getTopicNoteAction, saveTopicNoteAction } from "@/app/actions/app";

/** Painel de anotação vinculada ao tópico, exibido na lateral do modal. */
export default function TopicNotePanel({
  topicId,
  topicTitle,
}: {
  topicId: string;
  topicTitle: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [initial, setInitial] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const htmlRef = useRef("");
  const dirtyRef = useRef(false);

  // Carrega a nota do tópico
  useEffect(() => {
    let alive = true;
    setLoaded(false);
    setDirty(false);
    setSaved(false);
    dirtyRef.current = false;
    getTopicNoteAction(topicId)
      .then((c) => {
        if (!alive) return;
        setInitial(c || "");
        htmlRef.current = c || "";
        setLoaded(true);
      })
      .catch(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, [topicId]);

  // onChange estável: só atualiza o ref e marca "dirty" uma única vez por ciclo
  // (não re-renderiza o editor enquanto digita).
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
      await saveTopicNoteAction(topicId, topicTitle, htmlRef.current);
      dirtyRef.current = false;
      setDirty(false);
      setSaved(true);
    } catch {
      /* mantém dirty para o usuário tentar de novo */
    } finally {
      setSaving(false);
    }
  }, [saving, topicId, topicTitle]);

  // Ctrl/Cmd+S salva
  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      if (dirty) save();
    }
  }

  return (
    <div className="flex flex-col h-full" onKeyDown={onKeyDown}>
      <div className="px-4 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-white/50 flex items-center gap-2">
            <span aria-hidden>📝</span> Minha anotação
          </h3>
          <span className="text-xs text-white/40 flex items-center gap-1.5">
            {saving ? (
              <>
                <Spinner className="h-3 w-3" /> salvando…
              </>
            ) : dirty ? (
              <span className="text-amber-300/80">• não salvo</span>
            ) : saved ? (
              "✓ salvo"
            ) : (
              ""
            )}
          </span>
        </div>
        <p className="text-[11px] text-white/35 mt-1">
          Salva como nota deste tópico, com a data do estudo.
        </p>
      </div>

      <div className="flex-1 min-h-0 p-3">
        {loaded ? (
          <RichTextEditor
            key={topicId}
            initialHtml={initial}
            placeholder="Anote o que você aprendeu sobre este tópico…"
            onChange={onChange}
          />
        ) : (
          <div className="flex items-center gap-2 text-white/30 text-sm p-2">
            <Spinner className="h-4 w-4" /> Carregando…
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10 shrink-0">
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black font-semibold py-2.5 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving && (
            <Spinner className="h-4 w-4 !border-black/30 !border-t-black" />
          )}
          {saving ? "Salvando…" : "Salvar anotação"}
        </button>
      </div>
    </div>
  );
}
