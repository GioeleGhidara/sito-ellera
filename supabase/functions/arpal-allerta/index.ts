const allowedOrigins = [
  "https://ellera.it",
  "https://www.ellera.it",
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:3000"
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowOrigin = allowedOrigins.includes(origin) ? origin : "https://ellera.it";
  
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

const ARPAL_URL = "https://allertaliguria.regione.liguria.it";
const REQUEST_TIMEOUT_MS = 10000;
const EDGE_CACHE_MS = 10 * 60 * 1000;
const ZONES = ["A", "B", "C", "D", "E"] as const;
const ROME_TIME_ZONE = "Europe/Rome";

function getSuccessHeaders(req: Request) {
  return {
    ...getCorsHeaders(req),
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=900",
  };
}

function getErrorHeaders(req: Request) {
  return {
    ...getCorsHeaders(req),
    "Content-Type": "application/json",
  };
}

let edgeCache: { response: ArpalResponse; at: number } | null = null;

interface ZonePhenomena {
  pioggeDiffuse: boolean;
  temporali: boolean;
  neve: boolean;
  vento: boolean;
  mare: boolean;
  disagioFisiologico: boolean;
}

interface ZoneAlert {
  level: "verde" | "gialla" | "arancione" | "rossa" | "sconosciuto";
  phenomena: ZonePhenomena;
  currentLevel?: "verde" | "gialla" | "arancione" | "rossa" | "sconosciuto";
  currentStartsAt?: string | null;
  currentEndsAt?: string | null;
  nextLevel?: "verde" | "gialla" | "arancione" | "rossa" | "sconosciuto" | null;
  nextStartsAt?: string | null;
  nextEndsAt?: string | null;
  activeUntil?: string | null;
}

interface ArpalResponse {
  success: boolean;
  data?: {
    message: string;
    messageSubtitle: string;
    timestamp: string;
    zones: Record<string, ZoneAlert>;
    mapImageUrl: string;
  };
  error?: string;
  cachedAt?: string;
}

const LEVEL_MAP: Record<string, ZoneAlert["level"]> = {
  V: "verde",
  G: "gialla",
  A: "arancione",
  R: "rossa",
};

const LEVEL_PRIORITY: Record<ZoneAlert["level"], number> = {
  sconosciuto: -1,
  verde: 0,
  gialla: 1,
  arancione: 2,
  rossa: 3,
};

interface ZoneInterval {
  level: ZoneAlert["level"];
  startsAt: string;
  endsAt: string;
}

function createEmptyPhenomena(): ZonePhenomena {
  return {
    pioggeDiffuse: false,
    temporali: false,
    neve: false,
    vento: false,
    mare: false,
    disagioFisiologico: false,
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function hasUsableData(
  levels: Record<string, ZoneAlert["level"]>,
  phenomena: Record<string, ZonePhenomena>,
  msgData: { message: string; subtitle: string; timestamp: string },
): boolean {
  const hasKnownLevels = Object.values(levels).some((level) => level !== "sconosciuto");
  const hasPhenomena = Object.values(phenomena).some((zone) =>
    Object.values(zone).some(Boolean)
  );
  const hasMessage = Boolean(msgData.message || msgData.subtitle || msgData.timestamp);

  return hasKnownLevels || hasPhenomena || hasMessage;
}

function extractMapImageUrl(html: string): string {
  const mapMatch = html.match(/\/?img\/mappe\/([VGAR_]+)\.png/i);
  if (!mapMatch) return "";

  return `${ARPAL_URL}/img/mappe/${mapMatch[1]}.png`;
}

function extractAlertLevels(html: string): Record<string, ZoneAlert["level"]> {
  const mapMatch = html.match(
    /img\/mappe\/([VGAR])_([VGAR])_([VGAR])_([VGAR])_([VGAR])\.png/i
  );
  const result: Record<string, ZoneAlert["level"]> = {};

  if (mapMatch) {
    ZONES.forEach((zone, i) => {
      result[zone] = LEVEL_MAP[mapMatch[i + 1].toUpperCase()] ?? "sconosciuto";
    });
  } else {
    ZONES.forEach((zone) => {
      result[zone] = "sconosciuto";
    });
  }

  return result;
}

function extractPhenomena(html: string): Record<string, ZonePhenomena> {
  const result: Record<string, ZonePhenomena> = {};

  ZONES.forEach((zone) => {
    result[zone] = createEmptyPhenomena();
  });

  const allBlocks = html.matchAll(
    /<!-- Rischi meteo zona ([A-E]) -->\s*<div class="al-container al-background-lightgray">([\s\S]*?)(?=<!-- Rischi meteo zona [A-E] -->|<\/div>\s*<\/div>\s*<\/div>\s*<div class="row|<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/gi
  );

  const zoneOccurrences: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };

  for (const match of allBlocks) {
    const zone = match[1].toUpperCase();
    const block = match[2];
    const occurrence = zoneOccurrences[zone]++;

    const cells = block.split("al-table-cell");
    const cellResults: boolean[] = [];
    for (let c = 1; c < cells.length; c++) {
      cellResults.push(cells[c].includes("spunta.png"));
    }

    if (occurrence === 0) {
      if (cellResults.length >= 1) result[zone].pioggeDiffuse = cellResults[0];
      if (cellResults.length >= 2) result[zone].temporali = cellResults[1];
      if (cellResults.length >= 3) result[zone].neve = cellResults[2];
    } else if (occurrence === 1) {
      if (cellResults.length >= 1) result[zone].vento = cellResults[0];
      if (cellResults.length >= 2) result[zone].mare = cellResults[1];
      if (cellResults.length >= 3) result[zone].disagioFisiologico = cellResults[2];
    }
  }

  if (Object.values(zoneOccurrences).some((count) => count !== 2)) {
    console.warn("ARPAL HTML structure may have changed", zoneOccurrences);
  }

  return result;
}

function extractMessage(html: string): { message: string; subtitle: string; timestamp: string } {
  const msgBarMatch = html.match(
    /<div[^>]*class="[^"]*al-msgbar[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/a>/i
  );

  let message = "";
  let subtitle = "";
  let timestamp = "";

  if (msgBarMatch) {
    const block = msgBarMatch[1];

    const tsMatch = block.match(/Messaggio del ([^<]+)/i);
    if (tsMatch) timestamp = tsMatch[1].trim();

    const h1Match = block.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) message = stripHtml(h1Match[1]);

    const h2Matches = [...block.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
    if (h2Matches.length > 1) {
      subtitle = stripHtml(h2Matches[1][1]);
    } else if (h2Matches.length === 1 && !h2Matches[0][1].includes("Messaggio")) {
      subtitle = stripHtml(h2Matches[0][1]);
    }
  }

  return { message, subtitle, timestamp };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function maxAlertLevel(
  left: ZoneAlert["level"] | null | undefined,
  right: ZoneAlert["level"] | null | undefined,
): ZoneAlert["level"] {
  const leftLevel = left ?? "sconosciuto";
  const rightLevel = right ?? "sconosciuto";
  return LEVEL_PRIORITY[leftLevel] >= LEVEL_PRIORITY[rightLevel] ? leftLevel : rightLevel;
}

function normalizeItalianDateLabel(label: string): string | null {
  const match = label.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return null;

  return `${match[3]}-${match[2]}-${match[1]}`;
}

function getTimeZoneParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function zonedTimeToUtc(dateIso: string, hour: number, timeZone: string): Date {
  const [year, month, day] = dateIso.split("-").map(Number);
  let guess = new Date(Date.UTC(year, month - 1, day, hour, 0, 0));

  for (let i = 0; i < 2; i++) {
    const parts = getTimeZoneParts(guess, timeZone);
    const observedUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    );
    const desiredUtc = Date.UTC(year, month - 1, day, hour, 0, 0);
    guess = new Date(guess.getTime() + (desiredUtc - observedUtc));
  }

  return guess;
}

function parseTableCellLevel(cellHtml: string): ZoneAlert["level"] | null {
  const classMatch = cellHtml.match(/class="([^"]*)"/i);
  const className = classMatch?.[1] ?? "";
  const text = stripHtml(cellHtml).toUpperCase();

  if (className.includes("allertaROSSA") || text === "R") return "rossa";
  if (className.includes("allertaARANCIONE") || text === "A") return "arancione";
  if (className.includes("allertaGIALLA") || text === "G") return "gialla";
  if (className.includes("allertaVERDE") || text === "V") return "verde";

  return null;
}

function extractTableLevels(tableHtml: string): Array<ZoneAlert["level"] | null> {
  const rowMatches = [...tableHtml.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)].slice(1);
  const result: Array<ZoneAlert["level"] | null> = Array.from({ length: 24 }, () => null);

  for (const rowMatch of rowMatches) {
    const cellMatches = [...rowMatch[1].matchAll(/<td\b[^>]*>[\s\S]*?<\/td>/gi)];
    const rowLevels = cellMatches.slice(1).map((cellMatch) => parseTableCellLevel(cellMatch[0]));

    rowLevels.forEach((level, index) => {
      if (!level) return;
      result[index] = maxAlertLevel(result[index], level);
    });
  }

  return result;
}

function extractZoneIntervals(html: string, zone: typeof ZONES[number]): ZoneInterval[] {
  const dayLabelMatches = [
    ...html.matchAll(
      new RegExp(
        `<a href="#(panel(?:Idro|Nivo)Day(?:One|Two)-${zone})">\\s*([^<]+?)\\s*<\\/a>`,
        "gi",
      ),
    ),
  ];

  const panelDates = new Map<string, string>();
  for (const match of dayLabelMatches) {
    const normalizedDate = normalizeItalianDateLabel(match[2]);
    if (normalizedDate) {
      panelDates.set(match[1], normalizedDate);
    }
  }

  const hourlyLevels = new Map<number, ZoneAlert["level"]>();

  for (const [panelId, dateIso] of panelDates.entries()) {
    const panelMatch = html.match(
      new RegExp(
        `<div class="content[^"]*" id="${escapeRegExp(panelId)}">([\\s\\S]*?)<\\/div>`,
        "i",
      ),
    );
    const tableMatch = panelMatch?.[1].match(/<table class="tableCrit responsive">([\s\S]*?)<\/table>/i);
    if (!tableMatch) continue;

    const levels = extractTableLevels(tableMatch[1]);
    levels.forEach((level, hour) => {
      if (!level) return;
      const slotStart = zonedTimeToUtc(dateIso, hour, ROME_TIME_ZONE).getTime();
      hourlyLevels.set(slotStart, maxAlertLevel(hourlyLevels.get(slotStart), level));
    });
  }

  const sortedSlots = [...hourlyLevels.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([startMs, level]) => ({
      startMs,
      endMs: startMs + 60 * 60 * 1000,
      level,
    }));

  const intervals: ZoneInterval[] = [];

  for (const slot of sortedSlots) {
    const lastInterval = intervals[intervals.length - 1];
    if (
      lastInterval &&
      lastInterval.level === slot.level &&
      new Date(lastInterval.endsAt).getTime() === slot.startMs
    ) {
      lastInterval.endsAt = new Date(slot.endMs).toISOString();
      continue;
    }

    intervals.push({
      level: slot.level,
      startsAt: new Date(slot.startMs).toISOString(),
      endsAt: new Date(slot.endMs).toISOString(),
    });
  }

  return intervals;
}

function summariseZoneIntervals(intervals: ZoneInterval[], now = new Date()) {
  const nowMs = now.getTime();
  const currentInterval = intervals.find((interval) => {
    const startsAtMs = new Date(interval.startsAt).getTime();
    const endsAtMs = new Date(interval.endsAt).getTime();
    return startsAtMs <= nowMs && nowMs < endsAtMs;
  }) ?? null;

  const currentLevel = currentInterval?.level ?? "sconosciuto";
  const nextInterval = intervals.find((interval) => {
    const startsAtMs = new Date(interval.startsAt).getTime();
    if (startsAtMs <= nowMs) return false;
    if (!currentInterval) return true;
    return interval.level !== currentInterval.level;
  }) ?? null;

  let activeUntil: string | null = null;
  if (currentInterval && currentInterval.level !== "verde") {
    const currentIndex = intervals.findIndex((interval) => interval === currentInterval);
    activeUntil = currentInterval.endsAt;

    for (let index = currentIndex + 1; index < intervals.length; index += 1) {
      const interval = intervals[index];
      if (interval.level === "verde") {
        activeUntil = interval.startsAt;
        break;
      }

      activeUntil = interval.endsAt;
    }
  }

  return {
    currentLevel,
    currentStartsAt: currentInterval?.startsAt ?? null,
    currentEndsAt: currentInterval?.endsAt ?? null,
    nextLevel: nextInterval?.level ?? null,
    nextStartsAt: nextInterval?.startsAt ?? null,
    nextEndsAt: nextInterval?.endsAt ?? null,
    activeUntil,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: getErrorHeaders(req),
      },
    );
  }

  try {
    if (edgeCache && Date.now() - edgeCache.at < EDGE_CACHE_MS) {
      return new Response(JSON.stringify(edgeCache.response), {
        headers: getSuccessHeaders(req),
      });
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(ARPAL_URL, {
        headers: {
          "Accept": "text/html,application/xhtml+xml",
          "User-Agent": "ellera-arpal-allerta/1.0",
        },
        signal: abortController.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error("ARPAL returned " + response.status);
    }

    const html = await response.text();

    const levels = extractAlertLevels(html);
    const phenomena = extractPhenomena(html);
    const msgData = extractMessage(html);
    const mapImageUrl = extractMapImageUrl(html);

    if (!hasUsableData(levels, phenomena, msgData)) {
      throw new Error("Unable to parse ARPAL alert data from current page");
    }

    const zones: Record<string, ZoneAlert> = {};
    for (const zone of ZONES) {
      const intervals = extractZoneIntervals(html, zone);
      const summary = summariseZoneIntervals(intervals);

      zones[zone] = {
        level: levels[zone],
        phenomena: phenomena[zone] ?? createEmptyPhenomena(),
        currentLevel: summary.currentLevel,
        currentStartsAt: summary.currentStartsAt,
        currentEndsAt: summary.currentEndsAt,
        nextLevel: summary.nextLevel,
        nextStartsAt: summary.nextStartsAt,
        nextEndsAt: summary.nextEndsAt,
        activeUntil: summary.activeUntil,
      };
    }

    const result: ArpalResponse = {
      success: true,
      data: {
        message: msgData.message,
        messageSubtitle: msgData.subtitle,
        timestamp: msgData.timestamp,
        zones,
        mapImageUrl,
      },
      cachedAt: new Date().toISOString(),
    };

    edgeCache = {
      response: result,
      at: Date.now(),
    };

    return new Response(JSON.stringify(result), {
      headers: getSuccessHeaders(req),
    });
  } catch (error) {
    console.error("Error fetching ARPAL:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch ARPAL data";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: getErrorHeaders(req),
      }
    );
  }
});
