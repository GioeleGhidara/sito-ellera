import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Megaphone, Newspaper, Calendar } from "@/lib/icons";
import { ROUTES, newsDetailPath } from "@/lib/routes";
import { formatDateLong } from "@/lib/date-utils";
import type { NewsItem } from "@/data/news";

interface HomeNewsProps {
  featuredNews: NewsItem;
  fadeUp: Variants;
}

const categoryColor: Record<string, string> = {
  Borgo: "bg-accent text-accent-foreground",
  Outdoor: "bg-primary text-primary-foreground",
  Cultura: "bg-primary/80 text-primary-foreground",
  Associazione: "bg-secondary text-secondary-foreground",
};

const HomeNews = ({ featuredNews, fadeUp }: HomeNewsProps) => {
  if (!featuredNews) return null;

  return (
    <section className="bg-background pt-10 pb-10 lg:pt-16 lg:pb-12">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.div variants={fadeUp} className="mb-2 flex items-center gap-3">
            <Megaphone className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Novità da Ellera
            </span>
          </motion.div>
          
          <motion.h2 variants={fadeUp} className="mb-8 text-2xl font-bold text-foreground lg:text-4xl lg:mb-10">
            Ultime Novità
          </motion.h2>

          <motion.div variants={fadeUp} className="mb-10">
            <Link
              to={newsDetailPath(featuredNews.slug)}
              className="group block overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm transition-all hover:border-accent/40 hover:bg-card hover:shadow-warm"
            >
              <div className="flex flex-col md:flex-row md:items-stretch">
                {featuredNews.image && (
                  <div className="hidden md:block relative h-48 w-full shrink-0 overflow-hidden md:h-auto md:w-1/3 lg:w-1/4">
                    <img
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:bg-gradient-to-r" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5 md:p-6 lg:p-8">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${categoryColor[featuredNews.category]}`}
                    >
                      {featuredNews.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateLong(featuredNews.date)}
                    </span>
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary md:text-2xl md:mb-2.5">
                    {featuredNews.title}
                  </h3>
                  <p className="mb-6 lg:mb-10 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3 md:text-base md:line-clamp-2">
                    {featuredNews.excerpt}
                  </p>
                  <div className="flex items-center">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-all group-hover:gap-2.5">
                      Leggi l'articolo completo <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
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
        </motion.div>
      </div>
    </section>
  );
};

export default HomeNews;
