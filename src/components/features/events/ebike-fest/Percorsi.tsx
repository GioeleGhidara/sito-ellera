export function Percorsi() {
    return (
        <section id="ebike-percorsi" className="ebike-section">
            <div className="section-tag reveal">Trail Area</div>
            <h2 className="reveal">Dove si pedala</h2>
            <div className="percorsi-grid reveal" style={{ gridTemplateColumns: "1fr", marginTop: "2.5rem" }}>
                <a href="/albi-trail-area" className="percorso-card">
                    <div className="percorso-num">★</div>
                    <span className="percorso-tag tag-medium">Livello medio-esperto</span>
                    <div className="percorso-name">Albi Trail Area</div>
                    <p className="percorso-desc">Sentieri tecnici tra single track, radici e cambi di pendenza. Circa 3 ore in sella, in gruppi accompagnati da aprifila e chiudifila.</p>
                    <div style={{ marginTop: "1.5rem", fontFamily: "'Barlow Condensed',sans-serif", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".25em", textTransform: "uppercase", color: "var(--red-warm)", display: "flex", alignItems: "center", gap: ".5rem" }}>
                        Scopri la Trail Area
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                </a>
            </div>
        </section>
    );
}
