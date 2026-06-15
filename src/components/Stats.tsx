import { localNum, type LifeStats } from "../time";
import { useLang } from "../i18n";

/**
 * Stats that comfort, not scare. Weeks lived, the season of life, a gentle
 * percentage — every figure framed toward presence, never fear.
 */
export default function Stats({ stats }: { stats: LifeStats }) {
  const { t, lang } = useLang();
  const pct = stats.percentLived;
  const season = t.season[stats.seasonKey];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {/* Season of life — the warm centrepiece */}
      <div className="sm:col-span-3 rounded-2xl border border-sand/15 bg-dusk-soft/50 p-6 text-center">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-haze/70">
          {t.season.kicker}
        </p>
        <p className="mt-2 font-display text-4xl font-medium text-sand">{season.label}</p>
        <p className="mx-auto mt-2 max-w-md font-serif italic text-haze">{season.note}</p>
      </div>

      <Stat
        big={localNum(stats.weeksLived, lang)}
        label={t.stats.weeksLivedLabel}
        note={t.stats.weeksLivedNote}
      />
      <Stat
        big={t.stats.ageBig(stats.ageYears)}
        label={t.stats.ageLabel}
        note={t.stats.ageNote}
      />
      <Stat
        big={localNum(stats.weeksAhead, lang)}
        label={t.stats.weeksAheadLabel}
        note={t.stats.weeksAheadNote}
      />

      {/* the soft progress arc */}
      <div className="sm:col-span-3 rounded-2xl border border-sand/15 bg-dusk-soft/40 p-6">
        <div className="flex items-baseline justify-between">
          <p className="font-sans text-sm text-haze">
            {t.stats.progressLead}{" "}
            <span className="font-semibold text-sand">{pct.toFixed(1)} %</span>
          </p>
          <p className="font-sans text-xs text-haze/60">
            {t.stats.progressRight(stats.expectancyYears, localNum(stats.totalWeeks, lang))}
          </p>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-dusk-deep/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sand-light via-sand to-sand-deep transition-all duration-700"
            style={{ width: `${Math.max(2, pct)}%` }}
          />
        </div>
        <p className="mt-3 font-serif text-sm italic text-haze/80">
          {t.stats.progressNote}
        </p>
      </div>
    </section>
  );
}

function Stat({ big, label, note }: { big: string; label: string; note: string }) {
  return (
    <div className="rounded-2xl border border-sand/15 bg-dusk-soft/40 p-6 text-center">
      <p className="tnum font-display text-4xl font-medium text-bone">{big}</p>
      <p className="mt-1 font-sans text-xs uppercase tracking-[0.16em] text-sand/80">{label}</p>
      <p className="mt-2 font-serif text-sm italic text-haze/75">{note}</p>
    </div>
  );
}
