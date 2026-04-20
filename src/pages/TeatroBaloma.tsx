import { motion } from "framer-motion";
import { useEffect, useState, type ElementType } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Film,
  HandCoins,
  HardHat,
  Heart,
  Info,
  Instagram,
  Mail,
  MapPin,
  Music,
  Phone,
  Quote,
  Sparkles,
  Theater,
  Users,
  Wrench,
  GhostUsers,
  GhostCalendar,
  GhostHeart,
  GhostSparkles,
  GhostMusic,
  GhostTheater,
  GhostWrench,
  GhostFilm,
  GhostPhone,
  GhostMail,
  GhostHandCoins,
  GhostHardHat,
} from "@/lib/icons";
import { FeaturedEventCard } from "@/components/EventCard";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import Seo from "@/components/Seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ROUTES } from "@/lib/routes";
import {
  teatroBalomaBoxImage,
  teatroBalomaExteriorImage as teatroHero,
  teatroBalomaInteriorImage,
  teatroBalomaSideImage,
} from "@/assets/images";
import {
  teatroBalomaContacts,
  teatroBalomaHighlights,
  teatroBalomaIntro,
  teatroBalomaNeeds,
  teatroBalomaRecentEvents,
  teatroBalomaTimeline,
  teatroBalomaUseCases,
  type TeatroBalomaHighlight,
  type TeatroBalomaIconKey,
  type TeatroBalomaRecentEvent,
  type TeatroBalomaUseCase,
} from "@/data/teatroBaloma";
import { getUpcomingEventsByCategory } from "@/data/events";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const MOBILE_BREAKPOINT = "(max-width: 639px)";

const iconMap: Record<TeatroBalomaIconKey, ElementType> = {
  calendar: CalendarDays,
  film: Film,
  handCoins: HandCoins,
  hardHat: HardHat,
  heart: Heart,
  mail: Mail,
  music: Music,
  phone: Phone,
  sparkles: Sparkles,
  theater: Theater,
  users: Users,
  wrench: Wrench,
};

// FA6 solid - icone filled per l'uso come fantasma di sfondo nelle card.
const ghostIconMap: Record<TeatroBalomaIconKey, ElementType> = {
  calendar: GhostCalendar,
  film: GhostFilm,
  handCoins: GhostHandCoins,
  hardHat: GhostHardHat,
  heart: GhostHeart,
  mail: GhostMail,
  music: GhostMusic,
  phone: GhostPhone,
  sparkles: GhostSparkles,
  theater: GhostTheater,
  users: GhostUsers,
  wrench: GhostWrench,
};

const galleryItems = [
  {
    src: teatroBalomaInteriorImage,
    alt: "Interno del Teatro Balomà durante un evento",
    title: "La sala oggi",
    caption:
      "Una capienza raccolta, atmosfera ravvicinata e uno spazio che si presta a concerti, incontri, pratiche di benessere e serate di comunità.",
  },
  {
    src: teatroBalomaSideImage,
    alt: "Fianco del Teatro Balomà a Ellera",
    title: "Un presidio nel borgo",
    caption:
      "L'edificio conserva la presenza del vecchio cinema di paese ma oggi lavora come spazio culturale flessibile, accessibile e riattivato.",
  },
  {
    src: teatroBalomaBoxImage,
    alt: "Dettaglio interno del Teatro Balomà",
    title: "Recupero per fasi",
    caption:
      "Tra il 2018 e il 2023 il Balomà è stato riordinato pezzo dopo pezzo, fino a tornare a essere una sala pronta per uso continuativo.",
  },
];

const relatedLinks = [
  {
    to: ROUTES.eventi,
    title: "Eventi del borgo",
    description: "Scopri il calendario del paese e gli appuntamenti che completano la vita del Balomà.",
    GhostIcon: GhostCalendar,
  },
  {
    to: ROUTES.comitato,
    title: "Comitato Ellerese",
    description: "Conosci il gruppo che sostiene gli spazi e i progetti culturali di Ellera.",
    GhostIcon: GhostUsers,
  },
  {
    to: ROUTES.tradizioni,
    title: "Tradizioni di Ellera",
    description: "Il Balomà vive meglio dentro la storia più ampia del borgo, tra memoria e luoghi simbolici.",
    GhostIcon: GhostHeart,
  },
];

