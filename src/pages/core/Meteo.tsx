import React, { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import {
  AlertTriangle,
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  MapPin,
  Shield,
  Thermometer,
  Wind,
} from "@/lib/icons";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import Seo from "@/components/shared/Seo";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  formatAlertDateTime,
  formatAlertLevel,
  formatTimeUntil,
  hasArpalTimingData,
  isActiveAlertLevel,
  resolveZoneAlertState,
  type ArpalData,
  type ZoneAlert,
  type ZonePhenomena,
} from "@/lib/arpal";

const WeatherWidget = React.lazy(() => import("@/components/features/weather/WeatherWidget"));

import meteoHeroImage from "@/assets/images/meteo/meteo-hero.webp";
import regioneLiguriaLogo from "@/assets/images/reg-liguria/regione-liguria-seeklogo.png";

const RegioneLiguriaTitleMark = () => (
  <img
    src={regioneLiguriaLogo}
    alt=""
    aria-hidden="true"
    className="h-8 w-auto shrink-0 object-contain"
  />
);

/* ── types ── */
/* ── alert colors ── */
const ALERT_STYLES: Record<
  ZoneAlert["level"],
  { bg: string; border: string; text: string; badge: string; badgeText: string }
> = {
  verde: {
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    text: "text-emerald-800",
    badge: "bg-emerald-500",
    badgeText: "text-white",
  },
  gialla: {
    bg: "bg-amber-50",
    border: "border-amber-300",
    text: "text-amber-800",
    badge: "bg-amber-400",
    badgeText: "text-amber-950",
  },
  arancione: {
    bg: "bg-orange-50",
    border: "border-orange-400",
    text: "text-orange-800",
    badge: "bg-orange-500",
    badgeText: "text-white",
  },
  rossa: {
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-800",
    badge: "bg-red-600",
    badgeText: "text-white",
  },
  sconosciuto: {
    bg: "bg-muted",
    border: "border-border",
    text: "text-muted-foreground",
    badge: "bg-muted-foreground",
    badgeText: "text-white",
  },
};

const LEVEL_LABELS: Record<ZoneAlert["level"], string> = {
  verde: "Verde - Nessuna criticità",
  gialla: "Gialla - Criticità ordinaria",
  arancione: "Arancione - Criticità moderata",
  rossa: "Rossa - Criticità elevata",
  sconosciuto: "Stato non disponibile",
};

/* ── Descrizioni pericolo per livello (fonte: ARPAL) ── */
const LEVEL_DANGER: Record<ZoneAlert["level"], string> = {
  verde: "Eventuali danni puntuali",
  gialla: "Occasionale pericolo per la sicurezza delle persone - effetti localizzati",
  arancione: "Pericolo per la sicurezza delle persone con possibili perdite di vite umane - effetti diffusi",
  rossa: "Grave pericolo per la sicurezza delle persone con possibili perdite di vite umane - effetti ingenti ed estesi",
  sconosciuto: "",
};

/* ── Descrizioni per fenomeno + livello (fonte: ARPAL) ── */
const PHENOMENA_DANGER: Record<
  keyof ZonePhenomena,
  Partial<Record<ZoneAlert["level"], string>>
