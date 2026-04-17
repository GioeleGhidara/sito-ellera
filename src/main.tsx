import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { toast } from "@/components/ui/sonner";
import App from "./App.tsx";
import "./index.css";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const isLocalhost = LOCAL_HOSTS.has(window.location.hostname);

if (isLocalhost) {
  if ("serviceWorker" in navigator) {
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        void registration.unregister();
      });
    });
  }

  if ("caches" in window) {
    void caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        void caches.delete(cacheName);
      });
    });
  }
} else if (import.meta.env.PROD) {
  registerSW({
    onOfflineReady() {
      toast.success("App pronta per l'uso offline");
    },
  });
}

createRoot(document.getElementById("root")!).render(<App />);
