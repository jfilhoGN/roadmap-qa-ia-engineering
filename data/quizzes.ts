/**
 * Quiz de fixação por tópico — 5 perguntas de múltipla escolha geradas a
 * partir do conteúdo do artigo, para o QA responder e memorizar.
 * Chave = id do tópico (ver data/roadmap.ts).
 */
export type QuizQuestion = {
  question: string;
  /** Alternativas (idealmente 4) */
  options: string[];
  /** Índice (0-based) da alternativa correta */
  answer: number;
  /** Explicação do porquê, mostrada após responder */
  explanation: string;
};

export const QUIZZES: Record<string, QuizQuestion[]> = {};
