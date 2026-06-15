import Nav from "@/components/Nav";
import StudyList from "@/components/StudyList";
import { requireUser } from "@/lib/auth";
import { getStudyItems } from "@/lib/data";

export const metadata = { title: "Próximos estudos — Roadmap de IA para QAs" };
export const dynamic = "force-dynamic";

export default async function EstudosPage() {
  const session = await requireUser();
  const items = await getStudyItems(session.uid);

  return (
    <>
      <Nav username={session.username} isAdmin={session.isAdmin} />
      <StudyList initial={items} />
    </>
  );
}
