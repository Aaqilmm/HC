import type { IncomingHttpHeaders } from "node:http";

export function authorized(headers: IncomingHttpHeaders, expected?: string): boolean {
  if (!expected) return true;
  const raw = headers.authorization;
  if (typeof raw !== "string") return false;
  if (!raw.startsWith("Bearer ")) return false;
  return timingSafeEqual(raw.slice(7), expected);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
