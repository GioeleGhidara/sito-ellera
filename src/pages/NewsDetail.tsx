import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Newspaper } from "@/lib/icons";
import FloatingBackLink from "@/components/layout/FloatingBackLink";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import Seo from "@/components/shared/Seo";
import { news } from "@/data/news";
import { ROUTES } from "@/lib/routes";
import { toAbsoluteUrl } from "@/lib/seo";

const BOLD_PATTERN = /\*\*(.+?)\*\*/g;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
};

const categoryColor: Record<string, string> = {
  Borgo: "bg-accent text-accent-foreground",
  Outdoor: "bg-primary text-primary-foreground",
  Cultura: "bg-primary/80 text-primary-foreground",
  Associazione: "bg-secondary text-secondary-foreground",
};

const renderInlineMarkdown = (text: string, strongClassName?: string): ReactNode[] => {
  const result: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(BOLD_PATTERN)) {
    const matchIndex = match.index ?? 0;
    const fullMatch = match[0] ?? "";
    const boldText = match[1] ?? "";

    if (matchIndex > lastIndex) {
      result.push(text.slice(lastIndex, matchIndex));
    }

    result.push(
      <strong key={`b-${matchIndex}`} className={strongClassName}>
        {boldText}
      </strong>,
    );

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result.length > 0 ? result : [text];
};

const renderContent = (text: string) => {
  const paragraphs = text.split("\n\n");

  return paragraphs.map((paragraph, index) => {
    const trimmed = paragraph.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("- ")) {
      const items = trimmed
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "));

      return (
        <ul key={index} className="list-disc pl-6 space-y-1 text-muted-foreground leading-relaxed mb-4">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInlineMarkdown(item.slice(2), "text-foreground")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
        {renderInlineMarkdown(trimmed, "text-foreground")}
      </p>
    );
  });
};

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const item = news.find((n) => n.slug === slug);

  if (!item) {
    return (
      <Layout>
        <Seo title="Articolo non trovato" description="L'articolo richiesto non è disponibile." noindex />
        <section className="pt-32 pb-20 text-center">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">Articolo non trovato</h1>
          <Link to={ROUTES.news} className="text-accent font-semibold hover:underline">
            Torna alle news
          </Link>
        </section>
      </Layout>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.date,
    image: [toAbsoluteUrl(item.image)],
    articleSection: item.category,
    inLanguage: "it-IT",
    author: {
      "@type": "Organization",
      name: "Comitato Ellerese",
    },
    publisher: {
      "@type": "Organization",
      name: "Ellera",
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/favicon.ico"),
      },
    },
  };

  return (
    <Layout>
      <Seo
        title={item.title}
        description={item.excerpt}
        image={item.image}
        imageAlt={item.title}
        type="article"
        publishedTime={item.date}
        section={item.category}
        structuredData={structuredData}
      />
      <PageHero
        imageSrc={item.image}
        imageAlt={item.title}
        eyebrow="News"
        eyebrowIcon={Newspaper}
        title={item.title}
        titleClassName="text-3xl lg:text-4xl font-heading"
        headerChildren={(
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColor[item.category]}`}>
              {item.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-primary-foreground/70">
              <Calendar className="w-3 h-3" />
              {formatDate(item.date)}
            </span>
          </div>
        )}
      />

      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-8">
              <FloatingBackLink to={ROUTES.news} label="Torna a tutte le news" />
            </div>

            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 lg:p-10 shadow-sm">
              {renderContent(item.content)}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetail;


