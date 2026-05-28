import type { EventItem } from "@/data/events/events";

/**
 * Generates an iCalendar (.ics) file content for a given event.
 */
export const generateIcsContent = (event: EventItem): string => {
  const sanitize = (str: string) => str.replace(/\r/g, "").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  
  const startStr = event.startDate.replace(/-/g, "");
  const endStr = event.endDate ? event.endDate.replace(/-/g, "") : startStr;

  const formatTime = (timeStr?: string, defaultTime = "090000") => {
    return timeStr ? timeStr.replace(/:/g, "") + "00" : defaultTime;
  };

  const dtStart = `${startStr}T${formatTime(event.startTime, "090000")}`;
  const dtEnd = `${endStr}T${formatTime(event.endTime, "230000")}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ellera//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@ellera.it`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${sanitize(event.title)}`,
    `DESCRIPTION:${sanitize(event.desc + (event.detailContent ? "\n\n" + event.detailContent : ""))}`,
    `LOCATION:${sanitize(event.location)}`,
    `STATUS:${event.status === "Cancellato" ? "CANCELLED" : "CONFIRMED"}`,
    "TRANSP:OPAQUE",
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
