import caruggiEllera from "@/assets/images/places/caruggiEllera.avif";
import fieraBestiame from "@/assets/images/fiera-pesa/f.bestiame.avif";
import pesaPubblica from "@/assets/images/fiera-pesa/pasa_pubblica.avif";
import heroImage from "@/assets/images/home/hero_image.avif";
import teatroBalomaExterior from "@/assets/images/teatro/teatro_baloma_exterior.avif";
import teatroBalomaInterior from "@/assets/images/teatro/interno_teatro.avif";
import chiesaMariaMaddalena from "@/assets/images/tradizioni/chiese/chiesa_maria_maddalena.avif";
import chiesaSanBartolomeo from "@/assets/images/tradizioni/chiese/chiesa_san_bartolomeo.avif";
import alberoCuccagna1 from "@/assets/images/tradizioni/albero-cuccagna/albero-cuccagna1.jpg";
import alberoCuccagna2 from "@/assets/images/tradizioni/albero-cuccagna/albero-cuccagna2.jpg";
import gattaVicoli from "@/assets/images/tradizioni/streghe/gatta-vicoli.avif";
import gattoMano from "@/assets/images/tradizioni/gattoMano.avif";
import tradizionePlaceholder from "@/assets/images/tradizioni/placeholders/tradizione-placeholder.svg";
import digaMulinoMaroneBesin from "@/assets/images/tradizioni/mulini-riferimenti/diga-mulino-marone-besin.avif";
import mappaMulini from "@/assets/images/tradizioni/mulini-riferimenti/mappa-mulini.avif";
import muliniAlto from "@/assets/images/tradizioni/mulini-riferimenti/mulini-alto.avif";
import mulinoCampasso from "@/assets/images/tradizioni/mulini-riferimenti/mulino-campasso.avif";
import mulinoSuffragioBeo from "@/assets/images/tradizioni/mulini-riferimenti/mulino-suffragio-beo.avif";
import mulinoChiappe from "@/assets/images/tradizioni/mulini-riferimenti/mulino-chiappe.avif";
import mulinoBarban from "@/assets/images/tradizioni/mulini-riferimenti/mulino-barban.avif";
import mulinoGalo from "@/assets/images/tradizioni/mulini-riferimenti/mulino-galo.avif";
import mulinoMarone from "@/assets/images/tradizioni/mulini-riferimenti/mulino-marone.avif";
import mulinoRemenun from "@/assets/images/tradizioni/mulini-riferimenti/mulino-remenun.avif";
import sanBartolomeoPannello from "@/assets/images/tradizioni/chiese/sanBartolomeoPannello.avif";


export interface GallerySlide {
  src: string;
  alt: string;
  caption?: string;
}

const createPlaceholderSlide = (subject: string, caption: string): GallerySlide => ({
  src: tradizionePlaceholder,
  alt: `Segnaposto: ${subject}`,
  caption,
});

