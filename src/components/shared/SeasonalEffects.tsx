import { useEffect, useState } from "react";
import { getActiveSeason } from "@/data/core/seasonal";

/**
 * Renders seasonal visual effects:
 * - Christmas: snowfall particles
 * - Halloween: dark vignette overlay
 */
const SeasonalEffects = () => {
  const [season, setSeason] = useState(() => getActiveSeason());

  // Refresh on mount only
  useEffect(() => {
    setSeason(getActiveSeason());
  }, []);

  if (!season) return null;

  if (season.theme === "christmas") {
    return (
      <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary-foreground/60"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}px`,
              animation: `snowfall ${Math.random() * 5 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
        <style>{`
          @keyframes snowfall {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(50vh) translateX(${Math.random() > 0.5 ? '' : '-'}20px); }
            100% { transform: translateY(100vh) translateX(0); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (season.theme === "halloween") {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-[60]"
        aria-hidden="true"
        style={{
          boxShadow: "inset 0 0 150px 40px rgba(0,0,0,0.4)",
        }}
      />
    );
  }

  return null;
};

export default SeasonalEffects;
