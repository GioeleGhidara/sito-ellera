import type { TrailData, TrailType } from "@/data/trails/trails";
import { ROUTES } from "@/lib/routes";
import { EVENT_LOCATIONS } from "@/data/core/locations";

export interface InactiveTrail {
  name: string;
  status: string;
}

export type TrailSectionKey = "descent" | "climb";
export type TrailSectionIconKey = "trending-down" | "trending-up";

export interface TrailSectionConfig {
  key: TrailSectionKey;
  types: TrailType[];
  title: string;
  description: string;
  icon: TrailSectionIconKey;
}

export interface TrailAreaEventCard {
  slug: string;
  title: string;
  date: string;
  category: "Outdoor" | "Cultura" | "Festa" | "Altro";
  description: string;
  location: string;
  status?: string;
  to: string;
}

export const inactiveTrails: InactiveTrail[] = [
  { name: "Ellera Extreme", status: "In fase di ripristino imminente" },
  { name: "Arpetto Old", status: "Attualmente non attivo" },
  { name: "Crovaro DH", status: "In attesa di manutenzione" },
];

export const trailRules = [
  "Non tagliare curve o creare tracce nuove.",
  "Rispetta chi cammina.",
  "Adatta sempre la velocità alla visibilità e alle condizioni del terreno.",
  "Porta con te il necessario: kit di soccorso, camera d'aria, pompa e telefono carico.",
  "Lascia il posto come lo hai trovato: zero rifiuti, niente danni alla vegetazione, rispetto per fauna e flora.",
];

export const trailSections: TrailSectionConfig[] = [
  {
    key: "descent",
    types: ["descent"],
    title: "Discese",
    description: "Ordinate dal più scorrevole al più tecnico.",
    icon: "trending-down",
  },
  {
    key: "climb",
    types: ["climb", "access"],
    title: "Risalite",
    description: "Ordinate dalla più rapida alla più lunga (include anche gli accessi).",
    icon: "trending-up",
  },
];

export const trailAreaEventCards: TrailAreaEventCard[] = [
  {
    slug: "la-pedaliamo-insieme-2026",
    title: "La Pedaliamo Insieme",
    date: "31 Maggio 2026",
    category: "Outdoor",
    description:
      "Pedalata in beneficenza tra Albisola Superiore ed Ellera con percorsi per tutti i livelli, incluso il giro famiglie su strada con passaggio nel golf.",
    location: EVENT_LOCATIONS.ALBISOLA_ELLERA.name,
    status: "In programma",
    to: ROUTES.laPedaliamoInsieme2026,
  },
];

const DESCENT_ORDER: Record<string, number> = {
  "cresta-del-gallo": 1,
  seia: 2,
  beia: 3,
  scarsellun: 4,
  "dh-camilla": 5,
};

const parseMinutes = (value?: string) => {
  if (!value) return Number.POSITIVE_INFINITY;
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : Number.POSITIVE_INFINITY;
};

export const sortTrailsForSection = (type: TrailSectionKey) => (a: TrailData, b: TrailData) => {
  if (type === "descent") {
    return (DESCENT_ORDER[a.slug] ?? 999) - (DESCENT_ORDER[b.slug] ?? 999);
  }

  return parseMinutes(a.estimatedTime) - parseMinutes(b.estimatedTime);
};
