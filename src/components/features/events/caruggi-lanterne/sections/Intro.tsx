export default function Intro() {
  return (
    <section className="cel-section" aria-labelledby="intro-title">
      <div className="cel-container cel-intro">
        <div>
          <p className="cel-eyebrow">Da sempre, in agosto</p>
          <h2 id="intro-title" className="cel-title">
            L'evento più atteso <em>del borgo</em>
          </h2>
          <p className="cel-lead">
            Per due sere Ellera si veste a festa: i caruggi si riempiono di
            tavoli, profumi e musica, mentre centinaia di lanterne artigianali
            disegnano un percorso di luce tra le case di pietra. Non è solo
            una sagra gastronomica — è il momento in cui tutto il paese si
            ritrova, tra chi cucina, chi suona e chi scolpisce la ceramica a
            cielo aperto.
          </p>
          <p className="cel-intro-quote">
            "Le lanterne si accendono una a una, e per due notti i caruggi
            diventano un punto di ritrovo per tutta la provincia."
          </p>
        </div>
        <img 
          src="/images/events/caruggi-lanterne/manifesto.avif" 
          alt="Manifesto ufficiale di Caruggi e Lanterne" 
          className="cel-intro-art" 
          width={2756}
          height={3392}
          loading="lazy" 
        />
      </div>
    </section>
  );
}
