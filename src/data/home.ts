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
    desc: "La rete di sentieri MTB più adrenalinica della riviera ligure.",
    to: ROUTES.albiTrailArea,
  },
  {
    title: "Teatro Balomà",
    icon: "theater",
    image: teatroImage,
    desc: "L'ex cinema trasformato in hub culturale per teatro, musica e proiezioni.",
    to: ROUTES.teatroBaloma,
  },
  {
    title: "Galleria a Cielo Aperto",
    icon: "palette",
    image: galleriaArteImage,
    desc: "Oltre 50 pannelli ceramici sulle facciate raccontano la storia del borgo.",
    to: ROUTES.galleriaArte,
  },
];
