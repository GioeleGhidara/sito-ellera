import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpRight,
  Coins,
  Heart,
  Instagram,
  Mail,
  Paypal,
  Users,
  Wrench,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import Seo from "@/components/shared/Seo";
import { teatroBalomaExteriorImage as teatroHero } from "@/assets/images";
import {
  teatroBalomaContacts,
  teatroBalomaNeeds,
  teatroBalomaSupportOptions,
  type TeatroBalomaSupportOption,
} from "@/data/teatroBaloma";
import { ROUTES } from "@/lib/routes";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const iconMap = {
  handCoins: Coins,
  wrench: Wrench,
  users: Users,
} as const;

const copyText = async (label: string, value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copiato`);
  } catch {
    toast.error(`Non sono riuscito a copiare ${label.toLowerCase()}`);
  }
};

const supportListItem = (item: TeatroBalomaSupportOption) => {
  const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Heart;

  return (
    <div
      key={item.title}
      className="flex gap-4 rounded-2xl border border-border/70 bg-background p-5"
    >
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-heading font-bold text-foreground">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
};

const TeatroBalomaSupport = () => {
  const location = useLocation();
  const practicalSupportOptions = teatroBalomaSupportOptions.filter((item) => item.icon !== "handCoins");

  useEffect(() => {
    if (!location.hash) return;

    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  return (
    <Layout>
      <Seo
        title="Sostieni il Teatro Balomà"
        description="Bonifico e contatti utili per sostenere il progetto del Teatro Balomà a Ellera."
        image={teatroHero}
        imageAlt="Facciata del Teatro Balomà a Ellera"
      />

      <PageHero
        imageSrc={teatroHero}
        imageAlt="Facciata del Teatro Balomà"
        imageClassName="object-[center_63%]"
        eyebrow="Sostegno al progetto"
        eyebrowIcon={Heart}
        title="Sostieni il Teatro Balomà"
        sectionClassName="h-[38vh] min-h-[300px]"
        containerClassName="max-w-5xl pb-8 lg:pb-10"
        contentClassName="max-w-3xl"
        titleClassName="font-heading text-3xl md:text-4xl lg:text-5xl"
        footerChildren={(
          <div className="mt-5">
            <Link
              to={`${ROUTES.teatroBaloma}#sostieni`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/90 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Torna al Teatro Balomà
            </Link>
          </div>
        )}
      />

      <section className="border-y border-border/60 bg-[hsl(35,45%,96%)] py-12 lg:py-16">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Sostegno al progetto</p>
            <h2 className="mt-3 text-3xl font-heading font-bold text-foreground lg:text-4xl">
              Un contributo economico oppure una mano concreta
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Il modo più diretto per sostenere il Balomà oggi è il bonifico. Se invece vuoi dare una mano con
              materiali, lavoro, organizzazione o idee, qui trovi il modo più semplice per farlo.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-x-6 gap-y-4 lg:grid-cols-3">
            <motion.aside
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex h-full flex-col rounded-[2rem] border border-border/70 bg-card p-5 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.35)] lg:p-7"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1.5rem] bg-accent/10 text-accent">
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">Obiettivi</p>
                  <h3 className="mt-2 text-2xl font-heading font-bold leading-[1.02] tracking-[-0.02em] text-foreground lg:text-[2rem]">
                    Interventi
                    <br />
                    prioritari
                  </h3>
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {teatroBalomaNeeds.map((item) => (
                  <li key={item.title} className="border-t border-border/60 pt-3 first:border-t-0 first:pt-0">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  </li>
                ))}
              </ul>
            </motion.aside>

            <motion.section
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex h-full flex-col rounded-[2rem] border border-border/70 bg-card p-5 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.35)] lg:p-7"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1.5rem] bg-[#003087]/10 text-[#003087]">
                  <Paypal className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">PayPal</p>
                  <h3 className="mt-2 text-2xl font-heading font-bold leading-[1.02] tracking-[-0.02em] text-foreground lg:text-[2rem]">
                    Contributo
                    <br />
                    online
                  </h3>
                </div>
              </div>

              <div
                id="paypal"
                className="mt-8 scroll-mt-24 rounded-[1.5rem] border border-border/70 bg-[hsl(35,35%,92%)] p-5"
              >
                <div className="space-y-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Intestatario</p>
                    <p className="mt-2 inline-flex bg-background/80 px-2.5 py-1 text-lg font-semibold text-foreground lg:text-xl">
                      Teatro Balomà
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Causale</p>
                    <p className="mt-2 text-base font-semibold text-foreground">supporto</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <Button asChild className="w-full justify-center">
                  <a
                    href={teatroBalomaContacts.supportPaypalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apri PayPal
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.section>

            <motion.section
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex h-full flex-col rounded-[2rem] border border-border/70 bg-card p-5 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.35)] lg:p-7"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1.5rem] bg-accent/10 text-accent">
                  <Coins className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">Bonifico</p>
                  <h3 className="mt-2 text-2xl font-heading font-bold leading-[1.02] tracking-[-0.02em] text-foreground lg:text-[2rem]">
                    Contributo
                    <br />
                    diretto
                  </h3>
                </div>
              </div>

              <div
                id="bonifico"
                className="mt-8 scroll-mt-24 rounded-[1.5rem] border border-border/70 bg-[hsl(35,35%,92%)] p-5"
              >
                <div className="space-y-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Intestatario</p>
                    <p className="mt-2 inline-flex bg-background/80 px-2.5 py-1 text-lg font-semibold text-foreground lg:text-xl">
                      {teatroBalomaContacts.supportAccountHolder}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Causale</p>
                    <p className="mt-2 text-base font-semibold text-foreground">supporto Teatro Balomà</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">IBAN</p>
                    <p className="mt-2 whitespace-nowrap font-mono text-[10px] tracking-[-0.02em] text-foreground sm:text-[11px] lg:text-[12px]">
                      {teatroBalomaContacts.supportIban}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-4 pt-6">
                <Button
                  type="button"
                  className="w-full justify-center"
                  onClick={() => copyText("IBAN", teatroBalomaContacts.supportIban)}
                >
                  Copia IBAN
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => copyText("Intestatario", teatroBalomaContacts.supportAccountHolder)}
                >
                  Copia intestatario
                </Button>
              </div>
            </motion.section>

            <motion.aside
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.35)] lg:col-span-3 lg:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Far vivere il Balomà</p>
              <h3 className="mt-3 text-2xl font-heading font-bold text-foreground">
                L'obiettivo non è guadagnare, ma tenere vivo lo spazio
              </h3>
              <p className="mt-4 max-w-4xl text-sm leading-relaxed text-muted-foreground">
                Il centro polifunzionale Balomà ha senso se continua a ospitare eventi, persone e partecipazione. Per
                questo molti appuntamenti saranno gratuiti o sostenuti da altri enti: i modi più utili per aiutarci
                sono organizzare iniziative insieme, collaborare e dare una mano nei lavori di riqualificazione e
                manutenzione degli spazi.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {practicalSupportOptions.map((item) => supportListItem(item))}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="bg-background pb-12 pt-6 lg:pb-16 lg:pt-8">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.35)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Contatti utili</p>
            <h2 className="mt-3 text-2xl font-heading font-bold text-foreground">Scrivici se vuoi contribuire</h2>

            <div className="mt-6 space-y-3">
              <a
                href={`mailto:${teatroBalomaContacts.supportEmail}?subject=Sostegno%20progetto%20Teatro%20Balom%C3%A0`}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:text-primary"
              >
                <span className="inline-flex items-center gap-3">
                  <Mail className="h-4 w-4 text-accent" />
                  {teatroBalomaContacts.supportEmail}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </a>

              <a
                href={teatroBalomaContacts.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:text-primary"
              >
                <span className="inline-flex items-center gap-3">
                  <Instagram className="h-4 w-4 text-accent" />
                  Contatta il Balomà su Instagram
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </a>

            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TeatroBalomaSupport;

