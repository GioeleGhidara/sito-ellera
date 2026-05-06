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

// ─── DATI ESTRATTI ───────────────────────────────────────────────────────────

const NAV_LINKS = [
  { to: ROUTES.galleriaArte, icon: Palette, label: "Galleria a Cielo Aperto" },
  { to: ROUTES.trekking, icon: Mountain, label: "Trekking" },
  { to: ROUTES.teatroBaloma, icon: Clapperboard, label: "Teatro Balomà" },
  { to: ROUTES.albiTrailArea, icon: Bike, label: "Albi Trail Area" },
  { to: ROUTES.eventi, icon: CalendarDays, label: "Eventi" },
  { to: ROUTES.news, icon: Newspaper, label: "News" },
  { to: ROUTES.comitato, icon: Handshake, label: "Comitato" },
  { to: ROUTES.tradizioni, icon: BookOpen, label: "Tradizioni" },
  { to: ROUTES.servizi, icon: ShoppingBag, label: "Servizi" },
] as const;

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/profile.php?id=61578504275210",
    icon: Facebook,
    label: "Seguici su Facebook",
  },
  {
    href: "https://www.instagram.com/comitatoellerese",
    icon: Instagram,
    label: "Seguici su Instagram",
  },
] as const;

const EMAILS = ["info@ellera.it", "comitatoellera@gmail.com"];

// ─── SOTTO-COMPONENTI ────────────────────────────────────────────────────────

const linkCls = "flex items-center gap-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground";

function FooterNav() {
  return (
    <div>
      <h4 className="mb-4 flex items-center gap-1.5 text-sm font-heading font-semibold uppercase tracking-wider text-primary-foreground/60">
        <Compass className="h-4 w-4" />
        Esplora
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {NAV_LINKS.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className={linkCls}>
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function FooterContact() {
  return (
    <div>
      <h4 className="mb-4 flex items-center gap-1.5 text-sm font-heading font-semibold uppercase tracking-wider text-primary-foreground/60">
        <Eye className="h-4 w-4" />
        Scoprici
      </h4>
      <div className="space-y-3 text-sm text-primary-foreground/70">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Ellera
            <br />
            Albisola Superiore (SV), Liguria
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Mail className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="space-y-1">
            {EMAILS.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="block transition-colors hover:text-primary-foreground"
              >
                {email}
              </a>
            ))}
          </div>
        </div>
        <div className="flex gap-4 pt-1">
          {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary-foreground"
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
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
  );
}

// ─── COMPONENTE PRINCIPALE ───────────────────────────────────────────────────

const Footer = () => (
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
            Borgo medievale ligure nella Valle del Sansobbia, dove i carruggi si vestono di pannelli
            ceramici, antichi lampadari illuminano gli archivolti e i sentieri nel verde portano fino
            al Bric Genova. Ellera fu fondata nel Medioevo grazie ai monaci benedettini di San
            Quintino di Spigno che ricavarono terre coltivabili e costruirono i primi mulini.
          </p>
        </div>
        <FooterNav />
        <FooterContact />
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

export default Footer;
