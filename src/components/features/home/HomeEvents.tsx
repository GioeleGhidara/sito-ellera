import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Calendar } from "@/lib/icons";
import { ROUTES, eventDetailPath } from "@/lib/routes";
import { hasEventDetail } from "@/data/events";
import type { EventItem } from "@/data/events";

interface HomeEventsProps {
  highlightedEvents: EventItem[];
  fadeUp: Variants;
}

const HomeEvents = ({ highlightedEvents, fadeUp }: HomeEventsProps) => {
  return (
    <section className="bg-background pb-10 lg:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 lg:mb-16"
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
      </div>
    </section>
  );
};

export default HomeEvents;
