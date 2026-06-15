"use server";

import { redirect } from "next/navigation";
import {
  clearSession,
  getSession,
  hashPassword,
  setSession,
  verifyPassword,
} from "@/lib/auth";
import { getUserByUsername, setUserPassword } from "@/lib/data";

export type FormState = { error?: string };

export async function login(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return { error: "Informe usuário e senha." };

  const user = await getUserByUsername(username);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { error: "Usuário ou senha inválidos." };
  }

  await setSession({
    uid: user.id,
    username: user.username,
    isAdmin: user.is_admin,
    mc: user.must_change_password,
  });

  redirect(user.must_change_password ? "/trocar-senha" : "/");
}

export async function changePassword(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const p1 = String(formData.get("password") ?? "");
  const p2 = String(formData.get("confirm") ?? "");
  if (p1.length < 8) {
    return { error: "A nova senha deve ter ao menos 8 caracteres." };
  }
  if (p1 !== p2) return { error: "As senhas não coincidem." };

  await setUserPassword(session.uid, await hashPassword(p1));
  await setSession({ ...session, mc: false });
  redirect("/");
}

export async function logout(): Promise<void> {
  await clearSession();
  redirect("/login");
}
