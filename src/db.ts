import Dexie, { type Table } from "dexie";

/** The single profile row (id = 1). Birthdate is an ISO date "YYYY-MM-DD". */
export interface Profile {
  id: number;
  birthdate: string; // ISO YYYY-MM-DD
  /** life expectancy in years; default 80 */
  expectancyYears: number;
  /** the moment onboarding was completed (ISO) */
  createdAt: string;
}

/** One reflective card per calendar day, keyed by the day's ISO date. */
export interface DailyAnswer {
  /** ISO date "YYYY-MM-DD" — the day the card belongs to */
  date: string;
  /** index of the prompt shown that day (into the curated deck) */
  promptId: string;
  /** the user's written answer (may be empty if only opened) */
  answer: string;
  /** an optional gentle reframe returned by Claude (offline-optional) */
  reframe?: string;
  updatedAt: string; // ISO datetime
}

/** Free-form key/value settings (theme prefs, motion, etc.). */
export interface Setting {
  key: string;
  value: string;
}

/** A running record of the ritual — kept as a tiny single row (id = 1). */
export interface Streak {
  id: number;
  /** total number of days a card was answered */
  totalAnswered: number;
  /** current consecutive-day streak */
  current: number;
  /** longest consecutive-day streak ever */
  longest: number;
  /** ISO date of the most recent answered day */
  lastAnsweredDate: string | null;
}

class SablierDB extends Dexie {
  profile!: Table<Profile, number>;
  answers!: Table<DailyAnswer, string>;
  settings!: Table<Setting, string>;
  streak!: Table<Streak, number>;

  constructor() {
    super("sablier");
    this.version(1).stores({
      profile: "id",
      answers: "date, promptId",
      settings: "key",
      streak: "id",
    });
  }
}

export const db = new SablierDB();

/** Read a setting, falling back to a default. */
export async function getSetting(key: string, fallback: string): Promise<string> {
  const row = await db.settings.get(key);
  return row?.value ?? fallback;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.settings.put({ key, value });
}
