"use client";

import { useEffect, useRef, useState } from "react";
import RichTextEditor from "./RichTextEditor";
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
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const htmlRef = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    setLoaded(false);
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

  function schedule() {
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        await saveTopicNoteAction(topicId, topicTitle, htmlRef.current);
        setStatus("saved");
      } catch {
        setStatus("idle");
      }
    }, 700);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-white/50 flex items-center gap-2">
            <span aria-hidden>📝</span> Minha anotação
          </h3>
          <span className="text-xs text-white/40">
            {status === "saving"
              ? "salvando…"
              : status === "saved"
                ? "✓ salvo"
                : ""}
          </span>
        </div>
        <p className="text-[11px] text-white/35 mt-1">
          Salva automaticamente como nota deste tópico, com a data do estudo.
        </p>
      </div>
      <div className="flex-1 min-h-0 p-3">
        {loaded ? (
          <RichTextEditor
            key={topicId}
            initialHtml={initial}
            placeholder="Anote o que você aprendeu sobre este tópico…"
            onChange={(html) => {
              htmlRef.current = html;
              schedule();
            }}
          />
        ) : (
          <div className="text-white/30 text-sm p-2">Carregando…</div>
        )}
      </div>
    </div>
  );
}
