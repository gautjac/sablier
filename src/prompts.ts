/**
 * La carte du jour — the curated deck.
 *
 * A rotating set of gentle, well-aimed prompts drawn from Stoic practice,
 * the memento-mori tradition, and Nietzsche's eternal return. The aim is
 * presence and amor fati — tenderness, never dread.
 *
 * `source` attributes a real lineage where apt. Where a real quotation is
 * cited, it is a genuine, commonly-translated line (not fabricated); most
 * cards are original reflective prompts *inspired by* a tradition, and say so.
 */

export interface Prompt {
  id: string;
  /** the reflective question, in Québécois French */
  text: string;
  /** a short attribution / lineage note (optional) */
  source?: string;
  /** family, for a subtle label */
  family: "retour" | "memento" | "stoic" | "gratitude" | "presence";
}

export const PROMPTS: Prompt[] = [
  // — Nietzsche, l'éternel retour —
  {
    id: "retour-choisir",
    text: "Si ce jour devait revenir éternellement, à l'identique, le choisirais-tu? Qu'y changerais-tu, dès aujourd'hui?",
    source: "Inspiré de l'éternel retour de Nietzsche (Le Gai Savoir, §341).",
    family: "retour",
  },
  {
    id: "retour-poids",
    text: "Imagine qu'un démon te dise : « tu revivras cette vie, dans ses moindres détails, une infinité de fois. » Qu'est-ce que cette pensée allège en toi aujourd'hui?",
    source: "D'après l'image du « plus grand poids », Nietzsche.",
    family: "retour",
  },
  {
    id: "retour-amor-fati",
    text: "Amor fati : aimer ce qui est. Quelle chose, dans ta journée d'hier, peux-tu cesser de combattre et commencer à aimer telle qu'elle est?",
    source: "Amor fati — « aimer son destin », cher à Nietzsche et aux stoïciens.",
    family: "retour",
  },
  {
    id: "retour-encore",
    text: "Qu'est-ce que tu voudrais vivre encore, et encore, sans jamais t'en lasser? Comment en mettre un peu plus dans aujourd'hui?",
    family: "retour",
  },

  // — Memento mori —
  {
    id: "memento-souci",
    text: "Memento mori. À la lumière de ta finitude : qu'est-ce qui mérite vraiment ton souci aujourd'hui — et qu'est-ce qui n'en mérite aucun?",
    source: "Memento mori — « souviens-toi que tu es mortel », tradition stoïcienne et chrétienne.",
    family: "memento",
  },
  {
    id: "memento-dernier",
    text: "Si tu savais cette semaine précieuse et comptée, à qui tendrais-tu la main? Quel mot ne remettrais-tu pas à plus tard?",
    family: "memento",
  },
  {
    id: "memento-vivere",
    text: "Memento vivere — souviens-toi de vivre. Qu'est-ce que tu as remis à « quand j'aurai le temps », et qui pourrait commencer aujourd'hui, en petit?",
    source: "Memento vivere, le contrepoint lumineux du memento mori.",
    family: "memento",
  },
  {
    id: "memento-trace",
    text: "Quand cette journée se déposera dans le sable, qu'aimerais-tu qu'elle ait laissé comme trace — même infime?",
    family: "memento",
  },

  // — Stoïcisme —
  {
    id: "stoic-controle",
    text: "Qu'est-ce qui, aujourd'hui, dépend vraiment de toi — et qu'est-ce qui ne dépend pas de toi? Où peux-tu poser ce que tu portes en vain?",
    source: "La dichotomie du contrôle — Épictète, Manuel, I.",
    family: "stoic",
  },
  {
    id: "stoic-vue-haut",
    text: "Prends de la hauteur, comme du ciel. Vue d'en haut, quelle inquiétude d'aujourd'hui devient toute petite?",
    source: "La « vue d'en haut », exercice cher à Marc Aurèle.",
    family: "stoic",
  },
  {
    id: "stoic-matin",
    text: "Au matin, on peut se dire : aujourd'hui je croiserai peut-être de la maladresse, de l'ingratitude. Comment veux-tu y répondre, avec douceur?",
    source: "D'après la préparation du matin, Marc Aurèle, Pensées, II.",
    family: "stoic",
  },
  {
    id: "stoic-assez",
    text: "« Assez » est un seuil, pas un horizon. Qu'as-tu déjà, en ce moment même, qui suffirait à une journée heureuse?",
    source: "Inspiré de Sénèque sur la suffisance et la richesse intérieure.",
    family: "stoic",
  },
  {
    id: "stoic-temps",
    text: "Sénèque écrivait que nous ne manquons pas de temps : nous en perdons beaucoup. À quoi as-tu offert ton temps hier — et à quoi veux-tu l'offrir aujourd'hui?",
    source: "D'après Sénèque, De la brièveté de la vie.",
    family: "stoic",
  },
  {
    id: "stoic-obstacle",
    text: "« Ce qui fait obstacle à l'action fait avancer l'action. » Quel empêchement d'aujourd'hui pourrait devenir, en le retournant, un chemin?",
    source: "Marc Aurèle, Pensées, V, 20.",
    family: "stoic",
  },

  // — Gratitude —
  {
    id: "gratitude-trois",
    text: "Nomme trois choses, même minuscules, qui ont rendu hier supportable ou beau. Lesquelles reviendront aujourd'hui si tu y prêtes attention?",
    family: "gratitude",
  },
  {
    id: "gratitude-perdre",
    text: "Imagine perdre, un instant, une chose ordinaire que tu tiens pour acquise — la voir, marcher, un visage aimé. La retrouver : qu'est-ce que ça change à ta journée?",
    source: "Variation sur l'imagination négative (premeditatio), exercice stoïcien.",
    family: "gratitude",
  },
  {
    id: "gratitude-cadeau",
    text: "Si cette journée était un cadeau qu'on t'offre sans raison, comment voudrais-tu le déballer?",
    family: "gratitude",
  },

  // — Présence —
  {
    id: "presence-ici",
    text: "Reviens à ce moment-ci. Qu'est-ce que tu vois, entends, sens, là, maintenant, que tu n'avais pas remarqué?",
    family: "presence",
  },
  {
    id: "presence-lenteur",
    text: "Où pourrais-tu, aujourd'hui, ralentir d'un seul cran — et goûter davantage ce que tu fais déjà?",
    family: "presence",
  },
  {
    id: "presence-corps",
    text: "Comment va ton corps aujourd'hui? De quoi aurait-il besoin que tu lui accordes, avec tendresse?",
    family: "presence",
  },
  {
    id: "presence-soir",
    text: "Au soir, on peut se demander : qu'ai-je bien fait? qu'ai-je manqué? que ferai-je mieux demain — sans me juger, seulement pour mieux voir?",
    source: "D'après l'examen du soir des stoïciens (Sénèque, De la colère, III).",
    family: "presence",
  },
];

export const FAMILY_LABEL: Record<Prompt["family"], string> = {
  retour: "l'éternel retour",
  memento: "memento mori",
  stoic: "stoïcisme",
  gratitude: "gratitude",
  presence: "présence",
};

/**
 * Pick the prompt for a given ISO date — deterministic, so the same day always
 * shows the same card, and the deck rotates without repeating until exhausted.
 * We hash the date to an index; a day-count offset keeps neighbours different.
 */
export function promptForDate(iso: string): Prompt {
  // days since epoch (local-noon parse keeps it stable)
  const [y, m, d] = iso.split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(y, (m ?? 1) - 1, d ?? 1) / 86_400_000);
  const idx = ((dayNumber % PROMPTS.length) + PROMPTS.length) % PROMPTS.length;
  return PROMPTS[idx];
}

export function promptById(id: string): Prompt | undefined {
  return PROMPTS.find((p) => p.id === id);
}
