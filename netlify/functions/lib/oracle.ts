import Anthropic from "@anthropic-ai/sdk";

const FAST = "claude-haiku-4-5"; // low-latency, tender garnish

function client(): Anthropic {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("Server missing CLAUDE_API_KEY");
  return new Anthropic({ apiKey, baseURL: "https://api.anthropic.com" });
}

export type ReframeMode = "reframe" | "respond";

export interface ReframeRequest {
  mode: ReframeMode;
  prompt: string;
  answer?: string;
}

export interface ReframeResult {
  text: string;
}

const SYSTEM = `Tu es la voix douce de « Sablier », un instrument de présence et de finitude tendre.
Tu écris en français québécois, simple et chaleureux. Jamais morbide, jamais anxiogène : tu orientes vers la présence, la gratitude et l'amor fati (« aimer ce qui est »).

Règles :
- Réponds en 1 à 3 phrases, courtes, calmes, comme un souffle.
- Tutoie la personne, avec douceur, sans la sermonner.
- N'invente jamais de fausses citations. Tu peux évoquer une idée stoïcienne ou de l'éternel retour, mais sans attribuer de phrase exacte à quelqu'un.
- Pas de listes, pas de titres, pas d'emojis. Seulement de la prose tendre.
- Ne promets rien, ne diagnostique rien. Tu offres une simple lueur, pas un conseil pressant.`;

function userPrompt(req: ReframeRequest): string {
  if (req.mode === "respond" && req.answer && req.answer.trim()) {
    return `La carte du jour demandait :
« ${req.prompt} »

La personne a répondu :
« ${req.answer.trim()} »

Offre-lui une brève réflexion tendre en retour : reconnais ce qu'elle a écrit, puis ouvre doucement une porte vers la présence. 1 à 3 phrases.`;
  }
  return `La carte du jour demande :
« ${req.prompt} »

Offre un autre angle, doux et frais, pour aborder cette question aujourd'hui — une invitation tendre à la présence, sans répéter la question mot pour mot. 1 à 3 phrases.`;
}

export async function generateReframe(req: ReframeRequest): Promise<ReframeResult> {
  const c = client();
  const msg = await c.messages.create({
    model: FAST,
    max_tokens: 320,
    temperature: 0.85,
    system: SYSTEM,
    messages: [{ role: "user", content: userPrompt(req) }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  if (!text) throw new Error("Aucune réflexion générée.");
  return { text };
}
