import { comuneAlbisolaSupLogoSvg } from "@/assets/images";

export function Footer() {
    return (
        <footer className="ebike-footer">
            <div className="footer-logo">Albi Trail <span>E-Bike Fest</span></div>
            <div className="footer-copy">© 2026 - Domenica 14 Giugno - Ellera</div>
            <div className="footer-org">Organizzato da Albi Trail per il Comitato Ellerese</div>
            
            {/* Loghi Footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                
                {/* Patrocinio */}
                <div style={{ display: "flex", alignItems: "center", gap: ".8rem", opacity: .8 }}>
                    <img src={comuneAlbisolaSupLogoSvg} alt="Comune di Albisola Superiore" style={{ width: 36, height: "auto", objectFit: "contain" }} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.1rem" }}>
                        <span style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.7 }}>Con il patrocinio di</span>
                        <strong style={{ fontSize: "0.8rem", letterSpacing: "0.05em", color: "var(--white)" }}>Albisola Superiore</strong>
                    </div>
                </div>

                {/* Albi Trail Area */}
                <div style={{ display: "flex", alignItems: "center", gap: ".6rem", opacity: .8 }}>
                    <img src="/loghi/albi-trail-area.svg" alt="Albi Trail Area" style={{ width: 36, height: 36, objectFit: "contain" }} />
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: ".8rem", letterSpacing: ".15em", textTransform: "uppercase" }}>Albi Trail Area</span>
                </div>

            </div>
        </footer>
    );
}
