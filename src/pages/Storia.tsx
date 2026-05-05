import { motion } from "framer-motion";
import { 
  BookOpen, 
  History, 
  Palette, 
  ArrowRight, 
  Mountain,
} from "@/lib/icons";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import Seo from "@/components/shared/Seo";
import { elleraDalPonteImage, heroStoriaImage } from "@/assets/images";
import { ROUTES, tradizioneDetailPath } from "@/lib/routes";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const sections = [
  {
    id: "origini",
    title: "Le Origini: Tra Edera e Monaci",
    content: (
      <>
        <p>
          Il nome stesso del borgo racconta le sue origini. L'etimologia deriva dal latino{" "}
          <Link to={tradizioneDetailPath("etimologia-di-ellera")} className="text-primary font-semibold hover:underline">
            Hedera
          </Link>{" "}
          (edera), termine che descrive perfettamente il microclima umido e la vegetazione rigogliosa che caratterizzava la valle del torrente Sansobbia. Il nucleo abitato nacque in epoca altomedievale, in una posizione arroccata e difendibile, probabile rifugio dalle incursioni dei pirati saraceni.
        </p>
        <p>
          Le radici documentate risalgono al <strong>991</strong>, quando il marchese Anselmo di Savona donò queste terre al monastero benedettino di <strong>San Quintino di Spigno</strong>. Furono i monaci a bonificare l'area, costruendo i primi mulini e la{" "}
          <Link to={tradizioneDetailPath("chiese-di-ellera")} className="text-primary font-semibold hover:underline">
            chiesa preromanica di Santa Maria
          </Link>{" "}
          (X-XI secolo), che ancora oggi conserva tracce di preziosi affreschi nel suo catino absidale.
        </p>
      </>
    ),
  },
  {
    id: "epoca-oro",
    title: "L'Epoca d'Oro: I Mulini del Colore",
    content: (
      <>
        <p>
          Tra il Seicento e il Novecento, Ellera divenne il motore dell'industria ceramica albisolese. I mulini ad acqua vennero convertiti in{" "}
          <Link to={tradizioneDetailPath("mulini-del-colore")} className="text-primary font-semibold hover:underline">
            "mulini del colore"
          </Link>
          : grazie ai <em>beudi</em> (canali), la forza dell'acqua azionava macine che frantumavano minerali per produrre i pigmenti delle celebri maioliche di Albisola.
        </p>
        <p>
          Questa ricchezza portò all'autonomia parrocchiale nel 1628 e alla costruzione della <strong>Chiesa di San Bartolomeo</strong> (1643), uno scrigno che vanta opere del <strong>Maragliano</strong> e di <strong>Eso Peluzzi</strong>. Ellera fu persino un Comune autonomo dal 1804 al 1929.
        </p>
      </>
    ),
  },
  {
    id: "vita-borgo",
    title: "Vita di Borgo e Tradizioni",
    content: (
      <>
        <p>
          L'economia operosa diede vita nel 1897 alle celebri{" "}
          <Link to={tradizioneDetailPath("caramelle-rossella")} className="text-primary font-semibold hover:underline">
            Caramelle Rossella
          </Link>
          , con il famoso "Fondant '800" e le gelatine di frutta. La vita sociale ruotava attorno alla{" "}
          <Link to={tradizioneDetailPath("fiera-del-bestiame")} className="text-primary font-semibold hover:underline">
            Fiera del Bestiame
          </Link>{" "}
          e all'Oratorio di San Lorenzo, rinato oggi come{" "}
          <Link to={ROUTES.teatroBaloma} className="text-primary font-semibold hover:underline">
            Teatro Balomà
          </Link>
          .
        </p>
        <p>
          Riti collettivi come l'{" "}
          <Link to={tradizioneDetailPath("albero-della-cuccagna-di-ellera")} className="text-primary font-semibold hover:underline">
            Albero della Cuccagna
          </Link>
          , riproposto durante la Festa dell'Uva, continuano a unire le generazioni in una prova di forza e fiducia reciproca che rende viva la piazza del borgo.
        </p>
      </>
    ),
  },
  {
    id: "miti",
    title: "Mito e Storia: Le Gatte Stregate",
    content: (
      <>
        <p>
          La leggenda più affascinante riguarda le bellissime{" "}
          <Link to={tradizioneDetailPath("streghe-di-ellera")} className="text-primary font-semibold hover:underline">
            streghe di Ellera
          </Link>
          , anime gentili che proteggevano il borgo. Si narra che nel 1796, per sfuggire ai soldati napoleonici, si trasformarono in enormi gatti selvatici dal volto umano, scacciando gli invasori e lasciando monete d'oro agli abitanti.
        </p>
      </>
    ),
  },
  {
    id: "oggi",
    title: "Ellera Oggi: Arte e Outdoor",
    content: (
      <>
        <p>
          Dal 2012, Ellera è una <strong>Galleria a Cielo Aperto</strong>. Oltre 50 pannelli ceramici di artisti internazionali ornano i carruggi, trasformando il paese in un museo museo en plein air. 
        </p>
        <p>
          Allo stesso tempo, il borgo è diventato meta d'eccellenza per l'<strong>Outdoor</strong>, con una rete di 65 km di sentieri per trekking e MTB che collegano il mare all'Alta Via dei Monti Liguri.
        </p>
      </>
    ),
  },
];

