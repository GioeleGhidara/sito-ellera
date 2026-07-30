import LanternRail from "../ui/LanternRail";
import { Mail, Facebook, Instagram } from "@/lib/icons";
import { logoComitato, comuneAlbisolaSupLogoSvg } from "@/assets/images";

const EMAIL = [
  { label: "info@ellera.it", href: "mailto:info@ellera.it" },
  { label: "comitatoellera@gmail.com", href: "mailto:comitatoellera@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="cel-footer" role="contentinfo">
      <LanternRail count={5} />

      <p className="cel-footer-signature">
        Si accendono le lanterne,
        <br />
        si apre il vino, si vive il borgo.
      </p>

      <div className="cel-footer-rule" />

      <div className="cel-footer-orgs">
        <div className="cel-footer-org">
          <img src={logoComitato} alt="Comitato Ellerese" className="cel-footer-logo" loading="lazy" />
          <span>Comitato Ellerese</span>
        </div>
        <div className="cel-footer-org">
          <img src={comuneAlbisolaSupLogoSvg} alt="Comune di Albisola Superiore" className="cel-footer-logo" loading="lazy" />
          <span>Con il patrocinio di Albisola Superiore</span>
        </div>
      </div>

      <div className="cel-footer-contacts">
        <div className="cel-footer-contact-col">
          <Mail size={20} aria-hidden="true" />
          <div className="cel-footer-contact-email-list">
            {EMAIL.map(({ label, href }) => (
              <a key={label} href={href}>{label}</a>
            ))}
          </div>
        </div>

        <a
          href="https://www.instagram.com/comitatoellerese"
          target="_blank"
          rel="noopener noreferrer"
          className="cel-footer-contact-col"
          aria-label="Instagram"
        >
          <Instagram size={20} aria-hidden="true" />
        </a>

        <a
          href="https://www.facebook.com/profile.php?id=61578504275210#"
          target="_blank"
          rel="noopener noreferrer"
          className="cel-footer-contact-col"
          aria-label="Facebook"
        >
          <Facebook size={20} aria-hidden="true" />
        </a>
      </div>

      <a href="/eventi" className="cel-btn" aria-label="Scopri gli altri eventi">
        Scopri gli altri eventi
      </a>

      <small>Caruggi &amp; Lanterne · 21–22 Agosto · Ellera</small>
    </footer>
  );
}
