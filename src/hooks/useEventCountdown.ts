import { useEffect, useState } from "react";

/**
 * Hook to calculate and update the countdown to an event.
 * @param startDate ISO date string of the event start
 * @param dateToBeConfirmed Boolean flag if date is not yet final
 * @returns Object with label, short label and isToday flag, or null if event passed or date TBD
 */
export const useEventCountdown = (startDate: string, dateToBeConfirmed?: boolean) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (dateToBeConfirmed) {
      return;
    }

    const intervalId = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(intervalId);
  }, [dateToBeConfirmed]);

  if (dateToBeConfirmed) {
    return null;
  }

  const eventDay = new Date(`${startDate}T00:00:00`);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const diffMs = eventDay.getTime() - now.getTime();
  const isEventToday = eventDay.getTime() === todayStart.getTime();

  if (diffMs <= 0 && !isEventToday) {
    return null;
  }

  if (isEventToday) {
    return { label: "- 00 | 00 | 00 | 00", short: "oggi!", isToday: true };
  }

  const safeDiffMs = Math.max(diffMs, 0);
  const totalSeconds = Math.floor(safeDiffMs / 1_000);
  const diffDays = Math.floor(totalSeconds / 86_400);
  const hh = String(Math.floor((totalSeconds % 86_400) / 3_600)).padStart(2, "0");
  const mm = String(Math.floor((totalSeconds % 3_600) / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  const dd = String(diffDays).padStart(2, "0");

  return {
    label: `- ${dd} | ${hh} | ${mm} | ${ss}`,
    short: `-${diffDays} gg`,
    isToday: false,
  };
};
