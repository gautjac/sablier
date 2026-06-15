/**
 * Optional, light garnish: ask Claude (haiku) for a gentle reframe or a tender
 * reply to today's answer. The app works FULLY offline without this — every
 * call is wrapped so a failure simply means "no garnish today."
 *
 * The function streams NDJSON: bare-newline keepalives during the call, then a
 * final { result } or { error } JSON line. We read to end and parse the last
 * non-empty line (and tolerate a plain-JSON response too).
 */

export type ReframeMode = "reframe" | "respond";

export interface ReframeRequest {
  mode: ReframeMode;
  /** the prompt text shown today */
  prompt: string;
  /** the user's written answer (may be empty for a fresh reframe) */
  answer?: string;
}

export interface ReframeResult {
  /** a short, tender reflection — 1 to 3 sentences, FR */
  text: string;
}

export async function fetchReframe(req: ReframeRequest): Promise<ReframeResult> {
  const res = await fetch("/api/sablier", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  const raw = await res.text();
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const last = lines[lines.length - 1] ?? "";

  let parsed: { result?: ReframeResult; error?: string } | ReframeResult | null = null;
  try {
    parsed = last ? JSON.parse(last) : null;
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    const msg =
      parsed && "error" in parsed && parsed.error ? parsed.error : `Erreur ${res.status}`;
    throw new Error(msg);
  }
  if (!parsed) throw new Error("Réponse invalide du serveur.");
  if ("error" in parsed && parsed.error) throw new Error(parsed.error);
  if ("result" in parsed && parsed.result) return parsed.result;
  if ("text" in parsed) return parsed as ReframeResult;
  throw new Error("Réponse invalide du serveur.");
}
