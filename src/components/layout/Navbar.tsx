import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, MapPin } from "@/lib/icons";
import { logoComitatoRidotto } from "@/assets/images";
import { ROUTES, serviziSectionPath } from "@/lib/routes";

const WeatherWidget = lazy(() => import("@/components/features/weather/WeatherWidget"));

const navItems = [
  {
    label: "Il Borgo",
    children: [
      { label: "Galleria a cielo aperto", to: ROUTES.galleriaArte },
      { label: "Storia", to: ROUTES.storia },
      { label: "Teatro Balomà", to: ROUTES.teatroBaloma },
      { label: "Tradizioni", to: ROUTES.tradizioni },
    ],
  },
  {
    label: "Outdoor",
    children: [
      { label: "Trekking", to: ROUTES.trekking },
      { label: "Albi Trail Area", to: ROUTES.albiTrailArea },
      { label: "Meteo e Allerte", to: ROUTES.meteo },
    ],
  },
  { label: "Eventi", to: ROUTES.eventi },
  { label: "News", to: ROUTES.news },
  {
    label: "Servizi",
    to: ROUTES.servizi,
    children: [
      { label: "Bus", to: serviziSectionPath("bus") },
      { label: "Dove mangiare", to: serviziSectionPath("mangiare") },
      { label: "Negozi", to: serviziSectionPath("negozi") },
    ],
  },
  {
    label: "Chi siamo",
    to: ROUTES.comitato,
  },
];

interface NavbarProps {
  hideOnScroll?: boolean;
  hideAfterHero?: boolean;
  heroSelector?: string;
  showOnlyAtTop?: boolean;
}

