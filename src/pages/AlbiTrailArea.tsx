import React, { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpCircle,
  Bike,
  Calendar,
  ChevronRight,
  Download,
  ExternalLink,
  Info,
  MapPin,
  Shield,
  TrendingDown,
  TrendingUp,
} from "@/lib/icons";
import { FeaturedEventCard } from "@/components/EventCard";
import Layout from "@/components/Layout";
import MapFallback from "@/components/MapFallback";
import PageHero from "@/components/PageHero";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { albiTrailAreaImage as albiImage, albiTrailAreaLogo } from "@/assets/images";
import { getNextBikeEvent } from "@/data/events";
import { trails } from "@/data/trails";
import {
  inactiveTrails,
  sortTrailsForSection,
  trailRules,
  trailSections,
} from "@/data/albiTrailArea";
import {
  formatAlertDateTime,
  formatAlertLevel,
  formatTimeUntil,
  hasArpalTimingData,
  isActiveAlertLevel,
  resolveZoneAlertState,
  type AlertLevel,
  type ArpalData,
  type ZoneAlert,
} from "@/lib/arpal";
import { ROUTES } from "@/lib/routes";

const TrailMap = React.lazy(() => import("@/components/TrailMap"));
const WeatherWidget = React.lazy(() => import("@/components/WeatherWidget"));

const ARPAL_CACHE_KEY = "ellera_arpal_cache_v3";
const ARPAL_CACHE_TTL = 15 * 60 * 1000;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const trailSectionIconMap = {
  "trending-down": TrendingDown,
  "trending-up": TrendingUp,
};

const ALERT_NOTICE_STYLES: Record<
  Exclude<AlertLevel, "verde" | "sconosciuto">,
  { border: string; bg: string; text: string; badge: string; badgeText: string }
> = {
  gialla: {
    border: "border-amber-300/80",
    bg: "bg-amber-50/80",
    text: "text-amber-900",
    badge: "bg-amber-300",
    badgeText: "text-amber-950",
  },
  arancione: {
    border: "border-orange-300/80",
    bg: "bg-orange-50/80",
    text: "text-orange-900",
    badge: "bg-orange-500",
    badgeText: "text-white",
  },
  rossa: {
    border: "border-red-300/80",
    bg: "bg-red-50/80",
    text: "text-red-900",
    badge: "bg-red-600",
    badgeText: "text-white",
  },
};

const readArpalCache = (): ArpalData | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ARPAL_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { data?: ArpalData; updatedAt?: number };
    if (!parsed?.data || typeof parsed.updatedAt !== "number") return null;
    if (Date.now() - parsed.updatedAt >= ARPAL_CACHE_TTL) return null;
    if (!hasArpalTimingData(parsed.data)) return null;

    return parsed.data;
  } catch {
    return null;
  }
};

const writeArpalCache = (data: ArpalData) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      ARPAL_CACHE_KEY,
      JSON.stringify({ data, updatedAt: Date.now() }),
    );
  } catch {
    // noop
  }
};

const useZoneBAlert = () => {
  const [zoneAlert, setZoneAlert] = useState<ZoneAlert | null>(null);

  useEffect(() => {
    const cached = readArpalCache();
    if (cached?.zones?.B) {
      setZoneAlert(cached.zones.B);
      return;
    }

    let mounted = true;

    const fetchAlert = async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke("arpal-allerta");
        if (error) throw new Error(error.message);
        if (!result?.success || !result.data?.zones?.B) {
          throw new Error(result?.error ?? "Dati allerta non disponibili");
        }

        const nextData = result.data as ArpalData;
        if (!mounted) return;

        writeArpalCache(nextData);
        setZoneAlert(nextData.zones.B);
      } catch {
        if (!mounted) return;
        setZoneAlert(null);
      }
    };

    fetchAlert();

    return () => {
      mounted = false;
    };
  }, []);

  return zoneAlert;
};

