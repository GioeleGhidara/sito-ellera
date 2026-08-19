import { Car, Bike, Clock } from "@/lib/icons";
import { PARCHEGGI, type MezzoParcheggio } from "@/data/events/caruggi-lanterne/parcheggi";

const MEZZI: { key: MezzoParcheggio; label: string; icon: typeof Car }[] = [
  { key: "auto", label: "In automobile", icon: Car },
  { key: "moto", label: "In moto", icon: Bike },
];

export default function ComeArrivare() {
  return (
    <section className="cel-section" aria-labelledby="come-arrivare-title">
      <div className="cel-container">
        <p className="cel-eyebrow">Informazioni pratiche</p>
        <h2 id="come-arrivare-title" className="cel-title">
          Come <em>arrivare</em>
        </h2>

        <div className="cel-info-card cel-panel cel-info-card--orari">
          <span className="label">
            <Clock size={15} /> Orari
          </span>
          <p>
            Stand aperti dalle 19:00 alle 01:00, entrambe le serate.
          </p>
        </div>

        <div className="cel-mezzi-grid">
          {MEZZI.map(({ key, label, icon: Icon }) => {
            const par = PARCHEGGI.find((p) => p.mezzo === key);
            if (!par) return null;
            return (
              <div className="cel-info-card cel-panel" key={key}>
                <span className="label">
                  <Icon size={15} /> {label}
                </span>
                {par.dettaglio ? (
                  <p>{par.dettaglio}</p>
                ) : (
                  <p>
                    {par.areeConfermate} {par.areeConfermate === 1 ? "area confermata" : "aree confermate"}
                    {par.nota && ` (${par.nota})`}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="cel-map-card cel-map-card--parcheggi">
          <a
            href="/images/events/caruggi-lanterne/mappa-parcheggi.png"
            target="_blank"
            rel="noopener"
            aria-label="Apri la mappa dei parcheggi a piena risoluzione in una nuova scheda"
            className="cel-map-card-frame"
          >
            <img
              src="/images/events/caruggi-lanterne/mappa-parcheggi.png"
              alt="Mappa dei parcheggi di Caruggi e Lanterne — Ellera, con le aree auto numerate 1–5 (zona Campetto e zona Foglieto) e il parcheggio moto in Piazza Nuova"
              className="cel-map-image"
              loading="lazy"
            />
            <span className="cel-map-card-caption">Mappa dei parcheggi — tocca per ingrandire</span>
          </a>
        </div>
      </div>
    </section>
  );
}
