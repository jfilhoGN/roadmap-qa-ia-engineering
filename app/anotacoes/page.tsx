import Nav from "@/components/Nav";
import NotesApp from "@/components/NotesApp";
import { requireUser } from "@/lib/auth";
import { getNotes } from "@/lib/data";

export const metadata = { title: "Anotações — Roadmap de IA para QAs" };
export const dynamic = "force-dynamic";

export default async function AnotacoesPage() {
  const session = await requireUser();
  const notes = await getNotes(session.uid);

  return (
    <>
      <Nav username={session.username} isAdmin={session.isAdmin} />
      <NotesApp initial={notes} />
    </>
  );
}
