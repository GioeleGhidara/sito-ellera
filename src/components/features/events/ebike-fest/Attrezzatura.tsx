export function Attrezzatura() {
    return (
        <section id="ebike-attrezzatura" className="ebike-section">
            <div className="section-tag reveal">Equipaggiamento</div>
            <h2 className="reveal">Cosa<br />portare</h2>
            <div className="gear-grid reveal">
                {[
                    { name: "Casco", note: "Obbligatorio per tutti i percorsi, nessuna eccezione.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z" /><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" /><path d="M4 15v-3a6 6 0 0 1 6-6h0" /><path d="M14 6h0a6 6 0 0 1 6 6v3" /></svg> },
                    { name: "Guanti e protezioni", note: "Fortemente consigliati, per tutti i percorsi.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
                    { name: "Acqua", note: "Il giro dura circa 3 ore e più, idratarsi è fondamentale.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /></svg> },
                    { name: "Snack energetici", note: "Fino al pranzo ci si sostiene con qualcosa in tasca.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
                    { name: "Camera d'aria", note: "Camera di ricambio o kit riparazione. Non si sa mai.", icon: <svg viewBox="0 0 512 512" fill="currentColor" stroke="none"><path d="M180 34.39c-9.2.1-18.2 2.89-26.1 7.41-11.2 6.44-20.6 16.6-24 29.44L24.92 468.6l17.42 4.6L147.3 75.86c1.9-6.99 7.8-14.01 15.6-18.46 7.7-4.45 16.9-6.08 24-4.19l76.2 20.31 14.7 25.1 72.1 19.18L365 60.76l-72.1-19.19-3.2 1.86-22 12.69-76.2-20.29c-3.2-.86-6.5-1.31-9.7-1.42H180zM327 157.5c-88.4 0-160 71.6-160 160 0 88.5 71.6 160.1 160 160.1 88.5 0 160.1-71.6 160.1-160.1 0-88.4-71.6-160-160.1-160zm-.3 74a86.06 86.06 0 0 1 .3 0 86.06 86.06 0 0 1 86.1 86 86.06 86.06 0 0 1-86.1 86.1 86.06 86.06 0 0 1-86-86.1 86.06 86.06 0 0 1 85.7-86z" /></svg> },
                    { name: "Abbigliamento tecnico", note: "A strati.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></svg> },
                    { name: "Occhiali / Mascherina", note: "Utili su sterrato e nei tratti boscosi.", icon: <svg viewBox="0 0 512 512" fill="currentColor" stroke="none"><path d="M256 146.572c-30.972 0-61.944 1.244-92.914 3.703H160c-.032.082-.063.165-.096.246-14.258 1.173-28.514 2.617-42.77 4.31l-1.144-.576c-.127.252-.248.504-.375.756-17.696 2.124-35.39 4.635-53.084 7.562l-5.47.907-1.652 5.29c-.28.9-.546 1.787-.82 2.68H44l-16 63.532h12.73c-3.66 34.972.71 68.132 14.764 108.82l1.28 3.712 3.593 1.584c49.352 21.772 85.914 21.772 135.266 0 22.288-9.833 32.994-28.193 40.834-42.016 3.92-6.912 7.306-12.758 10.426-16.182 3.12-3.424 5.045-4.566 9.107-4.566 4.062 0 5.988 1.142 9.107 4.566 3.12 3.424 6.506 9.27 10.426 16.182 7.84 13.823 18.546 32.183 40.834 42.016 49.352 21.772 85.914 21.772 135.266 0l4.02-1.774 1.074-4.262c10.202-40.51 13.986-73.303 11.363-108.08H484l-16-63.53h-10.732c-.182-.735-.355-1.46-.54-2.198l-1.44-5.72-5.82-.962c-64.476-10.667-128.972-16-193.468-16zm0 17.994c61.532 0 123.064 5.042 184.613 14.91 13.912 57.71 13.82 96.77-.332 154.81-44.11 18.726-71.428 18.292-116.647-1.657-16.75-7.39-24.71-20.793-32.444-34.43-3.868-6.817-7.495-13.626-12.776-19.423-5.28-5.796-13.143-10.443-22.414-10.443-9.27 0-17.133 4.647-22.414 10.443-5.28 5.797-8.908 12.606-12.775 19.424-7.733 13.637-15.694 27.04-32.443 34.43-4.22 1.86-8.285 3.552-12.222 5.075 2.756-60.648 18.325-117.63 41.37-172.47 12.83-.437 25.657-.67 38.485-.67zm-103.186 4.688C132.49 225.61 119.91 285.04 113.457 346.902c-7.824-1.118-15.866-3.12-24.453-6 1.81-59.094 13.318-115.636 38.453-169.074 8.452-.95 16.906-1.81 25.357-2.574zm-46.26 5.11C84.318 225.3 73.588 278.795 71.25 333.905c-19.358-57.964-17.74-96.353-.22-154.38 11.842-1.9 23.683-3.62 35.523-5.163z" /></svg> },
                    { name: "Zaino leggero", note: "Per portare tutto il necessario senza appesantirsi.", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10Z" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" /><path d="M8 10h8" /></svg> },
                ].map((g, i) => (
                    <div className="gear-item ghost-card ghost-card-sm" key={i}>
                        {g.icon !== null && (
                            <div className="ghost-bg">
                                {g.icon}
                            </div>
                        )}
                        <div className="pos-rel-z2">
                            <div className="gear-name">{g.name}</div>
                            <div className="gear-note">{g.note}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SERVIZI IN LOCO */}
            <div className="section-tag reveal" style={{ marginTop: "4rem" }}>Servizi in loco</div>
            <h2 className="reveal" style={{ fontSize: "clamp(1.8rem,4vw,3.5rem)" }}>Cosa offriamo<br />sul posto</h2>
            <div className="include-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginTop: "2.5rem" }}>
                {[
                    { title: "Lavaggio", desc: "Acqua a fine giro", icon: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /> },
                    { title: "Officina", desc: "Attrezzi base", icon: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /> },
                    { title: "Ricarica", desc: "Prese elettriche", icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /> },
                ].map((s, i) => (
                    <div className="ghost-card ghost-card-lg" key={i}>
                        <div className="ghost-bg">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
                        </div>
                        <div className="pos-rel-z2">
                            <div className="include-title">{s.title}</div>
                            <div className="include-desc" style={{ fontSize: ".85rem", color: "var(--grey-lt)", lineHeight: 1.5 }}>{s.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PARCHEGGIO */}
            <div className="reveal" style={{ marginTop: "3rem", border: "1px solid var(--grey)", padding: "clamp(1.2rem,5vw,2.5rem)", background: "var(--black3)", display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "flex-start", justifyContent: "space-between", borderRadius: "1rem" }}>
                <div style={{ flex: 1, minWidth: 250 }}>
                    <div className="section-tag" style={{ marginBottom: ".6rem" }}>Logistica</div>
                    <h2 style={{ fontSize: "clamp(1.8rem,4vw,3.5rem)", marginBottom: ".5rem", lineHeight: 1.1, marginTop: 0 }}>Parcheggio</h2>
                </div>
                <div style={{ flex: 2, minWidth: 300, maxWidth: 700 }}>
                    <p style={{ fontSize: ".95rem", color: "var(--grey-lt)", lineHeight: 1.8, margin: 0 }}>
                        Parcheggio principale al{" "}
                        <a href="https://maps.app.goo.gl/Gpw5GoGWVWiAaKhi8" target="_blank" rel="noopener noreferrer" className="map-link">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            Campo Sportivo
                        </a>{" "}
                        (circa 15 posti auto), a breve distanza dal prato feste.<br /><br />
                        Per chi arriva dopo: parcheggio libero lungo la strada, nel rispetto della viabilità pubblica.<br />
                        <span style={{ color: "rgba(244,237,230,.45)", fontStyle: "italic" }}>La civiltà prima di tutto.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
