import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

type RuntimeRequest = {
  destination: string;
};

type RuntimeCachingContext = {
  request: RuntimeRequest;
  url: URL;
};

type GlobalScopeWithLocation = typeof globalThis & {
  location?: {
    origin?: string;
  };
};

const runtimeScope = globalThis as GlobalScopeWithLocation;

const isSameOrigin = ({ url }: Pick<RuntimeCachingContext, "url">) =>
  url.origin === runtimeScope.location?.origin;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "placeholder.svg",
        "tracks/**/*.gpx",
        "loghi/**/*.svg",
      ],
      manifest: {
        name: "Ellera",
        short_name: "Ellera",
        theme_color: "#1a2540",
        background_color: "#1a2540",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,avif,gif,woff2,gpx}"],
        maximumFileSizeToCacheInBytes: 5_000_000,
        runtimeCaching: [
          {
            urlPattern: ({ request, url }: RuntimeCachingContext) =>
              isSameOrigin({ url }) &&
              ["script", "style", "document", "image"].includes(request.destination),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-assets",
              expiration: {
                maxEntries: 400,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ url }: Pick<RuntimeCachingContext, "url">) =>
              isSameOrigin({ url }) && /^\/tracks\/.*\.gpx$/i.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "gpx-tracks",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ url }) => /(^|\.)tile\.openstreetmap\.org$/i.test(url.hostname),
            handler: "CacheFirst",
            options: {
              cacheName: "osm-tiles",
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ url }) => url.hostname === "api.open-meteo.com",
            handler: "NetworkFirst",
            options: {
              cacheName: "open-meteo-api",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60,
              },
              networkTimeoutSeconds: 8,
            },
          },
        ],
        cleanupOutdatedCaches: true,
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
