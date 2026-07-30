import { Link } from "react-router-dom";
import { useCursorDot } from "@/hooks/useCursorDot";
import Seo from "@/components/shared/Seo";
import { ROUTES } from "@/lib/routes";
import "./EbikeLegal.css";

export default function Regolamento() {
  const dotRef = useCursorDot();

  return (
    <>
      <Seo
        title="Regolamento Generale Eventi - Comitato Ellerese"
        description="Norme di partecipazione, sicurezza e responsabilità per gli eventi organizzati dal Comitato Ellerese, incluso l'Albi Trail E-Bike Fest."
        canonicalPath={ROUTES.regolamento}
        noindex
      />

      <div className="ebike-legal-page">
        <div className="ebike-legal-cursor-dot" ref={dotRef} />

        <nav className="ebike-legal-nav">
          <Link to="/albi-trail-ebike-fest" className="ebike-legal-nav-logo">
            <div className="ebike-legal-nav-logo-dot"></div>
            Comitato<span className="ebike-legal-nav-accent">Ellerese</span>
          </Link>
        </nav>

        <main className="ebike-legal-main">
          <div className="section-tag">Norme di Partecipazione</div>
          <h1>Regolamento<br />Albi Trail E-Bike Fest</h1>

          <p>
            Il presente regolamento (di seguito, "Regolamento") definisce le norme comportamentali, i requisiti di sicurezza
            e le responsabilità per la partecipazione all'evento <strong>Albi Trail E-Bike Fest</strong> e alle relative manifestazioni outdoor 
            organizzate dal <strong>Comitato Ellerese</strong> in collaborazione con <strong>Albi Trail Area</strong> (di seguito, "Organizzazione"). 
            Ogni partecipante, con l'atto dell'iscrizione, dichiara di aver letto, compreso e accettato integralmente il presente Regolamento. Si consiglia inoltre di leggere l'<Link to="/privacy"><strong>Informativa sulla Privacy</strong></Link>.
          </p>

          <h2>1. Requisiti di Partecipazione e Idoneità Fisica</h2>
          <ul>
            <li>La partecipazione è aperta a tutti i soggetti maggiorenni dotati di idoneità fisica all'attività sportiva. <strong>Non è richiesto il Certificato Medico Sportivo Agonistico</strong>, ma il partecipante dichiara sotto la propria responsabilità di possedere l'idoneità fisica necessaria per affrontare l'attività.</li>
            <li><strong>Partecipazione di Minori:</strong> I minorenni possono partecipare solo se autorizzati e accompagnati da un genitore o da chi ne esercita la potestà genitoriale. Il genitore/tutore è responsabile civile e penale di qualsiasi danno causato dal minore a sé stesso, ad altri o a cose durante la manifestazione. L'iscrizione del minore <strong>non trasferisce responsabilità all'Organizzazione</strong> in nessun caso.</li>
            <li>L'iscrizione deve essere completata tramite i canali ufficiali indicati dall'Organizzazione.</li>
            <li>Il partecipante dichiara di non trovarsi sotto l'effetto di sostanze stupefacenti, psicotrope o alcoliche
              durante l'evento. L'Organizzazione si riserva il diritto di escludere dalla manifestazione chiunque presenti evidenti segni di alterazione.</li>
          </ul>

          <h2>2. Equipaggiamento Obbligatorio</h2>
          <p>Per le attività in Mountain Bike o E-Bike, i partecipanti sono obbligati a presentarsi con:</p>
          <ul>
            <li><strong>Casco protettivo omologato</strong> correttamente allacciato per tutta la durata dell'escursione.</li>
            <li>Bicicletta (MTB o E-MTB) in perfetto stato di manutenzione, dotata di freni efficienti e pneumatici adeguati.</li>
            <li>Abbigliamento consono alle condizioni meteo e al percorso outdoor.</li>
            <li>Kit base per piccole riparazioni (camera d'aria, multi-tool) e riserve idriche sufficienti.</li>
          </ul>

          <h2>3. Trasferimento da Prato Feste ai Tracciati</h2>
          <p>Il trasferimento dal punto di ritrovo presso il Prato Feste verso i tracciati ufficiali dell'evento <strong>deve avvenire seguendo rigorosamente le norme del Codice della Strada</strong>. I partecipanti sono tenuti a:</p>
          <ul>
            <li>Rispettare integralmente il <strong>Codice della Strada Italiano (Decreto Legislativo 30 aprile 1992, n. 285 e successive modifiche)</strong> durante ogni spostamento su viabilità pubblica;</li>
            <li>Mantenere una velocità prudente e moderata in traversamenti urbani o aree abitate;</li>
            <li>Seguire le indicazioni dei volontari dell'Organizzazione e degli organi di polizia eventualmente presenti.</li>
          </ul>

          <h2>4. Sicurezza e Comportamento</h2>
          <ul>
            <li>I percorsi si svolgono su strade aperte al traffico o sentieri boschivi. Il partecipante è obbligato a
              rispettare il <strong>Codice della Strada (Decreto Legislativo 30 aprile 1992, n. 285)</strong> e a tenere un comportamento prudente verso terzi
              (escursionisti a piedi, altri rider).</li>
            <li>È tassativamente vietato abbandonare i percorsi segnalati o deviare dai tracciati durante l'evento
              organizzato.</li>
            <li>Il partecipante deve prestare assistenza in caso di infortunio di altri partecipanti, allertando
              immediatamente l'Organizzazione o i numeri di soccorso.</li>
          </ul>

          <h2>5. Prevenzione della Peste Suina Africana</h2>
          <p>I partecipanti sono tenuti al rigoroso rispetto delle <strong>norme vigenti in materia di contrasto della Peste Suina Africana (PSA) e all'obbligo di rispettare le misure di bio sicurezza previste</strong>, come definite dai decreti ministeriali e dalle ordinanze regionali in vigore.</p>
          <ul>
            <li>È <strong>vietato</strong> raccogliere, toccare o alimentare animali selvatici, in particolare suini o loro resti;</li>
            <li>È <strong>vietato</strong> abbandonare avanzi di cibo o rifiuti organici sui tracciati, in aree boschive o in prossimità di habitat naturali;</li>
            <li>I partecipanti devono mantenere una distanza di sicurezza da qualsiasi fauna selvatica;</li>
            <li>È obbligatorio segnalare immediatamente all'Organizzazione la presenza di animali morti o malati.</li>
          </ul>

          <h2>6. Disinfettazione al Rientro al Prato Feste</h2>
          <p>Al rientro al Prato Feste, tutti i partecipanti sono <strong>obbligati a disinfettare ruote della bicicletta e scarpe</strong> utilizzando gli <strong>spruzzini con disinfettante messi a disposizione gratuitamente</strong> dall'Organizzazione. Questa misura è <strong>obbligatoria</strong> come prevenzione contro la diffusione della Peste Suina Africana. L'Organizzazione potrà escludere dalla manifestazione o da future iniziative i partecipanti che non rispettino questa disposizione.</p>

          <h2>7. Responsabilità, Assicurazione e Dichiarazione di Esonero</h2>
          <p>Partecipando all'evento, il soggetto riconosce pienamente che l'attività outdoor (MTB/Escursionismo) comporta rischi
            intrinsechi di infortunio per cadute, ostacoli naturali, condizioni meteo avverse, interazioni con altri partecipanti o terzi.</p>
          
          <p><strong>Assicurazione dell'Organizzazione:</strong> Il Comitato Ellerese sottoscrive un'assicurazione di responsabilità civile per tutta la durata della manifestazione. Tuttavia, la partecipazione avviene sotto l'intera responsabilità dei partecipanti.</p>
          
          <p><strong>Esonero di Responsabilità:</strong> I partecipanti, con l'atto dell'iscrizione, esonerano integralmente gli organizzatori da qualsiasi responsabilità, sia civile che penale, per:</p>
          <ul>
            <li>Infortuni, incidenti e danni a persone causati o subiti dal partecipante;</li>
            <li>Furti, danni ai mezzi o equipaggiamenti;</li>
            <li>Danni a cose causati durante la manifestazione;</li>
            <li>Conseguenze ulteriori che sopraggiungano in seguito all'evento.</li>
          </ul>
          
          <p><strong>Rinuncia a Ricorsi Legali:</strong> I partecipanti rinunciano espressamente ad ogni ricorso e/o azione legale contro il Comitato Ellerese, gli organizzatori e l'organizzazione in caso di morte, infortuni e/o danni derivanti a sé, ad altri o a cose, nonché in caso di conseguenze ulteriori che sopraggiungano successivamente all'evento.</p>
          
          <p><strong>Consiglio di Assicurazione Personale:</strong> Si consiglia vivamente a ogni partecipante di stipulare una propria assicurazione contro gli infortuni per l'intera durata della manifestazione.</p>
          
          <p><strong>Dichiarazione di Esonero Obbligatoria:</strong> L'iscrizione tramite il modulo online su <Link to="/albi-trail-ebike-fest"><strong>ellera.it/albi-trail-ebike-fest</strong></Link> costituisce accettazione esplicita e senza riserve del presente Regolamento. I partecipanti devono obbligatoriamente spuntare la casella di accettazione <strong>"Dichiaro di aver letto e accettato il Regolamento"</strong> durante l'iscrizione. L'assenza di tale spunta comporta il rifiuto dell'iscrizione.</p>

          <h2>8. Contributi di Partecipazione</h2>
          <p>Le somme versate per l'iscrizione sono da intendersi come <strong>contributo associativo</strong> finalizzato
            alla copertura delle spese vive e logistiche dell'evento. <strong>Non è previsto rimborso in caso di mancata partecipazione dell'iscritto per qualsiasi ragione</strong>. Nel caso in cui l'evento sia annullato o rinviato per cause imputabili all'Organizzazione o per forza maggiore, l'Organizzazione provvederà a comunicare le modalità di rimborso o di credito futuro in conformità alle norme applicabili.</p>

          <h2>9. Tutela dell'Ambiente</h2>
          <p>I partecipanti sono tenuti al massimo rispetto del patrimonio naturale. È severamente vietato abbandonare rifiuti
            o molestare la fauna selvatica. <strong>"Non lasciare nulla se non le tracce dei tuoi pneumatici."</strong></p>

          <h2>10. Sicurezza e Assistenza Medica</h2>
          <p>Per tutta la durata della manifestazione è assicurata l'<strong>assistenza sanitaria con il supporto della Croce Verde di Albisola</strong>. Saranno presenti addetti dell'Organizzazione e volontari impegnati a garantire la massima sicurezza e il giusto supporto in caso di necessità.</p>
          <ul>
            <li>Ogni partecipante deve prestare attenzione a tutte le persone in difficoltà e avvisare immediatamente i soccorsi (volontari, addetti o numeri di emergenza);</li>
            <li>Tutti i partecipanti devono rimanere sui sentieri e tracciati ufficiali dell'evento;</li>
            <li>Il partecipante che si allontana volontariamente dal tracciato ufficiale <strong>non è più sotto la responsabilità dell'Organizzazione</strong> e assume piena responsabilità per la propria incolumità.</li>
          </ul>

          <h2>11. Condizioni Meteo e Annullamento dell'Evento</h2>
          <p>In caso di fenomeni meteo importanti (forti temporali, forte vento, fulmini, ecc.), l'Organizzazione si riserva il diritto di effettuare variazioni di percorso, anche all'ultimo minuto, al fine di eliminare eventuali pericoli o condizioni di forte disagio per i partecipanti. Le variazioni saranno comunicate tempestivamente e segnalate dagli addetti.</p>
          <p><strong>In caso di allerta meteo Arancione o Rossa emessa dalla Protezione Civile Regionale,</strong> la manifestazione sarà <strong>rimandata a data da comunicarsi successivamente</strong>. Nel caso di rinvio per cause meteo o di forza maggiore, non è previsto rimborso, ma è garantito il credito per una futura edizione dell'evento. Nel caso di annullamento definitivo, l'Organizzazione comunicherà le modalità di rimborso in conformità alle norme applicabili.</p>

          <h2>12. Consapevolezza e Autonomia dei Partecipanti</h2>
          <p>I partecipanti all'Albi Trail E-Bike Fest devono essere pienamente consapevoli della natura dell'attività outdoor e dell'impegno fisico richiesto. È essenziale:</p>
          <ul>
            <li>Essere coscienti della lunghezza e della specificità del percorso e di essere adeguatamente preparati;</li>
            <li>Aver acquisito una reale capacità di autonomia personale per gestire al meglio i problemi legati a questo tipo di attività;</li>
            <li>Essere in grado di gestire, anche se isolati, i problemi fisici o psicologici dovuti a stanchezza, problemi gastrointestinali, dolori muscolari o articolari;</li>
            <li>Comprendere che il ruolo dell'Organizzazione non è di assistere un partecipante nella gestione di questi problemi, ma di fornire supporto medico solo in caso di emergenza reale.</li>
          </ul>

          <h2>13. Trattamento Dati e Media</h2>
          <p>L'iscrizione implica l'accettazione dell'<Link to="/privacy"><strong>Informativa Privacy</strong></Link> e, se selezionata la relativa opzione,
            l'autorizzazione all'utilizzo gratuito di immagini e video catturati durante l'evento per scopi promozionali
            dell'Organizzazione.</p>

          <h2>14. Accettazione del Regolamento</h2>
          <p>La partecipazione all'<strong>Albi Trail E-Bike Fest</strong> comporta l'accettazione senza riserve del presente regolamento, disponibile sul sito ufficiale dell'evento.</p>
          <p>Alcune parti del regolamento potranno essere modificate a causa di imprescindibili esigenze organizzative o sopraggiunte condizioni di sicurezza. In caso di variazioni, sarà dato tempestivo avviso e le modifiche diventeranno parte integrante del presente regolamento. È responsabilità del partecipante consultare gli aggiornamenti ufficiali prima della manifestazione.</p>

          <Link to="/albi-trail-ebike-fest" className="ebike-legal-back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(180deg)" }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Torna all'evento
          </Link>
        </main>

        <footer className="ebike-legal-footer">
          <div className="ebike-legal-footer-copy">© 2026 COMITATO ELLERESE - REGOLAMENTO GENERALE MANIFESTAZIONI</div>
        </footer>
      </div>
    </>
  );
}
