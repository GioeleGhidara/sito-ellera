import { lazy, Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { ROUTES, tradizioneDetailPath } from "./lib/routes";

const queryClient = new QueryClient();

import Index from "./pages/core/Index";

const Trekking = lazy(() => import("./pages/trails/Trekking"));
const AlbiTrailArea = lazy(() => import("./pages/trails/AlbiTrailArea"));
const Meteo = lazy(() => import("./pages/core/Meteo"));
const TeatroBaloma = lazy(() => import("./pages/culture/TeatroBaloma"));
const TeatroBalomaSupport = lazy(() => import("./pages/culture/TeatroBalomaSupport"));
const GalleriaArte = lazy(() => import("./pages/culture/GalleriaArte"));
const ChiSiamo = lazy(() => import("./pages/core/ChiSiamo"));
const Storia = lazy(() => import("./pages/culture/Storia"));
const Eventi = lazy(() => import("./pages/events/Eventi"));
const EventDetail = lazy(() => import("./pages/events/EventDetail"));
const News = lazy(() => import("./pages/core/News"));
const NewsDetail = lazy(() => import("./pages/core/NewsDetail"));
const NotFound = lazy(() => import("./pages/core/NotFound"));
const TrailDetail = lazy(() => import("./pages/trails/TrailDetail"));
const Servizi = lazy(() => import("./pages/core/Servizi"));
const Tradizioni = lazy(() => import("./pages/culture/Tradizioni"));
const TradizioneDetail = lazy(() => import("./pages/culture/TradizioneDetail"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const Regolamento = lazy(() => import("./pages/legal/Regolamento"));
const CaruggiELanterne = lazy(() => import("./pages/events/CaruggiELanterne"));

const CaruggiELanterne2026 = lazy(() => import("./pages/events/archive/CaruggiELanterne2026"));
const AlbiTrailEbikeFest2026 = lazy(() => import("./pages/events/archive/AlbiTrailEbikeFest2026"));

const RouteFallback = () => (
  <section className="min-h-screen bg-background flex flex-col items-center p-4 lg:p-8 space-y-8 animate-pulse">
    <div className="w-full h-16 lg:h-20 bg-muted/10 rounded-md" />
    <div className="w-full max-w-5xl h-64 lg:h-96 bg-muted/10 rounded-lg" />
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="h-48 bg-muted/10 rounded-lg" />
      <div className="h-48 bg-muted/10 rounded-lg hidden md:block" />
      <div className="h-48 bg-muted/10 rounded-lg hidden lg:block" />
    </div>
  </section>
);

const StaticPageRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return <RouteFallback />;
};

const appRoutes: { path: string; element: JSX.Element }[] = [
  { path: ROUTES.home, element: <Index /> },
  { path: ROUTES.trekking, element: <Trekking /> },
  { path: ROUTES.albiTrailArea, element: <AlbiTrailArea /> },
  { path: ROUTES.meteo, element: <Meteo /> },
  { path: `${ROUTES.mtb}/:slug`, element: <TrailDetail /> },
  { path: ROUTES.teatroBaloma, element: <TeatroBaloma /> },
  { path: ROUTES.teatroBalomaSupport, element: <TeatroBalomaSupport /> },
  { path: ROUTES.galleriaArte, element: <GalleriaArte /> },
  { path: ROUTES.storia, element: <Storia /> },
  { path: ROUTES.comitato, element: <ChiSiamo /> },
  { path: ROUTES.chiSiamo, element: <Navigate to={ROUTES.comitato} replace /> },
  { path: ROUTES.eventi, element: <Eventi /> },
  {
    path: ROUTES.laPedaliamoInsieme2026,
    element: <StaticPageRedirect to="/la-pedaliamo-insieme-2026.html" />,
  },
  {
    path: ROUTES.albiTrailEbikeFestLegacy,
    element: <Navigate to={ROUTES.albiTrailEbikeFest} replace />,
  },
  { path: `${ROUTES.eventi}/:slug`, element: <EventDetail /> },
  { path: ROUTES.servizi, element: <Servizi /> },
  { path: ROUTES.tradizioni, element: <Tradizioni /> },
  { path: ROUTES.tradizioniStregheLegacy, element: <Navigate to={tradizioneDetailPath("streghe-di-ellera")} replace /> },
  { path: `${ROUTES.tradizioni}/:slug`, element: <TradizioneDetail /> },
  { path: ROUTES.news, element: <News /> },
  { path: `${ROUTES.news}/:slug`, element: <NewsDetail /> },
  { path: ROUTES.albiTrailEbikeFest, element: <Navigate to={ROUTES.archivioAlbiTrailEbikeFest2026} replace /> },
  { path: ROUTES.caruggiELanterne, element: <CaruggiELanterne /> },
  { path: ROUTES.archivioCaruggiELanterne2026, element: <CaruggiELanterne2026 /> },
  { path: ROUTES.archivioAlbiTrailEbikeFest2026, element: <AlbiTrailEbikeFest2026 /> },
  { path: ROUTES.privacy, element: <Privacy /> },
  { path: ROUTES.regolamento, element: <Regolamento /> },
  { path: "*", element: <NotFound /> },
];

const Layout = () => (
  <>
    <ScrollRestoration />
    <ScrollToTop />
    <Suspense fallback={<RouteFallback />}>
      <Outlet />
    </Suspense>
  </>
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: appRoutes.map(r => ({ path: r.path, element: r.element })),
  }
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
    v7_startTransition: true,
  }
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </TooltipProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
