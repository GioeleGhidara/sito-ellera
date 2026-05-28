export interface SeasonalEvent {
  id: string;
  name: string;
  startDate: string; // MM-DD
  endDate: string; // MM-DD
  title: string;
  description: string;
  theme: "halloween" | "christmas";
}

export const seasonalEvents: SeasonalEvent[] = [
  {
    id: "halloween",
    name: "Halloween",
    startDate: "10-20",
    endDate: "11-02",
    title: "Halloween a Ellera",
    description:
      "Il borgo si veste di mistero e magia! Scopri le attività a tema, le decorazioni nei caruggi e gli eventi speciali organizzati dal Comitato.",
    theme: "halloween",
  },
  {
    id: "christmas",
    name: "Natale",
    startDate: "12-10",
    endDate: "12-26",
    title: "Natale a Ellera",
    description:
      "Il calore delle feste arriva nel borgo: mercatini, luminarie, presepi e tante iniziative per grandi e piccini nella Valle Sansobbia.",
    theme: "christmas",
  },
];

export function getActiveSeason(): SeasonalEvent | null {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const today = `${month}-${day}`;

  for (const event of seasonalEvents) {
    const { startDate, endDate } = event;

    // Handle cross-year ranges (e.g. 12-20 to 01-06)
    if (startDate > endDate) {
      if (today >= startDate || today <= endDate) return event;
    } else {
      if (today >= startDate && today <= endDate) return event;
    }
  }

  return null;
}
