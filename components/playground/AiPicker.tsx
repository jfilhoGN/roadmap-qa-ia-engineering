"use client";

import { useState } from "react";

/* ─────────────────────────── Ferramentas do time ─────────────────────────── */
type ToolId = "ms-copilot" | "gemini" | "copilot-vscode";

type Tool = {
  id: ToolId;
  name: string;
  icon: string;
  desc: string;
};

const TOOLS: Tool[] = [
  {
    id: "ms-copilot",
    name: "Microsoft Copilot (M365)",
    icon: "🟦",
    desc: "Integrado ao Office: Word, Excel, PowerPoint, Outlook e Teams. Alcança documentos e e-mails da empresa.",
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: "✨",
    desc: "Google. Forte em pesquisa, contexto longo, multimodal e no Workspace (Docs, Sheets, Gmail).",
  },
  {
    id: "copilot-vscode",
    name: "Copilot no VS Code",
    icon: "🧑‍💻",
    desc: "Programação dentro da IDE. Permite escolher o modelo: Claude Sonnet, GPT ou Codex.",
  },
];

const TOOL_BY_ID: Record<ToolId, Tool> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t]),
) as Record<ToolId, Tool>;

/* ─────────────────────────── Escala de avaliação ─────────────────────────── */
// 3 = Ótimo · 2 = Bom · 1 = Limitado · 0 = Não indicado
type Score = 0 | 1 | 2 | 3;

const SCORE_META: Record<Score, { label: string; cls: string }> = {
  3: { label: "Ótimo", cls: "text-emerald-300 bg-emerald-500/10 ring-emerald-400/30" },
  2: { label: "Bom", cls: "text-sky-300 bg-sky-500/10 ring-sky-400/30" },
  1: { label: "Limitado", cls: "text-amber-300 bg-amber-500/10 ring-amber-400/30" },
  0: { label: "Não indicado", cls: "text-white/40 bg-white/[0.04] ring-white/10" },
};

/* ─────────────────────────── Tarefas do dia a dia ─────────────────────────── */
type Task = {
  id: string;
  label: string;
  icon: string;
  desc: string;
  best: ToolId;
  why: string;
  dica: string;
  ratings: Record<ToolId, Score>;
  notes: Record<ToolId, string>;
};

