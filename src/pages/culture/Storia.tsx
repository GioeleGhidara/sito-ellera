import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
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
    title: "I Mulini del Colore",
    content: (
      <>
        <p>
          Tra il Seicento e il Novecento, Ellera divenne il centro di macinazione dei minerali per le manifatture ceramiche di Albisola. I mulini ad acqua vennero convertiti in{" "}
          <Link to={tradizioneDetailPath("mulini-del-colore")} className="text-primary font-semibold hover:underline">
            "mulini del colore"
          </Link>
          : sfruttando i <em>beudi</em> (canali di derivazione), l'energia del Sansobbia azionava macine in pietra per frantumare la galena e le terre necessarie agli smalti delle maioliche costiere.
        </p>
        <p>
          Questa crescita economica portò all'autonomia parrocchiale nel 1628 e alla costruzione della <strong>Chiesa di San Bartolomeo</strong> (1643), che conserva opere di <strong>Anton Maria Maragliano</strong> e di <strong>Eso Peluzzi</strong>. Ellera fu comune autonomo dal 1804 al 1929.
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
          Nel 1897 nacquero a Ellera le{" "}
          <Link to={tradizioneDetailPath("caramelle-rossella")} className="text-primary font-semibold hover:underline">
            Caramelle Rossella
          </Link>
          , con la ricetta artigianale del "Fondant '800" e le successive gelatine di frutta. La vita sociale del paese ruotava attorno alla{" "}
          <Link to={tradizioneDetailPath("fiera-del-bestiame")} className="text-primary font-semibold hover:underline">
            Fiera del Bestiame
          </Link>{" "}
          e all'Oratorio di San Lorenzo, recuperato oggi come{" "}
          <Link to={ROUTES.teatroBaloma} className="text-primary font-semibold hover:underline">
            Teatro Balomà
          </Link>
          .
        </p>
        <p>
          Le feste di paese mantengono vive prove di squadra come l'{" "}
          <Link to={tradizioneDetailPath("albero-della-cuccagna-di-ellera")} className="text-primary font-semibold hover:underline">
            Albero della Cuccagna
          </Link>
          , disputato sul palo ingrassato durante la tradizionale Festa dell'Uva.
        </p>
      </>
    ),
  },
  {
    id: "miti",
    title: "Mito e Tradizione: Le Gatte Stregate",
    content: (
      <>
        <p>
          La memoria popolare tramanda il racconto delle{" "}
          <Link to={tradizioneDetailPath("streghe-di-ellera")} className="text-primary font-semibold hover:underline">
            gatte stregate di Ellera
          </Link>
          , figure femminili rifugiate nelle caverne sopra il borgo. La leggenda si intreccia con il passaggio delle truppe francesi nel 1796 durante la Battaglia di Montenotte, quando le donne si sarebbero trasformate in gatte selvatiche per sfuggire ai soldati.
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
          Dal 2012 le vie di Ellera ospitano la <strong>Galleria all'Aperto della Ceramica d'Arte</strong>: cinquanta pannelli realizzati da artisti italiani e internazionali presso la bottega San Giorgio, collocati permanentemente sulle facciate delle abitazioni.
        </p>
        <p>
          Sui versanti della vallata si sviluppa una rete sentieristica di oltre 65 km per trekking ed e-bike, curata dai volontari e raccordata con l'Alta Via dei Monti Liguri.
        </p>
      </>
    ),
  },
];

const Storia = () => {
  return (
    <Layout>
      <Seo
        title="Storia"
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
