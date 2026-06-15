import type { Context } from "@netlify/functions";
import { generateReframe, type ReframeRequest } from "./lib/oracle.ts";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  let body: ReframeRequest;
  try {
    body = (await req.json()) as ReframeRequest;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const mode = body.mode === "respond" ? "respond" : "reframe";
  const lang = body.lang === "en" ? "en" : "fr";
  const prompt = (body.prompt ?? "").trim();
  if (!prompt)
    return json({ error: lang === "en" ? "No card provided." : "Aucune carte fournie." }, 400);

  // Haiku is fast, but we still stream NDJSON for resilience: a keepalive
  // newline every 3s, then a final { result } | { error } line. The client
  // reads to end-of-stream and parses the last JSON line.
  const enc = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let done = false;
      const beat = setInterval(() => {
        if (!done) {
          try {
            controller.enqueue(enc.encode("\n"));
          } catch {
            /* closed */
          }
        }
      }, 3000);

      try {
        const result = await generateReframe({
          mode,
          prompt,
          answer: body.answer,
          lang,
        });
        done = true;
        clearInterval(beat);
        controller.enqueue(enc.encode(JSON.stringify({ result }) + "\n"));
      } catch (err) {
        done = true;
        clearInterval(beat);
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        controller.enqueue(enc.encode(JSON.stringify({ error: message }) + "\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
};
