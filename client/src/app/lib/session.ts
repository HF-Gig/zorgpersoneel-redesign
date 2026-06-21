export interface Session { email: string; }

const KEY = "zp_portal_session";

export function getSession(): Session | null {
  try { const r = sessionStorage.getItem(KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
export function setSession(email: string): void {
  try { sessionStorage.setItem(KEY, JSON.stringify({ email })); } catch {}
}
export function clearSession(): void {
  try { sessionStorage.removeItem(KEY); } catch {}
}
