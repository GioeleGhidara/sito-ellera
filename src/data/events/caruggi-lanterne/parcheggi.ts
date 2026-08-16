export type MezzoParcheggio = "auto" | "moto";

export interface ParcheggioInfo {
  mezzo: MezzoParcheggio;
  areeConfermate: number;
  nota?: string;
  dettaglio?: string;
}

/**
 * Info parcheggi confermate. Mappa: public/images/events/caruggi-lanterne/mappa-parcheggi.svg,
 * mostrata in ComeArrivare.tsx.
 */
export const PARCHEGGI: ParcheggioInfo[] = [
  {
    mezzo: "auto",
    areeConfermate: 5,
    nota: "Numerati da 1 a 5",
    dettaglio:
      "Parcheggi numerati da 1 a 5: le aree 1, 2 e 3 sono in zona Campetto, le aree 4 e 5 in zona Foglieto. In caso di esaurimento, parcheggiare lungo la strada senza intralciare il traffico, seguendo le indicazioni e il supporto dei volontari e della Protezione Civile.",
  },
  {
    mezzo: "moto",
    areeConfermate: 1,
    nota: "Piazza Fratelli Bandiera",
    dettaglio:
      "Parcheggio ampio dedicato ai motocicli in piazza nuova (P.zza Fratelli Bandiera), indicato con la lettera M sulla mappa. Si raccomanda di occupare il minor spazio possibile.",
  },
];