const Storia = () => {
  return (
    <Layout>
      <Seo
        title="La Storia di Ellera: dalle origini benedettine all'arte"
        description="Scopri la storia di Ellera: l'etimologia dal latino Hedera, la fondazione dei monaci benedettini, i mulini del colore e la rinascita come borgo d'arte."
        image={heroStoriaImage}
      />

      <PageHero
        imageSrc={heroStoriaImage}
        imageAlt="Vista panoramica di Ellera"
        eyebrow="Identità e Radici"
        eyebrowIcon={History}
        title="Un Viaggio nel Tempo"
        description="Tra natura, arte e tradizioni millenarie: la storia del borgo dove l'acqua incontra il colore."
      />

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          
          <motion.div 
            className="mb-16 max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="text-lg text-muted-foreground leading-relaxed italic">
              "Incastonato nelle prime alture dell'entroterra ligure, Ellera è un luogo dove la forza dell'acqua, la fatica dell'uomo e la magia dell'arte si sono intrecciate per secoli."
            </p>
          </motion.div>

          <div className="space-y-20">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                className="max-w-3xl mx-auto"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-accent" />
                    <span className="text-xs font-bold text-accent uppercase tracking-widest">Capitolo {index + 1}</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
                    {section.title}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                    {section.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Links */}
      <section className="py-16 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h3 className="text-2xl font-heading font-bold mb-10">Vuoi approfondire un capitolo specifico?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link to={ROUTES.tradizioni} className="group p-6 bg-card rounded-2xl border border-border hover:border-accent/40 transition-all text-left">
              <BookOpen className="w-6 h-6 text-accent mb-4" />
              <h4 className="font-bold mb-2">Tradizioni e Racconti</h4>
              <p className="text-sm text-muted-foreground">Leggi i dettagli sulla fiera, le caramelle e l'albero della cuccagna.</p>
            </Link>
            <Link to={ROUTES.galleriaArte} className="group p-6 bg-card rounded-2xl border border-border hover:border-accent/40 transition-all text-left">
              <Palette className="w-6 h-6 text-accent mb-4" />
              <h4 className="font-bold mb-2">La Galleria a Cielo Aperto</h4>
              <p className="text-sm text-muted-foreground">Guarda le opere che hanno trasformato il borgo in un museo.</p>
            </Link>
            <Link to={ROUTES.trekking} className="group p-6 bg-card rounded-2xl border border-border hover:border-accent/40 transition-all text-left">
              <Mountain className="w-6 h-6 text-accent mb-4" />
              <h4 className="font-bold mb-2">Outdoor e Sentieri</h4>
              <p className="text-sm text-muted-foreground">Scopri i percorsi che ricalcano le antiche vie dei mulini.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Acknowledgements */}
      <footer className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Fonte: Ricerca storica basata su archivi locali e tradizione orale del Comitato Ellerese.
          </p>
        </div>
      </footer>
    </Layout>
  );
};

export default Storia;
