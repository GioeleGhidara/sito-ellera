export type MezzoParcheggio = "auto" | "moto" | "bici";

export interface ParcheggioInfo {
  mezzo: MezzoParcheggio;
  areeConfermate: number;
  nota?: string;
}

/**
 * Aree verdi concesse temporaneamente da privati per l'evento: il NUMERO di
 * aree per mezzo è confermato, l'indicazione precisa (via/punto di
 * riferimento) e la mappa sono ancora da pubblicare.
 *
 * Quando saranno disponibili: aggiungere qui marker + nome reale per area
 * (es. { marker: "P1", mezzo: "auto", nome: "Via ..." }) e sostituire
 * <MapPlaceholder /> con <EventMapImage /> in ComeArrivare.tsx.
 */
export const PARCHEGGI: ParcheggioInfo[] = [
  { mezzo: "auto", areeConfermate: 2 },
  { mezzo: "moto", areeConfermate: 1 },
  { mezzo: "bici", areeConfermate: 1, nota: "Rastrelliere" },
];
