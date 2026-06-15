/** Calendar + life-in-weeks math, all tender and local. */

export const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
export const WEEKS_PER_YEAR = 52; // we draw 52 weeks/year for a clean grid

/** Today's local date as ISO "YYYY-MM-DD". */
export function todayISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse an ISO date at local noon (avoids DST/timezone edge slips). */
export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0);
}

/** Yesterday's ISO relative to a given ISO date. */
export function prevDayISO(iso: string): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() - 1);
  return todayISO(d);
}

/** Whole weeks elapsed between two ISO dates (can be fractional via float variant). */
export function weeksBetween(fromISO: string, toISO: string): number {
  const from = parseISO(fromISO).getTime();
  const to = parseISO(toISO).getTime();
  return Math.max(0, Math.floor((to - from) / MS_PER_WEEK));
}

export interface LifeStats {
  weeksLived: number;
  totalWeeks: number;
  weeksAhead: number;
  /** week index currently being lived (0-based) */
  currentWeekIndex: number;
  ageYears: number;
  percentLived: number; // 0..100
  /** the season-of-life label */
  season: Season;
  expectancyYears: number;
}

export interface Season {
  key: string;
  /** FR label */
  label: string;
  /** a tender one-liner about this season */
  note: string;
}

/** Map an age to a gentle "season of life," oriented toward presence. */
export function seasonForAge(age: number): Season {
  if (age < 13)
    return {
      key: "aube",
      label: "L'aube",
      note: "Tout commence. Le monde est encore entièrement neuf.",
    };
  if (age < 20)
    return {
      key: "matin",
      label: "Le matin",
      note: "La lumière monte. On apprend qui l'on devient.",
    };
  if (age < 33)
    return {
      key: "avant-midi",
      label: "L'avant-midi",
      note: "L'élan des grands départs. Beaucoup de portes encore ouvertes.",
    };
  if (age < 47)
    return {
      key: "midi",
      label: "Le plein midi",
      note: "Le soleil au zénith. La pleine force du jour, à savourer.",
    };
  if (age < 60)
    return {
      key: "apres-midi",
      label: "L'après-midi",
      note: "La lumière s'incline et se fait plus douce, plus dorée.",
    };
  if (age < 73)
    return {
      key: "doree",
      label: "L'heure dorée",
      note: "Le temps des récoltes et de la transmission. Une lumière chaude.",
    };
  return {
    key: "crepuscule",
    label: "Le crépuscule",
    note: "Le ciel se teinte. L'heure la plus belle, si on la regarde.",
  };
}

/** Compute the life-in-weeks statistics from a birthdate + expectancy. */
export function computeLifeStats(
  birthdateISO: string,
  expectancyYears: number,
  nowISO: string = todayISO(),
): LifeStats {
  const totalWeeks = Math.round(expectancyYears * WEEKS_PER_YEAR);
  const weeksLivedRaw = weeksBetween(birthdateISO, nowISO);
  const weeksLived = Math.min(weeksLivedRaw, totalWeeks);
  const currentWeekIndex = Math.min(weeksLivedRaw, totalWeeks - 1);
  const weeksAhead = Math.max(0, totalWeeks - weeksLived);

  const birth = parseISO(birthdateISO);
  const now = parseISO(nowISO);
  let ageYears = now.getFullYear() - birth.getFullYear();
  const monthDelta = now.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())) ageYears -= 1;
  ageYears = Math.max(0, ageYears);

  const percentLived = Math.min(100, (weeksLived / totalWeeks) * 100);

  return {
    weeksLived,
    totalWeeks,
    weeksAhead,
    currentWeekIndex,
    ageYears,
    percentLived,
    season: seasonForAge(ageYears),
    expectancyYears,
  };
}

/** Pretty French date, e.g. "samedi 14 juin 2026". */
export function frLongDate(iso: string): string {
  const d = parseISO(iso);
  return d.toLocaleDateString("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** A grouped integer with thin spaces, FR style (4 160). */
export function frNum(n: number): string {
  return Math.round(n).toLocaleString("fr-CA").replace(/ /g, " ");
}