> = {
  pioggeDiffuse: {
    verde: "Assenza o bassa probabilità di fenomeni significativi",
    gialla: "Fenomeni ed effetti localizzati - possibili allagamenti e frane superficiali",
    arancione: "Fenomeni diffusi - frane, significativi innalzamenti dei corsi d'acqua",
    rossa: "Fenomeni numerosi ed estesi - piene fluviali, estese inondazioni",
  },
  temporali: {
    verde: "Possibili fulminazioni isolate e raffiche di vento localizzate",
    gialla: "Fenomeni puntuali anche intensi e repentini - elevata incertezza previsionale",
    arancione: "Temporali forti, diffusi e persistenti - possibili piene improvvise",
    rossa: "Non previsto come scenario isolato - associato a criticità idrogeologica estesa",
  },
  neve: {
    verde: "Possibili deboli nevicate su zone non sensibili o a quote collinari",
    gialla: "Spolverate a bassa quota o nevicate deboli su zone sensibili - locali disagi alla viabilità",
    arancione: "Nevicate significative - diffusi problemi di viabilità e alle infrastrutture",
    rossa: "Nevicate abbondanti - gravi e diffusi problemi di viabilità",
  },
  vento: {
    verde: "Vento debole o moderato - nessun effetto significativo",
    gialla: "Raffiche forti - possibili danni lievi a strutture e vegetazione",
    arancione: "Raffiche molto forti - danni a strutture provvisorie e caduta alberi",
    rossa: "Raffiche eccezionali - gravi danni a strutture e infrastrutture",
  },
  mare: {
    verde: "Mare calmo o poco mosso - nessun effetto significativo",
    gialla: "Moto ondoso in aumento - possibili disagi alle attività costiere",
    arancione: "Mare agitato - danni alle strutture portuali e costiere",
    rossa: "Mare molto agitato o grosso - gravi danni alle strutture costiere",
  },
  disagioFisiologico: {
    verde: "Condizioni termiche nella norma",
    gialla: "Disagio per caldo o freddo intenso - attenzione per categorie sensibili",
    arancione: "Rischio per la salute delle categorie sensibili (anziani, bambini, malati)",
    rossa: "Grave rischio per la salute della popolazione - misure di protezione necessarie",
  },
};

const PHENOMENA_CONFIG: {
  key: keyof ZonePhenomena;
  label: string;
  Icon: React.ElementType;
}[] = [
    { key: "pioggeDiffuse", label: "Piogge diffuse", Icon: CloudRain },
    { key: "temporali", label: "Temporali", Icon: CloudLightning },
    { key: "neve", label: "Neve", Icon: CloudSnow },
    { key: "vento", label: "Vento", Icon: Wind },
    { key: "mare", label: "Mare", Icon: Droplets },
    { key: "disagioFisiologico", label: "Disagio fisiologico", Icon: Thermometer },
  ];

const ARPAL_CACHE_KEY = "ellera_arpal_cache_v3";
const ARPAL_CACHE_TTL = 15 * 60 * 1000;

/* ── hook ── */
const useArpalAlert = () => {
  const [data, setData] = useState<ArpalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const cached = localStorage.getItem(ARPAL_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (
            Date.now() - parsed.updatedAt < ARPAL_CACHE_TTL &&
            hasArpalTimingData(parsed.data)
          ) {
            setData(parsed.data);
            setLoading(false);
            return;
          }
        }
      } catch { /* noop */ }

      try {
        const { data: result, error: fnError } = await supabase.functions.invoke("arpal-allerta");

        if (fnError) throw new Error(fnError.message);
        if (!result?.success) throw new Error(result?.error ?? "Errore sconosciuto");

        setData(result.data);
        try {
          localStorage.setItem(
            ARPAL_CACHE_KEY,
            JSON.stringify({ data: result.data, updatedAt: Date.now() })
          );
        } catch { /* noop */ }
      } catch (err) {
        console.error("ARPAL fetch error:", err);
        try {
          const cached = localStorage.getItem(ARPAL_CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (hasArpalTimingData(parsed.data)) {
              setData(parsed.data);
              setLoading(false);
              return;
            }
          }
        } catch { /* noop */ }
        setError("Dati allerta non disponibili");
      } finally {
        setLoading(false);
      }
    };

    fetchAlert();
  }, []);

  return { data, loading, error };
};

/* ── animations ── */

