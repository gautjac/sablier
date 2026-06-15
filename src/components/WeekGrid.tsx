import { useMemo, useRef, useState } from "react";
import { WEEKS_PER_YEAR, type LifeStats, monthYear, parseISO } from "../time";
import { useLang, type Lang } from "../i18n";

/**
 * La vie en semaines — a calm grid of one's life, 52 weeks per row, one row per
 * year. Rendered as a SINGLE <svg> (one <rect> per week, ~4,000 nodes inside one
 * SVG element — far lighter than 4,000 React/DOM components, and it pans/zooms as
 * one image). Weeks lived are softly filled; the current week glows; weeks ahead
 * are open. Hover/tap a cell to read which week it is.
 */

const CELL = 11; // px per cell at base
const GAP = 3;
const PAD = 8;

interface Hover {
  index: number;
  x: number;
  y: number;
}

export default function WeekGrid({
  stats,
  birthdate,
}: {
  stats: LifeStats;
  birthdate: string;
}) {
  const { t, lang } = useLang();
  const { totalWeeks, weeksLived, currentWeekIndex, expectancyYears } = stats;
  const years = Math.round(expectancyYears);
  const cols = WEEKS_PER_YEAR;
  const step = CELL + GAP;
  const width = PAD * 2 + cols * step - GAP;
  const height = PAD * 2 + years * step - GAP;

  const [hover, setHover] = useState<Hover | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Precompute the three rect groups as raw path-ish data once.
  const cells = useMemo(() => {
    const lived: string[] = [];
    const ahead: string[] = [];
    for (let i = 0; i < totalWeeks; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = PAD + col * step;
      const y = PAD + row * step;
      const r = `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2.5" />`;
      if (i < weeksLived) lived.push(r);
      else ahead.push(r);
    }
    return { lived: lived.join(""), ahead: ahead.join("") };
  }, [totalWeeks, weeksLived, cols, step]);

  // current-week marker position
  const curCol = currentWeekIndex % cols;
  const curRow = Math.floor(currentWeekIndex / cols);
  const curX = PAD + curCol * step;
  const curY = PAD + curRow * step;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    // map client coords into the viewBox space
    const vx = ((e.clientX - rect.left) / rect.width) * width;
    const vy = ((e.clientY - rect.top) / rect.height) * height;
    const col = Math.floor((vx - PAD) / step);
    const row = Math.floor((vy - PAD) / step);
    if (col < 0 || col >= cols || row < 0 || row >= years) {
      setHover(null);
      return;
    }
    const index = row * cols + col;
    if (index < 0 || index >= totalWeeks) {
      setHover(null);
      return;
    }
    setHover({ index, x: PAD + col * step + CELL / 2, y: PAD + row * step });
  }

  const hoverInfo = hover
    ? describeWeek(hover.index, birthdate, weeksLived, lang, t.week)
    : null;

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-[820px] touch-none"
        style={{ minWidth: 520 }}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={t.life.gridAria(weeksLived, totalWeeks)}
      >
        {/* weeks ahead — open, faint */}
        <g
          fill="rgba(247,241,230,0.07)"
          stroke="rgba(247,241,230,0.12)"
          strokeWidth="0.75"
          dangerouslySetInnerHTML={{ __html: cells.ahead }}
        />
        {/* weeks lived — warm sand, soft */}
        <g fill="rgba(231,185,138,0.62)" dangerouslySetInnerHTML={{ __html: cells.lived }} />

        {/* the current week — a gentle glow ring */}
        {currentWeekIndex < totalWeeks && (
          <>
            <rect
              x={curX - 1.5}
              y={curY - 1.5}
              width={CELL + 3}
              height={CELL + 3}
              rx="3.5"
              fill="none"
              stroke="#d98a8f"
              strokeWidth="1.6"
              className="animate-breathe"
            />
            <rect x={curX} y={curY} width={CELL} height={CELL} rx="2.5" fill="#e7b98a" />
          </>
        )}

        {/* hover highlight */}
        {hover && (
          <rect
            x={PAD + (hover.index % cols) * step}
            y={PAD + Math.floor(hover.index / cols) * step}
            width={CELL}
            height={CELL}
            rx="2.5"
            fill="none"
            stroke="#f7f1e6"
            strokeWidth="1.4"
          />
        )}
      </svg>

      {/* the floating read-out for the hovered week */}
      {hover && hoverInfo && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-sand/25 bg-dusk-deep/95 px-3 py-2 text-center font-sans text-xs text-bone shadow-lift backdrop-blur"
          style={{
            left: `${((hover.x / width) * 100).toFixed(2)}%`,
            top: `calc(${((hover.y / height) * 100).toFixed(2)}% - 6px)`,
            maxWidth: 220,
          }}
        >
          <div className="font-medium text-sand">{hoverInfo.title}</div>
          <div className="mt-0.5 text-haze">{hoverInfo.sub}</div>
        </div>
      )}
    </div>
  );
}

interface WeekDict {
  title: (age: number, week: number) => string;
  lived: string;
  current: string;
  ahead: string;
}

function describeWeek(
  index: number,
  birthdate: string,
  weeksLived: number,
  lang: Lang,
  week: WeekDict,
): { title: string; sub: string } {
  const ageYears = Math.floor(index / WEEKS_PER_YEAR);
  const weekInYear = (index % WEEKS_PER_YEAR) + 1;
  // approximate calendar date of this week's start
  const start = parseISO(birthdate);
  start.setDate(start.getDate() + index * 7);
  const date = monthYear(start, lang);

  let state: string;
  if (index < weeksLived) state = week.lived;
  else if (index === weeksLived) state = week.current;
  else state = week.ahead;

  return {
    title: week.title(ageYears, weekInYear),
    sub: `${date} — ${state}`,
  };
}