const isRecentEventPast = (event: TeatroBalomaRecentEvent, now = new Date()) =>
  new Date(`${event.endDate ?? event.startDate}T23:59:59.999`).getTime() < now.getTime();

const buildRecentEventArchive = (events: TeatroBalomaRecentEvent[], now = new Date()) => {
  const years = Array.from(new Set(events.map((event) => event.startDate.slice(0, 4)))).sort(
    (left, right) => Number(left) - Number(right)
  );

  return years.map((year) => ({
    year,
    events: events
      .filter((event) => event.startDate.startsWith(year) && isRecentEventPast(event, now))
      .sort((left, right) => left.startDate.localeCompare(right.startDate)),
  }));
};

const getArchiveCountLabel = (count: number) => {
  if (count === 0) return "in attesa";
  return count === 1 ? "1 data" : `${count} date`;
};

const getArchiveIntro = (archive: { year: string; events: TeatroBalomaRecentEvent[] }[]) => {
  const archivedYears = archive.filter((group) => group.events.length > 0).map((group) => group.year);

  if (archivedYears.length === 0) {
    return "L'archivio mostra solo gli appuntamenti già svolti e si aggiorna automaticamente quando anche le date future diventano passate.";
  }

  const firstYear = archivedYears[0];
  const lastYear = archivedYears[archivedYears.length - 1];
  const prefix =
    firstYear === lastYear
      ? `Nel ${firstYear} il Balomà ha già ospitato`
      : `Tra il ${firstYear} e il ${lastYear} il Balomà ha già ospitato`;

  return `${prefix} incontri culturali, esperienze sonore, danza, pratiche di benessere e appuntamenti divulgativi. Le date future entrano qui automaticamente appena si svolgono.`;
};

