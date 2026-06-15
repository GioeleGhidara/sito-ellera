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
    id: 9,
    slug: "successo-albi-trail-ebike-fest-2026",
    date: "2026-06-15",
    title: "Grande successo per l'Albi Trail E-Bike Fest 2026",
    excerpt:
      "Partecipanti entusiasti, panini con salsiccia e golose sorprese fuori menù. Grazie a tutti gli amici di Ellera per il supporto al progetto!",
    content: `L'edizione 2026 dell'**Albi Trail E-Bike Fest**, svoltasi ieri, si è conclusa con un bilancio estremamente positivo. L'evento è andato nel migliore dei modi e tutti i partecipanti si sono detti pienamente soddisfatti dell'esperienza, sia per il livello dei percorsi proposti sia per il clima di festa.

A deliziare i ciclisti (e non solo) al rientro presso il **Prato Feste** ci hanno pensato i nostri cuochi volontari: non sono mancati i golosi e tradizionali panini con salsiccia accompagnati da buonissime patatine fritte. A sorpresa, per rendere la giornata ancora più speciale, sono stati serviti dei fuori menù d'eccezione che hanno conquistato tutti: piatti caldi di **trippa**, deliziose **castagne** e l'immancabile **panissa fritta**.

Il Comitato ci tiene a rivolgere un ringraziamento speciale a tutti gli abitanti e agli amici di Ellera che hanno deciso di fare un salto al prato delle feste per mangiare un boccone in compagnia. 

La vostra presenza, i vostri sorrisi e il vostro calore sono stati fondamentali per sostenere il progetto **Albi Trail** e ci permettono di continuare a curare con dedizione la nostra meravigliosa rete sentieristica. Grazie di cuore!`,
    category: "Outdoor",
    image: "/loghi/albi-trail-area.png",
  },
  {
    id: 8,
    slug: "calendario-eventi-2026-ufficializzati",
    date: "2026-02-27",
    title: "Ufficializzate le date 2026: Caruggi, Pedaliamo Insieme e E-Bike Fest",
    excerpt:
      "Il Comitato Ellerese annuncia il calendario eventi 2026: La Pedaliamo Insieme il 31 maggio, Albi Trail E-Bike Fest il 14 giugno e Caruggi e Lanterne il 21-22 agosto.",
    content: `Il **Comitato Ellerese** ha ufficializzato il calendario degli eventi per la stagione 2026, consolidando appuntamenti storici e nuove collaborazioni dedicate al territorio e alla solidarietà.

Il primo appuntamento è fissato per il **31 maggio 2026** con **"La Pedaliamo Insieme"**. L'evento, organizzato in stretta sinergia tra **Barrabrava**, **Comitato Ellerese**, **Quiliano Bike** e il **Comune di Albisola Superiore**, vedrà centinaia di ciclisti percorrere i sentieri e le strade tra Albisola ed Ellera per una giornata di sport e beneficenza.

Domenica **14 giugno 2026** sarà la volta della seconda edizione di **Albi Trail E-Bike Fest**. Si terrà un vero e proprio raduno dedicato alle e-bike. Il programma prevede una bella pedalata sui sentieri della **Albi Trail Area** con ritrovo e pranzo finale (panino con salsiccia/wurstel, patatine e birra) presso il **Prato Feste**. Le iscrizioni saranno aperte a breve online sulla pagina dedicata.

Infine, l'estate ellerese culminerà **venerdì 21 e sabato 22 agosto 2026** con l'attesissima edizione di **Caruggi e Lanterne**. La manifestazione trasformerà come sempre il borgo in un percorso enogastronomico magico, illuminato dalle lanterne e accompagnato da musica dal vivo e rassegne artistiche.

Nelle prossime settimane verranno rilasciati i dettagli operativi e le locandine ufficiali per ogni singolo appuntamento.`,
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
