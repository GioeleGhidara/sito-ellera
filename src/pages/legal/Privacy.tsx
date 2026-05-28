import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCursorDot } from "@/hooks/useCursorDot";
import "./EbikeLegal.css";

export default function Privacy() {
  const dotRef = useCursorDot();

  return (
    <>
      <Helmet>
        <title>Informativa Privacy - Albi Trail E-Bike Fest</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="ebike-legal-page">
        <div className="ebike-legal-cursor-dot" ref={dotRef} />

        <nav className="ebike-legal-nav">
          <Link to="/albi-trail-ebike-fest" className="ebike-legal-nav-logo">
            <div className="ebike-legal-nav-logo-dot"></div>
            Albi Trail<span className="ebike-legal-nav-accent">E-Bike&nbsp;Fest</span>
          </Link>
        </nav>

        <main className="ebike-legal-main">
          <div className="section-tag">GDPR Compliant</div>
          <h1>Informativa sulla<br />Privacy</h1>

          <p>
            Ai sensi dell'<strong>art. 13 del Regolamento UE n. 2016/679</strong> (General Data Protection Regulation - GDPR), 
            questa informativa descrive le modalità con cui il <strong>Comitato Ellerese</strong> tratta i dati personali 
            raccolti tramite il sito web e i moduli di iscrizione relativi all'evento <strong>Albi Trail E-Bike Fest</strong>. 
            Per una comprensione completa delle vostre responsabilità e diritti, si consiglia di leggere anche il <Link to="/regolamento"><strong>Regolamento Generale Eventi</strong></Link>.
          </p>

          <h2>1. Titolare del Trattamento</h2>
          <p>
            Il Titolare del trattamento è il <strong>Comitato Ellerese</strong>, con sede legale in Ellera, Albisola
            Superiore (SV), nella persona del suo legale rappresentante pro tempore.
          </p>
          <p>
            Per qualsiasi richiesta o chiarimento, è possibile contattare il Titolare via email all'indirizzo: <a href="mailto:info@ellera.it">info@ellera.it</a>.
          </p>

          <h2>2. Oggetto del Trattamento</h2>
          <p>
            Il Titolare tratta i dati personali identificativi (nome, cognome, indirizzo email, telefono) volontariamente
            forniti in fase di pre-registrazione. Ai fini della validità legale e del log di consenso (Art. 7 GDPR), il
            sistema acquisisce e conserva l'<strong>Indirizzo IP</strong>, l'<strong>User Agent</strong> del browser e il
            <strong>timestamp</strong> esatto dell'iscrizione.
          </p>
          <p>
            Inoltre, per la partecipazione all'attività e al pranzo, il Titolare tratta esclusivamente i dati identificativi,
            la dichiarazione soggettiva di idoneità fisica all'attività resa dall'interessato in fase di iscrizione, e i dati
            particolari (Art. 9 GDPR) relativi ad eventuali allergie o intolleranze alimentari segnalate volontariamente nel
            modulo per la gestione del catering.
          </p>

          <h2>3. Finalità e Base Giuridica</h2>
          <p>
            Il trattamento avviene sulla base degli <strong>Articoli 6.1.a (Consenso), 6.1.b (Esecuzione
            contrattuale/servizio) e 6.1.c (Obbligo legale)</strong> per le seguenti finalità:
          </p>
          <ul>
            <li>Gestione dell'iscrizione e partecipazione all'evento;</li>
            <li>Adempimenti connessi alla copertura assicurativa RC dell'organizzazione;</li>
            <li>Assolvimento di obblighi di legge, regolamento o norme di pubblica sicurezza;</li>
            <li>Invio di comunicazioni logistiche urgenti e di servizio relative all'evento.</li>
          </ul>

          <h2>4. Trattamento di Immagini e Video (Liberatoria)</h2>
          <p>
            Durante lo svolgimento dell'evento potranno essere acquisite immagini o riprese audio-video che La ritraggono. Ai
            sensi del consenso libero e distinto prestato nel modulo di iscrizione (Art. 7 GDPR), il Titolare utilizzerà tali
            materiali per <strong>finalità documentali, storiche e di promozione</strong> sui propri canali digitali e social,
            nel rispetto del decoro e della dignità dell'interessato.
          </p>

          <h2>5. Modalità del Trattamento e Conservazione</h2>
          <p>
            Il trattamento sarà effettuato sia con strumenti manuali che informatici, garantendo standard elevati di
            integrità e riservatezza. I dati generali e i log di consenso saranno conservati per i tempi previsti dalle
            normative di prescrizione legale (10 anni per le finalità di tutela legale in caso di sinistri o responsabilità civile).
          </p>
          <p>
            I <strong>dati particolari relativi alla salute</strong> (allergie e intolleranze alimentari) saranno conservati
            unicamente per il tempo strettamente necessario alla gestione logistica e al catering, e <strong>verranno
            definitivamente cancellati e distrutti entro 48 ore dalla conclusione dell'evento</strong>.
          </p>

          <h2>6. Destinatari dei Dati</h2>
          <p>
            I dati di iscrizione vengono registrati su Supabase (database cloud con server in area UE, in qualità di Data Processor 
            con Data Processing Agreement sottoscritto) e su Google Sheets (accessibile ai soli organizzatori dell'evento, con 
            accesso strettamente limitato ai coordinatori autorizzati). I dati potranno inoltre essere comunicati a soggetti terzi
            esclusivamente per l'erogazione del servizio (es. compagnie di assicurazione per la polizza RC
            dell'organizzazione, organi di vigilanza e soccorso, autorità giudiziarie in caso di sinistri).
          </p>
          <p>
            I versamenti dei contributi di partecipazione avvengono in modo sicuro tramite gateway di pagamento esterni
            (<strong>Stripe</strong> e <strong>PayPal</strong>). Tali società elaborano i dati delle transazioni finanziarie
            in qualità di autonomi Titolari del Trattamento in base alle proprie privacy policy. Non è prevista la diffusione
            dei dati a fini commerciali verso terzi senza esplicito consenso.
          </p>

          <h2>7. Diritti dell'Interessato</h2>
          <p>
            Nella Sua qualità di interessato, Lei gode dei diritti sanciti dagli <strong>Artt. 15, 16, 17, 18, 20 e 21 del GDPR</strong>:
          </p>
          <ul>
            <li><strong>Diritto di accesso:</strong> per conoscere quali dati stiamo trattando;</li>
            <li><strong>Diritto di rettifica:</strong> per correggere dati inesatti o incompleti;</li>
            <li><strong>Diritto alla cancellazione (oblio):</strong> sussistendone i presupposti legali;</li>
            <li><strong>Diritto alla limitazione e opposizione:</strong> per limitare il trattamento per motivi legittimi;</li>
            <li><strong>Diritto alla portabilità:</strong> per ricevere i dati in formato strutturato.</li>
          </ul>
          <p>Lei ha inoltre il diritto di revocare il consenso in qualsiasi momento (Art. 7.3 GDPR).</p>

          <h2>8. Reclami all'Autorità Garante</h2>
          <p>
            Qualora ritenga che il trattamento dei Suoi dati personali non avvenga in conformità alle normative sulla protezione 
            dei dati, ha il diritto di proporre reclamo all'<strong>Autorità Garante per la Protezione dei Dati Personali</strong>.
          </p>
          <p>
            Autorità Garante per la Protezione dei Dati Personali<br />
            Sito web: <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a><br />
            PEC: <a href="mailto:protocollo@pec.gpdp.it">protocollo@pec.gpdp.it</a>
          </p>

          <Link to="/albi-trail-ebike-fest" className="ebike-legal-back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(180deg)" }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Torna all'evento
          </Link>
        </main>

        <footer className="ebike-legal-footer">
          <div className="ebike-legal-footer-copy">© 2026 COMITATO ELLERESE - REGOLAMENTO UE 2016/679</div>
        </footer>
      </div>
    </>
  );
}
