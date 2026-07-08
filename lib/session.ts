import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "rqa_session";

export type SessionArea = "qa" | "agilidade";

export type SessionPayload = {
  uid: string;
  username: string;
  isAdmin: boolean;
  /** must change password */
  mc: boolean;
  /** área/trilha do colaborador */
  area: SessionArea;
};

const encoder = new TextEncoder();

function secretKey(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET não definida");
  return encoder.encode(s);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifySession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return {
      uid: String(payload.uid),
      username: String(payload.username),
      isAdmin: Boolean(payload.isAdmin),
      mc: Boolean(payload.mc),
      // sessões antigas (emitidas antes da coluna area) caem em 'qa'
      area: payload.area === "agilidade" ? "agilidade" : "qa",
    };
  } catch {
    return null;
  }
}