const TASKS: Task[] = [
  {
    id: "email",
    label: "Enviar e-mail",
    icon: "📧",
    desc: "Redigir, responder e ajustar o tom de e-mails.",
    best: "ms-copilot",
    why: "No Outlook, o Microsoft Copilot lê a thread inteira e já redige a resposta dentro do e-mail, com o tom certo. Se o seu e-mail é no Gmail/Workspace, o Gemini faz o mesmo papel.",
    dica: "Peça o tom e o tamanho: 'responda em tom cordial e objetivo, em 4 linhas, pedindo o prazo de entrega'.",
    ratings: { "ms-copilot": 3, gemini: 2, "copilot-vscode": 0 },
    notes: {
      "ms-copilot": "Direto no Outlook, usa o contexto da conversa.",
      gemini: "Ótima opção se o e-mail é no Gmail.",
      "copilot-vscode": "Fora de contexto — é uma ferramenta de código.",
    },
  },
  {
    id: "relatorio",
    label: "Escrever relatório",
    icon: "📄",
    desc: "Relatório de execução, status report, documento formal.",
    best: "ms-copilot",
    why: "No Word, o Microsoft Copilot monta o relatório a partir de tópicos, dados ou de outro documento, já formatado. No Google Docs, o Gemini entrega qualidade equivalente.",
    dica: "Dê a estrutura: 'monte um relatório de execução de testes com Resumo, Cobertura, Bugs por severidade e Recomendação'.",
    ratings: { "ms-copilot": 3, gemini: 3, "copilot-vscode": 0 },
    notes: {
      "ms-copilot": "Melhor no Word/Office e com dados internos.",
      gemini: "Excelente no Docs e para textos longos.",
      "copilot-vscode": "Não é para redação de documentos.",
    },
  },
  {
    id: "powerpoint",
    label: "Estruturar PowerPoint",
    icon: "📊",
    desc: "Gerar uma apresentação a partir de um tema ou documento.",
    best: "ms-copilot",
    why: "O Microsoft Copilot cria a apresentação inteira dentro do PowerPoint — inclusive transformando um Word em slides. Nenhuma outra ferramenta do time faz isso de forma nativa.",
    dica: "Aponte a fonte: 'crie uma apresentação de 8 slides a partir deste documento, com um slide de próximos passos'.",
    ratings: { "ms-copilot": 3, gemini: 1, "copilot-vscode": 0 },
    notes: {
      "ms-copilot": "Cria e edita slides direto no PowerPoint.",
      gemini: "Ajuda no roteiro/outline, mas não gera o .pptx.",
      "copilot-vscode": "Não se aplica.",
    },
  },
  {
    id: "excel",
    label: "Planilhas / Excel",
    icon: "🧮",
    desc: "Fórmulas, tabelas dinâmicas, análise e gráficos.",
    best: "ms-copilot",
    why: "No Excel, o Microsoft Copilot escreve fórmulas, cria tabelas dinâmicas e analisa os dados na própria planilha. O Gemini é uma boa alternativa para análise de dados no Sheets.",
    dica: "Descreva o resultado, não a fórmula: 'destaque em vermelho os testes com mais de 3 falhas e some por módulo'.",
    ratings: { "ms-copilot": 3, gemini: 2, "copilot-vscode": 1 },
    notes: {
      "ms-copilot": "Fórmulas e análise dentro do Excel.",
      gemini: "Bom para análise de dados no Sheets.",
      "copilot-vscode": "Só se você tratar os dados como script/código.",
    },
  },
  {
    id: "automacao",
    label: "Automação de testes",
    icon: "🤖",
    desc: "Scripts de automação (Playwright, Selenium, Cypress, API).",
    best: "copilot-vscode",
    why: "O Copilot no VS Code trabalha dentro do seu projeto: enxerga os arquivos, roda no seu framework e gera o teste no padrão do time. É a única do time que atua no código real.",
    dica: "Use o Claude Sonnet 5 para desenhar a automação (raciocínio) e o GPT 5.3-Codex para completar código repetitivo rápido.",
    ratings: { "ms-copilot": 0, gemini: 1, "copilot-vscode": 3 },
    notes: {
      "ms-copilot": "Não atua em código.",
      gemini: "Útil para tirar dúvida pontual, mas fora do seu projeto.",
      "copilot-vscode": "Gera e ajusta o teste no seu repositório.",
    },
  },
  {
    id: "codigo",
    label: "Codificar / revisar código",
    icon: "💻",
    desc: "Escrever, explicar, refatorar e revisar código.",
    best: "copilot-vscode",
    why: "Dentro da IDE, o Copilot no VS Code tem o contexto do projeto e escolhe o modelo por tarefa. Para entender ou explicar um trecho isolado, o Gemini também resolve.",
    dica: "Use o Claude Sonnet 5 para refatorar/revisar com cuidado e o GPT 5.3-Codex para gerar/completar código rápido.",
    ratings: { "ms-copilot": 0, gemini: 2, "copilot-vscode": 3 },
    notes: {
      "ms-copilot": "Não é ferramenta de código.",
      gemini: "Bom para explicar e revisar trechos avulsos.",
      "copilot-vscode": "Melhor opção: contexto do projeto + escolha de modelo.",
    },
  },
  {
    id: "pesquisa",
    label: "Pesquisar / brainstorm",
    icon: "🔎",
    desc: "Pesquisar assunto, comparar opções, gerar ideias.",
    best: "gemini",
    why: "O Gemini é forte em pesquisa, contexto longo e informação atualizada. Para pesquisar em documentos INTERNOS da empresa (SharePoint/Teams), o Microsoft Copilot leva vantagem.",
    dica: "Peça fontes: 'compare as 3 abordagens e cite de onde tirou cada afirmação'. Sempre confira antes de usar.",
    ratings: { "ms-copilot": 2, gemini: 3, "copilot-vscode": 0 },
    notes: {
      "ms-copilot": "Melhor quando a resposta está em dados internos da empresa.",
      gemini: "Melhor para pesquisa aberta e assuntos amplos.",
      "copilot-vscode": "Não se aplica.",
    },
  },
  {
    id: "reuniao",
    label: "Resumir reunião / doc",
    icon: "📝",
    desc: "Resumo de reunião, ata, próximos passos, TL;DR de documento.",
    best: "ms-copilot",
    why: "No Teams, o Microsoft Copilot resume a reunião e extrai decisões e tarefas automaticamente. Para resumir um documento ou texto colado, o Gemini vai muito bem.",
    dica: "Peça o formato acionável: 'resuma em Decisões, Pendências (com responsável) e Próximos passos'.",
    ratings: { "ms-copilot": 3, gemini: 2, "copilot-vscode": 0 },
    notes: {
      "ms-copilot": "Resumo e action items nativos no Teams.",
      gemini: "Ótimo para resumir texto/documento colado.",
      "copilot-vscode": "Não se aplica.",
    },
  },
];

/* ─────────────────────────── Modelos do VS Code ─────────────────────────── */
const VSCODE_MODELS = [
  {
    name: "Claude Sonnet 5",
    when: "É o mais recente. Padrão para o que exige mais: raciocínio, refatoração, revisão cuidadosa e tarefas com muitos arquivos.",
  },
  {
    name: "Claude Sonnet 4.6",
    when: "Geração anterior e ainda muito capaz. Bom fallback quando o Sonnet 5 estiver indisponível ou limitado.",
  },
  {
    name: "Claude Sonnet 4.5",
    when: "Geração anterior, mais leve. Serve para tarefas do dia a dia e quando você quer resposta mais rápida.",
  },
  {
    name: "GPT 5.3 · Codex",
    when: "Especializado em código: gerar e completar rápido, boilerplate e trechos repetitivos.",
  },
];

