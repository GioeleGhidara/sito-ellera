import { EventCategory } from "@/data/events/events";

/**
 * Styling classes for event categories
 */
export const categoryClasses: Record<EventCategory, string> = {
  Cultura: "bg-secondary text-secondary-foreground",
  Outdoor: "bg-primary text-primary-foreground",
  Festa: "bg-accent text-accent-foreground",
  Teatro: "bg-[hsl(18,55%,20%)] text-[hsl(35,100%,92%)]",
  Altro: "bg-muted text-muted-foreground",
};

/**
 * Formats event dates into a displayable object
 */
export const formatEventDate = (
  startDate: string,
  endDate?: string,
  dateToBeConfirmed?: boolean,
) => {
  if (dateToBeConfirmed) {
    return { day: "TBD", month: "", weekday: "", full: "Data da definire" };
  }

  const sDate = new Date(`${startDate}T00:00:00`);
  const eDate = endDate ? new Date(`${endDate}T00:00:00`) : null;
  let day = sDate.toLocaleDateString("it-IT", { day: "2-digit" });

  if (eDate) {
    day =
      sDate.getMonth() === eDate.getMonth()
        ? `${sDate.getDate()}-${eDate.getDate()}`
        : `${sDate.getDate()}/${eDate.getDate()}`;
  }

  return {
    day,
    month: sDate.toLocaleDateString("it-IT", { month: "short" }),
    weekday: sDate.toLocaleDateString("it-IT", { weekday: "short" }),
    full: sDate.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
};
