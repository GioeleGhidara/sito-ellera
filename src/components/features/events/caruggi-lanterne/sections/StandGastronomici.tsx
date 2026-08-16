import { STAND_GASTRONOMICI } from "@/data/events/caruggi-lanterne/standGastronomici";

export default function StandGastronomici() {
  return (
    <section className="cel-section" aria-labelledby="stand-title">
      <div className="cel-container">
        <p className="cel-eyebrow">Cosa si mangia</p>
        <h2 id="stand-title" className="cel-title">
          Gli <em>stand gastronomici</em>
        </h2>
        <p className="cel-lead cel-lead--section">
          Sei punti distribuiti nei caruggi, ognuno con la propria
          specialità. Segui le lettere sulla mappa per orientarti.
        </p>

        <div className="cel-stand-layout">
          <div className="cel-stand-list" role="list">
            {STAND_GASTRONOMICI.map((stand, idx) => (
              <article className="cel-stand-card cel-panel" key={stand.marker} role="listitem" aria-labelledby={`stand-title-${idx}`}>
                <span className="cel-stand-marker" data-marker={stand.marker}>{stand.marker}</span>
                <div>
                  <h3 id={`stand-title-${idx}`}>{stand.zona}</h3>
                  <ul>
                    {stand.offerta.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                    {stand.note && <li className="cel-stand-note">{stand.note}</li>}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="cel-map-card">
            <a
              href="/images/events/caruggi-lanterne/mappa.svg"
              target="_blank"
              rel="noopener"
              aria-label="Apri la mappa a piena risoluzione in una nuova scheda"
              className="cel-map-card-frame"
            >
              <img
                src="/images/events/caruggi-lanterne/mappa.svg"
                alt="Mappa di Caruggi e Lanterne — Ellera, con le tappe A–F degli stand, la coorte, il torrente, i ponti e il murale"
                className="cel-map-image"
                loading="lazy"
              />
              <span className="cel-map-card-caption">Mappa dell'evento — tocca per ingrandire</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
