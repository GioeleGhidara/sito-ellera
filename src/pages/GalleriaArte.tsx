import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Brush, Download, Droplets, Image, MapPin, Palette, Quote, Search, Users } from "@/lib/icons";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import Seo from "@/components/Seo";
import TableOfContents from "@/components/TableOfContents";
import { Link } from "react-router-dom";
import { artists } from "@/data/galleriaArte";
import {
  galleriaArteImage, caruggiImage,
  muralesCeramista1, ceramista,
  mappaPannelliImage,
} from "@/assets/images";
import { tradizioneDetailPath } from "@/lib/routes";
import CeramicCube from "@/components/CeramicCube";

const gallerySections = [
  { id: "storia", title: "Un sogno diventato realtà" },
  { id: "pannelli", title: "50 Pannelli, 50 Storie" },
  { id: "ceramista", title: "«Il Ceramista» - 750ml" },
  { id: "percorsi", title: "Percorsi della Galleria" },
  { id: "artisti", title: "Gli Artisti" },
  { id: "brochure", title: "Scarica la Brochure" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const GalleriaArte = () => {
  // stato rimosso
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return artists;
    const q = searchQuery.toLowerCase();
    return artists.filter((name) => name.toLowerCase().includes(q));
  }, [searchQuery]);


  return (
    <Layout>
      <Seo
        title="Galleria a cielo aperto di Ellera"
        description="Visita la galleria a cielo aperto di Ellera: 50 pannelli ceramici, artisti italiani e internazionali e un borgo trasformato in percorso d'arte."
        image={galleriaArteImage}
        imageAlt="Pannello ceramico della Galleria a Cielo Aperto di Ellera"
      />
      <PageHero
        imageSrc={galleriaArteImage}
        imageAlt="Pannello ceramico della Galleria a Cielo Aperto di Ellera"
        eyebrow="Arte e Ceramica"
        eyebrowIcon={Palette}
        title="Galleria A Cielo Aperto"
        description="50 opere, un borgo intero"
      />

      {/* Indice */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <TableOfContents items={gallerySections} />
        </div>
      </section>

      {/* Storia del Progetto */}
      <section id="storia" className="scroll-mt-20 py-10 lg:py-14 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Un sogno diventato realtà</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nel <strong>maggio 2012</strong>, Giovanni Poggi - figura storica delle <strong>Ceramiche San Giorgio</strong> -
                presentò i primi dieci pannelli in ceramica che andavano ad abbellire le abitazioni di Ellera,
                il borgo dove era nato e aveva trascorso l'infanzia. Da quel momento, il progetto di trasformare
                il paese in una galleria a cielo aperto si è sviluppato anno dopo anno.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nel <strong>2016</strong>, con la tappa conclusiva nell'ambito della <strong>XI edizione del Festival della Maiolica</strong>,
                la galleria ha raggiunto quota <strong>cinquanta pannelli</strong> di artisti italiani e stranieri.
                Un "miracolo ellerese" nato dalla sinergia straordinaria tra un privato visionario,
                l'Amministrazione Comunale di Albisola Superiore, il Comitato Ellerese e il Comitato Valle del Sansobbia.
              </p>

              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 mt-6 shadow-sm">
                <Quote className="w-5 h-5 text-accent mb-2" />
                <blockquote className="text-foreground italic leading-relaxed">
                  «L'arte ha il compito di non restare in silenzio e di richiamare l'attenzione
                  del pubblico attraverso la bellezza e la sua potenza di evocare sentimenti ed emozioni.»
                </blockquote>
                <p className="text-sm text-muted-foreground mt-3 font-semibold">- Giovanni Poggi, Ceramiche San Giorgio</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <img
                src={caruggiImage}
                alt="I caruggi di Ellera con pannelli ceramici"
                className="w-full rounded-xl shadow-warm object-cover aspect-[3/4]"
              />
              <p className="text-xs text-muted-foreground mt-3 text-center italic">I caratteristici caruggi di Ellera con i pannelli ceramici</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* I 50 Pannelli - Expanded */}
      <section id="pannelli" className="scroll-mt-20 py-8 lg:py-12 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-heading font-bold text-foreground">50 Pannelli, 50 Storie</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  La <strong>«Galleria all'aperto della ceramica d'arte»</strong> conta esattamente cinquanta opere
                  di artisti italiani e stranieri di prestigio, realizzate presso la bottega delle Ceramiche San Giorgio.
                  Nel loro affascinante insieme costituiscono un <em>unicum</em> per il territorio albisolese,
                  noto da secoli per la produzione ceramica ma che non possedeva ancora una galleria d'arte all'aperto
                  così ricca e significativa.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Le opere arredano l'antico borgo e ricordano il ruolo che un tempo rivestì Ellera
                  con i suoi <Link to={tradizioneDetailPath("mulini-del-colore-ellera")} className="text-accent font-semibold hover:underline">mulini del colore</Link>, che fornivano i pigmenti alla produzione ceramica albisolese.
                  Ogni pannello è un frammento di memoria: dalla figurazione classica di Tony Salem
                  all'esplosione materica di Bill Michael Linde, dall'ironia pop di Marco Lodola
                  alle suggestioni informali di Errika Pontevichi.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I pannelli costituiscono una felice sorpresa per il visitatore che li va a cercare
                  e a scoprire non solo nella piazza principale ma anche nelle stradine che si arrampicano
                  verso l'alto, negli slarghi improvvisi e negli ambiti più periferici del borgo.
                  Sono ormai una testimonianza irrinunciabile per chi le ha accolte come un privilegio
                  da esibire sulla facciata di casa.
                </p>

                <div className="flex items-start gap-3 bg-card/60 backdrop-blur-sm border border-border rounded-xl p-4 shadow-sm">
                  <Droplets className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1">Il Torrente Sansobbia</h4>
                    <p className="text-sm text-muted-foreground">
                      Le acque del torrente hanno alimentato per secoli le fornaci e i mulini del colore
                      della vallata. Il borgo sorge alla confluenza del rio Montegrosso con il Sansobbia,
                      circondato dalle colline boschive.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cubo 3D Pannelli */}
              <div className="flex flex-col items-center lg:items-start w-full">
                <div className="flex items-center gap-2 mb-3 w-full">
                  <Image className="w-4 h-4 text-accent" />
                  <h4 className="font-heading font-semibold text-foreground text-sm">Esplora i Pannelli in 3D</h4>
                </div>
                <div className="w-full max-w-sm">
                  <CeramicCube />
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center lg:text-left italic w-full max-w-sm">
                  Trascina il cubo per ruotarlo, usa scorrimento per lo zoom.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Murales «Il Ceramista» - 750ml*/}
      <section id="ceramista" className="scroll-mt-20 py-10 lg:py-14 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center gap-2 mb-2">
              <Brush className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Street Art</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
              «Il Ceramista» - 750ml
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:col-span-3">
              <div className="grid grid-cols-2 gap-3">
                <img
                  src={muralesCeramista1}
                  alt="Murales Il Ceramista di 750ML a Ellera - vista frontale"
                  className="w-full rounded-xl shadow-warm object-cover aspect-[3/4]"
                />
                <img
                  src={ceramista}
                  alt="Murales Il Ceramista di 750ML a Ellera - dettaglio"
                  className="w-full rounded-xl shadow-warm object-cover aspect-[3/4]"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center italic">
                Il murales «Il Ceramista» in Piazza dell'Elce — Foto: IVG.it / Archivio Fotografico del Comune di Albisola Superiore
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:col-span-2">
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-sm mb-4">
                <h3 className="font-heading font-bold text-foreground text-lg mb-1">L'arte e l'artista</h3>
                <p className="text-sm text-accent font-semibold mb-3">Piazza dell'Elce, Ellera</p>
                <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                  Nel 2022 Ellera ha la fortuna di ospitare tra i suoi abitanti l'artista <strong>Mario Leuci</strong> in arte <strong>"750ml"</strong>: da questo incontro nasce un intervento di Street Art e riqualificazione urbana che fonde l'arte moderna con la storia del paese.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                  Una vecchia facciata anonima ora racconta, in questo splendido murale, la storia di Ellera raffigurando al centro <strong>Giovanni Poggi</strong> (1932-2023), sapiente ceramista, fondatore delle Ceramiche San Giorgio e ideatore della Galleria d'Arte all'Aperto. Al suo fianco <strong>Duchessa</strong>, una gatta che ha aspettato la fine dell'opera prima di scomparire (c'è una leggenda che lega i gatti di Ellera alle streghe, cercala!).
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                  In alto a sinistra la <strong>Chiesa di S. Maria Maddalena</strong>, tra le più antiche della Liguria (X secolo), fondata da un eremita che iniziò qui la coltivazione dell'ulivo. Infine la ruota del <strong>Molino</strong>: un tempo erano tanti i mulini lungo il fiume Sansobbia, che non macinavano farina ma i colori per i ceramisti.
                </p>
              </div>

              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 shadow-sm">
                <Quote className="w-4 h-4 text-accent mb-2" />
                <blockquote className="text-foreground italic leading-relaxed text-sm">
                  «Questo vuole essere un regalo a questo splendido paesino che ha saputo accogliermi e starmi vicino, qui mi sono sentito a casa.»
                </blockquote>
                <p className="text-xs text-muted-foreground mt-3 font-semibold">- Mario Leuci ("750ml")</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Percorsi della Galleria */}
      <section id="percorsi" className="scroll-mt-20 py-8 lg:py-10 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-heading font-bold text-foreground">Percorsi della Galleria</h2>
            </div>
            <p className="text-muted-foreground mb-4 max-w-4xl leading-relaxed">
              La galleria a cielo aperto è un itinerario artistico che si snoda
              a raggiera tra i tipici caruggi e le piazzette del borgo, alla confluenza del rio Montegrosso con il Sansobbia.
            </p>
            <p className="text-muted-foreground mb-6 max-w-4xl leading-relaxed">
              Le opere costituiscono una felice sorpresa per il visitatore: si incontrano non solo nella piazza oltre
              il ponte, ma anche nei caruggi che salgono verso l'alto, negli slarghi improvvisi e negli ambiti
              più periferici, trasformando Ellera in una galleria diffusa da scoprire passo dopo passo.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-2">
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">Orientamento</p>
              <h3 className="font-heading font-bold text-foreground text-lg">Mappa dei Pannelli</h3>
              <img
                src={mappaPannelliImage}
                alt="Mappa dei pannelli della Galleria a Cielo Aperto di Ellera"
                className="w-full rounded-lg border border-border object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Griglia Artisti */}
      <section id="artisti" className="scroll-mt-20 py-8 lg:py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-heading font-bold text-foreground">Gli Artisti</h2>
            </div>
            <p className="text-muted-foreground mb-4 max-w-3xl">
              50 opere realizzate da 48 artisti italiani e stranieri presso le Ceramiche San Giorgio
              tra il 2012 e il 2016, donate al borgo di Ellera.
            </p>
            <div className="relative max-w-xs mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cerca artista…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
          >
            {filteredArtists.length > 0 ? filteredArtists.map((name) => (
              <div
                key={name}
                className="bg-card/60 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-center hover:shadow-sm transition-shadow"
              >
                <span className="text-sm font-medium text-foreground">{name}</span>
              </div>
            )) : (
              <p className="col-span-full text-center text-muted-foreground text-sm py-4">Nessun artista trovato</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Download e Crediti */}
      <section id="brochure" className="scroll-mt-20 py-8 lg:py-12 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-8 shadow-sm max-w-xl mx-auto mb-8">
              <Download className="w-8 h-8 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">Scarica la Brochure Ufficiale</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Catalogo storico dell'edizione XI Festival della Maiolica
              </p>
              <a
                href="/Brochure-ellera.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity shadow-warm"
              >
                <Download className="w-4 h-4" />
                Scarica la Brochure (PDF)
              </a>
            </div>

            <p className="text-xs text-muted-foreground italic max-w-2xl mx-auto">
              Fonti:
              <br />
              Brochure «Ellera - Galleria all'aperto della ceramica d'arte» 2016
              <br />
              Libro «Le famiglie albisolesi ed elleresi e le loro attività di un tempo» di Roberto Siri.
              <br />
              Archivio Fotografico del Comune di Albisola Superiore.
            </p>
          </motion.div>
        </div>
      </section>


    </Layout>
  );
};

export default GalleriaArte;
