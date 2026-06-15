"use server";

import { getSession } from "@/lib/auth";
import * as data from "@/lib/data";

async function currentUid(): Promise<string> {
  const s = await getSession();
  if (!s) throw new Error("Não autenticado");
  return s.uid;
}

// ---------- Progresso ----------
export async function toggleProgressAction(topicId: string, done: boolean) {
  await data.setProgress(await currentUid(), topicId, done);
}

export async function resetProgressAction() {
  await data.clearProgress(await currentUid());
}

// ---------- Anotações ----------
export async function createNoteAction(title: string) {
  const uid = await currentUid();
  await data.createNote(uid, title.trim() || "Sem título");
  return data.getNotes(uid);
}

export async function updateNoteAction(
  id: string,
  title: string,
  content: string,
) {
  await data.updateNote(
    await currentUid(),
    id,
    title.trim() || "Sem título",
    content,
  );
}

export async function deleteNoteAction(id: string) {
  const uid = await currentUid();
  await data.deleteNote(uid, id);
  return data.getNotes(uid);
}

// ---------- Anotação vinculada a um tópico (modal de estudo) ----------
export async function getTopicNoteAction(topicId: string) {
  return data.getNoteForTopic(await currentUid(), topicId);
}

export async function saveTopicNoteAction(
  topicId: string,
  title: string,
  content: string,
) {
  await data.upsertNoteForTopic(
    await currentUid(),
    topicId,
    title.trim() || "Sem título",
    content,
  );
}

// ---------- Próximos estudos ----------
export async function addStudyItemAction(text: string) {
  const uid = await currentUid();
  const trimmed = text.trim();
  if (trimmed) await data.addStudyItem(uid, trimmed);
  return data.getStudyItems(uid);
}

export async function toggleStudyItemAction(id: string, done: boolean) {
  const uid = await currentUid();
  await data.toggleStudyItem(uid, id, done);
  return data.getStudyItems(uid);
}

export async function deleteStudyItemAction(id: string) {
  const uid = await currentUid();
  await data.deleteStudyItem(uid, id);
  return data.getStudyItems(uid);
}
