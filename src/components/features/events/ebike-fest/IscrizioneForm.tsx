import { useState, useEffect, ForwardedRef, forwardRef } from "react";

export const IscrizioneForm = forwardRef(function IscrizioneForm(props, ref: ForwardedRef<HTMLDivElement>) {
    /* Pacchetto selezionato */
    const [pacchetto, setPacchetto] = useState("Ride + Pranzo (€ 20)");

    /* Promo code */
    const [promoCodeInput, setPromoCodeInput] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<{code: string, discount: number} | null>(null);
    const [promoError, setPromoError] = useState<string | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);

    const getBasePrice = () => {
        if (pacchetto.includes("20")) return 20;
        return 12;
    };
    const finalPrice = Math.max(0, getBasePrice() - (appliedPromo ? appliedPromo.discount : 0));

    /* Form stato */
    const [formData, setFormData] = useState({
        nome_cognome: "", email: "", telefono: "", menu: "Onnivoro (Carne)", note: "",
        privacyRegolamento: false, privacyResponsabilita: false, privacy: false, privacyMedia: false,
    });
    const [formMsg, setFormMsg] = useState<{ text: string; ok: boolean } | null>(null);

    /* Success modal */
    const [successModal, setSuccessModal] = useState<string | null>(null);

    /* Pacchetto → menu */
    const showMenu = pacchetto !== "Solo Ride (€ 12)";

    /* Validazione codice sconto */
    const applyPromo = async (codeOverride?: string | React.MouseEvent) => {
        const rawCode = typeof codeOverride === "string" ? codeOverride : promoCodeInput;
        const code = rawCode.trim().toUpperCase();
        if (!code) return;
        setPromoLoading(true);
        setPromoError(null);
        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
            const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
            const res = await fetch(`${supabaseUrl}/rest/v1/promo_codes?code=eq.${code}&is_active=eq.true`, {
                headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` }
            });
            if (!res.ok) throw new Error("Errore di rete");
            const data = await res.json();
            if (data && data.length > 0) {
                const promo = data[0];
                
                // Controllo scadenza
                if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
                    setPromoError("Questo codice sconto è scaduto.");
                    return;
                }

                setAppliedPromo({ code: promo.code, discount: promo.discount_amount });
                setPromoCodeInput("");
                setPromoError(null);
            } else {
                setPromoError("Codice sconto non valido.");
            }
        } catch (e) {
            setPromoError("Errore di connessione. Riprova.");
        } finally {
            setPromoLoading(false);
        }
    };

    /* Auto-applica da URL (?promo=SCONTO5) */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const promoFromUrl = params.get("promo");
        if (promoFromUrl) {
            setPromoCodeInput(promoFromUrl.toUpperCase());
            // Ritardo per assicurarsi che l'ambiente sia pronto (es. Supabase url)
            setTimeout(() => {
                applyPromo(promoFromUrl);
            }, 300);
        }
    }, []);

    /* Validazione */
    const validateForm = () => {
        if (!formData.nome_cognome.trim()) { setFormMsg({ text: "Il campo Nome e Cognome è obbligatorio.", ok: false }); return false; }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setFormMsg({ text: "Inserisci un indirizzo email valido.", ok: false }); return false; }
        if (!formData.privacyRegolamento) { setFormMsg({ text: "Devi accettare il Regolamento dell'evento.", ok: false }); return false; }
        if (!formData.privacyResponsabilita) { setFormMsg({ text: "Devi accettare la dichiarazione di responsabilità.", ok: false }); return false; }
        if (!formData.privacy) { setFormMsg({ text: "Devi accettare l'Informativa Privacy.", ok: false }); return false; }
        return true;
    };

    /* Invia iscrizione a Supabase */
    const inviaIscrizione = async (extra: Record<string, unknown>) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
        const payload = {
            nome_cognome: formData.nome_cognome.trim(),
            email: formData.email.trim().toLowerCase(),
            telefono: formData.telefono.trim() || null,
            pacchetto,
            menu: showMenu ? formData.menu : "Nessun Pranzo",
            note: formData.note.trim() || null,
            codice_sconto_applicato: appliedPromo?.code || null,
            prezzo_finale: finalPrice,
            ...extra,
        };
        const res = await fetch(`${supabaseUrl}/rest/v1/albi_trail_registrations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": supabaseKey,
                "Authorization": `Bearer ${supabaseKey}`,
                "Prefer": "return=minimal",
            },
            body: JSON.stringify(payload),
        });
        if (res.status === 409) throw new Error("DUPLICATO");
        if (!res.ok) {
            const errData = await res.text();
            throw new Error(`NETWORK_DETAILS: Errore ${res.status} - ${errData}`);
        }
    };

    /* Handler cash */
    const handleCash = async () => {
        if (!validateForm()) return;
        setFormMsg(null);
        try {
            await inviaIscrizione({ metodo_pagamento: "sul_posto" });
            setSuccessModal("✓ Iscrizione completata! Ci vediamo al Prato Feste il 14 Giugno!");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "";
            if (msg === "DUPLICATO") {
                setFormMsg({ text: "Questa email è già registrata. Hai già inviato la tua iscrizione!", ok: false });
            } else if (msg.startsWith("NETWORK_DETAILS:")) {
                // Mostriamo a schermo l'errore esatto del database!
                setFormMsg({ text: `Impossibile salvare sul database. Dettagli: ${msg.replace("NETWORK_DETAILS: ", "")}`, ok: false });
            } else {
                setFormMsg({ text: "Ops! Problema di rete. Controlla la connessione e riprova.", ok: false });
            }
        }
    };

    return (
        <section id="ebike-iscrizione">
            <div className="section-tag reveal" style={{ justifyContent: "center" }}>Iscrizioni</div>
            <h2 className="reveal">Le iscrizioni<br />sono<br />aperte</h2>
            <p className="reveal">
                L'iscrizione tramite l'apposito modulo sottostante ti garantisce un posto per l'edizione 2026. Scegli il pacchetto, registrati ora e paga comodamente in contanti o con carta il giorno dell'evento.
            </p>

            {/* QUOTE */}
            <div className="reveal" style={{ maxWidth: 700, margin: "5rem auto 2.5rem", textAlign: "center" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".3em", textTransform: "uppercase", color: "var(--red-warm)", marginBottom: "1rem" }}>Il tuo contributo fa la differenza</div>
                <p style={{ fontSize: "1.05rem", color: "var(--white)", lineHeight: 1.6, fontStyle: "italic", opacity: .9 }}>
                    "Il 100% del ricavato viene reinvestito nel progetto <strong>Albi Trail</strong> per la manutenzione e il miglioramento della rete sentieristica. Partecipando, sostieni direttamente la cura dei nostri sentieri."
                </p>
            </div>

            {/* QUOTE CARDS */}
            <div className="quote-container reveal">
                <div
                    className={`quota-card base ${pacchetto === "Solo Ride (€ 12)" ? "selected" : ""}`}
                    onClick={() => setPacchetto("Solo Ride (€ 12)")}
                >
                    <div className="quota-title">
                        <span className="mobile-label">Solo Ride</span>
                        <span className="desktop-label">Solo Ride</span>
                    </div>
                    <div className="quota-price">€ 12</div>
                    <div className="quota-sub">Solo il giro -<br />pranzo non incluso</div>
                </div>

                <div
                    className={`quota-card recommended ${pacchetto === "Ride + Pranzo (€ 20)" ? "selected" : ""}`}
                    onClick={() => setPacchetto("Ride + Pranzo (€ 20)")}
                >
                    <div className="quota-badge-top" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--black)" }}>
                            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                        </svg>
                        Best Value
                    </div>
                    <div className="quota-title">
                        <span className="mobile-label">Ride+Pranzo</span>
                        <span className="desktop-label">Esperienza Completa</span>
                    </div>
                    <div className="quota-price">€ 20</div>
                    <div className="quota-sub" style={{ color: "var(--white)" }}>Ride + Menù completo (Panino, patatine e birra/acqua)</div>
                </div>

                <div
                    className={`quota-card base ${pacchetto === "Solo Pranzo (€ 12)" ? "selected" : ""}`}
                    onClick={() => setPacchetto("Solo Pranzo (€ 12)")}
                >
                    <div className="quota-title">
                        <span className="mobile-label">Solo Pranzo</span>
                        <span className="desktop-label">Solo Pranzo</span>
                    </div>
                    <div className="quota-price">€ 12</div>
                    <div className="quota-sub">Menù completo (Panino, patatine e birra/acqua).</div>
                </div>
            </div>

            {/* FORM */}
            <div id="form-iscrizione-container" className="reveal" ref={ref}>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.8rem", color: "var(--white)", marginBottom: ".5rem", lineHeight: 1 }}>Modulo di Iscrizione</h3>
                <p style={{ color: "var(--red-warm)", fontSize: "1.05rem", marginBottom: "2.5rem", lineHeight: 1.6, fontWeight: 600 }}>
                    Assicurati il tuo posto all'edizione 2026! Compila i dati qui sotto per registrarti.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1.5rem" }}>
                        <div className="flex-col-gap-05">
                            <label className="label-upper" htmlFor="nome_cognome" style={{ color: "var(--white)" }}>Nome e Cognome *</label>
                            <input id="nome_cognome" type="text" maxLength={120} autoComplete="name" className="form-input" value={formData.nome_cognome} onChange={e => setFormData(d => ({ ...d, nome_cognome: e.target.value }))} />
                        </div>
                        <div className="flex-col-gap-05">
                            <label className="label-upper" htmlFor="email" style={{ color: "var(--white)" }}>Email *</label>
                            <input id="email" type="email" autoComplete="email" className="form-input" value={formData.email} onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1.5rem" }}>
                        <div className="flex-col-gap-05">
                            <label className="label-upper" htmlFor="telefono" style={{ color: "rgba(244,237,230,.85)" }}>Telefono (Opzionale ma utile)</label>
                            <input id="telefono" type="tel" autoComplete="tel" className="form-input" value={formData.telefono} onChange={e => setFormData(d => ({ ...d, telefono: e.target.value }))} />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1.5rem" }}>
                        <div className="flex-col-gap-05">
                            <label className="label-upper" htmlFor="pacchetto" style={{ color: "var(--white)" }}>Pacchetto Scelto *</label>
                            <select id="pacchetto" className="form-select" value={pacchetto} onChange={e => setPacchetto(e.target.value)}>
                                <option value="Ride + Pranzo (€ 20)">Esperienza Completa (Ride + Pranzo) - € 20</option>
                                <option value="Solo Ride (€ 12)">Solo Ride (senza pranzo) - € 12</option>
                                <option value="Solo Pranzo (€ 12)">Solo Pranzo - € 12</option>
                            </select>
                        </div>
                        {showMenu && (
                            <div className="flex-col-gap-05">
                                <label className="label-upper" htmlFor="menu" style={{ color: "var(--white)" }}>Menu Pranzo *</label>
                                <select id="menu" className="form-select" value={formData.menu} onChange={e => setFormData(d => ({ ...d, menu: e.target.value }))}>
                                    <option value="Onnivoro (Carne)">Classico (Onnivoro / Carne)</option>
                                    <option value="Vegetariano">Vegetariano (Pomodoro e Mozzarella)</option>
                                    <option value="Nessun Pranzo">Non Partecipo al Pranzo</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex-col-gap-05">
                        <label className="label-upper" htmlFor="note" style={{ color: "rgba(244,237,230,.85)" }}>Note / Intolleranze (Opzionale)</label>
                        <textarea id="note" rows={3} maxLength={500} className="form-input" style={{ resize: "vertical" }} placeholder="Se hai intolleranze o richieste speciali scrivile qui." value={formData.note} onChange={e => setFormData(d => ({ ...d, note: e.target.value }))} />
                    </div>

                    {/* Honeypot */}
                    <div style={{ display: "none" }} aria-hidden="true"><input type="text" id="hp_field" name="hp_field" tabIndex={-1} autoComplete="off" /></div>

                    {/* Privacy checkboxes */}
                    {[
                        { id: "privacy-regolamento", key: "privacyRegolamento", label: <>Dichiaro di aver letto e accettato il <a href="/regolamento" target="_blank" rel="noopener noreferrer" style={{ color: "var(--red-warm)", textDecoration: "underline" }}>Regolamento dell'evento</a>.</> },
                        { id: "privacy-responsabilita", key: "privacyResponsabilita", label: "Dichiaro di partecipare volontariamente, sotto la mia responsabilità, di essere in condizioni psicofisiche idonee per l'attività sportiva e di essere consapevole dei rischi outdoor." },
                        { id: "privacy", key: "privacy", label: <>Ho letto l'<a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--red-warm)", textDecoration: "underline" }}>Informativa Privacy</a> e acconsento al trattamento dei dati personali.</> },
                        { id: "privacy-media", key: "privacyMedia", label: "Autorizzo l'utilizzo gratuito di immagini e video che mi ritraggono per scopi promozionali dell'evento." },
                    ].map((c) => (
                        <div key={c.id} className="flex-row-gap-08-mt">
                            <input type="checkbox" id={c.id} className="checkbox-red"
                                checked={formData[c.key as keyof typeof formData] as boolean}
                                onChange={e => setFormData(d => ({ ...d, [c.key]: e.target.checked }))} />
                            <label htmlFor={c.id} style={{ fontSize: ".82rem", color: "rgba(244,237,230,.85)", lineHeight: 1.5 }}>{c.label}</label>
                        </div>
                    ))}

                    {/* Codice Promozionale */}
                    <div style={{ marginTop: "1.5rem", padding: "1.2rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <label className="label-upper" htmlFor="promo_code" style={{ color: "rgba(244,237,230,.85)", marginBottom: "0.5rem", display: "block" }}>Hai un codice sconto?</label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input id="promo_code" type="text" className="form-input" style={{ textTransform: "uppercase" }} value={promoCodeInput} onChange={e => setPromoCodeInput(e.target.value)} placeholder="INSERISCI CODICE" disabled={!!appliedPromo} />
                            <button type="button" onClick={applyPromo} disabled={!promoCodeInput.trim() || !!appliedPromo || promoLoading} style={{ background: "var(--red-warm)", color: "white", border: "none", padding: "0 1.5rem", fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em", cursor: "pointer", opacity: (!promoCodeInput.trim() || !!appliedPromo || promoLoading) ? 0.5 : 1 }}>
                                {promoLoading ? "..." : "APPLICA"}
                            </button>
                        </div>
                        {promoError && <div style={{ color: "var(--red-hot)", fontSize: "0.85rem", marginTop: "0.5rem", fontWeight: 600 }}>{promoError}</div>}
                        {appliedPromo && (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.8rem", padding: "0.6rem 0.8rem", background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.3)", color: "#10b981", fontSize: "0.95rem", fontWeight: 600 }}>
                                <span>Codice {appliedPromo.code} applicato (-€ {appliedPromo.discount})</span>
                                <button type="button" onClick={() => setAppliedPromo(null)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", textDecoration: "underline", fontSize: "0.85rem", opacity: .7 }}>Rimuovi</button>
                            </div>
                        )}
                    </div>

                    {/* Turnstile */}
                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                        <div className="cf-turnstile" data-sitekey="0x4AAAAAACzdId3jrskU4ueH" data-theme="dark" />
                    </div>

                    {/* Bottoni pagamento */}
                    <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: "1.2rem" }}>
                        <h4 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--white)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "1.5rem", textAlign: "center" }}>Completa l'iscrizione</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", alignItems: "center" }}>

                            {/* PayPal */}
                            <div style={{ width: "100%", maxWidth: 400 }}>
                                <button type="button" disabled style={{ width: "100%", fontFamily: "'Barlow Condensed',sans-serif", fontSize: ".9rem", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", background: "#ffc439", color: "rgba(0,0,0,.5)", border: "none", padding: "1.1rem", cursor: "not-allowed", clipPath: "polygon(0 0,calc(100% - 10px) 0,100% 100%,10px 100%)", opacity: .6 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.067 8.478c.492.26.85.57.94 1.02.4 1.99-1.07 3.14-3.1 3.14h-1.85c-.44 0-.81.31-.89.73l-1.12 5.75c-.05.24-.26.42-.51.42H9.36c-.34 0-.59-.32-.51-.65l2.25-11.45c.08-.42.45-.73.89-.73h4.35c1.84 0 3.16.48 3.72 1.77z" /><path d="M16.93 6.94c.4 1.99-1.07 3.14-3.1 3.14h-1.85c-.44 0-.81.31-.89.73l-1.12 5.75c-.05.24-.26.42-.51.42H5.22c-.34 0-.59-.32-.51-.65l2.25-11.45c.08-.42.45-.73.89-.73h4.35c1.84 0 3.16.48 3.72 1.77z" opacity=".6" /></svg>
                                        PAGAMENTI PAYPAL DISABILITATI
                                    </div>
                                </button>
                            </div>

                            {/* Separatore */}
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%", maxWidth: 400 }}>
                                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.08)" }} />
                                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: ".65rem", color: "rgba(255,255,255,.3)", letterSpacing: ".15em" }}>OPPURE</span>
                                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.08)" }} />
                            </div>

                            {/* Stripe */}
                            <div style={{ width: "100%", maxWidth: 400 }}>
                                <button type="button" disabled style={{ marginTop: ".4rem", width: "100%", fontFamily: "'Barlow Condensed',sans-serif", fontSize: ".9rem", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", background: "#3a3632", color: "rgba(255,255,255,.4)", border: "none", padding: "1.1rem", cursor: "not-allowed", clipPath: "polygon(0 0,calc(100% - 10px) 0,100% 100%,10px 100%)" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                                        <span style={{ fontWeight: 700, letterSpacing: ".1em", border: "1px solid rgba(255,255,255,.2)", padding: "2px 8px", borderRadius: 4, fontFamily: "'Barlow',sans-serif", fontSize: ".75rem" }}>Stripe</span>
                                        MOMENTANEAMENTE FUORI SERVIZIO
                                    </div>
                                </button>
                            </div>

                            <div style={{ width: "100%", maxWidth: 400 }}>
                                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.08)" }} />
                            </div>

                            {/* Cash */}
                            <button type="button" onClick={handleCash}
                                style={{ width: "100%", maxWidth: 400, fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1rem", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", background: "var(--red-warm)", color: "var(--white)", border: "none", padding: "1.1rem", cursor: "pointer", clipPath: "polygon(0 0,calc(100% - 10px) 0,100% 100%,10px 100%)", transition: "all .2s" }}>
                                ISCRIVITI E PAGA IN LOCO (€ {finalPrice})
                            </button>
                        </div>
                    </div>

                    {/* Form message */}
                    {formMsg && (
                        <div style={{ display: "block", padding: "1.2rem", fontSize: ".95rem", fontWeight: 500, textAlign: "center", borderLeft: `4px solid ${formMsg.ok ? "#10b981" : "var(--red-hot)"}`, marginTop: ".5rem", background: "rgba(255,255,255,.02)", color: formMsg.ok ? "#10b981" : "var(--red-warm)" }}>
                            {formMsg.text}
                        </div>
                    )}
                </div>
            </div>

            {/* ── SUCCESS MODAL ── */}
            {successModal && (
                <div style={{ display: "flex", position: "fixed", inset: 0, zIndex: 20000, alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
                    <div style={{ position: "absolute", inset: 0, background: "rgba(9,8,7,.88)", backdropFilter: "blur(6px)" }} onClick={() => setSuccessModal(null)} />
                    <div style={{ position: "relative", background: "var(--black3)", border: "1px solid rgba(255,255,255,.08)", maxWidth: 480, width: "100%", padding: "2.5rem 2rem", textAlign: "center" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,.12)", border: "2px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", letterSpacing: ".08em", color: "var(--white)", marginBottom: ".8rem" }}>Iscrizione Confermata</div>
                        <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: ".95rem", fontWeight: 300, color: "var(--sand)", lineHeight: 1.6, marginBottom: "2rem" }}>{successModal}</div>
                        <button onClick={() => setSuccessModal(null)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: ".85rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", background: "var(--red-warm)", color: "var(--white)", border: "none", padding: ".9rem 2.5rem", cursor: "pointer", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 100%,8px 100%)" }}>Chiudi</button>
                    </div>
                </div>
            )}
        </section>
    );
});
