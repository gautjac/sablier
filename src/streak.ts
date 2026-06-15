import { db, type Streak } from "./db";
import { prevDayISO, todayISO } from "./time";

const STREAK_ID = 1;

/** Recompute the streak from the answered-days set, idempotently. */
export async function recomputeStreak(): Promise<Streak> {
  // an answer "counts" toward the garden if it has non-empty text
  const rows = await db.answers.toArray();
  const answeredDates = new Set(
    rows.filter((r) => r.answer.trim().length > 0).map((r) => r.date),
  );

  const totalAnswered = answeredDates.size;

  // longest run across all answered dates
  const sorted = [...answeredDates].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev && prevDayISO(d) === prev) run += 1;
    else run = 1;
    longest = Math.max(longest, run);
    prev = d;
  }

  // current streak: count back from today (or yesterday, if today not yet done)
  const today = todayISO();
  let cursor = answeredDates.has(today) ? today : prevDayISO(today);
  let current = 0;
  while (answeredDates.has(cursor)) {
    current += 1;
    cursor = prevDayISO(cursor);
  }

  const lastAnsweredDate = sorted.length ? sorted[sorted.length - 1] : null;

  const streak: Streak = {
    id: STREAK_ID,
    totalAnswered,
    current,
    longest: Math.max(longest, current),
    lastAnsweredDate,
  };
  await db.streak.put(streak);
  return streak;
}

export async function getStreak(): Promise<Streak> {
  const row = await db.streak.get(STREAK_ID);
  if (row) return row;
  return recomputeStreak();
}
