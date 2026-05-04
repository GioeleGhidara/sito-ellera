import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Download, ExternalLink, ImageIcon, MapPin, Mountain, Ruler, TrendingDown, TrendingUp, type IconType } from "@/lib/icons";
import FloatingBackLink from "@/components/FloatingBackLink";
import Layout from "@/components/Layout";
import MapFallback from "@/components/MapFallback";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { getTrailBySlug } from "@/data/trails";
import { summarizeText } from "@/lib/seo";
import { createTouristTripJsonLd } from "@/lib/jsonLd";
import NotFound from "./NotFound";
import { ROUTES } from "@/lib/routes";
import {
  trailHeroBlackImage,
  trailHeroBlueImage,
  trailHeroGreenImage,
  trailHeroPurpleImage,
  trailHeroRedImage,
  albiTrailAreaImage,
  biciCartelloImage,
  biciCascinaImage,
  biciNeveImage,
  biciPrimopianoImage,
} from "@/assets/images";

const TrailMiniMap = React.lazy(() => import("@/components/TrailMiniMap"));

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TRAIL_HEADERS_BY_COLOR: Record<string, string> = {
  "#0000FF": trailHeroBlueImage,
  "#FF0000": trailHeroRedImage,
  "#800080": trailHeroPurpleImage,
  "#00AA00": trailHeroGreenImage,
  "#000000": trailHeroBlackImage,
};

const TrailDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const trail = slug ? getTrailBySlug(slug) : undefined;

  if (!trail) return <NotFound />;

  const galleryImages = [
    { src: biciCartelloImage, alt: "MTB vicino al cartello" },
    { src: biciCascinaImage, alt: "MTB vicino a una cascina in pietra" },
    { src: biciNeveImage, alt: "MTB su trail innevato" },
    { src: biciPrimopianoImage, alt: "Dettaglio mountain bike" },
  ];
  const trailColor = trail.gpxColor.toUpperCase();
  const trailHeaderImage = TRAIL_HEADERS_BY_COLOR[trailColor];
  const hasTrailHeaderImage = Boolean(trailHeaderImage);
  const seoImage = trailHeaderImage ?? albiTrailAreaImage;
  const seoTitle = `${trail.name}, trail MTB a Ellera`;
  const seoDescription = summarizeText(
    [
      trail.desc,
      trail.specs ? `${trail.specs}.` : "",
      trail.estimatedTime ? `Tempo medio ${trail.estimatedTime}.` : "",
      trail.characteristics,
    ]
      .filter(Boolean)
      .join(" "),
    170,
  );
  const technicalStats: Array<{ label: string; value?: string; icon: IconType }> = [
    { label: "Lunghezza", value: trail.length, icon: Ruler },
    ...(trail.ascent
      ? [{ label: "Salita", value: trail.ascent, icon: TrendingUp }]
      : trail.elevation
        ? [{
          label: "Dislivello",
          value: trail.elevation,
          icon: trail.elevation.startsWith("+") ? TrendingUp : TrendingDown,
        }]
        : []),
    ...(trail.descent ? [{ label: "Discesa", value: trail.descent, icon: TrendingDown }] : []),
    { label: "Tempo medio", value: trail.estimatedTime, icon: Clock },
  ].filter((stat): stat is { label: string; value: string; icon: IconType } => Boolean(stat.value));

  return (
    <Layout>
      <Seo
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        imageAlt={`Trail ${trail.name} a Ellera`}
        jsonLd={createTouristTripJsonLd(trail, {
          description: seoDescription,
          image: seoImage,
        })}
      />
      {/* Header */}
      <section
        className={`relative border-b border-border overflow-hidden ${hasTrailHeaderImage ? "pt-20 lg:pt-24 min-h-[380px] flex items-end" : "bg-card pt-20 lg:pt-24"
          }`}
      >
        {hasTrailHeaderImage && (
          <>
            <img
              src={trailHeaderImage}
              alt={`Header ${trail.name}`}
              className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-hero" />
          </>
        )}

        <div className={`container mx-auto px-4 lg:px-8 max-w-5xl py-6 ${hasTrailHeaderImage ? "relative z-10" : ""}`}>
          <div className="h-6" />

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className={`text-3xl lg:text-4xl font-heading font-bold ${hasTrailHeaderImage ? "text-primary-foreground" : "text-foreground"}`}>
                {trail.name}
              </h1>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${trail.difficultyColor}`}>
                {trail.difficultyEmoji} {trail.difficulty}
              </span>
            </div>
            <p className={`text-lg ${hasTrailHeaderImage ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
              {trail.desc}
            </p>
          </motion.div>
        </div>
      </section>

      <FloatingBackLink to={ROUTES.albiTrailArea} label="Sentieri" desktopMode="fixed" />

      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl space-y-12">
          {/* Dati Tecnici */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-xl font-heading font-bold text-foreground mb-5 flex items-center gap-2">
              <Mountain className="w-5 h-5 text-primary" />
              Dati Tecnici
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
              {technicalStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-card border border-border rounded-xl p-5 text-center">
                    <Icon className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Galleria */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-xl font-heading font-bold text-foreground mb-5 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Galleria
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-[4/3] rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-warm transition-shadow group"
                >
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Descrizione */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-3xl"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-heading font-bold text-foreground mb-3">Caratteristiche</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{trail.characteristics}</p>
            </div>
          </motion.div>

          {/* Mini Mappa */}
          {trail.gpxPath && (
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-xl font-heading font-bold text-foreground mb-5">Traccia GPS</h2>
              <Suspense
                fallback={<MapFallback className="h-[360px] rounded-xl" />}
              >
                <TrailMiniMap gpxUrl={trail.gpxPath} color={trail.gpxColor} direction={trail.travelDirection} />
              </Suspense>
            </motion.div>
          )}

          {/* Azioni */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex gap-3 flex-wrap"
          >
            {trail.gpxPath && (
              <Button asChild size="lg">
                <a href={trail.gpxPath} download>
                  <Download className="w-4 h-4" />
                  Scarica GPX
                </a>
              </Button>
            )}
            {trail.trailforksUrl && (
              <Button variant="outline" size="lg" asChild>
                <a href={trail.trailforksUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Vedi su Trailforks
                </a>
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TrailDetail;
