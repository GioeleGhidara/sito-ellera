import { useState, useEffect } from "react";

interface NavigationProps {
    onScrollToForm: () => void;
}

export function Navigation({ onScrollToForm }: NavigationProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [siteMenuOpen, setSiteMenuOpen] = useState(false);

    const closeDrawer = () => { setDrawerOpen(false); document.body.style.overflow = ""; };
    const openDrawer = () => { setDrawerOpen(true); document.body.style.overflow = "hidden"; };

    useEffect(() => {
        // Cleanup function: ripristina lo scroll se il componente viene smontato
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <>
            {/* ── MOBILE DRAWER ── */}
            <div className={`nav-drawer ${drawerOpen ? "open" : ""}`}>
                <a href="#ebike-info" onClick={closeDrawer}>L'Evento</a>
                <a href="#ebike-programma" onClick={closeDrawer}>Programma</a>
                <a href="#ebike-percorsi" onClick={closeDrawer}>Percorsi</a>
                <a href="/" onClick={closeDrawer} style={{ fontSize: "1.2rem", color: "var(--grey-lt)" }}>← ellera.it</a>
                <a href="/eventi" onClick={closeDrawer} style={{ fontSize: "1.2rem", color: "var(--grey-lt)" }}>Prossimi eventi</a>
                <button className="drawer-cta" onClick={() => { closeDrawer(); onScrollToForm(); }}>Iscriviti ora</button>
            </div>

            {/* ── SITE MENU (desktop bottom-left) ── */}
            <div className={`site-menu-wrap ${siteMenuOpen ? "open" : ""}`}>
                <div className="site-menu-links">
                    <a href="/" className="site-menu-link">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M6.5 1.5L2.5 5L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ellera.it
                    </a>
                    <a href="/eventi" className="site-menu-link">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1.5" y="2" width="7" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M3.5 1v2M6.5 1v2M1.5 4.5h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                        Prossimi eventi
                    </a>
                    <a href="/la-pedaliamo-insieme-2026" className="site-menu-link">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" /><path d="M5 3v2l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                        La Pedaliamo Insieme
                    </a>
                    <a href="/albi-trail-area" className="site-menu-link">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L4.5 3.5L6.5 6L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Albi Trail Area
                    </a>
                </div>
                <button className="site-menu-toggle" onClick={() => setSiteMenuOpen(o => !o)}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ellera.it
                </button>
            </div>

            {/* ── NAV ── */}
            <nav className="ebike-nav">
                <div className="nav-logo">
                    Albi Trail<span style={{ color: "var(--red-warm)", marginLeft: "0.15em" }}>E-Bike&nbsp;Fest</span>
                </div>
                <ul className="ebike-nav-links">
                    <li><a href="#ebike-info">L'Evento</a></li>
                    <li><a href="#ebike-programma">Programma</a></li>
                    <li><a href="#ebike-percorsi">Percorsi</a></li>
                    <li><a href="#ebike-attrezzatura">Cosa portare</a></li>
                </ul>
                <button className="nav-cta" onClick={onScrollToForm}>Iscriviti</button>
                <button className={`nav-hamburger ${drawerOpen ? "open" : ""}`} onClick={drawerOpen ? closeDrawer : openDrawer} aria-label="Menu">
                    <span /><span /><span />
                </button>
            </nav>
        </>
    );
}
