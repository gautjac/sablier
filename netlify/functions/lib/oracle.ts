import Anthropic from "@anthropic-ai/sdk";

const FAST = "claude-haiku-4-5"; // low-latency, tender garnish

function client(): Anthropic {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("Server missing CLAUDE_API_KEY");
  return new Anthropic({ apiKey, baseURL: "https://api.anthropic.com" });
}

export type ReframeMode = "reframe" | "respond";
export type Lang = "fr" | "en";

export interface ReframeRequest {
  mode: ReframeMode;
  prompt: string;
  answer?: string;
  lang?: Lang;
}

export interface ReframeResult {
  text: string;
}

const SYSTEM_FR = `Tu es la voix douce de « Sablier », un instrument de présence et de finitude tendre.
Tu écris en français québécois, simple et chaleureux. Jamais morbide, jamais anxiogène : tu orientes vers la présence, la gratitude et l'amor fati (« aimer ce qui est »).

Règles :
- Réponds en 1 à 3 phrases, courtes, calmes, comme un souffle.
- Tutoie la personne, avec douceur, sans la sermonner.
- N'invente jamais de fausses citations. Tu peux évoquer une idée stoïcienne ou de l'éternel retour, mais sans attribuer de phrase exacte à quelqu'un.
- Pas de listes, pas de titres, pas d'emojis. Seulement de la prose tendre.
- Ne promets rien, ne diagnostique rien. Tu offres une simple lueur, pas un conseil pressant.
- Réponds uniquement en français.`;

const SYSTEM_EN = `You are the gentle voice of "Sablier," an instrument of presence and tender finitude.
You write in simple, warm English. Never morbid, never anxiety-inducing: you turn toward presence, gratitude, and amor fati ("loving what is").

Rules:
- Reply in 1 to 3 short, calm sentences, like a breath.
- Address the person directly and warmly, without lecturing.
- Never invent false quotations. You may evoke a Stoic idea or the eternal return, but never attribute an exact sentence to anyone.
- No lists, no headings, no emojis. Only tender prose.
- Promise nothing, diagnose nothing. You offer a simple glimmer, not pressing advice.
- Reply only in English.`;

function userPromptFR(req: ReframeRequest): string {
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

function userPromptEN(req: ReframeRequest): string {
  if (req.mode === "respond" && req.answer && req.answer.trim()) {
    return `Today's card asked:
"${req.prompt}"

The person answered:
"${req.answer.trim()}"

Offer them a brief, tender reflection in return: acknowledge what they wrote, then gently open a door toward presence. 1 to 3 sentences.`;
  }
  return `Today's card asks:
"${req.prompt}"

Offer another angle — soft and fresh — for approaching this question today: a tender invitation to presence, without repeating the question word for word. 1 to 3 sentences.`;
}

export async function generateReframe(req: ReframeRequest): Promise<ReframeResult> {
  const lang: Lang = req.lang === "en" ? "en" : "fr";
  const c = client();
  const msg = await c.messages.create({
    model: FAST,
    max_tokens: 320,
    temperature: 0.85,
    system: lang === "en" ? SYSTEM_EN : SYSTEM_FR,
    messages: [
      { role: "user", content: lang === "en" ? userPromptEN(req) : userPromptFR(req) },
    ],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  if (!text) {
    throw new Error(lang === "en" ? "No reflection was generated." : "Aucune réflexion générée.");
  }
  return { text };
}
