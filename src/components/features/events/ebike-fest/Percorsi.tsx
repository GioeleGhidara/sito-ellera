import TrailMap from "../../trail/TrailMap";

export function Percorsi() {
    return (
        <section id="ebike-percorsi" className="ebike-section">
            <div className="section-tag reveal">Trail Area</div>
            <h2 className="reveal">Dove si pedala</h2>
            
            <div className="reveal" style={{ marginTop: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "var(--grey-lt)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                    L'edizione 2026 dell'Albi Trail E-Bike Fest ti porterà a scoprire i sentieri più belli del nostro entroterra. 
                    Nella mappa interattiva qui sotto puoi esplorare l'intera rete sentieristica attualmente manutenuta dal Comitato Ellerese.
                    <strong> I tracciati specifici dell'evento, con le relative varianti e i punti di ristoro, verranno evidenziati a breve!</strong>
                </p>
                
                <div className="dark" style={{ padding: ".5rem", background: "rgba(255,255,255,0.02)", borderRadius: "1.2rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                    {/* Attivando la classe 'dark', il TrailMap utilizzerà i colori del tema scuro di Tailwind (sfondi scuri e testo chiaro), integrandosi perfettamente. */}
                    <TrailMap />
                </div>
            </div>

            <div className="percorsi-grid reveal" style={{ gridTemplateColumns: "1fr" }}>
                <a href="/albi-trail-area" className="percorso-card">
                    <div className="percorso-num">★</div>
                    <span className="percorso-tag tag-medium">Tutti i Livelli</span>
                    <div className="percorso-name">Albi Trail Area</div>
                    <p className="percorso-desc">Scopri nel dettaglio tutti i sentieri tecnici, i single track e le risalite dell'area. Potrai valutare ogni singolo tracciato prima di iscriverti.</p>
                    <div style={{ marginTop: "1.5rem", fontFamily: "'Barlow Condensed',sans-serif", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".25em", textTransform: "uppercase", color: "var(--red-warm)", display: "flex", alignItems: "center", gap: ".5rem" }}>
                        Vai alla pagina Trail Area
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                </a>
            </div>
        </section>
    );
}
