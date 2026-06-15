import "server-only";
import { sql } from "./db";

export type DbUser = {
  id: string;
  username: string;
  password_hash: string;
  is_admin: boolean;
  must_change_password: boolean;
};

export async function getUserByUsername(
  username: string,
): Promise<DbUser | null> {
  const rows = await sql<DbUser[]>`
    select id, username, password_hash, is_admin, must_change_password
    from users where username = ${username} limit 1`;
  return rows[0] ?? null;
}

export async function setUserPassword(
  userId: string,
  passwordHash: string,
): Promise<void> {
  await sql`
    update users
    set password_hash = ${passwordHash}, must_change_password = false
    where id = ${userId}`;
}

// ---------- Progresso ----------
export async function getProgress(userId: string): Promise<string[]> {
  const rows = await sql<{ topic_id: string }[]>`
    select topic_id from progress where user_id = ${userId}`;
  return rows.map((r) => r.topic_id);
}

export async function setProgress(
  userId: string,
  topicId: string,
  done: boolean,
): Promise<void> {
  if (done) {
    await sql`
      insert into progress (user_id, topic_id) values (${userId}, ${topicId})
      on conflict (user_id, topic_id) do nothing`;
  } else {
    await sql`
      delete from progress where user_id = ${userId} and topic_id = ${topicId}`;
  }
}

export async function clearProgress(userId: string): Promise<void> {
  await sql`delete from progress where user_id = ${userId}`;
}

// ---------- Anotações ----------
export async function getNotes(userId: string): Promise<string> {
  const rows = await sql<{ content: string }[]>`
    select content from notes where user_id = ${userId} limit 1`;
  return rows[0]?.content ?? "";
}

export async function saveNotes(
  userId: string,
  content: string,
): Promise<void> {
  await sql`
    insert into notes (user_id, content, updated_at)
    values (${userId}, ${content}, now())
    on conflict (user_id) do update
      set content = excluded.content, updated_at = now()`;
}

// ---------- Próximos estudos ----------
export type StudyItem = { id: string; text: string; done: boolean };

export async function getStudyItems(userId: string): Promise<StudyItem[]> {
  return await sql<StudyItem[]>`
    select id, text, done from study_items
    where user_id = ${userId}
    order by done asc, position asc, created_at asc`;
}

export async function addStudyItem(
  userId: string,
  text: string,
): Promise<void> {
  await sql`
    insert into study_items (user_id, text, position)
    values (${userId}, ${text},
      coalesce((select max(position) + 1 from study_items where user_id = ${userId}), 0))`;
}

export async function toggleStudyItem(
  userId: string,
  id: string,
  done: boolean,
): Promise<void> {
  await sql`
    update study_items set done = ${done}
    where id = ${id} and user_id = ${userId}`;
}

export async function deleteStudyItem(
  userId: string,
  id: string,
): Promise<void> {
  await sql`delete from study_items where id = ${id} and user_id = ${userId}`;
}

// ---------- Relatório (admin) ----------
export type UserProgressRow = {
  id: string;
  username: string;
  is_admin: boolean;
  completed: number;
};

export async function getAllUsersProgress(): Promise<UserProgressRow[]> {
  return await sql<UserProgressRow[]>`
    select u.id, u.username, u.is_admin,
           count(p.topic_id)::int as completed
    from users u
    left join progress p on p.user_id = u.id
    group by u.id, u.username, u.is_admin
    order by completed desc, u.username asc`;
}

export async function getCompletedTopicsByUser(
  userId: string,
): Promise<{ topic_id: string; completed_at: string }[]> {
  return await sql<{ topic_id: string; completed_at: string }[]>`
    select topic_id, completed_at from progress
    where user_id = ${userId} order by completed_at desc`;
}
