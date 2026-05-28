export type BusNoteCode = "C" | "D" | "H" | "T";

export interface BusTimeEntry {
  time: string;
  note?: BusNoteCode;
}

export interface BusPeriod {
  key: "weekday" | "holiday";
  title: string;
  toStella: BusTimeEntry[];
  toSavona: BusTimeEntry[];
}

export const busLine17NoteDescriptions: Record<BusNoteCode, string> = {
  C: "Inizia il carico in via Stalingrado.",
  D: "Corsa solo scolastica (non si effettua il sabato).",
  H: "Alle 19:25 il bus prosegue per Sassello e alle 20:00 riparte per Savona.",
  T: 'Corsa a chiamata (prenotazione con 48h di anticipo al numero 800 808 288, tasto 2).',
};

export const busLine17Schedule = {
  line: "17",
  route: "Savona - Albisole - Ellera - Stella San Bernardo",
  stopName: "ELLERA",
  timetableLabel: "Orario invernale in vigore dal 15 settembre 2025",
  updatedAt: "15/09/2025",
  pdfPath: "/orari_bus_ellera.pdf",
  weekday: {
    toStella: [
      { time: "6:15" },
      { time: "8:25" },
      { time: "11:00", note: "T" },
      { time: "11:45" },
      { time: "13:40", note: "C" },
      { time: "14:18", note: "D" },
      { time: "14:40", note: "D" },
      { time: "17:10" },
      { time: "17:33" },
      { time: "19:00", note: "H" },
    ] as BusTimeEntry[],
    toSavona: [
      { time: "6:21" },
      { time: "7:05" },
      { time: "7:10", note: "D" },
      { time: "8:20" },
      { time: "9:12" },
      { time: "11:00", note: "T" },
      { time: "11:45" },
      { time: "14:30" },
      { time: "15:30", note: "D" },
      { time: "18:00" },
      { time: "20:40", note: "H" },
    ] as BusTimeEntry[],
  },
  holiday: {
    toStella: [{ time: "8:10" }, { time: "17:25" }] as BusTimeEntry[],
    toSavona: [{ time: "8:57" }, { time: "18:12" }] as BusTimeEntry[],
  },
};

export const busLine17Periods: BusPeriod[] = [
  { key: "weekday", title: "Feriale", ...busLine17Schedule.weekday },
  { key: "holiday", title: "Festivo", ...busLine17Schedule.holiday },
];

export const busLine17NoteUsage = (() => {
  const noteMap = new Map<BusNoteCode, string[]>();

  const register = (items: BusTimeEntry[], label: string) => {
    for (const item of items) {
      if (!item.note) continue;

      const entries = noteMap.get(item.note) ?? [];
      entries.push(`${item.time} (${label})`);
      noteMap.set(item.note, entries);
    }
  };

  register(busLine17Schedule.weekday.toStella, "Feriale -> Stella");
  register(busLine17Schedule.weekday.toSavona, "Feriale -> Savona");
  register(busLine17Schedule.holiday.toStella, "Festivo -> Stella");
  register(busLine17Schedule.holiday.toSavona, "Festivo -> Savona");

  return Array.from(noteMap.entries()).map(([code, times]) => ({ code, times }));
})();
