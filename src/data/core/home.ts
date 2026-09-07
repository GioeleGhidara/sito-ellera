import {
  albiTrailAreaImage as albiTrailImage,
  galleriaArteImage,
  teatroBalomaExteriorImage as teatroImage,
} from "@/assets/images";
import { ROUTES } from "@/lib/routes";

export type HomeExploreIconKey = "bike" | "theater" | "palette";

export interface HomeRootsCard {
  title: string;
  body: string;
}

export interface HomeExploreItem {
  title: string;
  icon: HomeExploreIconKey;
  image: string;
  desc: string;
  to: string;
}

export const homeRootsCards: HomeRootsCard[] = [
  {
    title: "Le famiglie elleresi",
    body: "Come documentato da Roberto Siri nel volume dedicato alle famiglie albisolesi ed elleresi, Ellera è un borgo plasmato da generazioni di persone che con lavoro, intraprendenza e tenacia hanno dato sviluppo e identità al territorio.",
  },
  {
    title: "I 10 mulini del colore",
    body: "Lungo il Sansobbia sorgevano dieci mulini del colore che per secoli hanno fornito pigmenti all'industria ceramica di Albisola, trasformando terre e minerali nei colori vivaci delle maioliche albisolesi.",
  },
];

export const homeExploreItems: HomeExploreItem[] = [
  {
    title: "Albi Trail Area",
    icon: "bike",
    image: albiTrailImage,
    desc: "Rete di sentieri per mountain bike ed e-bike tracciati sui versanti della valle.",
    to: ROUTES.albiTrailArea,
  },
  {
    title: "Teatro Balomà",
    icon: "theater",
    image: teatroImage,
    desc: "Spazio polivalente per teatro, musica e proiezioni nell'ex cinema parrocchiale.",
    to: ROUTES.teatroBaloma,
  },
  {
    title: "Galleria",
    icon: "palette",
    image: galleriaArteImage,
    desc: "Cinquanta pannelli ceramici d'autore installati sulle facciate delle case del borgo.",
    to: ROUTES.galleriaArte,
  },
];
