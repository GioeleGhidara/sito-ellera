import { useEventCountdown } from "@/hooks/useEventCountdown";
import LanternRail from "../ui/LanternRail";
import { CARUGGI_EVENT_DATA } from "@/data/events/caruggiELanterne";

function Skyline() {
  return (
    <svg
      className="cel-hero-skyline"
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,200 L0,120 L60,120 L60,80 L130,80 L130,110 L190,110 L190,60 L240,60 L240,100 L310,100 L310,70 L370,70 L370,40 L420,40 L420,90 L490,90 L490,120 L560,120 L560,75 L620,75 L620,105 L690,105 L690,55 L760,55 L760,95 L830,95 L830,65 L900,65 L900,115 L970,115 L970,85 L1040,85 L1040,50 L1100,50 L1100,100 L1170,100 L1170,130 L1200,130 L1200,200 Z"
        fill="#070b16"
      />
      <path
        d="M190,110 L190,60 L240,60 L240,100"
        fill="none"
        stroke="#1a2440"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function Hero() {
  const countdown = useEventCountdown(CARUGGI_EVENT_DATA.startDate);

  return (
    <section id="cel-hero" className="cel-hero" aria-labelledby="hero-title">
      <div className="cel-hero-glow" aria-hidden="true" />
      <LanternRail count={7} />
      <Skyline />

      <p className="cel-hero-eyebrow">Sagra del borgo · Ellera</p>

      <h1 id="hero-title" className="cel-hero-title">
        Caruggi
        <em>&amp; Lanterne</em>
      </h1>

      <p className="cel-hero-sub">
        Due serate d'estate tra i vicoli di Ellera: ottimi piatti, musica dal vivo
        e ceramisti all'opera, mentre le lanterne del borgo illuminano ogni
        vicolo.
      </p>

      <p className="cel-hero-month">{CARUGGI_EVENT_DATA.dates.meseAnno}</p>
      <div className="cel-hero-dates">
        <div className="cel-date-chip">
          <span className="num">{CARUGGI_EVENT_DATA.dates.giorno1.num}</span>
          <span className="label">{CARUGGI_EVENT_DATA.dates.giorno1.label}</span>
        </div>
        <div className="cel-date-chip">
          <span className="num">{CARUGGI_EVENT_DATA.dates.giorno2.num}</span>
          <span className="label">{CARUGGI_EVENT_DATA.dates.giorno2.label}</span>
        </div>
      </div>

      {countdown && (
        <p className="cel-countdown">
          {countdown.isToday ? "Si accende stasera" : `${countdown.label}`}
        </p>
      )}

      <a href="#main-content" className="cel-hero-scroll" aria-label="Scorri al contenuto principale">
        <span>Scopri</span>
        <div className="line" />
      </a>
    </section>
  );
}
