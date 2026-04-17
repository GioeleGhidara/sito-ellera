export type AlertLevel = "verde" | "gialla" | "arancione" | "rossa" | "sconosciuto";

export interface ZonePhenomena {
  pioggeDiffuse: boolean;
  temporali: boolean;
  neve: boolean;
  vento: boolean;
  mare: boolean;
  disagioFisiologico: boolean;
}

export interface ZoneAlert {
  level: AlertLevel;
  phenomena: ZonePhenomena;
  currentLevel?: AlertLevel;
  currentStartsAt?: string | null;
  currentEndsAt?: string | null;
  nextLevel?: AlertLevel | null;
  nextStartsAt?: string | null;
  nextEndsAt?: string | null;
  activeUntil?: string | null;
}

export interface ArpalData {
  message: string;
  messageSubtitle: string;
  timestamp: string;
  zones: Record<string, ZoneAlert>;
  mapImageUrl: string;
}

export interface ResolvedZoneAlertState {
  level: AlertLevel;
  startsAt: string | null;
  endsAt: string | null;
  nextLevel: AlertLevel | null;
  nextStartsAt: string | null;
  nextEndsAt: string | null;
  activeUntil: string | null;
}

export const ACTIVE_ALERT_LEVELS: AlertLevel[] = ["gialla", "arancione", "rossa"];

const ROME_TIMEZONE = "Europe/Rome";

export const isActiveAlertLevel = (level: AlertLevel | null | undefined): boolean =>
  level !== null && level !== undefined && ACTIVE_ALERT_LEVELS.includes(level);

export const formatAlertLevel = (level: AlertLevel): string =>
  level.charAt(0).toUpperCase() + level.slice(1);

const hasZoneTimingData = (zoneAlert: ZoneAlert | null | undefined): boolean =>
  Boolean(
    zoneAlert &&
    (
      zoneAlert.currentStartsAt ||
      zoneAlert.currentEndsAt ||
      zoneAlert.nextStartsAt ||
      zoneAlert.nextEndsAt ||
      zoneAlert.activeUntil
    ),
  );

export const hasArpalTimingData = (data: ArpalData | null | undefined): boolean =>
  Boolean(
    data?.zones &&
    Object.values(data.zones).some((zoneAlert) => hasZoneTimingData(zoneAlert)),
  );

export const resolveZoneAlertState = (
  zoneAlert: ZoneAlert | null | undefined,
  nowMs = Date.now(),
): ResolvedZoneAlertState | null => {
  if (!zoneAlert) return null;

  const fallbackLevel =
    zoneAlert.currentLevel && zoneAlert.currentLevel !== "sconosciuto"
      ? zoneAlert.currentLevel
      : zoneAlert.level;

  const currentStartsMs = zoneAlert.currentStartsAt ? new Date(zoneAlert.currentStartsAt).getTime() : null;
  const currentEndsMs = zoneAlert.currentEndsAt ? new Date(zoneAlert.currentEndsAt).getTime() : null;
  const nextStartsMs = zoneAlert.nextStartsAt ? new Date(zoneAlert.nextStartsAt).getTime() : null;
  const nextEndsMs = zoneAlert.nextEndsAt ? new Date(zoneAlert.nextEndsAt).getTime() : null;

  const isWithinCurrent =
    zoneAlert.currentLevel &&
    currentStartsMs !== null &&
    currentEndsMs !== null &&
    currentStartsMs <= nowMs &&
    nowMs < currentEndsMs;

  if (isWithinCurrent) {
    return {
      level: zoneAlert.currentLevel!,
      startsAt: zoneAlert.currentStartsAt ?? null,
      endsAt: zoneAlert.currentEndsAt ?? null,
      nextLevel: zoneAlert.nextLevel ?? null,
      nextStartsAt: zoneAlert.nextStartsAt ?? null,
      nextEndsAt: zoneAlert.nextEndsAt ?? null,
      activeUntil: zoneAlert.activeUntil ?? null,
    };
  }

  const isWithinNext =
    zoneAlert.nextLevel &&
    nextStartsMs !== null &&
    nextEndsMs !== null &&
    nextStartsMs <= nowMs &&
    nowMs < nextEndsMs;

  if (isWithinNext) {
    return {
      level: zoneAlert.nextLevel,
      startsAt: zoneAlert.nextStartsAt ?? null,
      endsAt: zoneAlert.nextEndsAt ?? null,
      nextLevel: null,
      nextStartsAt: null,
      nextEndsAt: null,
      activeUntil: zoneAlert.activeUntil ?? zoneAlert.nextEndsAt ?? null,
    };
  }

  return {
    level: fallbackLevel,
    startsAt: zoneAlert.currentStartsAt ?? null,
    endsAt: zoneAlert.currentEndsAt ?? null,
    nextLevel: zoneAlert.nextLevel ?? null,
    nextStartsAt: zoneAlert.nextStartsAt ?? null,
    nextEndsAt: zoneAlert.nextEndsAt ?? null,
    activeUntil: zoneAlert.activeUntil ?? null,
  };
};

const formatRomeDate = (iso: string) =>
  new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ROME_TIMEZONE,
  }).format(new Date(iso));

const formatRomeTime = (iso: string) =>
  new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ROME_TIMEZONE,
  }).format(new Date(iso));

const getRomeDayKey = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: ROME_TIMEZONE,
  }).format(new Date(iso));

export const formatAlertDateTime = (
  iso: string | null | undefined,
  now = new Date(),
): string | null => {
  if (!iso) return null;

  const sameDay = getRomeDayKey(iso) === getRomeDayKey(now.toISOString());
  return sameDay ? formatRomeTime(iso) : formatRomeDate(iso);
};

export const formatTimeUntil = (
  iso: string | null | undefined,
  nowMs = Date.now(),
): string | null => {
  if (!iso) return null;

  const diffMs = new Date(iso).getTime() - nowMs;
  if (!Number.isFinite(diffMs) || diffMs <= 0) return null;

  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return hours > 0 ? `tra ${days}g ${hours}h` : `tra ${days}g`;
  }

  if (hours > 0) {
    return minutes > 0 ? `tra ${hours}h ${minutes}m` : `tra ${hours}h`;
  }

  return minutes > 0 ? `tra ${minutes}m` : "meno di 1 ora";
};
