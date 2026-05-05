import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Calendar,
  Mountain,
  BookOpen,
  Mail,
  Heart,
  MapPin,
  Sparkles,
} from "@/lib/icons";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import Seo from "@/components/shared/Seo";
import { heroChiSiamo, logoComitato } from "@/assets/images";
import { createComitatoOrganizationJsonLd } from "@/lib/jsonLd";
import { contattiComitato } from "@/data/comitato";
import { ROUTES } from "@/lib/routes";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ATTIVITA = [
  {
    icon: Calendar,
    title: "Eventi e Feste",
    body: "Caruggi e Lanterne, Castagnata, E-Bike Fest: ogni evento unisce residenti e visitatori attorno alla bellezza di Ellera.",
  },
  {
    icon: Mountain,
    title: "Tutela del Territorio",
    body: "Curiamo oltre 40 km di sentieri per trekking e MTB nella Albi Trail Area, affinché i boschi restino una meta sicura.",
  },
  {
    icon: BookOpen,
    title: "Memoria e Tradizioni",
    body: "Preserviamo le storie di Ellera — dalle Streghe ai mulini del colore — e il patrimonio rurale della frazione.",
  },
  {
    icon: Users,
    title: "Rete e Collaborazioni",
    body: "Dialoghiamo con Comune e associazioni per un turismo lento, sostenibile e rispettoso del territorio.",
  },
] as const;

const NUMERI = [
  { value: "30+", label: "anni di storia" },
  { value: "40 km", label: "di sentieri" },
  { value: "100%", label: "volontariato" },
] as const;

const RUOLI = [
  { role: "Presidente e Vicepresidente", desc: "Guida e rappresentanza del Comitato.", wide: false },
  { role: "Tesoriere-Segretario", desc: "Gestione amministrativa e contabile.", wide: false },
  { role: "2 Consiglieri Albi Trail", desc: "Sviluppo e cura della sentieristica.", wide: false },
  { role: "1 Consigliere Balomà", desc: "Riferimento per il Centro Polifunzionale.", wide: false },
  { role: "2 Consiglieri Generali", desc: "Supporto a tutte le attività logistiche.", wide: true },
] as const;

