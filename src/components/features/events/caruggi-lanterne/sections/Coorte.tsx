"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COORTE } from "@/data/events/caruggi-lanterne/coorte";

// Parametri "come nella preview" del componente Originkit di riferimento
// (velocità e dimensioni poi ritoccate per il nostro contenuto):
// path: straight, xCurve: 26, yCurve: -71, rounded: 7
const X_CURVE = 26;
const Y_CURVE = -71;
const SPEED = 2;
const ROUNDED = 7; // 0..20
const ORBIT_WIDTH_PCT = 78;
const DIRECTION: 1 | -1 = -1; // anticlockwise
const IMG_SIZE = 112;
const DRAG_SENSITIVITY = 0.012; // rad per px
const DRAG_THRESHOLD_PX = 14; // tollera il naturale tremore della mano quando si clicca un logo in movimento

export default function Coorte() {
  const n = COORTE.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ W: 0, H: 0 });

  const [orbitPhi, setOrbitPhi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const phiRef = useRef(0);
  const pausedRef = useRef(false);
  const hoveringRef = useRef(false);
  const focusedRef = useRef(false);
  const selectedRef = useRef<number | null>(null);
  const inViewRef = useRef(true);
  const animRef = useRef<number | null>(null);
  const dragRef = useRef({ pointerId: null as number | null, startX: 0, startPhi: 0, moved: false });

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    phiRef.current = orbitPhi;
  }, [orbitPhi]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setDims({ W: Math.round(rect.width), H: Math.round(rect.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { inViewRef.current = entry.isIntersecting; },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Se continui a scrollare la pagina, o clicchi fuori dal carosello/dalla
  // scheda informativa, la scheda si chiude e il carosello torna a ruotare.
  useEffect(() => {
    if (selected === null) return;

    const closeAndResume = () => {
      pausedRef.current = false;
      setSelected(null);
    };

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (detailRef.current?.contains(target)) return;
      closeAndResume();
    };
    document.addEventListener("click", handleOutsideClick);

    // Aprire la scheda aggiunge contenuto sotto il carosello: il browser
    // può fare un piccolo scroll automatico di compensazione (scroll
    // anchoring), che non deve essere scambiato per uno scroll reale
    // dell'utente. Aspettiamo che si assesti e ignoriamo micro-spostamenti.
    let scrollBaseline = window.scrollY;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - scrollBaseline) > 24) closeAndResume();
    };
    const timeoutId = window.setTimeout(() => {
      scrollBaseline = window.scrollY;
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [selected]);

  // Rotazione ambiente: speed 0..20 → ~0..1 giri/sec (formula Originkit)
  const revsPerSec = Math.max(0, Math.min(20, SPEED)) * 0.05;

  useEffect(() => {
    if (reducedMotion || revsPerSec <= 0) return;
    let frameId: number;
    let lastTime: number | null = null;
    const loop = (time: number) => {
      if (
        lastTime !== null &&
        !pausedRef.current &&
        selectedRef.current === null &&
        dragRef.current.pointerId === null &&
        animRef.current === null &&
        inViewRef.current
      ) {
        const dt = (time - lastTime) / 1000;
        setOrbitPhi((p) => p + DIRECTION * 2 * Math.PI * revsPerSec * dt);
      }
      lastTime = time;
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [reducedMotion, revsPerSec]);

  const { W, H } = dims;
  const radius = (ROUNDED / 20) * (IMG_SIZE / 2);
  const totalW = (ORBIT_WIDTH_PCT / 100) * W;
  const a = totalW / 2;
  const b = a * 0.35;
  const theta0 = Math.atan2(H, W);
  const cosT = Math.cos(theta0);
  const sinT = Math.sin(theta0);
  const cx = W / 2;
  const cy = H / 2;

  // Profondità reale davanti allo schermo: replichiamo in JS la stessa
  // rotazione 3D (rotateY(X_CURVE) poi rotateX(-Y_CURVE)) che il wrapper
  // applica in CSS, per trovare la vera coordinata Z di ogni punto
  // dell'ellisse — non solo la sua posizione Y 2D pre-tilt (che determina
  // lo zIndex ma NON la reale vicinanza alla telecamera).
  const thetaX = (-Y_CURVE * Math.PI) / 180;
  const thetaY = (X_CURVE * Math.PI) / 180;
  const sinTX = Math.sin(thetaX);
  const sinTY = Math.sin(thetaY);
  const cosTY = Math.cos(thetaY);
  // z(phi) = P·cos(phi) + Q·sin(phi) = R·cos(phi − delta)
  const P = a * (sinT * sinTX * cosTY - cosT * sinTY);
  const Q = b * (sinT * sinTY + cosT * sinTX * cosTY);
  const delta = Math.atan2(Q, P);

  // Fase in cui l'elemento è esattamente al centro orizzontale dello stage
  // DOPO la stessa rotazione 3D del wrapper (x2, non la x 2D pre-tilt):
  // x2(phi) = M·cos(phi) + N·sin(phi). Tra le due soluzioni si sceglie
  // quella sul lato "frontale" (z > 0), altrimenti l'elemento centrato
  // sarebbe quello sul retro dell'ellisse.
  const M = a * (cosT * cosTY + sinT * sinTX * sinTY);
  const N = b * (cosT * sinTX * sinTY - sinT * cosTY);
  const rawCenterPhi = Math.atan2(-M, N);
  const zAtRawCenter = P * Math.cos(rawCenterPhi) + Q * Math.sin(rawCenterPhi);
  const centerPhi = zAtRawCenter >= 0 ? rawCenterPhi : rawCenterPhi + Math.PI;

  const animatePhiTo = (target: number) => {
    if (reducedMotion) {
      setOrbitPhi(target);
      return;
    }
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const from = phiRef.current;
    const start = performance.now();
    const duration = 500;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = from + (target - from) * eased;
      setOrbitPhi(val);
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        animRef.current = null;
      }
    };
    animRef.current = requestAnimationFrame(tick);
  };

  const handleSelect = (i: number) => {
    setSelected((prev) => (prev === i ? null : i));
    // porta l'elemento i esattamente al centro orizzontale dello stage,
    // scegliendo il giro più vicino alla posizione attuale
    const baseItemPhi = (i / n) * Math.PI * 2;
    const k = Math.round((phiRef.current + baseItemPhi - centerPhi) / (2 * Math.PI));
    animatePhiTo(centerPhi + 2 * Math.PI * k - baseItemPhi);
  };

  const handleItemClick = (i: number) => {
    const wasDragging = dragRef.current.moved;
    dragRef.current.moved = false;
    if (wasDragging) return;
    handleSelect(i);
  };

  // pausedRef deve restare true finché VALE ANCHE SOLO UNA di queste
  // ragioni (hover, focus, drag in corso): prima ogni gestore la
  // sovrascriveva a sé stante, quindi rilasciare il mouse dopo un click
  // la riportava a false anche se il cursore era ancora sopra il
  // carosello, e la rotazione ripartiva subito portando via l'elemento
  // appena centrato.
  const updatePaused = () => {
    pausedRef.current = hoveringRef.current || focusedRef.current || dragRef.current.pointerId !== null;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { pointerId: e.pointerId, startX: e.clientX, startPhi: phiRef.current, moved: false };
    updatePaused();
    // Non catturiamo subito il puntatore: farlo su ogni pressione blocca il
    // click nativo dei bottoni-orbita. La cattura scatta solo se il gesto
    // diventa davvero un trascinamento (vedi sotto).
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) return;
    const deltaX = e.clientX - dragRef.current.startX;
    if (!dragRef.current.moved && Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
      dragRef.current.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (dragRef.current.moved) {
      setOrbitPhi(dragRef.current.startPhi + deltaX * DRAG_SENSITIVITY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) return;
    dragRef.current.pointerId = null;
    updatePaused();
  };

  const handleFocus = () => { focusedRef.current = true; updatePaused(); };
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      focusedRef.current = false;
      updatePaused();
    }
  };
  const handleMouseEnter = () => { hoveringRef.current = true; updatePaused(); };
  const handleMouseLeave = () => { hoveringRef.current = false; updatePaused(); };

  const items = useMemo(() => {
    if (!W || !H) return [];
    return COORTE.map((r, i) => {
      const phi = (i / n) * Math.PI * 2 + orbitPhi;
      const ex = a * Math.cos(phi);
      const ey = b * Math.sin(phi);
      const x = ex * cosT - ey * sinT;
      const y = ex * sinT + ey * cosT;
      const left = cx + x - IMG_SIZE / 2;
      const top = cy + y - IMG_SIZE / 2;
      const zIndex = Math.round(y);
      // Il nome compare solo quando il logo passa davvero nella fascia
      // frontale (stessa fase che determina lo zIndex), non prima né dopo
      const depth = (Math.cos(phi - delta) + 1) / 2; // 0 dietro … 1 davanti
      const nameOpacity = Math.max(0, Math.min(1, (depth - 0.55) / 0.35));
      return { r, i, left, top, zIndex, nameOpacity };
    });
  }, [W, H, orbitPhi, n, a, b, cosT, sinT, cx, cy, delta]);

  const selectedItem = selected !== null ? COORTE[selected] : null;

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
          dare visibilità. Trascina per farle ruotare, o scegline una per
          scoprirla.
        </p>

        <div
          ref={containerRef}
          className="cel-coorte-stage"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="cel-coorte-orbit"
            style={{ transform: `rotateY(${X_CURVE}deg) rotateX(${-Y_CURVE}deg)` }}
          >
            {items.map(({ r, i, left, top, zIndex, nameOpacity }) => {
              const isSelected = selected === i;
              return (
                <button
                  type="button"
                  key={r.nome}
                  className={`cel-coorte-orbit-item${isSelected ? " is-selected" : ""}`}
                  style={{
                    left,
                    top,
                    width: IMG_SIZE,
                    height: IMG_SIZE,
                    zIndex,
                    transform: `rotateX(${Y_CURVE}deg) rotateY(${-X_CURVE}deg)`,
                  }}
                  onClick={() => handleItemClick(i)}
                  aria-expanded={isSelected}
                  aria-controls={isSelected ? "coorte-detail-panel" : undefined}
                  aria-label={r.nome}
                >
                  {r.logo && (
                    <img src={r.logo} alt="" loading="lazy" style={{ borderRadius: radius }} />
                  )}
                  <span aria-hidden="true" style={{ opacity: nameOpacity }}>{r.nome}</span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedItem && (
          <div ref={detailRef} className="cel-coorte-detail" id="coorte-detail-panel" role="region" aria-live="polite">
            {selectedItem.logo && (
              <img src={selectedItem.logo} alt="" className="cel-coorte-logo--detail" loading="lazy" />
            )}
            <div>
              <h3>{selectedItem.nome}</h3>
              <p>{selectedItem.descrizione}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
