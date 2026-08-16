import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Calendar } from "@/lib/icons";
import { ROUTES, eventDetailPath } from "@/lib/routes";
import { hasEventDetail } from "@/data/events/events";
import type { EventItem } from "@/data/events/events";

interface HomeEventsProps {
  highlightedEvents: EventItem[];
  fadeUp: Variants;
}

const HomeEvents = ({ highlightedEvents, fadeUp }: HomeEventsProps) => {
  if (highlightedEvents.length === 0) return null;

  return (
    <section className="bg-background pb-10 lg:pb-12">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="mb-8 lg:mb-10"
        >
          <motion.h3 variants={fadeUp} className="mb-4 flex items-center gap-2 text-lg font-heading font-semibold text-foreground lg:text-xl">
            <Calendar className="h-5 w-5 text-accent" />
            Eventi
          </motion.h3>

          {/* Righe compatte invece di card fotografiche a piena larghezza: più eventi visibili
              a colpo d'occhio anche da telefono, senza uno scroll infinito di box uguali. */}
          <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
            {highlightedEvents.map((event) => {
              const content = (
                <div className="group flex items-center gap-4 p-3 sm:p-4 transition-colors hover:bg-secondary/60">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">{event.date}</span>
                    <h4 className="mt-0.5 font-heading text-base font-bold leading-tight text-foreground sm:text-lg">
                      {event.title}
                    </h4>
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2">{event.desc}</p>
                  </div>
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
                </div>
              );

              return hasEventDetail(event) ? (
                <motion.div key={event.title} variants={fadeUp}>
                  <Link to={eventDetailPath(event.slug)} className="block">
                    {content}
                  </Link>
                </motion.div>
              ) : (
                <motion.div key={event.title} variants={fadeUp}>
                  {content}
                </motion.div>
              );
            })}
          </div>

          <motion.div variants={fadeUp} className="mt-6 text-center">
            <Link
              to={ROUTES.eventi}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-warm transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              <Calendar className="h-5 w-5" />
              Tutti gli Eventi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeEvents;
