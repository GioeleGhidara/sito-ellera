import { Handshake } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface EventOrganizerItem {
  name: string;
  role: string;
  logo: string;
  logoAlt: string;
  note?: string;
  highlight?: boolean;
}

interface EventOrganizerShowcaseProps {
  title?: string;
  subtitle?: string;
  items: EventOrganizerItem[];
  className?: string;
}

const EventOrganizerShowcase = ({
  title = "Organizzazione",
  subtitle,
  items,
  className,
}: EventOrganizerShowcaseProps) => {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Handshake className="h-5 w-5 text-accent" />
        <h2 className="font-heading text-2xl font-bold text-foreground">{title}</h2>
      </div>

      {subtitle && (
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}

      <div className={cn("grid gap-4", items.length > 1 ? "sm:grid-cols-2" : "grid-cols-1")}>
        {items.map((item) => (
          <div
            key={`${item.role}-${item.name}`}
            className={cn(
              "rounded-2xl border p-5 shadow-sm",
              item.highlight
                ? "border-accent/25 bg-accent/5"
                : "border-border bg-card/60 backdrop-blur-sm",
            )}
          >
            <div className="mb-4 flex h-14 items-center">
              <img
                src={item.logo}
                alt={item.logoAlt}
                className="max-h-14 w-auto max-w-[180px] object-contain"
                loading="lazy"
              />
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {item.role}
            </p>
            <p className="mt-2 text-base font-semibold text-foreground">{item.name}</p>

            {item.note && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventOrganizerShowcase;
