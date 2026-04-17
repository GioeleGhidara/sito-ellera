import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MapFallbackProps {
  className?: string;
}

const MapFallback = ({ className }: MapFallbackProps) => (
  <Skeleton className={cn("h-[400px] w-full rounded-2xl", className)} />
);

export default MapFallback;
