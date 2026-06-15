"use client";

import { memo, useRef } from "react";

/**
 * Editor rich-text simples baseado em contentEditable + execCommand.
 * Self-contained (toolbar + área editável). O conteúdo é HTML.
 *
 * IMPORTANTE: é memoizado e só re-renderiza quando `initialHtml`/`placeholder`
 * mudam. Isso evita que re-renders do pai (ex.: status "salvando…") resetem o
 * conteúdo digitado / pulem o cursor. Use `key` no pai para trocar o documento.
 * Por isso o `onChange` deve ser estável (useCallback) e usar refs.
 */
function RichTextEditorBase({
  initialHtml,
  onChange,
  placeholder = "Escreva aqui…",
}: {
  initialHtml: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function exec(command: string) {
    document.execCommand(command, false);
    ref.current?.focus();
    onChange(ref.current?.innerHTML ?? "");
  }

  const Btn = ({
    cmd,
    title,
    children,
  }: {
    cmd: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => exec(cmd)}
      className="h-8 min-w-8 px-2 grid place-items-center rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-0.5 rounded-lg bg-white/5 border border-white/10 p-1 mb-2 flex-wrap shrink-0">
        <Btn cmd="bold" title="Negrito (Ctrl+B)">
          <b>B</b>
        </Btn>
        <Btn cmd="italic" title="Itálico (Ctrl+I)">
          <i>I</i>
        </Btn>
        <Btn cmd="underline" title="Sublinhado (Ctrl+U)">
          <u>U</u>
        </Btn>
        <span className="w-px h-5 bg-white/10 mx-1" />
        <Btn cmd="insertUnorderedList" title="Lista com marcadores">
          • Lista
        </Btn>
        <Btn cmd="insertOrderedList" title="Lista numerada">
          1. Lista
        </Btn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        dangerouslySetInnerHTML={{ __html: initialHtml }}
        className="rte flex-1 min-h-0 overflow-y-auto rounded-2xl bg-white/[0.03] border border-white/10 focus:border-white/25 p-4 text-[15px] leading-relaxed text-white/90"
      />
    </div>
  );
}

const RichTextEditor = memo(
  RichTextEditorBase,
  (prev, next) =>
    prev.initialHtml === next.initialHtml &&
    prev.placeholder === next.placeholder,
);

export default RichTextEditor;
