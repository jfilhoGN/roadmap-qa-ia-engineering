import Nav from "@/components/Nav";
import RoadmapClient from "@/components/RoadmapClient";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await requireUser();
  const done = await getProgress(session.uid);

  return (
    <>
      <Nav username={session.username} isAdmin={session.isAdmin} />
      <RoadmapClient initialDone={done} />
    </>
  );
}
