import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Profile } from "./db";
import { computeLifeStats, todayISO } from "./time";
import { promptForDate } from "./prompts";
import { getStreak, recomputeStreak } from "./streak";
import { useLang } from "./i18n";
import LangToggle from "./components/LangToggle";
import FallingSand from "./components/FallingSand";
import Onboarding from "./components/Onboarding";
import DayCard from "./components/DayCard";
import WeekGrid from "./components/WeekGrid";
import Stats from "./components/Stats";
import Garden from "./components/Garden";
import Settings from "./components/Settings";

const PROFILE_ID = 1;

type View = "jour" | "vie";

export default function App() {
  const { t, lang } = useLang();
  // Dexie's .get() resolves to `undefined` for a missing row, but we reserve
  // `undefined` for "still loading" — coalesce a missing profile to `null` so a
  // first-time visitor falls through to onboarding instead of hanging on the splash.
  const profile = useLiveQuery(
    () => db.profile.get(PROFILE_ID).then((p) => p ?? null),
    [],
    undefined,
  );
  const today = todayISO();
  const todayAnswer = useLiveQuery(() => db.answers.get(today), [today], undefined);
  const streak = useLiveQuery(() => getStreak(), [], undefined);

  const [view, setView] = useState<View>("jour");
  const [showSettings, setShowSettings] = useState(false);

  // recompute the streak once on mount (covers day-rollover since last visit)
  useEffect(() => {
    recomputeStreak();
  }, []);

  // profile === undefined → still loading; null → no row → onboard
  if (profile === undefined) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center">
        <p className="animate-breathe font-display text-2xl text-sand">{t.loading}</p>
      </main>
    );
  }

  async function completeOnboarding(birthdate: string, expectancyYears: number) {
    const row: Profile = {
      id: PROFILE_ID,
      birthdate,
      expectancyYears,
      createdAt: new Date().toISOString(),
    };
    await db.profile.put(row);
  }

  if (profile === null) {
    return (
      <>
        <FallingSand />
        <main className="relative z-10">
          <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
            <LangToggle />
          </div>
          <Onboarding onDone={completeOnboarding} />
        </main>
      </>
    );
  }

  async function saveProfile(birthdate: string, expectancyYears: number) {
    await db.profile.put({ ...profile!, birthdate, expectancyYears });
    setShowSettings(false);
  }

  const stats = computeLifeStats(profile.birthdate, profile.expectancyYears, today);
  const prompt = promptForDate(today, lang);

  return (
    <>
      <FallingSand />
      <div className="relative z-10 mx-auto min-h-[100dvh] max-w-4xl px-5 pb-24 pt-8 sm:px-8">
        {/* header */}
        <header className="flex items-center justify-between gap-3">
          <button
            onClick={() => setView("jour")}
            className="text-left"
            aria-label={t.nav.homeAria}
          >
            <h1 className="font-display text-2xl font-semibold tracking-tight text-bone">
              {t.appName}
            </h1>
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-haze/70">
              {t.tagline}
            </p>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-sand/20 bg-dusk-soft/50 p-1 font-sans text-sm">
              <Tab active={view === "jour"} onClick={() => setView("jour")}>
                {t.nav.day}
              </Tab>
              <Tab active={view === "vie"} onClick={() => setView("vie")}>
                {t.nav.life}
              </Tab>
            </div>
            <LangToggle />
          </div>
        </header>

        <div className="hairline my-7" />

        {view === "jour" ? (
          <div className="space-y-10">
            <DayCard
              prompt={prompt}
              existing={todayAnswer ?? undefined}
              onSaved={() => recomputeStreak()}
            />
            {streak && <Garden streak={streak} />}
          </div>
        ) : (
          <div className="space-y-12 animate-fadeIn">
            <section>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-3xl font-medium text-bone">
                  {t.life.title}
                </h2>
                <button
                  onClick={() => setShowSettings(true)}
                  className="font-sans text-xs text-haze hover:text-sand link-underline"
                >
                  {t.life.settingsLink(profile.expectancyYears)}
                </button>
              </div>
              <p className="mb-6 max-w-xl font-serif italic text-haze">
                {t.life.intro}
              </p>
              <WeekGrid stats={stats} birthdate={profile.birthdate} />
              <Legend />
            </section>

            <Stats stats={stats} />
          </div>
        )}

        <footer className="mt-16 text-center font-serif text-sm italic text-haze/60">
          {t.footer.quote}
        </footer>
      </div>

      {showSettings && (
        <Settings
          profile={profile}
          onSave={saveProfile}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-4 py-1.5 transition " +
        (active
          ? "bg-sand text-dusk-deep font-semibold"
          : "text-haze hover:text-bone")
      }
    >
      {children}
    </button>
  );
}

function Legend() {
  const { t } = useLang();
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-5 font-sans text-xs text-haze">
      <span className="flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-[3px] bg-sand/60" /> {t.life.legendLived}
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-[3px] bg-sand ring-2 ring-rose" />{" "}
        {t.life.legendCurrent}
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-[3px] border border-bone/25 bg-bone/5" />{" "}
        {t.life.legendAhead}
      </span>
    </div>
  );
}
