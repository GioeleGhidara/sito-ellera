import { useState, useEffect, ForwardedRef, forwardRef, useRef } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const REGOLAMENTO_VERSION = "v1.0";

const getTurnstileToken = () =>
    (document.querySelector(".cf-turnstile input[name='cf-turnstile-response']") as HTMLInputElement | null)?.value ?? "";

export const IscrizioneForm = forwardRef(function IscrizioneForm(props, ref: ForwardedRef<HTMLDivElement>) {
    /* Pacchetto selezionato */
    const [pacchetto, setPacchetto] = useState("Ride + Pranzo (€ 20)");

    /* Promo code */
    const [promoCodeInput, setPromoCodeInput] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
    const [promoError, setPromoError] = useState<string | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);

    const basePrice = pacchetto.includes("20") ? 20 : 12;
    const finalPrice = Math.max(0, basePrice - (appliedPromo?.discount ?? 0));

    /* Form stato */
    const [formData, setFormData] = useState({
        nome_cognome: "", email: "", telefono: "", menu: "Onnivoro (Carne)", note: "",
        privacyRegolamento: false, privacyResponsabilita: false, privacy: false, privacyMedia: false,
    });
    const [formMsg, setFormMsg] = useState<{ text: string; ok: boolean } | null>(null);
    const [stripeLoading, setStripeLoading] = useState(false);
    const [cashLoading, setCashLoading] = useState(false);
    const [formSent, setFormSent] = useState(false);
    const [successModal, setSuccessModal] = useState<string | null>(null);

    // Resetta la promo se l'utente cambia idea sul pacchetto
    useEffect(() => {
        setAppliedPromo(null);
        setPromoCodeInput("");
    }, [pacchetto]);

    const showMenu = pacchetto !== "Solo Ride (€ 12)";

    /* Validazione codice sconto */
    const applyPromo = async (codeOverride?: string | React.MouseEvent) => {
        const code = (typeof codeOverride === "string" ? codeOverride : promoCodeInput).trim().toUpperCase();
        if (!code) return;
        
        setPromoLoading(true);
        setPromoError(null);
        
        try {
            const res = await fetch(`${SUPABASE_URL}/functions/v1/validate-promo`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${SUPABASE_KEY}` 
                },
                body: JSON.stringify({ code })
            });

            const data = await res.json();

            if (!res.ok) {
                // Mostra l'errore che arriva direttamente dalla Edge Function
                setPromoError(data.error || "Codice sconto non valido.");
                return;
            }

            // Se va a buon fine, applica lo sconto
            setAppliedPromo({ code, discount: data.discount_amount });
            setPromoCodeInput("");

        } catch {
            setPromoError("Errore di connessione. Riprova.");
        } finally {
            setPromoLoading(false);
        }
    };

    /* Auto-applica da URL (?promo=SCONTO5) e gestisci redirect Stripe */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const promoFromUrl = params.get("promo");
        if (promoFromUrl) {
            setPromoCodeInput(promoFromUrl.toUpperCase());
            applyPromo(promoFromUrl);
        }
        if (params.get("success") === "stripe") {
            setSuccessModal("✓ Iscrizione confermata e pagamento ricevuto con successo! Ci vediamo al Prato Feste il 14 Giugno!");
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (params.get("canceled") === "stripe") {
            setFormMsg({ text: "Il pagamento è stato annullato. Puoi riprovare quando sei pronto.", ok: false });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    /* Turnstile Explicit Render */
    const turnstileRef = useRef<HTMLDivElement>(null);
    const turnstileWidgetId = useRef<string | undefined>(undefined);
    useEffect(() => {
        let widgetId: string | undefined;
        let interval: ReturnType<typeof setInterval>;

        const renderTurnstile = () => {
            if ((window as any).turnstile && turnstileRef.current) {
                turnstileRef.current.innerHTML = "";
                turnstileWidgetId.current = (window as any).turnstile.render(turnstileRef.current, {
                    sitekey: "0x4AAAAAACzdId3jrskU4ueH",
                    theme: "dark"
                });
                widgetId = turnstileWidgetId.current;
            }
        };

        if ((window as any).turnstile) {
            renderTurnstile();
        } else {
            interval = setInterval(() => {
                if ((window as any).turnstile) {
                    clearInterval(interval);
                    renderTurnstile();
                }
            }, 200);
        }

        return () => {
            if (interval) clearInterval(interval);
            if (widgetId && (window as any).turnstile) {
                (window as any).turnstile.remove(widgetId);
            }
        };
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

    /* Invia iscrizione tramite Edge Function submit-registration */
    const inviaIscrizione = async (pagamento: string) => {
        const token = getTurnstileToken();
        if (!token) throw new Error("Completa la verifica di sicurezza");

        const registrationData = {
            nome_cognome: formData.nome_cognome.trim(),
            email: formData.email.trim().toLowerCase(),
            telefono: formData.telefono.trim() || null,
            pacchetto,
            menu: showMenu ? formData.menu : "Nessun Pranzo",
            note: formData.note.trim() || null,
            codice_promo: appliedPromo?.code ?? null,
            pagamento,
            chk_regolamento: formData.privacyRegolamento,
            chk_responsabilita: formData.privacyResponsabilita,
            chk_privacy: formData.privacy,
            chk_media: formData.privacyMedia,
            regolamento_version: REGOLAMENTO_VERSION,
            timestamp: new Date().toISOString(),
        };

        const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-registration`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${SUPABASE_KEY}` },
            body: JSON.stringify({ token, registrationData }),
        });

        if (res.status === 409) throw new Error("DUPLICATO");
        if (!res.ok) {
            const errData = await res.text();
            throw new Error(`NETWORK_DETAILS: Errore ${res.status} - ${errData}`);
        }
    };

    /* Gestione errori form */
    const handleError = (err: unknown) => {
        const msg = err instanceof Error ? err.message : "";
        if (msg === "DUPLICATO") {
            setFormMsg({ text: "Questa email è già registrata. Hai già inviato la tua iscrizione!", ok: false });
        } else if (msg.startsWith("NETWORK_DETAILS:")) {
            setFormMsg({ text: `Impossibile salvare sul database. Dettagli: ${msg.replace("NETWORK_DETAILS: ", "")}`, ok: false });
        } else {
            setFormMsg({ text: `Ops! Problema di rete o server: ${msg}`, ok: false });
        }

        // Resetta il widget per un nuovo tentativo
        if ((window as any).turnstile && turnstileWidgetId.current !== undefined) {
            (window as any).turnstile.reset(turnstileWidgetId.current);
        }
    };

    /* Handler Stripe */
    const handleStripe = async () => {
        if (!validateForm()) return;
        setFormMsg(null);
        setStripeLoading(true);
        try {
            await inviaIscrizione("stripe_pending");

            const res = await fetch(`${SUPABASE_URL}/functions/v1/create-stripe-checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${SUPABASE_KEY}` },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    nome_cognome: formData.nome_cognome.trim(),
                    pacchetto,
                    amount: finalPrice,
                    return_url: window.location.origin + window.location.pathname,
                }),
            });

            if (!res.ok) throw new Error(`Errore dal server di pagamento: ${await res.text()}`);
            const { url } = await res.json();
            if (!url) throw new Error("URL di checkout non ricevuto");
            window.location.href = url;
        } catch (err) {
            handleError(err);
            setStripeLoading(false);
        }
    };

    /* Handler cash */
    const handleCash = async () => {
        if (!validateForm()) return;
        setFormMsg(null);
        setCashLoading(true);
        try {
            await inviaIscrizione("sul_posto");
            setFormSent(true);
            setSuccessModal("✓ Iscrizione completata! Ci vediamo al Prato Feste il 14 Giugno!");
        } catch (err) {
            handleError(err);
        } finally {
            setCashLoading(false);
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
                <div className={`quota-card base ${pacchetto === "Solo Ride (€ 12)" ? "selected" : ""}`} onClick={() => setPacchetto("Solo Ride (€ 12)")}>
                    <div className="quota-title">
                        <span className="mobile-label">Solo Ride</span>
                        <span className="desktop-label">Solo Ride</span>
                    </div>
                    <div className="quota-price">€ 12</div>
                    <div className="quota-sub">Solo il giro -<br />pranzo non incluso</div>
                </div>

                <div className={`quota-card recommended ${pacchetto === "Ride + Pranzo (€ 20)" ? "selected" : ""}`} onClick={() => setPacchetto("Ride + Pranzo (€ 20)")}>
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

                <div className={`quota-card base ${pacchetto === "Solo Pranzo (€ 12)" ? "selected" : ""}`} onClick={() => setPacchetto("Solo Pranzo (€ 12)")}>
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
                <h3 className="form-title">Modulo di Iscrizione</h3>
                <p className="form-subtitle">
                    Assicurati il tuo posto all'edizione 2026! Compila i dati qui sotto per registrarti.
                </p>

                <div className="form-fieldset">
                    {formSent ? (
                        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--white)" }}>
                            <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", color: "var(--red-warm)" }}>Ci vediamo a Ellera!</h4>
                            <p>La tua iscrizione è stata confermata. Riceverai a breve una mail di riepilogo.</p>
                        </div>
                    ) : (
                        <>
                            <div className="form-row">
                        <div className="flex-col-gap-05">
                            <label className="label-upper form-label" htmlFor="nome_cognome">Nome e Cognome *</label>
                            <input id="nome_cognome" type="text" maxLength={120} autoComplete="name" className="form-input" value={formData.nome_cognome} onChange={e => setFormData(d => ({ ...d, nome_cognome: e.target.value }))} />
                        </div>
                        <div className="flex-col-gap-05">
                            <label className="label-upper form-label" htmlFor="email">Email *</label>
                            <input id="email" type="email" autoComplete="email" className="form-input" value={formData.email} onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="flex-col-gap-05">
                            <label className="label-upper form-label-opt" htmlFor="telefono">Telefono (Opzionale ma utile)</label>
                            <input id="telefono" type="tel" autoComplete="tel" className="form-input" value={formData.telefono} onChange={e => setFormData(d => ({ ...d, telefono: e.target.value }))} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="flex-col-gap-05">
                            <label className="label-upper form-label" htmlFor="pacchetto">Pacchetto Scelto *</label>
                            <select id="pacchetto" className="form-select" value={pacchetto} onChange={e => setPacchetto(e.target.value)}>
                                <option value="Ride + Pranzo (€ 20)">Esperienza Completa (Ride + Pranzo) - € 20</option>
                                <option value="Solo Ride (€ 12)">Solo Ride (senza pranzo) - € 12</option>
                                <option value="Solo Pranzo (€ 12)">Solo Pranzo - € 12</option>
                            </select>
                        </div>
                        {showMenu && (
                            <div className="flex-col-gap-05">
                                <label className="label-upper form-label" htmlFor="menu">Menu Pranzo *</label>
                                <select id="menu" className="form-select" value={formData.menu} onChange={e => setFormData(d => ({ ...d, menu: e.target.value }))}>
                                    <option value="Onnivoro (Carne)">Classico (Onnivoro / Carne)</option>
                                    <option value="Vegetariano">Vegetariano (Pomodoro e Mozzarella)</option>
                                    <option value="Nessun Pranzo">Non Partecipo al Pranzo</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex-col-gap-05">
                        <label className="label-upper form-label-opt" htmlFor="note">Note / Intolleranze (Opzionale)</label>
                        <textarea id="note" rows={3} maxLength={500} className="form-input form-textarea" placeholder="Se hai intolleranze o richieste speciali scrivile qui." value={formData.note} onChange={e => setFormData(d => ({ ...d, note: e.target.value }))} />
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
                            <label htmlFor={c.id} className="form-checkbox-label">{c.label}</label>
                        </div>
                    ))}

                    {/* Codice Promozionale */}
                    <div className="form-promo-container">
                        <label className="label-upper form-promo-label" htmlFor="promo_code">Hai un codice sconto?</label>
                        <div className="form-promo-input-group">
                            <input id="promo_code" type="text" className="form-input form-promo-input" value={promoCodeInput} onChange={e => setPromoCodeInput(e.target.value)} placeholder="INSERISCI CODICE" disabled={!!appliedPromo} />
                            <button type="button" onClick={applyPromo} disabled={!promoCodeInput.trim() || !!appliedPromo || promoLoading} className="form-promo-btn">
                                {promoLoading ? "..." : "APPLICA"}
                            </button>
                        </div>
                        {promoError && <div className="form-promo-error">{promoError}</div>}
                        {appliedPromo && (
                            <div className="form-promo-success">
                                <span>Codice {appliedPromo.code} applicato (-€ {appliedPromo.discount})</span>
                                <button type="button" onClick={() => setAppliedPromo(null)} className="form-promo-remove">Rimuovi</button>
                            </div>
                        )}
                    </div>

                    {/* Turnstile */}
                    <div className="form-turnstile">
                        <div ref={turnstileRef} className="cf-turnstile" />
                    </div>

                    {/* Bottoni pagamento */}
                    <div className="form-submit-container">
                        <h4 className="form-submit-title">Completa l'iscrizione</h4>
                        <div className="form-submit-group">

                            {/* Stripe */}
                            <div className="form-submit-btn-wrap">
                                <button type="button" onClick={handleStripe} disabled={stripeLoading} className="form-submit-btn stripe" style={{ opacity: stripeLoading ? 0.7 : 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                                        <span className="stripe-badge">Stripe</span>
                                        {stripeLoading ? "REINDIRIZZAMENTO IN CORSO..." : `PAGA ORA (€ ${finalPrice})`}
                                    </div>
                                </button>
                            </div>

                            <div className="form-submit-btn-wrap">
                                <div className="form-sep-line" />
                            </div>

                            {/* Cash */}
                            <button type="button" onClick={handleCash} disabled={cashLoading || stripeLoading} className="form-submit-btn cash" style={{ opacity: cashLoading ? 0.7 : 1 }}>
                                {cashLoading ? "ELABORAZIONE IN CORSO..." : `ISCRIVITI E PAGA IN LOCO (€ ${finalPrice})`}
                            </button>
                        </div>
                    </div>

                    {/* Form message */}
                    {formMsg && (
                        <div className={`form-msg-box ${formMsg.ok ? "success" : "error"}`}>
                            {formMsg.text}
                        </div>
                    )}
                        </>
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