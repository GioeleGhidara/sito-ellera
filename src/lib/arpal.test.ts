import { describe, expect, it } from "vitest";
import {
  formatAlertDateTime,
  formatTimeUntil,
  hasArpalTimingData,
  resolveZoneAlertState,
  type ArpalData,
  type ZoneAlert,
} from "./arpal";

describe("resolveZoneAlertState", () => {
  it("returns null when there is no zone alert", () => {
    expect(resolveZoneAlertState(null)).toBeNull();
    expect(resolveZoneAlertState(undefined)).toBeNull();
  });

  it("returns the current alert when now falls within its window", () => {
    const zoneAlert: ZoneAlert = {
      level: "verde",
      phenomena: { pioggeDiffuse: false, temporali: false, neve: false, vento: false, mare: false, disagioFisiologico: false },
      currentLevel: "arancione",
      currentStartsAt: "2026-01-01T08:00:00Z",
      currentEndsAt: "2026-01-01T20:00:00Z",
      nextLevel: "gialla",
      nextStartsAt: "2026-01-01T20:00:00Z",
      nextEndsAt: "2026-01-02T08:00:00Z",
    };
    const nowMs = new Date("2026-01-01T12:00:00Z").getTime();

    const resolved = resolveZoneAlertState(zoneAlert, nowMs);

    expect(resolved?.level).toBe("arancione");
    expect(resolved?.endsAt).toBe("2026-01-01T20:00:00Z");
    expect(resolved?.nextLevel).toBe("gialla");
  });

  it("falls forward to the next alert once the current window has elapsed", () => {
    const zoneAlert: ZoneAlert = {
      level: "verde",
      phenomena: { pioggeDiffuse: false, temporali: false, neve: false, vento: false, mare: false, disagioFisiologico: false },
      currentLevel: "arancione",
      currentStartsAt: "2026-01-01T08:00:00Z",
      currentEndsAt: "2026-01-01T20:00:00Z",
      nextLevel: "gialla",
      nextStartsAt: "2026-01-01T20:00:00Z",
      nextEndsAt: "2026-01-02T08:00:00Z",
    };
    const nowMs = new Date("2026-01-01T23:00:00Z").getTime();

    const resolved = resolveZoneAlertState(zoneAlert, nowMs);

    expect(resolved?.level).toBe("gialla");
    expect(resolved?.nextLevel).toBeNull();
    expect(resolved?.activeUntil).toBe("2026-01-02T08:00:00Z");
  });

  it("falls back to currentLevel outside of any known window", () => {
    const zoneAlert: ZoneAlert = {
      level: "verde",
      phenomena: { pioggeDiffuse: false, temporali: false, neve: false, vento: false, mare: false, disagioFisiologico: false },
      currentLevel: "gialla",
    };

    const resolved = resolveZoneAlertState(zoneAlert, Date.now());

    expect(resolved?.level).toBe("gialla");
  });

  it("falls back to the base level when currentLevel is unknown", () => {
    const zoneAlert: ZoneAlert = {
      level: "verde",
      phenomena: { pioggeDiffuse: false, temporali: false, neve: false, vento: false, mare: false, disagioFisiologico: false },
      currentLevel: "sconosciuto",
    };

    const resolved = resolveZoneAlertState(zoneAlert, Date.now());

    expect(resolved?.level).toBe("verde");
  });
});

describe("hasArpalTimingData", () => {
  it("returns false for missing data", () => {
    expect(hasArpalTimingData(null)).toBe(false);
    expect(hasArpalTimingData(undefined)).toBe(false);
  });

  it("returns false when no zone carries timing information", () => {
    const data: ArpalData = {
      message: "",
      messageSubtitle: "",
      timestamp: "",
      mapImageUrl: "",
      zones: {
        B: { level: "verde", phenomena: { pioggeDiffuse: false, temporali: false, neve: false, vento: false, mare: false, disagioFisiologico: false } },
      },
    };

    expect(hasArpalTimingData(data)).toBe(false);
  });

  it("returns true when at least one zone has timing information", () => {
    const data: ArpalData = {
      message: "",
      messageSubtitle: "",
      timestamp: "",
      mapImageUrl: "",
      zones: {
        B: {
          level: "gialla",
          phenomena: { pioggeDiffuse: false, temporali: false, neve: false, vento: false, mare: false, disagioFisiologico: false },
          currentStartsAt: "2026-01-01T08:00:00Z",
        },
      },
    };

    expect(hasArpalTimingData(data)).toBe(true);
  });
});

describe("formatTimeUntil", () => {
  const nowMs = new Date("2026-01-01T10:00:00Z").getTime();

  it("returns null for a missing or past timestamp", () => {
    expect(formatTimeUntil(null, nowMs)).toBeNull();
    expect(formatTimeUntil("2026-01-01T09:00:00Z", nowMs)).toBeNull();
  });

  it("formats minutes, hours and days appropriately", () => {
    expect(formatTimeUntil("2026-01-01T10:30:00Z", nowMs)).toBe("tra 30m");
    expect(formatTimeUntil("2026-01-01T13:15:00Z", nowMs)).toBe("tra 3h 15m");
    expect(formatTimeUntil("2026-01-04T10:00:00Z", nowMs)).toBe("tra 3g");
  });
});

describe("formatAlertDateTime", () => {
  it("returns null for a missing timestamp", () => {
    expect(formatAlertDateTime(null)).toBeNull();
  });

  it("shows only the time when the alert is on the same Rome-local day", () => {
    const now = new Date("2026-06-15T10:00:00+02:00");
    const result = formatAlertDateTime("2026-06-15T18:30:00+02:00", now);
    expect(result).toBe("18:30");
  });

  it("shows date and time when the alert falls on a different day", () => {
    const now = new Date("2026-06-15T10:00:00+02:00");
    const result = formatAlertDateTime("2026-06-17T08:00:00+02:00", now);
    expect(result).toBe("17/06, 08:00");
  });
});
