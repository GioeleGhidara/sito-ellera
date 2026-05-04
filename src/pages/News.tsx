import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Newspaper } from "@/lib/icons";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import Seo from "@/components/Seo";
import { news } from "@/data/news";
import { heroNewsImage } from "@/assets/images";
import { newsDetailPath } from "@/lib/routes";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
};

const categoryColor: Record<string, string> = {
  Borgo: "bg-accent text-accent-foreground",
  Outdoor: "bg-primary text-primary-foreground",
  Cultura: "bg-primary/80 text-primary-foreground",
  Associazione: "bg-secondary text-secondary-foreground",
};

const News = () => {
  return (
    <Layout>
      <Seo
        title="News da Ellera"
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
      {/* Grid */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, i) => {
              return (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="h-full"
                >
                  <Link
                    to={newsDetailPath(item.slug)}
                    className="group flex flex-col bg-card/60 backdrop-blur-sm border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-warm transition-shadow h-full"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${categoryColor[item.category]}`}>
                          {item.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.date)}
                        </span>
                      </div>
                      <h3 className="text-lg font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
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
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default News;
