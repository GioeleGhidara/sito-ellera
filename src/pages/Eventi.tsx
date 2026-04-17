import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  CalendarPlus,
  Clock3,
  MapPin,
} from "@/lib/icons";
import type { EventCategory } from "@/data/events";
import { events, getFeaturedEvent, hasEventDetail } from "@/data/events";
import { downloadIcs } from "@/lib/ics";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import DecorativeSeparator from "@/components/DecorativeSeparator";
import {
  categoryClasses,
  EventOrganizerBadges,
  EventPoster,
  FeaturedEventCard,
  formatEventDate,
} from "@/components/EventCard";
import { caruggiEventImage } from "@/assets/images";
import { eventDetailPath } from "@/lib/routes";
import { type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const staggerList: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

type SporadicFilter = "Tutti" | EventCategory;

const sporadicFilters: SporadicFilter[] = ["Tutti", "Cultura", "Outdoor", "Festa", "Teatro", "Altro"];

const Eventi = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawFilter = searchParams.get("categoria");
  const activeFilter = sporadicFilters.includes(rawFilter as SporadicFilter)
    ? (rawFilter as SporadicFilter)
    : "Tutti";

  const filteredSporadicEvents =
    activeFilter === "Tutti"
      ? events
      : events.filter((event) => event.category === activeFilter);
  const closestEvent =
    activeFilter === "Tutti"
      ? (getFeaturedEvent() ?? events[0])
      : (filteredSporadicEvents[0] ?? null);

  const remainingEvents = closestEvent
    ? filteredSporadicEvents.filter((e) => e.slug !== closestEvent.slug)
    : filteredSporadicEvents;

  const handleFilterChange = (filter: SporadicFilter) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (filter === "Tutti") {
      nextSearchParams.delete("categoria");
    } else {
      nextSearchParams.set("categoria", filter);
    }
    setSearchParams(nextSearchParams, { replace: true });
  };

  return (
    <Layout>
      <PageHero
        imageSrc={caruggiEventImage}
        imageAlt="Scorcio degli eventi di Ellera"
        eyebrow="Calendario"
        eyebrowIcon={CalendarDays}
        title="Eventi"
        description="Gli appuntamenti che scandiscono la vita del borgo, tra tradizione e festa."
        sectionClassName="h-[42vh] min-h-[320px]"
        titleClassName="font-heading text-3xl md:text-4xl lg:text-5xl"
        containerClassName="pb-8 lg:pb-10"
      />

      <section className="bg-background py-12 lg:py-16">
        <div className="container mx-auto max-w-6xl px-4 lg:px-8">
          {closestEvent && (
            <>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                className="mb-6 lg:mb-7"
              >
                <div className="mb-2.5 flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                    Prossimo Evento in Calendario
                  </span>
                </div>
              </motion.div>

              <FeaturedEventCard event={closestEvent} />
            </>
          )}

          <DecorativeSeparator />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mb-6 lg:mb-7"
          >
            <div className="mb-2.5 flex items-center gap-2.5">
              <Clock3 className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Tutti gli Appuntamenti
              </span>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-heading text-2xl font-semibold leading-tight text-foreground md:text-3xl lg:text-4xl">
                  Calendario
                </h2>
                <p className="mt-2.5 text-sm leading-7 text-muted-foreground md:text-base">
                  Esplora tutti gli eventi che si terranno quest'anno nel borgo di Ellera.
                  Usa i filtri per trovare più facilmente quello che ti interessa.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {sporadicFilters.map((filter) => {
                  const isActive = activeFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => handleFilterChange(filter)}
                      className={`rounded-full border border-border px-3.5 py-1.5 text-xs hover:bg-accent/10 hover:text-accent transition-colors ${isActive ? "bg-accent/10 text-accent shadow-sm" : "bg-background text-muted-foreground"
                        }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={staggerList} className="space-y-3.5 lg:space-y-4">
            {remainingEvents.length > 0 ? (
              remainingEvents.map((event) => {
                const formattedDate = formatEventDate(event.startDate, event.endDate, event.dateToBeConfirmed);

                return (
                  <motion.article
                    key={event.title}
                    variants={fadeUp}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-warm md:p-4 lg:p-5 group"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-4 lg:gap-5">
                      <div className="flex shrink-0 justify-center overflow-hidden rounded-t-2xl sm:rounded-[1.25rem] sm:rounded-r-none border-b sm:border-b-0 sm:border-r border-border bg-card md:max-w-[40%] lg:max-w-[30%] min-w-[120px]">
                        <div className="relative flex h-full min-h-[96px] flex-row items-center text-white md:flex-col md:justify-center">
                          <EventPoster
                            image={event.image}
                            alt={event.title}
                            placeholderLabel={event.posterPlaceholderLabel}
                            className="h-[140px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full md:min-h-[200px] md:w-auto md:object-cover"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/70 md:bg-black/40" />
                          <div className="pointer-events-none absolute inset-0 flex flex-row items-center gap-3 px-4 py-4 md:flex-col md:justify-center md:gap-1">
                            <span className={`font-heading font-semibold leading-none text-center ${formattedDate.day.length > 2 ? 'text-2xl tracking-tighter md:text-3xl' : 'text-4xl'}`}>
                              {formattedDate.day}
                            </span>
                            <div className="flex flex-col text-center md:items-center">
                              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/95">
                                {formattedDate.month}
                              </span>
                              <span className="text-[11px] text-white/70">{formattedDate.weekday}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 flex flex-col">
                        <div className="flex flex-col gap-3">
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${event.category ? categoryClasses[event.category] : categoryClasses["Altro"]}`}
                              >
                                {event.category || "Altro"}
                              </span>
                              <span className="text-xs text-muted-foreground md:text-sm">{formattedDate.full}</span>
                              {event.status && (
                                <span className="ml-1 rounded-full border border-border/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                  {event.status}
                                </span>
                              )}
                            </div>
                            <h3 className="font-heading text-xl font-semibold leading-tight text-foreground md:text-2xl">
                              {event.title}
                            </h3>
                            <div className="mt-3">
                              <EventOrganizerBadges event={event} />
                            </div>
                          </div>
                        </div>

                        <p className="mt-2.5 text-sm leading-7 text-muted-foreground md:text-base flex-1">
                          {event.desc}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-accent" />
                            {event.locationUrl ? (
                              <a
                                href={event.locationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-accent hover:underline"
                                title="Apri in Google Maps"
                              >
                                {event.location}
                              </a>
                            ) : (
                              <span>{event.location}</span>
                            )}
                          </div>

                          <div className="flex flex-1 items-center justify-end gap-3.5">
                            {hasEventDetail(event) && (
                              <Link
                                to={eventDetailPath(event.slug)}
                                className="inline-flex flex-shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent transition-all hover:gap-2.5"
                              >
                                Dettagli
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            )}

                            <button
                              onClick={() => downloadIcs(event)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-all hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
                              title="Aggiungi al calendario (.ics)"
                            >
                              <CalendarPlus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            ) : (
              <motion.div
                variants={fadeUp}
                className="rounded-2xl border border-dashed border-border bg-card/60 px-5 py-8 text-center"
              >
                <p className="font-heading text-xl text-foreground md:text-2xl">Nessun altro evento in questa categoria</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">
                  Cambia filtro per esplorare gli altri appuntamenti.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Eventi;
