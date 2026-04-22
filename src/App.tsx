import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { ROUTES, eventDetailPath, tradizioneDetailPath } from "./lib/routes";

const queryClient = new QueryClient();

const Index = lazy(() => import("./pages/Index"));
const Trekking = lazy(() => import("./pages/Trekking"));
const AlbiTrailArea = lazy(() => import("./pages/AlbiTrailArea"));
const Meteo = lazy(() => import("./pages/Meteo"));
const TeatroBaloma = lazy(() => import("./pages/TeatroBaloma"));
const TeatroBalomaSupport = lazy(() => import("./pages/TeatroBalomaSupport"));
const GalleriaArte = lazy(() => import("./pages/GalleriaArte"));
const ChiSiamo = lazy(() => import("./pages/ChiSiamo"));
const Eventi = lazy(() => import("./pages/Eventi"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TrailDetail = lazy(() => import("./pages/TrailDetail"));
const Servizi = lazy(() => import("./pages/Servizi"));
const Tradizioni = lazy(() => import("./pages/Tradizioni"));
const TradizioneDetail = lazy(() => import("./pages/TradizioneDetail"));

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
  { path: ROUTES.comitato, element: <ChiSiamo /> },
  { path: ROUTES.chiSiamo, element: <Navigate to={ROUTES.comitato} replace /> },
  { path: ROUTES.eventi, element: <Eventi /> },
  {
    path: ROUTES.laPedaliamoInsieme2026,
    element: <StaticPageRedirect to="/la-pedaliamo-insieme-2026.html" />,
  },
  {
    path: "/eventi/albi-trail-ebike-fest",
    element: <StaticPageRedirect to="/albi-trail-ebike-fest.html" />,
  },
  { path: `${ROUTES.eventi}/:slug`, element: <EventDetail /> },
  { path: ROUTES.servizi, element: <Servizi /> },
  { path: ROUTES.tradizioni, element: <Tradizioni /> },
  { path: "/tradizioni/streghe", element: <Navigate to={tradizioneDetailPath("streghe-di-ellera")} replace /> },
  { path: `${ROUTES.tradizioni}/:slug`, element: <TradizioneDetail /> },
  { path: ROUTES.news, element: <News /> },
  { path: `${ROUTES.news}/:slug`, element: <NewsDetail /> },
  { path: "*", element: <NotFound /> },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {appRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
