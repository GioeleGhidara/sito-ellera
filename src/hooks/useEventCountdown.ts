import { useSyncExternalStore } from "react";

// Un singolo setInterval condiviso da tutte le istanze del countdown (invece di uno a card),
// così una lista con molti eventi non avvia N timer indipendenti che aggiornano N sotto-alberi al secondo.
let sharedNowMs = Date.now();
let intervalId: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

const tick = () => {
  sharedNowMs = Date.now();
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  if (intervalId === null) {
    intervalId = setInterval(tick, 1_000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
};

const getSnapshot = () => sharedNowMs;
const noopSubscribe = () => () => {};

const useSharedTickingNowMs = (enabled: boolean) =>
  useSyncExternalStore(enabled ? subscribe : noopSubscribe, getSnapshot);

/**
 * Hook to calculate and update the countdown to an event.
 * @param startDate ISO date string of the event start
 * @param dateToBeConfirmed Boolean flag if date is not yet final
 * @returns Object with label, short label and isToday flag, or null if event passed or date TBD
 */
export const useEventCountdown = (startDate: string, dateToBeConfirmed?: boolean) => {
  const nowMs = useSharedTickingNowMs(!dateToBeConfirmed);

  if (dateToBeConfirmed) {
    return null;
  }

  const now = new Date(nowMs);
  const eventDay = startDate.includes("T") ? new Date(startDate) : new Date(`${startDate}T00:00:00`);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const eventDayStart = new Date(eventDay);
  eventDayStart.setHours(0, 0, 0, 0);

  const diffMs = eventDay.getTime() - now.getTime();
  const isEventToday = eventDayStart.getTime() === todayStart.getTime();

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
