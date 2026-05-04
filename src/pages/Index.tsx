import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bike,
  BookOpen,
  Calendar,
  Candy,
  Cat,
  ChevronDown,
  Church,
  Clapperboard,
  Cow,
  Leaf,
  Megaphone,
  Mountain,
  MapPin,
  Newspaper,
  Palette,
  Scale,
  Sparkles,
  Theater,
  WaterMill,
} from "@/lib/icons";
import type { Story } from "@/data/stories";
import { stories } from "@/data/stories";
import { events, hasEventDetail } from "@/data/events";
import { news } from "@/data/news";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import SeasonalHighlight from "@/components/SeasonalHighlight";
import { homeExploreItems, homeRootsCards } from "@/data/home";
import { ROUTES, newsDetailPath, eventDetailPath, tradizioneDetailPath } from "@/lib/routes";
import { triggerHaptic, HAPTIC_PATTERNS } from "@/lib/haptics";
import { createComitatoOrganizationJsonLd } from "@/lib/jsonLd";
import { elleraDalPonteImage } from "@/assets/images";

const WeatherWidget = lazy(() => import("@/components/WeatherWidget"));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const categoryColor: Record<string, string> = {
  Borgo: "bg-accent text-accent-foreground",
  Outdoor: "bg-primary text-primary-foreground",
  Cultura: "bg-primary/80 text-primary-foreground",
  Associazione: "bg-secondary text-secondary-foreground",
};

