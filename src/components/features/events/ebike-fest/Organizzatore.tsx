export function Organizzatore() {
    return (
        <section id="ebike-organizzatore" className="ebike-section">
            <div className="section-tag reveal">Chi organizza</div>
            <h2 className="reveal">Due realtà,<br />un evento</h2>
            <p className="reveal" style={{ color: "var(--grey-lt)", marginTop: "1rem", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.05rem", maxWidth: 560, lineHeight: 1.7 }}>
                <strong style={{ color: "var(--white)" }}>Albi Trail Area</strong> è la sezione ciclistica del <strong style={{ color: "var(--white)" }}>Comitato Ellerese</strong> - stessa radice, stesso territorio, missioni complementari.
            </p>
            <div className="org-box reveal">
                {/* Albi Trail */}
                <div className="org-left">
                    <div>
                        <div className="org-logo-placeholder"><img src="/loghi/albi-trail-area.svg" alt="Logo Albi Trail Area" /></div>
                        <div className="org-name" style={{ marginTop: "1.5rem" }}>Albi Trail</div>
                        <div className="org-role">Sezione ciclistica - Organizzazione ride</div>
                    </div>
                    <p style={{ fontSize: ".82rem", color: "var(--grey-lt)", lineHeight: 1.7, marginTop: "1.5rem" }}>La sezione dedicata alla mountain bike del Comitato Ellerese. Gestisce e promuove la trail area, compone i gruppi, coordina aprifila e chiudifila e si prende cura di ogni aspetto tecnico del ride.</p>
                </div>
                {/* Comitato Ellerese */}
                <div className="org-left" style={{ borderRight: "none", position: "relative", overflow: "hidden", background: "rgba(0,0,0,.15)" }}>
                    <div style={{ pointerEvents: "none", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                        <img src="/loghi/logo_comitato.svg" alt="" style={{ position: "absolute", top: "4.5rem", left: "-1.5rem", width: 180, height: 180, opacity: .04, filter: "grayscale(100%) contrast(200%)" }} />
                    </div>
                    <div style={{ position: "relative", zIndex: 2 }}>
                        <div className="org-name" style={{ marginTop: "1.5rem", color: "rgba(244,237,230,.6)", fontSize: "1.3rem" }}>Comitato Ellerese</div>
                        <div className="org-role" style={{ color: "var(--red-warm)", opacity: .8 }}>Organizzazione - Accoglienza e pranzo</div>
                    </div>
                    <p style={{ position: "relative", zIndex: 2, fontSize: ".82rem", color: "rgba(244,237,230,.45)", lineHeight: 1.7, marginTop: "1.5rem" }}>L'associazione di comunità che da anni anima Ellera. Cura l'accoglienza al prato feste, il pranzo finale e tutto il lato conviviale della giornata. Perché ogni evento diventi un momento di comunità.</p>
                </div>
            </div>
        </section>
    );
}
