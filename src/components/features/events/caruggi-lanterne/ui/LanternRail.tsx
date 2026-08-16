import { useEffect, useRef, useState } from "react";

interface LanternSpec {
  left: string;
  size: number;
  swayIndex: number;
  delay: number;
}

// Dimensione/oscillazione/ritardo dei lampioni, riciclati ciclicamente per qualsiasi `count`.
const LANTERN_STYLES: Omit<LanternSpec, "left">[] = [
  { size: 38, swayIndex: 0, delay: 0 },
  { size: 26, swayIndex: 2, delay: 0.3 },
  { size: 44, swayIndex: 1, delay: 0.1 },
  { size: 30, swayIndex: 3, delay: 0.5 },
  { size: 40, swayIndex: 0, delay: 0.2 },
  { size: 28, swayIndex: 2, delay: 0.4 },
  { size: 36, swayIndex: 1, delay: 0.15 },
];

// I lampioni devono coprire sempre questo intervallo, qualunque sia `count`: prendere solo
// i primi N stili (con le loro `left` fisse) lasciava vuoto il lato destro per count < 7.
const RAIL_START_PCT = 6;
const RAIL_END_PCT = 89;

function leftForIndex(i: number, count: number): string {
  if (count <= 1) return `${(RAIL_START_PCT + RAIL_END_PCT) / 2}%`;
  return `${RAIL_START_PCT + ((RAIL_END_PCT - RAIL_START_PCT) * i) / (count - 1)}%`;
}

function Lantern({ spec, index }: { spec: LanternSpec; index: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setLit(true),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { left, size, swayIndex, delay } = spec;

  return (
    <svg
      ref={ref}
      className={`cel-lantern${lit ? " is-lit" : ""}`}
      style={{
        left,
        width: size,
        height: size * 1.5,
        "--sway": swayIndex,
        animationDelay: `${delay}s`,
      } as React.CSSProperties}
      viewBox="0 0 40 60"
      aria-hidden="true"
    >
      <line x1="20" y1="0" x2="20" y2="10" className="wick" strokeWidth="1.5" />
      <ellipse cx="20" cy="14" rx="3" ry="2" fill="#7a6240" />
      <path
        className="body"
        d="M8 18 Q8 32 8 32 Q8 48 20 50 Q32 48 32 32 Q32 32 32 18 Q32 12 20 12 Q8 12 8 18 Z"
      />
      <ellipse cx="20" cy="50" rx="3" ry="2" fill="#7a6240" />
      <line x1="20" y1="52" x2="20" y2="58" className="wick" strokeWidth="1.5" />
      <path d="M8 32 L32 32" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
    </svg>
  );
}

interface LanternRailProps {
  count?: number;
}

export default function LanternRail({ count = 7 }: LanternRailProps) {
  const pattern: LanternSpec[] = Array.from({ length: count }, (_, i) => ({
    ...LANTERN_STYLES[i % LANTERN_STYLES.length],
    left: leftForIndex(i, count),
  }));
  return (
    <div className="cel-lantern-rail">
      {pattern.map((spec, i) => (
        <Lantern key={i} spec={spec} index={i} />
      ))}
    </div>
  );
}
