import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import {
  ArrowUpRight,
  BusFront,
  Clock3,
  ExternalLink,
  MapPin,
  Mountain,
  MoveRight,
  Route,
  TrendingUp,
} from "@/lib/icons";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import Seo from "@/components/shared/Seo";
import MaintenanceView from "@/components/shared/MaintenanceView";
import { trekkingPageImage as trekkingImage } from "@/assets/images";
import {
  trekkingRoutes,
  type Difficulty,
  difficultyColors,
  difficultyOrder,
  routeTypeLabel,
} from "@/data/trails/trekkingRoutes";
import { MAINTENANCE_CONFIG } from "@/config/maintenance";


const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const allDifficulties: ("Tutti" | Difficulty)[] = [
  "Tutti",
  "Facile",
  "Medio",
  "Impegnativo",
  "Esperto",
];

const ELLERA_COORDS = {
  lat: 44.363969,
  lon: 8.464636,
} as const;

const ELLERA_BBOX = {
  west: 8.424636,
  south: 44.333969,
  east: 8.504636,
  north: 44.393969,
} as const;

const getDurationStartMinutes = (durationH?: string) => {
  if (!durationH) {
    return Number.POSITIVE_INFINITY;
  }

  const firstChunk = durationH.split("-")[0]?.trim();
  const [hoursRaw, minutesRaw = "0"] = firstChunk.split(":");
  const hours = Number.parseInt(hoursRaw ?? "", 10);
  const minutes = Number.parseInt(minutesRaw ?? "", 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return Number.POSITIVE_INFINITY;
  }

  return hours * 60 + minutes;
};

const IS_UNDER_MAINTENANCE = MAINTENANCE_CONFIG.TREKKING;

