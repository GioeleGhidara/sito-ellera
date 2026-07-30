import { Music } from "@/lib/icons";
import type { Palco } from "@/data/events/palchi";

export default function PalcoMusica({ palco }: { palco: Palco }) {
  return (
    <article className="cel-palco-card cel-panel" aria-labelledby={`palco-title-${palco.nome.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="cel-palco-head">
        <Music size={18} />
        <h3 id={`palco-title-${palco.nome.replace(/\s+/g, '-').toLowerCase()}`}>{palco.nome}</h3>
      </div>
      <div className="cel-palco-serate">
        {palco.serate.map((s, idx) => (
          <div className="cel-artista" key={s.giorno ? `${s.giorno}-${s.nome}` : `${idx}-${s.nome}`}>
            {s.giorno && <span className="cel-artista-giorno">{s.giorno}</span>}
            {s.logo ? (
              <img src={s.logo} alt={`Logo ${s.nome}`} className="cel-artista-logo" loading="lazy" />
            ) : (
              <Music size={28} className="cel-artista-logo-placeholder" aria-hidden="true" />
            )}
            <span className="cel-artista-nome">{s.nome}</span>
            {s.contatti && <span className="cel-artista-contatti">{s.contatti}</span>}
            {s.info && <p className="cel-artista-info">{s.info}</p>}
          </div>
        ))}
      </div>
    </article>
  );
}