const TrailAreaAlertNotice = ({ zoneAlert }: { zoneAlert: ZoneAlert | null }) => {
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    if (!zoneAlert) return;

    const intervalId = window.setInterval(() => setNowMs(Date.now()), 60_000);
    return () => window.clearInterval(intervalId);
  }, [zoneAlert]);

  const resolvedAlert = resolveZoneAlertState(zoneAlert, nowMs);
  if (!resolvedAlert) return null;

  const currentLevel = resolvedAlert.level;
  const hasCurrentActiveAlert = isActiveAlertLevel(currentLevel);
  const nextLevel = resolvedAlert.nextLevel ?? null;
  const nextStartsAt = resolvedAlert.nextStartsAt ?? null;
  const hasUpcomingActiveAlert = Boolean(nextStartsAt && isActiveAlertLevel(nextLevel));

  if (!hasCurrentActiveAlert && !hasUpcomingActiveAlert) return null;

  const styleKey = (hasCurrentActiveAlert ? currentLevel : nextLevel) as Exclude<
    AlertLevel,
    "verde" | "sconosciuto"
  >;
  const style = ALERT_NOTICE_STYLES[styleKey];
  const currentEndsAt = resolvedAlert.endsAt;
  const currentEndsLabel = formatAlertDateTime(currentEndsAt);
  const currentEndsCountdown = formatTimeUntil(currentEndsAt, nowMs);
  const nextStartsLabel = formatAlertDateTime(nextStartsAt);
  const nextStartsCountdown = formatTimeUntil(nextStartsAt, nowMs);
  const willEndWithoutAnotherAlert =
    hasCurrentActiveAlert &&
    (!nextLevel || nextLevel === "verde") &&
    Boolean(currentEndsAt);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`mb-5 rounded-2xl border ${style.border} ${style.bg} p-5 shadow-sm`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${style.badge} ${style.badgeText}`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Avvertenza ARPAL
            </span>
            <span className={`text-sm font-semibold ${style.text}`}>
              Zona B
            </span>
          </div>

          <p className={`mt-3 text-lg font-heading font-bold ${style.text}`}>
            {hasCurrentActiveAlert
              ? `Allerta ${formatAlertLevel(currentLevel)} in corso sui trail di Ellera`
              : nextLevel
                ? `Allerta ${formatAlertLevel(nextLevel)} in arrivo sulla Zona B`
                : "Allerta meteo in corso"}
          </p>

          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {hasCurrentActiveAlert
              ? "Prima di uscire controlla bene i tratti esposti, attraversamenti, guadi e fondi smossi: con allerta attiva conviene valutare con prudenza se rimandare."
              : "Se stai pianificando un'uscita nelle prossime ore, tieni conto del cambio previsto di allerta prima di partire."}
          </p>
        </div>

        <Button variant="outline" size="sm" asChild className="self-start">
          <Link to={ROUTES.meteo}>Dettagli meteo e allerte</Link>
        </Button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/70 bg-white/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Adesso</p>
          <p className={`mt-2 text-base font-semibold ${style.text}`}>
            {hasCurrentActiveAlert && currentLevel !== "sconosciuto"
              ? `Allerta ${formatAlertLevel(currentLevel)}`
              : nextLevel
                ? `Nessuna attiva, poi ${formatAlertLevel(nextLevel)}`
                : "Nessuna allerta attiva"}
          </p>
        </div>

        {hasCurrentActiveAlert && currentEndsAt && (
          <div className="rounded-xl border border-white/70 bg-white/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Fino alle</p>
            <p className="mt-2 text-base font-semibold text-foreground">
              {currentEndsLabel ?? "Orario non disponibile"}
            </p>
            {currentEndsCountdown && (
              <p className="mt-1 text-sm text-muted-foreground">{currentEndsCountdown}</p>
            )}
          </div>
        )}

        <div className="rounded-xl border border-white/70 bg-white/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Poi</p>
          {hasCurrentActiveAlert && nextLevel && nextLevel !== "verde" && nextStartsAt ? (
            <>
              <p className="mt-2 text-base font-semibold text-foreground">
                {formatAlertLevel(nextLevel)} dalle {nextStartsLabel ?? "orario da confermare"}
              </p>
              {nextStartsCountdown && (
                <p className="mt-1 text-sm text-muted-foreground">{nextStartsCountdown}</p>
              )}
            </>
          ) : willEndWithoutAnotherAlert ? (
            <p className="mt-2 text-base font-semibold text-foreground">
              L'allerta termina alle {currentEndsLabel ?? "prossime ore"}
            </p>
          ) : hasUpcomingActiveAlert && nextLevel && nextStartsAt ? (
            <>
              <p className="mt-2 text-base font-semibold text-foreground">
                {formatAlertLevel(nextLevel)} dalle {nextStartsLabel ?? "orario da confermare"}
              </p>
              {nextStartsCountdown && (
                <p className="mt-1 text-sm text-muted-foreground">{nextStartsCountdown}</p>
              )}
            </>
          ) : (
            <p className="mt-2 text-base font-semibold text-foreground">Nessun altro cambio segnalato</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Header di sezione uniforme
const SectionHeader = ({ icon: Icon, title, eyebrow }: { icon: React.ElementType; title: string; eyebrow?: string }) => (
  <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
    {eyebrow && (
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary/70">{eyebrow}</p>
    )}
    <h2 className="flex items-center gap-2.5 text-2xl font-heading font-bold text-foreground">
      <Icon className="h-6 w-6 text-primary" />
      {title}
    </h2>
  </motion.div>
);

const AlbiTrailArea = () => {
  const groupedTrails = trailSections.map((section) => ({
    ...section,
    trails: trails
      .filter((trail) => section.types.includes(trail.trailType))
      .sort(sortTrailsForSection(section.key)),
  }));
  const nextBikeEvent = getNextBikeEvent();
  const zoneBAlert = useZoneBAlert();

  return (
    <Layout>
      <Seo
        title="Albi Trail Area, MTB a Ellera"
        description="Esplora l'Albi Trail Area di Ellera: trail MTB tra discese tecniche, risalite pedalate e mappe GPX nel cuore della Liguria."
        image={albiImage}
        imageAlt="Mountain biker in un passaggio tra gli alberi nei trail di Ellera"
      />
      <PageHero
        imageSrc={albiImage}
        imageAlt="Mountain biker in un passaggio tra gli alberi nei trail di Ellera"
        eyebrow="Outdoor MTB"
        eyebrowIcon={Bike}
        title="Albi Trail Area"
        description="Mountain Bike nel cuore della Liguria"
        headerChildren={
          <img
            src={albiTrailAreaLogo}
            alt="Albi Trail Area"
            className="mb-3 h-16 w-16 rounded-full object-contain opacity-90 shadow-lg ring-2 ring-white/20"
          />
        }
      />

      {/* ── Sezione Meteo ── sfondo cream */}
      <section className="bg-[var(--cream,#f5f0e8)] py-10">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <SectionHeader icon={MapPin} eyebrow="Condizioni" title="Meteo in zona" />
          <TrailAreaAlertNotice zoneAlert={zoneBAlert} />
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Suspense fallback={<div className="flex h-[180px] items-center justify-center rounded-2xl bg-white/60"><MapPin className="h-8 w-8 text-primary/60" /></div>}>
              <WeatherWidget variant="forecast" />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* ── Sezione Mappa ── sfondo background */}
      <section className="bg-background py-10">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <SectionHeader icon={MapPin} eyebrow="Navigazione" title="Mappa Trail" />
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Suspense fallback={<MapFallback />}>
              <TrailMap />
            </Suspense>
          </motion.div>
          {/* Note + Regole inline sotto la mappa */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-card p-5 shadow-sm">
              <Accordion type="single" collapsible>
                <AccordionItem value="note">
                  <AccordionTrigger className="font-serif text-sm font-semibold text-foreground">
                    <span className="flex items-center gap-2"><Info className="h-3.5 w-3.5 text-primary/70" />Note</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] leading-[1.7] text-muted-foreground">
                    <ul className="list-disc space-y-1 pl-4">
                      <li>Nessun servizio shuttle disponibile.</li>
                      <li>La risalita è interamente pedalata e richiede autonomia per tutto il giro.</li>
                      <li>Controlla meteo, fondo e stato dei sentieri prima di partire.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="rounded-xl border border-black/10 bg-card p-5 shadow-sm">
              <Accordion type="single" collapsible>
                <AccordionItem value="regole">
                  <AccordionTrigger className="font-serif text-sm font-semibold text-foreground">
                    <span className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-primary/70" />Regole</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] leading-[1.7] text-muted-foreground">
                    <ul className="list-disc space-y-1 pl-4">
                      {trailRules.map((rule, i) => <li key={i}>{rule}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sezione Evento ── sfondo forest tenue */}
      {nextBikeEvent && (
        <section className="bg-[var(--forest-mid,#264d3a)]/10 py-12">
          <div className="container mx-auto max-w-5xl px-4 lg:px-8">
            <SectionHeader icon={Calendar} eyebrow="In programma" title="Prossimo evento" />
            <FeaturedEventCard event={nextBikeEvent} />
          </div>
        </section>
      )}

      {/* ── Sezione Sentieri ── sfondo background */}
      <section className="bg-background py-10">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <SectionHeader icon={Bike} eyebrow="Esplora" title="Sentieri Attivi" />
          <div className="mb-6 space-y-8">
            {groupedTrails.map((section, sectionIndex) => {
              const SectionIcon = trailSectionIconMap[section.icon];
              return (
                <motion.div key={section.key} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h3 className="flex items-center gap-2 text-xl font-heading font-bold text-foreground">
                      <SectionIcon className="w-5 h-5 text-primary" />
                      {section.title}
                    </h3>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">{section.trails.length}</span>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">{section.description}</p>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {section.trails.map((trail, i) => (
                      <motion.div
                        key={trail.slug}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: sectionIndex * 0.03 + i * 0.04 }}
                        className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-warm"
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="font-heading font-bold text-foreground">
                            <Link to={`/mtb/${trail.slug}`} className="transition-colors hover:text-primary">{trail.name}</Link>
                          </h3>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${trail.difficultyColor}`}>{trail.difficultyEmoji} {trail.difficulty}</span>
                        </div>
                        {trail.specs && <p className="mb-2 text-xs font-medium text-primary">{trail.specs}</p>}
                        <p className="mb-4 flex-1 text-sm text-muted-foreground">{trail.desc}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          {trail.gpxPath && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={trail.gpxPath} download><Download className="w-3.5 h-3.5" />Scarica GPX</a>
                            </Button>
                          )}
                          {trail.trailforksUrl && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={trail.trailforksUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-3.5 h-3.5" />Trailforks</a>
                            </Button>
                          )}
                          <Link to={`/mtb/${trail.slug}`} className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80">
                            Dettagli <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Caeffo 2.0 */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-8 rounded-xl border-2 border-dashed border-accent/30 bg-accent/10 p-5">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="font-heading font-bold text-foreground">Caeffo 2.0</h3>
              <span className="animate-pulse rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">COMING SOON</span>
            </div>
            <p className="text-sm text-muted-foreground">Nuovo progetto del Comitato in fase di ultimazione. Sarà il nuovo riferimento per l'enduro locale.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Sezione Lavori / Crovaro ── sfondo cream */}
      <section className="bg-[var(--cream,#f5f0e8)] py-10">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <SectionHeader icon={AlertTriangle} eyebrow="Aggiornamenti" title="Lavori in Corso" />

          <p className="mb-6 text-sm text-muted-foreground">Il Comitato sta lavorando attivamente per riaprire i seguenti sentieri.</p>
          <div className="mb-8 space-y-3">
            {inactiveTrails.map((trail) => (
              <motion.div key={trail.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex items-center gap-3 rounded-lg bg-white/70 p-4 shadow-sm">
                <span className="font-heading font-semibold text-muted-foreground">{trail.name}</span>
                <span className="rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs text-muted-foreground">{trail.status}</span>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-heading font-bold text-foreground">
              <ArrowUpCircle className="w-5 h-5 text-primary" />
              Progetto Crovaro - Gestione dei Flussi
            </h2>
            <div className="rounded-xl border border-border bg-white/70 p-6 shadow-sm">
              <p className="leading-relaxed text-muted-foreground">
                Il nuovo piano prevede la trasformazione del <strong>Crovaro Express</strong> da discesa a <strong>risalita dedicata</strong> per
                accedere al Crovaro DH. Questo ottimizzerà l'accesso al sentiero, riducendo i conflitti tra rider in salita e in discesa
                e migliorando la sicurezza complessiva della trail area.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
};

export default AlbiTrailArea;
