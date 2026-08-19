import { stories } from "@/data/core/stories";
import { events, isEventPast } from "@/data/events/events";
import { news } from "@/data/core/news";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/shared/Seo";
import SeasonalHighlight from "@/components/shared/SeasonalHighlight";
import { homeExploreItems, homeRootsCards } from "@/data/core/home";
import { createComitatoOrganizationJsonLd, createWebSiteJsonLd } from "@/lib/jsonLd";
import { elleraDalPonteImage } from "@/assets/images";

// Home Components
import HomeHero from "@/components/features/home/HomeHero";
import HomeNews from "@/components/features/home/HomeNews";
import HomeEvents from "@/components/features/home/HomeEvents";
import HomeStories from "@/components/features/home/HomeStories";
import HomeExplore from "@/components/features/home/HomeExplore";
import CaruggiELanternePromo from "@/components/features/home/CaruggiELanternePromo";


import { fadeUp } from "@/lib/animations";

const Index = () => {
  const pageDescription =
    "Scopri Ellera, borgo ligure tra galleria a cielo aperto, trail MTB, trekking, tradizioni, teatro ed eventi nel cuore della Valle Sansobbia.";
  
  const featuredNews = news[0];
  const highlightedEvents = events
    .filter((event) => event.showOnHome !== false && !isEventPast(event))
    .slice(0, 3);

  return (
    <Layout>
      <Seo
        title="Ellera"
        description={pageDescription}
        image={elleraDalPonteImage}
        imageAlt="Il borgo di Ellera visto dal ponte sul Sansobbia"
        jsonLd={[createComitatoOrganizationJsonLd(), createWebSiteJsonLd()]}
      />

      <CaruggiELanternePromo />

      <HomeHero />

      <SeasonalHighlight />

      <HomeNews featuredNews={featuredNews} fadeUp={fadeUp} />

      <HomeEvents highlightedEvents={highlightedEvents} fadeUp={fadeUp} />

      <HomeStories stories={stories} fadeUp={fadeUp} />

      <HomeExplore homeExploreItems={homeExploreItems} fadeUp={fadeUp} />
      
    </Layout>
  );
};

export default Index;

