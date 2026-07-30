import { STAND_GASTRONOMICI } from "@/data/events/caruggi-lanterne/standGastronomici";
import MapPlaceholder from "../ui/MapPlaceholder";

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
                <span className="cel-stand-marker">{stand.marker}</span>
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

          <MapPlaceholder label="Mappa stand in arrivo.." />
        </div>
      </div>
    </section>
  );
}
