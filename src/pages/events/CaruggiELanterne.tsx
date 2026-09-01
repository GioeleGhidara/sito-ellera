import { Helmet } from "react-helmet-async";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ArchiveRestore, Sparkles } from "../../lib/icons";
import { locandinaCaruggiELanterne } from "../../assets/images";
import { ROUTES } from "../../lib/routes";
import { CARUGGI_EVENT_DATA } from "../../data/events/caruggiELanterne";
import { EventPoster } from "../../components/features/events/EventCard";

export default function CaruggiELanterneComingSoon() {
  return (
    <Layout>
      <Helmet>
        <title>{CARUGGI_EVENT_DATA.title} - Coming Soon</title>
        <meta
          name="description"
          content="L'edizione passata si è conclusa con successo. Stiamo già preparando le lanterne per il prossimo anno nel borgo di Ellera."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={CARUGGI_EVENT_DATA.url} />
      </Helmet>

      <div className="bg-background min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          
          <div className="flex flex-col md:flex-row items-center gap-12 bg-card rounded-3xl border border-border p-8 md:p-12 shadow-sm">
            
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-lg">
                <EventPoster 
                  image={locandinaCaruggiELanterne} 
                  alt="Caruggi e Lanterne" 
                  placeholderLabel="Caruggi"
                  className="w-full h-full object-cover opacity-60 grayscale-[50%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-end pb-8">
                  <Sparkles className="text-accent h-10 w-10 mb-3" />
                  <span className="text-white font-heading text-2xl tracking-wider uppercase font-bold">Prossimamente</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-3/5 text-center md:text-left">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
                <Calendar className="w-4 h-4" />
                <span>Edizione conclusa</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
                {CARUGGI_EVENT_DATA.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                L'ultima edizione è stata un successo straordinario. I vicoli del borgo si sono accesi di magia, buon cibo e musica. 
                <br/><br/>
                Stiamo già lavorando per la prossima edizione. Continua a seguirci per scoprire le nuove date!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Link
                  to={ROUTES.home}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-semibold hover:bg-foreground/90 transition-colors"
                >
                  Torna alla Home
                </Link>
                <Link
                  to="/archivio/caruggi-e-lanterne-2026"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-semibold hover:bg-accent/90 transition-colors"
                >
                  <ArchiveRestore className="w-4 h-4" />
                  Rivivi l'edizione 2026
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
