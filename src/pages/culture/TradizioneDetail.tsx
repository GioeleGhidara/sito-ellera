import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, Candy, Cat, ChevronLeft, ChevronRight, Church, Clapperboard, Cow, Leaf, Scale, Sparkles, WaterMill, X } from "@/lib/icons";
import FloatingBackLink from "@/components/layout/FloatingBackLink";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import Seo from "@/components/shared/Seo";
import TableOfContents from "@/components/layout/TableOfContents";
import { stories, type Story } from "@/data/core/stories";
import { tradizioneReferenceImagesBySlug } from "@/data/culture/tradizioneReferences";
import { tradizioneGalleryBySlug, type GallerySlide } from "@/data/culture/tradizioneGallery";
import { tradizioniHeroImage } from "@/assets/images";
import { ROUTES } from "@/lib/routes";
import { summarizeText } from "@/lib/seo";
import MaintenanceView from "@/components/shared/MaintenanceView";
import { MAINTENANCE_CONFIG } from "@/config/maintenance";

const IS_UNDER_MAINTENANCE = MAINTENANCE_CONFIG.TRADIZIONI;

const iconMap: Record<Story["icon"], React.ElementType> = {
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

const splitBodyAndSources = (body: string) => {
  const trimmedBody = body.trim();
  const marker = "fonti:";
  const lowerBody = trimmedBody.toLowerCase();
  const markerIndex = lowerBody.lastIndexOf(marker);

  if (markerIndex === -1) {
    return { mainBody: trimmedBody, sources: [] as string[] };
  }

  const mainBody = trimmedBody.slice(0, markerIndex).trim();
  const rawSources = trimmedBody.slice(markerIndex + marker.length).trim();
  const sources = rawSources
    .split(/[;\n]+/)
    .map((source) => source.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  return { mainBody: mainBody || trimmedBody, sources };
};

/* Slide animation variants */
const SWIPE_THRESHOLD = 50;
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

/* Gallery Carousel */
const GalleryCarousel = ({ slides }: { slides: GallerySlide[] }) => {
  const [[current, direction], setPage] = useState([0, 0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const paginate = useCallback((newDirection: number) => {
    setPage(([prev]) => [(prev + newDirection + slides.length) % slides.length, newDirection]);
  }, [slides.length]);
  const goToSlide = (index: number) => {
    setPage(([prev]) => [index, index > prev ? 1 : -1]);
  };
  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setIsLightboxOpen(false); return; }
      if (event.key === "ArrowLeft") { paginate(-1); return; }
      if (event.key === "ArrowRight") { paginate(1); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, paginate]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > 500) {
      paginate(offset.x < 0 ? 1 : -1);
    }
  };

  return (
    <>
      <div className="pt-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            Galleria Fotografica
          </p>
          <button
            type="button"
            onClick={openLightbox}
            className="text-[11px] font-semibold uppercase tracking-widest text-accent transition-colors hover:text-accent/80"
          >
            Apri grande
          </button>
        </div>

        <div className="group relative rounded-xl overflow-hidden border border-border/60 shadow-sm bg-muted/20">
          {/* Main image with swipe */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-muted/40 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 cursor-zoom-in"
                onClick={openLightbox}
              >
                <img
                  src={slides[current].src}
                  alt={slides[current].alt}
                  className="w-full h-full object-contain select-none pointer-events-none"
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows – glassmorphism, visible on hover */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                  aria-label="Foto precedente"
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-md p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-background/70"
                >
                  <ChevronLeft className="w-6 h-6 text-foreground" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); paginate(1); }}
                  aria-label="Foto successiva"
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-md p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-background/70"
                >
                  <ChevronRight className="w-6 h-6 text-foreground" />
                </button>
              </>
            )}

            {/* Counter */}
            {slides.length > 1 && (
              <span className="absolute bottom-2 right-3 z-10 rounded-full bg-background/50 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                {current + 1}/{slides.length}
              </span>
            )}
          </div>

          {/* Caption */}
          {slides[current].caption && (
            <figcaption className="border-t border-border/40 bg-muted/30 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              {slides[current].caption}
            </figcaption>
          )}
        </div>

        {/* Thumbnails */}
        {slides.length > 1 && (
          <div className="flex justify-center gap-2 pt-1 overflow-x-auto pb-1">
            {slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                aria-label={`Vai alla foto ${i + 1}`}
                className={`relative flex-shrink-0 w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden transition-all duration-200 ${
                  i === current
                    ? "ring-2 ring-accent ring-offset-1 ring-offset-background opacity-100"
                    : "opacity-60 hover:opacity-90"
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox via Portal */}
      {createPortal(
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
              onClick={closeLightbox}
            >
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute right-4 top-4 z-10 text-white/80 transition-colors hover:text-white"
                aria-label="Chiudi galleria"
              >
                <X className="h-8 w-8" />
              </button>

              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                    className="absolute left-3 z-10 text-white/80 transition-colors hover:text-white sm:left-5"
                    aria-label="Foto precedente"
                  >
                    <ChevronLeft className="h-10 w-10" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); paginate(1); }}
                    className="absolute right-3 z-10 text-white/80 transition-colors hover:text-white sm:right-5"
                    aria-label="Foto successiva"
                  >
                    <ChevronRight className="h-10 w-10" />
                  </button>
                </>
              )}

              <AnimatePresence initial={false} custom={direction}>
                <motion.figure
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="absolute flex max-h-[85vh] max-w-[90vw] flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={slides[current].src}
                    alt={slides[current].alt}
                    className="max-h-[75vh] max-w-full rounded object-contain"
                  />
                  {slides[current].caption && (
                    <p className="mt-3 max-w-xl text-center text-sm text-white/80">
                      {slides[current].caption}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-white/50">
                    {current + 1}/{slides.length}
                  </p>
                </motion.figure>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

/* Page */
const TradizioneDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  if (IS_UNDER_MAINTENANCE) {
    return (
      <Layout>
        <Seo title="Tradizioni in manutenzione" noindex />
        <div className="h-16 lg:h-20 bg-slate-900" aria-hidden="true"></div>
        <section className="bg-background pt-12 pb-12 lg:pt-20 lg:pb-24">
          <div className="container mx-auto px-4">
            <MaintenanceView 
              title="Racconto in Manutenzione"
              message="Stiamo perfezionando i testi e i riferimenti storici di questa sezione. Torna presto per leggere la versione completa."
            />
          </div>
        </section>
      </Layout>
    );
  }

  const story = stories.find((item) => item.slug === slug || item.id === slug);

  if (!story) {
    return (
      <Layout>
        <Seo title="Storia non trovata" description="La storia richiesta non è disponibile." noindex />
        <section className="pt-32 pb-20 text-center">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">Storia non trovata</h1>
          <Link to={ROUTES.tradizioni} className="inline-flex items-center gap-2 text-accent font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Torna alle tradizioni
          </Link>
        </section>
      </Layout>
    );
  }

  const Icon = iconMap[story.icon];
  const { mainBody, sources } = splitBodyAndSources(story.body);
  const referenceImages = tradizioneReferenceImagesBySlug[story.slug] ?? [];
  const gallerySlides = tradizioneGalleryBySlug[story.slug] ?? [];
  const seoDescription = story.summary?.trim() || summarizeText(mainBody, 170);

  // Extract headings for TOC
  const headings = [...mainBody.matchAll(/^## (.+)$/gm)].map((m) => ({
    title: m[1],
    id: m[1].toLowerCase().replace(/[^a-zà-ú0-9]+/gi, "-").replace(/^-|-$/g, ""),
  }));
  const showToc = headings.length >= 3;

  return (
    <Layout>
      <Seo
        title={story.title}
        description={seoDescription}
        image={tradizioniHeroImage}
        imageAlt={story.title}
      />
      <PageHero
        imageSrc={tradizioniHeroImage}
        imageAlt={story.title}
        eyebrow="Memoria e Tradizioni"
        eyebrowIcon={BookOpen}
        title={story.title}
        titleClassName="text-3xl md:text-4xl lg:text-5xl"
        footerChildren={(
          <div className="inline-flex items-center gap-2 text-primary-foreground/80">
            <Icon className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">{story.subtitle}</span>
          </div>
        )}
      />

      <FloatingBackLink to={ROUTES.tradizioni} label="Torna ai racconti" desktopMode="fixed" />

      <section className="py-8 lg:py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            {/* Summary pill */}
            {story.summary && (
              <p className="text-base md:text-lg text-muted-foreground italic border-l-2 border-accent pl-4">
                {story.summary}
              </p>
            )}

            {/* Table of contents */}
            {showToc && <TableOfContents items={headings} />}

            {/* Body text - prose style with markdown headings */}
            <div className="text-foreground/90 text-[1.05rem] md:text-lg leading-[1.85] font-serif tracking-[0.01em] space-y-6">
              {mainBody.split(/\n(?=## )/).map((section, i) => {
                const headingMatch = section.match(/^## (.+)\n/);
                if (headingMatch) {
                  const heading = headingMatch[1];
                  const anchorId = heading.toLowerCase().replace(/[^a-zà-ú0-9]+/gi, "-").replace(/^-|-$/g, "");
                  const content = section.slice(headingMatch[0].length).trim();
                  return (
                    <div key={i} className="space-y-3 scroll-mt-24" id={anchorId}>
                      <h2 className="font-heading font-bold text-xl md:text-2xl text-foreground tracking-tight pt-4 pb-1 border-b border-border/40">
                        {heading}
                      </h2>
                      {content && (
                        <div className="whitespace-pre-wrap">{content}</div>
                      )}
                    </div>
                  );
                }
                return (
                  <div key={i} className="whitespace-pre-wrap">{section.trim()}</div>
                );
              })}
            </div>

            {/* Gallery carousel */}
            {gallerySlides.length > 0 && <GalleryCarousel slides={gallerySlides} />}

            {/* Reference images (legacy - shown only if no gallery) */}
            {gallerySlides.length === 0 && referenceImages.length > 0 && (
              <div className="pt-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                  Riferimenti Iconografici
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {referenceImages.map((image, index) => (
                    <figure key={`${story.id}-image-ref-${index}`} className="rounded-xl overflow-hidden border border-border/60 shadow-sm">
                      <img src={image.src} alt={image.alt} className="w-full h-auto object-cover" loading="lazy" />
                      <figcaption className="px-3 py-2.5 text-xs text-muted-foreground leading-relaxed bg-muted/30">
                        {image.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {/* Sources */}
            {sources.length > 0 && (
              <details className="group pt-2">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 select-none hover:text-muted-foreground transition-colors">
                  Fonti {" >"}
                </summary>
                <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-muted-foreground/70 leading-relaxed">
                  {sources.map((source, index) => (
                    <li key={`${story.id}-source-${index}`}>{source}</li>
                  ))}
                </ul>
              </details>
            )}

            {/* External link */}
            {story.externalUrl && (
              <a
                href={story.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:underline"
              >
                {story.externalLabel || "Approfondisci"} {" >"}
              </a>
            )}
          </motion.article>
        </div>
      </section>
    </Layout>
  );
};

export default TradizioneDetail;

