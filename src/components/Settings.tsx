import { useState } from "react";
import type { Profile } from "../db";
import { useLang } from "../i18n";
import LangToggle from "./LangToggle";

/** A quiet modal to adjust birthdate / expectancy after onboarding. */
export default function Settings({
  profile,
  onSave,
  onClose,
}: {
  profile: Profile;
  onSave: (birthdate: string, expectancyYears: number) => void;
  onClose: () => void;
}) {
  const { t } = useLang();
  const [birthdate, setBirthdate] = useState(profile.birthdate);
  const [expectancy, setExpectancy] = useState(profile.expectancyYears);
  const maxDate = new Date().toISOString().slice(0, 10);
  const valid = birthdate && birthdate <= maxDate && birthdate >= "1900-01-01";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dusk-deep/80 px-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-riseIn rounded-2xl border border-sand/20 bg-dusk-soft p-7 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl font-medium text-bone">{t.settings.title}</h2>
        <p className="mt-1 font-serif text-sm text-haze">{t.settings.privacy}</p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="font-sans text-xs uppercase tracking-[0.16em] text-haze">
            {t.lang.label}
          </span>
          <LangToggle />
        </div>

        <label className="mt-6 block font-sans text-xs uppercase tracking-[0.16em] text-haze">
          {t.settings.birthLabel}
        </label>
        <input
          type="date"
          value={birthdate}
          max={maxDate}
          min="1900-01-01"
          onChange={(e) => setBirthdate(e.target.value)}
          className="mt-2 w-full rounded-xl border border-sand/25 bg-dusk-deep/60 px-4 py-2.5 font-sans text-bone outline-none focus:border-sand"
          style={{ colorScheme: "dark" }}
        />

        <label className="mt-5 block font-sans text-xs uppercase tracking-[0.16em] text-haze">
          {t.settings.expectancyLabel(expectancy)}
        </label>
        <input
          type="range"
          min={40}
          max={110}
          value={expectancy}
          onChange={(e) => setExpectancy(Number(e.target.value))}
          className="mt-2 w-full accent-rose"
        />

        <div className="mt-7 flex justify-end gap-3">
          <button onClick={onClose} className="font-sans text-sm text-haze hover:text-bone">
            {t.settings.cancel}
          </button>
          <button
            disabled={!valid}
            onClick={() => valid && onSave(birthdate, expectancy)}
            className="rounded-full bg-sand px-6 py-2.5 font-sans text-sm font-semibold text-dusk-deep transition enabled:hover:bg-sand-light disabled:opacity-40"
          >
            {t.settings.save}
          </button>
        </div>
      </div>
    </div>
  );
}
