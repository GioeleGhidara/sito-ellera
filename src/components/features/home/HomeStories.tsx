import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Candy,
  Cat,
  Church,
  Clapperboard,
  Cow,
  Leaf,
  Scale,
  Sparkles,
  WaterMill,
} from "@/lib/icons";
import { ROUTES, tradizioneDetailPath } from "@/lib/routes";
import type { Story } from "@/data/core/stories";

interface HomeStoriesProps {
  stories: Story[];
  fadeUp: Variants;
}

const HomeStories = ({ stories, fadeUp }: HomeStoriesProps) => {
  return (
    <section className="bg-background pb-10 lg:pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8 lg:mb-10"
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
                  className="group rounded-xl border border-border bg-card/60 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-accent/30 hover:bg-card hover:shadow-md block"
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
      </div>
    </section>
  );
};

export default HomeStories;
