export interface Business {
  id: string;
  name: string;
  type: "food" | "shop";
  description: string;
  phone?: string;
  address: string;
  image: string;
  mapUrl: string;
  websiteUrl?: string;
}

export const businesses: Business[] = [
  {
    id: "locanda-di-nonna-teresa",
    name: "Locanda di Nonna Teresa",
    type: "food",
    description:
      "Ristorante nel borgo di Ellera con cucina del territorio.",
    phone: "348 118 5808",
    address: "Via Natale Rosselli n. 29, Ellera",
    image: "/placeholder.svg",
    mapUrl: "https://maps.app.goo.gl/AprHiR1aFzVJ6roeA",
    websiteUrl: "https://www.lalocandadinonnateresa.it/",
  },
  {
    id: "circolo-garbarini-boristene",
    name: "Circolo Garbarini e Boristene",
    type: "food",
    description: "Bar e punto di ritrovo nel centro di Ellera.",
    address: "Via Montenotte n. 1, Ellera",
    image: "/placeholder.svg",
    mapUrl: "https://maps.app.goo.gl/wBbvZB3Nfv1RoK93A",
  },
  {
    id: "alimentari-da-elena",
    name: "Alimentari da Elena",
    type: "shop",
    description: "Alimentari e prodotti di prima necessità nel borgo.",
    phone: "3495316992",
    address: "Piazza Fratelli Bandiera, 6, Ellera",
    image: "/placeholder.svg",
    mapUrl:
      "https://maps.app.goo.gl/nQrqdHJdvw6KnKEU7",
  },
  {
    id: "alimentari-rossi-valeria",
    name: "Alimentari Rossi Valeria",
    type: "shop",
    description: "Alimentari storico in Piazza Cairoli, gestito da Valeria con passione da oltre 40 anni. Più che un negozio, è un pilastro della memoria e del vicinato ellerese.",
    address: "Piazza Cairoli 14, Ellera",
    image: "/placeholder.svg",
    mapUrl: "https://maps.google.com/?q=Piazza+Cairoli+14+Ellera+Alimentari+Rossi+Valeria",
  },
];

export const foodBusinesses = businesses.filter((business) => business.type === "food");
export const shopBusinesses = businesses.filter((business) => business.type === "shop");