const highlightCard = (item: TeatroBalomaHighlight) => {
  const GhostIcon = ghostIconMap[item.icon];

  return (
    <div
      key={item.label}
      className="relative rounded-2xl border border-border/70 bg-card/80 p-3.5 shadow-[0_20px_60px_-30px_hsl(var(--foreground)/0.35)] sm:p-5"
    >
      {/* overflow-hidden solo sull'icona, non sul card - il testo non viene mai clippato */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <GhostIcon className="absolute bottom-2 right-2 h-16 w-16 text-accent opacity-[0.13] sm:h-20 sm:w-20" />
      </div>

      <div className="relative">
        <div className="text-xl font-heading font-bold leading-tight text-foreground sm:text-3xl">
          {item.value}
        </div>
        <p className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-accent sm:mt-2 sm:text-xs sm:tracking-[0.18em]">
          {item.label}
        </p>
        <p className="mt-3 hidden text-sm leading-relaxed text-muted-foreground sm:block">{item.note}</p>
      </div>
    </div>
  );
};

// Mobile (2-col): icona ghost di sfondo, testo compatto.
const renderUseCaseCard = (item: TeatroBalomaUseCase) => {
  const GhostIcon = ghostIconMap[item.icon];

  return (
    <div
      key={item.title}
      className="relative rounded-2xl border border-border/60 bg-background p-3.5 transition-colors hover:border-accent/30 sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <GhostIcon className="absolute -bottom-2 -right-2 h-14 w-14 text-accent opacity-[0.1] sm:h-16 sm:w-16" />
      </div>
      <div className="relative">
        <h3 className="text-sm font-heading font-bold leading-snug text-foreground sm:text-lg">{item.title}</h3>
        <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
};

const ArchiveEventItem = ({
  event,
  isMobile,
}: {
  event: TeatroBalomaRecentEvent;
  isMobile: boolean;
}) => (
  <article className="border-t border-border/60 pt-3 first:border-t-0 first:pt-0 sm:pt-4">
    <div className="flex items-start justify-between gap-2 sm:gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{event.date}</p>
        <h4 className="mt-1 text-sm font-semibold text-foreground sm:text-base">{event.title}</h4>
        {event.host && <p className="mt-0.5 text-sm text-muted-foreground sm:mt-1">{event.host}</p>}
        {event.note && (
          <p className="mt-1.5 text-sm leading-5 text-muted-foreground sm:mt-2 sm:leading-relaxed">{event.note}</p>
        )}
      </div>
      {event.description && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={`Dettagli su: ${event.title}`}
              className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-accent/30 hover:text-accent sm:h-7 sm:w-7"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side={isMobile ? "bottom" : "left"}
            align={isMobile ? "end" : "start"}
            className="w-[calc(100vw-2.5rem)] max-w-72 rounded-2xl border-border/70 p-4 sm:w-72"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{event.title}</p>
            {event.host && (
              <p className="mb-2 text-xs font-medium text-muted-foreground">{event.host}</p>
            )}
            {event.image && (
              <div className="mb-3 overflow-hidden rounded-md border border-border/50">
                <img src={event.image} alt={`Locandina ${event.title}`} className="w-full object-cover" />
              </div>
            )}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{event.description}</p>
          </PopoverContent>
        </Popover>
      )}
    </div>
  </article>
);

const TeatroBaloma = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const recentEventArchive = buildRecentEventArchive(teatroBalomaRecentEvents);
  const upcomingTheaterEvents = getUpcomingEventsByCategory("Teatro");
  const pageContainerClassName = "container mx-auto max-w-5xl px-4 lg:px-8";

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_BREAKPOINT);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [location.hash]);

  return (
    <Layout>
      <Seo
        title="Teatro Balomà a Ellera"
        description="Ex cinema di Ellera rinato come spazio culturale: storia, recupero, programmazione recente, affitto sala e contatti del Teatro Balomà."
        image={teatroHero}
        imageAlt="Esterno del Teatro Balomà a Ellera"
      />

      <PageHero
        imageSrc={teatroHero}
        imageAlt="Facciata del Teatro Balomà"
        eyebrow="Ex Cinema, Teatro e Sala Polivalente"
        eyebrowIcon={Film}
        title="Teatro Balomà"
        footerChildren={(
          <div className="flex flex-wrap items-center gap-2 text-primary-foreground/85">
            <span className="inline-flex items-center gap-2 text-sm font-medium lg:text-base">
              <MapPin className="h-4 w-4 text-accent" />
              {teatroBalomaContacts.address}
            </span>
          </div>
        )}
      />

      {/* ── INTRO ─────────────────────────────────────────────────────────── */}
      <section className="bg-background py-10 sm:py-16 lg:py-24">
        <div className={pageContainerClassName}>
          {/*
            Mobile: highlights salgono prima del testo (order-1 / order-2).
            Da sm in poi l'ordine DOM naturale viene ripristinato (sm:order-none).
          */}
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="order-2 max-w-3xl sm:order-none"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                <Film className="h-3.5 w-3.5" />
                Identità del luogo
              </span>
              <h2 className="mt-4 text-2xl font-heading font-bold text-foreground sm:text-3xl lg:text-4xl">
                Dal vecchio cinema a uno spazio che il paese vuole tenere acceso
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/85 sm:mt-5 sm:text-lg">
                {teatroBalomaIntro.lead}
              </p>

              {/* Paragrafi 2 e 3 nascosti su mobile: il lead + primo para danno contesto sufficiente */}
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground sm:mt-6 sm:space-y-4 sm:text-base sm:leading-relaxed">
                {teatroBalomaIntro.paragraphs.map((paragraph, i) => (
                  <p key={paragraph} className={i > 0 ? "hidden sm:block" : undefined}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-accent/15 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-4 sm:mt-8 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground sm:mt-1 sm:h-11 sm:w-11 sm:rounded-2xl">
                    <Quote className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-heading font-bold text-foreground sm:text-xl">
                      {teatroBalomaIntro.quote}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Il dato più importante non è tecnico: il Balomà ha senso se continua a essere usato, prenotato,
                      frequentato e riconosciuto come spazio comune.
                    </p>
                    <div className="mt-4 sm:mt-5">
                      <Link
                        to={`${ROUTES.tradizioni}/cinema-e-teatro-balomà`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent/80 hover:underline"
                      >
                        Vuoi saperne di più? Leggi la storia completa qui
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2 colonne su tutti gli schermi; note nascoste su mobile */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="order-1 grid grid-cols-2 gap-3 sm:order-none sm:gap-4"
            >
              {teatroBalomaHighlights.map((item) => highlightCard(item))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ───────────────────────────────────────────────── */}
      {upcomingTheaterEvents.length > 0 && (
        <section className="border-y border-border/60 bg-[hsl(18,28%,96%)] py-10 sm:py-16 lg:py-20">
          <div className={pageContainerClassName}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mb-6 flex flex-col gap-3 sm:mb-8 sm:gap-4 lg:flex-row lg:items-end lg:justify-between"
            >
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5 text-accent" />
                  Prossimi eventi al Balomà
                </span>
                <h2 className="mt-4 text-2xl font-heading font-bold text-foreground sm:text-3xl lg:text-4xl">
                  Gli appuntamenti già in calendario per la sala
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-relaxed">
                  Questa scheda usa lo stesso sistema eventi del sito e mostra solo gli appuntamenti con filtro
                  <strong> Teatro</strong>.
                </p>
              </div>
              <Link
                to={`${ROUTES.eventi}?categoria=Teatro`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
              >
                Vedi tutti gli eventi Teatro
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              {upcomingTheaterEvents.map((event) => (
                <FeaturedEventCard key={event.slug} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TIMELINE ──────────────────────────────────────────────────────── */}
      <section className="border-y border-border/60 bg-secondary/20 py-10 sm:py-16 lg:py-24">
        <div className={pageContainerClassName}>
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <HardHat className="h-3.5 w-3.5 text-accent" />
                Cronologia del recupero
              </span>
              <h2 className="mt-4 text-2xl font-heading font-bold text-foreground sm:text-3xl lg:text-4xl">
                Una rinascita costruita per fasi
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-relaxed">
                Il Balomà non è tornato tutto insieme: si è rimesso in piedi poco per volta, con lavori distribuiti
                nel tempo e l'idea di restituire al paese uno spazio davvero usabile.
              </p>

              <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                {teatroBalomaTimeline.map((item) => (
                  <div
                    key={`${item.year}-${item.title}`}
                    className="rounded-2xl border border-border/70 bg-card/85 p-4 shadow-[0_16px_50px_-34px_hsl(var(--foreground)/0.28)] sm:p-5"
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span className="flex-shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[0.7rem] font-bold tracking-wide text-accent">
                        {item.year}
                      </span>
                      <h3 className="text-base font-heading font-bold leading-snug text-foreground">{item.title}</h3>
                    </div>
                    <p className="mt-2.5 text-sm leading-6 text-muted-foreground sm:mt-3 sm:leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
            >
              {galleryItems.slice(0, 2).map((item, index) => (
                // Su mobile una sola immagine è sufficiente: la seconda è nascosta
                <figure
                  key={item.title}
                  className={`overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_24px_60px_-34px_hsl(var(--foreground)/0.35)]${index > 0 ? " hidden sm:block" : ""}`}
                >
                  <img src={item.src} alt={item.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <figcaption className="space-y-1.5 p-4 sm:space-y-2 sm:p-5">
                    <p className="text-base font-heading font-bold text-foreground">{item.title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── USE CASES ─────────────────────────────────────────────────────── */}
      <section className="bg-background py-10 sm:py-16 lg:py-24">
        <div className={pageContainerClassName}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Uso reale della sala
            </span>
            <h2 className="mt-4 text-2xl font-heading font-bold text-foreground sm:text-3xl lg:text-4xl">
              Un contenitore culturale aperto a format molto diversi
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-relaxed">
              Dalle riunioni alle pratiche olistiche, dai recital alle mostre: il Balomà funziona proprio perché non
              si chiude in una sola definizione.
            </p>
          </motion.div>

          {/* 2 colonne su mobile, 2 su md, 3 su xl */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 xl:grid-cols-3">
            {teatroBalomaUseCases.map((item) => renderUseCaseCard(item))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-4 relative rounded-3xl border border-border/70 bg-card/80 p-4 sm:mt-8 sm:p-6 lg:p-7"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              <GhostFilm className="absolute -bottom-4 -right-4 h-28 w-28 text-accent opacity-[0.08] sm:h-36 sm:w-36" />
            </div>
            <div className="relative">
              <h3 className="text-base font-heading font-bold text-foreground sm:text-xl">
                Non solo un palco: anche un archivio vivo
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground sm:leading-relaxed">
                La macchina del cinema è ancora lì. Questa continuità materiale tra il vecchio cinema e l'uso
                contemporaneo del teatro è una delle qualità più forti del Balomà: non un contenitore neutro, ma uno
                spazio con memoria reale.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ARCHIVE ───────────────────────────────────────────────────────── */}
      <section className="border-y border-border/60 bg-secondary/20 py-10 sm:py-16 lg:py-24">
        <div className={pageContainerClassName}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-accent" />
              Programmazione recente
            </span>
            <h2 className="mt-4 text-2xl font-heading font-bold text-foreground sm:text-3xl lg:text-4xl">
              Un archivio che mostra come la sala sia già in movimento
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-relaxed">
              {getArchiveIntro(recentEventArchive)}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-8 sm:mt-10"
          >
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              {recentEventArchive.map(({ year, events }) => (
                <AccordionItem
                  key={year}
                  value={year}
                  className="overflow-hidden rounded-3xl border border-border/70 bg-card px-4 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.35)] sm:px-6"
                >
                  <AccordionTrigger className="gap-3 py-4 hover:no-underline sm:gap-4 sm:py-5">
                    <div className="flex flex-1 items-center justify-between gap-4 text-left">
                      <h3 className="text-xl font-heading font-bold text-foreground sm:text-2xl">{year}</h3>
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                        {getArchiveCountLabel(events.length)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 sm:pb-6">
                    {events.length > 0 ? (
                      <div className="space-y-3 sm:space-y-4">
                        {events.map((event) => (
                          <ArchiveEventItem
                            key={`${event.date}-${event.title}`}
                            event={event}
                            isMobile={isMobile}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 px-4 py-4 text-sm leading-relaxed text-muted-foreground">
                        Per il {year} non ci sono ancora date passate in archivio. Gli appuntamenti futuri compariranno
                        qui automaticamente dopo il loro svolgimento.
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ── SUPPORT ───────────────────────────────────────────────────────── */}
      <section
        id="sostieni"
        className="scroll-mt-24 border-y border-border/60 bg-[hsl(35,45%,96%)] py-10 sm:py-16 lg:scroll-mt-28 lg:py-24"
      >
        <div className={pageContainerClassName}>
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-start">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                <Heart className="h-3.5 w-3.5" />
                Sostieni il Balomà
              </span>
              <h2 className="mt-4 text-2xl font-heading font-bold text-foreground sm:text-3xl lg:text-4xl">
                Sostegno e obiettivi per far crescere davvero il Balomà
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-relaxed">
                Se vuoi contribuire, c'è una pagina dedicata con bonifico, PayPal e contatti diretti. Qui sotto trovi
                anche gli obiettivi concreti su cui oggi il sostegno può incidere davvero.
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:mt-4">
                {teatroBalomaContacts.supportNote}
              </p>

              <div className="mt-6 sm:mt-8">
                <Link
                  to={ROUTES.teatroBalomaSupport}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                >
                  Pagina sostegno completa
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 rounded-3xl border border-border/70 bg-card/85 p-4 shadow-[0_18px_52px_-36px_hsl(var(--foreground)/0.32)] sm:mt-8 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Obiettivi</p>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:space-y-3">
                  {teatroBalomaNeeds.map((item) => (
                    <li key={item.title} className="list-inside list-disc">
                      <span className="font-semibold text-foreground">{item.title}:</span> {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <div className="space-y-4 sm:space-y-6">
              <motion.aside
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative rounded-3xl border border-border/70 bg-card p-4 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.35)] sm:p-6"
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                  <GhostHandCoins className="absolute -bottom-3 -right-3 h-24 w-24 text-accent opacity-[0.07] sm:h-28 sm:w-28" />
                </div>
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Accesso rapido</p>
                  <h3 className="mt-2.5 text-xl font-heading font-bold text-foreground sm:mt-3 sm:text-2xl">
                    Dati essenziali, senza distrazioni
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:text-accent"
                        >
                          Bonifico
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="start"
                        className="w-[calc(100vw-2.5rem)] max-w-[340px] rounded-3xl border-border/70 p-5"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Bonifico</p>
                        <p className="mt-4 text-sm font-semibold text-foreground">
                          {teatroBalomaContacts.supportAccountHolder}
                        </p>
                        <p className="mt-3 break-all font-mono text-sm text-foreground">
                          {teatroBalomaContacts.supportIban}
                        </p>
                      </PopoverContent>
                    </Popover>

                    <a
                      href={teatroBalomaContacts.supportPaypalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:text-accent"
                    >
                      PayPal
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.aside>

              <motion.aside
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative rounded-3xl border border-border/70 bg-card p-4 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.35)] sm:p-6"
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                  <GhostPhone className="absolute -bottom-3 -right-3 h-24 w-24 text-accent opacity-[0.07] sm:h-28 sm:w-28" />
                </div>
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Affitto e contatti</p>
                  <h3 className="mt-2.5 text-xl font-heading font-bold text-foreground sm:mt-3 sm:text-2xl">
                    Porta un'attività dentro il Balomà
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:mt-3">
                    La sala può essere affittata e adattata a incontri, presentazioni, prove, laboratori e piccole
                    rassegne.
                  </p>

                  <div className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-3">
                    <a
                      href={`tel:${teatroBalomaContacts.phone}`}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:text-primary"
                    >
                      <span className="inline-flex items-center gap-3">
                        <Phone className="h-4 w-4 text-accent" />
                        {teatroBalomaContacts.phone}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </a>

                    <a
                      href={`mailto:${teatroBalomaContacts.email}`}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:text-primary"
                    >
                      <span className="inline-flex min-w-0 items-center gap-3">
                        <Mail className="h-4 w-4 flex-shrink-0 text-accent" />
                        <span className="break-all">{teatroBalomaContacts.email}</span>
                      </span>
                      <ArrowUpRight className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    </a>

                    <a
                      href={teatroBalomaContacts.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:text-primary"
                    >
                      <span className="inline-flex min-w-0 items-center gap-3">
                        <Instagram className="h-4 w-4 flex-shrink-0 text-accent" />
                        <span className="break-all">{teatroBalomaContacts.instagramLabel}</span>
                      </span>
                      <ArrowUpRight className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    </a>
                  </div>

                  <div className="mt-4 rounded-2xl bg-secondary/60 p-3.5 sm:mt-6 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Dove si trova
                    </p>
                    <p className="mt-2 inline-flex items-start gap-2 text-sm leading-relaxed text-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                      {teatroBalomaContacts.address}
                    </p>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED LINKS ─────────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-secondary/20 py-10 sm:py-16">
        <div className={pageContainerClassName}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-6 max-w-2xl sm:mb-8"
          >
            <h2 className="text-2xl font-heading font-bold text-foreground sm:text-3xl">Intorno al Balomà</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-relaxed">
              Questa pagina racconta il teatro, ma il suo senso pieno si capisce solo dentro il resto del borgo e dei
              progetti culturali di Ellera.
            </p>
          </motion.div>

          {/* 1-col su mobile, 3-col da sm: 3 card strette ci stanno bene */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {relatedLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group relative rounded-2xl border border-border/70 bg-card p-4 shadow-[0_18px_52px_-36px_hsl(var(--foreground)/0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 sm:p-6"
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  <item.GhostIcon className="absolute -bottom-3 -right-3 h-20 w-20 text-accent opacity-[0.09] sm:h-24 sm:w-24" />
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-heading font-bold text-foreground sm:text-lg">{item.title}</h3>
                    <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground sm:mt-3 sm:leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TeatroBaloma;