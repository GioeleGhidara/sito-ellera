export interface ArtistaSerata {
  giorno?: string;
  nome: string;
  logo?: string;
  contatti?: string;
  info?: string;
}

export interface Palco {
  nome: string;
  serate: ArtistaSerata[];
  notaExtra?: string;
}

export const PALCHI: Palco[] = [
  {
    nome: "Palco Beo",
    serate: [
      { giorno: "Venerdì 21", nome: "DJ Bond", logo: "/images/events/caruggi-lanterne/loghi-palchi/logodjbond.webp" },
      { giorno: "Sabato 22", nome: "I Capovolti", logo: "/images/events/caruggi-lanterne/loghi-palchi/logocapovolti.webp" },
    ],
  },
  {
    nome: "Pedana Piazzetta",
    serate: [
      { nome: "MG DJ", logo: "/images/events/caruggi-lanterne/loghi-palchi/mg-dj-logo.webp" },
    ],
  },
  {
    nome: "Pedana Fojachini",
    serate: [
      { nome: "DJ Marco", logo: "/images/events/caruggi-lanterne/loghi-palchi/logodjmarco.webp" },
    ],
  },
];
