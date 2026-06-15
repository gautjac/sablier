import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSetting, setSetting } from "./db";

/**
 * Sablier, fully bilingual. A single central dictionary + a tiny t() helper.
 *
 * The language is persisted two ways:
 *  - localStorage ("sablier.lang") so the very first paint is already correct,
 *    synchronously, before Dexie has a chance to resolve.
 *  - Dexie settings ("lang") so it travels with the rest of the device state.
 *
 * Default is Québécois French. A persistent toggle (FR ⇄ EN) lives in the
 * header and in Réglages / Settings.
 */

export type Lang = "fr" | "en";

export const LANGS: Lang[] = ["fr", "en"];
const LS_KEY = "sablier.lang";

/** Read the initial language synchronously (localStorage), default fr. */
export function initialLang(): Lang {
  if (typeof window === "undefined") return "fr";
  try {
    const v = window.localStorage.getItem(LS_KEY);
    if (v === "fr" || v === "en") return v;
  } catch {
    /* ignore */
  }
  return "fr";
}

/** A leaf is a string; a node may hold either function-strings or nested. */
type Dict = typeof FR;

/* ───────────────────────────── FRENCH (source) ───────────────────────────── */

const FR = {
  appName: "Sablier",
  tagline: "memento vivere",

  nav: {
    homeAria: "Sablier — accueil",
    day: "Le jour",
    life: "La vie",
  },

  loading: "Sablier…",

  lang: {
    label: "Langue",
    fr: "Français",
    en: "English",
    /** short codes for the compact toggle */
    frShort: "FR",
    enShort: "EN",
    toggleAria: "Changer de langue",
  },

  onboarding: {
    intro:
      "Un instrument tendre de présence. La vie en semaines, une carte de réflexion chaque jour, et la lente, belle chute du sable.",
    introItalic: "Non pas pour craindre le temps — pour l'habiter.",
    begin: "Commencer",
    privacy: "Tout reste sur cet appareil. Aucun compte.",
    birthQuestion: "Quel jour le sable a-t-il commencé à couler?",
    birthHint: "Ta date de naissance, une seule fois.",
    adjustExpectancy: (n: number) => `Ajuster l'espérance de vie (${n} ans)`,
    expectancyLabel: (n: number) => `Espérance de vie : ${n} ans`,
    expectancyHint: "Un repère, rien de plus. On peut le changer à tout moment.",
    back: "Retour",
    enter: "Entrer dans le sablier",
  },

  dayCard: {
    kicker: "La carte du jour",
    placeholder: "Une ligne, un souffle, ce qui vient…",
    answerAria: "Ta réponse du jour",
    save: "Déposer dans le sable",
    saved: "Déposé ✓",
    glowRespond: "Une lueur en retour",
    glowReframe: "Un autre angle",
    glowTitle: "Une touche d'IA, facultative — la carte fonctionne sans elle.",
    glowError:
      "La lueur n'est pas venue cette fois — mais la carte t'attend, hors-ligne, comme toujours.",
    glowFooter: "une lueur · facultative",
  },

  garden: {
    title: "Ton jardin de cartes",
    intro:
      "Chaque jour où tu réponds dépose un grain. Le sablier se remplit, sans hâte.",
    hourglassLabel: "le sablier",
    current: "jours de suite",
    longest: "plus longue ritournelle",
    total: "cartes déposées",
    pauseNote:
      "Une pause n'efface rien. Les grains déjà déposés restent. Reviens quand tu veux.",
  },

  life: {
    title: "La vie en semaines",
    settingsLink: (n: number) => `Réglages · ${n} ans`,
    intro:
      "Une case par semaine. Celles que tu as vécues sont remplies de sable ; celle-ci, en rose, est maintenant ; les autres restent ouvertes. Survole une case pour la lire.",
    gridAria: (lived: number, total: number) =>
      `La vie en semaines : ${lived} semaines vécues sur ${total}.`,
    legendLived: "vécue",
    legendCurrent: "cette semaine",
    legendAhead: "à venir",
  },

  week: {
    /** hover read-out title, e.g. "12 ans · semaine 3" */
    title: (age: number, week: number) => `${age} ans · semaine ${week}`,
    lived: "vécue",
    current: "cette semaine-ci",
    ahead: "à venir",
  },

  season: {
    kicker: "Ta saison",
    aube: { label: "L'aube", note: "Tout commence. Le monde est encore entièrement neuf." },
    matin: { label: "Le matin", note: "La lumière monte. On apprend qui l'on devient." },
    "avant-midi": {
      label: "L'avant-midi",
      note: "L'élan des grands départs. Beaucoup de portes encore ouvertes.",
    },
    midi: { label: "Le plein midi", note: "Le soleil au zénith. La pleine force du jour, à savourer." },
    "apres-midi": {
      label: "L'après-midi",
      note: "La lumière s'incline et se fait plus douce, plus dorée.",
    },
    doree: {
      label: "L'heure dorée",
      note: "Le temps des récoltes et de la transmission. Une lumière chaude.",
    },
    crepuscule: {
      label: "Le crépuscule",
      note: "Le ciel se teinte. L'heure la plus belle, si on la regarde.",
    },
  },

  stats: {
    weeksLivedLabel: "semaines déjà vécues",
    weeksLivedNote: "autant de dimanches, de matins, de chansons.",
    ageBig: (n: number) => `${n} ans`,
    ageLabel: "d'expérience accumulée",
    ageNote: "rien de tout cela ne se reprend — et c'est bien.",
    weeksAheadLabel: "semaines encore ouvertes",
    weeksAheadNote: "autant d'invitations à être présent.",
    progressLead: "Le sable a coulé d'environ",
    progressRight: (years: number, weeks: string) => `sur ~${years} ans · ${weeks} semaines`,
    progressNote:
      "Ce n'est pas un compte à rebours. C'est une mesure de tout ce que tu as déjà eu la chance de traverser — et de ce qui reste à goûter.",
  },

  settings: {
    title: "Réglages",
    privacy: "Tout reste sur cet appareil.",
    birthLabel: "Date de naissance",
    expectancyLabel: (n: number) => `Espérance de vie : ${n} ans`,
    cancel: "Annuler",
    save: "Enregistrer",
  },

  footer: {
    quote:
      "« Il n'est pas vrai que nous ayons peu de temps : la vérité, c'est que nous en perdons beaucoup. » — d'après Sénèque",
  },

  family: {
    retour: "l'éternel retour",
    memento: "memento mori",
    stoic: "stoïcisme",
    gratitude: "gratitude",
    presence: "présence",
  },
};

