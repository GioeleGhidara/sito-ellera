import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Palette, History, ArrowRight } from "@/lib/icons";
import { ROUTES } from "@/lib/routes";

interface HomeRootsProps {
  homeRootsCards: { title: string; body: string }[];
  fadeUp: Variants;
}

const HomeRoots = ({ homeRootsCards, fadeUp }: HomeRootsProps) => {
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
          <div className="mb-2 flex items-center gap-2">
            <Palette className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Radici e Tradizioni
            </span>
          </div>
          <h3 className="mb-6 text-2xl font-heading font-bold text-foreground lg:text-3xl">
            Un borgo di famiglie e antiche attività
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {homeRootsCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm"
              >
                <h4 className="mb-2 font-heading font-semibold text-foreground">{card.title}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to={ROUTES.storia}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-warm transition-opacity hover:opacity-90"
            >
              <History className="h-5 w-5" />
              Approfondisci la Storia
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeRoots;
