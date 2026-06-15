import { useMemo } from "react";
import { usePrefersReducedMotion } from "../hooks";

/**
 * A whisper of falling sand across the whole page — a few slow grains drifting
 * downward, behind everything. Disabled under prefers-reduced-motion (handled
 * both here and in CSS).
 */
export default function FallingSand({ count = 22 }: { count?: number }) {
  const reduced = usePrefersReducedMotion();

  const grains = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = 1 + Math.random() * 2.4;
        return {
          id: i,
          left: Math.random() * 100,
          size,
          dur: 9 + Math.random() * 12,
          delay: -Math.random() * 18,
          dist: 60 + Math.random() * 80,
          opacity: 0.18 + Math.random() * 0.35,
        };
      }),
    [count],
  );

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {grains.map((g) => (
        <span
          key={g.id}
          className="sand-grain"
          style={{
            left: `${g.left}%`,
            width: `${g.size}px`,
            height: `${g.size}px`,
            opacity: g.opacity,
            animationDuration: `${g.dur}s`,
            animationDelay: `${g.delay}s`,
            // a CSS var the keyframe reads for the fall distance
            ["--fall-dist" as string]: `${g.dist}vh`,
          }}
        />
      ))}
    </div>
  );
}
