import { Fragment } from "react";
import { PALCHI } from "@/data/events/caruggi-lanterne/palchi";
import PalcoMusica from "../ui/PalcoMusica";

export default function Isole() {
  return (
    <section className="cel-section" aria-labelledby="isole-title">
      <div className="cel-container">
        <p className="cel-eyebrow">La musica nei caruggi</p>
        <h2 id="isole-title" className="cel-title">
          I <em>palchi</em>
        </h2>
        <p className="cel-lead cel-lead--section">
          Punti musicali animano le serate, con proposte diverse ogni
          giorno.
        </p>
        <div className="cel-palchi-grid">
          {PALCHI.map((palco, idx) => (
            <Fragment key={palco.nome}>
              {idx === 1 && (
                <div className="cel-pedane-intro">
                  <p>A scaldare l'atmosfera delle pedane per l'intero fine settimana (venerdì 21 e sabato 22), troverete in postazione fissa:</p>
                </div>
              )}
              <div>
                <PalcoMusica palco={palco} />
                {palco.notaExtra && (
                  <p className="cel-palco-note">{palco.notaExtra}</p>
                )}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
