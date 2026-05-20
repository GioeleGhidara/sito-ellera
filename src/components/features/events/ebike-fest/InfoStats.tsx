export function InfoStats() {
    return (
        <div id="ebike-info">
            <div className="info-text reveal">
                <div className="section-tag">L'Evento</div>
                <h2>Sentieri,<br />bici e comunità</h2>
                <p><strong>Albi Trail E-Bike Fest</strong> è una giornata dedicata allo sport e alla comunità. Il cuore dell'evento è il ride guidato sui sentieri della <strong>Albi Trail Area</strong>, con gruppi accompagnati per ogni livello.</p>
                <p style={{ marginTop: "1rem" }}>Per chi non pedala o vuole semplicemente unirsi alla festa, l'appuntamento è al prato feste del Comitato per il <strong>pranzo conviviale</strong>: panini, birra e patatine - l'anima della nostra ospitalità.</p>
            </div>
            <div className="info-stats">
                <div className="stat-box reveal">
                    <div className="stat-num">3<span className="stat-unit">h+</span></div>
                    <div className="stat-desc">Durata del giro</div>
                </div>
                <div className="stat-box reveal" style={{ transitionDelay: "0.1s" }}>
                    <div className="stat-num">08<span className="stat-unit">:30</span></div>
                    <div className="stat-desc">Ritrovo al prato feste</div>
                </div>
                <div className="stat-box reveal" style={{ transitionDelay: "0.2s" }}>
                    <div className="stat-num">13<span className="stat-unit">:00</span></div>
                    <div className="stat-desc">Pranzo finale</div>
                </div>
                <div className="stat-box reveal" style={{ transitionDelay: "0.3s" }}>
                    <div className="stat-num" style={{ fontSize: "clamp(1.6rem,3vw,2.8rem)", lineHeight: 1 }}>Medio<br />Esperto</div>
                    <div className="stat-desc">Livello richiesto per partecipare</div>
                </div>
            </div>
        </div>
    );
}
