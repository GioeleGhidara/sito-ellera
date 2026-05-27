import { EventMap } from "./EventMap";

const eventTracks = [
    {
        name: "Anello 1",
        gpxUrl: "/tracks/event-tracks/anello-1-14-giugno.gpx",
        color: "#E11D48",
    },
    {
        name: "Anello 2",
        gpxUrl: "/tracks/event-tracks/anello-2-14-giugno.gpx",
        color: "#2563EB",
    }
];

export function Percorsi() {
    return (
        <section id="ebike-percorsi" className="ebike-section">
            <div className="section-tag reveal">I Percorsi dell'Evento</div>
            <h2 className="reveal">Due anelli a formare un 8</h2>

            <div className="reveal" style={{ marginTop: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "var(--grey-lt)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                    Per l'edizione del 14 Giugno abbiamo preparato <strong>due anelli</strong> che insieme formano un perfetto "8".
                    In caso di molta affluenza, i partecipanti verranno divisi in due gruppi, uno per ogni anello.
                    Il <strong>Prato Feste</strong> si trova esattamente al centro dell'8 e fungerà da punto di giunzione:
                    chi lo desidera potrà fermarsi dopo il primo anello, mentre chi ha ancora energie potrà continuare la giornata pedalando anche il secondo anello!
                </p>

                <div className="dark" style={{ padding: ".5rem", background: "rgba(255,255,255,0.02)", borderRadius: "1.2rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <EventMap tracks={eventTracks} />
                </div>
            </div>

            <div className="percorsi-grid reveal" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                <div className="percorso-card">
                    <div className="percorso-num" style={{ color: "#E11D48" }}>1</div>
                    <div className="percorso-name">Anello 1</div>
                    <p className="percorso-desc">Questo anello inizia con circa 6 km di comoda sterrata sulla salita "Access to trails (Cerce)". Guadagnata la quota, ci tufferemo lungo il Sentiero di Schiena per affrontare la discesa "Beià": 2 km di fantastico singletrack panoramico, ideale per divertirsi in sella.</p>
                </div>

                <div className="percorso-card">
                    <div className="percorso-num" style={{ color: "#2563EB" }}>2</div>
                    <div className="percorso-name">Anello 2</div>
                    <p className="percorso-desc">Si parte guadagnando quota sulla salita "To Ellera Trails", per poi buttarsi a capofitto nella discesa dello "Scarsellun" fino alla località "Seià". Da qui riprenderemo a salire lungo il "Rio Buraxe" oltrepassando Bric Genova; per concludere in bellezza devieremo a destra affrontando la discesa "Caeffo" e inaugurando in anteprima il suo nuovissimo tratto finale!</p>
                </div>
            </div>

            <div className="reveal" style={{ marginTop: "2rem", textAlign: "center" }}>
                <a href="/albi-trail-area" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.9rem", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--red-warm)", borderBottom: "1px solid var(--red-warm)", paddingBottom: "2px", textDecoration: "none" }}>
                    Scopri di più sull'Albi Trail Area
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
            </div>
        </section>
    );
}