/* ───────────────────────────── ENGLISH ───────────────────────────── */

const EN: Dict = {
  appName: "Sablier",
  tagline: "memento vivere",

  nav: {
    homeAria: "Sablier — home",
    day: "The day",
    life: "The life",
  },

  loading: "Sablier…",

  lang: {
    label: "Language",
    fr: "Français",
    en: "English",
    frShort: "FR",
    enShort: "EN",
    toggleAria: "Change language",
  },

  onboarding: {
    intro:
      "A tender instrument of presence. Your life in weeks, a card to reflect on each day, and the slow, beautiful fall of the sand.",
    introItalic: "Not to fear time — but to inhabit it.",
    begin: "Begin",
    privacy: "Everything stays on this device. No account.",
    birthQuestion: "What day did the sand begin to fall?",
    birthHint: "Your date of birth, just once.",
    adjustExpectancy: (n: number) => `Adjust life expectancy (${n} years)`,
    expectancyLabel: (n: number) => `Life expectancy: ${n} years`,
    expectancyHint: "A landmark, nothing more. You can change it anytime.",
    back: "Back",
    enter: "Step into the hourglass",
  },

  dayCard: {
    kicker: "Today's card",
    placeholder: "A line, a breath, whatever comes…",
    answerAria: "Your answer for today",
    save: "Set it in the sand",
    saved: "Set ✓",
    glowRespond: "A glimmer in return",
    glowReframe: "Another angle",
    glowTitle: "An optional touch of AI — the card works without it.",
    glowError:
      "The glimmer didn't come this time — but the card is here for you, offline, as always.",
    glowFooter: "a glimmer · optional",
  },

  garden: {
    title: "Your garden of cards",
    intro:
      "Every day you answer lays down a grain. The hourglass fills, unhurried.",
    hourglassLabel: "the hourglass",
    current: "days in a row",
    longest: "longest refrain",
    total: "cards laid down",
    pauseNote:
      "A pause erases nothing. The grains you've already laid down remain. Come back whenever you like.",
  },

  life: {
    title: "Your life in weeks",
    settingsLink: (n: number) => `Settings · ${n} years`,
    intro:
      "One square per week. The weeks you've lived are filled with sand; this one, in rose, is now; the others stay open. Hover over a square to read it.",
    gridAria: (lived: number, total: number) =>
      `Your life in weeks: ${lived} weeks lived out of ${total}.`,
    legendLived: "lived",
    legendCurrent: "this week",
    legendAhead: "ahead",
  },

  week: {
    title: (age: number, week: number) => `age ${age} · week ${week}`,
    lived: "lived",
    current: "this very week",
    ahead: "ahead",
  },

  season: {
    kicker: "Your season",
    aube: { label: "The dawn", note: "Everything is beginning. The world is still entirely new." },
    matin: { label: "The morning", note: "The light is rising. You learn who you're becoming." },
    "avant-midi": {
      label: "Late morning",
      note: "The momentum of great departures. Many doors still open.",
    },
    midi: { label: "High noon", note: "The sun at its zenith. The full strength of the day, to savour." },
    "apres-midi": {
      label: "The afternoon",
      note: "The light leans and softens, growing more golden.",
    },
    doree: {
      label: "The golden hour",
      note: "The time of harvest and of handing on. A warm light.",
    },
    crepuscule: {
      label: "The dusk",
      note: "The sky takes on colour. The most beautiful hour, if you look at it.",
    },
  },

  stats: {
    weeksLivedLabel: "weeks already lived",
    weeksLivedNote: "that many Sundays, mornings, songs.",
    ageBig: (n: number) => (n === 1 ? `${n} year` : `${n} years`),
    ageLabel: "of experience gathered",
    ageNote: "none of it is taken back — and that's good.",
    weeksAheadLabel: "weeks still open",
    weeksAheadNote: "that many invitations to be present.",
    progressLead: "The sand has run out by about",
    progressRight: (years: number, weeks: string) => `over ~${years} years · ${weeks} weeks`,
    progressNote:
      "This is not a countdown. It's a measure of all you've already had the chance to live through — and of all that remains to be savoured.",
  },

  settings: {
    title: "Settings",
    privacy: "Everything stays on this device.",
    birthLabel: "Date of birth",
    expectancyLabel: (n: number) => `Life expectancy: ${n} years`,
    cancel: "Cancel",
    save: "Save",
  },

  footer: {
    quote:
      "“It is not that we have a short time to live, but that we waste much of it.” — after Seneca",
  },

  family: {
    retour: "the eternal return",
    memento: "memento mori",
    stoic: "stoicism",
    gratitude: "gratitude",
    presence: "presence",
  },
};