const Navbar = ({
  hideOnScroll = false,
  hideAfterHero = false,
  heroSelector = ".hero",
  showOnlyAtTop = false,
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.scrollY > 20;
  });
  const [isHidden, setIsHidden] = useState(() => {
    if (typeof window === "undefined") return false;
    return showOnlyAtTop ? window.scrollY > 0 : false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownCloseTimeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const transparentNavTextShadow = "[text-shadow:0_1px_2px_rgba(0,0,0,0.7)]";

  const clearDropdownCloseTimeout = () => {
    if (dropdownCloseTimeoutRef.current !== null) {
      window.clearTimeout(dropdownCloseTimeoutRef.current);
      dropdownCloseTimeoutRef.current = null;
    }
  };

  const openDesktopDropdown = (label: string) => {
    clearDropdownCloseTimeout();
    setOpenDropdown(label);
  };

  const closeDesktopDropdown = () => {
    clearDropdownCloseTimeout();
    dropdownCloseTimeoutRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
      dropdownCloseTimeoutRef.current = null;
    }, 180);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!showOnlyAtTop) {
      return;
    }

    const handleTopOnlyVisibility = () => {
      setIsHidden(window.scrollY > 0 && !mobileOpen);
    };

    handleTopOnlyVisibility();
    window.addEventListener("scroll", handleTopOnlyVisibility, { passive: true });
    return () => window.removeEventListener("scroll", handleTopOnlyVisibility);
  }, [showOnlyAtTop, mobileOpen]);

  useEffect(() => {
    if (hideAfterHero || !hideOnScroll) {
      if (!hideAfterHero && !showOnlyAtTop) {
        setIsHidden(false);
      }
      return;
    }

    let lastScrollY = window.scrollY;

    const handleDirectionScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 20 || mobileOpen) {
        setIsHidden(false);
      } else if (delta > 4) {
        setIsHidden(true);
      } else if (delta < -4) {
        setIsHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleDirectionScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleDirectionScroll);
  }, [hideOnScroll, hideAfterHero, showOnlyAtTop, mobileOpen]);

  useEffect(() => {
    if (!hideAfterHero || showOnlyAtTop) {
      return;
    }

    const updateVisibilityByHero = () => {
      if (mobileOpen) {
        setIsHidden(false);
        return;
      }

      const hero = document.querySelector<HTMLElement>(heroSelector);
      if (!hero) {
        setIsHidden(false);
        return;
      }

      setIsHidden(hero.getBoundingClientRect().bottom <= 0);
    };

    const rafId = window.requestAnimationFrame(updateVisibilityByHero);
    window.addEventListener("scroll", updateVisibilityByHero, { passive: true });
    window.addEventListener("resize", updateVisibilityByHero);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateVisibilityByHero);
      window.removeEventListener("resize", updateVisibilityByHero);
    };
  }, [hideAfterHero, heroSelector, showOnlyAtTop, mobileOpen, location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
    if (dropdownCloseTimeoutRef.current !== null) {
      window.clearTimeout(dropdownCloseTimeoutRef.current);
      dropdownCloseTimeoutRef.current = null;
    }
    setOpenDropdown(null);
    setIsHidden(showOnlyAtTop ? window.scrollY > 0 : false);
  }, [location, showOnlyAtTop]);

  useEffect(() => {
    return () => {
      if (dropdownCloseTimeoutRef.current !== null) {
        window.clearTimeout(dropdownCloseTimeoutRef.current);
        dropdownCloseTimeoutRef.current = null;
      }
    };
  }, []);

  const parseTo = (to: string) => {
    const [path, hash] = to.split("#");
    return {
      path,
      hash: hash ? `#${hash}` : "",
    };
  };

  const isLinkActive = (to: string) => {
    const target = parseTo(to);
    if (target.hash) {
      return location.pathname === target.path && location.hash === target.hash;
    }

    return location.pathname === target.path;
  };

  // Check if any child of a dropdown is active
  const isDropdownActive = (children: { to: string }[]) =>
    children.some((c) => {
      const target = parseTo(c.to);
      return location.pathname.startsWith(target.path);
    });

  const effectiveScrolled = showOnlyAtTop ? false : isScrolled;

  // Determine navbar background
  const getNavBg = () => {
    if (effectiveScrolled) return "bg-card/95 backdrop-blur-md shadow-lg border-b border-border";
    return "bg-transparent";
  };

  // Text colors when not scrolled
  const getTextColor = (active = false) => {
    if (effectiveScrolled) {
      return active ? "text-primary bg-secondary" : "text-foreground hover:text-primary hover:bg-secondary";
    }
    return active
      ? `text-primary-foreground bg-primary-foreground/10`
      : `text-primary-foreground/90 ${transparentNavTextShadow} hover:text-primary-foreground hover:bg-primary-foreground/10`;
  };

  const resolvedDesktopCommitteeTextColor = effectiveScrolled
    ? "text-foreground"
    : `text-primary-foreground/90 ${transparentNavTextShadow}`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${mobileOpen ? "bg-card shadow-lg border-b border-border" : getNavBg()} ${(hideOnScroll || hideAfterHero || showOnlyAtTop) && isHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative flex items-center justify-between h-16 lg:h-20">
          {mobileOpen ? (
            <div className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <img src={logoComitatoRidotto} alt="Logo Comitato Ellerese" className="h-10 w-10" />
            </div>
          ) : (
            <div className="flex items-center min-w-[180px]">
              <div className={`transition-all duration-500 ${effectiveScrolled || mobileOpen ? "opacity-0 invisible absolute -translate-x-4" : "opacity-100 visible translate-x-0"}`}>
                <Suspense fallback={<div className="h-10 w-32 bg-muted/20 animate-pulse rounded-full" />}>
                  <WeatherWidget variant="compact" />
                </Suspense>
              </div>
              <Link 
                to={ROUTES.home} 
                className={`flex flex-col items-start transition-all duration-500 ${
                  effectiveScrolled || mobileOpen 
                    ? "opacity-100 visible translate-x-0" 
                    : "opacity-0 invisible absolute translate-x-4"
                }`}
              >
                <span className="text-xl lg:text-2xl font-heading font-bold text-primary leading-tight">
                  Ellera
                </span>
                <span className="text-[10px] lg:text-xs font-medium tracking-wider uppercase text-muted-foreground leading-tight">
                  Galleria a cielo aperto & Outdoor
                </span>
              </Link>
            </div>
          )}

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                (() => {
                  const isActive = isDropdownActive(item.children) || (item.to ? isLinkActive(item.to) : false);

                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => openDesktopDropdown(item.label)}
                      onMouseLeave={closeDesktopDropdown}
                    >
                      {item.to ? (
                        <div className="flex items-center">
                          <Link
                            to={item.to}
                            className={`flex items-center px-4 py-2 rounded-l-md text-sm font-medium transition-colors ${getTextColor(isActive)}`}
                          >
                            {item.label}
                          </Link>
                          <button
                            type="button"
                            aria-label={`Apri sottomenu ${item.label}`}
                            aria-expanded={openDropdown === item.label}
                            onClick={() =>
                              setOpenDropdown(openDropdown === item.label ? null : item.label)
                            }
                            className={`flex items-center px-2 py-2 rounded-r-md text-sm font-medium transition-colors ${getTextColor(isActive)}`}
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${getTextColor(isActive)}`}
                        >
                          {item.label}
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {openDropdown === item.label && (
                        <div className="absolute left-0 top-full z-50 pt-1">
                          <div className="w-52 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
                            {item.children.map((child) => (
                              <Link
                                key={child.to}
                                to={child.to}
                                className={`block px-4 py-3 text-sm transition-colors ${
                                  isLinkActive(child.to)
                                    ? "text-primary bg-secondary"
                                    : "text-foreground hover:bg-secondary hover:text-primary"
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <Link
                  key={item.to}
                  to={item.to!}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getTextColor(isLinkActive(item.to!))}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Logo Comitato - desktop */}
          <div className="hidden lg:flex items-center gap-2 ml-2 pl-2">
            <span className={`text-sm font-medium transition-colors ${resolvedDesktopCommitteeTextColor}`}>
              Comitato Ellerese
            </span>
            <img src={logoComitatoRidotto} alt="Logo Comitato Ellerese" className="h-12 w-12" />
          </div>

      {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            className={`lg:hidden ml-auto p-2 rounded-md ${effectiveScrolled || mobileOpen ? "text-foreground" : "text-primary-foreground"}`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-b border-border overflow-hidden">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) =>
              item.children ? (
                (() => {
                  const isActive = isDropdownActive(item.children) || (item.to ? isLinkActive(item.to) : false);

                  return (
                    <div key={item.label}>
                      {item.to ? (
                        <div className="flex items-center gap-1">
                          <Link
                            to={item.to}
                            className={`flex-1 px-3 py-2.5 font-medium rounded-md hover:bg-secondary ${
                              isActive ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {item.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenDropdown(openDropdown === item.label ? null : item.label)
                            }
                            aria-label={`Apri sottomenu ${item.label}`}
                            aria-expanded={openDropdown === item.label}
                            className="flex items-center justify-center px-3 py-2.5 text-foreground rounded-md hover:bg-secondary"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                            />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDropdown(openDropdown === item.label ? null : item.label)
                          }
                          className="flex items-center justify-between w-full px-3 py-2.5 text-foreground rounded-md hover:bg-secondary"
                        >
                          <span className="font-medium">{item.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}
                      {openDropdown === item.label && (
                        <div className="overflow-hidden">
                          {item.children.map((child) => (
                            <Link
                              key={child.to}
                              to={child.to}
                              className={`block px-6 py-2.5 text-sm ${
                                isLinkActive(child.to)
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground hover:text-primary"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <Link
                  key={item.to}
                  to={item.to!}
                  className={`block px-3 py-2.5 font-medium rounded-md hover:bg-secondary ${
                    isLinkActive(item.to!) ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


