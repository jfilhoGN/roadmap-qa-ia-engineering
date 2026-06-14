"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/data/quizzes";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function Question({
  q,
  index,
  total,
  selected,
  onSelect,
}: {
  q: QuizQuestion;
  index: number;
  total: number;
  selected: number | null;
  onSelect: (i: number) => void;
}) {
  const answered = selected !== null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start gap-2 mb-3">
        <span className="shrink-0 text-xs font-bold text-amber-300/80 mt-0.5">
          {index + 1}/{total}
        </span>
        <h4 className="font-semibold text-white/95 leading-snug">{q.question}</h4>
      </div>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isPicked = selected === i;
          let cls =
            "border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]";
          if (answered) {
            if (isCorrect)
              cls = "border-emerald-400/50 bg-emerald-500/10 text-white";
            else if (isPicked)
              cls = "border-red-400/50 bg-red-500/10 text-white";
            else cls = "border-white/10 bg-white/[0.02] opacity-60";
          }
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => onSelect(i)}
              className={`w-full text-left flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-[14px] transition-all ${cls} ${
                answered ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span
                className={`shrink-0 grid place-items-center h-6 w-6 rounded-md text-xs font-bold ${
                  answered && isCorrect
                    ? "bg-emerald-400 text-black"
                    : answered && isPicked
                      ? "bg-red-400 text-black"
                      : "bg-white/10 text-white/70"
                }`}
              >
                {answered && isCorrect ? "✓" : answered && isPicked ? "✕" : LETTERS[i]}
              </span>
              <span className="text-white/85 leading-snug pt-0.5">{opt}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-3 rounded-xl bg-amber-500/[0.07] ring-1 ring-amber-400/20 p-3.5 text-[13px] leading-relaxed text-white/80 animate-fade-in">
          <span className="font-semibold text-amber-300">
            {selected === q.answer ? "✓ Correto! " : "Resposta correta: " + LETTERS[q.answer] + ". "}
          </span>
          {q.explanation}
        </div>
      )}
    </div>
  );
}

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );

  const answeredCount = answers.filter((a) => a !== null).length;
  const score = useMemo(
    () =>
      answers.reduce<number>(
        (acc, a, i) => acc + (a === questions[i].answer ? 1 : 0),
        0,
      ),
    [answers, questions],
  );
  const done = answeredCount === questions.length;

  function select(qi: number, oi: number) {
    setAnswers((prev) => {
      if (prev[qi] !== null) return prev;
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  }

  function reset() {
    setAnswers(questions.map(() => null));
  }

  return (
    <section className="mt-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-white/50">
          <span aria-hidden>🧠</span>
          Teste seu conhecimento
        </h3>
        <span className="text-xs text-white/45">
          {answeredCount}/{questions.length} respondidas
        </span>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <Question
            key={i}
            q={q}
            index={i}
            total={questions.length}
            selected={answers[i]}
            onSelect={(oi) => select(i, oi)}
          />
        ))}
      </div>

      {done && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-400/30 bg-amber-500/[0.08] px-5 py-4 animate-fade-in">
          <div>
            <div className="text-sm text-white/60">Seu resultado</div>
            <div className="text-2xl font-bold text-white">
              {score}/{questions.length}{" "}
              <span className="text-base font-medium text-white/60">
                {score === questions.length
                  ? "— mandou bem! 🎯"
                  : score >= Math.ceil(questions.length * 0.6)
                    ? "— quase lá! 💪"
                    : "— revise o conteúdo acima 📖"}
              </span>
            </div>
          </div>
          <button
            onClick={reset}
            className="text-xs font-medium rounded-lg px-3 py-2 bg-white/10 hover:bg-white/20 transition-colors"
          >
            Refazer
          </button>
        </div>
      )}
    </section>
  );
}
