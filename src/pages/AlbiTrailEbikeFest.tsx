import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

import "./AlbiTrailEbikeFest.css";

import { Navigation } from "../components/features/events/ebike-fest/Navigation";
import { Hero } from "../components/features/events/ebike-fest/Hero";
import { CountdownSection } from "../components/features/events/ebike-fest/CountdownSection";
import { InfoStats } from "../components/features/events/ebike-fest/InfoStats";
import { Programma } from "../components/features/events/ebike-fest/Programma";
import { Percorsi } from "../components/features/events/ebike-fest/Percorsi";
import { Attrezzatura } from "../components/features/events/ebike-fest/Attrezzatura";
import { Organizzatore } from "../components/features/events/ebike-fest/Organizzatore";
import { IscrizioneForm } from "../components/features/events/ebike-fest/IscrizioneForm";
import { Footer } from "../components/features/events/ebike-fest/Footer";
import { StickyCTA } from "../components/features/events/ebike-fest/StickyCTA";

export default function AlbiTrailEbikeFest() {
    /* Scroll reveal */
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("visible"); obs.unobserve(e.target); } }),
            { threshold: 0.1 }
        );
        document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    /* Custom cursor */
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (dotRef.current) dotRef.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
            if (ringRef.current) ringRef.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
        };
        document.addEventListener("mousemove", onMove);
        return () => document.removeEventListener("mousemove", onMove);
    }, []);

    /* Sticky CTA & Form Scrolling */
    const formRef = useRef<HTMLDivElement>(null);
    const [stickyVisible, setStickyVisible] = useState(false);

    useEffect(() => {
        const toggle = () => {
            const scrolled = window.scrollY > 280;
            const formEl = formRef.current;
            const pastForm = formEl ? window.scrollY + window.innerHeight > formEl.getBoundingClientRect().bottom + window.scrollY + 100 : false;
            setStickyVisible(scrolled && !pastForm);
        };
        window.addEventListener("scroll", toggle, { passive: true });
        toggle();
        return () => window.removeEventListener("scroll", toggle);
    }, []);

    /* Restore scroll on refresh */
    useEffect(() => {
        const key = "scroll_pos_" + window.location.pathname;
        const savedPos = sessionStorage.getItem(key);
        if (savedPos) {
            // Using a tiny timeout ensures the DOM is fully painted after Suspense
            setTimeout(() => window.scrollTo({ top: parseInt(savedPos, 10), behavior: "instant" }), 0);
            sessionStorage.removeItem(key);
        }
        const onBeforeUnload = () => sessionStorage.setItem(key, window.scrollY.toString());
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, []);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <Helmet>
                <title>Albi Trail E-Bike Fest - 14 Giugno 2026</title>
                <meta name="description" content="Domenica 14 Giugno 2026 - Giro in E-Bike e MTB sui sentieri dell'Albi Trail Area, pranzo finale al Prato Feste del Comitato Ellerese di Ellera. Iscriviti online." />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.ellera.it/albi-trail-ebike-fest" />
                <meta property="og:type" content="event" />
                <meta property="og:title" content="Albi Trail E-Bike Fest 2026" />
                <meta property="og:description" content="Domenica 14 Giugno 2026 - Giro in E-Bike e MTB sui sentieri dell'Albi Trail, pranzo finale con salsiccia/wurstel e birra al Prato Feste. Ellera, Albisola Superiore." />
                <meta property="og:url" content="https://ellera.it/albi-trail-ebike-fest" />
                <meta property="og:image" content="https://ellera.it/og/ebike-fest-2026.jpg" />
                <meta property="og:locale" content="it_IT" />
                <meta property="og:site_name" content="Comitato Ellerese" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Albi Trail E-Bike Fest 2026" />
                <meta name="twitter:description" content="14 Giugno 2026 - Ride + pranzo sui sentieri di Ellera. Iscriviti ora." />
                <meta name="twitter:image" content="https://ellera.it/og/ebike-fest-2026.jpg" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;1,300;1,700&family=Barlow:wght@300;400&display=swap" rel="stylesheet" />
                {/* Stripe + PayPal + Turnstile */}
                <script src="https://js.stripe.com/v3/" />
                <script src="https://www.paypal.com/sdk/js?client-id=AYdERqNakZl6ULR3SR5P33b3ERgIqc6WEhVpc9KsEHzkSx-jsQCuf4hCokgIOe_2CmqrSWHvYqTYDmo6&currency=EUR&locale=it_IT" />
                <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
                <script type="application/ld+json">{`{
  "@context":"https://schema.org",
  "@type":"SportsEvent",
  "name":"Albi Trail E-Bike Fest 2026",
  "description":"Giro in E-Bike e MTB sui sentieri dell'Albi Trail Area, pranzo finale al Prato Feste del Comitato Ellerese.",
  "image": "https://ellera.it/og/ebike-fest-2026.jpg",
  "startDate":"2026-06-14T09:00:00+02:00",
  "endDate":"2026-06-14T15:00:00+02:00",
  "eventStatus":"https://schema.org/EventScheduled",
  "eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode",
  "location":{"@type":"Place","name":"Prato Feste Comitato Ellerese","address":{"@type":"PostalAddress","addressLocality":"Ellera","addressRegion":"Liguria","addressCountry":"IT"}},
  "organizer":{"@type":"Organization","name":"Comitato Ellerese","url":"https://ellera.it"},
  "performer":{"@type":"Organization","name":"Albi Trail Area"},
  "offers":[
    {"@type":"Offer","name":"Ride + Pranzo","price":"20.00","priceCurrency":"EUR","availability":"https://schema.org/InStock","url":"https://ellera.it/albi-trail-ebike-fest"},
    {"@type":"Offer","name":"Solo Ride","price":"12.00","priceCurrency":"EUR","availability":"https://schema.org/InStock","url":"https://ellera.it/albi-trail-ebike-fest"},
    {"@type":"Offer","name":"Solo Pranzo","price":"12.00","priceCurrency":"EUR","availability":"https://schema.org/InStock","url":"https://ellera.it/albi-trail-ebike-fest"}
  ],
  "url":"https://ellera.it/albi-trail-ebike-fest"
}`}</script>
            </Helmet>

            <div className="ebike-page">
                {/* ── CURSOR ── */}
                <div className="ebike-cursor-dot" ref={dotRef} />
                <div className="ebike-cursor-ring" ref={ringRef} />

                <Navigation onScrollToForm={scrollToForm} />
                <Hero />
                <CountdownSection />
                <InfoStats />
                <Programma />
                <Percorsi />
                <Attrezzatura />
                <Organizzatore />
                <IscrizioneForm ref={formRef} />
                <StickyCTA visible={stickyVisible} onScrollToForm={scrollToForm} />
                <Footer />
            </div>
        </>
    );
}