/**
 * La carte du jour / Today's card — the curated deck, bilingual.
 *
 * A rotating set of gentle, well-aimed prompts drawn from Stoic practice,
 * the memento-mori tradition, and Nietzsche's eternal return. The aim is
 * presence and amor fati — tenderness, never dread.
 *
 * `source` attributes a real lineage where apt. Where a real quotation is
 * cited, it is a genuine, commonly-translated line (not fabricated); most
 * cards are original reflective prompts *inspired by* a tradition, and say so.
 *
 * Every card exists in BOTH French (Québécois) and English. The English
 * versions are faithful renderings that keep the same honesty about lineage —
 * no invented quotations, the same attributions.
 */

import type { Lang } from "./i18n";

export type PromptFamily = "retour" | "memento" | "stoic" | "gratitude" | "presence";

interface LocalizedPrompt {
  text: string;
  source?: string;
}

export interface PromptDef {
  id: string;
  family: PromptFamily;
  fr: LocalizedPrompt;
  en: LocalizedPrompt;
}

/** A prompt resolved into a single language, ready to render. */
export interface Prompt {
  id: string;
  family: PromptFamily;
  text: string;
  source?: string;
}

export const PROMPTS: PromptDef[] = [
  // — Nietzsche, l'éternel retour / the eternal return —
  {
    id: "retour-choisir",
    family: "retour",
    fr: {
      text: "Si ce jour devait revenir éternellement, à l'identique, le choisirais-tu? Qu'y changerais-tu, dès aujourd'hui?",
      source: "Inspiré de l'éternel retour de Nietzsche (Le Gai Savoir, §341).",
    },
    en: {
      text: "If this day were to return eternally, exactly as it is, would you choose it? What would you change, starting today?",
      source: "Inspired by Nietzsche's eternal return (The Gay Science, §341).",
    },
  },
  {
    id: "retour-poids",
    family: "retour",
    fr: {
      text: "Imagine qu'un démon te dise : « tu revivras cette vie, dans ses moindres détails, une infinité de fois. » Qu'est-ce que cette pensée allège en toi aujourd'hui?",
      source: "D'après l'image du « plus grand poids », Nietzsche.",
    },
    en: {
      text: "Imagine a demon tells you: “you will live this life again, in its every last detail, an infinite number of times.” What does that thought lighten in you today?",
      source: "After Nietzsche's image of “the greatest weight.”",
    },
  },
  {
    id: "retour-amor-fati",
    family: "retour",
    fr: {
      text: "Amor fati : aimer ce qui est. Quelle chose, dans ta journée d'hier, peux-tu cesser de combattre et commencer à aimer telle qu'elle est?",
      source: "Amor fati — « aimer son destin », cher à Nietzsche et aux stoïciens.",
    },
    en: {
      text: "Amor fati: to love what is. What one thing, from yesterday, can you stop fighting and begin to love just as it is?",
      source: "Amor fati — “to love one's fate,” dear to Nietzsche and the Stoics.",
    },
  },
  {
    id: "retour-encore",
    family: "retour",
    fr: {
      text: "Qu'est-ce que tu voudrais vivre encore, et encore, sans jamais t'en lasser? Comment en mettre un peu plus dans aujourd'hui?",
    },
    en: {
      text: "What would you want to live again, and again, never growing tired of it? How could you put a little more of it into today?",
    },
  },

  // — Memento mori —
  {
    id: "memento-souci",
    family: "memento",
    fr: {
      text: "Memento mori. À la lumière de ta finitude : qu'est-ce qui mérite vraiment ton souci aujourd'hui — et qu'est-ce qui n'en mérite aucun?",
      source: "Memento mori — « souviens-toi que tu es mortel », tradition stoïcienne et chrétienne.",
    },
    en: {
      text: "Memento mori. In the light of your finitude: what truly deserves your worry today — and what deserves none at all?",
      source: "Memento mori — “remember that you must die,” a Stoic and Christian tradition.",
    },
  },
  {
    id: "memento-dernier",
    family: "memento",
    fr: {
      text: "Si tu savais cette semaine précieuse et comptée, à qui tendrais-tu la main? Quel mot ne remettrais-tu pas à plus tard?",
    },
    en: {
      text: "If you knew this week to be precious and numbered, to whom would you reach out? What word would you not put off until later?",
    },
  },
  {
    id: "memento-vivere",
    family: "memento",
    fr: {
      text: "Memento vivere — souviens-toi de vivre. Qu'est-ce que tu as remis à « quand j'aurai le temps », et qui pourrait commencer aujourd'hui, en petit?",
      source: "Memento vivere, le contrepoint lumineux du memento mori.",
    },
    en: {
      text: "Memento vivere — remember to live. What have you put off until “when I have the time,” that could begin today, in some small way?",
      source: "Memento vivere, the luminous counterpoint to memento mori.",
    },
  },
  {
    id: "memento-trace",
    family: "memento",
    fr: {
      text: "Quand cette journée se déposera dans le sable, qu'aimerais-tu qu'elle ait laissé comme trace — même infime?",
    },
    en: {
      text: "When this day settles into the sand, what trace would you like it to have left — however faint?",
    },
  },

  // — Stoïcisme / Stoicism —
  {
    id: "stoic-controle",
    family: "stoic",
    fr: {
      text: "Qu'est-ce qui, aujourd'hui, dépend vraiment de toi — et qu'est-ce qui ne dépend pas de toi? Où peux-tu poser ce que tu portes en vain?",
      source: "La dichotomie du contrôle — Épictète, Manuel, I.",
    },
    en: {
      text: "What, today, truly depends on you — and what does not? Where can you set down what you've been carrying in vain?",
      source: "The dichotomy of control — Epictetus, Enchiridion, I.",
    },
  },
  {
    id: "stoic-vue-haut",
    family: "stoic",
    fr: {
      text: "Prends de la hauteur, comme du ciel. Vue d'en haut, quelle inquiétude d'aujourd'hui devient toute petite?",
      source: "La « vue d'en haut », exercice cher à Marc Aurèle.",
    },
    en: {
      text: "Rise up, as if into the sky. Seen from above, which of today's worries becomes very small?",
      source: "The “view from above,” an exercise dear to Marcus Aurelius.",
    },
  },
  {
    id: "stoic-matin",
    family: "stoic",
    fr: {
      text: "Au matin, on peut se dire : aujourd'hui je croiserai peut-être de la maladresse, de l'ingratitude. Comment veux-tu y répondre, avec douceur?",
      source: "D'après la préparation du matin, Marc Aurèle, Pensées, II.",
    },
    en: {
      text: "In the morning you might tell yourself: today I may meet with clumsiness, with ingratitude. How do you want to meet it — gently?",
      source: "After the morning preparation, Marcus Aurelius, Meditations, II.",
    },
  },
  {
    id: "stoic-assez",
    family: "stoic",
    fr: {
      text: "« Assez » est un seuil, pas un horizon. Qu'as-tu déjà, en ce moment même, qui suffirait à une journée heureuse?",
      source: "Inspiré de Sénèque sur la suffisance et la richesse intérieure.",
    },
    en: {
      text: "“Enough” is a threshold, not a horizon. What do you already have, in this very moment, that would suffice for a happy day?",
      source: "Inspired by Seneca on sufficiency and inner wealth.",
    },
  },
  {
    id: "stoic-temps",
    family: "stoic",
    fr: {
      text: "Sénèque écrivait que nous ne manquons pas de temps : nous en perdons beaucoup. À quoi as-tu offert ton temps hier — et à quoi veux-tu l'offrir aujourd'hui?",
      source: "D'après Sénèque, De la brièveté de la vie.",
    },
    en: {
      text: "Seneca wrote that we are not short of time — we waste a great deal of it. To what did you give your time yesterday — and to what do you want to give it today?",
      source: "After Seneca, On the Shortness of Life.",
    },
  },
  {
    id: "stoic-obstacle",
    family: "stoic",
    fr: {
      text: "« Ce qui fait obstacle à l'action fait avancer l'action. » Quel empêchement d'aujourd'hui pourrait devenir, en le retournant, un chemin?",
      source: "Marc Aurèle, Pensées, V, 20.",
    },
    en: {
      text: "“The impediment to action advances action.” Which of today's obstacles could become, if you turned it over, a path?",
      source: "Marcus Aurelius, Meditations, V, 20.",
    },
  },

  // — Gratitude —
  {
    id: "gratitude-trois",
    family: "gratitude",
    fr: {
      text: "Nomme trois choses, même minuscules, qui ont rendu hier supportable ou beau. Lesquelles reviendront aujourd'hui si tu y prêtes attention?",
    },
    en: {
      text: "Name three things, however tiny, that made yesterday bearable or beautiful. Which of them will return today, if you pay attention?",
    },
  },
  {
    id: "gratitude-perdre",
    family: "gratitude",
    fr: {
      text: "Imagine perdre, un instant, une chose ordinaire que tu tiens pour acquise — la voir, marcher, un visage aimé. La retrouver : qu'est-ce que ça change à ta journée?",
      source: "Variation sur l'imagination négative (premeditatio), exercice stoïcien.",
    },
    en: {
      text: "Imagine losing, for a moment, an ordinary thing you take for granted — your sight, walking, a beloved face. Then finding it again: what does that change about your day?",
      source: "A variation on negative visualization (premeditatio), a Stoic exercise.",
    },
  },
  {
    id: "gratitude-cadeau",
    family: "gratitude",
    fr: {
      text: "Si cette journée était un cadeau qu'on t'offre sans raison, comment voudrais-tu le déballer?",
    },
    en: {
      text: "If this day were a gift offered to you for no reason at all, how would you want to unwrap it?",
    },
  },

  // — Présence / Presence —
  {
    id: "presence-ici",
    family: "presence",
    fr: {
      text: "Reviens à ce moment-ci. Qu'est-ce que tu vois, entends, sens, là, maintenant, que tu n'avais pas remarqué?",
    },
    en: {
      text: "Come back to this moment. What do you see, hear, feel — right here, right now — that you hadn't noticed?",
    },
  },
  {
    id: "presence-lenteur",
    family: "presence",
    fr: {
      text: "Où pourrais-tu, aujourd'hui, ralentir d'un seul cran — et goûter davantage ce que tu fais déjà?",
    },
    en: {
      text: "Where could you, today, slow down by a single notch — and taste a little more of what you're already doing?",
    },
  },
  {
    id: "presence-corps",
    family: "presence",
    fr: {
      text: "Comment va ton corps aujourd'hui? De quoi aurait-il besoin que tu lui accordes, avec tendresse?",
    },
    en: {
      text: "How is your body today? What might it need you to grant it, tenderly?",
    },
  },
  {
    id: "presence-soir",
    family: "presence",
    fr: {
      text: "Au soir, on peut se demander : qu'ai-je bien fait? qu'ai-je manqué? que ferai-je mieux demain — sans me juger, seulement pour mieux voir?",
      source: "D'après l'examen du soir des stoïciens (Sénèque, De la colère, III).",
    },
    en: {
      text: "In the evening you might ask: what did I do well? what did I miss? what will I do better tomorrow — without judging myself, only to see more clearly?",
      source: "After the Stoics' evening review (Seneca, On Anger, III).",
    },
  },
];

/**
 * Pick the prompt for a given ISO date — deterministic, so the same day always
 * shows the same card, and the deck rotates without repeating until exhausted.
 * The selection is identical across languages: the same card appears on the
 * same day, simply rendered in the active language.
 */
export function promptForDate(iso: string, lang: Lang): Prompt {
  const def = promptDefForDate(iso);
  return resolvePrompt(def, lang);
}

/** The language-independent prompt definition for a date. */
export function promptDefForDate(iso: string): PromptDef {
  const [y, m, d] = iso.split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(y, (m ?? 1) - 1, d ?? 1) / 86_400_000);
  const idx = ((dayNumber % PROMPTS.length) + PROMPTS.length) % PROMPTS.length;
  return PROMPTS[idx];
}

/** Resolve a definition into a single language. */
export function resolvePrompt(def: PromptDef, lang: Lang): Prompt {
  const loc = def[lang];
  return { id: def.id, family: def.family, text: loc.text, source: loc.source };
}

export function promptDefById(id: string): PromptDef | undefined {
  return PROMPTS.find((p) => p.id === id);
}

export function promptById(id: string, lang: Lang): Prompt | undefined {
  const def = promptDefById(id);
  return def ? resolvePrompt(def, lang) : undefined;
}
