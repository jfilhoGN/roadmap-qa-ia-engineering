import Nav from "@/components/Nav";
import RelatorioClient from "@/components/RelatorioClient";
import { requireAdmin } from "@/lib/auth";
import { getAllUsersProgress } from "@/lib/data";
import { TOTAL_TOPICS } from "@/data/roadmap";

export const metadata = { title: "Relatório — Roadmap de IA" };
export const dynamic = "force-dynamic";

export default async function RelatorioPage() {
  const session = await requireAdmin();
  const rows = await getAllUsersProgress();

  return (
    <>
      <Nav username={session.username} isAdmin={session.isAdmin} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <RelatorioClient rows={rows} totalTopics={TOTAL_TOPICS} />
      </main>
    </>
  );
}
