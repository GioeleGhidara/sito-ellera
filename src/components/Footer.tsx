import { Link } from "react-router-dom";
import {
  BookOpen,
  Bike,
  CalendarDays,
  Church,
  Clapperboard,
  Compass,
  Eye,
  Handshake,
  House,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Mountain,
  Newspaper,
  Palette,
  ShoppingBag,
} from "@/lib/icons";
import { logoComitatoRidotto } from "@/assets/images";
import { ROUTES } from "@/lib/routes";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-1 flex items-center gap-2 text-2xl font-heading font-bold">
              <House className="h-6 w-6" />
              Ellera
            </h3>
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-primary-foreground/50">
              Galleria a Cielo Aperto & Outdoor
            </p>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              Borgo medievale ligure nella Valle del Sansobbia, dove i carruggi si vestono di pannelli ceramici,
              antichi lampadari illuminano gli archivolti e i sentieri nel verde portano fino al Bric Genova.
              Ellera fu fondata nel Medioevo grazie ai monaci benedettini di San Quintino di Spigno che
              ricavarono terre coltivabili e costruirono i primi mulini.
            </p>
          </div>

          <div>
            <h4 className="mb-4 flex items-center gap-1.5 text-sm font-heading font-semibold uppercase tracking-wider text-primary-foreground/60">
              <Compass className="h-4 w-4" />
              Esplora
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <Link
                to={ROUTES.galleriaArte}
                className="flex items-center gap-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <Palette className="h-3.5 w-3.5" />
                Galleria a Cielo Aperto
              </Link>
              <Link
                to={ROUTES.trekking}
                className="flex items-center gap-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <Mountain className="h-3.5 w-3.5" />
                Trekking
              </Link>
              <Link
                to={ROUTES.teatroBaloma}
                className="flex items-center gap-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <Clapperboard className="h-3.5 w-3.5" />
                Teatro Balomà
              </Link>
              <Link
                to={ROUTES.albiTrailArea}
                className="flex items-center gap-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <Bike className="h-3.5 w-3.5" />
                Albi Trail Area
              </Link>
              <Link
                to={ROUTES.eventi}
                className="flex items-center gap-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Eventi
              </Link>
              <Link
                to={ROUTES.news}
                className="flex items-center gap-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <Newspaper className="h-3.5 w-3.5" />
                News
              </Link>
              <Link
                to={ROUTES.comitato}
                className="flex items-center gap-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <Handshake className="h-3.5 w-3.5" />
                Comitato
              </Link>
              <Link
                to={ROUTES.tradizioni}
                className="flex items-center gap-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Tradizioni
              </Link>
              <Link
                to={ROUTES.servizi}
                className="flex items-center gap-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Servizi
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 flex items-center gap-1.5 text-sm font-heading font-semibold uppercase tracking-wider text-primary-foreground/60">
              <Eye className="h-4 w-4" />
              SCOPRICi
            </h4>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Ellera, Valle Sansobbia
                  <br />
                  Albisola Superiore (SV), Liguria
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="space-y-1">
                  <a href="mailto:info@ellera.it" className="block transition-colors hover:text-primary-foreground">
                    info@ellera.it
                  </a>
                  <a href="mailto:albitrail@ellera.it" className="block transition-colors hover:text-primary-foreground">
                    albitrail@ellera.it
                  </a>
                  <a
                    href="mailto:comitato@ellera.it"
                    className="block transition-colors hover:text-primary-foreground"
                  >
                    comitato@ellera.it
                  </a>
                </div>
              </div>
              <div className="flex gap-4 pt-1">
                <a
                  href="https://www.facebook.com/profile.php?id=61578504275210#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary-foreground"
                  aria-label="Seguici su Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/comitatoellerese"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary-foreground"
                  aria-label="Seguici su Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
              <div className="flex items-start gap-2 border-t border-primary-foreground/10 pt-2">
                <Church className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="text-xs leading-relaxed">
                  Chiesa di San Bartolomeo (1642) e Chiesetta di Santa Maria Maddalena (1590),
                  patrimonio storico del borgo.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/40 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src={logoComitatoRidotto} alt="Logo Comitato Ellerese" className="h-10 w-10" />
            <span>Copyright {new Date().getFullYear()} Ellera - Comitato Ellerese</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
