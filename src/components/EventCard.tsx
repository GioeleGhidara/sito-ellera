import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  CalendarPlus,
  ArrowUpRight,
  Calendar,
  Clock,
  ExternalLink,
} from "@/lib/icons";
import { downloadIcs } from "@/lib/ics";
import type {
  EventCategory,
  EventItem,
  EventOrganizer,
  EventOrganizersSource,
} from "@/data/events";
import {
  getEventOrganizers,
  hasEventDetail,
} from "@/data/events";
import { eventDetailPath } from "@/lib/routes";
import { albiTrailAreaLogo } from "@/assets/images";

export const categoryClasses: Record<EventCategory, string> = {
  Cultura: "bg-secondary text-secondary-foreground",
  Outdoor: "bg-primary text-primary-foreground",
  Festa: "bg-accent text-accent-foreground",
  Teatro: "bg-[hsl(18,55%,20%)] text-[hsl(35,100%,92%)]",
  Altro: "bg-muted text-muted-foreground",
};

export const formatEventDate = (
  startDate: string,
  endDate?: string,
  dateToBeConfirmed?: boolean,
) => {
  if (dateToBeConfirmed) {
    return { day: "TBD", month: "", weekday: "", full: "Data da definire" };
  }

  const sDate = new Date(`${startDate}T00:00:00`);
  const eDate = endDate ? new Date(`${endDate}T00:00:00`) : null;
  let day = sDate.toLocaleDateString("it-IT", { day: "2-digit" });

  if (eDate) {
    day =
      sDate.getMonth() === eDate.getMonth()
        ? `${sDate.getDate()}-${eDate.getDate()}`
        : `${sDate.getDate()}/${eDate.getDate()}`;
  }

  return {
    day,
    month: sDate.toLocaleDateString("it-IT", { month: "short" }),
    weekday: sDate.toLocaleDateString("it-IT", { weekday: "short" }),
    full: sDate.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
};

export const useEventCountdown = (startDate: string, dateToBeConfirmed?: boolean) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (dateToBeConfirmed) {
      return;
    }

    const intervalId = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(intervalId);
  }, [dateToBeConfirmed]);

  if (dateToBeConfirmed) {
    return null;
  }

  const eventDay = new Date(`${startDate}T00:00:00`);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const diffMs = eventDay.getTime() - now.getTime();
  const isEventToday = eventDay.getTime() === todayStart.getTime();

  if (diffMs <= 0 && !isEventToday) {
    return null;
  }

  if (isEventToday) {
    return { label: "- 00 | 00 | 00 | 00", short: "oggi!", isToday: true };
  }

  const safeDiffMs = Math.max(diffMs, 0);
  const totalSeconds = Math.floor(safeDiffMs / 1_000);
  const diffDays = Math.floor(totalSeconds / 86_400);
  const hh = String(Math.floor((totalSeconds % 86_400) / 3_600)).padStart(2, "0");
  const mm = String(Math.floor((totalSeconds % 3_600) / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  const dd = String(diffDays).padStart(2, "0");

  return {
    label: `- ${dd} | ${hh} | ${mm} | ${ss}`,
    short: `-${diffDays} gg`,
    isToday: false,
  };
};

export const EventPoster = ({
  image,
  alt,
  className,
  placeholderLabel,
}: {
  image?: string;
  alt: string;
  className?: string;
  placeholderLabel?: string;
}) => {
  const [hasError, setHasError] = useState(false);

  if (!image || hasError) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-muted text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground ${className ?? ""}`}
      >
        {placeholderLabel ?? "locandina"}
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
};

const PATRONAGE_ORGANIZER_NAME = "comune di albisola superiore";

export const EventOrganizerBadges = ({
  event,
  compact = false,
  className,
}: {
  event: EventOrganizersSource;
  compact?: boolean;
  className?: string;
}) => {
  const organizers = getEventOrganizers(event);
  const patronageOrganizer = organizers.find(
    (organizer) => organizer.name.trim().toLowerCase() === PATRONAGE_ORGANIZER_NAME,
  );
  const supportOrganizers = patronageOrganizer
    ? organizers.filter((organizer) => organizer !== patronageOrganizer)
    : organizers;

  if (organizers.length === 0) {
    return null;
  }

  const renderBadge = (organizer: EventOrganizer, showFallback = false) => (
    <div
      key={organizer.name}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 ${compact ? "px-2 py-0.5" : "px-2.5 py-1"}`}
    >
      {organizer.logo && (
        <img
          src={organizer.logo}
          alt={organizer.logoAlt ?? organizer.name}
          className={compact ? "h-4 w-auto max-w-[56px] object-contain" : "h-5 w-auto max-w-[76px] object-contain"}
          loading="lazy"
        />
      )}
      {!organizer.logo && showFallback && (
        <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      {!compact && (
        <span className="text-[11px] font-semibold text-muted-foreground">{organizer.name}</span>
      )}
    </div>
  );

  if (!patronageOrganizer) {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
        {supportOrganizers.map((organizer) => renderBadge(organizer))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-start gap-2 ${className ?? ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        {supportOrganizers.map((organizer) => renderBadge(organizer))}
      </div>
      {!compact && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
            Con il patrocinio del
          </span>
          {renderBadge(patronageOrganizer, true)}
        </div>
      )}
    </div>
  );
};

const featuredCardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
} as const;

export const FeaturedEventCard = ({ event }: { event: EventItem }) => {
  const date = formatEventDate(event.startDate, event.endDate, event.dateToBeConfirmed);
  const countdown = useEventCountdown(event.startDate, event.dateToBeConfirmed);

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={featuredCardVariants}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm"
    >
      <div className="flex flex-col md:flex-row md:items-stretch">
        <div className="flex shrink-0 justify-center overflow-hidden bg-card md:max-w-[45%] lg:max-w-[40%] text-center">
          <EventPoster
            image={event.image}
            alt={event.title}
            placeholderLabel={event.posterPlaceholderLabel}
            className="h-[250px] w-full object-cover transition-transform duration-700 hover:scale-105 md:h-[400px] md:w-auto md:object-cover"
          />
        </div>
        <div className="flex flex-[1_1_auto] flex-col p-5 md:p-6 lg:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${event.category ? categoryClasses[event.category] : categoryClasses.Altro}`}
            >
              {event.category || "Altro"}
            </span>
            {event.slug?.startsWith("albi-trail") && (
              <img
                src={albiTrailAreaLogo}
                alt="Albi Trail Area"
                className="h-5 w-5 rounded-full object-contain opacity-80"
                title="Albi Trail Area"
              />
            )}
            <span className="text-xs text-muted-foreground md:text-sm">{date.full}</span>
            {event.status && (
              <span className="ml-2 rounded-full border border-border/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {event.status}
              </span>
            )}
          </div>
          <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight text-foreground md:text-3xl">
            {hasEventDetail(event) ? (
              <Link to={eventDetailPath(event.slug)} className="hover:text-accent">
                {event.title}
              </Link>
            ) : (
              event.title
            )}
          </h2>
          {countdown && (
            <div
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tabular-nums ${countdown.isToday ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
            >
              <span>{countdown.label}</span>
            </div>
          )}
          <div className="mt-3">
            <EventOrganizerBadges event={event} />
          </div>
          <p className="mt-2.5 flex-1 text-sm leading-7 text-muted-foreground md:text-base">
            {event.desc}
          </p>
          <div className="mt-6 flex flex-col gap-4 border-t border-border pt-4 text-sm text-foreground">
            <div className="flex items-center gap-2 text-muted-foreground group/location">
              <MapPin className="h-4 w-4 text-primary" />
              {event.locationUrl ? (
                <a
                  href={event.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary hover:underline"
                  title="Apri in Google Maps"
                >
                  {event.location}
                </a>
              ) : (
                <span>{event.location}</span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {hasEventDetail(event) && (
                <Link
                  to={eventDetailPath(event.slug)}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  Ulteriori informazioni
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              <button
                onClick={() => downloadIcs(event)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
                title="Aggiungi al calendario (.ics)"
              >
                <CalendarPlus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const FeaturedEventCardCompact = ({ event }: { event: EventItem }) => {
  const date = formatEventDate(event.startDate, event.endDate, event.dateToBeConfirmed);
  const countdown = useEventCountdown(event.startDate, event.dateToBeConfirmed);

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={featuredCardVariants}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-warm"
    >
      <div className="flex flex-col gap-0 sm:flex-row">
        <div className="hidden sm:flex sm:w-[80px] sm:flex-shrink-0 sm:flex-col sm:items-center sm:justify-center sm:gap-0.5 sm:border-r sm:border-border sm:bg-muted/40 sm:px-3 sm:py-5">
          <span
            className={`font-heading font-bold leading-none text-foreground ${date.day.length > 2 ? "text-2xl" : "text-3xl"}`}
          >
            {date.day}
          </span>
          <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            {date.month}
          </span>
          <span className="text-[10px] text-muted-foreground">{date.weekday}</span>
        </div>
        <div className="flex flex-1 flex-col p-4 lg:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] ${event.category ? categoryClasses[event.category] : categoryClasses.Altro}`}
            >
              {event.category || "Altro"}
            </span>
            {event.slug?.startsWith("albi-trail") && (
              <img
                src={albiTrailAreaLogo}
                alt="Albi Trail Area"
                className="h-4 w-4 rounded-full object-contain opacity-80"
                title="Albi Trail Area"
              />
            )}
            <span className="text-xs text-muted-foreground sm:hidden">{date.full}</span>
            {event.status && (
              <span className="rounded-full border border-border/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {event.status}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-heading text-xl font-semibold leading-tight text-foreground">
              {event.title}
            </h3>
            {countdown && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums ${countdown.isToday ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {countdown.short}
              </span>
            )}
          </div>
          <div className="mt-2">
            <EventOrganizerBadges event={event} compact />
          </div>
          <p className="mt-2 flex-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {event.desc}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{event.location}</span>
            </div>
            {hasEventDetail(event) && (
              <Link
                to={eventDetailPath(event.slug)}
                className="inline-flex flex-shrink-0 items-center gap-1.5 text-xs font-semibold text-accent transition-all hover:gap-2.5"
              >
                Scheda evento
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};
