import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { ArrowRight, Calendar, Newspaper } from "@/lib/icons";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import Seo from "@/components/shared/Seo";
import { news } from "@/data/core/news";
import { heroNewsImage } from "@/assets/images";
import { newsDetailPath } from "@/lib/routes";
import { formatDateLong } from "@/lib/date-utils";
import { CATEGORY_COLOR } from "@/lib/news-utils";
import { cn } from "@/lib/utils";

const FeaturedCard = ({ item }: { item: (typeof news)[0] }) => (
  <Link
    to={newsDetailPath(item.slug)}
    className="group relative flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-warm hover:border-accent/30 transition-all duration-300"
  >
    <div className="relative w-full md:w-[45%] shrink-0 aspect-[16/10] md:aspect-auto overflow-hidden">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-card/60" />
    </div>

    <div className="flex flex-col justify-center p-6 lg:p-10 flex-1">
      <div className="flex items-center gap-3 mb-4">
        <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider", CATEGORY_COLOR[item.category])}>
          {item.category}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDateLong(item.date)}
        </span>
      </div>

      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-2">
        In evidenza
      </span>
      <h2 className="font-heading text-2xl lg:text-4xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
        {item.title}
      </h2>
      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-6 line-clamp-3">
        {item.excerpt}
      </p>
      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent group-hover:gap-3 transition-all self-start">
        Leggi l'articolo
        <ArrowRight className="w-4 h-4" />
      </span>
    </div>
  </Link>
);

const NewsCard = ({ item, index }: { item: (typeof news)[0]; index: number }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
    className="h-full"
  >
    <Link
      to={newsDetailPath(item.slug)}
      className="group flex flex-col bg-card/60 backdrop-blur-sm border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-warm hover:border-accent/30 transition-all duration-300 h-full"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide", CATEGORY_COLOR[item.category])}>
            {item.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDateLong(item.date)}
          </span>
        </div>

        <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
          {item.excerpt}
        </p>

        <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all self-start">
          Leggi tutto
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  </motion.div>
);

const News = () => {
  const [featured, ...rest] = news;

  return (
    <Layout>
      <Seo
        title="News"
        description="Leggi le ultime news da Ellera: progetti del Comitato Ellerese, eventi, cultura, outdoor e novità dal borgo."
        image={heroNewsImage}
        imageAlt="Un caruggio del borgo di Ellera"
      />
      <PageHero
        imageSrc={heroNewsImage}
        imageAlt="Un caruggio del borgo di Ellera"
        imageClassName="object-[center_70%]"
        eyebrow="Dal borgo"
        eyebrowIcon={Newspaper}
        title="News dall'Anima di Ellera"
        description="Tutte le novità dal Comitato Ellerese: eventi, progetti, cultura e outdoor."
      />

      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl space-y-10">

          {/* Card in evidenza */}
          {featured && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <FeaturedCard item={featured} />
            </motion.div>
          )}

          {/* Separatore */}
          {rest.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Altri articoli
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}

          {/* Griglia */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i} />
            ))}
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default News;