export default function ChiSiamo() {
  return (
    <Layout>
      <Seo
        title="Chi Siamo - Comitato Ellerese"
        description="Il Comitato Ellerese: chi siamo, la nostra missione e il nostro impegno per la valorizzazione del borgo di Ellera."
        image={heroChiSiamo}
        imageAlt="Il borgo di Ellera visto dall'alto"
        jsonLd={createComitatoOrganizationJsonLd()}
        canonicalPath={ROUTES.comitato}
      />
      <PageHero
        imageSrc={heroChiSiamo}
        imageAlt="Il Comitato Ellerese"
        imageClassName="object-[center_25%]"
        eyebrow="Chi Siamo"
        eyebrowIcon={Users}
        title="Il Comitato"
      />

      {/* Intro */}
      <section className="bg-gradient-to-b from-slate-100 to-background py-8 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center space-y-5 lg:space-y-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-3 lg:space-y-5">
            <div className="inline-flex items-center gap-2 text-accent font-semibold text-xs lg:text-sm uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              <span>La nostra missione</span>
            </div>
            <p className="mx-auto max-w-3xl text-base lg:text-lg leading-relaxed text-slate-700">
              Il <strong className="font-semibold text-foreground">Comitato Ellerese</strong> è il cuore pulsante della comunità di Ellera — un gruppo di cittadini uniti dalla passione per il proprio territorio, impegnati ogni giorno a tenerlo vivo, a raccontarlo e a condividerlo.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-accent/10 border border-accent/20 rounded-2xl p-5 lg:p-10 relative overflow-hidden text-left"
          >
            <UserPlus className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4 w-16 h-16 lg:w-24 lg:h-24 text-accent/10 pointer-events-none" />
            <h3 className="text-accent font-heading font-semibold text-lg lg:text-2xl mb-2 lg:mb-4 relative z-10">
              Nessun "socio", solo volontari
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm lg:text-base lg:max-w-2xl lg:mx-auto relative z-10">
              Non esistono iscrizioni formali né quote. Le porte sono sempre aperte: chiunque abbia voglia di dare una mano o proporre un'idea è il benvenuto. Ellera è di chi la ama.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Numeri */}
      <section className="py-7 lg:py-10 bg-foreground text-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-3 gap-4 lg:gap-8 text-center">
            {NUMERI.map(({ value, label }) => (
              <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="text-3xl lg:text-4xl font-heading font-bold text-accent mb-0.5 lg:mb-2">{value}</p>
                <p className="text-[10px] lg:text-xs uppercase tracking-widest text-background/60">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cosa Facciamo */}
      <section className="py-8 lg:py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-6 lg:mb-10">
            <div className="inline-flex items-center gap-1.5 lg:gap-2 text-accent font-semibold text-xs lg:text-sm uppercase tracking-widest mb-2 lg:mb-3">
              <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              <span>Le nostre attività</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground mb-1.5 lg:mb-3">Cosa Facciamo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm lg:text-base hidden lg:block">
              Trasformiamo l'amore per Ellera in azioni concrete — ogni settimana, tutto l'anno.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-8">
            {ATTIVITA.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl lg:rounded-2xl p-4 lg:p-8 shadow-warm hover:shadow-md hover:border-accent/30 transition-all group flex items-start gap-4 lg:block"
              >
                {/* Mobile: icona inline a sinistra. Desktop: icona sopra */}
                <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 lg:mb-5 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-4 h-4 lg:w-6 lg:h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-base lg:text-xl font-heading font-semibold text-foreground mb-1 lg:mb-3">{title}</h3>
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Il Consiglio */}
      <section className="py-8 lg:py-12 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-warm">
              <div className="p-5 lg:p-10">

                <div className="flex items-center gap-4 lg:gap-6 mb-5 lg:mb-8">
                  <img src={logoComitato} alt="Logo Comitato Ellerese" className="h-12 w-12 lg:h-20 lg:w-20 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl lg:text-2xl font-heading font-semibold text-foreground mb-0.5 lg:mb-2">Il Consiglio</h2>
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                      Il Comitato è guidato da un Consiglio operativo strutturato attorno alle principali anime del territorio.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 text-sm">
                  {RUOLI.map(({ role, desc, wide }) => (
                    <div
                      key={role}
                      className={`bg-slate-50 px-3 py-2.5 lg:p-4 rounded-lg lg:rounded-xl border border-slate-100 ${wide ? "sm:col-span-2" : ""}`}
                    >
                      <strong className="text-foreground text-xs lg:text-sm block lg:mb-1">{role}</strong>
                      <span className="text-slate-500 text-xs lg:text-slate-600">{desc}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dove Siamo & Scopo */}
      <section className="py-8 lg:py-10 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="bg-card border border-border rounded-2xl p-5 lg:p-8 shadow-warm flex flex-col sm:flex-row gap-5 lg:gap-8">
              <div className="flex-1 flex flex-col gap-1.5 lg:gap-2">
                <div className="inline-flex items-center gap-2 text-accent font-semibold text-xs lg:text-sm uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span>Dove Siamo</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                  Ellera è una frazione di <strong className="text-foreground">Albisola Superiore (SV)</strong>, nel cuore della Liguria, sulle colline che guardano il mare.
                </p>
              </div>

              <div className="w-full h-px sm:w-px sm:h-auto bg-border" />

              <div className="flex-1 flex flex-col gap-1.5 lg:gap-2">
                <div className="inline-flex items-center gap-2 text-accent font-semibold text-xs lg:text-sm uppercase tracking-widest">
                  <Heart className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span>Il Nostro Impegno</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                  Ogni provento degli eventi viene reinvestito interamente per tenere vivo il borgo — <strong className="text-foreground">nessun altro scopo, nessuna eccezione</strong>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contatti */}
      <section className="py-8 lg:py-12 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl space-y-5 lg:space-y-8">

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <div className="inline-flex items-center gap-2 text-accent font-semibold text-xs lg:text-sm uppercase tracking-widest mb-2 lg:mb-4">
              <UserPlus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              <span>Unisciti a noi</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground mb-2 lg:mb-4">Fai parte di Ellera</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm lg:text-base leading-relaxed">
              Non serve un curriculum: basta voler bene a questo posto. Scrivici per qualsiasi idea.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="bg-card border border-border rounded-2xl p-5 lg:p-8 shadow-warm">
              <p className="text-muted-foreground mb-4 text-sm">
                Scrivi direttamente in base al tema della tua richiesta.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                {contattiComitato.map((contatto) => (
                  <a
                    key={contatto.email}
                    href={`mailto:${contatto.email}`}
                    className="group rounded-xl border border-border bg-background/60 p-3 lg:p-4 hover:border-accent/40 hover:bg-accent/5 transition-all"
                  >
                    <div className="flex items-center gap-2 text-foreground mb-1 lg:mb-2">
                      <Mail className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-accent" />
                      <span className="font-semibold text-xs lg:text-sm">{contatto.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground group-hover:text-accent transition-colors break-all">
                      {contatto.email}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </Layout>
  );
}
