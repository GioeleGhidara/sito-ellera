import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Bike, Theater, Palette } from "@/lib/icons";

interface HomeExploreProps {
  homeExploreItems: { title: string; desc: string; image: string; icon: string; to: string }[];
  fadeUp: Variants;
}

const homeExploreIconMap: Record<string, React.ElementType> = {
  bike: Bike,
  theater: Theater,
  palette: Palette,
};

const HomeExplore = ({ homeExploreItems, fadeUp }: HomeExploreProps) => {
  return (
    <section className="bg-background pb-10 lg:pb-12">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="mb-6 text-center text-lg font-heading font-bold text-foreground lg:mb-8 lg:text-3xl">
            Scopri Ellera
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {homeExploreItems.map((branch) => {
              const Icon = homeExploreIconMap[branch.icon];

              return (
                <Link
                  key={branch.title}
                  to={branch.to}
                  className="group relative flex aspect-[3/4] items-end overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-md md:aspect-[4/5]"
                >
                  <img
                    src={branch.image}
                    alt={branch.title}
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${branch.title === "Galleria" ? "scale-[1.5]" : ""}`}
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="relative z-10 w-full p-2.5 sm:p-4 md:p-5">
                    <Icon className="mb-1 h-4 w-4 text-white/80 sm:mb-1.5" />
                    <span className="text-[13px] font-semibold leading-tight text-white sm:text-sm">
                      {branch.title}
                    </span>

                    <p className="mt-1.5 hidden text-sm text-primary-foreground/90 line-clamp-2 sm:block">
                      {branch.desc}
                    </p>
                    <span className="mt-2 hidden items-center gap-1 text-sm font-semibold text-accent opacity-0 transition-all group-hover:gap-2 group-hover:opacity-100 sm:inline-flex">
                      Scopri di più <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>

  );
};

export default HomeExplore;
