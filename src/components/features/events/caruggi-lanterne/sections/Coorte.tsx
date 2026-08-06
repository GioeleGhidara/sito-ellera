"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { COORTE, type RealtaCoorte } from "@/data/events/caruggi-lanterne/coorte";

// Adattamento del "Button Carousel" Originkit: stessa matematica dell'arco e la
// stessa animazione a molla per l'immagine grande, ma al posto di immagini
// generiche usiamo direttamente nome/descrizione/logo delle realtà della Coorte.
const BUTTON_COUNT = 5; // mostra solo i più vicini all'elemento attivo, gli altri sfumano
const BUTTON_SIZE = 68;
const GAP = 30;
const CURVE = 3; // arco più piatto, occupa meno altezza
const HERO_SIZE = 168;

function modIdx(i: number, n: number) {
  return ((i % n) + n) % n;
}

function easeCubicInOut(p: number) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

function ItemVisual({ item, className }: { item: RealtaCoorte; className?: string }) {
  if (item.logo) {
    return <img src={item.logo} alt="" draggable={false} className={className} />;
  }
  if (item.icon) {
    const Icon = item.icon;
    return <Icon className={className} aria-hidden="true" />;
  }
  return null;
}

export default function Coorte() {
  const n = COORTE.length;

  const posRef = useRef(0);
  const [posDisplay, setPosDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const animRef = useRef({ startPos: 0, targetPos: 0, startTime: 0 });
  const [dir, setDir] = useState(1);

  const active = modIdx(Math.round(posDisplay), n);
  const activeItem = COORTE[active];

  const half = Math.floor(Math.min(BUTTON_COUNT, n) / 2);
  const t = Math.max(0.0001, Math.min(10, CURVE) / 10);
  const step = BUTTON_SIZE + GAP;
  const dPsi = ((Math.PI * 2) / n) * t;
  const R = step / (2 * Math.sin(dPsi / 2));
  const baseTop = BUTTON_SIZE * 0.9;
  const fadeInner = Math.max(0, half - 0.4);
  const fadeEnd = half + 0.6;
  const maxPsi = Math.min(Math.PI, fadeEnd * dPsi);
  const stripHeight = baseTop + R * (1 - Math.cos(maxPsi)) + BUTTON_SIZE / 2 + 16;

  const select = useCallback(
    (itemIdx: number) => {
      const currentActive = modIdx(Math.round(posRef.current), n);
      if (itemIdx === currentActive) return;

      let delta = itemIdx - Math.round(posRef.current);
      delta = ((delta % n) + n) % n;
      if (delta > n / 2) delta -= n;
      setDir(Math.sign(delta));

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      animRef.current = {
        startPos: posRef.current,
        targetPos: posRef.current + delta,
        startTime: performance.now(),
      };

      const DURATION = 320;
      function tick(now: number) {
        const { startPos, targetPos, startTime } = animRef.current;
        const progress = Math.min(1, (now - startTime) / DURATION);
        posRef.current = startPos + (targetPos - startPos) * easeCubicInOut(progress);
        setPosDisplay(posRef.current);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          posRef.current = targetPos;
          setPosDisplay(targetPos);
          rafRef.current = null;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [n],
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function getVisualSlot(itemIdx: number): number {
    let slot = itemIdx - posDisplay;
    slot = slot % n;
    if (slot > n / 2) slot -= n;
    if (slot < -n / 2) slot += n;
    return slot;
  }

  function slotStyle(slot: number) {
    const angle = slot * dPsi;
    const x = R * Math.sin(angle);
    const y = R * (1 - Math.cos(angle));
    const deg = (angle * 180) / Math.PI;
    const absSlot = Math.abs(slot);
    const depth = Math.max(0, 1 - (0.55 * absSlot) / Math.max(1, half));
    const scale = 0.55 + 0.45 * depth;
    const opacity =
      absSlot <= fadeInner ? 1 : absSlot >= fadeEnd ? 0 : 1 - (absSlot - fadeInner) / (fadeEnd - fadeInner);
    const zIndex = Math.round(depth * 100) + (absSlot < 0.5 ? 100 : 0);
    return { x, y, deg, scale, opacity, zIndex };
  }

  const imgSweep = 90;
  const imgDip = 30;
  const imageVariants = {
    enter: (d: number) => ({ x: d * imgSweep, y: imgDip, opacity: 0, scale: 0.86, rotate: d * 4 }),
    center: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 },
    exit: (d: number) => ({ x: -d * imgSweep, y: imgDip, opacity: 0, scale: 0.86, rotate: -d * 4 }),
  };

  return (
    <section className="cel-section" aria-labelledby="coorte-title">
      <div className="cel-container">
        <p className="cel-eyebrow">Zona Stand</p>
        <h2 id="coorte-title" className="cel-title">
          La <em>Coorte</em>
        </h2>
        <p className="cel-lead cel-lead--section">
          Uno spazio dedicato alle realtà che vivono il territorio tutto
          l'anno: associazioni, sportelli e iniziative a cui la sagra vuole
          dare visibilità. Scegli una scheda dall'arco per scoprirla.
        </p>

        <div className="cel-coorte-carousel">
          <div className="cel-coorte-hero" style={{ width: HERO_SIZE, height: HERO_SIZE }}>
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={active}
                custom={dir}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="cel-coorte-hero-visual"
              >
                <ItemVisual item={activeItem} className="cel-coorte-hero-img" />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="cel-coorte-hero-detail" role="region" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3>{activeItem.nome}</h3>
                <p>{activeItem.descrizione}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="cel-coorte-arc" style={{ height: stripHeight }}>
            {COORTE.map((item, itemIdx) => {
              const slot = getVisualSlot(itemIdx);
              const { x, y, deg, scale, opacity, zIndex } = slotStyle(slot);
              const isActive = itemIdx === active;

              return (
                <button
                  type="button"
                  key={item.nome}
                  className={`cel-coorte-arc-btn${isActive ? " is-active" : ""}`}
                  style={{
                    top: baseTop,
                    marginLeft: -BUTTON_SIZE / 2,
                    marginTop: -BUTTON_SIZE / 2,
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                    transform: `translate(${x}px, ${y}px) rotate(${deg}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    pointerEvents: opacity < 0.05 ? "none" : undefined,
                  }}
                  onClick={() => select(itemIdx)}
                  aria-current={isActive}
                  aria-label={item.nome}
                >
                  <span className="cel-coorte-arc-btn-inner" style={{ transform: `rotate(${-deg}deg)` }}>
                    <ItemVisual item={item} className="cel-coorte-arc-btn-img" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
