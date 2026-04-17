import { Link, type To } from "react-router-dom";
import { ArrowLeft } from "@/lib/icons";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

interface FloatingBackLinkProps {
  to: To;
  label: string;
  desktopMode?: "fixed" | "inline";
  className?: string;
}

const FloatingBackLink = ({
  to,
  label,
  desktopMode = "inline",
  className,
}: FloatingBackLinkProps) => {
  const scrollDirection = useScrollDirection();
  const isHiddenOnMobile = scrollDirection === "down";

  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-4 py-2 text-sm font-medium text-muted-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-card hover:text-foreground",
        "fixed left-4 top-20 z-50",
        isHiddenOnMobile
          ? "-translate-y-[150%] opacity-0 pointer-events-none md:translate-y-0 md:opacity-100 md:pointer-events-auto"
          : "translate-y-0 opacity-100",
        desktopMode === "fixed"
          ? "md:left-6 md:top-24"
          : "md:static md:left-auto md:top-auto md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-accent md:shadow-none md:backdrop-blur-0",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
};

export default FloatingBackLink;
