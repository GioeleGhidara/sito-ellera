import { useEffect, useState } from "react";
import { Download, X } from "@/lib/icons";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_STORAGE_KEY = "ellera_install_prompt_dismissed_v1";
const SHOW_DELAY_MS = 30_000;
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

const InstallPrompt = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();

    const dismissed = window.localStorage.getItem(DISMISS_STORAGE_KEY) === "true";
    setIsDismissed(dismissed);
    setIsInstalled(isStandalone());
    setIsIos(/iphone|ipad|ipod/i.test(window.navigator.userAgent));

    const onBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsVisible(false);
    };

    mediaQuery.addEventListener("change", updateMobile);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      mediaQuery.removeEventListener("change", updateMobile);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (isDismissed || isInstalled || !isMobile) {
      setIsVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setIsVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isDismissed, isInstalled, isMobile]);

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_STORAGE_KEY, "true");
    setIsDismissed(true);
    setIsVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt || isInstalling) return;

    setIsInstalling(true);
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstalling(false);

    if (choice.outcome === "accepted") {
      dismiss();
    }
  };

  if (!isVisible || isDismissed || isInstalled || !isMobile) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[1200] md:hidden">
      <div className="relative rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur">
        <button
          type="button"
          aria-label="Chiudi banner installazione"
          onClick={dismiss}
          className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-sm font-semibold text-foreground">Installa Ellera sul tuo telefono</p>
        <p className="mt-1 pr-6 text-xs text-muted-foreground">
          {deferredPrompt
            ? "Accesso rapido a mappe, eventi e sentieri anche quando la connessione e instabile."
            : isIos
              ? "Su iPhone: apri Condividi e seleziona Aggiungi a Home."
              : "Puoi installare il sito dal menu del browser."}
        </p>

        <div className="mt-3 flex items-center gap-2">
          {deferredPrompt && (
            <button
              type="button"
              onClick={install}
              disabled={isInstalling}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" />
              {isInstalling ? "Attendi..." : "Installa"}
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Non ora
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
