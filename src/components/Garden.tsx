import type { Streak } from "../db";
import Hourglass from "./Hourglass";

/**
 * The garden of kept cards — a small constellation of grains, one per answered
 * day (capped visually), beside the filling sablier. Tender encouragement, no
 * pressure: a missed day is never punished.
 */
export default function Garden({ streak }: { streak: Streak }) {
  // the hourglass fills toward a gentle goal of ~30 kept days, then keeps a glow
  const goal = 30;
  const fill = Math.min(1, streak.totalAnswered / goal);

  // up to 49 grains in a soft 7x7 bloom
  const shown = Math.min(streak.totalAnswered, 49);
  const grains = Array.from({ length: 49 }, (_, i) => i < shown);

  return (
    <section className="grid items-center gap-8 rounded-2xl border border-sand/15 bg-dusk-soft/40 p-7 sm:grid-cols-[auto_1fr]">
      <div className="flex justify-center">
        <Hourglass fill={Math.max(0.08, fill)} size={104} label="le sablier" />
      </div>

      <div>
        <h3 className="font-display text-2xl font-medium text-bone">Ton jardin de cartes</h3>
        <p className="mt-1 font-serif text-haze">
          Chaque jour où tu réponds dépose un grain. Le sablier se remplit, sans
          hâte.
        </p>

        <div className="mt-5 grid grid-cols-7 gap-2" style={{ maxWidth: 220 }}>
          {grains.map((on, i) => (
            <span
              key={i}
              className={
                on
                  ? "h-4 w-4 rounded-full bg-gradient-to-br from-sand-light to-sand-deep shadow-[0_0_8px_rgba(231,185,138,0.5)]"
                  : "h-4 w-4 rounded-full border border-sand/20"
              }
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-6 font-sans">
          <Figure n={streak.current} label="jours de suite" />
          <Figure n={streak.longest} label="plus longue ritournelle" />
          <Figure n={streak.totalAnswered} label="cartes déposées" />
        </div>

        {streak.current === 0 && streak.totalAnswered > 0 && (
          <p className="mt-4 font-serif text-sm italic text-haze/80">
            Une pause n'efface rien. Les grains déjà déposés restent. Reviens
            quand tu veux.
          </p>
        )}
      </div>
    </section>
  );
}

function Figure({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="tnum font-display text-3xl font-medium text-sand">{n}</p>
      <p className="text-xs uppercase tracking-[0.14em] text-haze/70">{label}</p>
    </div>
  );
}
