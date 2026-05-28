import { useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { BusFront, Clock3, Download, Globe, MapPin, ShoppingBag, Utensils, type IconType } from "@/lib/icons";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import Seo from "@/components/shared/Seo";
import { Button } from "@/components/ui/button";
import { heroImage } from "@/assets/images";
import { foodBusinesses, shopBusinesses } from "@/data/core/businesses";
import type { Business } from "@/data/core/businesses";
import {
  busLine17NoteDescriptions,
  busLine17NoteUsage,
  busLine17Periods,
  busLine17Schedule,
  type BusTimeEntry,
} from "@/data/core/busSchedule";


const TimePills = ({ times }: { times: BusTimeEntry[] }) => (
  <div className="flex flex-wrap gap-2">
    {times.map(({ time, note }) => (
      <span
        key={`${time}-${note ?? "none"}`}
        className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground"
      >
        {time}
        {note && (
          <span className="ml-1 inline-flex items-center justify-center rounded bg-primary/10 px-1 text-[10px] font-bold text-primary">
            {note}
          </span>
        )}
      </span>
    ))}
  </div>
);

const BusPeriodCard = ({
  title,
  toStella,
  toSavona,
}: {
  title: string;
  toStella: BusTimeEntry[];
  toSavona: BusTimeEntry[];
}) => (
  <div className="rounded-lg border border-border bg-background/60 p-4 space-y-3">
    <div className="flex items-center gap-2">
      <Clock3 className="w-4 h-4 text-primary" />
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
    <div className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Direzione Stella</p>
        <TimePills times={toStella} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Direzione Savona</p>
        <TimePills times={toSavona} />
      </div>
    </div>
  </div>
);

const BusinessCard = ({ biz }: { biz: Business }) => (
  <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl overflow-hidden shadow-warm hover:shadow-lg transition-shadow">
    <div className="aspect-[16/10] overflow-hidden bg-muted">
      <img src={biz.image} alt={biz.name} className="w-full h-full object-cover" />
    </div>
    <div className="p-5">
      <h3 className="font-heading font-bold text-foreground text-lg mb-1">{biz.name}</h3>
      <p className="text-xs text-muted-foreground mb-2">{biz.address}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{biz.description}</p>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" asChild>
          <a href={biz.mapUrl} target="_blank" rel="noopener noreferrer">
            <MapPin className="w-3.5 h-3.5" />
            Portami qui
          </a>
        </Button>
        {biz.websiteUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={biz.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="w-3.5 h-3.5" />
              Sito
            </a>
          </Button>
        )}
      </div>
    </div>
  </div>
);

const BusinessSection = ({
  id,
  icon: Icon,
  title,
  items,
  className,
}: {
  id?: string;
  icon: IconType;
  title: string;
  items: Business[];
  className?: string;
}) => (
  <motion.div
    id={id}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className={className}
  >
    <div className="flex items-center gap-3 mb-6">
      <Icon className="w-6 h-6 text-accent" />
      <h2 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((biz, index) => (
        <motion.div
          key={biz.id}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <BusinessCard biz={biz} />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const Servizi = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  return (
    <Layout>
      <Seo
        title="Servizi a Ellera: bus, negozi e dove mangiare"
        description="Consulta i servizi di Ellera: orari bus, attività commerciali, botteghe e posti dove mangiare nel borgo."
        image={heroImage}
        imageAlt="Panorama di Ellera"
      />
      <PageHero
        imageSrc={heroImage}
        imageAlt="Panorama di Ellera"
        eyebrow="Vita nel Borgo"
        eyebrowIcon={MapPin}
        title="Servizi nel Borgo"
        description="Dove mangiare e fare acquisti a Ellera"
      />

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            id="bus"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 scroll-mt-24 lg:scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-6">
              <BusFront className="w-6 h-6 text-accent" />
              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Orari Bus</h2>
            </div>

            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-foreground">
                    Linea {busLine17Schedule.line}: {busLine17Schedule.route}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fermata: {busLine17Schedule.stopName} - {busLine17Schedule.timetableLabel}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={busLine17Schedule.pdfPath} target="_blank" rel="noopener noreferrer">
                    <Download className="w-3.5 h-3.5" />
                    PDF completo
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {busLine17Periods.map((period) => (
                  <BusPeriodCard
                    key={period.key}
                    title={period.title}
                    toStella={period.toStella}
                    toSavona={period.toSavona}
                  />
                ))}
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-medium text-foreground mb-2">Note utili (collegate agli orari)</p>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-5">
                  {busLine17NoteUsage.map(({ code, times }) => (
                    <li key={code}>
                      <span className="font-semibold text-foreground">{code}</span> -{" "}
                      {busLine17NoteDescriptions[code]}{" "}
                      <span className="text-foreground/80">Orari: {times.join(", ")}.</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-muted-foreground mt-3">
                  Dati estratti dal documento ufficiale TPL aggiornato al {busLine17Schedule.updatedAt}.
                </p>
              </div>
            </div>
          </motion.div>

          <BusinessSection
            id="mangiare"
            icon={Utensils}
            title="Dove Mangiare"
            items={foodBusinesses}
            className="mb-16 scroll-mt-24 lg:scroll-mt-28"
          />
          <BusinessSection
            id="negozi"
            icon={ShoppingBag}
            title="Botteghe e Negozi"
            items={shopBusinesses}
            className="scroll-mt-24 lg:scroll-mt-28"
          />
        </div>
      </section>
    </Layout>
  );
};

export default Servizi;

