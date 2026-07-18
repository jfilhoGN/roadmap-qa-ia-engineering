import Nav from "@/components/Nav";
import NewsPills from "@/components/NewsPills";
import RoadmapClient from "@/components/RoadmapClient";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/data";

export const metadata = { title: "IA para Agilistas — Roadmap de IA" };
export const dynamic = "force-dynamic";

// Trilha Agilidade: mesmo mapa e progresso da home, com a lente de exemplos
// de Agilidade.
export default async function AgilidadeTrackPage() {
  const session = await requireUser();
  const done = await getProgress(session.uid);

  return (
    <>
      <Nav username={session.username} isAdmin={session.isAdmin} />
      <NewsPills />
      <RoadmapClient initialDone={done} view="agilidade" />
    </>
  );
}
