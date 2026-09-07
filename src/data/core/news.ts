import {
  caruggiEventImage,
  caruggiLanterneImage,
  consiglioNewsImage,
  gruppomurales,
  locandinaCaruggiELanterne,
} from "@/assets/images";
import { ROUTES } from "@/lib/routes";

export interface NewsItem {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Borgo" | "Outdoor" | "Cultura" | "Associazione";
  image: string;
  /** "contain" evita il ritaglio (es. locandine con testo); default "cover". */
  imageFit?: "cover" | "contain";
}

const newsData: NewsItem[] = [
  {
    id: 11,
    slug: "caruggi-lanterne-2026-archivio-ringraziamenti",
    date: "2026-09-01",
    title: "Caruggi e Lanterne 2026 va in archivio: il ringraziamento del Comitato",
    excerpt: "Due serate di grande affluenza, musica dal vivo e l'impegno di decine di volontari: il bilancio dell'edizione 2026.",
    content: `L'edizione 2026 di **Caruggi e Lanterne** si è conclusa dopo due serate partecipate nel centro storico di Ellera. I vicoli hanno accolto centinaia di visitatori e la musica dal vivo ha accompagnato i punti ristoro fino a tarda sera.

A nome di tutto il **Comitato Ellerese**, Tommaso ringrazia chi ha reso possibile l'evento donando il proprio tempo: i volontari impegnati nell'allestimento delle lanterne, nel servizio ai banchi gastronomici e nelle operazioni di pulizia finale.

Un ringraziamento va anche a tutte le persone che hanno scelto di passare la serata a Ellera.

Il prossimo appuntamento è per **ottobre** al Prato Feste per la tradizionale **Castagnata**, con caldarroste cotte a legna, focaccette, birra e vino.

Guarda il video riassuntivo delle due serate:

[instagram](https://www.instagram.com/reel/DciKMDoNI1m/)`,
    category: "Borgo",
    image: caruggiLanterneImage,
    imageFit: "cover",
  },
  {
    id: 10,
    slug: "caruggi-e-lanterne-2026-questo-weekend",
    date: "2026-08-20",
    title: "Caruggi e Lanterne torna questo weekend",
    excerpt:
      "Venerdì 21 e sabato 22 agosto il borgo si accende con oltre 200 lanterne, musica dal vivo e le bancarelle del percorso enogastronomico.",
    content: `Venerdì e sabato Ellera torna a illuminarsi per **Caruggi e Lanterne**, l'appuntamento che ogni estate porta centinaia di persone tra i vicoli del borgo.

Il programma si sviluppa su due serate. **Venerdì 21 agosto** si parte con Dj Bond, MG Dj e Dj Marco. **Sabato 22 agosto** tocca a I Capovolti, ancora MG Dj e l'animazione itinerante dei DeMueluin. Lungo il percorso trovate le bancarelle gastronomiche del Comitato, i banchi di ceramica e gli stand degli artigiani locali, con le lanterne accese a segnare la strada tra una tappa e l'altra.

Chi arriva in auto può lasciare la macchina nei parcheggi segnalati all'ingresso del paese: da lì il centro storico si raggiunge in pochi minuti a piedi. Il programma completo, gli orari serata per serata e la mappa dei parcheggi sono sulla [pagina dedicata all'evento](${ROUTES.caruggiELanterne}).

Vi aspettiamo in paese.`,
    category: "Borgo",
    image: locandinaCaruggiELanterne,
    imageFit: "contain",
  },
  {
    id: 9,
    slug: "successo-albi-trail-ebike-fest-2026",
    date: "2026-06-15",
    title: "Grande successo per l'Albi Trail E-Bike Fest 2026",
    excerpt:
      "Partecipazione numerosa sui sentieri, panini con salsiccia e piatti caldi al Prato Feste. Il ringraziamento del Comitato.",
    content: `L'edizione 2026 dell'**Albi Trail E-Bike Fest** si è svolta ieri con una grande partecipazione di appassionati sui sentieri della vallata.

Al rientro presso il **Prato Feste**, i volontari del Comitato hanno gestito il punto ristoro per i ciclisti e gli accompagnatori, preparando panini con salsiccia, patatine fritte e piatti caldi fuori menù: **trippa**, **castagne** e **panissa fritta**.

Il Comitato ringrazia gli abitanti di Ellera e tutti i partecipanti per il supporto al progetto **Albi Trail**, che consente di finanziare la manutenzione continuativa della rete sentieristica.

[carousel]
/news/albi-trail-2026/video-1.mp4
/news/albi-trail-2026/photo-1.avif
/news/albi-trail-2026/photo-2.avif
/news/albi-trail-2026/photo-3.avif
[/carousel]`,
    category: "Outdoor",
    image: "/news/albi-trail-2026/photo-2.avif",
  },
  {
    id: 8,
    slug: "calendario-eventi-2026-ufficializzati",
    date: "2026-02-27",
    title: "Ufficializzate le date 2026: Caruggi, Pedaliamo Insieme e E-Bike Fest",
    excerpt:
      "Il Comitato Ellerese annuncia il calendario eventi 2026: La Pedaliamo Insieme il 31 maggio, Albi Trail E-Bike Fest il 14 giugno e Caruggi e Lanterne il 21-22 agosto.",
    content: `Il **Comitato Ellerese** ha ufficializzato il calendario degli eventi per la stagione 2026, consolidando appuntamenti sportivi, solidali e di aggregazione nel borgo.

Il primo appuntamento è fissato per il **31 maggio 2026** con **"La Pedaliamo Insieme"**. L'evento, organizzato in collaborazione tra **Barrabrava**, **Comitato Ellerese**, **Quiliano Bike** e il **Comune di Albisola Superiore**, vedrà centinaia di ciclisti percorrere i sentieri e le strade tra Albisola ed Ellera per una giornata di sport e beneficenza.

Domenica **14 giugno 2026** sarà la volta della seconda edizione di **Albi Trail E-Bike Fest**, raduno dedicato agli appassionati di e-bike con pedalata guidata sui sentieri della **Albi Trail Area** e pranzo conclusivo presso il **Prato Feste**.

Infine, **venerdì 21 e sabato 22 agosto 2026** si terrà **Caruggi e Lanterne**: il centro storico ospiterà il percorso enogastronomico tra le vie illuminate dalle lanterne artigianali, accompagnato da musica dal vivo e banchi di ceramica.

Nelle prossime settimane verranno rilasciati i dettagli operativi e le locandine per ogni appuntamento.`,
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
    title: "Il murale di 750ml in Piazza dell'Elce dedicato a Giovanni Poggi",
    excerpt:
      "Nel luglio 2022 Mario Leuci, in arte 750ml, realizza in Piazza dell'Elce un murale dedicato a Giovanni Poggi e alla tradizione ceramica albisolese.",
    content: `Nel luglio **2022** l'artista milanese **Mario Leuci**, conosciuto come **750ml**, ha dipinto in **Piazza dell'Elce** il murale **Il Ceramista**, dedicato alla memoria artigianale di Ellera e di Albisola.

L'opera rende omaggio a **Giovanni Poggi**, fondatore della manifattura **San Giorgio** e figura chiave della stagione artistica che ha visto attivi ad Albisola ceramisti e scultori del secondo Novecento.

Il progetto è stato realizzato d'intesa con il **Comitato Ellerese** all'interno del percorso della **Galleria a Cielo Aperto**, affiancandosi agli oltre cinquanta pannelli ceramici già presenti sulle facciate del borgo.

All'inaugurazione hanno preso parte residenti, amministratori locali e una delegazione danese legata ai trascorsi artistici tra Poggi e **Asger Jorn**, evidenziando il valore storico e documentario dell'iniziativa.`,
    category: "Cultura",
    image: gruppomurales,
  },
];

export const news: NewsItem[] = [...newsData].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.id - a.id,
);