const DICTS: Record<Lang, Dict> = { fr: FR, en: EN };

/** Return the whole dictionary for a language (typed). */
export function dict(lang: Lang): Dict {
  return DICTS[lang];
}

/* ───────────────────────────── React wiring ───────────────────────────── */

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: Dict;
}

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => initialLang());

  // reflect <html lang> for a11y / correct hyphenation
  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  // Reconcile with Dexie once on mount: if localStorage had no value but Dexie
  // remembers a choice (e.g. localStorage was cleared), honour the stored one.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const hadLS =
        typeof window !== "undefined" && window.localStorage.getItem(LS_KEY) !== null;
      if (hadLS) return; // localStorage already won the first paint
      const stored = await getSetting("lang", "fr");
      if (cancelled) return;
      if ((stored === "fr" || stored === "en") && stored !== lang) {
        setLangState(stored);
        try {
          window.localStorage.setItem(LS_KEY, stored);
        } catch {
          /* ignore */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(LS_KEY, l);
    } catch {
      /* ignore */
    }
    // persist to Dexie too (best-effort, fire-and-forget)
    void setSetting("lang", l);
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "fr" ? "en" : "fr";
      try {
        window.localStorage.setItem(LS_KEY, next);
      } catch {
        /* ignore */
      }
      void setSetting("lang", next);
      return next;
    });
  }, []);

  const value = useMemo<LangCtx>(
    () => ({ lang, setLang, toggle, t: dict(lang) }),
    [lang, setLang, toggle],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}
