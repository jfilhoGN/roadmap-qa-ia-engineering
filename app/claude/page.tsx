import Nav from "@/components/Nav";
import RoadmapClient from "@/components/RoadmapClient";
import { CLAUDE_ROADMAP } from "@/data/claudeRoadmap";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/data";

export const metadata = { title: "Conhecendo o Claude — Roadmap de IA" };
export const dynamic = "force-dynamic";

// Trilha "Conhecendo o Claude": roadmap separado das lentes QA/Agilidade,
// cobrindo o ecossistema Claude (app, Claude Code, API, MCP, agentes) e o
// caminho de estudo rumo à certificação.
export default async function ClaudePage() {
  const session = await requireUser();
  const done = await getProgress(session.uid);

  return (
    <>
      <Nav username={session.username} isAdmin={session.isAdmin} />
      <RoadmapClient
        initialDone={done}
        view="claude"
        roadmapSections={CLAUDE_ROADMAP}
      />
    </>
  );
}
