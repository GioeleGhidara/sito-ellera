import type { EventItem } from "@/data/events";

/**
 * Generates an iCalendar (.ics) file content for a given event.
 */
export const generateIcsContent = (event: EventItem): string => {
  const sanitize = (str: string) => str.replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  
  // Format dates: YYYYMMDD
  // Since we don't always have hours, we'll treat them as all-day events unless we can find a time
  const startDate = event.startDate.replace(/-/g, "");
  
  // If there's an end date, use it; otherwise, use the next day for a 1-day event
  let endDate = startDate;
  if (event.endDate) {
    // ICS DTEND for all-day events is non-inclusive, so we add 1 day to the end date
    const date = new Date(event.endDate);
    date.setDate(date.getDate() + 1);
    endDate = date.toISOString().split("T")[0].replace(/-/g, "");
  } else {
    const date = new Date(event.startDate);
    date.setDate(date.getDate() + 1);
    endDate = date.toISOString().split("T")[0].replace(/-/g, "");
  }

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ellera Borgo d'Arte//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@ellera.it`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${sanitize(event.title)}`,
    `DESCRIPTION:${sanitize(event.desc + (event.detailContent ? "\n\n" + event.detailContent : ""))}`,
    `LOCATION:${sanitize(event.location)}`,
    `STATUS:${event.status === "Cancellato" ? "CANCELLED" : "CONFIRMED"}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
};

/**
 * Triggers a browser download for the ICS file.
 */
export const downloadIcs = (event: EventItem) => {
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${event.slug}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
