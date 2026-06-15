import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "rqa_session";

export type SessionPayload = {
  uid: string;
  username: string;
  isAdmin: boolean;
  /** must change password */
  mc: boolean;
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
    };
  } catch {
    return null;
  }
}
