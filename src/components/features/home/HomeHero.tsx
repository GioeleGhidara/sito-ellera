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
      <div
        className="relative z-10 max-w-3xl px-4 text-center"
      >

        <h1 className="mb-4 text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
          Ellera
        </h1>
        <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
          Galleria a Cielo Aperto & Outdoor nel cuore della Valle Sansobbia
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to={ROUTES.trekking}
            onClick={() => triggerHaptic(HAPTIC_PATTERNS.MEDIUM)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-warm transition-opacity hover:opacity-90"
          >
            <Mountain className="h-5 w-5" />
            Esplora i Sentieri
          </Link>
          <Link
            to={ROUTES.galleriaArte}
            onClick={() => triggerHaptic(HAPTIC_PATTERNS.MEDIUM)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/15 px-6 py-3 font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/25"
          >
            <Palette className="h-5 w-5" />
            Scopri il Borgo
          </Link>
          <Link
            to={ROUTES.storia}
            onClick={() => triggerHaptic(HAPTIC_PATTERNS.MEDIUM)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/15 px-6 py-3 font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/25"
          >
            <History className="h-5 w-5" />
            La storia
          </Link>
        </div>
      </div>


      <div className="absolute left-4 top-20 z-20 lg:left-8 lg:top-24">
        <Suspense
          fallback={(
            <div className="flex h-[44px] w-[172px] items-center justify-center rounded-full bg-[#edf5f0]">
              <MapPin className="h-5 w-5 text-primary/60" aria-hidden="true" />
            </div>
          )}
        >
          <WeatherWidget variant="compact" />
        </Suspense>
      </div>

      <div
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1"
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
