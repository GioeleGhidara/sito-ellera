export const EVENT_LOCATIONS = {
  TEATRO_BALOMA: {
    name: "Teatro Balomà, Ellera",
    url: "https://maps.app.goo.gl/2jmSB1kdsHDAWuUv9",
  },
  PRATO_FESTE: {
    name: "Prato Feste Comitato",
    url: "https://maps.app.goo.gl/UsFJMwDkXeUCob1w7",
  },
  TRAIL_PRATO_FESTE: {
    name: "Trail di Ellera / Prato Feste Comitato",
    url: "https://maps.app.goo.gl/UsFJMwDkXeUCob1w7",
  },
  CARUGGI: {
    name: "Caruggi del borgo",
    url: "https://maps.app.goo.gl/ydzUL6qHgD9NJg9U7",
  },
  CENTRO_STORICO: {
    name: "Centro storico di Ellera",
    url: "https://maps.app.goo.gl/ydzUL6qHgD9NJg9U7",
  },
  ALBISOLA_ELLERA: {
    name: "Albisola ed Ellera",
    url: undefined,
  },
} as const;

export type EventLocationKey = keyof typeof EVENT_LOCATIONS;
