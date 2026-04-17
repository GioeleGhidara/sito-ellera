import { useEffect, useRef, useState } from "react";

export function useScrollDirection(threshold = 10) {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const lastScrollYRef = useRef(0);
  const lastDirectionRef = useRef<"up" | "down">("up");

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollYRef.current;

      if (Math.abs(delta) < threshold) {
        return;
      }

      const nextDirection = delta > 0 ? "down" : "up";
      lastScrollYRef.current = scrollY > 0 ? scrollY : 0;

      if (scrollY <= threshold) {
        lastDirectionRef.current = "up";
        setScrollDirection("up");
        return;
      }

      if (lastDirectionRef.current !== nextDirection) {
        lastDirectionRef.current = nextDirection;
        setScrollDirection(nextDirection);
      }
    };

    window.addEventListener("scroll", updateScrollDirection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [threshold]);

  return scrollDirection;
}
