import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Ghost, Skull, Snowflake } from "@/lib/icons";
import { getActiveSeason } from "@/data/seasonal";
import type { SeasonalEvent } from "@/data/seasonal";
import { ROUTES } from "@/lib/routes";

const themeConfig: Record<
  SeasonalEvent["theme"],
  {
    Icon: typeof Ghost;
    SecondIcon: typeof Ghost;
    bg: string;
    border: string;
    accent: string;
    iconColor: string;
    btnClass: string;
  }
> = {
  halloween: {
    Icon: Ghost,
    SecondIcon: Skull,
    bg: "bg-[hsl(25,80%,15%)]/80",
    border: "border-[hsl(30,90%,50%)]/40",
    accent: "text-[hsl(30,90%,55%)]",
    iconColor: "text-[hsl(275,60%,60%)]",
    btnClass:
      "bg-[hsl(30,90%,50%)] text-[hsl(25,80%,10%)] hover:bg-[hsl(30,90%,45%)]",
  },
  christmas: {
    Icon: Snowflake,
    SecondIcon: Gift,
    bg: "bg-[hsl(150,40%,12%)]/80",
    border: "border-[hsl(0,70%,50%)]/40",
    accent: "text-[hsl(0,70%,55%)]",
    iconColor: "text-[hsl(45,90%,60%)]",
    btnClass:
      "bg-[hsl(0,70%,50%)] text-primary-foreground hover:bg-[hsl(0,70%,45%)]",
  },
};

const SeasonalHighlight = () => {
  const season = getActiveSeason();
  if (!season) return null;

  const config = themeConfig[season.theme];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-4 lg:py-8"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`relative overflow-hidden ${config.bg} backdrop-blur-sm ${config.border} border rounded-2xl p-6 lg:p-8`}
        >
          {/* Decorative icons */}
          <config.SecondIcon
            className={`absolute -top-3 -right-3 w-24 h-24 ${config.iconColor} opacity-10 rotate-12`}
          />
          <config.Icon
            className={`absolute bottom-2 left-2 w-16 h-16 ${config.iconColor} opacity-10 -rotate-12`}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <config.Icon className={`w-6 h-6 ${config.accent}`} />
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${config.accent}`}
                >
                  {season.name}
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-primary-foreground mb-2">
                {season.title}
              </h2>
              <p className="text-primary-foreground/75 text-sm leading-relaxed max-w-xl">
                {season.description}
              </p>
            </div>
            <Link
              to={ROUTES.eventi}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg shrink-0 ${config.btnClass}`}
            >
              Scopri il programma
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SeasonalHighlight;
