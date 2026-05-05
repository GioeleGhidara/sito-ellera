import { stories } from "@/data/stories";
import { events } from "@/data/events";
import { news } from "@/data/news";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/shared/Seo";
import SeasonalHighlight from "@/components/shared/SeasonalHighlight";
import { homeExploreItems, homeRootsCards } from "@/data/home";
import { createComitatoOrganizationJsonLd, createWebSiteJsonLd } from "@/lib/jsonLd";
import { elleraDalPonteImage } from "@/assets/images";

// Home Components
import HomeHero from "@/components/features/home/HomeHero";
import HomeNews from "@/components/features/home/HomeNews";
import HomeEvents from "@/components/features/home/HomeEvents";
import HomeStories from "@/components/features/home/HomeStories";
import HomeExplore from "@/components/features/home/HomeExplore";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Index = () => {
  const pageDescription =
    "Scopri Ellera, borgo ligure tra galleria a cielo aperto, trail MTB, trekking, tradizioni, teatro ed eventi nel cuore della Valle Sansobbia.";
  
  const featuredNews = news[0];
  const highlightedEvents = events.filter((event) => event.showOnHome !== false).slice(0, 3);

  return (
    <Layout>
      <Seo
        title="Ellera, borgo in Liguria tra arte, trail e tradizioni"
        description={pageDescription}
        image={elleraDalPonteImage}
        imageAlt="Il borgo di Ellera visto dal ponte sul Sansobbia"
        jsonLd={[createComitatoOrganizationJsonLd(), createWebSiteJsonLd()]}
      />

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

