import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Candy, Cat, Church, Clapperboard, Cow, Leaf, Scale, Sparkles, WaterMill } from "@/lib/icons";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import Seo from "@/components/Seo";
import { stories, type Story } from "@/data/stories";
import { tradizioniHeroImage } from "@/assets/images";
import { tradizioneDetailPath } from "@/lib/routes";

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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const getStorySummary = (story: Story, maxChars = 220) => {
  if (story.summary?.trim()) {
    return story.summary.trim();
  }

  const firstParagraph = story.body.split("\n\n")[0]?.trim() ?? "";
  if (firstParagraph.length <= maxChars) {
    return firstParagraph;
  }

  const shortText = firstParagraph.slice(0, maxChars);
  const lastSpace = shortText.lastIndexOf(" ");
  return `${shortText.slice(0, lastSpace > 0 ? lastSpace : maxChars)}...`;
};

const Tradizioni = () => {
  return (
    <Layout>
      <Seo
        title="Tradizioni e storie di Ellera"
        description="Scopri tradizioni, leggende, mestieri e memorie di Ellera attraverso i racconti che hanno plasmato l'identità del borgo."
        image={tradizioniHeroImage}
        imageAlt="Scorcio storico di Ellera"
      />
      <PageHero
        imageSrc={tradizioniHeroImage}
        imageAlt="Scorcio storico di Ellera"
        eyebrow="Memoria e Tradizioni"
        eyebrowIcon={BookOpen}
        title="Racconti dal Borgo"
        description="Leggende, mestieri e memorie che hanno plasmato l'identità di Ellera attraverso i secoli."
      />
      {/* Stories Content */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {stories.map((story) => {
              const Icon = iconMap[story.icon];
              const summary = getStorySummary(story);
              return (
                <article
                  key={story.id}
                  className="group bg-card border border-border rounded-xl p-6 lg:p-8 hover:shadow-warm transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/15 group-hover:bg-accent/25 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-accent uppercase tracking-widest">{story.subtitle}</span>
                      <h2 className="text-2xl font-heading font-bold text-foreground">{story.title}</h2>
                    </div>
                  </div>

                  {/* whitespace-pre-wrap è fondamentale per vedere i paragrafi dell'articolo */}
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{summary}</p>
                  <div className="mt-6 pt-6 border-t border-border">
                    <Link
                      to={tradizioneDetailPath(story.slug)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      Leggi la storia
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Tradizioni;
