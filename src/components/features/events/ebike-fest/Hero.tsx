function downloadIcs() {
    const sanitize = (s: string) =>
        s.replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
    const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Ellera//IT",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "UID:albi-trail-ebike-fest-2026@ellera.it",
        "DTSTAMP:" + now,
        "DTSTART:20260614T070000Z",
        "DTEND:20260614T130000Z",
        "SUMMARY:" + sanitize("Albi Trail E-Bike Fest 2026"),
        "DESCRIPTION:" + sanitize("Giro in E-Bike e MTB sui sentieri dell'Albi Trail Area, pranzo finale al Prato Feste del Comitato Ellerese. Ritrovo ore 09:00."),
        "LOCATION:" + sanitize("Prato Feste Comitato Ellerese, Ellera (SV)"),
        "STATUS:CONFIRMED",
        "TRANSP:OPAQUE",
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "albi-trail-ebike-fest.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function Hero() {
    return (
        <section id="ebike-hero">
            <div className="hero-bg" />
            <div className="hero-slash" />
            <div className="hero-bg-word">RIDE</div>
            <div className="hero-content">
                <div className="hero-eyebrow">Evento E-Bike - 14 Giugno 2026</div>
                <h1 className="hero-title">
                    Albi Trail<em>E-Bike Fest</em>
                </h1>
                <p className="hero-subtitle">
                    Il giro in bici è il cuore dell'evento. Il pranzo con salsiccia/wurstel, birra e patatine arriva alla fine, al prato feste del Comitato.
                </p>
                <div className="hero-meta">
                    <div className="hero-meta-item">
                        <span className="hero-meta-label">Data</span>
                        <span className="hero-meta-value">DOM 14 GIUGNO 2026</span>
                    </div>
                    <div className="hero-sep" />
                    <div className="hero-meta-item">
                        <span className="hero-meta-label">Ritrovo</span>
                        <span className="hero-meta-value">08:30 - Prato Feste</span>
                    </div>
                    <div className="hero-sep" />
                    <div className="hero-meta-item">
                        <span className="hero-meta-label">Partenza</span>
                        <span className="hero-meta-value">09:00</span>
                    </div>
                    <div className="hero-sep" />
                    <div className="hero-meta-item">
                        <span className="hero-meta-label">Pranzo</span>
                        <span className="hero-meta-value">13:00</span>
                    </div>
                </div>
                <button onClick={downloadIcs} title="Aggiungi al calendario (.ics)" className="cal-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M16 14h-6v6" /><path d="m19 11-9 9" />
                    </svg>
                    <span className="cal-btn-text">Aggiungi al calendario</span>
                </button>
            </div>
            <div className="hero-scroll">
                <span>scroll</span>
                <div className="scroll-line" />
            </div>
        </section>
    );
}
