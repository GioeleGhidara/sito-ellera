import mulinoChiappeRef from "@/assets/images/tradizioni/mulini-riferimenti/mulino delle Chiappe.avif";
import muliniAltoRef from "@/assets/images/tradizioni/mulini-riferimenti/mulini d'alto.avif";
import mulinoCentroBeoRef from "@/assets/images/tradizioni/mulini-riferimenti/mulino del suffragio e del beo.avif";
import digaMaroneRef from "@/assets/images/tradizioni/mulini-riferimenti/diga del mulino di Marone con il mulino di besin o impianto per la produzione dell energia elettrica.avif";

export interface TradizioneReferenceImage {
  src: string;
  alt: string;
  caption: string;
}

export const tradizioneReferenceImagesBySlug: Record<string, TradizioneReferenceImage[]> = {
  "mulini-del-colore-ellera": [
    {
      src: mulinoChiappeRef,
      alt: "Documento storico: il mulino delle Chiappe in Valle Sansobbia",
      caption: "Fig. 1 - Il mulino delle Chiappe (p. 157).",
    },
    {
      src: muliniAltoRef,
      alt: "Documento storico: i mulini d'Alto",
      caption: "Fig. 3 - I mulini d'Alto (p. 159).",
    },
    {
      src: mulinoCentroBeoRef,
      alt: "Documento storico: area del mulino del Centro/Beo",
      caption: "Fig. 7 - Il centro di Ellera con l'area del mulino del Beo e del Rosario (p. 164).",
    },
    {
      src: digaMaroneRef,
      alt: "Documento storico: diga del mulino di Marone",
      caption: "Fig. 11 - La diga del mulino di Marone (p. 168).",
    },
  ],
};
