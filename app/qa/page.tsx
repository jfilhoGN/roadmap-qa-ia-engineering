import Nav from "@/components/Nav";
import RoadmapClient from "@/components/RoadmapClient";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/data";

export const metadata = { title: "IA para QAs — Roadmap de IA" };
export const dynamic = "force-dynamic";

// Trilha QA: mesmo mapa e progresso da home, com a lente de exemplos de QA.
export default async function QaTrackPage() {
  const session = await requireUser();
  const done = await getProgress(session.uid);

  return (
    <>
      <Nav username={session.username} isAdmin={session.isAdmin} />
      <RoadmapClient initialDone={done} view="qa" />
    </>
  );
}
