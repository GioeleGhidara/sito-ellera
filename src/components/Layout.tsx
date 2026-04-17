import { lazy, Suspense } from "react";
import Navbar from "./Navbar";

const Footer = lazy(() => import("./Footer"));
const SeasonalEffects = lazy(() => import("./SeasonalEffects"));
const FloatingContact = lazy(() => import("./FloatingContact"));
const InstallPrompt = lazy(() => import("./InstallPrompt"));

interface LayoutProps {
  children: React.ReactNode;
  navbarHideOnScroll?: boolean;
  navbarHideAfterHero?: boolean;
  navbarHeroSelector?: string;
  navbarShowOnlyAtTop?: boolean;
}

const Layout = ({
  children,
  navbarHideOnScroll = false,
  navbarHideAfterHero = false,
  navbarHeroSelector = ".hero",
  navbarShowOnlyAtTop = false,
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Suspense fallback={null}>
        <SeasonalEffects />
      </Suspense>
      <Navbar
        hideOnScroll={navbarHideOnScroll}
        hideAfterHero={navbarHideAfterHero}
        heroSelector={navbarHeroSelector}
        showOnlyAtTop={navbarShowOnlyAtTop}
      />
      <main className="relative flex-1 overflow-x-clip">{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <FloatingContact />
      </Suspense>
      <Suspense fallback={null}>
        <InstallPrompt />
      </Suspense>
    </div>
  );
};

export default Layout;