/* ── Section Header ── */
const SectionHeader = ({
  icon: Icon,
  titlePrefix,
  title,
  eyebrow,
}: {
  icon?: React.ElementType;
  titlePrefix?: React.ReactNode;
  title: React.ReactNode;
  eyebrow?: string;
}) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="mb-5"
  >
    {eyebrow && (
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary/70">
        {eyebrow}
      </p>
    )}
    <h2 className="flex items-center gap-2.5 text-2xl font-heading font-bold text-foreground">
      {Icon ? <Icon className="h-6 w-6 text-primary" /> : null}
      {titlePrefix}
      {title}
    </h2>
  </motion.div>
);

/* ── Alert Card ── */
const AlertCard = ({
  zoneAlert,
  zoneName,
  highlighted = false,
  nowMs = Date.now(),
}: {
  zoneAlert: ZoneAlert;
  zoneName: string;
  highlighted?: boolean;
  nowMs?: number;
}) => {
  const displayLevel = resolveZoneAlertState(zoneAlert, nowMs)?.level ?? zoneAlert.level;
  const style = ALERT_STYLES[displayLevel];
  const activePhenomena = PHENOMENA_CONFIG.filter(
    (p) => zoneAlert.phenomena[p.key]
  );
  const dangerLabel = LEVEL_DANGER[displayLevel];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`rounded-2xl border-2 ${style.border} ${style.bg} p-5 ${highlighted ? "ring-2 ring-primary/30" : ""
        }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span className="text-lg font-heading font-bold text-foreground">
          Zona {zoneName}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${style.badge} ${style.badgeText}`}
        >
          {displayLevel.toUpperCase()}
        </span>
      </div>

      {/* Livello label */}
      <p className={`text-sm font-medium mb-1 ${style.text}`}>
        {LEVEL_LABELS[displayLevel]}
      </p>

      {/* Descrizione pericolo livello */}
      {dangerLabel && (
        <p className={`text-xs mb-4 ${style.text} opacity-80 leading-relaxed`}>
          {dangerLabel}
        </p>
      )}

      {/* Fenomeni con descrizione */}
      {activePhenomena.length > 0 && (
        <div className="flex flex-col gap-2">
          {activePhenomena.map(({ key, label, Icon }) => {
            const phenomenonDesc = PHENOMENA_DANGER[key]?.[displayLevel];
            return (
              <div
                key={key}
                className={`rounded-xl px-3 py-2.5 border ${style.border} bg-white/50`}
              >
                <div className={`flex items-center gap-1.5 text-xs font-semibold mb-0.5 ${style.text}`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                </div>
                {phenomenonDesc && (
                  <p className={`text-xs ${style.text} opacity-75 leading-relaxed`}>
                    {phenomenonDesc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activePhenomena.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          Nessun fenomeno significativo previsto
        </p>
      )}
    </motion.div>
  );
};

const AlertTimingPanel = ({
  zoneAlert,
  nowMs,
}: {
  zoneAlert: ZoneAlert;
  nowMs: number;
}) => {
  const resolvedAlert = resolveZoneAlertState(zoneAlert, nowMs);
  const effectiveCurrentLevel = resolvedAlert?.level ?? zoneAlert.level;
  const hasCurrentActiveAlert = isActiveAlertLevel(effectiveCurrentLevel);
  const hasUpcomingChange =
    Boolean(resolvedAlert?.nextLevel && resolvedAlert.nextStartsAt) &&
    resolvedAlert.nextLevel !== effectiveCurrentLevel;
  const hasActiveUntil =
    Boolean(resolvedAlert?.activeUntil) &&
    resolvedAlert.activeUntil !== resolvedAlert.endsAt;

  if (!hasCurrentActiveAlert && !hasUpcomingChange) return null;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-heading font-bold text-foreground">Validità oraria dell'allerta</h3>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border/70 bg-background/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Adesso</p>
          <p className={`mt-2 text-base font-semibold ${ALERT_STYLES[effectiveCurrentLevel].text}`}>
            {hasCurrentActiveAlert ? `Allerta ${formatAlertLevel(effectiveCurrentLevel)}` : "Nessuna allerta attiva"}
          </p>
        </div>

        {hasCurrentActiveAlert && resolvedAlert?.endsAt && (
          <div className="rounded-xl border border-border/70 bg-background/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Fino alle</p>
            <p className="mt-2 text-base font-semibold text-foreground">
              {formatAlertDateTime(resolvedAlert.endsAt)}
            </p>
            {formatTimeUntil(resolvedAlert.endsAt, nowMs) && (
              <p className="mt-1 text-sm text-muted-foreground">
                {formatTimeUntil(resolvedAlert.endsAt, nowMs)}
              </p>
            )}
          </div>
        )}

        {hasUpcomingChange && resolvedAlert?.nextLevel && resolvedAlert.nextStartsAt && (
          <div className="rounded-xl border border-border/70 bg-background/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Poi</p>
            <p className={`mt-2 text-base font-semibold ${ALERT_STYLES[resolvedAlert.nextLevel].text}`}>
              {formatAlertLevel(resolvedAlert.nextLevel)} dalle {formatAlertDateTime(resolvedAlert.nextStartsAt)}
            </p>
            {formatTimeUntil(resolvedAlert.nextStartsAt, nowMs) && (
              <p className="mt-1 text-sm text-muted-foreground">
                {formatTimeUntil(resolvedAlert.nextStartsAt, nowMs)}
              </p>
            )}
          </div>
        )}

        {hasCurrentActiveAlert && resolvedAlert?.activeUntil && (
          <div className="rounded-xl border border-border/70 bg-background/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Fine allerte previste
            </p>
            <p className="mt-2 text-base font-semibold text-foreground">
              {formatAlertDateTime(resolvedAlert.activeUntil)}
            </p>
            {formatTimeUntil(resolvedAlert.activeUntil, nowMs) && (
              <p className="mt-1 text-sm text-muted-foreground">
                {formatTimeUntil(resolvedAlert.activeUntil, nowMs)}
              </p>
            )}
            {hasActiveUntil && (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Se il colore cambia prima, l'allerta resta comunque attiva fino a questo orario.
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ── Skeleton ── */
const AlertSkeleton = () => (
  <div className="space-y-4">
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-48 h-4 mb-2" />
      <Skeleton className="w-64 h-3 mb-4" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-14 rounded-xl" />
        <Skeleton className="w-full h-14 rounded-xl" />
      </div>
    </div>
  </div>
);

/* ── Page ── */
const Meteo = () => {
  const { data: arpalData, loading: arpalLoading, error: arpalError } = useArpalAlert();
  const [nowMs, setNowMs] = useState(Date.now());
  const zoneB = arpalData?.zones?.B;
  const zoneBDisplayLevel = resolveZoneAlertState(zoneB, nowMs)?.level ?? zoneB?.level ?? "sconosciuto";

  useEffect(() => {
    const intervalId = window.setInterval(() => setNowMs(Date.now()), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <Layout>
      <Seo
        title="Meteo"
        description="Previsioni meteo per Ellera e stato di allerta ARPAL per la Zona B della Liguria. Condizioni aggiornate per escursioni e attività outdoor."
        image={meteoHeroImage}
        imageAlt="Paesaggio montano della Liguria con cielo atmosferico"
      />

      <PageHero
        imageSrc={meteoHeroImage}
        imageAlt="Paesaggio montano della Liguria"
        eyebrow="Outdoor"
        eyebrowIcon={Cloud}
        title="Meteo e Allerte"
        description="Condizioni aggiornate per Ellera e la Zona B della Liguria"
      />

      {/* ── Allerta ARPAL ── */}
      <section className="bg-background py-10">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Protezione civile"
            titlePrefix={<RegioneLiguriaTitleMark />}
            title="Allerta Meteo ARPAL - Zona B"
          />

          {arpalLoading && <AlertSkeleton />}

          {arpalError && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card p-5 text-center"
            >
              <p className="text-sm text-muted-foreground">{arpalError}</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <a
                  href="https://allertaliguria.regione.liguria.it"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={regioneLiguriaLogo}
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-auto"
                  />
                  Consulta il sito ARPAL
                </a>
              </Button>
            </motion.div>
          )}

          {!arpalLoading && !arpalError && arpalData && zoneB && (
            <div className="space-y-5">
              {/* Main message banner */}
              {arpalData.message && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`rounded-2xl border-2 ${ALERT_STYLES[zoneBDisplayLevel].border} ${ALERT_STYLES[zoneBDisplayLevel].bg} p-5`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={`w-6 h-6 shrink-0 mt-0.5 ${ALERT_STYLES[zoneBDisplayLevel].text}`}
                    />
                    <div>
                      <p className={`font-heading font-bold text-lg ${ALERT_STYLES[zoneBDisplayLevel].text}`}>
                        {arpalData.message}
                      </p>
                      {arpalData.messageSubtitle && (
                        <p className={`text-sm mt-1 ${ALERT_STYLES[zoneBDisplayLevel].text} opacity-80`}>
                          {arpalData.messageSubtitle}
                        </p>
                      )}
                      {arpalData.timestamp && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Aggiornamento: {arpalData.timestamp}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              <AlertTimingPanel zoneAlert={zoneB} nowMs={nowMs} />

              {/* Zone B detail card */}
              <AlertCard zoneAlert={zoneB} zoneName="B" highlighted nowMs={nowMs} />

              {/* Altre zone - compact pills */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3 className="text-sm font-heading font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Altre zone
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["A", "C", "D", "E"]
                    .filter((z) => arpalData.zones[z])
                    .map((z) => {
                      const displayLevel =
                        resolveZoneAlertState(arpalData.zones[z], nowMs)?.level ?? arpalData.zones[z].level;
                      const style = ALERT_STYLES[displayLevel];
                      return (
                        <span
                          key={z}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${style.border} ${style.bg} ${style.text}`}
                        >
                          Zona {z}
                          <span className={`w-2 h-2 rounded-full ${style.badge}`} />
                        </span>
                      );
                    })}
                </div>
              </motion.div>

              {/* Link ARPAL */}
              <div className="flex justify-center">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://allertaliguria.regione.liguria.it"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={regioneLiguriaLogo}
                      alt=""
                      aria-hidden="true"
                      className="h-5 w-auto"
                    />
                    Consulta allertaliguria.regione.liguria.it
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* ── Previsioni Meteo ── */}
      <section className="bg-[var(--cream,#f5f0e8)] py-10">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Suspense
              fallback={
                <div className="flex h-[180px] items-center justify-center rounded-2xl bg-white/60">
                  <Cloud className="h-8 w-8 text-primary/60" />
                </div>
              }
            >
              <WeatherWidget variant="forecast" />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* ── Info section ── */}
      <section className="bg-background py-10">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <SectionHeader
            icon={Shield}
            eyebrow="Informazioni"
            title="Cosa significano le allerte"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="font-heading font-bold text-foreground mb-2">
                Zona B - Dove siamo
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ellera si trova nella <strong>Zona B</strong> della suddivisione
                ARPAL della Liguria, che comprende il Genovese costiero e
                l'entroterra. Le allerte si riferiscono a rischio idrogeologico,
                idraulico e nivologico per questa area.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="font-heading font-bold text-foreground mb-2">
                Consigli per l'outdoor
              </h3>
              <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-4 space-y-1">
                <li>
                  Con allerta <strong>gialla</strong>, presta attenzione: evita
                  torrenti e zone di possibili smottamenti.
                </li>
                <li>
                  Con allerta <strong>arancione</strong> o <strong>rossa</strong>,
                  rimanda le attività outdoor e segui le indicazioni della
                  Protezione Civile.
                </li>
                <li>
                  Controlla sempre le condizioni meteo prima di partire per
                  escursioni o uscite in MTB.
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Meteo;

