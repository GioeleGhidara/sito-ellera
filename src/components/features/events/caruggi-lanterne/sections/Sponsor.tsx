import { Heart } from "@/lib/icons";

const SPONSOR_PLACEHOLDER_COUNT = 3;

export default function Sponsor() {
  return (
    <section className="cel-section" aria-labelledby="sponsor-title">
      <div className="cel-container cel-container--center">
        <div className="cel-sponsor-icon">
          <Heart size={18} />
        </div>
        <h2 id="sponsor-title" className="cel-title">
          I nostri <em>Sponsor</em>
        </h2>
        <p className="cel-lead cel-lead--section cel-lead--center">
          Un ringraziamento speciale a chi rende possibile la magia di Caruggi & Lanterne.
        </p>

        {/* Spazio placeholder per i loghi */}
        <div className="cel-sponsor-grid">
          {Array.from({ length: SPONSOR_PLACEHOLDER_COUNT }).map((_, i) => (
            <div className="cel-panel cel-sponsor-placeholder" key={i}>Spazio Sponsor</div>
          ))}
        </div>
      </div>
    </section>
  );
}
