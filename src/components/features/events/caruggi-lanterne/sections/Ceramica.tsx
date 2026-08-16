import { MapPin } from "@/lib/icons";

export default function Ceramica() {
  return (
    <section className="cel-section" aria-labelledby="ceramica-title">
      <div className="cel-container">
        <p className="cel-eyebrow">Piazza Nuova, appena arrivati in paese</p>
        <h2 id="ceramica-title" className="cel-title">
          La ceramica di <em>Luigi Bevilacqua</em>
        </h2>
        <p className="cel-lead cel-lead--section">
          Il primo incontro per chi arriva a Ellera: in Piazza Nuova Luigi
          Bevilacqua, della Scuola di Ceramica di Albisola, porta il suo
          mestiere in strada, tra un laboratorio pensato per i più piccoli e
          la lavorazione dal vivo dell'argilla.
        </p>

        <article className="cel-ceramica-panel cel-panel">
          <h3 className="cel-ceramica-title">Laboratorio, dimostrazione ed esposizione</h3>

          <img
            src="/images/events/caruggi-lanterne/loghi-coorte/scuola-ceramica.webp"
            alt="Scuola di Ceramica di Albisola"
            className="cel-ceramica-visual"
            loading="lazy"
          />
          <p className="cel-ceramica-desc">
            Per tutta la durata della sagra Luigi Bevilacqua, affiancato
            da un aiutante, propone un laboratorio/spettacolo dedicato ai
            bambini e lavora l'argilla dal vivo davanti al pubblico.
            Accanto alla postazione, l'esposizione e la vendita delle
            ceramiche della Scuola di Ceramica di Albisola: pezzi che
            raccontano una tradizione artigianale a due passi da noi.
          </p>

          <a
            className="cel-ceramica-note"
            href="https://maps.app.goo.gl/uC9B59nwfT7kyWur9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin size={16} aria-hidden="true" />
            Piazza Nuova — P.zza Fratelli Bandiera
          </a>
        </article>
      </div>
    </section>
  );
}
