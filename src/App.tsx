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

const Index = lazy(() => import("./pages/core/Index"));
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
const AlbiTrailEbikeFest = lazy(() => import("./pages/events/AlbiTrailEbikeFest"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const Regolamento = lazy(() => import("./pages/legal/Regolamento"));

const RouteFallback = () => (
  <section className="min-h-screen bg-background flex items-center justify-center">
    <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
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
    path: "/eventi/albi-trail-ebike-fest",
    element: <Navigate to="/albi-trail-ebike-fest" replace />,
  },
  { path: `${ROUTES.eventi}/:slug`, element: <EventDetail /> },
  { path: ROUTES.servizi, element: <Servizi /> },
  { path: ROUTES.tradizioni, element: <Tradizioni /> },
  { path: "/tradizioni/streghe", element: <Navigate to={tradizioneDetailPath("streghe-di-ellera")} replace /> },
  { path: `${ROUTES.tradizioni}/:slug`, element: <TradizioneDetail /> },
  { path: ROUTES.news, element: <News /> },
  { path: `${ROUTES.news}/:slug`, element: <NewsDetail /> },
  { path: "/albi-trail-ebike-fest", element: <AlbiTrailEbikeFest /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/regolamento", element: <Regolamento /> },
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
  }
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </TooltipProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
