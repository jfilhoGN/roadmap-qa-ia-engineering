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
export async function saveNotesAction(content: string) {
  await data.saveNotes(await currentUid(), content);
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
