import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "@/lib/icons";
import { triggerHaptic, HAPTIC_PATTERNS } from "@/lib/haptics";
import { cn } from "@/lib/utils";

const FloatingContact = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      ticking = false;
      setIsScrolled(window.scrollY > 20);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(handleScroll);
    };

    handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    {
      icon: Mail,
      label: "Scrivici",
      href: "mailto:info@ellera.it",
      className: "bg-primary text-primary-foreground hover:opacity-90",
    },
    {
      icon: Facebook,
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61578504275210#",
      className: "bg-[hsl(220,46%,48%)] text-primary-foreground hover:opacity-90",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://www.instagram.com/comitatoellerese",
      className: "bg-[hsl(340,75%,55%)] text-primary-foreground hover:opacity-90",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-3">
      <button
        onClick={() => {
          triggerHaptic(HAPTIC_PATTERNS.LIGHT);
          setOpen(!open);
        }}
        aria-label={open ? "Chiudi contatti" : "Apri contatti"}
        className={`flex h-14 items-center justify-center gap-2 rounded-full text-accent-foreground shadow-lg transition-all hover:shadow-xl ${
          isScrolled
            ? "w-14 bg-accent md:w-auto md:px-5"
            : "bg-accent px-5"
        }`}
      >
        <Mail className={`w-6 h-6 transition-transform ${open ? "rotate-90" : ""}`} />
        <span className={`text-sm font-semibold ${isScrolled ? "hidden md:inline" : ""}`}>Scrivici</span>
      </button>

      {open && (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic(HAPTIC_PATTERNS.MEDIUM)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full shadow-md text-sm font-medium transition-opacity ${item.className}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingContact;
