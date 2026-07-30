import { useEffect, useRef, useState } from "react";

interface LanternSpec {
  left: string;
  size: number;
  swayIndex: number;
  delay: number;
}

const LANTERN_PATTERN: LanternSpec[] = [
  { left: "6%", size: 38, swayIndex: 0, delay: 0 },
  { left: "18%", size: 26, swayIndex: 2, delay: 0.3 },
  { left: "31%", size: 44, swayIndex: 1, delay: 0.1 },
  { left: "47%", size: 30, swayIndex: 3, delay: 0.5 },
  { left: "61%", size: 40, swayIndex: 0, delay: 0.2 },
  { left: "75%", size: 28, swayIndex: 2, delay: 0.4 },
  { left: "89%", size: 36, swayIndex: 1, delay: 0.15 },
];

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
  const pattern = LANTERN_PATTERN.slice(0, count);
  return (
    <div className="cel-lantern-rail">
      {pattern.map((spec, i) => (
        <Lantern key={i} spec={spec} index={i} />
      ))}
    </div>
  );
}
