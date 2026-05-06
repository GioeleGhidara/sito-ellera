import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import { Mountain, Palette, MapPin, ChevronDown, History } from "@/lib/icons";
import { ROUTES } from "@/lib/routes";
import { triggerHaptic, HAPTIC_PATTERNS } from "@/lib/haptics";
import { elleraDalPonteImage } from "@/assets/images";

const WeatherWidget = lazy(() => import("@/components/features/weather/WeatherWidget"));

const HomeHero = () => {
  return (
    <section className="relative flex h-[85vh] min-h-[500px] items-center justify-center overflow-hidden">
      <img
        src={elleraDalPonteImage}
        alt="Il borgo di Ellera visto dal ponte sul Sansobbia"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-hero" />
      
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Glossary Block - Perfectly centered in the Hero */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl text-left">
          <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 mb-1 md:mb-4">
            <h1 className="text-6xl lg:text-9xl font-heading font-bold text-white tracking-tighter drop-shadow-lg">
              Ellia
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-lg lg:text-2xl font-serif italic text-white/90 tracking-tight drop-shadow-md">
                / èl·lia /
              </span>
              <span className="h-1 w-1 lg:h-1.5 lg:w-1.5 rounded-full bg-accent shadow-sm" />
              <span className="text-[10px] lg:text-sm font-bold uppercase tracking-widest text-white drop-shadow-md">
                S. F. - Toponimo
              </span>
            </div>
          </div>

          <div className="w-16 lg:w-20 h-1 bg-accent rounded-full mb-4 lg:mb-8 shadow-lg" />

          <div className="space-y-2 lg:space-y-6">
            <div className="flex gap-4 lg:gap-5">
              <span className="flex-shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-accent/90 flex items-center justify-center text-accent-foreground font-bold font-heading text-[10px] lg:text-sm shadow-md">
                1
              </span>
              <p className="text-base lg:text-2xl text-white font-serif drop-shadow-xl leading-relaxed">
                Nome in dialetto locale di <strong className="text-white font-semibold">Ellera</strong>, borgo celebre per essere una galleria d’arte a cielo aperto.
              </p>
            </div>

            <div className="flex gap-4 lg:gap-5">
              <span className="flex-shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-accent/90 flex items-center justify-center text-accent-foreground font-bold font-heading text-[10px] lg:text-sm shadow-md">
                2
              </span>
              <p className="text-base lg:text-2xl text-white font-serif drop-shadow-xl leading-relaxed">
                <span className="font-sans italic text-white/90">Sta seia vaggü à Ellia</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons - At the bottom of the hero */}
      <div className="absolute bottom-12 md:bottom-16 left-0 right-0 z-20 px-4 flex justify-center">
        <div className="flex flex-row justify-center gap-2 md:gap-4 w-full max-w-3xl">
          <Link
            to={ROUTES.trekking}
            onClick={() => triggerHaptic(HAPTIC_PATTERNS.MEDIUM)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 md:gap-2 rounded-lg bg-accent px-3 py-2.5 md:px-6 md:py-3 text-[11px] md:text-base font-semibold text-accent-foreground shadow-warm transition-opacity hover:opacity-90"
          >
            <Mountain className="h-4 w-4 md:h-5 md:w-5" />
            <span className="whitespace-nowrap">Sentieri</span>
          </Link>
          <Link
            to={ROUTES.galleriaArte}
            onClick={() => triggerHaptic(HAPTIC_PATTERNS.MEDIUM)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 md:gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/15 px-3 py-2.5 md:px-6 md:py-3 text-[11px] md:text-base font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/25"
          >
            <Palette className="h-4 w-4 md:h-5 md:w-5" />
            <span className="whitespace-nowrap">Il Borgo</span>
          </Link>
          <Link
            to={ROUTES.storia}
            onClick={() => triggerHaptic(HAPTIC_PATTERNS.MEDIUM)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 md:gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/15 px-3 py-2.5 md:px-6 md:py-3 text-[11px] md:text-base font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/25"
          >
            <History className="h-4 w-4 md:h-5 md:w-5" />
            <span className="whitespace-nowrap">La Storia</span>
          </Link>
        </div>
      </div>




      <div
        className="hidden md:flex absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex-col items-center gap-1"
      >
        <span className="text-xs uppercase tracking-wider text-primary-foreground/60">Scorri</span>
        <div>
          <ChevronDown className="h-6 w-6 text-primary-foreground/70" />
        </div>
      </div>


    </section>
  );
};

export default HomeHero;
