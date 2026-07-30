import type { ReactNode } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, CalendarPlus } from "@/lib/icons";
import { downloadIcs } from "@/lib/ics";
import { fadeUp } from "@/lib/animations";
import Layout from "@/components/layout/Layout";
import FloatingBackLink from "@/components/layout/FloatingBackLink";
import PageHero from "@/components/layout/PageHero";
import Seo from "@/components/shared/Seo";
import { EventPoster, EventOrganizerBadges } from "@/components/features/events/EventCard";
import { getEventBySlug, hasEventDetail } from "@/data/events/events";
import { ROUTES } from "@/lib/routes";
import { createEventJsonLd } from "@/lib/jsonLd";

/* ── Inline markdown helpers ── */

const BOLD_RE = /\*\*(.+?)\*\*/g;

const renderInline = (text: string, strongClass?: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const m of text.matchAll(BOLD_RE)) {
    const idx = m.index ?? 0;
    if (idx > cursor) parts.push(text.slice(cursor, idx));
    parts.push(
      <strong key={idx} className={strongClass}>
        {m[1]}
      </strong>,
    );
    cursor = idx + (m[0]?.length ?? 0);
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts.length > 0 ? parts : [text];
};

const renderContent = (text: string) =>
  text.split("\n\n").map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("- ")) {
      const items = trimmed
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("- "));

      return (
        <ul key={i} className="list-disc pl-6 space-y-1 text-muted-foreground leading-relaxed mb-4">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item.slice(2), "text-foreground")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={i} className="text-muted-foreground leading-relaxed mb-4">
        {renderInline(trimmed, "text-foreground")}
      </p>
    );
  });

/* ── Component ── */

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const event = slug ? getEventBySlug(slug) : undefined;

  if (event?.externalUrl) {
    if (event.externalUrl.startsWith("http") || event.externalUrl.endsWith(".html")) {
      window.location.replace(event.externalUrl);
      return null;
    }
    return <Navigate to={event.externalUrl} replace />;
  }

  if (!event || !hasEventDetail(event)) {
    return (
      <Layout>
        <Seo title="Evento non trovato" description="Le informazioni richieste non sono disponibili." noindex />
        <section className="pt-32 pb-20 text-center">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">Evento non trovato</h1>
          <Link to={ROUTES.eventi} className="text-accent font-semibold hover:underline">
            Torna agli eventi
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title={event.title}
        description={event.desc}
        image={event.image}
        imageAlt={event.title}
        jsonLd={createEventJsonLd(event)}
      />

      <PageHero
        imageSrc={event.heroImage ?? event.image}
        imageClassName={event.heroImagePosition}
        imageAlt={event.title}
        eyebrow="Evento"
        eyebrowIcon={Calendar}
        title={event.title}
        titleClassName="text-3xl lg:text-4xl font-heading"
        headerChildren={
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              <Clock className="h-3 w-3" />
              {event.date}
            </span>
            {event.status && (
              <span className="rounded-full border border-primary-foreground/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
                {event.status}
              </span>
            )}
          </div>
        }
        footerChildren={
          <div className="inline-flex items-center gap-2 text-primary-foreground/80">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">{event.location}</span>
          </div>
        }
      />

      <section className="py-12 lg:py-16 bg-background relative z-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="mb-8">
            <FloatingBackLink to={ROUTES.eventi} label="Torna agli eventi" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Poster & Quick Info */}
            <div className="lg:col-span-5 order-last lg:order-first">
              <div className="sticky top-24 space-y-6">
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm flex items-center justify-center p-2">
                  <EventPoster
                    image={event.image}
                    alt={event.title}
                    placeholderLabel={event.posterPlaceholderLabel}
                    className="w-full h-auto max-h-[600px] object-contain rounded-xl"
                  />
                </div>
                
                {/* Quick Info Box */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
                  <h3 className="font-heading font-semibold text-lg border-b border-border/50 pb-3">Dettagli Evento</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest leading-none mb-1">Data</p>
                        <p className="font-semibold text-foreground">{event.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-accent shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest leading-none mb-1">Luogo</p>
                        {event.locationUrl ? (
                          <a
                            href={event.locationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold transition-colors hover:text-accent hover:underline text-foreground"
                            title="Apri in Google Maps"
                          >
                            {event.location}
                          </a>
                        ) : (
                          <p className="font-semibold text-foreground">{event.location}</p>
                        )}
                      </div>
                    </div>
                    
                    {event.status && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-foreground shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest leading-none mb-1">Stato</p>
                          <p className="font-semibold text-foreground">{event.status}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => downloadIcs(event)}
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card py-3 text-sm font-bold text-foreground transition-all hover:bg-accent/5 hover:text-accent shadow-sm mt-2"
                  >
                    <CalendarPlus className="h-5 w-5 text-accent" />
                    Aggiungi al calendario
                  </button>
                  
                  <div className="pt-4 border-t border-border/50">
                    <EventOrganizerBadges event={event} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Main Content */}
            <div className="lg:col-span-7">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl p-6 lg:p-10 shadow-sm"
              >
                <h2 className="text-2xl font-heading font-bold mb-6 text-foreground text-primary">L'Esperienza</h2>
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground/90">
                  {renderContent(event.detailContent ?? event.desc)}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetail;