const Trekking = () => {
  const [activeFilter, setActiveFilter] = useState<"Tutti" | Difficulty>("Tutti");

  if (IS_UNDER_MAINTENANCE) {
    return (
      <Layout>
        <Seo
          title="Trekking"
          description="Scopri i principali percorsi trekking da Ellera tra boschi, crinali panoramici e sentieri storici dell'entroterra savonese."
          image={trekkingImage}
          imageAlt="Escursionisti sui sentieri di Ellera"
        />
        <div className="h-16 lg:h-20 bg-slate-900" aria-hidden="true"></div>
        <section className="bg-background pt-12 pb-12 lg:pt-20 lg:pb-24">
          <div className="container mx-auto px-4">
            <MaintenanceView 
              title="Sezione Trekking in Manutenzione"
              message="Stiamo tracciando i nuovi percorsi e aggiornando la mappa dei sentieri. Torna presto per scoprire tutte le escursioni nella Valle Sansobbia."
            />
          </div>
        </section>
      </Layout>
    );
  }

  const filtered = [
    ...(activeFilter === "Tutti"
      ? trekkingRoutes
      : trekkingRoutes.filter((route) => route.difficulty === activeFilter)),
  ].sort(
    (a, b) =>
      difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] ||
      a.name.localeCompare(b.name, "it"),
  );

  const maxElevationGain = Math.max(...trekkingRoutes.map((route) => route.elevationGain ?? 0));
  const shortestDuration = trekkingRoutes.reduce((best, route) => {
    if (!best) {
      return route;
    }

    return getDurationStartMinutes(route.durationH) < getDurationStartMinutes(best.durationH)
      ? route
      : best;
  }, trekkingRoutes[0]);
  const shortestDurationLabel = shortestDuration.durationH?.split("-")[0]?.trim() ?? "2:00";

  return (
    <Layout>
      <Seo
        title="Trekking"
        description="Scopri i principali percorsi trekking da Ellera tra boschi, crinali panoramici e sentieri storici dell'entroterra savonese."
        image={trekkingImage}
        imageAlt="Escursionisti sui sentieri di Ellera"
      />
      <PageHero
        imageSrc={trekkingImage}
        imageAlt="Escursionisti sui sentieri liguri"
        eyebrow="Outdoor"
        eyebrowIcon={MapPin}
        title="Trekking"
        description="A piedi tra i sentieri della Valle Sansobbia"
      />

      <section className="bg-background py-10 lg:py-14">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg md:leading-9"
          >
            Ellera e il punto di partenza ideale per esplorare la rete sentieristica
            dell'entroterra savonese. Dai mulini storici lungo il Sansobbia fino all'Alta
            Via dei Monti Liguri, ogni sentiero racconta il rapporto millenario tra l'uomo
            e questa terra.
          </motion.p>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {[
              { icon: Route, label: "Percorsi", value: `${trekkingRoutes.length}` },
              { icon: Mountain, label: "Quota max", value: "835 m" },
              { icon: TrendingUp, label: "Dislivello max", value: `${maxElevationGain} m` },
              { icon: Clock3, label: "Da", value: `${shortestDurationLabel} h` },
            ].map(({ icon: Icon, label, value }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="rounded-xl border border-border bg-card px-4 py-4 text-center"
              >
                <Icon className="mx-auto mb-1.5 h-4 w-4 text-primary" />
                <div className="font-heading text-xl font-bold text-foreground">{value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-[var(--cream,#f5f0e8)] py-10 lg:py-12">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-5 flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Navigazione
            </span>
          </div>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
            Mappa dell'area
          </h2>
          <p className="mb-6 text-sm leading-7 text-muted-foreground">
            Vista della Valle Sansobbia con Ellera come punto di partenza. Per i tracciati
            GPS dettagliati consulta i link esterni nelle schede dei percorsi.
          </p>

          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <iframe
              title="Mappa sentieri Ellera"
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${ELLERA_BBOX.west}%2C${ELLERA_BBOX.south}%2C${ELLERA_BBOX.east}%2C${ELLERA_BBOX.north}&layer=mapnik&marker=${ELLERA_COORDS.lat}%2C${ELLERA_COORDS.lon}`}
            />
          </div>
          <p className="mt-3 text-right text-xs text-muted-foreground">
            <a
              href={`https://www.openstreetmap.org/?mlat=${ELLERA_COORDS.lat}&mlon=${ELLERA_COORDS.lon}#map=14/${ELLERA_COORDS.lat}/${ELLERA_COORDS.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-primary"
            >
              Apri mappa più grande <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </section>

      <section className="bg-background py-10 lg:py-14">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2.5">
                <Route className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Esplora
                </span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                Sentieri Attivi
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {allDifficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => setActiveFilter(difficulty)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    activeFilter === difficulty
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
            {filtered.map((route) => (
              <motion.article
                key={route.id}
                variants={fadeUp}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-warm"
              >
                <div className="p-5 lg:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${difficultyColors[route.difficulty]}`}
                      >
                        {route.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        <MoveRight className="h-3 w-3" />
                        {routeTypeLabel[route.type]}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {route.distanceKm && (
                        <span className="flex items-center gap-1">
                          <Route className="h-3 w-3" />
                          {route.distanceKm} km
                        </span>
                      )}
                      {route.elevationGain && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +{route.elevationGain} m
                        </span>
                      )}
                      {route.durationH && (
                        <span className="flex items-center gap-1">
                          <Clock3 className="h-3 w-3" />
                          {route.durationH} h
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="mt-3 font-heading text-xl font-semibold leading-tight text-foreground md:text-2xl">
                    {route.name}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-primary">{route.subtitle}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{route.desc}</p>

                  {route.highlights && route.highlights.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {route.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
                    {route.signage ? (
                      <span className="text-xs text-muted-foreground">
                        Segnavia:{" "}
                        <span className="font-semibold text-foreground">{route.signage}</span>
                      </span>
                    ) : (
                      <span />
                    )}
                    {route.externalUrl && (
                      <a
                        href={route.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition-all hover:gap-2.5"
                      >
                        Dettagli percorso
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}

            {filtered.length === 0 && (
              <motion.div
                variants={fadeUp}
                className="rounded-2xl border border-dashed border-border bg-card/60 px-5 py-10 text-center"
              >
                <p className="font-heading text-xl text-foreground">
                  Nessun percorso in questa categoria
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Seleziona un altro livello di difficoltà.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="bg-[var(--cream,#f5f0e8)] py-10 lg:py-12">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-6 flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Info pratiche
            </span>
          </div>
          <h2 className="mb-6 font-heading text-2xl font-bold text-foreground md:text-3xl">
            Come arrivare a Ellera
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Route,
                title: "In auto",
                desc: "Uscita casello Albisola (A10). A sinistra alla rotatoria, poi ancora a sinistra direzione Ellera. Circa 6 km lungo la Provinciale 2 sul Sansobbia. Parcheggio libero nei pressi della Chiesa di San Bartolomeo.",
              },
              {
                icon: BusFront,
                title: "In autobus",
                desc: "Linea TPL da Savona e Albisola Superiore con fermata a Ellera. Verificare gli orari sul sito TPL: il servizio è più limitato nel fine settimana.",
              },
              {
                icon: MapPin,
                title: "Punto di partenza",
                desc: "La maggior parte dei sentieri parte dalla Chiesa Parrocchiale di San Bartolomeo o dal Ponte Romano in Via Montenotte. Sul posto sono presenti tabelloni informativi.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5">
                <Icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-heading text-base font-semibold text-foreground">
              Risorse esterne
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  label: "MuntaEChinna Trekking - itinerari Ellera",
                  url: "https://leo-trekking.blogspot.com/p/elenco-itinerari.html",
                },
                {
                  label: "Portale Turismo Albisola",
                  url: "https://www.albisolaturismo.it",
                },
                {
                  label: "Parco del Beigua",
                  url: "https://www.parcobeigua.it",
                },
              ].map(({ label, url }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  {label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Trekking;

