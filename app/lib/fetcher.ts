// frontend/lib/fetcher.ts
export async function apiFetch(path: string, opts: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL || ""; // must be set
  const res = await fetch(base + path, { ...opts, credentials: "include" });
  let data: any = null;
  try { data = await res.json(); } catch { data = null; }
  return { ok: res.ok, status: res.status, data };
}
