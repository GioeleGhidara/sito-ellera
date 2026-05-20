export function Footer() {
    return (
        <footer className="ebike-footer">
            <div className="footer-logo">Albi Trail <span>E-Bike Fest</span></div>
            <div className="footer-copy">© 2026 - Domenica 14 Giugno - Ellera</div>
            <div className="footer-org">Organizzato da Albi Trail per il Comitato Ellerese</div>
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", opacity: .5, marginTop: ".3rem" }}>
                <img src="/loghi/albi-trail-area.svg" alt="Albi Trail Area" style={{ width: 28, height: 28, objectFit: "contain" }} />
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: ".7rem", letterSpacing: ".15em", textTransform: "uppercase" }}>Albi Trail Area</span>
            </div>
        </footer>
    );
}