export const tradizioneGalleryBySlug: Record<string, GallerySlide[]> = {
  "streghe-di-ellera": [
    {
      src: caruggiEllera,
      alt: "Carruggi di Ellera associati alla leggenda delle gatte stregate",
      caption:
        "I carruggi del borgo sono il luogo in cui la memoria popolare continua a riconoscere nelle gatte le antiche protettrici di Ellera.",
    },
    {
      src: gattoMano,
      alt: "Dettaglio gatto nei carruggi",
      caption: "Un incontro suggestivo tra i carruggi, dove la leggenda delle gatte stregate rivive nei dettagli quotidiani del borgo.",
    },
    {
      src: gattaVicoli,
      alt: "Gatta nei vicoli di Ellera legata all'immaginario delle gatte stregate",
      caption:
        "Una gatta tra ombra e pietra nei vicoli del borgo rende concreta la metamorfosi con cui la tradizione trasforma le streghe nelle protettrici feline di Ellera.",
    },
  ],
  "chiese-di-ellera": [
    {
      src: tradizionePlaceholder,
      alt: "Abside dell'antica chiesa di Santa Maria a Ellera",
      caption:
        "L'abside dell'antica chiesa di Santa Maria (X-XI secolo). Un prezioso scrigno altomedievale che custodisce tracce di affreschi del XIII-XIV secolo, oggi al centro di una grande campagna di salvataggio per impedirne il crollo.",
    },
    {
      src: chiesaMariaMaddalena,
      alt: "Facciata e campanile di Santa Maria Maddalena a Ellera",
      caption:
        "Il complesso sullo sperone roccioso: la chiesa della Maddalena (1590) con la sua caratteristica cupoletta campanaria rivestita di piastrelle smaltate verdi. In questo luogo, nel Settecento, visse e fu sepolto l'eremita Michele Manica.",
    },
    {
      src: tradizionePlaceholder,
      alt: "Chiesetta dell'Immacolata Concezione a Ellera",
      caption:
        "L'intima chiesetta restaurata dal Gruppo Alpini delle Albissole, oggi tappa tradizionale e luogo del cuore durante i raduni delle penne nere nel borgo.",
    },
    {
      src: chiesaSanBartolomeo,
      alt: "Chiesa parrocchiale di San Bartolomeo Apostolo a Ellera",
      caption:
        "Costruita in soli sei anni (1637-1643) e voluta con fierezza dalla comunità. Sulla facciata di ispirazione neoclassica, rifatta nel 1877, si legge l'orgoglio di un borgo arricchito dal faticoso lavoro dei mulini.",
    },
    {
      src: tradizionePlaceholder,
      alt: "Scultura lignea di Santa Maria Maddalena attribuita ad Anton Maria Maragliano",
      caption:
        "Il capolavoro ligneo di Santa Maria Maddalena penitente, un'opera dei primi del Settecento attribuita al grande scultore Anton Maria Maragliano.",
    },
    {
      src: sanBartolomeoPannello,
      alt: "Pannello ceramico del martirio di San Bartolomeo a Ellera",
      caption:
        "Pannello n. 40 – Opera in ceramica di Bartolomeo Delfino. Raffigura il drammatico martirio di San Bartolomeo, patrono del borgo, scorticato vivo sotto una luce divina.",
    },
    {
      src: tradizionePlaceholder,
      alt: "Porta bronzea del tabernacolo di Roberto Bertagnin",
      caption:
        "Donato in occasione del 350° anniversario della parrocchia (1978), il portale bronzeo dello scultore Roberto Bertagnin raffigura il trionfo e la speranza del Cristo Risorto.",
    },
  ],
  "cinema-e-teatro-baloma": [
    createPlaceholderSlide(
      "foto d'archivio della facciata del vecchio cinema di Ellera",
      "La facciata del vecchio cinema di paese, prima del recupero, documenta la stagione in cui il Balomà era soprattutto luogo di proiezioni e ritrovo serale per la comunità.",
    ),
    createPlaceholderSlide(
      "foto d'archivio della sala cinematografica del Balomà con schermo e poltrone",
      "La sala del cinema con schermo, poltrone e cabina di proiezione restituisce l'esperienza collettiva delle serate cinematografiche vissute per decenni nel borgo.",
    ),
    {
      src: teatroBalomaExterior,
      alt: "Facciata esterna del Teatro Balomà di Ellera",
      caption:
        "Dopo il recupero, il Balomà si presenta come teatro di comunità: lo stesso edificio che un tempo ospitava il cinema torna a essere presidio culturale del paese.",
    },
    {
      src: teatroBalomaInterior,
      alt: "Interno del Teatro Balomà durante uno spettacolo",
      caption:
        "L'interno del teatro durante un evento mostra la continuità tra la vecchia funzione cinematografica e l'attuale vita scenica del Balomà.",
    },
  ],
  "caramelle-rossella": [
    createPlaceholderSlide(
      "antica pubblicità delle caramelle Rossella",
      "Un'antica pubblicità delle caramelle Rossella sarebbe il materiale più adatto per raccontare l'identità visiva storica del marchio e il suo radicamento nella memoria commerciale di Ellera.",
    ),
    createPlaceholderSlide(
      "scatola storica delle caramelle Rossella o delle gelatine Ellera",
      "Una scatola originale delle caramelle Rossella, o una confezione storica dedicata alle gelatine Ellera, mostrerebbe bene materiali, grafica e posizionamento del prodotto nel tempo.",
    ),
    createPlaceholderSlide(
      "logo o marchio storico delle caramelle Ellera",
      "Il logo delle caramelle Ellera, oppure un marchio storico Rossella legato al nome del borgo, sarebbe il riferimento iconografico più diretto per visualizzare il legame tra prodotto e origine.",
    ),
  ],
  "fiera-del-bestiame": [
    {
      src: fieraBestiame,
      alt: "Targa ceramica dedicata alla Fiera del Bestiame di San Bartolomeo a Ellera",
      caption:
        "La targa ricorda la Fiera del Bestiame di San Bartolomeo, storico appuntamento commerciale che animava la Corte lungo via Montenolle.",
    },
    {
      src: pesaPubblica,
      alt: "Pesa pubblica storica legata alla vita economica di Ellera",
      caption:
        "La pesa pubblica serviva a misurare granaglie e legname in transito nella vallata, garantendo scambi corretti tra venditori e compratori.",
    },
  ],
  "mulini-del-colore-ellera": [
    {
      src: mappaMulini,
      alt: "Mappa dei mulini da colore della valle del Sansobbia",
      caption:
        "Mappa dei mulini da colore della valle del Sansobbia - Il distretto produttivo di Ellera, distribuito lungo il torrente per oltre tre secoli di lavorazione di smalti e vernici per le fornaci di Albisola.",
    },
    {
      src: mulinoChiappe,
      alt: "Mulino delle Chiappe",
      caption:
        "Mulino delle Chiappe - Il nome dialettale ciape indica le lastre di pietra piatta affioranti, tratto caratteristico del paesaggio geologico in cui l'impianto era incastonato. Situato alla confluenza del rio di Magrania, è documentato per la macinazione dei colori fin dal 1612.",
    },
    {
      src: muliniAlto,
      alt: "Mulino d'Alto",
      caption:
        "Mulino d'Alto - Il mulino era alimentato da un ingegnoso sistema di beudi lunghi chilometri. Qui sopravvive ancora una rara macina in pietra grigia usata per frantumare il minerale.",
    },
    {
      src: mulinoGalo,
      alt: "Mulino di Gallo",
      caption:
        "Mulino di Gallo - In dialetto Galò, è stato costruito alla fine del Seicento in fondo al 'prato di Ellera', fu al centro di storiche liti per i diritti sull'acqua del fiume. È rimasto attivo nella macinazione del piombo fino al 1928, gestito per generazioni dalla famiglia Rossi.",
    },
    {
      src: mulinoSuffragioBeo,
      alt: "Mulino del Suffragio e del Beo",
      caption:
        "Mulino del Suffragio e del Beo - Due impianti contigui del tratto centrale, il secondo noto con il termine dialettale beo (canale, beudo). Appartenente un tempo all'omonima Compagnia religiosa nel cuore di Ellera, affiancò alla macinazione del grano quella dei colori nel 1781. Agli inizi del Novecento, l'energia del mulino veniva usata di notte per produrre la prima elettricità del paese. Oggi la sua ruota in legno è stata restaurata e continua a girare a scopo decorativo, mantenendo viva la memoria storica del paese.",
    },
    {
      src: mulinoCampasso,
      alt: "Mulino del Campasso",
      caption:
        "Mulino del Campasso - Il toponimo campasso indica un terreno aperto di passaggio. Noto anche come 'u muìn du barì', era un piccolo opificio e l'unico a essere situato in riva a un affluente, il rio di Montegrosso. Sebbene oggi sia smantellato, restano evidenti tracce dell'antico beudo e della chiusa.",
    },
    {
      src: mulinoRemenun,
      alt: "Mulino di Remenun",
      caption:
        "Mulino di Remenun - Situato in una piccola costruzione sulla sponda destra del Sansobbia, dove la zona prese il suo nome, fu dedicato fin dalle origini esclusivamente alla macinazione del piombo. L'attività, gestita dalla famiglia Codino, si interruppe solo nel 1915 a causa della guerra.",
    },
    {
      src: mulinoMarone,
      alt: "Mulino di Marone",
      caption:
        "Mulino di Marone - Uno degli impianti più prossimi all'alveo del Sansobbia, con il beudo tra i più brevi della valle. Il nome richiama la toponomastica locale dei fondi terrieri medievali.",
    },
    {
      src: digaMulinoMaroneBesin,
      alt: "Diga del mulino di Marone con il mulino di Besin",
      caption:
        "Diga del mulino di Marone con il mulino detto Besin - L'opera di captazione che alimentava l'impianto, affiancata in seguito da un piccolo generatore per la produzione di energia elettrica: la transizione tecnologica raccontata in un solo sito.",
    },
    {
      src: mulinoBarban,
      alt: "Mulino di Barbàn",
      caption:
        "Mulino di Barbàn - L'accento sulla seconda sillaba è tratto tipico della toponomastica rurale savonese. Il più settentrionale tra i mulini di Ellera, immerso nella natura vicino al confine con Stella. Servito da un lunghissimo beudo, conserva ancora antiche macine in pietra di Cisano reimpiegate persino nei muretti a secco circostanti.",
    },
  ],
  "albero-della-cuccagna-di-ellera": [
    {
      src: alberoCuccagna1,
      alt: "Albero della cuccagna a Ellera con squadra in salita",
      caption:
        "La fase centrale della scalata mostra bene il lato tecnico del gioco: equilibrio, lettura degli appoggi e collaborazione tra chi sale e chi sostiene da terra.",
    },
    {
      src: alberoCuccagna2,
      alt: "Albero della cuccagna a Ellera durante la festa",
      caption:
        "Una vista più ampia della prova mette in evidenza la dimensione pubblica dell'albero della cuccagna: partecipanti, spettatori e festa che si costruisce intorno al gesto collettivo.",
    },
    createPlaceholderSlide(
      "dettaglio delle mani, della presa sul palo e della preparazione prima del tentativo",
      "Un dettaglio ravvicinato delle mani e della presa sul palo aiuterebbe a raccontare il lavoro tecnico che precede la salita, tra coordinazione e scelta degli appoggi.",
    ),
    createPlaceholderSlide(
      "arrivo in cima con bandiera o premio e reazione del pubblico in piazza",
      "Lo scatto dell'arrivo in cima, con l'esultanza del gruppo e del pubblico, sarebbe l'immagine chiave per chiudere il racconto sul valore comunitario del gioco.",
    ),
  ],
  "etimologia-di-ellera": [
    {
      src: heroImage,
      alt: "Veduta del borgo di Ellera nella valle del Sansobbia",
      caption:
        "Il borgo disteso lungo la Sansobbia restituisce il legame originario tra insediamento, microclima e toponimo medievale.",
    },
    createPlaceholderSlide(
      "dettaglio di edera su muro in pietra o roccia antica di Ellera",
      "L'edera che si arrampica su pietra, umidità e murature antiche del borgo rende immediato il fitonimo da cui la tradizione fa discendere il nome Ellera.",
    ),
    createPlaceholderSlide(
      "riproduzione di un documento medievale con una prima attestazione del toponimo",
      "Una fonte medievale con la forma antica del toponimo collega la storia linguistica del nome alle prime attestazioni documentarie e alle origini monastiche del paese.",
    ),
    createPlaceholderSlide(
      "traccia del complesso di Santa Maria o di un sito monastico originario di Ellera",
      "Un'immagine del sito più antico legato al nucleo monastico di Ellera aiuterebbe a collegare il nome del borgo al paesaggio in cui si formò il primo insediamento medievale.",
    ),
  ],
};
