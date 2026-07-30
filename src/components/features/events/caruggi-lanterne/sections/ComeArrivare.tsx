import { Car, Bike, Clock } from "@/lib/icons";
import { PARCHEGGI, type MezzoParcheggio } from "@/data/events/caruggi-lanterne/parcheggi";
import MapPlaceholder from "../ui/MapPlaceholder";

const MEZZI: { key: MezzoParcheggio; label: string; icon: typeof Car }[] = [
  { key: "auto", label: "In automobile", icon: Car },
  { key: "moto", label: "In moto", icon: Bike },
  { key: "bici", label: "In bici", icon: Bike },
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
            Stand aperti dalle 19:00 alle 00:30, entrambe le serate.
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
                <p>
                  {par.areeConfermate} {par.areeConfermate === 1 ? "area confermata" : "aree confermate"}
                  {par.nota && ` (${par.nota})`}
                </p>
              </div>
            );
          })}
        </div>

        <MapPlaceholder label="Mappa parcheggi in arrivo.." />
      </div>
    </section>
  );
}
