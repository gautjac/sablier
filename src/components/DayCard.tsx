import { useEffect, useRef, useState } from "react";
import { db, type DailyAnswer } from "../db";
import { fetchReframe } from "../api";
import { FAMILY_LABEL, type Prompt } from "../prompts";
import { frLongDate, todayISO } from "../time";

/**
 * La carte du jour — the signature. One reflective prompt for today, a single
 * ruled line to answer, saved per day. A small optional "lueur" button asks
 * Claude for a tender reframe / reply — but the card works fully offline.
 */
export default function DayCard({
  prompt,
  existing,
  onSaved,
}: {
  prompt: Prompt;
  existing: DailyAnswer | undefined;
  onSaved: () => void;
}) {
  const today = todayISO();
  const [answer, setAnswer] = useState(existing?.answer ?? "");
  const [reframe, setReframe] = useState(existing?.reframe ?? "");
  const [savedTick, setSavedTick] = useState(false);
  const [loadingReframe, setLoadingReframe] = useState(false);
  const [reframeError, setReframeError] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // keep local state in sync if the day's row changes underneath us
  useEffect(() => {
    setAnswer(existing?.answer ?? "");
    setReframe(existing?.reframe ?? "");
  }, [existing?.date, existing?.answer, existing?.reframe]);

  // autosize the textarea
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.max(ta.scrollHeight, 84)}px`;
  }, [answer]);

  async function save(nextReframe?: string) {
    const row: DailyAnswer = {
      date: today,
      promptId: prompt.id,
      answer: answer.trim(),
      reframe: (nextReframe ?? reframe) || undefined,
      updatedAt: new Date().toISOString(),
    };
    await db.answers.put(row);
    setSavedTick(true);
    window.setTimeout(() => setSavedTick(false), 1600);
    onSaved();
  }

  async function askLueur(mode: "reframe" | "respond") {
    setLoadingReframe(true);
    setReframeError("");
    try {
      const res = await fetchReframe({
        mode,
        prompt: prompt.text,
        answer: answer.trim() || undefined,
      });
      setReframe(res.text);
      // persist the reframe alongside whatever's written
      await save(res.text);
    } catch {
      setReframeError(
        "La lueur n'est pas venue cette fois — mais la carte t'attend, hors-ligne, comme toujours.",
      );
    } finally {
      setLoadingReframe(false);
    }
  }

  const hasAnswer = answer.trim().length > 0;

  return (
    <article className="relative mx-auto w-full max-w-2xl animate-riseIn">
      <div className="relative overflow-hidden rounded-[26px] border border-sand/20 bg-gradient-to-b from-dusk-soft/80 to-dusk-deep/90 p-7 shadow-card sm:p-10">
        {/* corner glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sand/10 blur-3xl" />

        <header className="flex items-baseline justify-between gap-3">
          <span className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-sand/80">
            La carte du jour
          </span>
          <span className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-haze/70">
            {FAMILY_LABEL[prompt.family]}
          </span>
        </header>

        <p className="mt-2 font-sans text-xs text-haze/70">{frLongDate(today)}</p>

        <h2 className="mt-6 font-display text-3xl font-medium leading-[1.25] text-bone sm:text-[2.5rem]">
          {prompt.text}
        </h2>

        {prompt.source && (
          <p className="mt-4 font-serif text-sm italic text-haze/80">{prompt.source}</p>
        )}

        <div className="mt-8">
          <textarea
            ref={taRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onBlur={() => (hasAnswer || existing) && save()}
            placeholder="Une ligne, un souffle, ce qui vient…"
            rows={2}
            className="writeline px-1 text-2xl"
            aria-label="Ta réponse du jour"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => save()}
            className="rounded-full bg-sand px-6 py-2.5 font-sans text-sm font-semibold text-dusk-deep transition hover:bg-sand-light hover:shadow-glow"
          >
            {savedTick ? "Déposé ✓" : "Déposer dans le sable"}
          </button>

          <button
            onClick={() => askLueur(hasAnswer ? "respond" : "reframe")}
            disabled={loadingReframe}
            className="rounded-full border border-sand/30 px-5 py-2.5 font-sans text-sm text-sand transition hover:border-sand/60 hover:bg-sand/5 disabled:opacity-50"
            title="Une touche d'IA, facultative — la carte fonctionne sans elle."
          >
            {loadingReframe
              ? "…"
              : hasAnswer
                ? "Une lueur en retour"
                : "Un autre angle"}
          </button>
        </div>

        {reframeError && (
          <p className="mt-4 font-serif text-sm text-rose-soft/90">{reframeError}</p>
        )}

        {reframe && (
          <blockquote className="mt-6 animate-fadeIn border-l-2 border-rose/50 pl-4 font-serif text-lg italic leading-relaxed text-sand-light/90">
            {reframe}
            <footer className="mt-2 font-sans text-[0.65rem] uppercase not-italic tracking-[0.18em] text-haze/60">
              une lueur · facultative
            </footer>
          </blockquote>
        )}
      </div>
    </article>
  );
}
