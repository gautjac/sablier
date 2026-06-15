import { useState } from "react";
import Hourglass from "./Hourglass";

/**
 * Light, warm first-run. One question: your birthdate (and, gently tucked away,
 * your life expectancy). No account, no fuss — it lives only on this device.
 */
export default function Onboarding({
  onDone,
}: {
  onDone: (birthdate: string, expectancyYears: number) => void;
}) {
  const [step, setStep] = useState<0 | 1>(0);
  const [birthdate, setBirthdate] = useState("");
  const [expectancy, setExpectancy] = useState(80);
  const [showExpectancy, setShowExpectancy] = useState(false);

  const maxDate = new Date().toISOString().slice(0, 10);
  const valid = birthdate && birthdate <= maxDate && birthdate >= "1900-01-01";

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg animate-riseIn text-center">
        {step === 0 && (
          <>
            <div className="mb-8 flex justify-center">
              <Hourglass fill={0.18} size={120} />
            </div>
            <h1 className="font-display text-5xl font-medium tracking-tight text-bone sm:text-6xl">
              Sablier
            </h1>
            <p className="mx-auto mt-5 max-w-md font-serif text-lg leading-relaxed text-haze">
              Un instrument tendre de présence. La vie en semaines, une carte de
              réflexion chaque jour, et la lente, belle chute du sable.
            </p>
            <p className="mx-auto mt-3 max-w-sm font-serif italic text-sand/90">
              Non pas pour craindre le temps — pour l'habiter.
            </p>
            <button
              onClick={() => setStep(1)}
              className="mt-9 rounded-full bg-sand px-8 py-3 font-sans text-sm font-semibold tracking-wide text-dusk-deep transition hover:bg-sand-light hover:shadow-glow"
            >
              Commencer
            </button>
            <p className="mt-4 font-sans text-xs text-haze/70">
              Tout reste sur cet appareil. Aucun compte.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="font-display text-3xl font-medium text-bone sm:text-4xl">
              Quel jour le sable a-t-il commencé à couler?
            </h2>
            <p className="mt-3 font-serif text-haze">Ta date de naissance, une seule fois.</p>

            <div className="mx-auto mt-8 max-w-xs">
              <input
                type="date"
                value={birthdate}
                max={maxDate}
                min="1900-01-01"
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full rounded-xl border border-sand/25 bg-dusk-soft/70 px-4 py-3 text-center font-sans text-lg text-bone outline-none transition focus:border-sand"
                style={{ colorScheme: "dark" }}
              />

              {!showExpectancy ? (
                <button
                  onClick={() => setShowExpectancy(true)}
                  className="mt-5 font-sans text-xs text-haze underline-offset-4 hover:text-sand link-underline"
                >
                  Ajuster l'espérance de vie ({expectancy} ans)
                </button>
              ) : (
                <div className="mt-6 animate-fadeIn">
                  <label className="font-sans text-xs uppercase tracking-[0.18em] text-haze">
                    Espérance de vie : {expectancy} ans
                  </label>
                  <input
                    type="range"
                    min={40}
                    max={110}
                    value={expectancy}
                    onChange={(e) => setExpectancy(Number(e.target.value))}
                    className="mt-3 w-full accent-rose"
                  />
                  <p className="mt-2 font-serif text-xs italic text-haze/80">
                    Un repère, rien de plus. On peut le changer à tout moment.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-9 flex items-center justify-center gap-4">
              <button
                onClick={() => setStep(0)}
                className="font-sans text-sm text-haze hover:text-bone"
              >
                Retour
              </button>
              <button
                disabled={!valid}
                onClick={() => valid && onDone(birthdate, expectancy)}
                className="rounded-full bg-sand px-8 py-3 font-sans text-sm font-semibold tracking-wide text-dusk-deep transition enabled:hover:bg-sand-light enabled:hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
              >
                Entrer dans le sablier
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
