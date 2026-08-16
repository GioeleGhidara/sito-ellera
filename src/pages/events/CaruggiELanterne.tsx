import { Helmet } from "react-helmet-async";

import "./CaruggiELanterne.css";

import Hero from "../../components/features/events/caruggi-lanterne/sections/Hero";
import Intro from "../../components/features/events/caruggi-lanterne/sections/Intro";
import Ceramica from "../../components/features/events/caruggi-lanterne/sections/Ceramica";
import StandGastronomici from "../../components/features/events/caruggi-lanterne/sections/StandGastronomici";
import Coorte from "../../components/features/events/caruggi-lanterne/sections/Coorte";
import Isole from "../../components/features/events/caruggi-lanterne/sections/Isole";
import ComeArrivare from "../../components/features/events/caruggi-lanterne/sections/ComeArrivare";
// import Sponsor from "../../components/features/events/caruggi-lanterne/sections/Sponsor";
import Footer from "../../components/features/events/caruggi-lanterne/sections/Footer";
import { RevealSection } from "../../components/ui/RevealSection";
import { CARUGGI_EVENT_DATA } from "../../data/events/caruggiELanterne";
import { ROUTES } from "../../lib/routes";
import { Home, ArrowUpRight } from "../../lib/icons";

export default function CaruggiELanterne() {
  return (
    <>
      <Helmet>
        <title>{CARUGGI_EVENT_DATA.title}</title>
        <meta
          name="description"
          content={CARUGGI_EVENT_DATA.description}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={CARUGGI_EVENT_DATA.url} />
        <meta property="og:type" content="event" />
        <meta property="og:url" content={CARUGGI_EVENT_DATA.url} />
        <meta property="og:title" content={CARUGGI_EVENT_DATA.title} />
        <meta
          property="og:description"
          content={CARUGGI_EVENT_DATA.description}
        />
        <meta property="og:image" content={CARUGGI_EVENT_DATA.imageUrl} />
        <meta property="og:locale" content="it_IT" />
        <meta property="og:site_name" content="Comitato Ellerese" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={CARUGGI_EVENT_DATA.title} />
        <meta name="twitter:description" content={CARUGGI_EVENT_DATA.description} />
        <meta name="twitter:image" content={CARUGGI_EVENT_DATA.imageUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,800;0,9..144,900;1,9..144,500;1,9..144,600&family=Archivo:wght@400;500;600;700&family=Inter:wght@700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json">{`{
  "@context":"https://schema.org",
  "@type":"Festival",
  "name":"${CARUGGI_EVENT_DATA.title.split(' -')[0]}",
  "description":"${CARUGGI_EVENT_DATA.description}",
  "image":"${CARUGGI_EVENT_DATA.imageUrl}",
  "startDate":"${CARUGGI_EVENT_DATA.startDate}",
  "endDate":"${CARUGGI_EVENT_DATA.endDate}",
  "eventStatus":"https://schema.org/EventScheduled",
  "eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode",
  "location":{"@type":"Place","name":"Centro storico di Ellera","address":{"@type":"PostalAddress","addressLocality":"Ellera","addressRegion":"Liguria","addressCountry":"IT"}},
  "organizer":{"@type":"Organization","name":"Comitato Ellerese","url":"https://ellera.it"},
  "isAccessibleForFree":true,
  "url":"${CARUGGI_EVENT_DATA.url}"
}`}</script>
      </Helmet>

      <div className="cel-page">
        <a href="#main-content" className="cel-skip-link">Salta al contenuto principale</a>

        <a href={ROUTES.home} className="cel-site-hint">
          <Home size={14} aria-hidden="true" />
          Sei arrivato qui da un QR? Scopri tutto il sito di Ellera
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>

        <Hero />
        <main id="main-content">
          <RevealSection><Intro /></RevealSection>
          <RevealSection><Ceramica /></RevealSection>
          <RevealSection><StandGastronomici /></RevealSection>
          <RevealSection><Isole /></RevealSection>
          <RevealSection><Coorte /></RevealSection>
          <RevealSection><ComeArrivare /></RevealSection>
          {/* <RevealSection><Sponsor /></RevealSection> */}
        </main>
        <Footer />
      </div>
    </>
  );
}
