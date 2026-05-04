import {
  caruggiEventImage,
  caruggiLanterneImage,
  consiglioNewsImage,
  gruppomurales,
} from "@/assets/images";

export interface NewsItem {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Borgo" | "Outdoor" | "Cultura" | "Associazione";
  image: string;
}

const newsData: NewsItem[] = [
  {
    id: 8,
    slug: "calendario-eventi-2026-caruggi-pastaparty",
    date: "2026-02-27",
    title: "Definite le prime date del 2026: Caruggi e Lanterne il 21 e 22 agosto",
    excerpt:
      "Il Comitato Ellerese fissa i primi appuntamenti del 2026: Caruggi e Lanterne il 21-22 agosto, La Pedaliamo Insieme il 31 maggio ed Ellera Bike Fest il 14 giugno.",
    content: `In data **27 febbraio 2026** il Comitato Ellerese ha definito i primi appuntamenti del calendario eventi per la stagione 2026, con l'obiettivo di dare riferimenti chiari a volontari, residenti e visitatori.

La data scelta per **Caruggi e Lanterne** è quella di **venerdì 21 e sabato 22 agosto 2026**. La manifestazione resterà il momento centrale dell'estate ellerese, con i caruggi illuminati, musica, installazioni e punti ristoro diffusi nel borgo.

Nel programma è stato inserito anche un appuntamento per il **31 maggio 2026**, in concomitanza con una giornata ciclistica tra Albisola ed Ellera. Il Comitato affiancherà la manifestazione con una presenza locale dedicata all'accoglienza e alla valorizzazione del paese.

Per il **14 giugno 2026** è invece in preparazione un appuntamento organizzato direttamente dal Comitato nell'area del **prato adibita alle feste di paese**. La formula prevista comprende un **pasta party** e un momento conviviale aperto a soci, residenti e amici di Ellera.

I dettagli operativi, compresi orari, modalità di iscrizione e programma completo delle singole giornate, saranno comunicati con aggiornamenti dedicati nelle prossime settimane.`,
    category: "Associazione",
    image: caruggiLanterneImage,
  },
  {
    id: 7,
    slug: "insediamento-nuovo-direttivo-comitato-ellerese-2026",
    date: "2026-02-06",
    title: "Insediato il nuovo Direttivo del Comitato Ellerese",
    excerpt:
      "Il 6 febbraio 2026, presso il Circolo Garbarini e Boristene, si è insediato ufficialmente il nuovo Consiglio Direttivo del Comitato Ellerese.",
    content: `In data **6 febbraio 2026**, alle ore **20:00**, presso il **Circolo Garbarini e Boristene di Ellera**, si è tenuta la riunione di insediamento del nuovo Consiglio Direttivo del Comitato Ellerese.

Dopo la fase di candidatura conclusa il 25 gennaio e la conferma del precedente Consiglio in data 1 febbraio, i nove candidati presenti sono stati proclamati eletti e hanno avviato ufficialmente il nuovo mandato.

Il Consiglio ha deliberato all'unanimità le seguenti cariche:
- **Presidente:** Matteo Rossello
- **Vice Presidente:** Gioele Ghidara
- **Segretario e Tesoriere:** Emilio Goslino
- **Consiglieri:** Sara Moretti, Gabriele Giuliani, Giuseppe Ferrara, Mattia Giacchino, Tommaso Pittameglio, Matteo Siri

Sono state inoltre assegnate deleghe operative specifiche:
- **Comunicazione Social:** Matteo Siri
- **Rete ciclo-sentieristica "Albi Trail":** Mattia Giacchino e Giuseppe Ferrara
- **Coordinamento Cinema-Teatro Balomà:** Tommaso Pittameglio

Nel corso della seduta sono stati affrontati anche i temi economici e programmatici per il 2026, con priorità su valorizzazione territoriale, servizi ai residenti e rapporti istituzionali con il Comune.

Il calendario condiviso include, tra gli appuntamenti principali, l'organizzazione dell'evento bike del 31 maggio, le iniziative di giugno legate ad Albi Trail e la sagra estiva del borgo.

Fonte: **Verbale di insediamento del Consiglio Direttivo - Comitato Ellerese, 6 febbraio 2026**.`,
    category: "Associazione",
    image: consiglioNewsImage,
  },
  {
    id: 1,
    slug: "murales-il-ceramista-750ml",
    date: "2022-07-22",
    title: "Il Ceramista di 750ml porta la street art nel cuore di Ellera",
    excerpt:
      "Nel luglio 2022 Mario Leuci, in arte 750ml, realizza in Piazza dell'Elce un grande omaggio a Giovanni Poggi e alla tradizione ceramica albisolese.",
    content: `Nel luglio **2022** l'artista milanese **Mario Leuci**, conosciuto a livello internazionale come **750ml**, ha realizzato in **Piazza dell'Elce** il murale **Il Ceramista**, intervento di urban art dedicato alla memoria ceramica di Ellera e di Albisola.

L'opera nasce come omaggio a **Giovanni Poggi**, figura centrale della storia artistica e ceramica del territorio, fondatore della manifattura **San Giorgio** e protagonista di una stagione che ha legato Albisola ad autori e sperimentazioni di rilievo internazionale.

Secondo le ricostruzioni pubblicate online da **Albisola Turismo** e dalla stampa locale, il progetto è stato costruito insieme al **Comitato Ellerese** per rafforzare il dialogo tra arte contemporanea, identità del borgo e patrimonio ceramico diffuso.

L'inaugurazione del murale ha richiamato pubblico, musica dal vivo, amministratori locali e anche una delegazione danese legata al rapporto storico tra **Poggi** e **Asger Jorn**, segno di come l'opera sia stata letta non solo come decorazione urbana, ma come tassello di un racconto culturale più ampio.

Il murale si inserisce nel contesto della **Galleria a Cielo Aperto di Ellera**, dove oltre **50 pannelli ceramici** trasformano già le facciate del paese in un percorso artistico permanente. In questo quadro, Il Ceramista aggiunge un linguaggio contemporaneo e immediato, capace di parlare sia ai visitatori sia alla comunità locale.

Il risultato è un'opera che unisce memoria industriale, storia dell'arte e rigenerazione dello spazio pubblico, confermando Ellera come uno dei luoghi più originali del paesaggio culturale albisolese.`,
    category: "Cultura",
    image: gruppomurales,
  },
];

export const news: NewsItem[] = [...newsData].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.id - a.id,
);
