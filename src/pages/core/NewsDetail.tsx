import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Newspaper } from "@/lib/icons";
import FloatingBackLink from "@/components/layout/FloatingBackLink";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import Seo from "@/components/shared/Seo";
import { news } from "@/data/core/news";
import { ROUTES } from "@/lib/routes";
import { toAbsoluteUrl } from "@/lib/seo";
import { formatDateLong } from "@/lib/date-utils";
import { CATEGORY_COLOR } from "@/lib/news-utils";
import { cn } from "@/lib/utils";

const BOLD_RE = /\*\*(.+?)\*\*/g;

const renderInline = (text: string, strongCn?: string): ReactNode[] => {
  const result: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(BOLD_RE)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) result.push(text.slice(lastIndex, idx));
    result.push(
      <strong key={`b-${idx}`} className={strongCn}>
        {match[1]}
      </strong>,
    );
    lastIndex = idx + match[0].length;
  }

  if (lastIndex < text.length) result.push(text.slice(lastIndex));
  return result.length > 0 ? result : [text];
};

const renderContent = (text: string) =>
  text.split("\n\n").map((paragraph, index) => {
    const trimmed = paragraph.trim();
    if (!trimmed) return null;

    // ## Heading
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="font-heading text-2xl lg:text-3xl text-foreground mt-10 mb-4 pl-4 border-l-4 border-accent"
        >
          {trimmed.slice(3)}
        </h2>
      );
    }

    // > Blockquote
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote
          key={index}
          className="my-6 pl-5 border-l-2 border-accent/50 italic text-muted-foreground text-base leading-relaxed"
        >
          {renderInline(trimmed.slice(2), "text-foreground not-italic")}
        </blockquote>
      );
    }

    // Lista
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").map(l => l.trim()).filter(l => l.startsWith("- "));
      return (
        <ul key={index} className="list-none pl-0 space-y-2 mb-4">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {renderInline(item.slice(2), "text-foreground")}
            </li>
          ))}
        </ul>
      );
    }

    // Paragrafo
    return (
      <p key={index} className="text-muted-foreground leading-relaxed mb-4 text-base">
        {renderInline(trimmed, "text-foreground font-semibold")}
      </p>
    );
  });

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
    author: { "@type": "Organization", name: "Comitato Ellerese" },
    publisher: {
      "@type": "Organization",
      name: "Ellera",
      logo: { "@type": "ImageObject", url: toAbsoluteUrl("/favicon.ico") },
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
        jsonLd={structuredData}
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
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide", CATEGORY_COLOR[item.category])}>
              {item.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-primary-foreground/70">
              <Calendar className="w-3 h-3" />
              {formatDateLong(item.date)}
            </span>
          </div>
        )}
      />

      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-8">
              <FloatingBackLink to={ROUTES.news} label="Torna a tutte le news" />
            </div>

            {/* Excerpt in evidenza */}
            <div className="mb-6 px-6 py-5 rounded-xl bg-accent/8 border border-accent/20">
              <p className="text-base lg:text-lg text-foreground font-medium leading-relaxed italic">
                {item.excerpt}
              </p>
            </div>

            {/* Separatore decorativo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-border" />
              <span className="w-2 h-2 rounded-full bg-accent" />
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Corpo articolo */}
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 lg:p-10 shadow-sm">
              {renderContent(item.content)}
            </div>

            {/* Footer articolo */}
            <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
              <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide", CATEGORY_COLOR[item.category])}>
                {item.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDateLong(item.date)}
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetail;