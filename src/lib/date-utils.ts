/**
 * Formats an ISO date string into a long Italian date format
 * @param iso ISO date string
 * @returns Formatted date string (e.g. "5 maggio 2026")
 */
export const formatDateLong = (iso: string) =>
  new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
