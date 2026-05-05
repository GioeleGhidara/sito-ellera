import {
  Bike,
  CalendarDays,
  Leaf,
  Mountain,
  Palette,
  Sparkles,
  Utensils,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

const separatorIcons = [
  { icon: Leaf, className: "text-primary/75" },
  { icon: Bike, className: "text-accent" },
  { icon: Mountain, className: "text-primary" },
  { icon: Utensils, className: "text-accent/90" },
  { icon: Palette, className: "text-primary/85" },
  { icon: CalendarDays, className: "text-accent/85" },
  { icon: Sparkles, className: "text-primary/75" },
];

const DecorativeSeparator = () => {
  return (
    <div className="relative my-6 flex items-center justify-center lg:my-8">
      <div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-1.5 rounded-full border border-border/80 bg-background/95 px-3 py-2 shadow-sm backdrop-blur-sm lg:gap-2 lg:px-5">
        {separatorIcons.map((item, index) => (
          <span
            key={`${item.className}-${index}`}
            className={cn(
              "inline-flex items-center justify-center rounded-full border bg-card/70",
              index === 3
                ? "h-10 w-10 border-accent/20 shadow-sm"
                : "h-8 w-8 border-border/70",
            )}
          >
            <item.icon
              className={cn(
                index === 3 ? "h-[18px] w-[18px]" : "h-3.5 w-3.5",
                item.className,
              )}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

export default DecorativeSeparator;
