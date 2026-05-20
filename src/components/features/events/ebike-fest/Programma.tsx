export function Programma() {
    return (
        <section id="ebike-programma" className="ebike-section" style={{ paddingBottom: 0 }}>
            <div className="section-tag reveal">La giornata</div>
            <h2 className="reveal">Programma</h2>
            <div className="schedule-list reveal">
                {[
                    { time: "08:30", name: "Ritrovo e accoglienza", detail: "Raduno al prato feste del Comitato Ellerese, registrazioni e creazione gruppi", note: "Il rispetto degli orari migliora la giornata per tutti." },
                    { time: "09:00", name: "Briefing e partenza", detail: "Formazione dei gruppi e partenza del giro in bici sui sentieri dell'Albi Trail Area" },
                    { time: "09:00–12:00", name: "Ride accompagnato", detail: "Ci si divide in gruppi per migliorare l'esperienza di ognuno. Ogni gruppo ha il suo aprifila e chiudifila per tutta la durata del giro." },
                    { time: "12:30", name: "Rientro al prato feste", detail: "Chiusura del giro e ritrovo al punto di partenza" },
                ].map((r, i) => (
                    <div className="schedule-row" key={i}>
                        <span className="sch-time">{r.time}</span>
                        <div className="sch-body">
                            <div className="sch-name">{r.name}</div>
                            <div className="sch-detail">{r.detail}</div>
                            {r.note && <div className="sch-detail" style={{ marginTop: ".4rem", fontStyle: "italic", color: "rgba(133,124,116,.7)" }}>{r.note}</div>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pranzo band */}
            <div className="pasta-band" style={{ margin: "0 -3rem", flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className="pasta-band-time" style={{ marginLeft: 0, fontSize: "clamp(2.5rem,6vw,4.5rem)" }}>13:00</div>
                    <div className="pasta-band-label">Pranzo<span><br />Finale</span></div>
                </div>
                <div className="pasta-band-text">
                    Panino con salsiccia/wurstel, birra o acqua, patatine fritte.<br />
                    <span style={{ color: "rgba(244,237,230,.5)", display: "inline-flex", alignItems: "center", gap: ".35rem" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M16 8q6 0 6-6-6 0-6 6" /><path d="M17.41 3.59a10 10 0 1 0 3 3" /><path d="M2 2a26.6 26.6 0 0 1 10 20c.9-6.82 1.5-9.5 4-14" /></svg>
                        Opzione vegetariana (panino pomodoro e mozzarella) disponibile.
                    </span>
                    <br />
                    <a href="https://maps.app.goo.gl/daTftdCTx3aPvrmQ9" target="_blank" rel="noopener noreferrer" className="map-link" style={{ color: "rgba(244,237,230,.7)" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        Prato Feste del Comitato Ellerese, Ellera
                    </a>
                </div>
            </div>

            <div className="schedule-list" style={{ marginTop: 0 }}>
                <div className="schedule-row">
                    <span className="sch-time">Pomeriggio</span>
                    <div className="sch-body">
                        <div className="sch-name">Relax e convivialità</div>
                        <div className="sch-detail">Incontro tra rider, giornata conviviale nel verde di Ellera</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
