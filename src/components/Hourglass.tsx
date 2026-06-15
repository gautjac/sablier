import { usePrefersReducedMotion } from "../hooks";

/**
 * The sablier motif. The lower bulb fills with sand as the ritual is kept
 * (`fill` 0..1), a small mound that grows. A faint trickle falls through the
 * neck when motion is allowed. Gentle, ornamental, calm.
 */
export default function Hourglass({
  fill,
  size = 132,
  label,
}: {
  /** 0..1 — how full the lower bulb is (e.g. answered / goal) */
  fill: number;
  size?: number;
  label?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const f = Math.max(0, Math.min(1, fill));
  // lower bulb interior spans roughly y=128..190; mound height grows with f
  const floor = 190;
  const maxMound = 60;
  const mound = maxMound * f;
  const moundTop = floor - mound;

  return (
    <figure className="flex flex-col items-center gap-2" style={{ width: size }}>
      <svg
        viewBox="0 0 120 220"
        width={size}
        height={size * (220 / 120)}
        role="img"
        aria-label={label ?? "Sablier"}
        className="drop-shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
      >
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#322a55" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#15112a" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4e3c8" />
            <stop offset="100%" stopColor="#d49a63" />
          </linearGradient>
          <linearGradient id="sandTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e7b98a" />
            <stop offset="100%" stopColor="#caa06f" />
          </linearGradient>
          <clipPath id="lowerBulb">
            <path d="M30 110 L90 110 L60 150 Z M60 150 L84 196 Q60 206 36 196 Z" />
          </clipPath>
          <clipPath id="upperBulb">
            <path d="M36 24 Q60 14 84 24 L60 70 Z M60 70 L90 110 L30 110 Z" />
          </clipPath>
        </defs>

        {/* wood caps */}
        <rect x="22" y="10" width="76" height="9" rx="4.5" fill="#7a5a3c" />
        <rect x="22" y="201" width="76" height="9" rx="4.5" fill="#7a5a3c" />

        {/* glass body */}
        <path
          d="M36 24 Q60 14 84 24 L60 70 Z M60 70 L90 110 L84 196 Q60 206 36 196 L30 110 Z"
          fill="url(#glass)"
          stroke="rgba(247,241,230,0.28)"
          strokeWidth="1.4"
        />

        {/* remaining sand in the UPPER bulb (inverse of fill) */}
        <g clipPath="url(#upperBulb)">
          <rect
            x="30"
            y={24 + (1 - f) * 0 /* keep upper visually present */}
            width="60"
            height={Math.max(0, (1 - f) * 86)}
            fill="url(#sandTop)"
            opacity="0.92"
            transform={`translate(0 ${24})`}
          />
        </g>

        {/* mound in the LOWER bulb (grows with fill) */}
        <g clipPath="url(#lowerBulb)">
          <rect x="30" y={moundTop} width="60" height={mound + 4} fill="url(#sand)" />
          {/* soft mound crest */}
          <ellipse cx="60" cy={moundTop} rx={10 + 14 * f} ry="4" fill="#f4e3c8" opacity="0.6" />
        </g>

        {/* the neck trickle */}
        {!reduced && f < 1 && (
          <line
            x1="60"
            y1="112"
            x2="60"
            y2={moundTop}
            stroke="#f4e3c8"
            strokeWidth="1.3"
            strokeDasharray="1 5"
            className="animate-breathe"
          />
        )}

        {/* glass highlight */}
        <path
          d="M40 28 Q44 60 58 70"
          fill="none"
          stroke="rgba(247,241,230,0.3)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <figcaption className="font-sans text-xs uppercase tracking-[0.18em] text-haze">
          {label}
        </figcaption>
      )}
    </figure>
  );
}