/* ─────────────────────────────── Componentes ─────────────────────────────── */
function ScoreBadge({ score }: { score: Score }) {
  const m = SCORE_META[score];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ${m.cls}`}
    >
      {m.label}
    </span>
  );
}

export default function AiPicker() {
  const [taskId, setTaskId] = useState<string>(TASKS[0].id);
  const [showMatrix, setShowMatrix] = useState(false);

  const task = TASKS.find((t) => t.id === taskId) ?? TASKS[0];
  const bestTool = TOOL_BY_ID[task.best];
  // ferramentas ordenadas da melhor para a pior nesta tarefa
  const ranked = [...TOOLS].sort((a, b) => task.ratings[b.id] - task.ratings[a.id]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-white/55">
        Escolha a <strong className="text-white">tarefa</strong> e veja qual das
        ferramentas do time é a mais indicada — com nota por ferramenta, o
        porquê e uma dica prática. As IAs disponíveis são{" "}
        <strong className="text-white">Microsoft Copilot</strong>,{" "}
        <strong className="text-white">Gemini</strong> e o{" "}
        <strong className="text-white">Copilot no VS Code</strong>.
      </p>

      {/* Chips de tarefa */}
      <div className="flex flex-wrap gap-2">
        {TASKS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTaskId(t.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              taskId === t.id
                ? "bg-white text-black"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span aria-hidden>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Recomendação em destaque */}
      <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.06] p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-300/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Recomendado para {task.label.toLowerCase()}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-3xl" aria-hidden>
            {bestTool.icon}
          </span>
          <h3 className="text-xl font-bold text-white">{bestTool.name}</h3>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-white/80">
          {task.why}
        </p>
        <div className="mt-4 rounded-xl bg-black/30 ring-1 ring-white/10 p-3 text-[13px] text-white/75">
          <span className="font-semibold text-amber-200/90">💡 Dica: </span>
          {task.dica}
        </div>
      </div>

      {/* Ranking por ferramenta nesta tarefa */}
      <div>
        <div className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-white/45">
          Como cada ferramenta se sai
        </div>
        <ul className="space-y-2">
          {ranked.map((tool) => (
            <li
              key={tool.id}
              className={`flex items-start gap-3 rounded-xl border p-3 ${
                tool.id === task.best
                  ? "border-emerald-400/30 bg-emerald-500/[0.05]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <span className="mt-0.5 text-xl" aria-hidden>
                {tool.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-white/90">
                    {tool.name}
                  </span>
                  <ScoreBadge score={task.ratings[tool.id]} />
                </div>
                <p className="mt-1 text-[13px] leading-snug text-white/60">
                  {task.notes[tool.id]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Guia de modelo no VS Code */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="text-[13px] font-semibold text-white/80">
          🧑‍💻 Dentro do Copilot no VS Code, qual modelo escolher?
        </div>
        <ul className="mt-3 space-y-2">
          {VSCODE_MODELS.map((m) => (
            <li key={m.name} className="flex gap-3 text-[13px]">
              <span className="shrink-0 w-36 font-semibold text-sky-300">
                {m.name}
              </span>
              <span className="text-white/65">{m.when}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Matriz completa (todas as tarefas x ferramentas) */}
      <div>
        <button
          onClick={() => setShowMatrix((v) => !v)}
          className="text-sm font-medium text-white/60 hover:text-white transition-colors"
        >
          {showMatrix ? "▲ Esconder" : "▼ Ver"} matriz completa (todas as tarefas)
        </button>
        {showMatrix && (
          <div className="mt-3 overflow-x-auto animate-fade-in">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className="border border-white/10 bg-white/5 px-3 py-2 text-left font-semibold text-white/80">
                    Tarefa
                  </th>
                  {TOOLS.map((tool) => (
                    <th
                      key={tool.id}
                      className="border border-white/10 bg-white/5 px-3 py-2 text-center font-semibold text-white/80"
                    >
                      <span className="mr-1" aria-hidden>
                        {tool.icon}
                      </span>
                      {tool.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TASKS.map((t) => (
                  <tr key={t.id}>
                    <td className="border border-white/10 px-3 py-2 text-white/80">
                      <span className="mr-1.5" aria-hidden>
                        {t.icon}
                      </span>
                      {t.label}
                    </td>
                    {TOOLS.map((tool) => (
                      <td
                        key={tool.id}
                        className="border border-white/10 px-3 py-2 text-center"
                      >
                        <ScoreBadge score={t.ratings[tool.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[12px] leading-relaxed text-white/35">
        Guia baseado no contexto do nosso time e nas ferramentas disponíveis
        hoje. As IAs evoluem rápido — trate como ponto de partida, teste no seu
        caso real e ajuste. E lembre: a decisão final e a revisão são sempre do
        QA.
      </p>
    </div>
  );
}
