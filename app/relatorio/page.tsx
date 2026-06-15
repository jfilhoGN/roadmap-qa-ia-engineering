import Nav from "@/components/Nav";
import { requireAdmin } from "@/lib/auth";
import { getAllUsersProgress } from "@/lib/data";
import { TOTAL_TOPICS } from "@/data/roadmap";

export const metadata = { title: "Relatório — Roadmap de IA para QAs" };
export const dynamic = "force-dynamic";

export default async function RelatorioPage() {
  const session = await requireAdmin();
  const rows = await getAllUsersProgress();

  const totalConcluidos = rows.reduce((a, r) => a + r.completed, 0);
  const mediaPct = rows.length
    ? Math.round((totalConcluidos / (rows.length * TOTAL_TOPICS)) * 100)
    : 0;

  return (
    <>
      <Nav username={session.username} isAdmin={session.isAdmin} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            📊 Relatório de progresso
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Progresso de cada colaborador no roadmap ({TOTAL_TOPICS} tópicos).
            Média geral do time: <span className="text-white/80">{mediaPct}%</span>.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-white/60 text-left">
                <th className="px-4 py-3 font-semibold">Colaborador</th>
                <th className="px-4 py-3 font-semibold w-24 text-right">
                  Concluído
                </th>
                <th className="px-4 py-3 font-semibold w-1/3">Progresso</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const pct = Math.round((r.completed / TOTAL_TOPICS) * 100);
                return (
                  <tr
                    key={r.id}
                    className="border-t border-white/10 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 text-white/90">
                      {r.username}
                      {r.is_admin && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-amber-300/80 bg-amber-500/10 ring-1 ring-amber-400/30 rounded px-1.5 py-0.5">
                          admin
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-white/70 tabular-nums">
                      {r.completed}/{TOTAL_TOPICS}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-white/60 tabular-nums">
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-white/30">
          Visível apenas para administradores. Os dados vêm do progresso salvo
          por cada colaborador.
        </p>
      </main>
    </>
  );
}