const homeExploreIconMap = {
  bike: Bike,
  theater: Theater,
  palette: Palette,
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const Index = () => {
  const pageDescription =
    "Scopri Ellera, borgo ligure tra galleria a cielo aperto, trail MTB, trekking, tradizioni, teatro ed eventi nel cuore della Valle Sansobbia.";
  const featuredNews = news[0];
  const highlightedEvents = events.filter((event) => event.showOnHome !== false).slice(0, 3);

  return (
    <Layout>
      <Seo
        title="Ellera, borgo in Liguria tra arte, trail e tradizioni"
        description={pageDescription}
        image={elleraDalPonteImage}
        imageAlt="Il borgo di Ellera visto dal ponte sul Sansobbia"
        jsonLd={createComitatoOrganizationJsonLd()}
      />

      <section className="relative flex h-[85vh] min-h-[500px] items-center justify-center overflow-hidden">
        <motion.img
          src={elleraDalPonteImage}
          alt="Il borgo di Ellera visto dal ponte sul Sansobbia"
          className="absolute inset-0 h-full w-full object-cover object-center"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-3xl px-4 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Ellera
          </h1>
          <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
            Galleria a Cielo Aperto & Outdoor nel cuore della Valle Sansobbia
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to={ROUTES.trekking}
              onClick={() => triggerHaptic(HAPTIC_PATTERNS.MEDIUM)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-warm transition-opacity hover:opacity-90"
            >
              <Mountain className="h-5 w-5" />
              Esplora i Sentieri
            </Link>
            <Link
              to={ROUTES.galleriaArte}
              onClick={() => triggerHaptic(HAPTIC_PATTERNS.MEDIUM)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/15 px-6 py-3 font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/25"
            >
              <Palette className="h-5 w-5" />
              Scopri il Borgo
            </Link>
          </div>
        </motion.div>

        <div className="absolute left-4 top-20 z-20 lg:left-8 lg:top-24">
          <Suspense
            fallback={(
              <div className="flex h-[44px] w-[172px] items-center justify-center rounded-full bg-[#edf5f0]">
                <MapPin className="h-5 w-5 text-primary/60" aria-hidden="true" />
              </div>
            )}
          >
            <WeatherWidget variant="compact" />
          </Suspense>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-wider text-primary-foreground/60">Scorri</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6 text-primary-foreground/70" />
          </motion.div>
        </motion.div>
      </section>

      <SeasonalHighlight />

      <section className="bg-background py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="mb-2 flex items-center gap-3">
              <Megaphone className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Novità da Ellera
              </span>
            </div>
            <h2 className="mb-10 text-3xl font-bold text-foreground lg:text-4xl">Ultime Novità</h2>
          </motion.div>

          {featuredNews && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16"
            >
              <Link
                to={newsDetailPath(featuredNews.slug)}
                className="group block rounded-2xl border border-border bg-card/70 p-5 shadow-sm transition-all hover:border-accent/40 hover:bg-card hover:shadow-warm lg:p-6"
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${categoryColor[featuredNews.category]}`}
                      >
                        {featuredNews.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(featuredNews.date)}
                      </span>
                    </div>
                    <h3 className="max-w-4xl text-lg font-heading font-bold text-foreground transition-colors group-hover:text-primary lg:text-xl line-clamp-2 lg:line-clamp-none">
                      {featuredNews.title}
                    </h3>
                    <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground line-clamp-2 lg:line-clamp-none">
                      {featuredNews.excerpt}
                    </p>
                  </div>
                  <div className="flex lg:justify-end">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-accent transition-all group-hover:gap-2">
                      Leggi la novità <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>

              <div className="mt-8 text-center">
                <Link
                  to={ROUTES.news}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-warm transition-opacity hover:opacity-90"
                >
                  <Newspaper className="h-5 w-5" />
                  Tutte le News
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="mb-6 flex items-center gap-2 text-xl font-heading font-semibold text-foreground">
              <Calendar className="h-5 w-5 text-accent" />
              Eventi Tradizionali
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {highlightedEvents.map((event) => (
                <div
                  key={event.title}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-warm"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase text-accent">{event.date}</span>
                    <h4 className="mt-1 font-heading text-lg font-bold text-foreground">
                      {hasEventDetail(event) ? (
                        <Link to={eventDetailPath(event.slug)} className="hover:text-accent transition-colors">
                          {event.title}
                        </Link>
                      ) : (
                        event.title
                      )}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 lg:line-clamp-none">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to={ROUTES.eventi}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-warm transition-opacity hover:opacity-90"
              >
                <Calendar className="h-5 w-5" />
                Tutti gli Eventi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Memoria e Tradizioni
              </span>
            </div>
            <h3 className="mb-8 text-2xl font-heading font-bold text-foreground lg:text-3xl">
              Racconti dal Borgo
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {stories.slice(0, 4).map((story) => {
                const storyIconMap: Record<Story["icon"], React.ElementType> = {
                  sparkles: Sparkles,
                  scale: Scale,
                  clapperboard: Clapperboard,
                  candy: Candy,
                  beef: Cow,
                  cat: Cat,
                  cog: WaterMill,
                  leaf: Leaf,
                  church: Church,
                };
                const Icon = storyIconMap[story.icon];

                return (
                  <Link
                    key={story.id}
                    to={tradizioneDetailPath(story.slug)}
                    className="group rounded-xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-accent/30 hover:bg-card hover:shadow-md block"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {story.subtitle}
                      </span>
                    </div>
                    <h4 className="mb-2 font-heading font-semibold text-foreground group-hover:text-primary transition-colors">{story.title}</h4>
                    <p className="line-clamp-2 lg:line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {story.body}
                    </p>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link
                to={ROUTES.tradizioni}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-warm transition-opacity hover:opacity-90"
              >
                <BookOpen className="h-5 w-5" />
                Tutti i Racconti
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="mb-2 flex items-center gap-2">
              <Palette className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Radici e Tradizioni
              </span>
            </div>
            <h3 className="mb-6 text-2xl font-heading font-bold text-foreground lg:text-3xl">
              Un borgo di famiglie e antiche attività
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {homeRootsCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm"
                >
                  <h4 className="mb-2 font-heading font-semibold text-foreground">{card.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 className="mb-8 text-center text-2xl font-heading font-bold text-foreground lg:text-3xl">
              Scopri Ellera
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
              {homeExploreItems.map((branch) => {
                const Icon = homeExploreIconMap[branch.icon];

                return (
                  <Link
                    key={branch.title}
                    to={branch.to}
                    className="group relative flex aspect-[2/1] sm:aspect-[4/3] md:aspect-[4/5] items-end overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={branch.image}
                      alt={branch.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 p-5 w-full md:p-6">
                      <div className="mb-2 flex items-center gap-2">
                        <Icon className="h-5 w-5 text-accent" />
                        <span className="text-sm font-semibold text-accent">{branch.title}</span>
                      </div>
                      <p className="text-sm text-primary-foreground/90 line-clamp-2">{branch.desc}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-all group-hover:gap-2">
                        Scopri di più <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
