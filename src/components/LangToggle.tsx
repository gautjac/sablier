import { useLang } from "../i18n";

/**
 * A compact, always-reachable FR ⇄ EN switch. Two pill-segments; the active
 * language is filled. Persisted via the LangProvider (localStorage + Dexie).
 */
export default function LangToggle() {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t.lang.toggleAria}
      className="flex items-center gap-0.5 rounded-full border border-sand/20 bg-dusk-soft/50 p-0.5 font-sans text-xs"
    >
      <Seg
        active={lang === "fr"}
        onClick={() => setLang("fr")}
        label={t.lang.fr}
      >
        {t.lang.frShort}
      </Seg>
      <Seg
        active={lang === "en"}
        onClick={() => setLang("en")}
        label={t.lang.en}
      >
        {t.lang.enShort}
      </Seg>
    </div>
  );
}

function Seg({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={
        "rounded-full px-2.5 py-1 font-semibold tracking-wide transition " +
        (active
          ? "bg-sand text-dusk-deep"
          : "text-haze hover:text-bone")
      }
    >
      {children}
    </button>
  );
}
