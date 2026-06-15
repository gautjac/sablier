import { frNum, type LifeStats } from "../time";

/**
 * Stats that comfort, not scare. Weeks lived, the season of life, a gentle
 * percentage — every figure framed toward presence, never fear.
 */
export default function Stats({ stats }: { stats: LifeStats }) {
  const pct = stats.percentLived;

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {/* Season of life — the warm centrepiece */}
      <div className="sm:col-span-3 rounded-2xl border border-sand/15 bg-dusk-soft/50 p-6 text-center">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-haze/70">
          Ta saison
        </p>
        <p className="mt-2 font-display text-4xl font-medium text-sand">{stats.season.label}</p>
        <p className="mx-auto mt-2 max-w-md font-serif italic text-haze">{stats.season.note}</p>
      </div>

      <Stat
        big={frNum(stats.weeksLived)}
        label="semaines déjà vécues"
        note="autant de dimanches, de matins, de chansons."
      />
      <Stat
        big={`${stats.ageYears} ans`}
        label="d'expérience accumulée"
        note="rien de tout cela ne se reprend — et c'est bien."
      />
      <Stat
        big={frNum(stats.weeksAhead)}
        label="semaines encore ouvertes"
        note="autant d'invitations à être présent."
      />

      {/* the soft progress arc */}
      <div className="sm:col-span-3 rounded-2xl border border-sand/15 bg-dusk-soft/40 p-6">
        <div className="flex items-baseline justify-between">
          <p className="font-sans text-sm text-haze">
            Le sable a coulé d'environ{" "}
            <span className="font-semibold text-sand">{pct.toFixed(1)} %</span>
          </p>
          <p className="font-sans text-xs text-haze/60">
            sur ~{stats.expectancyYears} ans · {frNum(stats.totalWeeks)} semaines
          </p>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-dusk-deep/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sand-light via-sand to-sand-deep transition-all duration-700"
            style={{ width: `${Math.max(2, pct)}%` }}
          />
        </div>
        <p className="mt-3 font-serif text-sm italic text-haze/80">
          Ce n'est pas un compte à rebours. C'est une mesure de tout ce que tu as
          déjà eu la chance de traverser — et de ce qui reste à goûter.
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
