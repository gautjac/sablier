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
  /** language-independent season key; label/note come from the dictionary */
  seasonKey: SeasonKey;
  expectancyYears: number;
}

/** Stable, language-independent keys for the seasons of life. */
export type SeasonKey =
  | "aube"
  | "matin"
  | "avant-midi"
  | "midi"
  | "apres-midi"
  | "doree"
  | "crepuscule";

/** Map an age to a gentle "season of life" key, oriented toward presence. */
export function seasonForAge(age: number): SeasonKey {
  if (age < 13) return "aube";
  if (age < 20) return "matin";
  if (age < 33) return "avant-midi";
  if (age < 47) return "midi";
  if (age < 60) return "apres-midi";
  if (age < 73) return "doree";
  return "crepuscule";
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
    seasonKey: seasonForAge(ageYears),
    expectancyYears,
  };
}

/** The locale used for date/number formatting per language. */
function localeFor(lang: "fr" | "en"): string {
  return lang === "fr" ? "fr-CA" : "en-CA";
}

/** Pretty long date, e.g. "samedi 14 juin 2026" / "Saturday, June 14, 2026". */
export function longDate(iso: string, lang: "fr" | "en"): string {
  const d = parseISO(iso);
  return d.toLocaleDateString(localeFor(lang), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Month + year for a date, localized (e.g. "juin 2026" / "June 2026"). */
export function monthYear(d: Date, lang: "fr" | "en"): string {
  return d.toLocaleDateString(localeFor(lang), { month: "long", year: "numeric" });
}

/** A grouped integer, localized (FR thin spaces, EN commas). */
export function localNum(n: number, lang: "fr" | "en"): string {
  return Math.round(n).toLocaleString(localeFor(lang));
}

